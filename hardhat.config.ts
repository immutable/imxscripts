require("@nomiclabs/hardhat-waffle");
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  paths: {
    sources: "./src/L1/contracts",
    artifacts: "./src/L1/artifacts"
  },
};

