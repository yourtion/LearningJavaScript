export default {
  esbuild: {
    jsxFactory: 'createElement',
    jsxInject: `import { createElement } from './toy-react';`
  }
}