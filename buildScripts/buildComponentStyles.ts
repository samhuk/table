import * as esbuild from 'esbuild'
import sassPlugin from 'esbuild-sass-plugin'
import * as path from 'path'
import { createBuilder } from './buildCommon'

const prod = process.env.NODE_ENV === 'production'
const ENTRYPOINT_PATH = './src/component/styles/index.scss'
const OUTPUT_DIR = './dist'
const OUTPUT_SCSS_FILENAME = 'styles.css'

export const buildComponentStyles = createBuilder('component styles', () => esbuild.build({
  entryPoints: [ENTRYPOINT_PATH],
  outfile: path.resolve(OUTPUT_DIR, OUTPUT_SCSS_FILENAME),
  bundle: true,
  minify: prod,
  sourcemap: !prod,
  metafile: true,
  incremental: !prod,
  plugins: [sassPlugin() as unknown as esbuild.Plugin],
}).then(result => ({ buildResult: result })))
