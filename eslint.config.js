import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
  ...reactHooks.configs.recommended.rules,
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

  // 🔻 Desactivadas
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-wrapper-object-types': 'off',
  '@typescript-eslint/no-unused-expressions': 'off',
  'react-hooks/exhaustive-deps': 'off',
  'prefer-const': 'off',
  'no-empty': 'off',
  'no-self-assign': 'off',
  'no-irregular-whitespace': 'off',
  '@typescript-eslint/no-empty-object-type': 'off', // ⬅️ Esta línea es nueva
    },
  },
)
