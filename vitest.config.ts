import {configDefaults, defineConfig, mergeConfig} from 'vitest/config';
import { fileURLToPath, URL } from 'node:url'
import { UserConfig as ViteUserConfig } from 'vite';
import viteConfig from './vite.config';

// Type assertion to ensure compatibility
export default mergeConfig(viteConfig as ViteUserConfig, defineConfig({
  test: {
    environment: 'jsdom',
    exclude: [
      ...configDefaults.exclude, // Default exclusions
      'node_modules/**', // Exclude all subdirectories in node_modules
      'e2e/**', // Exclude e2e tests directory
      '**/*.test.js', // Exclude all .test.js files across the project if needed
      '**/*.spec.js', // Exclude all .spec.js files across the project if needed
    ],
    root: fileURLToPath(new URL('.', import.meta.url)),
    coverage: {
      include: ['src/components/**/*.vue'],
      exclude: ['src/components/icons/*.vue'],
      reporter: ['text', 'json', 'html'],
    }
  },
}));
