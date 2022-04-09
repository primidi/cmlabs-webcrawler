const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');


/**
 * Main Function
 * @param {string} url - url of the site that want to be crawled 
 * @returns {JSON} - the JSON expected result
 */
async function main(url) {
  let result;
  if (url.includes('ssr')) {
    result = await ssrCrawl(url);
  } else if (url.includes('csr')) {
    result = await csrCrawl(url);
  }

  if (result === undefined) {
    throw new Error('URL is not valid!');
  }
  
  return result;
}

async function ssrCrawl(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  let items = $('a');

  const result = [];

  items.each((index, element) => {
    const item = { url: '', title: '' };
    const url = $(element).attr('href'); 
    const title = $(element).text(); 

    if (title.includes('\n')) {
      const properTitle = title.replace(/[\n\s]/g, '');
      item.title = properTitle;
    } else {
      item.title = title;
    }

    item.url = url;
    result.push(item);
  });

  return result;
}

async function csrCrawl(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  let finalResult = new Promise((resolve, reject) => {
    setTimeout(async () => {
      let result = []
      const urls = await page.evaluate(
        () => Array.from(
          document.querySelectorAll('a[href]'),
          a => a.getAttribute('href')
        )
      );
    
      const titles = await page.evaluate(
        () => Array.from(
          document.querySelectorAll('a[href]'),
          a => a.textContent
        )
      );
  
      const elements = [urls, titles];
      
      let i = 0;
      while (i < urls.length && i < titles.length) {
        let item = { url: '', title: '' };
        item.url = elements[0][i];
        item.title = elements[1][i];
        result.push(item);
        i++;
      };
      resolve(result);
      await browser.close();
    }, 5000);
  });
  return finalResult;
}

module.exports = main;
