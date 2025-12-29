const axios = require('axios');
const cheerio = require('cheerio');
const { getJson } = require('serpapi');

async function searchGoogle(query, limit = 2) {
  const SERP_API_KEY = process.env.SERPAPI_KEY;
  
  if (SERP_API_KEY) {
    return await searchWithSerpApi(query, limit, SERP_API_KEY);
  } else {
    return await searchWithScraping(query, limit);
  }
}

async function searchWithSerpApi(query, limit = 2, apiKey) {
  try {
    const response = await getJson({
      engine: "google",
      q: query,
      api_key: apiKey,
      num: 10
    });

    const results = [];
    
    if (response.organic_results) {
      for (const result of response.organic_results) {
        if (results.length >= limit) break;
        
        const url = result.link;
        const title = result.title;
        const description = result.snippet || '';
        
        if (url && title && isBlogOrArticle(url)) {
          results.push({
            title,
            url,
            description,
            rank: results.length + 1
          });
        }
      }
    }

    return results;

  } catch (error) {
    return await searchWithScraping(query, limit);
  }
}

async function searchWithScraping(query, limit = 2) {
  try {
    const response = await axios.get('https://www.google.com/search', {
      params: {
        q: query,
        num: 10,
        hl: 'en'
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    const $ = cheerio.load(response.data);
    const results = [];

    const searchSelectors = [
      'div.g',
      'div[data-sokoban-container]',
      'div.Gx5Zad',
      'div[jscontroller]'
    ];

    let foundElements = $();
    for (const selector of searchSelectors) {
      foundElements = $(selector);
      if (foundElements.length > 0) {
        break;
      }
    }

    foundElements.each((i, elem) => {
      if (results.length >= limit) return false;

      const linkElem = $(elem).find('a[href]').first();
      let url = linkElem.attr('href');
      
      if (url && url.startsWith('/url?q=')) {
        const urlMatch = url.match(/\/url\?q=([^&]+)/);
        url = urlMatch ? decodeURIComponent(urlMatch[1]) : url;
      }

      const titleElem = $(elem).find('h3, h2, h1').first();
      const title = titleElem.text().trim();
      
      const descSelectors = ['.VwiC3b', '.lyLwlc', '.s', 'span', 'div.VwiC3b'];
      let description = '';
      for (const descSel of descSelectors) {
        description = $(elem).find(descSel).first().text().trim();
        if (description.length > 20) break;
      }

      if (url && title && url.startsWith('http') && isBlogOrArticle(url)) {
        results.push({
          title,
          url,
          description,
          rank: results.length + 1
        });
      }
    });

    return results;

  } catch (error) {
    return [];
  }
}

function isBlogOrArticle(url) {
  const excludeDomains = [
    'youtube.com',
    'facebook.com',
    'twitter.com',
    'linkedin.com',
    'instagram.com',
    'pinterest.com',
    'google.com',
    'wikipedia.org'
  ];

  const blogKeywords = [
    '/blog',
    '/article',
    '/post',
    '/news',
    '/guide',
    '/tutorial',
    '/story'
  ];

  const urlLower = url.toLowerCase();
  
  if (excludeDomains.some(domain => urlLower.includes(domain))) {
    return false;
  }

  return blogKeywords.some(keyword => urlLower.includes(keyword)) || 
       (!urlLower.includes('/video') && !urlLower.includes('/watch'));
}

module.exports = { searchGoogle }