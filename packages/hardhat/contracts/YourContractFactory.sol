//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./YourContract.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract YourContractFactory {
    address public latestTokenAddress;
    mapping(bytes32 => address) public deployedContracts;

    modifier isContractNotDeployed(bytes32 _salt) {
        require(deployedContracts[_salt] == address(0), "Contract already deployed for this salt");
        _;
    }

    function deployContract(bytes32 _salt) 
        external 
        isContractNotDeployed(_salt) 
        returns (address) 
    {
        latestTokenAddress = Create2.deploy(
            0,
            _salt,
            abi.encodePacked(type(YourContract).creationCode, abi.encode(msg.sender))
        );

        deployedContracts[_salt] = latestTokenAddress;
        return latestTokenAddress;
    }

    function computeTokenAddress(bytes32 _salt) 
        public 
        view 
        returns (address) 
    {
        return Create2.computeAddress(
            _salt,
            keccak256(abi.encodePacked(type(YourContract).creationCode, abi.encode(msg.sender)))
        );
    }
}
