const axios = require('axios');
const { searchGoogle } = require('./utils/googleSearchScraper');
const { scrapeArticle } = require('./utils/articleContentScraper');
const { initializeGemini, optimizeArticle, formatWithReferences } = require('./utils/articleOptimizer');
require('dotenv').config();

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/articles';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

// Initialize Gemini
initializeGemini(GEMINI_API_KEY);

/**
 * Fetch all articles from the API
 */
async function fetchArticles() {
    try {
      console.log('📥 Fetching articles from API...');
      const response = await axios.get(API_BASE_URL);
      
      if (response.data.success && response.data.data.length > 0) {
        console.log(`✓ Found ${response.data.count} articles\n`);
        return response.data.data;
      }
      
      throw new Error('No articles found');
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      throw error;
    }
}

/**
 * Process a single article
 */
async function processArticle(article) {
    console.log('='.repeat(70));
    console.log(`📰 Processing: ${article.title}`);
    console.log('='.repeat(70));

    try {
      // Step 1: Search Google for article title
      console.log(`\n🔍 Searching for: "${article.title}"`);
      const searchResults = await searchGoogle(article.title, 2);
      
      if (searchResults.length === 0) {
        console.log('⚠ No search results found, skipping this article');
        console.log('   (This might be due to Google blocking or no relevant results)\n');
        return null;
      }

      console.log(`\nFound ${searchResults.length} reference articles:`);
      searchResults.forEach((result, idx) => {
        console.log(`  ${idx + 1}. ${result.title}`);
        console.log(`     ${result.url}`);
      });

      // Step 2: Scrape content from reference articles
      console.log('\n📚 Scraping reference articles...');
      const referenceArticles = [];
      
      for (const result of searchResults) {
        const content = await scrapeArticle(result.url);
        if (content) {
          referenceArticles.push(content);
        }
        // Add delay to be respectful
        await delay(2000);
      }

      if (referenceArticles.length === 0) {
        console.log('⚠ Could not scrape any reference articles');
        console.log('   (Sites may be blocking scrapers or dynamic content)\n');
        return null;
      }

      console.log(`✓ Successfully scraped ${referenceArticles.length} reference articles`);

      // Step 3: Optimize with Gemini AI
      const optimizedContent = await optimizeArticle(article, referenceArticles);

      // Step 4: Format with references
      const finalContent = formatWithReferences(
        optimizedContent.content,
        optimizedContent.references
      );

      // Step 5: Update article via API
      console.log('\n📤 Publishing optimized article...');
      const updatedArticle = await publishOptimizedArticle(article._id, {
        title: optimizedContent.title,
        description: finalContent,
        tags: [...(article.tags || []), 'optimized', 'ai-enhanced']
      });

      console.log('✓ Article successfully optimized and published!');
      console.log(`  New title: ${updatedArticle.title}`);
      console.log(`  Content length: ${finalContent.length} characters`);
      console.log(`  References: ${optimizedContent.references.length}`);
      
      return updatedArticle;

    } catch (error) {
      console.error(`\n✗ Error processing article: ${error.message}`);
      if (error.stack) {
        console.error('   Stack trace:', error.stack.split('\n').slice(0, 3).join('\n'));
      }
      console.log('');
      return null;
    }
}

/**
 * Publish optimized article using CRUD API
 */
async function publishOptimizedArticle(articleId, updates) {
    try {
      const response = await axios.put(`${API_BASE_URL}/${articleId}`, updates);
      
      if (response.data.success) {
        return response.data.data;
      }
      
      throw new Error('Failed to update article');
    } catch (error) {
      console.error('Error publishing article:', error.message);
      throw error;
    }
}

/**
 * Run the optimizer for all articles
 */
async function run(articleIndex = null) {
    try {
      const articles = await fetchArticles();
      
      // Process specific article or all articles
      if (articleIndex !== null && articleIndex >= 0 && articleIndex < articles.length) {
        await processArticle(articles[articleIndex]);
      } else {
        console.log('Processing all articles...\n');
        const results = {
          total: articles.length,
          successful: 0,
          failed: 0
        };

        for (let i = 0; i < articles.length; i++) {
          const result = await processArticle(articles[i]);
          if (result) {
            results.successful++;
          } else {
            results.failed++;
          }
          
          // Delay between articles
          if (i < articles.length - 1) {
            console.log('\n⏳ Waiting before processing next article...\n');
            await delay(5000);
          }
        }

        console.log('\n' + '='.repeat(70));
        console.log('📊 Summary:');
        console.log(`  Total articles: ${results.total}`);
        console.log(`  Successfully optimized: ${results.successful}`);
        console.log(`  Failed: ${results.failed}`);
        console.log('='.repeat(70));
      }

      console.log('\n✅ Article optimization complete!\n');

    } catch (error) {
      console.error('\n❌ Fatal error:', error.message);
      process.exit(1);
    }
}

/**
 * Helper: Add delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the script
const articleIndex = process.argv[2] ? parseInt(process.argv[2]) : null;
run(articleIndex);
