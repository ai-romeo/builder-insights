#!/usr/bin/env node

// ============================================================================
// Follow Builders — Prepare Digest v2 (with Scoring & Categories)
// ============================================================================
// Enhanced version with:
// - Value scoring display (high-value tweets highlighted)
// - Category-based organization (Product, Tech, Industry, Funding)
// - Region filtering (global vs china builders)
//
// Usage: node prepare-digest.js
// Output: JSON to stdout
// ============================================================================

import { readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// -- Constants ---------------------------------------------------------------

const USER_DIR = join(homedir(), '.follow-builders');
const CONFIG_PATH = join(USER_DIR, 'config.json');

const FEED_X_URL = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json';
const FEED_PODCASTS_URL = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json';

const PROMPTS_BASE = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/prompts';
const PROMPT_FILES = [
  'summarize-podcast.md',
  'summarize-tweets.md',
  'digest-intro.md',
  'translate.md'
];

// -- Fetch helpers -----------------------------------------------------------

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.json();
}

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}

// -- Main --------------------------------------------------------------------

async function main() {
  const errors = [];

  // 1. Read user config
  let config = {
    language: 'zh',
    frequency: 'daily',
    delivery: { method: 'stdout' },
    contentPreferences: {
      includePodcasts: false,
      includeX: true,
      xBuilderCount: 20,
      minTweetScore: 0,
      regionFilter: 'all' // 'all', 'global', 'china'
    }
  };
  if (existsSync(CONFIG_PATH)) {
    try {
      config = JSON.parse(await readFile(CONFIG_PATH, 'utf-8'));
    } catch (err) {
      errors.push(`Could not read config: ${err.message}`);
    }
  }

  // 2. Fetch both feeds
  const [feedX, feedPodcasts] = await Promise.all([
    fetchJSON(FEED_X_URL),
    fetchJSON(FEED_PODCASTS_URL)
  ]);

  if (!feedX) errors.push('Could not fetch tweet feed');
  if (!feedPodcasts) errors.push('Could not fetch podcast feed');

  // 3. Load prompts
  const prompts = {};
  const scriptDir = decodeURIComponent(new URL('.', import.meta.url).pathname);
  const localPromptsDir = join(scriptDir, '..', 'prompts');
  const userPromptsDir = join(USER_DIR, 'prompts');

  for (const filename of PROMPT_FILES) {
    const key = filename.replace('.md', '').replace(/-/g, '_');
    const userPath = join(userPromptsDir, filename);
    const localPath = join(localPromptsDir, filename);

    if (existsSync(userPath)) {
      prompts[key] = await readFile(userPath, 'utf-8');
      continue;
    }

    const remote = await fetchText(`${PROMPTS_BASE}/${filename}`);
    if (remote) {
      prompts[key] = remote;
      continue;
    }

    if (existsSync(localPath)) {
      prompts[key] = await readFile(localPath, 'utf-8');
    } else {
      errors.push(`Could not load prompt: ${filename}`);
    }
  }

  // 4. Process and filter content
  let xContent = feedX?.x || [];
  
  // Apply region filter
  const regionFilter = config.contentPreferences?.regionFilter || 'all';
  if (regionFilter !== 'all') {
    xContent = xContent.filter(builder => builder.region === regionFilter);
  }

  // Apply minimum score filter
  const minScore = config.contentPreferences?.minTweetScore || 0;
  xContent = xContent.map(builder => ({
    ...builder,
    tweets: builder.tweets.filter(t => (t.score?.total || 0) >= minScore)
  })).filter(builder => builder.tweets.length > 0);

  // Sort builders by average tweet score (highest first)
  xContent.sort((a, b) => {
    const avgA = a.tweets.reduce((s, t) => s + (t.score?.total || 0), 0) / a.tweets.length;
    const avgB = b.tweets.reduce((s, t) => s + (t.score?.total || 0), 0) / b.tweets.length;
    return avgB - avgA;
  });

  // Limit builder count
  const maxBuilders = config.contentPreferences?.xBuilderCount || 20;
  xContent = xContent.slice(0, maxBuilders);

  // 5. Build the output
  const output = {
    status: 'ok',
    generatedAt: new Date().toISOString(),

    // User preferences
    config: {
      language: config.language || 'zh',
      frequency: config.frequency || 'daily',
      delivery: config.delivery || { method: 'stdout' },
      contentPreferences: config.contentPreferences
    },

    // Filtered and scored content
    podcasts: (config.contentPreferences?.includePodcasts !== false) ? (feedPodcasts?.podcasts || []) : [],
    x: xContent,

    // Enhanced stats
    stats: {
      podcastEpisodes: feedPodcasts?.podcasts?.length || 0,
      xBuilders: xContent.length,
      totalTweets: xContent.reduce((sum, a) => sum + a.tweets.length, 0),
      highValueTweets: xContent.reduce((sum, a) => 
        sum + a.tweets.filter(t => (t.score?.total || 0) >= 7).length, 0
      ),
      avgTweetScore: xContent.length > 0
        ? Math.round(
            xContent.reduce((sum, a) => sum + a.tweets.reduce((s, t) => s + (t.score?.total || 0), 0), 0) /
            xContent.reduce((sum, a) => sum + a.tweets.length, 0) * 10
          ) / 10
        : 0,
      feedGeneratedAt: feedX?.generatedAt || feedPodcasts?.generatedAt || null
    },

    // Prompts
    prompts,

    // Non-fatal errors
    errors: errors.length > 0 ? errors : undefined
  };

  console.log(JSON.stringify(output, null, 2));
}

main().catch(err => {
  console.error(JSON.stringify({
    status: 'error',
    message: err.message
  }));
  process.exit(1);
});
