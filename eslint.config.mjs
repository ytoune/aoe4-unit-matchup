// @ts-check

import { defineConfig, globalIgnores } from 'eslint/config'
import github from 'eslint-plugin-github'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'

const githubConfigs = github.getFlatConfigs()

const ignores = [
  'node_modules/',
  'dist/',
  '.cache/',
  '.swc/',
  'scripts/sandbox/',
]

const JS_EXT = 'ts,tsx,mts,mtsx,js,jsx,mjs,mjsx,cjs'
const jsExtensions = JS_EXT.split(',')

export default defineConfig([
  js.configs.recommended,
  githubConfigs.recommended,
  githubConfigs.browser,
  ...githubConfigs.typescript,
  eslintConfigPrettier,
  globalIgnores(ignores),
  {
    files: [`src/**/*.{${JS_EXT}}`],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: { project: './tsconfig.json' },
    },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
        'eslint-import-resolver-typescript': true,
      },
      'import/parsers': {
        '@typescript-eslint/parser': jsExtensions,
      },
    },
    rules: {
      // yoda: ['error', 'always', { exceptRange: true,  }],
      yoda: ['error', 'always', { onlyEquality: true }],
      complexity: ['error', 40],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-console': 'off',
      'no-negated-condition': 'off',
      'func-style': ['error', 'expression'],
      'github/filenames-match-regex': ['error', '^([a-z0-9-]+)$'],
      'filenames/match-regex': 'off',
      'import/order': 'error',
      'import/no-default-export': 'off',
      'import/no-namespace': 'off',
      'import/no-cycle': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',
      'import/extensions': [
        'error',
        'always',
        Object.fromEntries(jsExtensions.map(e => [e, 'never'])),
      ],
      'github/no-then': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/no-explicit-any': ['warn', { fixToUnknown: true }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { fixStyle: 'separate-type-imports' },
      ],
    },
  },
])
