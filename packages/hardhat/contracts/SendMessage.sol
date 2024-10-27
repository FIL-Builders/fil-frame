// SPDX-License-Identifier: MIT
// SPDX license identifier specifies which open-source license is being used for the contract
pragma solidity 0.8.9;

import { AxelarExecutable } from '../../../node_modules/@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGateway } from '../../../node_modules/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '../../../node_modules/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
import { IERC20 } from '../../../node_modules/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol';

// Contract definition and name
contract SendMessage is AxelarExecutable {

    // Three state variables that can be accessed by any function in the contract
    string public value;
    string public sourceChain;
    string public sourceAddress;

    // State variable that can only be set during contract deployment and is immutable after that
    IAxelarGasService public immutable gasService;

    // Contract constructor function gets called when the contract is first deployed
    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_) {
        // Sets the immutable state variable to the address of gasReceiver_
        gasService = IAxelarGasService(gasReceiver_);
    }

    // Call this function to update the value of this contract along with all its siblings'.
    function sendMessage(
        string calldata destinationChain,
        string calldata destinationAddress,
        string calldata value_
    ) external payable {
        // Encodes the new value string into bytes, which can be sent to the Axelar gateway contract
        bytes memory payload = abi.encode(value_);
        // If the sender of this function call included any native gas, use the gasService to pay for the function call
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{ value: msg.value }(
                address(this),
                destinationChain,
                destinationAddress,
                payload,
                msg.sender
            );
        }
        // Calls the Axelar gateway contract with the specified destination chain and address, and sends the payload along with the call
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    // Handles calls created by setAndSend. Updates this contract's value
    function _execute(
        string calldata sourceChain_,
        string calldata sourceAddress_,
        bytes calldata payload_
    ) internal override {
        // Decodes the payload bytes into the string value and sets the state variable for this contract
        (value) = abi.decode(payload_, (string));
        // Sets the sourceChain and sourceAddress state variables with the provided arguments
        sourceChain = sourceChain_;
        sourceAddress = sourceAddress_;
    }
}
