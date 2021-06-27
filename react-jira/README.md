# React Jira

## 配置过程

```bash
yarn add -D --exact prettier
echo {} > .prettier.json
touch .prettierignore
yarn add -D eslint-config-prettier

# lint-staged
npx mrm lint-staged

# commitlint
yarn add -D @commitlint/{config-conventional,cli}
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

```
