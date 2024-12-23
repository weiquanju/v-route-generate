const { build } = require('esbuild')
const { Generator } = require('npm-dts')
const package = require('./package.json')
const packageExpose = require('./expose.json')
const fs = require('node:fs/promises')
const path = require('path')
const { resolve } = require('node:path')

const version = '1.2.2'

const entryFile = './src/index.ts'

const start = async () => {

  const shared = {
    sourcemap: false,
    entryPoints: [entryFile],
    bundle: true,
    external: Object.keys(package.peerDependencies),
  }
  const banner = {
    js: `/**
 * v-route-generate 
 * @version ${version}
 * @author weiquanju <anbine@qq.com>
 */`
  }
  // clear dist
  await fs.rm('../v-route-generate-dist', { recursive: true, force: true })

  await Promise.allSettled([
    build({
      ...shared,
      outfile: '../v-route-generate-dist/index.cjs',
      format: 'cjs',
      banner,
    }),
    build({
      ...shared,
      outfile: '../v-route-generate-dist/index.js',
      format: 'iife',
      banner,
    }),
    build({
      ...shared,
      outfile: '../v-route-generate-dist/index.mjs',
      format: 'esm',
      banner,
    })
  ])
}


const after = async () => {

  // copy package.json 到 src 下
  await fs.copyFile('./package.json', './src/package.json')

  await new Generator({
    entry: resolve(__dirname, './src/index.ts'),
    root: resolve(__dirname, './src'),
    output: resolve(__dirname, '../v-route-generate-dist/index.d.ts')
  }, true, true).generate().finally(() => {
    setTimeout(() => {
      fs.rm('./src/package.json', { force: true })
    }, 10);
  })

  
  package.version = version

  await fs.writeFile('../v-route-generate-dist/package.json', JSON.stringify({ ...package, ...packageExpose, devDependencies: { vite: "^2.9.0" }, scripts: undefined, packageManager: undefined }, null, '  '))
  await fs.writeFile('./package.json', JSON.stringify(package, null, '  '))

  const setVersion = (s) => s.replace(/npm-\d+\.\d+\.\d+/mg, 'npm-' + version)

  await Promise.allSettled(['README.md', 'README-ZH.md'].map(async (f) => {
    const readPath = path.resolve(__dirname, f)
    const writePath = path.resolve(__dirname, '../v-route-generate-dist', f)
    const data = await fs.readFile(readPath, { encoding: 'utf-8' })
    await fs.writeFile(readPath, setVersion(data), { encoding: 'utf-8', flag: 'w' })
    return await fs.writeFile(writePath, setVersion(data), { encoding: 'utf-8', flag: 'w' })
  }))
}

  ; (async () => {
    await start()
    await after()
  })();