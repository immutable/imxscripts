#!/usr/bin/env node

import yargs from 'yargs';
import { ethers } from 'ethers';
import { ERC721TokenType, ETHTokenType, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { getClient } from '../utils/client';


async function buyNFT(ownerPrivateKey: string, tokenAddress: string, tokenId: string, saleAmount: string, orderId: number, network: string): Promise<ImmutableMethodResults.ImmutableCreateTradeResult> {
    const client = await getClient(network, ownerPrivateKey);
    return client.createTrade ({
        orderId: orderId,
        user: client.address,
        tokenBuy: {
            type: ERC721TokenType.ERC721,
            data: {
                tokenAddress: tokenAddress,
                tokenId: tokenId
            },
        },
        amountBuy: ethers.BigNumber.from('1'),
        tokenSell: {
            type: ETHTokenType.ETH,
            data: {
                decimals: 18,
            },
        },
        amountSell: ethers.BigNumber.from(saleAmount)
    })
}

async function main(ownerPrivateKey: string, tokenAddress: string, tokenId: string, saleAmount: string, orderId: number, network:string): Promise<void> {
    // Transfer the token to the administrator
    const result = await buyNFT(ownerPrivateKey, tokenId, tokenAddress, saleAmount, orderId, network);
    console.log(result)
}

const argv = yargs(process.argv.slice(2))
  .usage('Usage: -k <PRIVATE_KEY> -t <TOKEN_ID> -s <SMART_CONTRACT_ADDRESS> -o <ORDER_ID> --network <NETWORK>')
  .options({
    k: { describe: 'wallet private key', type: 'string', demandOption: true },
    t: { describe: 'token id', type: 'string', demandOption: true },
    s: { describe: 'smart contract address', type: 'string', demandOption: true },
    a: { describe: 'sale amount', type: 'string', demandOption: true },
    o: { describe: 'order id', type: 'number', demandOption: true },
    network: { describe: 'network. ropsten or mainnet', type: 'string', demandOption: true}
  })
  .parseSync();

main(argv.k, argv.t, argv.s, argv.a, argv.o, argv.network)
  .then(() => console.log('Buy order created'))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });