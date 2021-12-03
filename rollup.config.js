import external from 'rollup-plugin-peer-deps-external';
import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import cleanup from 'rollup-plugin-cleanup';

import minifyCssTemplate from './minify-css-template'

import pkg from './package.json';
import tsconfig from './tsconfig.json';

const production = !process.env.ROLLUP_WATCH;

function resolveEntries() {
  return Object.entries(
    tsconfig.compilerOptions.paths
  ).map(([find, [replacement]]) => ({ find, replacement }));
}

const input = "./src/index.ts"

export default [
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs' },
    ],
    plugins: [
      external(),
      ts(),
      alias({
        resolve: ['.ts', '.tsx'],
        entries: resolveEntries(),
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      minifyCssTemplate(),
      production && filesize()
    ],
  },
  {
    input: [
      'src/index.ts', 
      'src/extras/vector-controller.ts', 
      'src/extras/canvas-controller.ts',
      'src/extras/color-controller.ts'
    ],
    output: [
      { dir: './dist/esm', format: 'es' },
    ],
    plugins: [
      external(),
      ts(),
      alias({
        resolve: ['.ts', '.tsx'],
        entries: resolveEntries(),
      }),
      commonjs({
        include: ['node_modules/**'],
      }),
      minifyCssTemplate(),
      production && filesize()
    ],
  },
  {
    input,
    output: { file: pkg.browser, name: 'data-gui', format: 'umd' },
    plugins: [
      external(),
      ts(),
      alias({
        resolve: ['.ts', '.tsx'],
        entries: resolveEntries(),
      }),
      resolve(),
      commonjs({
        include: ['node_modules/**'],
      }),
      cleanup({comments: 'none'}),
      minifyCssTemplate(),
      terser(),
      production && filesize(),
    ],
	},
	{
		input: 'example/src/index.js',
		output: {
			name: 'howLongUntilLunch',
			file: 'example/dist/index.js',
			format: 'umd'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs() // so Rollup can convert `ms` to an ES module
		]
	},
];