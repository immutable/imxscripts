#!/usr/bin/env node

import yargs from 'yargs';
import { ImmutableXClient } from '@imtbl/imx-link-lib';

/**
 * Returns the ImmutableXClient which points to the Ropsten environment.
 * @returns Promise<ImmutableXClient>
 */
 async function getClient(): Promise<ImmutableXClient> {
  return await ImmutableXClient.build({ publicApiUrl: 'https://api.ropsten.x.immutable.com/v1' });
}

/**
 * Return the users current asset holding.
 */
async function getUserAssets(address: string): Promise<void> {
  const client = await getClient();
  const response = await client.getAssets({ user: address });
  if (response.result.length === 0) {
    console.log('User has no assets.');
  }
  for (const asset of response.result) {
    console.log(`Asset ID: ${asset.id}, Name: ${asset.name}`);
  }
}

async function main(walletAddress: string): Promise<void> {
  await getUserAssets(walletAddress);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -a <address>')
  .options({ a: { alias: 'address', describe: 'wallet address', type: 'string', demandOption: true }})
  .parseSync();

main(argv.a)
  .then(() => console.log('Asset retrieve complete.'))
  .catch(err => console.error(err));
