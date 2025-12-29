const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('./models/Article');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to database
connectDB();

async function scrapeArticle(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Extract article details from the individual article page
    const title = $('h1.entry-title').first().text().trim() || 
                  $('h1').first().text().trim();
    
    const author = $('.entry-author a').first().text().trim() || 
                   $('a[rel="author"]').first().text().trim() || 
                   'Unknown';
    
    const dateText = $('.entry-date').first().text().trim() || 
                     $('time').first().text().trim() || 
                     '';
    
    const description = $('meta[property="og:description"]').attr('content') || 
                       $('meta[name="description"]').attr('content') || 
                       $('.entry-content p').first().text().trim() || 
                       '';
    
    // Extract tags
    const tags = [];
    $('.entry-tags a, .post-tags a, a[rel="tag"]').each((i, elem) => {
      const tag = $(elem).text().trim();
      if (tag) tags.push(tag);
    });
    
    return {
      title,
      author,
      date: dateText,
      url,
      description: description.substring(0, 500), // Limit description length
      tags
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return null;
  }
}

async function scrapeBlogPage(pageUrl) {
  try {
    console.log(`Scraping page: ${pageUrl}`);
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);
    
    const articles = [];
    
    // Find all article links on the page
    $('h2.entry-title a, h3.entry-title a, article h2 a, .post-title a').each((i, elem) => {
      const articleUrl = $(elem).attr('href');
      if (articleUrl && articleUrl.includes('/blogs/') && !articleUrl.includes('/page/')) {
        articles.push(articleUrl);
      }
    });
    
    return [...new Set(articles)]; // Remove duplicates
  } catch (error) {
    console.error(`Error scraping page ${pageUrl}:`, error.message);
    return [];
  }
}

async function scrapeOldestArticles() {
  console.log('Starting to scrape oldest articles from BeyondChats blog...\n');
  
  try {
    // Get articles from last pages (14 and 15)
    const page15Articles = await scrapeBlogPage('https://beyondchats.com/blogs/page/15/');
    const page14Articles = await scrapeBlogPage('https://beyondchats.com/blogs/page/14/');
    
    // Combine and get unique URLs
    const allArticleUrls = [...page15Articles, ...page14Articles];
    const uniqueUrls = [...new Set(allArticleUrls)].slice(0, 5); // Get first 5 unique
    
    console.log(`Found ${uniqueUrls.length} article URLs to scrape\n`);
    
    const scrapedArticles = [];
    
    for (const url of uniqueUrls) {
      console.log(`Scraping: ${url}`);
      const articleData = await scrapeArticle(url);
      
      if (articleData && articleData.title) {
        try {
          // Check if article already exists
          const existingArticle = await Article.findOne({ url: articleData.url });
          
          if (existingArticle) {
            console.log(`  ✓ Article already exists: ${articleData.title}`);
          } else {
            const article = new Article(articleData);
            await article.save();
            scrapedArticles.push(article);
            console.log(`  ✓ Saved: ${articleData.title}`);
          }
        } catch (error) {
          console.error(`  ✗ Error saving article: ${error.message}`);
        }
      }
      
      // Add delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n✓ Successfully scraped and saved ${scrapedArticles.length} new articles!`);
    process.exit(0);
  } catch (error) {
    console.error('Error during scraping:', error);
    process.exit(1);
  }
}

// Run the scraper
scrapeOldestArticles();
