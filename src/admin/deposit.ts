#!/usr/bin/env node
import yargs from 'yargs';
import { ethers, Wallet } from 'ethers';
import { ETHTokenType } from '@imtbl/imx-link-types';
import { getClient } from '../client';

require('dotenv').config();

/**
 * Deposit Eth from L1 into IMX (L2) for a single wallet. The environment
 * used in the deposit depends on the settings in the getClient call, and
 * the Eth provider used.
 */
async function deposit(ownerPrivateKey: string, amount: string): Promise<string> {
  const token = {
    type: ETHTokenType.ETH,
    data: {
      decimals: 18,
    }
  }
  const client = await getClient(ownerPrivateKey);
  const quantity = ethers.utils.parseEther(amount);
  return await client.deposit({
    user: await client.address,
    token,
    quantity
  });
}

async function main(ownerPrivateKey: string, amount: string) {
  const response = await deposit(ownerPrivateKey, amount);
  console.log(`Deposit Tx: ${JSON.stringify(response)}`);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <wallet_private_key> -a <amount>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'eth amount', type: 'string', demandOption: true }
  })
  .parseSync();

main(argv.k, argv.a)
  .then(() => { console.log('Deposit complete.')
})

  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });