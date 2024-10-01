// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IAxelarGateway } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";

contract OnRampSource is AxelarExecutable {
    struct Offer {
        bytes commP;
        uint64 size;
        string location;
        uint256 amount;
        IERC20 token;
    }

    event DataReady(Offer offer, uint64 id);
    uint64 private nextOfferId = 1;
    mapping(uint64 => Offer) public offers;

    IAxelarGasService public gasService;

    // Mappings for aggregation data
    mapping(uint64 => uint64[]) public aggregations;
    mapping(uint64 => address) public aggregationPayout;
    mapping(uint64 => bool) public provenAggregations;
    mapping(bytes => uint64) public commPToAggregateID;

    constructor(address gateway_, address gasService_) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasService_);
    }

    function offerData(
        Offer calldata offer,
        string calldata destinationChain,
        string calldata destinationAddress
    ) external payable returns (uint64) {

        uint64 id = nextOfferId++;
        offers[id] = offer;

        // Prepare payload
        bytes memory payload = abi.encode("DataReady", offer, id);

        // Pay for gas
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{ value: msg.value }(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }

        // Send message to destination chain
        gateway.callContract(destinationChain, destinationAddress, payload);

        emit DataReady(offer, id);
        return id;
    }

    // Handle incoming messages from the destination chain
    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        (string memory messageType, bytes memory data) = abi.decode(payload, (string, bytes));

        if (keccak256(bytes(messageType)) == keccak256(bytes("ProveDataStored"))) {
            bytes memory commP = data;

            uint64 aggID = commPToAggregateID[commP];
            require(aggID != 0, "Aggregate not found");

            // Transfer payments to the payout address
            for (uint256 i = 0; i < aggregations[aggID].length; i++) {
                uint64 offerID = aggregations[aggID][i];
                Offer storage offer = offers[offerID];
                require(
                    offer.token.transfer(aggregationPayout[aggID], offer.amount),
                    "Payment transfer failed"
                );
            }
            provenAggregations[aggID] = true;
        } else {
            revert("Unknown message type");
        }
    }
}

