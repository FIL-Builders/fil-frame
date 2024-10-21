import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";
import { YourContract } from "../typechain-types";

describe("YourContract", function () {
  let yourContract: YourContract;
  let owner: Signer, addr1: Signer, addr2: Signer;
  let ownerAddress: string, addr1Address: string, addr2Address: string;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    addr1Address = await addr1.getAddress();
    addr2Address = await addr2.getAddress();

    // Deploy the contract
    const YourContractFactory = await ethers.getContractFactory("YourContract");
    yourContract = (await YourContractFactory.deploy(ownerAddress)) as YourContract;
    await yourContract.waitForDeployment();
  });

  it("should be deployed with the correct owner and initial greeting", async function () {
    expect(await yourContract.owner()).to.equal(ownerAddress);
    expect(await yourContract.greeting()).to.equal("Building Unstoppable Apps!!!");
  });

  it("should allow changing the greeting and track counters", async function () {
    // addr1 sets a new greeting
    const newGreeting = "Hello, blockchain!";
    await yourContract.connect(addr1).setGreeting(newGreeting);

    // Check that the greeting is updated
    expect(await yourContract.greeting()).to.equal(newGreeting);

    // Check counters
    expect(await yourContract.totalCounter()).to.equal(1);
    expect(await yourContract.userGreetingCounter(addr1Address)).to.equal(1);
  });

  it("should emit the correct event when greeting is changed", async function () {
    const newGreeting = "Hello, world!";
    await expect(yourContract.connect(addr1).setGreeting(newGreeting, { value: ethers.parseEther("0.1") }))
      .to.emit(yourContract, "GreetingChange")
      .withArgs(addr1Address, newGreeting, true, ethers.parseEther("0.1"));
  });

  it("should set the premium flag when ETH is sent", async function () {
    // Change greeting without ETH
    await yourContract.connect(addr1).setGreeting("No ETH");
    expect(await yourContract.premium()).to.be.false;

    // Change greeting with ETH
    await yourContract.connect(addr1).setGreeting("With ETH", { value: ethers.parseEther("0.1") });
    expect(await yourContract.premium()).to.be.true;
  });

  it("should allow only the owner to withdraw Ether", async function () {
    // addr1 sends ETH to the contract
    await yourContract.connect(addr1).setGreeting("With ETH", { value: ethers.parseEther("1") });

    // Ensure the contract has received the ETH
    const contractBalance = await ethers.provider.getBalance(await yourContract.getAddress());
    expect(contractBalance).to.equal(ethers.parseEther("1"));

    // Attempt to withdraw by non-owner (should fail)
    await expect(yourContract.connect(addr1).withdraw()).to.be.revertedWith("Not the Owner");

    // Withdraw by owner (should succeed)
    const ownerBalanceBefore = await ethers.provider.getBalance(ownerAddress);
    const tx = await yourContract.connect(owner).withdraw();
    const receipt = await tx.wait();

    // Calculate gas used
    //@ts-ignore
    const gasUsed = receipt?.gasUsed * receipt?.gasPrice;

    const ownerBalanceAfter = await ethers.provider.getBalance(ownerAddress);
    expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + BigInt(ethers.parseEther("1")) - gasUsed);
  });

  it("should receive Ether using the fallback function", async function () {
    // Send ETH directly to the contract using the fallback function
    await addr1.sendTransaction({
      to: await yourContract.getAddress(),
      value: ethers.parseEther("0.5"),
    });

    // Verify the contract received the Ether
    const contractBalance = await ethers.provider.getBalance(await yourContract.getAddress());
    expect(contractBalance).to.equal(ethers.parseEther("0.5"));
  });
});
