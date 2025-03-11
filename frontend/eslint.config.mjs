import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import nextjs from '@next/eslint-plugin-next';

// Configuração do FlatCompat para carregar configurações do Next.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Configurações do Next.js usando FlatCompat
const nextConfig = compat.extends("next/core-web-vitals", "next/typescript");

// Configurações personalizadas
const customConfig = tseslint.config(
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
      '@next/next': nextjs,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@next/next/no-html-link-for-pages': 'error',
      '@typescript-eslint/no-unused-vars': 'off', // Desativa erros de variáveis não utilizadas
      '@typescript-eslint/no-explicit-any': 'off', // Desativa erros de uso de `any`
      'react-hooks/exhaustive-deps': 'off', // Desativa erros de dependências ausentes em hooks
      'no-case-declarations': 'off', // Desativa erros de declarações lexicais em blocos `case`
    },
  }
);

// Combinar as configurações do Next.js com as configurações personalizadas
export default [
  ...nextConfig,
  ...customConfig,
];