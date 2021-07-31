const fs = require("fs");
const DEBUG = false;

function debug(text) {
  if (DEBUG) {
    console.log(text);
  }
}

task(
    "generate",
    "Create a mnemonic for builder deploys",
    async (_, { ethers }) => {
      const bip39 = require("bip39");
      const hdkey = require("ethereumjs-wallet/hdkey");
      const mnemonic = bip39.generateMnemonic();
      if (DEBUG) console.log("mnemonic", mnemonic);
      const seed = await bip39.mnemonicToSeed(mnemonic);
      if (DEBUG) console.log("seed", seed);
      const hdwallet = hdkey.fromMasterSeed(seed);
      const wallet_hdpath = "m/44'/60'/0'/0/";
      const account_index = 0;
      let fullPath = wallet_hdpath + account_index;
      if (DEBUG) console.log("fullPath", fullPath);
      const wallet = hdwallet.derivePath(fullPath).getWallet();
      const privateKey = "0x" + wallet._privKey.toString("hex");
      if (DEBUG) console.log("privateKey", privateKey);
      var EthUtil = require("ethereumjs-util");
      const address =
        "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");
      console.log(
        "🔐 Account Generated as " +
          address +
          " and set as mnemonic in packages/hardhat"
      );
      console.log(
        "💬 Use 'yarn run account' to get more information about the deployment account."
      );
  
      fs.writeFileSync("./" + address + ".txt", mnemonic.toString());
      fs.writeFileSync("./mnemonic.txt", mnemonic.toString());
    }
  );
  
  task(
    "account",
    "Get balance informations for the deployment account.",
    async (_, { ethers }) => {
      const hdkey = require("ethereumjs-wallet/hdkey");
      const bip39 = require("bip39");
      let mnemonic = fs.readFileSync("./mnemonic.txt").toString().trim();
      if (DEBUG) console.log("mnemonic", mnemonic);
      const seed = await bip39.mnemonicToSeed(mnemonic);
      if (DEBUG) console.log("seed", seed);
      const hdwallet = hdkey.fromMasterSeed(seed);
      const wallet_hdpath = "m/44'/60'/0'/0/";
      const account_index = 0;
      let fullPath = wallet_hdpath + account_index;
      if (DEBUG) console.log("fullPath", fullPath);
      const wallet = hdwallet.derivePath(fullPath).getWallet();
      const privateKey = "0x" + wallet._privKey.toString("hex");
      if (DEBUG) console.log("privateKey", privateKey);
      var EthUtil = require("ethereumjs-util");
      const address =
        "0x" + EthUtil.privateToAddress(wallet._privKey).toString("hex");
  
      var qrcode = require("qrcode-terminal");
      qrcode.generate(address);
      console.log("‍📬 Deployer Account is " + address);
      for (let n in config.networks) {
        //console.log(config.networks[n],n)
        try {
          let provider = new ethers.providers.JsonRpcProvider(
            config.networks[n].url
          );
          let balance = await provider.getBalance(address);
          console.log(" -- " + n + " --  -- -- 📡 ");
          console.log("   balance: " + ethers.utils.formatEther(balance));
          console.log(
            "   nonce: " + (await provider.getTransactionCount(address))
          );
        } catch (e) {
          if (DEBUG) {
            console.log(e);
          }
        }
      }
    }
  );