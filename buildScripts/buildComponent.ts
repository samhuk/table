import * as esbuild from 'esbuild'
import sassPlugin from 'esbuild-sass-plugin'
import * as path from 'path'
import { createBuilder } from './buildCommon'

const prod = process.env.NODE_ENV === 'production'
const ENTRYPOINT_PATH = './src/component/index.ts'
const OUTPUT_DIR = './build/component'
const OUTPUT_JS_FILENAME = 'index.js'

export const buildComponent = createBuilder('client', () => esbuild.build({
  entryPoints: [ENTRYPOINT_PATH],
  outfile: path.resolve(OUTPUT_DIR, OUTPUT_JS_FILENAME),
  bundle: true,
  minify: prod,
  sourcemap: !prod,
  metafile: true,
  incremental: !prod,
  plugins: [sassPlugin() as unknown as esbuild.Plugin],
}).then(result => ({ buildResult: result })))
