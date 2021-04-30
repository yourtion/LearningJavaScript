const path = require('path');

export default {
  esbuild: {
    jsxFactory: 'createElement',
    jsxInject: `import { createElement } from './toy-react';`,
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/toy-react.ts'),
      name: 'toy-react',
    },
  },
};
