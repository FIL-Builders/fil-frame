//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

contract YourContract {
    IAxelarGateway public gateway;
    IAxelarGasService public gasReceiver;

    // Gateway and gasReceiver addresses for Axelar network
    constructor(address gateway_, address gasReceiver_) {
        gateway = IAxelarGateway(gateway_);
        gasReceiver = IAxelarGasService(gasReceiver_);
    }

    // Sends a message from FIL to ETH
    function sendMessage(
        string memory destinationChain,  // ETH
        string memory destinationAddress, // The receiving contract on Ethereum
        string memory message             // Message you want to send
    ) external payable {
        bytes memory payload = abi.encode(message);

        // Pay for gas service, essential for sending cross-chain messages
        gasReceiver.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );

        // Call the gateway to send the message to the destination chain
        gateway.callContract(destinationChain, destinationAddress, payload);
    }
}