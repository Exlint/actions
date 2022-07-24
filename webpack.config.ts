import path from 'path';

import type webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import WebpackShellPluginNext from 'webpack-shell-plugin-next';

const configuration: webpack.Configuration = {
	context: __dirname,
	mode: 'production',
	target: 'node',
	entry: './src/index.ts',
	optimization: {
		minimize: true,
	},
	externals: [
		nodeExternals({
			modulesDir: path.resolve(__dirname, 'node_modules'),
		}),
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							configFile: 'tsconfig.build.json',
						},
					},
				],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new WebpackShellPluginNext({
			onBuildStart: {
				scripts: ['rimraf dist build'],
				blocking: true,
			},
			safe: true,
		}),
	],
	resolve: {
		extensions: ['.ts'],
	},
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
};

export default configuration;
