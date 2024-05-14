export const techStack = {
    url: '',
    // LHR
    score: -1,
    lcp: -1, // ms
    tti: -1, // ms
    speedIndex: -1, // ms
    minimizeMainThreadWork: -1, // ms
    eliminateRenderBlockingResources: -1, // ms
    minimizeThirdPartyResourcesMs: -1, // ms
    minimizeThirdPartyResourcesBytes: -1, // byte
    efficientlyEncodeImages: -1, // byte
    serveNextGenImages: -1, // byte
    properlySizeImages: -1,  // byte
    reduceUnusedCSS: -1, // byte
    minifyCSS: -1, // byte
    reduceUnusedJS: -1, // byte
    minifyJavaScript: -1, // byte
    enormousNetworkPayloads: -1, // byte
    // CO2 Check
    greenHosting: -1,
    co2WithGreenHosting: -1,
    co2WithoutGreenHosting: -1,
    // Detector
    server: new Set(),
    frameworks: new Set(),
    libraries: new Set(),
    externalServices: new Set(),
    cachingTechnologies: new Set(),
    securityPractices: new Set(),
    performanceOptimizations: new Set(),
    backendTechnology: new Set(),
}

