// Analyze HTTP Headers for server and technology information
export const checkHeaders = (headers, detectedTechs) => {
    if (headers['server']) detectedTechs.server.add(headers['server']);
    if (headers['x-powered-by']) detectedTechs.server.add(headers['x-powered-by']);
    if (headers['cf-ray']) detectedTechs.externalServices.add('Cloudflare');
    if (headers['via']) {
        detectedTechs.cachingTechnologies.add(headers['via'].includes('varnish') ? 'Varnish' : 'Unknown via header configuration');
    }
    if (headers['x-cache']) detectedTechs.cachingTechnologies.add(headers['x-cache'].includes('HIT') ? 'Cache HIT' : 'Cache MISS');
    if (headers['set-cookie']) {
        const cookies = headers['set-cookie'];
        cookies.forEach(cookie => {
            if (cookie.toLowerCase().includes('wp_')) {
                detectedTechs.frameworks.add('WordPress');
            }
        });
    }

    // Enhanced Security Headers Check
    const securityHeaders = ['strict-transport-security', 'x-content-type-options', 'x-frame-options', 'x-xss-protection', 'content-security-policy'];
    securityHeaders.forEach(header => {
        if (headers[header]) detectedTechs.securityPractices.add(header);
    });

    // Additional Headers Check
    if (headers['content-encoding']) detectedTechs.performanceOptimizations.add(`Content-Encoding: ${headers['content-encoding']}`);
    if (headers['server-timing']) detectedTechs.performanceOptimizations.add(`Server-Timing: ${headers['server-timing']}`);
}

export const detectExternalServices = ($, detectedTechs) => {
    // Check for external services like Google Analytics, Facebook SDK
    if ($('script[src*="google-analytics"]').length > 0) detectedTechs.externalServices.add('Google Analytics');
    if ($('script[src*="facebook"]').length > 0) detectedTechs.externalServices.add('Facebook SDK');
}

export const detectBackendTechnologies = ($, headers, detectedTechs) => {
    const bodyHTML = $('body').html();

    // patterns for detecting backend technologies
    const patterns = {
        'WordPress': /wp-content|wp-includes/,
        'Drupal': /sites\/default\/files/,
        'Joomla': /\/components\/|\/templates\//,
        'Express': /Express/,
        'Django': /csrfmiddlewaretoken|admin\/login\/django/, // Look for CSRF tokens or admin paths
        'Ruby on Rails': /<meta name="csrf-param" content="authenticity_token" \/>/, // CSRF tokens specific to Rails
    };

    Object.keys(patterns).forEach(tech => {
        if (bodyHTML.match(patterns[tech]) ||
            (headers['x-powered-by'] &&
                headers['x-powered-by'].match(tech))) {
            detectedTechs.backendTechnology.add(tech);
        }
    });
}

export const detectCMS = ($, data, detectedTechs) => {
    // Check for WordPress
    if ($('meta[name="generator"][content*="WordPress"], script[src*="wp-includes"], script[src*="wp-content"], link[rel="stylesheet"][href*="wp-"]').length > 0 || data.includes('wp-content')) {
        detectedTechs.backendTechnology.add('WordPress');
    }

    // Check for Wix
    if ($('script[src*="static.parastorage.com"]').length > 0 || $('meta[name="generator"]').attr('content')?.includes('Wix.com Website Builder')) {
        detectedTechs.backendTechnology.add('Wix.com');
    }

    // Check for Joomla
    if ($('meta[name="generator"][content*="Joomla"], script[src*="/media/system/js/"]').length > 0) {
        detectedTechs.backendTechnology.add('Joomla');
    }

    // Check for Drupal
    if ($('meta[name="Generator"][content*="Drupal"], script[src*="/sites/default/files/"]').length > 0) {
        detectedTechs.backendTechnology.add('Drupal');
    }

    // Check for Shopify
    if ($('script[src*="cdn.shopify.com/s/javascripts/"]').length > 0) {
        detectedTechs.backendTechnology.add('Shopify');
    }
}

export const detectAPICalls = ($, detectedTechs) => {

    // Potential indicators of API usage in script tags or inline scripts
    const apiHints = [
        { hint: 'fetch(', likelyService: 'Generic Fetch API' },
        { hint: 'axios', likelyService: 'Axios HTTP Client' },
        { hint: 'XMLHttpRequest', likelyService: 'XMLHttpRequest API' },
        { hint: 'graphql', likelyService: 'GraphQL API' },
        { hint: 'api.', likelyService: 'Generic API Endpoint' }
    ];

    // Check each script tag for src or inline content that matches our API hints
    $('script').each((i, el) => {
        const src = $(el).attr('src');
        const inlineContent = $(el).html();

        apiHints.forEach(apiHint => {
            if (src && src.includes(apiHint.hint)) {
                detectedTechs.externalServices.add(apiHint.likelyService);
            }

            if (inlineContent && inlineContent.includes(apiHint.hint)) {
                detectedTechs.externalServices.add(apiHint.likelyService);
            }
        });
    });
};
