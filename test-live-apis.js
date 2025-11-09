#!/usr/bin/env node

/**
 * Live Data API Integration Test Suite
 * Tests all 13 live data endpoints
 */

const baseURL = 'http://localhost:12345';

const tests = [
  {
    name: 'Live Quotes - AAPL, MSFT',
    url: `${baseURL}/api/live/quotes/AAPL,MSFT`,
    method: 'GET'
  },
  {
    name: 'Company News - Apple',
    url: `${baseURL}/api/live/news/AAPL?limit=5`,
    method: 'GET'
  },
  {
    name: 'General Market News',
    url: `${baseURL}/api/live/general-news?limit=10`,
    method: 'GET'
  },
  {
    name: 'Forex Data',
    url: `${baseURL}/api/live/forex`,
    method: 'GET'
  },
  {
    name: 'Crypto Data',
    url: `${baseURL}/api/live/crypto`,
    method: 'GET'
  },
  {
    name: 'Earnings Calendar',
    url: `${baseURL}/api/live/earnings/AAPL`,
    method: 'GET'
  },
  {
    name: 'Market Sentiment',
    url: `${baseURL}/api/live/sentiment/AAPL`,
    method: 'GET'
  },
  {
    name: 'Company Profile',
    url: `${baseURL}/api/live/profile/AAPL`,
    method: 'GET'
  },
  {
    name: 'Peer Companies',
    url: `${baseURL}/api/live/peers/AAPL`,
    method: 'GET'
  },
  {
    name: 'Insider Transactions',
    url: `${baseURL}/api/live/insider/AAPL`,
    method: 'GET'
  },
  {
    name: 'IPO Calendar',
    url: `${baseURL}/api/live/ipo`,
    method: 'GET'
  },
  {
    name: 'Economic Calendar',
    url: `${baseURL}/api/live/economic-calendar`,
    method: 'GET'
  },
  {
    name: 'Bulk Data Fetch',
    url: `${baseURL}/api/live/all-data`,
    method: 'POST',
    body: { symbols: ['AAPL', 'MSFT', 'GOOGL'] }
  }
];

let passed = 0;
let failed = 0;

async function runTests() {
  console.log('\n🧪 LIVE DATA API INTEGRATION TEST SUITE');
  console.log('=' .repeat(60));
  console.log(`Testing ${tests.length} endpoints...\n`);

  for (const test of tests) {
    try {
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (test.body) {
        options.body = JSON.stringify(test.body);
      }

      const response = await fetch(test.url, options);
      const data = await response.json();

      if (response.ok) {
        console.log(`✅ ${test.name}`);
        if (data.data) console.log(`   📊 ${data.count || Object.keys(data.data).length} results`);
        if (data.articles) console.log(`   📰 ${data.articles.length} articles`);
        if (data.events) console.log(`   📅 ${data.events.length} events`);
        passed++;
      } else {
        console.log(`❌ ${test.name}`);
        console.log(`   Error: ${data.error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(60) + '\n');

  if (failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Live data APIs are fully operational.');
  } else {
    console.log('⚠️  Some tests failed. Check API keys and server status.');
  }
}

console.log('🔍 Starting tests in 2 seconds...\n');
setTimeout(runTests, 2000);
