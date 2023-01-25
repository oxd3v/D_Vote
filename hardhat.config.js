require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("@openzeppelin/hardhat-upgrades");
// require(`@type/solidity-coverage`);
require("dotenv").config();
const ALCHEMY_RPC_URL = process.env.ALCHEMY_HTTP_URL;
const P_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API = process.env.COINMARKETCAP_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [{ version: "0.8.17" }],
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337, // use31337 as hardhat local chainId
    },
    goerli: {
      chainId: 5,
      url: ALCHEMY_RPC_URL,
      accounts: [P_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    noColors: true,
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    //using coinmarketcap API
    coinmarketcap: process.env.COINMARKETCAP_API,
  },
};
