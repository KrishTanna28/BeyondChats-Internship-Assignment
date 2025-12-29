const { searchGoogle } = require('./utils/googleSearchScraper');
const { scrapeArticle } = require('./utils/articleContentScraper');
const { initializeGemini, optimizeArticle, formatWithReferences } = require('./utils/articleOptimizer');
require('dotenv').config();

/**
 * Debug script to test each component individually
 */

async function testComponents() {
  console.log('🔧 Testing Article Optimizer Components\n');

  // Test 1: Google Search
  console.log('=' .repeat(60));
  console.log('Test 1: Google Search Scraper');
  console.log('='.repeat(60));
  try {
    const query = 'chatbots guide 2023';
    console.log(`Searching for: "${query}"`);
    
    const results = await searchGoogle(query, 2);
    console.log(`✓ Found ${results.length} results:`);
    results.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.title}`);
      console.log(`     ${r.url}\n`);
    });
  } catch (error) {
    console.error(`✗ Google Search failed: ${error.message}\n`);
  }

  // Test 2: Content Scraping
  console.log('\n' + '='.repeat(60));
  console.log('Test 2: Article Content Scraper');
  console.log('='.repeat(60));
  try {
    const testUrl = 'https://www.ibm.com/topics/chatbots';
    console.log(`Scraping: ${testUrl}`);
    
    const content = await scrapeArticle(testUrl);
    if (content) {
      console.log(`✓ Success!`);
      console.log(`  Title: ${content.title}`);
      console.log(`  Content length: ${content.content.length} chars`);
      console.log(`  Headings: ${content.headings.length}\n`);
    } else {
      console.log(`✗ Failed to scrape content\n`);
    }
  } catch (error) {
    console.error(`✗ Content scraping failed: ${error.message}\n`);
  }

  // Test 3: Gemini API
  console.log('\n' + '='.repeat(60));
  console.log('Test 3: Gemini AI Connection');
  console.log('='.repeat(60));
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not found in .env');
    }
    console.log(`✓ API Key found: ${apiKey.substring(0, 10)}...`);
    
    initializeGemini(apiKey);
    console.log(`✓ Gemini optimizer initialized\n`);
    
    // Simple test
    const testArticle = {
      title: 'Test Article',
      description: 'This is a short test article about chatbots.',
      url: 'https://test.com'
    };
    
    const testRefs = [{
      title: 'Reference Article',
      url: 'https://example.com',
      content: 'Chatbots are AI-powered tools that help businesses automate customer service.',
      headings: ['Introduction', 'Benefits']
    }];
    
    console.log('Testing Gemini API call...');
    const result = await optimizeArticle(testArticle, testRefs);
    console.log(`✓ Gemini API works!`);
    console.log(`  Generated title: ${result.title}`);
    console.log(`  Content length: ${result.content.length} chars\n`);
    
  } catch (error) {
    console.error(`✗ Gemini API failed: ${error.message}`);
    if (error.response) {
      console.error(`  API Response: ${JSON.stringify(error.response.data)}`);
    }
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('Debug test complete!');
  console.log('='.repeat(60));
}

testComponents().catch(console.error);
