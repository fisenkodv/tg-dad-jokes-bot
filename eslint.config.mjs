import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import eslint from 'typescript-eslint';

export default eslint.config(
  prettier,
  js.configs.recommended,
  eslint.configs.recommended,
  perfectionist.configs['recommended-natural'],
  unicorn.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    }
  },
  { ignores: ['dist/**', 'node_modules/**'] }
);
