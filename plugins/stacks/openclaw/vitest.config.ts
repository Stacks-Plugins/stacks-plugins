import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^openclaw\/plugin-sdk\/(.*)$/,
        replacement: '/usr/lib/node_modules/openclaw/dist/plugin-sdk/$1',
      },
      {
        find: 'openclaw',
        replacement: '/usr/lib/node_modules/openclaw',
      },
    ],
  },
});
