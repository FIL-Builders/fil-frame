//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/**
 * To deploy a contract with the same address across different EVM chains:
 * Inside /hardhat directory:
 * 1. Deploy this contract: `yarn hardhat run deploy/01_deploy_deterministic_deployer.ts --network <network-name>`
 * 2. Copy the console output of DeterministicDeployer and paste it in 02_deploy_your_contract_with_same_address.ts
 * 3. Run `yarn hardhat run deploy/02_deploy_your_contract_with_same_address.ts --network <network-name>`
 */
contract DeterministicDeployer {
    event Deployed(address addr);

    /**
     * Deploy a contract with the same address across different chains.
     * @param bytecode The bytecode of the contract to deploy.
     * @param salt A random number to make the address unique.
     * @return The address of the deployed contract.
     */
    function deploy(bytes memory bytecode, uint256 salt) public returns (address) {
        address addr;
        assembly {
            addr := create2(0, add(bytecode, 0x20), mload(bytecode), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit Deployed(addr);
        return addr;
    }

    /**
     * Compute the address of a contract that will be deployed with the same bytecode and salt.
     * @param bytecode The bytecode of the contract to deploy.
     * @param salt A random number to make the address unique.
     * @return The address of the contract.
     */
    function computeAddress(bytes memory bytecode, uint256 salt) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(bytecode)
            )
        );
        return address(uint160(uint(hash)));
    }
}