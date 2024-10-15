// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {MarketAPI} from "filecoin-solidity-api/contracts/v0.8/MarketAPI.sol";
import {MarketTypes} from "filecoin-solidity-api/contracts/v0.8/types/MarketTypes.sol";
import {CommonTypes} from "filecoin-solidity-api/contracts/v0.8/types/CommonTypes.sol";

contract DealInfo {
    struct DealData {
        CommonTypes.DealLabel dealLabel;
        uint64 dealClientActorId;
        uint64 dealProviderActorId;
        MarketTypes.GetDealDataCommitmentReturn dealCommitment;
        MarketTypes.GetDealTermReturn dealTerm;
        CommonTypes.BigInt dealPricePerEpoch;
        CommonTypes.BigInt clientCollateral;
        CommonTypes.BigInt providerCollateral;
        bool isDealActivated;
        MarketTypes.GetDealActivationReturn activationStatus;
    }

    function getDealLabel(
        uint64 dealId
    ) public view returns (CommonTypes.DealLabel memory) {
        (, CommonTypes.DealLabel memory dealLabel) = MarketAPI.getDealLabel(
            dealId
        );
        return dealLabel;
    }

    function getDealClient(uint64 dealId) public view returns (uint64) {
        (, uint64 dealClientActorId) = MarketAPI.getDealClient(dealId);
        return dealClientActorId;
    }

    function getDealProvider(uint64 dealId) public view returns (uint64) {
        (, uint64 dealProviderActorId) = MarketAPI.getDealProvider(dealId);
        return dealProviderActorId;
    }

    function getDealCommitment(
        uint64 dealId
    ) public view returns (MarketTypes.GetDealDataCommitmentReturn memory) {
        (
            ,
            MarketTypes.GetDealDataCommitmentReturn memory dealCommitment
        ) = MarketAPI.getDealDataCommitment(dealId);
        return dealCommitment;
    }

    function getDealTerm(
        uint64 dealId
    ) public view returns (MarketTypes.GetDealTermReturn memory) {
        (, MarketTypes.GetDealTermReturn memory dealTerm) = MarketAPI
            .getDealTerm(dealId);
        return dealTerm;
    }

    function getDealTotalPrice(
        uint64 dealId
    ) public view returns (CommonTypes.BigInt memory) {
        (, CommonTypes.BigInt memory dealPricePerEpoch) = MarketAPI
            .getDealTotalPrice(dealId);
        return dealPricePerEpoch;
    }

    function getClientCollateral(
        uint64 dealId
    ) public view returns (CommonTypes.BigInt memory) {
        (, CommonTypes.BigInt memory clientCollateral) = MarketAPI
            .getDealClientCollateral(dealId);
        return clientCollateral;
    }

    function getProviderCollateral(
        uint64 dealId
    ) public view returns (CommonTypes.BigInt memory) {
        (, CommonTypes.BigInt memory providerCollateral) = MarketAPI
            .getDealProviderCollateral(dealId);
        return providerCollateral;
    }

    function getDealVerification(uint64 dealId) public view returns (bool) {
        (, bool isDealActivated) = MarketAPI.getDealVerified(dealId);
        return isDealActivated;
    }

    function getDealActivationStatus(
        uint64 dealId
    ) public view returns (MarketTypes.GetDealActivationReturn memory) {
        (
            ,
            MarketTypes.GetDealActivationReturn memory activationStatus
        ) = MarketAPI.getDealActivation(dealId);
        return activationStatus;
    }

    function getAllDealData(
        uint64 dealId
    ) public view returns (DealData memory) {
        return
            DealData(
                getDealLabel(dealId),
                getDealClient(dealId),
                getDealProvider(dealId),
                getDealCommitment(dealId),
                getDealTerm(dealId),
                getDealTotalPrice(dealId),
                getClientCollateral(dealId),
                getProviderCollateral(dealId),
                getDealVerification(dealId),
                getDealActivationStatus(dealId)
            );
    }
}
