export const isReactApp = ($) => {
    // Check for script tags that include React-specific paths
    const reactScriptDetected = $('script[src*="react"],script[src*="react-dom"], [data-reactroot], [data-reactid]').length > 0;

    return reactScriptDetected;
}

export const detectFrontendTechnologies = ($, data, detectedTechs) => {
    // Check for common frameworks and libraries in HTML
    const metaTags = $('meta[name="generator"]').attr('content');
    if (metaTags) detectedTechs.frameworks.add(metaTags);

    // Analyze CSS for Bootstrap or other libraries
    if ($('link[rel="stylesheet"][href*="bootstrap"]').length > 0) detectedTechs.libraries.add('Bootstrap');

    if (isReactApp($)) detectedTechs.libraries.add('React');
    if ($('script[src*="angular"]').length > 0) detectedTechs.libraries.add('Angular');

    // Detect Vue.js
    if ($('script[src*="vue"], [v-app]').length > 0 || typeof window !== 'undefined' && window.Vue) {
        detectedTechs.libraries.add('Vue.js');
    }

    // Enhanced CSS inspection for Tailwind CSS - checks for common Tailwind class prefixes
    if ($('*[class*="tw-"], *[class*="md:"]').length > 0) {
        detectedTechs.libraries.add('Tailwind CSS');
    }

    const jqueryVersion = detectjQueryVersion($);
    if (jqueryVersion) {
        detectedTechs.libraries.add(jqueryVersion);
    }

}

export const detectjQueryVersion = ($) => {
    // Since Cheerio does not execute JavaScript, direct version detection via script is not possible.
    // Instead, look for a script tag that includes jQuery and possibly a version number in the src attribute.
    const jqueryScript = $('script[src*="jquery"]').attr('src');
    if (jqueryScript) {
        // Extract version number from script src attribute
        const versionMatch = jqueryScript.match(/jquery-([0-9.]+)\.min\.js/);
        if (versionMatch && versionMatch[1]) {
            return `jQuery ${versionMatch[1]}`;
        }
    }
    // Fallback to checking for known jQuery CDN patterns or other identifiable sources
    // This is less reliable and might not always indicate the version
    return $('script[src*="jquery"]').length > 0 ? 'jQuery (version unknown)' : null;
};