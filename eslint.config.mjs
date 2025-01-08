import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], // Target relevant files
    ignores: ['dist', 'babel.config.js', 'metro.config.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'], // Re-apply after extending
    plugins: {
      'react-hooks': pluginReactHooks,
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // Ensure this takes precedence,
      'react-hooks/exhaustive-deps': ['warn'],
      'react/display-name': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-children-prop': 'off',
    },
  },
];
