import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';

let browser;

export const initBrowser = async () => {
    browser = await puppeteer.launch({
        headless: 'new',
        defaultViewport: null,
        ignoreDefaultArgs: ['--enable-automation'],
        args: ['--incognito',],
    });
};

export const closeBrowser = async () => {
    if (browser) await browser.close();
};

export const analyzePerformance = async (url, detectedTechs) => {
    let context = null;
    try {
        // Using a new incognito browser context for each analysis
        context = await browser.createBrowserContext();
        const page = await context.newPage();

        const options = {
            onlyCategories: ['performance'],
            flags: { emulatedFormFactor: 'mobile' }
        };
        const { lhr } = await lighthouse(url, options, undefined, page);

        if (lhr.categories.performance.score === null) {
            throw new Error('Score NULL')
        }
        detectedTechs.score = parseInt((lhr.categories.performance.score) * 100);
        detectedTechs.lcp = parseInt(lhr.audits['largest-contentful-paint'].numericValue);
        detectedTechs.tti = parseInt(lhr.audits['interactive'].numericValue);
        detectedTechs.speedIndex = parseInt(lhr.audits['speed-index'].numericValue);
        detectedTechs.minimizeMainThreadWork = parseInt(lhr.audits['mainthread-work-breakdown'].numericValue);
        detectedTechs.eliminateRenderBlockingResources = parseInt(lhr.audits['render-blocking-resources'].numericValue);
        if (lhr.audits['third-party-summary'].score !== null) {
            detectedTechs.minimizeThirdPartyResourcesMs = parseInt(lhr.audits['third-party-summary'].details.summary.wastedMs);
            detectedTechs.minimizeThirdPartyResourcesBytes = parseInt(lhr.audits['third-party-summary'].details.summary.wastedBytes);
        }
        detectedTechs.efficientlyEncodeImages = parseInt(lhr.audits['uses-optimized-images'].numericValue);
        detectedTechs.serveNextGenImages = parseInt(lhr.audits['modern-image-formats'].numericValue);
        detectedTechs.properlySizeImages = parseInt(lhr.audits['uses-responsive-images'].numericValue);
        detectedTechs.reduceUnusedCSS = parseInt(lhr.audits['unused-css-rules'].numericValue);
        detectedTechs.minifyCSS = parseInt(lhr.audits['unminified-css'].numericValue);
        detectedTechs.reduceUnusedJS = parseInt(lhr.audits['unused-javascript'].numericValue);
        detectedTechs.minifyJavaScript = parseInt(lhr.audits['unminified-javascript'].numericValue);
        detectedTechs.enormousNetworkPayloads = parseInt(lhr.audits['total-byte-weight'].numericValue);
    } catch (error) {
        throw new Error('error in analyze performance: ' + error.message);
    } finally {
        if (context) await context.close();
    }
};


