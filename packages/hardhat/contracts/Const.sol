// Taken from lib/raas-starter-kit/contracts/data-segment/Cid.sol lib/raas-starter-kit/contracts/data-segment/Const.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// CID
bytes7 constant CID_COMMP_HEADER = hex"0181e203922020";
uint8 constant CID_COMMP_HEADER_LENGTH = 7;

// Proofs
uint8 constant MERKLE_TREE_NODE_SIZE = 32;
bytes32 constant TRUNCATOR = 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff3f;
uint64 constant BYTES_IN_INT = 8;
uint64 constant CHECKSUM_SIZE = 16;
uint64 constant ENTRY_SIZE = uint64(MERKLE_TREE_NODE_SIZE) +
    2 *
    BYTES_IN_INT +
    CHECKSUM_SIZE;
uint64 constant BYTES_IN_DATA_SEGMENT_ENTRY = 2 * MERKLE_TREE_NODE_SIZE;
