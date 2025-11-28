// @ts-check

import pt from 'node:path'
import { fileURLToPath } from 'node:url'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import { globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
import github from 'eslint-plugin-github'
import globals from 'globals'

const JS_EXT = 'ts,tsx,mts,mtsx,cts,ctsx,js,jsx,mjs,mjsx,cjs'
const jsExtensions = JS_EXT.split(',')

const githubConfigs = github.getFlatConfigs()

const __dirname = pt.dirname(fileURLToPath(import.meta.url))
const gitignorePath = pt.join(__dirname, '.gitignore')

const ignores = [
  'node_modules/',
  'dist/',
  '.cache/',
  '.swc/',
  'scripts/sandbox/',
  '*',
  '!*.config.mjs',
  '!src/',
  '!scripts/',
]

export default [
  js.configs.recommended,
  githubConfigs.recommended,
  ...githubConfigs.typescript,
  eslintConfigPrettier,
  globalIgnores(ignores),
  includeIgnoreFile(gitignorePath),
  {
    files: [`**/*.{${JS_EXT}}`],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.mjs'],
        },
        tsconfigRootDir: __dirname,
      },
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
      complexity: ['error', 30],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-console': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-negated-condition': 'off',
      'no-empty-pattern': ['error', { allowObjectPatternsAsParameters: true }],
      'func-style': ['error', 'expression'],
      'github/filenames-match-regex': ['error', '^([a-z0-9-.]+)$'],
      'filenames/match-regex': 'off',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            { pattern: './+types/*', group: 'internal', position: 'before' },
            { pattern: '~/**', group: 'internal', position: 'after' },
            { pattern: '**/*.module.css', group: 'index', position: 'after' },
          ],
          distinctGroup: false,
          'newlines-between': 'never',
          alphabetize: { order: 'asc', caseInsensitive: true },
          named: true,
        },
      ],
      'import/no-default-export': 'off',
      'import/no-namespace': 'off',
      'import/no-cycle': 'off',
      'import/no-named-as-default': 'off',
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
      'i18n-text/no-en': 'off',
    },
  },
  {
    files: ['scripts/sandbox*', '**/scripts/sandbox*'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
]
