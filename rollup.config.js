// import commonjs from 'rollup-plugin-commonjs';
// import pkg from './package.json';
// import typescript from '@rollup/plugin-typescript';


// export default [
// 	// browser-friendly UMD build
// 	// {
// 	// 	input: 'src/main.ts',
// 	// 	output: {
// 	// 		name: 'howLongUntilLunch',
// 	// 		file: pkg.browser,
// 	// 		format: 'umd',
// 	// 		sourcemap: true
// 	// 	},
// 	// 	plugins: [
// 	// 		resolve({ extensions: ['.ts'] }),
// 	// 		typescript()
// 	// 	]
// 	// },

// 	// CommonJS (for Node) and ES module (for bundlers) build.
// 	// (We could have three entries in the configuration array
// 	// instead of two, but it's quicker to generate multiple
// 	// builds from a single configuration where possible, using
// 	// an array for the `output` option, where we can specify 
// 	// `file` and `format` for each target)
// 	// {
// 	// 	input: 'src/main.js',
// 	// 	external: ['ms'],
// 	// 	output: [
// 	// 		{ file: pkg.main, format: 'cjs' },
// 	// 		{ file: pkg.module, format: 'es' }
// 	// 	],
// 	// 	plugins: [
// 	// 		typescript()
// 	// 	]
// 	// },

// 	{
// 		input: 'src/main.ts',
// 		output: [
// 			{
// 				file: pkg.main,
// 				format: 'cjs',
// 			},
// 			{
// 				file: pkg.module,
// 				format: 'es',
// 			},
// 		],
// 		external: [
// 			...Object.keys(pkg.dependencies || {}),
// 			...Object.keys(pkg.peerDependencies || {}),
// 		],
// 		plugins: [
// 			typescript(),
// 		],
// 	}
// 	// {
// 	// 	input: 'example/src/index.js',
// 	// 	output: {
// 	// 		name: 'howLongUntilLunch',
// 	// 		file: 'example/dist/index.js',
// 	// 		format: 'umd'
// 	// 	},
// 	// 	plugins: [
// 	// 		resolve(), // so Rollup can find `ms`
// 	// 		commonjs() // so Rollup can convert `ms` to an ES module
// 	// 	]
// 	// },
// ];


import external from 'rollup-plugin-peer-deps-external';
import ts from 'rollup-plugin-ts';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import styles from "rollup-plugin-styles";

import pkg from './package.json';
import tsconfig from './tsconfig.json';

const production = !process.env.ROLLUP_WATCH;

const input = 'src/main.ts';

function resolveEntries() {
  return Object.entries(
    tsconfig.compilerOptions.paths
  ).map(([find, [replacement]]) => ({ find, replacement }));
}

console.log(input, pkg, tsconfig)

export default [
  {
    input,
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
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
      production && filesize()
    ],
  },
  {
    input,
    output: { file: pkg.browser, name: 'ThreeDatGUI', format: 'umd' },
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