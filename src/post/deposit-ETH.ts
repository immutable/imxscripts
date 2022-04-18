#!/usr/bin/env node
import yargs from 'yargs';
import { ethers } from 'ethers';
import { ETHTokenType } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';

require('dotenv').config();

/**
 * Deposit Eth from L1 into IMX (L2) for a single wallet. The environment
 * used in the deposit depends on the settings in the getClient call, and
 * the Eth provider used.
 */
async function depositETH(ownerPrivateKey: string, amount: string, network: string): Promise<string> {
  const client = await getClient(network, ownerPrivateKey);
  const quantity = ethers.utils.parseEther(amount);
  return await client.deposit({
    user: await client.address,
    token: {
      type: ETHTokenType.ETH,
      data: {
        decimals: 18,
      }
    },
    quantity
  });
}

async function main(ownerPrivateKey: string, amount: string, network:string) {
    const response = await depositETH(ownerPrivateKey, amount, network);
    console.log(`ETH deposit Tx: ${JSON.stringify(response)}`);
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -a <AMOUNT>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    a: { describe: 'ETH amount', type: 'string', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.a, argv.network)
  .then(() => { 
})
  .catch(err => {
    console.error('Deposit failed.')
    console.error(err);
    process.exit(1);
  });