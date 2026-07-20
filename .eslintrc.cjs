module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:astro/recommended'],
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  env: { browser: true, es2022: true, node: true },
  ignorePatterns: ['dist', '.astro', '.vercel', 'node_modules'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
    },
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      // svelte-eslint-parser's <script> wrapping trips this base rule up on legitimate top-level functions.
      rules: { 'no-inner-declarations': 'off' },
    },
  ],
};
