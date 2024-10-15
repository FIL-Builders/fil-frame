//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./YourContract.sol";

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
        bytes memory bytecode = abi.encodePacked(type(YourContract).creationCode, abi.encode(msg.sender));
        address addr;

        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), _salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }

        latestTokenAddress = addr;
        deployedContracts[_salt] = latestTokenAddress;
        return latestTokenAddress;
    }

    function computeTokenAddress(bytes32 _salt) 
        public 
        view 
        returns (address) 
    {
        bytes32 bytecodeHash = keccak256(
            abi.encodePacked(
                type(YourContract).creationCode,
                abi.encode(msg.sender)
            )
        );
        
        return address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            _salt,
            bytecodeHash
        )))));
    }
}
