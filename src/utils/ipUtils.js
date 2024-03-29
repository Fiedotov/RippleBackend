const axios = require('axios');

// Token list for ipinfo.io API
let tokens = [
    "5fc4011be4fdfe",
    "33d5b8184bfd96",
    "f242ef9ed36d80",
    "fb7c8adc6a9dda",
    "ffb91192120967",
    "8f177719dd40f9",
    "4f851c7cb7b219",
    "bebf9517815016",
    "44958d5779a334",
    "a1bb8570e15691",
    "fd8b7a9b62e88f",
    "f006dd06daf1f3",
    "322055af2219af",
    "8f2d7d26f29607",
    "5c9efe8cbe696b",
    "6e07eadf6c9fab",
    "006a4ed93465d4",
];

// Cache for storing IP address to country mappings
let ip2CountryCache = {};

// Get the country for a given IP address
async function getAddressCountry(ipAddress) {
    // Check cache first
    if (ip2CountryCache[ipAddress]) {
        return ip2CountryCache[ipAddress];
    }

    // Process the IP address (remove port, IPv6 prefix, etc.)
    ipAddress = processIpAddress(ipAddress);

    // Get a random token for the request
    const currentToken = tokens[getRandomInteger(0, tokens.length - 1)];

    try {
        const response = await axios.get(`https://ipinfo.io/${ipAddress}/json?token=${currentToken}`);
        const country = response.data.country;
        ip2CountryCache[ipAddress] = country; // Cache the result
        return country;
    } catch (error) {
        console.error('Error fetching country for IP address:', error);
        return null;
    }
}

// Process the IP address to remove ports and IPv6 prefixes
function processIpAddress(ipAddress) {
    if (ipAddress.includes('::ffff:')) {
        ipAddress = ipAddress.replace('::ffff:', '');
    }
    ipAddress = ipAddress.split(':')[0]; // Remove port if present
    ipAddress = ipAddress.replace(/\[|\]/g, ''); // Remove square brackets for IPv6
    return ipAddress;
}

// Get a random integer between min and max, inclusive
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Sort by server state
function sortByServerState(a, b) {
    const order = { full: 1, insane: 2, unknown: 3 };
    const rankA = order[a.serverState] || Number.MAX_VALUE;
    const rankB = order[b.serverState] || Number.MAX_VALUE;
    if (rankA !== rankB) {
        return rankA - rankB;
    }
    // If serverState is the same, sort by whether ledgers are non-empty
    const ledgersAEmpty = !a.ledgers || a.ledgers.trim() === '';
    const ledgersBEmpty = !b.ledgers || b.ledgers.trim() === '';
    return ledgersAEmpty - ledgersBEmpty;
}

module.exports = {
    getAddressCountry,
    sortByServerState,
    // Export other utility functions if needed
};
