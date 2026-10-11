/**
 * uuid v13 ships ES modules only, which Jest cannot `require` here (jest-e2e.json maps
 * 'uuid' to this file). The app only uses v4, which crypto.randomUUID() provides.
 */
export { randomUUID as v4 } from 'crypto';
