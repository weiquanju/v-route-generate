const { build } = require('esbuild')
const { Generator } = require('npm-dts')
const { peerDependencies } = require('./package.json')

const entryFile = 'src/index.ts'
const shared = {
  entryPoints: [entryFile],
  bundle: true,
  external: Object.keys(peerDependencies),
}

build({
  ...shared,
  outfile: 'dist/index.js',
})

build({
  ...shared,
  outfile: 'dist/index.esm.js',
  format: 'esm',
})

new Generator({
  entry: entryFile,
  output: 'dist/index.d.ts',
}).generate()