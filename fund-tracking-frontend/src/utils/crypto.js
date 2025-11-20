import { keccak256 } from 'web3-utils';

/**
 * Hash sensitive project data for blockchain storage
 * @param {string} projectName - Project name
 * @param {string} projectDescription - Project description
 * @returns {string} - Keccak256 hash
 */
export function hashProjectData(projectName, projectDescription) {
  const combined = `${projectName}${projectDescription}`;
  return keccak256(combined);
}

/**
 * Hash user data for privacy
 * @param {string} email - User email
 * @param {string} role - User role
 * @returns {string} - Keccak256 hash
 */
export function hashUserData(email, role) {
  const combined = `${email}${role}`;
  return keccak256(combined);
}

/**
 * Verify hashed data
 * @param {string} originalData - Original data
 * @param {string} hash - Hash to verify
 * @returns {boolean} - Whether hash matches
 */
export function verifyHash(originalData, hash) {
  return keccak256(originalData) === hash;
}

/**
 * Create secure project reference
 * @param {string} name - Project name
 * @param {string} description - Project description
 * @param {object} metadata - Additional metadata
 * @returns {object} - Secure project reference
 */
export function createSecureProjectReference(name, description, metadata = {}) {
  return {
    dataHash: hashProjectData(name, description),
    createdAt: Date.now(),
    metadata: {
      ...metadata,
      encrypted: true
    }
  };
}
