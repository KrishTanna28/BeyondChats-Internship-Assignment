const axios = require('axios');
const { searchGoogle } = require('./utils/googleSearchScraper');
const { scrapeArticle } = require('./utils/articleContentScraper');
const { initializeGemini, optimizeArticle, formatWithReferences } = require('./utils/articleOptimizer');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api/articles';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY not found in .env file');
  process.exit(1);
}

initializeGemini(GEMINI_API_KEY);

async function fetchArticles() {
  try {
    const response = await axios.get(API_BASE_URL);
    
    if (response.data.success && response.data.data.length > 0) {
      return response.data.data;
    }
    
    throw new Error('No articles found');
  } catch (error) {
    throw error;
  }
}

async function processArticle(article) {
  try {
    const searchResults = await searchGoogle(article.title, 2);
    
    if (searchResults.length === 0) {
      return null;
    }

    const referenceArticles = [];
    
    for (const result of searchResults) {
      const content = await scrapeArticle(result.url);
      if (content) {
        referenceArticles.push(content);
      }
      await delay(2000);
    }

    if (referenceArticles.length === 0) {
      return null;
    }

    const optimizedContent = await optimizeArticle(article, referenceArticles);

    const finalContent = formatWithReferences(
      optimizedContent.content,
      optimizedContent.references
    );

    const updatedArticle = await publishOptimizedArticle(article._id, {
      title: optimizedContent.title,
      description: finalContent,
      original_description: article.description,
      tags: [...(article.tags || []), 'optimized', 'ai-enhanced']
    });
    
    return updatedArticle;

  } catch (error) {
    return null;
  }
}

async function publishOptimizedArticle(articleId, updates) {
  try {
    const response = await axios.put(`${API_BASE_URL}/${articleId}`, updates);
    return response.data.data;
  } catch (error) {
    throw error;
  }
}

async function run(articleIndex = null) {
  try {
    const articles = await fetchArticles();
    
    if (articleIndex !== null && articleIndex >= 0 && articleIndex < articles.length) {
      await processArticle(articles[articleIndex]);
    } else {
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
        
        if (i < articles.length - 1) {
          await delay(5000);
        }
      }

      console.log('\nOptimization Complete');
      console.log(`Total: ${results.total} | Success: ${results.successful} | Failed: ${results.failed}`);
    }

  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const articleIndex = process.argv[2] ? parseInt(process.argv[2]) : null;
run(articleIndex);
