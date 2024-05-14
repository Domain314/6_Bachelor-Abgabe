import axios from 'axios';
import { load } from 'cheerio';
import { checkHeaders, detectExternalServices, detectBackendTechnologies, detectCMS, detectAPICalls } from './res/backend.js';
import { detectFrontendTechnologies } from './res/frontend.js';
import { analyzePerformance, closeBrowser, initBrowser } from './res/puppet.js';
import { cloneTechStack, writeCSV, writeDoneFile } from './res/helper.js';
import { runCo2Check } from './res/co2.js';
import { techStack } from './res/config.js';

import { urls } from './urls.js'

async function analyzeTechStack(websiteUrl) {
    try {
        // Use axios to fetch the website's content along with headers
        const response = await axios.get(websiteUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:123.0) Gecko/20100101 Firefox/123.0',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Encoding': 'gzip, deflate, br',
                'Referer': 'https://www.google.com/',
                'Cache-Control': 'no-cache',
            }
        });
        const data = response.data;
        const headers = response.headers;

        const detectedTechs = cloneTechStack(techStack);
        detectedTechs.url = websiteUrl;

        checkHeaders(headers, detectedTechs)

        const $ = load(data);

        detectFrontendTechnologies($, data, detectedTechs)

        detectExternalServices($, detectedTechs)

        detectBackendTechnologies($, headers, detectedTechs)

        detectCMS($, data, detectedTechs)

        detectAPICalls($, detectedTechs)

        // Log the detected technologies
        // console.log(`Detected technologies for ${websiteUrl}:`, detectedTechs);

        return detectedTechs;
    } catch (error) {
        throw new Error(error.message);
    }


}

async function runAnalysis(url, isOnline) {
    const detectedTechs = await analyzeTechStack(url);
    await analyzePerformance(url, detectedTechs);
    await runCo2Check(url, detectedTechs);
    await writeCSV(detectedTechs, isOnline);
}

const run = async () => {
    const startIdx = process.argv?.[2] ? parseInt(process.argv[2], 10) : 0;
    const endIdx = process.argv?.[3] ? parseInt(process.argv[3], 10) : 10;
    const isOnline = process.argv?.[4] ? process.argv[4] : false;

    console.log('start', startIdx, endIdx);

    await initBrowser();

    for (let index = startIdx; index <= endIdx; index++) {
        if (index > urls.length) {
            console.log('TOO LONG');
            break;
        }
        console.log(`Analyzing ${index}: ${urls[index]}`);

        for (let localTries = 0; localTries < 3; localTries++) {
            console.log(`Round ${localTries}: ${urls[index]}`);

            try {
                await runAnalysis(urls[index], isOnline);
                break;
            } catch (error) {
                console.error('An error occured', urls[index]);
                console.error(error.message);
            }
        }
    }

    await closeBrowser();
    writeDoneFile();
}

run();
