import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs['flat/recommended'],
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    // `.svelte.ts` rune modules go through svelte-eslint-parser too, and that
    // parser needs to be told how to read TypeScript.
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    languageOptions: { parserOptions: { parser: ts.parser } }
  },
  {
    rules: {
      curly: ['error', 'multi-line'],
      // `!= null` is the idiomatic null-and-undefined check; everything else strict.
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },
  {
    ignores: ['build/', 'dist/', '.svelte-kit/', 'node_modules/', 'src/lib/components/ui/']
  }
);
