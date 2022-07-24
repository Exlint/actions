import type { Config } from '@exlint.io/inflint';

const inflintConfig: Config = {
	rules: {
		'{scripts,src}/**/*': [2, 'kebab-case'],
		'**/*.yml': 2,
	},
};

export default inflintConfig;
