// Simple NLP utility without external dependencies

// Stop words to ignore (common English words that don't add semantic value)
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'about',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'ours', 'theirs',
  'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
  'this', 'that', 'these', 'those'
]);

// Basic stemming map (very simplified for common tech terms)
const STEM_MAP = {
  'developer': 'develop',
  'development': 'develop',
  'developing': 'develop',
  'coded': 'code',
  'coding': 'code',
  'coder': 'code',
  'designer': 'design',
  'designing': 'design',
  'designs': 'design',
  'manager': 'manag',
  'management': 'manag',
  'managing': 'manag',
  'learned': 'learn',
  'learning': 'learn',
  'learner': 'learn'
};

/**
 * Cleans and tokenizes text, removing stop words
 * @param {string} text 
 * @returns {string[]}
 */
const preprocess = (text) => {
  if (!text) return [];
  
  // 1. Lowercase
  // 2. Remove punctuation (replace with space)
  // 3. Split by whitespace
  const rawTokens = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/);

  return rawTokens
    .filter(token => token.length > 2 && !STOP_WORDS.has(token))
    .map(token => STEM_MAP[token] || token); // Apply simple stemming
};

/**
 * Creates a term frequency vector from tokens
 * @param {string[]} tokens 
 * @returns {Map<string, number>}
 */
const createVector = (tokens) => {
  const vec = new Map();
  for (const token of tokens) {
    vec.set(token, (vec.get(token) || 0) + 1);
  }
  return vec;
};

/**
 * Calculates Cosine Similarity between two vectors
 * @param {Map<string, number>} vecA 
 * @param {Map<string, number>} vecB 
 * @returns {number} -1 to 1 (1 means identical direction)
 */
const cosineSimilarity = (vecA, vecB) => {
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  // Get all unique terms from both vectors
  const allTerms = new Set([...vecA.keys(), ...vecB.keys()]);

  for (const term of allTerms) {
    const valA = vecA.get(term) || 0;
    const valB = vecB.get(term) || 0;
    dotProduct += valA * valB;
    magA += valA * valA;
    magB += valB * valB;
  }

  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
};

module.exports = {
  preprocess,
  createVector,
  cosineSimilarity
};
