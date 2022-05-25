import { transferNFT } from "../utils/postHelpers/transfer-NFT";
import { transferETH } from "../utils/postHelpers/transfer-ETH";
import { sellNFT } from "../utils/postHelpers/create-NFT-ETH-sell-order";
import { buyNFT } from "../utils/postHelpers/create-buy-order";

import * as readline from 'readline';
import { exit } from "process";
//user_1
var user1_pk = "5890dcd2f798c2e3142589c251935f08383a7cfd5f04467b8c44d702fcde3881";
var user1_adr = "0xF5B30f22A1D2684c8774eF0C2AEb1Bb3a8873177";
//user_2
var user2_pk = "cba251a34eb62a10016cf9d922e721ee763165804ee59c06e1608d4edb7a5968";
var user2_adr = "0x0c9e9FfB43568897DCD2b05Da63Ac78E5563d9C8";
//escrow_1
var escrow1_pk = "acfe687b64ff4c691b3702deb3c39dfeb8fb7c88a8591a4760def9085f435ad5";
var escrow1_adr = "0x9070741ed81C59Fb9A602093aAeFD3eE09146E2E";
//escrow_2
var escrow2_pk = "55bfc1d54aac729f7f3a3b4ab30ad395a33b3b7cbb7fe7551de8d7a32fe5609b";
var escrow2_adr = "0xa9136785f9B4FF3daCD87dbB5eB229F239C01616"

var amount = ".0001";
var tokenAddress = "0xc11bf57D37d88565E894eFC6e3f5292E50c32b5B";
var tokenid1 = "3";
var tokenid2 = "4";
var saleAmount = "100000000";

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

async function accept (){
    //(4.accept) escrow_wallet1 trade to user_2 
    const result3 = await sellNFT(escrow1_pk, tokenAddress, tokenid1, saleAmount, "ropsten");
    console.log("escrow_wallet_1 sell order open: ", result3);
    const result4 = await buyNFT(user2_pk, tokenid1, tokenAddress, saleAmount, result3.order_id, "ropsten");
    console.log("user_2 buy from escrow_wallet_1", result4);
    
    //(4.accept) escrow_wallet2 trade to user_1
    const result5 = await sellNFT(escrow2_pk, tokenAddress, tokenid2, saleAmount, "ropsten");
    console.log("escrow_wallet_2 sell order open: ", result5);
    const result6 = await buyNFT(user1_pk, tokenid2, tokenAddress, saleAmount, result5.order_id, "ropsten");
    console.log("user_2 buy from escrow_wallet_1", result6);
    exit;
}

async function deny (){
    //(1) user_1 transfer NFT to escrow_wallet_1 
    const result1 = await transferNFT(escrow1_pk, user1_adr, tokenid1, tokenAddress, "ropsten");
    console.log("user_1 transfer NFT to escrow_wallet_1: ", result1);

    //(2) user_2 transfer NFT to escrow_wallet_2 
    const result2 = await transferNFT(escrow2_pk, user2_adr, tokenid2, tokenAddress, "ropsten");
    console.log("user_2 transfer NFT to escrow_wallet_2: ", result2);
    exit;
}


async function main (){
    //(1) user_1 transfer NFT to escrow_wallet_1 
    const result1 = await transferNFT(user1_pk, escrow1_adr, tokenid1, tokenAddress, "ropsten");
    console.log("user_1 transfer NFT to escrow_wallet_1: ", result1);

    //(2) user_2 transfer NFT to escrow_wallet_2 
    const result2 = await transferNFT(user2_pk, escrow2_adr, tokenid2, tokenAddress, "ropsten");
    console.log("user_2 transfer NFT to escrow_wallet_2: ", result2);

    //(3) Logic to accept/deny the trade. Example uses simple switch statement
    rl.question('Execute this trade? [y/n] ', (answer) => {
        switch(answer.toLowerCase()) {
          case 'y':
              accept();
            break;
          case 'n':
              deny();
            break;
          default:
            console.log('Invalid answer!');
        }
        rl.close();
      });
      
}

main();