const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

const TIMEOUT = 10000;

async function scrapeArticle(url) {
  try {
    let content = await scrapeStatic(url);
    
    if (!content || content.content.length < 100) {
      content = await scrapeDynamic(url);
    }

    if (content && content.content.length > 0) {
      return content;
    }

    throw new Error('Could not extract meaningful content');

  } catch (error) {
    return null;
  }
}

async function scrapeStatic(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    },
    timeout: TIMEOUT
  });

  const $ = cheerio.load(response.data);

  $('script, style, nav, header, footer, .ad, .advertisement, .sidebar, .comments').remove();

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
      const removeSelectors = ['script', 'style', 'nav', 'header', 'footer', '.ad', '.advertisement'];
      removeSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
      });

      const title = document.querySelector('h1')?.innerText || document.title;
      
      const article = document.querySelector('article, .article-content, .post-content, .entry-content, main');
      const content = article?.innerText || document.body.innerText;
      
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

function cleanContent(content) {
  return content
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
    .substring(0, 5000);
}

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
