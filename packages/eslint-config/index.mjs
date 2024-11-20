// @ts-check

import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import promise from 'eslint-plugin-promise';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import formatjs from 'eslint-plugin-formatjs';
import tailwindcss from 'eslint-plugin-tailwindcss';

export { defineFlatConfig as defineConfig } from 'eslint-define-config';

export const base = tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  promise.configs['flat/recommended'],
  prettier,
  {
    ignores: ['.turbo/**'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
      'no-only-tests': noOnlyTests,
      'react-hooks': reactHooks,
      formatjs: formatjs,
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': ['off'],
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-empty-object-type': ['off'],
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'no-only-tests/no-only-tests': 'error',
    },
  },
);

export const frontend = tseslint.config(
  ...base,
  tailwindcss.configs['flat/recommended'],
  {
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    plugins: {
      tailwindcss: tailwindcss,
    },
  },
  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': ['off'],
      'react/prefer-stateless-function': ['error'],
      'react/react-in-jsx-scope': ['off'],
      'react/jsx-no-literals': [
        'warn',
        {
          noStrings: true,
          ignoreProps: true,
          noAttributeStrings: false,
        },
      ],
      'formatjs/enforce-default-message': 'error',
      'formatjs/enforce-id': [
        'error',
        {
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
        },
      ],
      'formatjs/enforce-placeholders': 'error',
      'formatjs/no-camel-case': 'error',
      'tailwindcss/classnames-order': 'error',
    },
  },
);
