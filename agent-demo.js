const fetch = require('node-fetch');

const API_KEY = 'YOUR_AGENT_API_KEY'; // Replace with your real key
const BASE_URL = 'https://yourdomain.com/api'; // Replace with your API base URL

async function fetchAnalyticsOverview() {
  const res = await fetch(`${BASE_URL}/analytics/overview`, {
    headers: { 'x-api-key': API_KEY }
  });
  const data = await res.json();
  console.log('Analytics Overview:', data);
}

async function fetchGrowth() {
  const res = await fetch(`${BASE_URL}/analytics/growth`, {
    headers: { 'x-api-key': API_KEY }
  });
  const data = await res.json();
  console.log('Growth Analytics:', data);
}

async function fetchTopPosts() {
  const res = await fetch(`${BASE_URL}/analytics/top-posts`, {
    headers: { 'x-api-key': API_KEY }
  });
  const data = await res.json();
  console.log('Top Posts:', data);
}

async function fetchPlatformBreakdown() {
  const res = await fetch(`${BASE_URL}/analytics/platform-breakdown`, {
    headers: { 'x-api-key': API_KEY }
  });
  const data = await res.json();
  console.log('Platform Breakdown:', data);
}

async function createPost() {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contentText: 'Hello from my agent!',
      platforms: ['twitter'],
      status: 'DRAFT'
    })
  });
  const data = await res.json();
  console.log('Created Post:', data);
}

async function fetchPosts() {
  const res = await fetch(`${BASE_URL}/posts`, {
    headers: { 'x-api-key': API_KEY }
  });
  const data = await res.json();
  console.log('Posts:', data);
}

// Run all actions
(async () => {
  await fetchAnalyticsOverview();
  await fetchGrowth();
  await fetchTopPosts();
  await fetchPlatformBreakdown();
  await createPost();
  await fetchPosts();
})(); 