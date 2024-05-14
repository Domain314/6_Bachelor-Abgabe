import { hosting, co2 } from '@tgwf/co2'

const AMOUNT_OF_VISITS = 1000;

const extractDomain = (url) => {
    const parsedUrl = new URL(url);
    let domain = parsedUrl.hostname;
    // Remove www if it exists
    if (domain.startsWith("www.")) {
        domain = domain.substring(4);
    }
    return domain;
}

export const runCo2Check = async (url, detectedTechs) => {
    const isGreen = await hosting.check(extractDomain(url))
    const co2Emissions = new co2()
    const bytesSent = detectedTechs.enormousNetworkPayloads * AMOUNT_OF_VISITS;
    detectedTechs.greenHosting = isGreen ? 1 : 0;
    detectedTechs.co2WithGreenHosting = parseInt(co2Emissions.perByte(bytesSent, isGreen));
    detectedTechs.co2WithoutGreenHosting = parseInt(co2Emissions.perByte(bytesSent, false));
}