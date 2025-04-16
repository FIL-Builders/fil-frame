import { DealClient, DealInfo } from "../typechain-types";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Deal Contracts", function () {
  // Increase timeout for tests
  this.timeout(50000);

  async function deployContractsFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy mock MarketAPI contract first
    const MockMarketAPI = await ethers.getContractFactory("MockMarketAPI");
    const mockMarketAPI = await MockMarketAPI.deploy();

    // Deploy DealInfo contract
    const DealInfo = await ethers.getContractFactory("DealInfo");
    const dealInfo: DealInfo = await DealInfo.deploy();

    // Deploy DealClient contract
    const DealClient = await ethers.getContractFactory("DealClient");
    const dealClient: DealClient = await DealClient.deploy();

    // Mock data for tests
    const mockDealId = 1n;
    const mockPieceCID = "0x123456789abcdef";
    const mockDealRequest = {
      piece_cid: mockPieceCID,
      piece_size: 1048576n, // 1MB
      verified_deal: false,
      label: "test-deal",
      start_epoch: 100000n,
      end_epoch: 200000n,
      storage_price_per_epoch: ethers.parseEther("0.001"),
      provider_collateral: ethers.parseEther("0.1"),
      client_collateral: ethers.parseEther("0.05"),
      extra_params_version: 1n,
      extra_params: {
        location_ref: "https://example.com/data",
        car_size: 1048576n,
        skip_ipni_announce: false,
        remove_unsealed_copy: false,
      },
    };

    return {
      dealInfo,
      dealClient,
      mockMarketAPI,
      owner,
      addr1,
      addr2,
      mockDealId,
      mockPieceCID,
      mockDealRequest,
    };
  }

  describe("DealInfo Contract", function () {
    it("Should get deal label", async function () {
      const { dealInfo, mockDealId } = await deployContractsFixture();
      const dealLabel = await dealInfo.getDealLabel(mockDealId);
      expect(dealLabel).to.not.be.undefined;
    });

    it("Should get deal client", async function () {
      const { dealInfo, mockDealId } = await deployContractsFixture();
      const dealClientId = await dealInfo.getDealClient(mockDealId);
      expect(dealClientId).to.not.be.undefined;
    });

    it("Should get deal provider", async function () {
      const { dealInfo, mockDealId } = await deployContractsFixture();
      const dealProvider = await dealInfo.getDealProvider(mockDealId);
      expect(dealProvider).to.not.be.undefined;
    });

    it("Should get all deal data", async function () {
      const { dealInfo, mockDealId } = await deployContractsFixture();
      const allDealData = await dealInfo.getAllDealData(mockDealId);
      expect(allDealData).to.not.be.undefined;
      expect(allDealData.dealClientActorId).to.not.be.undefined;
      expect(allDealData.dealProviderActorId).to.not.be.undefined;
    });
  });

  describe("DealClient Contract", function () {
    it("Should set the right owner", async function () {
      const { dealClient, owner } = await deployContractsFixture();
      expect(await dealClient.owner()).to.equal(owner.address);
    });

    it("Should create a deal proposal", async function () {
      const { dealClient, mockDealRequest } = await deployContractsFixture();
      const tx = await dealClient.makeDealProposal(mockDealRequest);
      const receipt = await tx.wait();
      expect(receipt?.status).to.equal(1);

      // Check event emission
      const event = receipt?.logs[0];
      expect(event).to.not.be.undefined;
    });

    it("Should get deals length", async function () {
      const { dealClient, mockDealRequest } = await deployContractsFixture();
      await dealClient.makeDealProposal(mockDealRequest);
      const length = await dealClient.dealsLength();
      expect(length).to.equal(1n);
    });

    it("Should get deal by index", async function () {
      const { dealClient, mockDealRequest } = await deployContractsFixture();
      await dealClient.makeDealProposal(mockDealRequest);
      const deal = await dealClient.getDealByIndex(0);
      expect(deal.piece_cid).to.equal(mockDealRequest.piece_cid);
    });

    it("Should add balance", async function () {
      const { dealClient, owner } = await deployContractsFixture();
      const amount = ethers.parseEther("1.0");
      await expect(dealClient.connect(owner).addBalance(amount)).to.not.be.reverted;
    });

    it("Should fail to add balance if not owner", async function () {
      const { dealClient, addr1 } = await deployContractsFixture();
      const amount = ethers.parseEther("1.0");
      await expect(dealClient.connect(addr1).addBalance(amount)).to.be.revertedWith("msg.sender needs to be owner");
    });

    it("Should get provider set", async function () {
      const { dealClient, mockPieceCID } = await deployContractsFixture();
      const providerSet = await dealClient.getProviderSet(mockPieceCID);
      expect(providerSet.valid).to.equal(false);
    });

    it("Should get proposal ID set", async function () {
      const { dealClient, mockPieceCID } = await deployContractsFixture();
      const proposalSet = await dealClient.getProposalIdSet(mockPieceCID);
      expect(proposalSet.valid).to.equal(false);
    });
  });
});
