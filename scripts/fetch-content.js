#!/usr/bin/env node

// ============================================================================
// Follow Builders — Content Fetcher v2 (Improved)
// ============================================================================
// Improvements over v1:
// - Uses Rettiwt-API for X/Twitter (no login, no API key required)
// - Adds value scoring for each tweet (info density, originality, engagement)
// - Multi-category classification (Product, Tech, Industry, Funding)
// - Supports both global and Chinese builders
//
// Usage: node fetch-content.js [--lookback-hours 24]
// Output: JSON to stdout with scored and categorized content
// ============================================================================

import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { config as loadEnv } from 'dotenv';
import lockfile from 'proper-lockfile';

// -- Constants ---------------------------------------------------------------

const USER_DIR = join(homedir(), '.follow-builders');
const CONFIG_PATH = join(USER_DIR, 'config.json');
const STATE_PATH = join(USER_DIR, 'state.json');
const ENV_PATH = join(USER_DIR, '.env');

const DEFAULT_LOOKBACK_HOURS = 24;
const STATE_RETENTION_DAYS = 90;
const SUPADATA_BASE = 'https://api.supadata.ai/v1';

// Rettiwt API for X/Twitter (no auth required for public tweets)
const RETTIWT_BASE = 'https://api.rettiwt.tech/api/v1';

const REMOTE_SOURCES_URL = 'https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/config/default-sources.json';

// -- Category Keywords -------------------------------------------------------

const CATEGORY_KEYWORDS = {
  product: ['launch', 'release', 'ship', 'build', 'feature', 'update', 'beta', 'ga', '发布', '上线', '产品', '功能'],
  tech: ['model', 'training', 'inference', 'llm', 'transformer', 'rlhf', 'agent', 'paper', 'research', '算法', '模型', '训练'],
  industry: ['market', 'trend', 'analysis', 'prediction', 'future', 'strategy', 'industry', '市场', '趋势', '分析', '行业'],
  funding: ['fund', 'raise', 'series', 'valuation', 'invest', 'm&a', 'ipo', '融资', '投资', '估值', '并购']
};

// -- Config Loading ----------------------------------------------------------

async function loadConfig() {
  let defaultSources;
  try {
    const res = await fetch(REMOTE_SOURCES_URL);
    if (res.ok) {
      defaultSources = await res.json();
    } else {
      throw new Error(`GitHub returned ${res.status}`);
    }
  } catch (err) {
    const scriptDir = decodeURIComponent(new URL('.', import.meta.url).pathname);
    const defaultSourcesPath = join(scriptDir, '..', 'config', 'default-sources.json');
    defaultSources = JSON.parse(await readFile(defaultSourcesPath, 'utf-8'));
  }

  let userConfig = {};
  if (existsSync(CONFIG_PATH)) {
    userConfig = JSON.parse(await readFile(CONFIG_PATH, 'utf-8'));
  }

  const sources = userConfig.sources || {};
  const podcasts = [
    ...defaultSources.podcasts.filter(p => !(sources.removedPodcasts || []).includes(p.name)),
    ...(sources.addedPodcasts || [])
  ];
  const xAccounts = [
    ...defaultSources.x_accounts.filter(a => !(sources.removedXAccounts || []).includes(a.handle)),
    ...(sources.addedXAccounts || [])
  ];

  return {
    language: userConfig.language || 'zh',
    timezone: userConfig.timezone || 'Asia/Shanghai',
    frequency: userConfig.frequency || 'daily',
    podcasts,
    xAccounts
  };
}

// -- State Management --------------------------------------------------------

async function loadState() {
  if (!existsSync(STATE_PATH)) {
    return { processedVideos: {}, processedTweets: {}, lastUpdated: null };
  }
  return JSON.parse(await readFile(STATE_PATH, 'utf-8'));
}

async function saveState(state) {
  const cutoff = Date.now() - (STATE_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  for (const [id, timestamp] of Object.entries(state.processedVideos)) {
    if (timestamp < cutoff) delete state.processedVideos[id];
  }
  for (const [id, timestamp] of Object.entries(state.processedTweets)) {
    if (timestamp < cutoff) delete state.processedTweets[id];
  }
  state.lastUpdated = Date.now();
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2));
}

// -- Value Scoring -----------------------------------------------------------

function calculateTweetScore(tweet, account) {
  const score = {
    total: 0,
    infoDensity: 0,
    originality: 0,
    engagement: 0,
    categories: []
  };

  const text = tweet.text.toLowerCase();
  const textLen = tweet.text.length;

  // 1. Information Density (0-10)
  // - Longer tweets with substance score higher
  // - Keywords like "just", "lol", "haha" reduce score
  let infoDensity = 5;
  if (textLen > 200) infoDensity += 2;
  else if (textLen > 100) infoDensity += 1;
  if (textLen < 50) infoDensity -= 2;
  
  // Penalize low-effort content
  if (text.includes('lol') || text.includes('lmao') || text.includes('haha')) infoDensity -= 1;
  if (text.includes('great event') || text.includes('thanks for having')) infoDensity -= 2;
  if (tweet.isQuote) infoDensity += 1; // Quote tweets often add context
  
  score.infoDensity = Math.max(0, Math.min(10, infoDensity));

  // 2. Originality (0-10)
  // - Original tweets score higher than quotes/retweets
  // - Threads indicate deeper thinking
  let originality = 6;
  if (!tweet.isQuote && !tweet.quotedTweetId) originality += 2;
  if (tweet.isQuote) originality -= 1;
  if (text.includes('thread') || text.includes('🧵')) originality += 2;
  if (text.includes('announcement') || text.includes('launch') || text.includes('release')) originality += 1;
  
  score.originality = Math.max(0, Math.min(10, originality));

  // 3. Engagement Quality (0-10)
  // - High replies/likes ratio indicates discussion-worthy content
  // - Absolute numbers matter less than ratio
  let engagement = 5;
  const likeCount = tweet.likes || 0;
  const replyCount = tweet.replies || 0;
  const retweetCount = tweet.retweets || 0;
  
  if (likeCount > 1000) engagement += 2;
  else if (likeCount > 100) engagement += 1;
  
  // High reply ratio = controversial or thought-provoking
  const replyRatio = replyCount / Math.max(1, likeCount);
  if (replyRatio > 0.1) engagement += 2; // 10%+ replies = discussion
  else if (replyRatio > 0.05) engagement += 1;
  
  if (retweetCount > likeCount * 0.5) engagement += 1; // High RT ratio = shareable
  
  score.engagement = Math.max(0, Math.min(10, engagement));

  // 4. Category Classification
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matchCount = keywords.filter(kw => text.includes(kw.toLowerCase())).length;
    if (matchCount > 0) {
      score.categories.push({
        name: category,
        confidence: Math.min(1, matchCount / 3) // 3+ keywords = high confidence
      });
    }
  }

  // Calculate total score (weighted average)
  score.total = Math.round(
    (score.infoDensity * 0.4 + score.originality * 0.35 + score.engagement * 0.25) * 10
  ) / 10;

  return score;
}

// -- YouTube Fetching (Supadata API) -----------------------------------------

async function fetchYouTubeContent(podcasts, state, apiKey, isFirstRun, errors, lookbackHours) {
  const results = [];
  const videoCutoff = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);
  const allCandidates = [];

  for (const podcast of podcasts) {
    try {
      let videosUrl;
      if (podcast.type === 'youtube_playlist') {
        videosUrl = `${SUPADATA_BASE}/youtube/playlist/videos?id=${podcast.playlistId}`;
      } else {
        videosUrl = `${SUPADATA_BASE}/youtube/channel/videos?id=${pododcast.channelHandle}&type=video`;
      }

      const videosRes = await fetch(videosUrl, {
        headers: { 'x-api-key': apiKey }
      });

      if (!videosRes.ok) {
        errors.push(`Failed to fetch videos for ${podcast.name}: HTTP ${videosRes.status}`);
        continue;
      }

      const videosData = await videosRes.json();
      const videoIds = videosData.videoIds || videosData.video_ids || [];
      const newVideoIds = videoIds.filter(id => !state.processedVideos[id]);

      if (newVideoIds.length === 0) continue;

      for (const videoId of newVideoIds.slice(0, 3)) {
        try {
          const metaRes = await fetch(
            `${SUPADATA_BASE}/youtube/video?id=${videoId}`,
            { headers: { 'x-api-key': apiKey } }
          );
          let title = 'Untitled';
          let publishedAt = null;
          if (metaRes.ok) {
            const metaData = await metaRes.json();
            title = metaData.title || 'Untitled';
            publishedAt = metaData.uploadDate || metaData.publishedAt || metaData.date || null;
          }
          allCandidates.push({ podcast, videoId, title, publishedAt });
          await new Promise(r => setTimeout(r, 300));
        } catch (err) {
          errors.push(`Error fetching metadata for video ${videoId}: ${err.message}`);
        }
      }
    } catch (err) {
      errors.push(`Error processing podcast ${podcast.name}: ${err.message}`);
    }
  }

  let selectedVideos;
  if (isFirstRun) {
    const sorted = allCandidates
      .filter(v => v.publishedAt)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    results.firstRunCandidates = sorted.map(v => ({
      name: v.podcast.name,
      title: v.title,
      videoId: v.videoId,
      url: `https://youtube.com/watch?v=${v.videoId}`,
      publishedAt: v.publishedAt
    }));
    selectedVideos = [];
  } else {
    const byChannel = {};
    selectedVideos = [];
    for (const v of allCandidates) {
      if (v.publishedAt && new Date(v.publishedAt) < videoCutoff) continue;
      const key = v.podcast.name;
      byChannel[key] = (byChannel[key] || 0) + 1;
      if (byChannel[key] > 3) continue;
      selectedVideos.push(v);
    }
  }

  for (const video of selectedVideos) {
    try {
      const videoUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
      const transcriptRes = await fetch(
        `${SUPADATA_BASE}/youtube/transcript?url=${encodeURIComponent(videoUrl)}&text=true`,
        { headers: { 'x-api-key': apiKey } }
      );

      if (!transcriptRes.ok) {
        errors.push(`Failed to fetch transcript for video ${video.videoId}: HTTP ${transcriptRes.status}`);
        continue;
      }

      const transcriptData = await transcriptRes.json();

      results.push({
        source: 'podcast',
        name: video.podcast.name,
        title: video.title,
        videoId: video.videoId,
        url: `https://youtube.com/watch?v=${video.videoId}`,
        publishedAt: video.publishedAt,
        transcript: transcriptData.content || '',
        language: transcriptData.lang || 'en'
      });

      state.processedVideos[video.videoId] = Date.now();
      await new Promise(r => setTimeout(r, 500));
    } catch (err) {
      errors.push(`Error fetching transcript for video ${video.videoId}: ${err.message}`);
    }
  }

  for (const v of allCandidates) {
    if (!state.processedVideos[v.videoId]) {
      state.processedVideos[v.videoId] = Date.now();
    }
  }

  return results;
}

// -- X/Twitter Fetching (Rettiwt API - No Auth Required) ---------------------

async function fetchXContent(xAccounts, state, errors, lookbackHours) {
  const results = [];
  const cutoff = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

  // Rettiwt doesn't need auth for public tweets
  // We use the /search endpoint to get recent tweets from specific users
  for (const account of xAccounts) {
    try {
      // Search for tweets from this user in the lookback window
      const query = `from:${account.handle} -is:retweet -is:reply`;
      const searchUrl = `${RETTIWT_BASE}/search?query=${encodeURIComponent(query)}&count=10`;

      const res = await fetch(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; FollowBuilders/2.0)'
        }
      });

      if (!res.ok) {
        if (res.status === 429) {
          errors.push(`Rettiwt: Rate limited, skipping remaining accounts`);
          break;
        }
        // Rettiwt might be unavailable, fall back to listing account for agent to search
        errors.push(`Rettiwt: Failed to fetch @${account.handle}: HTTP ${res.status}`);
        continue;
      }

      const data = await res.json();
      const tweets = data.list || data.tweets || [];

      const newTweets = [];
      for (const t of tweets) {
        if (state.processedTweets[t.id]) continue;
        if (newTweets.length >= 3) break; // Max 3 tweets per builder

        const tweet = {
          id: t.id,
          text: t.fullText || t.text,
          createdAt: t.createdAt || t.created_at,
          url: `https://x.com/${account.handle}/status/${t.id}`,
          likes: t.favoriteCount || t.like_count || 0,
          retweets: t.retweetCount || t.retweet_count || 0,
          replies: t.replyCount || t.reply_count || 0,
          isQuote: t.isQuoteStatus || t.is_quote_status || false,
          quotedTweetId: t.quotedStatusId || t.quoted_status_id || null
        };

        // Calculate value score
        tweet.score = calculateTweetScore(tweet, account);

        newTweets.push(tweet);
        state.processedTweets[t.id] = Date.now();
      }

      if (newTweets.length === 0) continue;

      results.push({
        source: 'x',
        name: account.name,
        handle: account.handle,
        region: account.region || 'global',
        focus: account.focus || [],
        tweets: newTweets
      });

      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      errors.push(`Error fetching @${account.handle}: ${err.message}`);
      // Add account to fallback list for agent to search
      if (!results.find(r => r.handle === account.handle)) {
        results.push({
          source: 'x',
          name: account.name,
          handle: account.handle,
          region: account.region || 'global',
          focus: account.focus || [],
          tweets: [],
          fetchError: err.message
        });
      }
    }
  }

  return results;
}

// -- Main --------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const lookbackIdx = args.indexOf('--lookback-hours');
  const lookbackHours = lookbackIdx !== -1
    ? parseInt(args[lookbackIdx + 1], 10)
    : DEFAULT_LOOKBACK_HOURS;

  if (!existsSync(USER_DIR)) await mkdir(USER_DIR, { recursive: true });
  loadEnv({ path: ENV_PATH });

  const supadataKey = process.env.SUPADATA_API_KEY;

  const config = await loadConfig();

  let releaseLock;
  try {
    if (!existsSync(STATE_PATH)) {
      await writeFile(STATE_PATH, JSON.stringify({
        processedVideos: {},
        processedTweets: {},
        lastUpdated: null
      }, null, 2));
    }
    releaseLock = await lockfile.lock(STATE_PATH, { retries: 3, stale: 300000, update: 60000 });
  } catch (err) {
    console.log(JSON.stringify({
      error: 'STATE_LOCKED',
      message: 'Another fetch is already running. Try again in a few minutes.'
    }));
    process.exit(1);
  }

  try {
    const state = await loadState();
    const isFirstRun = !state.lastUpdated;
    const errors = [];

    // Fetch YouTube podcast content
    const podcastContent = supadataKey
      ? await fetchYouTubeContent(config.podcasts, state, supadataKey, isFirstRun, errors, lookbackHours)
      : [];

    // Fetch X/Twitter content using Rettiwt
    const xContent = await fetchXContent(config.xAccounts, state, errors, lookbackHours);

    await saveState(state);

    // Calculate summary stats
    const totalTweets = xContent.reduce((sum, a) => sum + a.tweets.length, 0);
    const avgScore = totalTweets > 0
      ? Math.round(
          xContent.reduce((sum, a) => sum + a.tweets.reduce((s, t) => s + (t.score?.total || 0), 0), 0) / totalTweets * 10
        ) / 10
      : 0;

    const output = {
      status: 'ok',
      fetchedAt: new Date().toISOString(),
      lookbackHours,
      isFirstRun,

      // Content with scores and categories
      podcasts: podcastContent,
      x: xContent,

      // Stats
      stats: {
        newPodcastEpisodes: podcastContent.length,
        xBuilders: xContent.length,
        totalTweets,
        avgTweetScore: avgScore,
        highValueTweets: xContent.reduce((sum, a) => 
          sum + a.tweets.filter(t => (t.score?.total || 0) >= 7).length, 0
        )
      },

      // First run candidates
      firstRunCandidates: podcastContent.firstRunCandidates || undefined,

      // Errors (non-fatal)
      errors: errors.length > 0 ? errors : undefined
    };

    console.log(JSON.stringify(output, null, 2));
  } finally {
    if (releaseLock) await releaseLock();
  }
}

main().catch(err => {
  console.error(JSON.stringify({
    error: 'FETCH_FAILED',
    message: err.message
  }));
  process.exit(1);
});
