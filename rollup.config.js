export default {
    input: 'src/index.js',
    output: {
      file: 'dist/bundle.js',
      format: 'cjs',
    },
    external: ['@rollup/rollup-linux-x64-gnu'], // Exclude it from bundling
  };
  