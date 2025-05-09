// @ts-check

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
// @ts-expect-error: ignore no type
import _import from 'eslint-plugin-import'
import github from 'eslint-plugin-github'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: ['node_modules', 'dist', '.cache', '.swc', 'scripts/sandbox*'],
  },
  ...fixupConfigRules(
    compat.extends(
      'prettier',
      'plugin:import/typescript',
      'plugin:github/recommended',
      'plugin:github/typescript',
    ),
  ),
  {
    plugins: {
      // '@typescript-eslint': typescriptEslint,
      import: fixupPluginRules(_import),
      // @ts-expect-error: as any
      github: fixupPluginRules(github),
    },
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
        '@typescript-eslint/parser': [
          '.ts',
          '.tsx',
          '.mts',
          '.cts',
          '.js',
          '.jsx',
          '.mjs',
          '.cjs',
        ],
      },
    },
    rules: {
      yoda: ['error', 'always', { exceptRange: true }],
      complexity: ['error', 30],
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-console': 'off',
      'no-negated-condition': 'off',
      'func-style': ['error', 'expression'],
      // 'filenames/match-regex': ['error', '^[a-z0-9-]+(.[a-z0-9-]+)?$'],
      'filenames/match-regex': 'off',
      'import/order': 'error',
      'import/no-default-export': 'off',
      'import/no-cycle': 'off',
      'github/no-then': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/no-explicit-any': ['warn', { fixToUnknown: true }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
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
]
