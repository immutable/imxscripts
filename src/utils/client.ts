import { ethers, Wallet } from 'ethers';
import { ImmutableXClient } from '@imtbl/imx-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Return the ImmutableXClient for a given user (i.e. wallet). This is
 * used to sign the corresponding requests.s
 * @param privateKey - Ethereum wallet private key
 * @param gasLimit - maximum amount of Gas that a user is willing to pay for performing this action or confirming a transaction (a minimum of 21,000)
 * @param gasPrice - price of Gas (Gas Price) is the amount of Gwei that the user is willing to spend on each unit of Gas
 */
export async function getClient(network: string, privateKey?: string)
  : Promise<ImmutableXClient> {
      const provider = new ethers.providers.JsonRpcProvider((network == "ropsten") ? process.env.ROPSTEN_ETH_PROVIDER_URL : process.env.MAINNET_ETH_PROVIDER_URL);
      const signer = privateKey ? new Wallet(privateKey).connect(provider) : undefined
      return await ImmutableXClient.build({ 
        publicApiUrl: (network == "ropsten") ? process.env.ROPSTEN_ENV_URL! : process.env.MAINNET_ENV_URL!,
        signer,
        starkContractAddress: (network == "ropsten") ? process.env.ROPSTEN_STARK_CONTRACT_ADDRESS : undefined,
        registrationContractAddress: (network == "ropsten") ? process.env.ROPSTEN_REGISTRATION_CONTRACT_ADDRESS : undefined,
        //gasLimit: '80000',
        //gasPrice: '2000000000'
  })
}