// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { MarketTypes } from "filecoin-solidity-api/contracts/v0.8/types/MarketTypes.sol";
import { CommonTypes } from "filecoin-solidity-api/contracts/v0.8/types/CommonTypes.sol";

contract MockMarketAPI {
	function getDealLabel(
		uint64 dealId
	) external pure returns (int256, CommonTypes.DealLabel memory) {
		return (0, CommonTypes.DealLabel("test-label", true));
	}

	function getDealClient(
		uint64 dealId
	) external pure returns (int256, uint64) {
		return (0, 1);
	}

	function getDealProvider(
		uint64 dealId
	) external pure returns (int256, uint64) {
		return (0, 1);
	}

	function getDealDataCommitment(
		uint64 dealId
	)
		external
		pure
		returns (int256, MarketTypes.GetDealDataCommitmentReturn memory)
	{
		return (
			0,
			MarketTypes.GetDealDataCommitmentReturn(bytes("test"), 1048576)
		);
	}

	function getDealTerm(
		uint64 dealId
	) external pure returns (int256, MarketTypes.GetDealTermReturn memory) {
		CommonTypes.ChainEpoch startEpoch = CommonTypes.ChainEpoch.wrap(100000);
		CommonTypes.ChainEpoch endEpoch = CommonTypes.ChainEpoch.wrap(200000);
		return (0, MarketTypes.GetDealTermReturn(startEpoch, endEpoch));
	}

	function getDealTotalPrice(
		uint64 dealId
	) external pure returns (int256, CommonTypes.BigInt memory) {
		bytes memory value = bytes("1000000000");
		bool neg = false;
		return (0, CommonTypes.BigInt(value, neg));
	}

	function getDealClientCollateral(
		uint64 dealId
	) external pure returns (int256, CommonTypes.BigInt memory) {
		bytes memory value = bytes("100000000");
		bool neg = false;
		return (0, CommonTypes.BigInt(value, neg));
	}

	function getDealProviderCollateral(
		uint64 dealId
	) external pure returns (int256, CommonTypes.BigInt memory) {
		bytes memory value = bytes("100000000");
		bool neg = false;
		return (0, CommonTypes.BigInt(value, neg));
	}

	function getDealVerified(
		uint64 dealId
	) external pure returns (int256, bool) {
		return (0, false);
	}

	function getDealActivation(
		uint64 dealId
	)
		external
		pure
		returns (int256, MarketTypes.GetDealActivationReturn memory)
	{
		CommonTypes.ChainEpoch activated = CommonTypes.ChainEpoch.wrap(100000);
		CommonTypes.ChainEpoch terminated = CommonTypes.ChainEpoch.wrap(0);
		return (0, MarketTypes.GetDealActivationReturn(activated, terminated));
	}

	function addBalance(
		bytes memory addr,
		uint256 value
	) external pure returns (int256) {
		return 0;
	}

	function withdrawBalance(
		MarketTypes.WithdrawBalanceParams memory params
	) external pure returns (int256, CommonTypes.BigInt memory) {
		bytes memory value = bytes("100000000");
		bool neg = false;
		return (0, CommonTypes.BigInt(value, neg));
	}
}
