import { task } from "hardhat/config";

import { config as dotenvConfig } from "dotenv";
import { resolve } from "path";
dotenvConfig({ path: resolve(__dirname, "./.env") });

import { HardhatUserConfig } from "hardhat/types";
import { NetworkUserConfig } from "hardhat/types";

import 'hardhat-deploy';
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";

import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-etherscan";
import { networkConfig } from "./helper-hardhat-config";
import './tasks/node';

const chainIds: { [key: string]: number } = {
  ganache: 1337,
  goerli: 5,
  hardhat: 31337,
  kovan: 42,
  mainnet: 1,
  rinkeby: 4,
  ropsten: 3,
  bsctest: 97,
  bsc: 56,
};

const MNEMONIC = process.env.MNEMONIC || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const ALCHEMY_KEY = process.env.ALCHEMY_KEY || "";
const MORALIS_API = process.env.MORALIS_API || "";
const FORK_BLOCK_NUMBER = process.env.FORK_BLOCK_NUMBER || "";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.hardhat,
    },
    bsctest: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.bsctest,
      url: networkConfig[chainIds.bsctest].url
    },
    mainnet: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.mainnet,
      url: networkConfig[chainIds.mainnet].url
    },
    bscmain: {
      accounts: {
        mnemonic: MNEMONIC,
      },
      chainId: chainIds.bsc,
      url: networkConfig[chainIds.bsc].url
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
      },
      {
        version: "0.5.17",
      }
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    // enabled: process.env.REPORT_GAS ? true : false,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0 // mainnet
    }
  }
};

export default config;
