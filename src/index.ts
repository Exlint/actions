import * as core from '@actions/core';
import * as exec from '@actions/exec';
import axios from 'axios';
import chalk from 'chalk';
import { Netrc } from 'netrc-parser';

import type { IVerifyCliTokenResponseBody } from './interfaces/responses';
import { CLI_API_DOMAIN, CLI_API_URL } from './constants/cli-api';

const exlintCliToken = core.getInput('token', { required: true });
const exlintGroupId = core.getInput('groupId', { required: true });

const runExlint = async () => {
	core.info('Trying to authenticate Exlint with provided token');

	let verifiedEmail: string;

	try {
		const verifyCliTokenResponseData = await axios.get<IVerifyCliTokenResponseBody>(
			`${CLI_API_URL}/user/auth/verify-token`,
			{
				headers: {
					Authorization: `Bearer ${exlintCliToken}`,
				},
			},
		);

		verifiedEmail = verifyCliTokenResponseData.data.email;
	} catch (e: unknown) {
		core.debug(`Failed to authenticate Exlint with HTTP error:\n${JSON.stringify(e, null, 2)}`);
		core.setFailed(chalk.bold.red('Failed to authenticate Exlint with provided token'));

		return;
	}

	try {
		const netrc = new Netrc();

		await netrc.load();

		netrc.machines[CLI_API_DOMAIN] = {
			login: verifiedEmail,
			password: exlintCliToken,
		};

		await netrc.save();

		const exlintUseCommandExitCode = await exec.exec('npx', ['@exlint.io/cli', 'use', exlintGroupId]);

		if (exlintUseCommandExitCode === 1) {
			core.setFailed(chalk.bold.red('Exlint "use" command failed'));

			return;
		}

		const exlintRunCommandExitCode = await exec.exec('npx', ['@exlint.io/cli', 'run']);

		if (exlintRunCommandExitCode === 1) {
			core.setFailed(chalk.bold.red('Exlint "run" command failed'));

			return;
		}
	} catch (e: unknown) {
		core.debug(`Failed with an error:\n${e}`);
		core.setFailed(chalk.bold.red('Exlint action failed.'));

		return;
	}

	core.info(chalk.bold.green('Exlint action completed successfully!'));
};

runExlint();
