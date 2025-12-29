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
      description: description.substring(0, 500),
      tags
    };
  } catch (error) {
    return null;
  }
}

async function scrapeBlogPage(pageUrl) {
  try {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);
    
    const articles = [];
    
    $('h2.entry-title a, h3.entry-title a, article h2 a, .post-title a').each((i, elem) => {
      const articleUrl = $(elem).attr('href');
      if (articleUrl && articleUrl.includes('/blogs/') && !articleUrl.includes('/page/')) {
        articles.push(articleUrl);
      }
    });
    
    return [...new Set(articles)];
  } catch (error) {
    return [];
  }
}

async function scrapeOldestArticles() {
  console.log('Starting to scrape oldest articles from BeyondChats blog...\n');
  
  try {
    const page15Articles = await scrapeBlogPage('https://beyondchats.com/blogs/page/15/');
    const page14Articles = await scrapeBlogPage('https://beyondchats.com/blogs/page/14/');
    
    const allArticleUrls = [...page15Articles, ...page14Articles];
    const uniqueUrls = [...new Set(allArticleUrls)].slice(0, 5);
    
    console.log(`Found ${uniqueUrls.length} article URLs to scrape`);
    
    const scrapedArticles = [];
    
    for (const url of uniqueUrls) {
      const articleData = await scrapeArticle(url);
      
      if (articleData && articleData.title) {
        try {
          const existingArticle = await Article.findOne({ url: articleData.url });
          
          if (!existingArticle) {
            const article = new Article(articleData);
            await article.save();
            scrapedArticles.push(article);
            console.log(`Saved: ${articleData.title}`);
          }
        } catch (error) {
          console.error(`Error saving article: ${error.message}`);
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\\nSuccessfully scraped and saved ${scrapedArticles.length} new articles!`);
    process.exit(0);
  } catch (error) {
    console.error('Error during scraping:', error);
    process.exit(1);
  }
}