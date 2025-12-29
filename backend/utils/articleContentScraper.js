const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const TIMEOUT = 10000;

/**
 * Scrape content from a URL
 * @param {string} url - Article URL
 * @returns {Promise<Object>} Scraped content
 */
async function scrapeArticle(url) {
  try {
    console.log(`📄 Scraping content from: ${url}`);
    
    // Try static scraping first (faster)
    let content = await scrapeStatic(url);
    
    // If static fails, try dynamic scraping with Puppeteer
    if (!content || content.content.length < 100) {
      console.log('  ↻ Trying dynamic scraping...');
      content = await scrapeDynamic(url);
    }

      if (content && content.content.length > 0) {
        console.log(`  ✓ Scraped ${content.content.length} characters`);
        return content;
      }

      throw new Error('Could not extract meaningful content');

    } catch (error) {
      console.error(`  ✗ Error scraping ${url}:`, error.message);
      return null;
    }
}

/**
 * Static scraping using axios + cheerio (fast)
 */
async function scrapeStatic(url) {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: TIMEOUT
    });

    const $ = cheerio.load(response.data);

    // Remove unwanted elements
    $('script, style, nav, header, footer, .ad, .advertisement, .sidebar, .comments').remove();

    // Try multiple selectors for main content
    const contentSelectors = [
      'article',
      '.article-content',
      '.post-content',
      '.entry-content',
      '.content',
      'main',
      '[role="main"]',
      '.blog-post',
      '.post-body'
    ];

    let content = '';
    let title = $('h1').first().text().trim() || $('title').text().trim();

    for (const selector of contentSelectors) {
      const elem = $(selector).first();
      if (elem.length) {
        content = elem.text().trim();
        if (content.length > 200) break;
      }
    }

    // If no content found, get all paragraphs
    if (content.length < 200) {
      content = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');
    }

    return {
      url,
      title,
      content: cleanContent(content),
      headings: extractHeadings($),
      length: content.length
    };
}

/**
 * Dynamic scraping using Puppeteer (for JavaScript-heavy sites)
 */
async function scrapeDynamic(url) {
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
    const page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
      await page.goto(url, { waitUntil: 'networkidle2', timeout: TIMEOUT });

      const data = await page.evaluate(() => {
        // Remove unwanted elements
        const removeSelectors = ['script', 'style', 'nav', 'header', 'footer', '.ad', '.advertisement'];
        removeSelectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => el.remove());
        });

        const title = document.querySelector('h1')?.innerText || document.title;
        
        // Try to find main content
        const article = document.querySelector('article, .article-content, .post-content, .entry-content, main');
        const content = article?.innerText || document.body.innerText;
        
        // Extract headings
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim());

        return { title, content, headings };
      });

      return {
        url,
        ...data,
        content: cleanContent(data.content),
        length: data.content.length
      };

    } finally {
      await browser.close();
    }
}

/**
 * Clean and normalize content
 */
function cleanContent(content) {
    return content
    .replace(/\s+/g, ' ') // Multiple spaces to single
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double
      .trim()
      .substring(0, 5000); // Limit to 5000 chars for LLM input
}

/**
 * Extract headings from page
 */
function extractHeadings($) {
    const headings = [];
    $('h1, h2, h3, h4').each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 3) {
        headings.push(text);
      }
    });
    return headings;
}

module.exports = { scrapeArticle };
