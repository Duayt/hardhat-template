import { ethers, getNamedAccounts, deployments, getUnnamedAccounts } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TestToken } from "../typechain";
import { Wallet } from "ethers";
import { setupUser, setupUsers } from './utils';

chai.use(solidity);
const { expect } = chai;

const setupTest = deployments.createFixture(async ({ deployments, getNamedAccounts, ethers }, options) => {
  await deployments.fixture(['token']); // ensure you start from a fresh deployments
  const { deployer } = await getNamedAccounts();
  // const TokenContract = await deployments.get("TestToken");
  // const tokenContract = await ethers.getContractAt('TestToken', TokenContract.address)
  const contracts = {
    tokenContract: <TestToken>await ethers.getContract('TestToken'),
  };

  const users = await setupUsers(await getUnnamedAccounts(), contracts);
  return {
    ...contracts,
    users,
    deployer: await setupUser(deployer, contracts),
  };
});

describe("Token", () => {
  // beforeEach(async () => {
  //   // const [deployer] = await ethers.getSigners();


  //   // const tokenFactory = new TestToken__factory(deployer);



  //   tokenAddress = tokenContract.address;

  //   expect(await tokenContract.totalSupply()).to.eq(0);

  // });
  describe("Mint", async () => {
    it("Should mint some tokens", async () => {
      const {deployer,users} = await setupTest();
      const toMint = ethers.utils.parseEther("1");
      await deployer.tokenContract.mint(users[0].address, toMint);
      expect(await deployer.tokenContract.totalSupply()).to.eq(toMint);
    });
  });

  describe("Transfer", async () => {
    it("Should transfer tokens between users", async () => {
      const {deployer,users,tokenContract} = await setupTest();
      const deployerInstance = deployer.tokenContract;
      const toMint = ethers.utils.parseEther("1");

      await deployerInstance.mint(users[0].address, toMint);
      expect(await deployerInstance.balanceOf(users[0].address)).to.eq(toMint);

      const senderInstance = users[0].tokenContract;
      const toSend = ethers.utils.parseEther("0.4");
      await senderInstance.transfer(users[1].address, toSend);

      expect(await senderInstance.balanceOf(users[1].address)).to.eq(toSend);
    });

    it("Should fail to transfer with low balance", async () => {
      const {deployer,users,tokenContract} = await setupTest();
      const deployerInstance = deployer.tokenContract;
      const toMint = ethers.utils.parseEther("1");

      await deployerInstance.mint(users[0].address, toMint);
      expect(await deployerInstance.balanceOf(users[0].address)).to.eq(toMint);

      const senderInstance = users[0].tokenContract;
      const toSend = ethers.utils.parseEther("1.1");

      // Notice await is on the expect
      await expect(senderInstance.transfer(users[1].address, toSend)).to.be.revertedWith(
        "transfer amount exceeds balance",
      );
    });
  });
});
