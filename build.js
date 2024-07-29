const { build } = require('esbuild')
const { Generator } = require('npm-dts')
const package = require('./package.json')
const packageExpose = require('./expose.json')
const fs = require('node:fs/promises')
const path = require('path')

const version = '1.1.1'

const entryFile = './index.ts'
const shared = {
  sourcemap: false,
  entryPoints: [entryFile],
  bundle: true,
  external: Object.keys(package.peerDependencies),
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



const after = async () => {
  await new Generator({
    entry: entryFile,
    output: 'dist/index.d.ts'
  }).generate()

  package.version = version

  await fs.writeFile('./dist/package.json', JSON.stringify({ ...package, ...packageExpose, devDependencies: undefined, scripts: undefined }, null, '  '))
  await fs.writeFile('./package.json', JSON.stringify(package, null, '  '))

  const setVersion = (s) => s.replace(/npm-\d+\.\d+\.\d+/mg, 'npm-' + version)

  await Promise.allSettled(['README.md', 'README-ZH.md'].map(async (f) => {
    const readPath = path.resolve(__dirname, f)
    const writePath = path.resolve(__dirname, 'dist', f)
    const data = await fs.readFile(readPath, { encoding: 'utf-8' })
    return await fs.writeFile(writePath, setVersion(data), { encoding: 'utf-8', flag: 'w' })
  }))
}

after()