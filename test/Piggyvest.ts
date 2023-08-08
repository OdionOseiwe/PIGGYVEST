import {time,loadFixture,} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
import { expect } from "chai";
import { ethers } from "hardhat";
import { log } from "console";

describe("Piggyvest", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployPiggyvest() {
    const ONE_YEAR_IN_SECS = 24 * 60 * 60;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    const wrongTime = (await time.latest()) - ONE_YEAR_IN_SECS;


    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const OD_testToken = await ethers.getContractFactory("OD_testToken");
    const od_testToken = await OD_testToken.deploy();

    const ODUSD = await ethers.getContractFactory("ODUSD");
    const odUSD = await ODUSD.deploy();

    const uRouter = new ethers.Contract('0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', IUniswapV2Router02.abi, owner);

    const Piggyvest = await ethers.getContractFactory("Piggyvest");
    const piggyvest = await Piggyvest.deploy(await od_testToken.getAddress(), await odUSD.getAddress());

    // const Create_pool = await ethers.getContractFactory("Pool");
    // const create_pool = await Create_pool.deploy();

    return {wrongTime, piggyvest, owner, otherAccount, odUSD, od_testToken, unlockTime, uRouter};
    
  }

  describe("Deployment", function () {

    it("create a pool and liquidity", async function () {

      const { owner, odUSD, od_testToken, uRouter } = await loadFixture(deployPiggyvest);
      const deadline = await time.latest() + 60;
      const amount = ethers.parseEther("20.0");

      await odUSD.approve(await uRouter.getAddress(), amount);
      await od_testToken.approve(await uRouter.getAddress(), amount);

      // owner.call(await create_pool.createPool(await od_testToken.getAddress(), await odUSD.getAddress(), await owner.getAddress()))
      owner.call(await uRouter.addLiquidity(await od_testToken.getAddress(), await odUSD.getAddress(),amount, amount, 0,0,await owner.getAddress(), deadline));
   
    })

    it("Should deploy Piggyvest and set timelock", async function () {
      const { piggyvest, owner, unlockTime } = await loadFixture(deployPiggyvest);
      owner.call( await piggyvest.changeTimeLock(unlockTime));      
    });

    it("Should revert when called with another address ", async function () {
      const { piggyvest, unlockTime, otherAccount } = await loadFixture(deployPiggyvest);

      expect(await otherAccount.call((await piggyvest.changeTimeLock(unlockTime)))).to.be.reverted;
    });

    it("expect the timelock to be set" , async function  () {
      const { piggyvest, unlockTime,otherAccount  } = await loadFixture(deployPiggyvest);
      otherAccount.call( await piggyvest.changeTimeLock(unlockTime));
      expect(await piggyvest.timeLock()).to.equal(unlockTime);
    });

    it("expect the timelock to revert because its past" , async function  () {
      const { piggyvest , wrongTime } = await loadFixture(deployPiggyvest);
      expect(await piggyvest.changeTimeLock(wrongTime)).to.be.reverted;

    });
  });

  describe("Transfers", function () {
      it("Should transfer the ether into the contract", async function () {
        const { piggyvest,otherAccount  } = await loadFixture(deployPiggyvest);

       otherAccount.call(await piggyvest.depositeEther( {value: ethers.parseUnits("1.0", 18)}));

      });

      it("Should transfer the ERC20 into the contract", async function () {
        const { piggyvest,otherAccount, od_testToken  } = await loadFixture(deployPiggyvest);
        await od_testToken.transfer(otherAccount, ethers.parseUnits("2.0", 10));

        expect(await od_testToken.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("2.0", 10));
        otherAccount.call( await od_testToken.approve(piggyvest.getAddress(),ethers.parseUnits("2.0", 10)));

        otherAccount.call(await piggyvest.depositeERC20Tokens(ethers.parseUnits("2.0", 9)));

        const bal =  await od_testToken.balanceOf(piggyvest.getAddress());
        console.log(`it is the balance of the piggyvest ${bal} after transfering`);
      });
    });

    describe("reverts with error", function () {
      it("Should revert with Did not desposit",  async function (){
        const { piggyvest,otherAccount, od_testToken , unlockTime } = await loadFixture(deployPiggyvest);
        await od_testToken.transfer(otherAccount, ethers.parseUnits("2.0", 10));

        expect(await od_testToken.balanceOf(otherAccount.address)).to.be.equal(ethers.parseUnits("2.0", 10));
        otherAccount.call( await od_testToken.approve(piggyvest.getAddress(),ethers.parseUnits("2.0", 10)));

        otherAccount.call( await piggyvest.depositeERC20Tokens(ethers.parseUnits("2.0", 9)));
        await time.increaseTo(unlockTime);
        expect(await piggyvest.withdrawToken()).to.be.revertedWith("Did not deposit");

      })
    })

  describe("Withdrawals", function () {
    describe("Events", function () {
      it("Should emit an event on withdrawals Ether", async function () {
        const { piggyvest, owner, unlockTime ,otherAccount} = await loadFixture(deployPiggyvest);

       otherAccount.call(await piggyvest.depositeEther( {value: ethers.parseUnits("2.0", 18)}));
        await time.increaseTo(unlockTime);

        otherAccount.call(await piggyvest.withdrawEther());
          // .to.emit(piggyvest, "withdrawal")
          // .withArgs(owner.address,0 ) // We accept any value as `when` arg
      });

      // it("Should emit an event on withdrawals ", async function () {
      //   const { piggyvest, owner, unlockTime, otherAccount, od_testToken } = await loadFixture(deployPiggyvest);
      //   const amountToken = ethers.parseUnits("2.0", 3);
      //   await od_testToken.transfer(otherAccount,amountToken );

      //   expect(await od_testToken.balanceOf(otherAccount.address)).to.be.equal(amountToken);
      //   otherAccount.call( await od_testToken.approve(piggyvest.getAddress(),amountToken));

      //   otherAccount.call(await piggyvest.depositeERC20Tokens(amountToken));

      //   const bal =  await od_testToken.balanceOf(piggyvest.getAddress());
      //   console.log(`it is the balance of the piggyvest ${bal}`);
      //   await time.increaseTo(unlockTime);
      //   // let amount = await piggyvest.userTokens(await owner.getAddress())
      //   // console.log(amount);
      //   otherAccount.call( await piggyvest.withdrawToken());
      //     // .to.emit(piggyvest, "withdrawal")
      //     // .withArgs(owner.address,amount ) // We accept any value as `when` arg
      // });
    });
  });
  
});
