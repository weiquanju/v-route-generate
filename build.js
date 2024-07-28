const { build } = require('esbuild')
const { Generator } = require('npm-dts')
const { peerDependencies } = require('./package.json')

const entryFile = 'src/index.ts'
const shared = {
  sourcemap: false,
  entryPoints: [entryFile],
  bundle: true,
  external: Object.keys(peerDependencies),
}

build({
  ...shared,
  outfile: 'dist/index.cjs',
  format: 'cjs',
})

build({
  ...shared,
  outfile: 'dist/index.js',
  format: 'iife',
})

build({
  ...shared,
  outfile: 'dist/index.mjs',
  format: 'esm',
})

new Generator({
  entry: entryFile,
  output: 'dist/index.d.ts',
}).generate()