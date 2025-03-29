import { vi, beforeAll, afterAll } from 'vitest';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load test environment variables before any tests run
const envPath = resolve(process.cwd(), '.env.test');
config({ path: envPath, override: true });

// Ensure USGS_API_URL is set
if (!process.env.USGS_API_URL) {
  throw new Error('USGS_API_URL environment variable is not set in .env.test');
}

// Mock console methods to keep test output clean
const originalConsole = { ...console };
beforeAll(() => {
  console.log = vi.fn();
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
}); 