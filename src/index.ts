import * as core from '@actions/core';
import exec from '@actions/exec';
import http from '@actions/http-client';
import chalk from 'chalk';
import { Netrc } from 'netrc-parser';

import type { IVerifyCliTokenResponseBody } from './interfaces/responses';
import { CLI_API_DOMAIN, CLI_API_URL } from './constants/cli-api';

const exlintCliToken = core.getInput('token');
const exlintGroupId = core.getInput('groupId');
const httpClient = new http.HttpClient('exlint-http-client');

(async () => {
	try {
		core.info('Trying to authenticate Exlint');

		const verifyCliTokenResponse = await httpClient.get(`${CLI_API_URL}/user/auth/verify-token`, {
			Authorization: `Bearer ${exlintCliToken}`,
		});

		if (verifyCliTokenResponse.message.statusCode !== 200) {
			core.debug(
				`Failed to authenticate Exlint with http response:\n${JSON.stringify(
					verifyCliTokenResponse,
					null,
					2,
				)}`,
			);
			core.setFailed(chalk.bold.red('Exlint failed to authenticate with provided token'));

			return;
		}

		const verifyCliTokenResponseBody = await verifyCliTokenResponse.readBody();

		const parsedVerifyCliTokenResponseBody: IVerifyCliTokenResponseBody =
			JSON.parse(verifyCliTokenResponseBody);

		const netrc = new Netrc();

		await netrc.load();

		const newMachines = {
			...netrc.machines,
			[CLI_API_DOMAIN]: {
				login: parsedVerifyCliTokenResponseBody.email,
				password: exlintCliToken,
			},
		};

		netrc.machines = newMachines;

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

	core.info(chalk.bold.green('Exlint action ran successfully!'));
})();
