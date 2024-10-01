// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Axelar imports
import { AxelarExecutable } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import { IAxelarGasService } from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";

// OpenZeppelin imports
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Import or define Cid, TRUNCATOR, and DataAttestation
import { Cid } from "./Cid.sol"; // Make sure Cid.sol is available
import { TRUNCATOR } from "./Const.sol"; // Make sure Const.sol defines TRUNCATOR
import { DataAttestation } from "./Oracles.sol"; // Make sure Oracles.sol defines DataAttestation

contract OnRampDestination is AxelarExecutable {
    // ProofData is a Merkle proof
    struct ProofData {
        uint64 index;
        bytes32[] path;
    }

    struct Offer {
        bytes commP;
        uint64 size;
        string location;
        uint256 amount;
        IERC20 token;
    }

    uint64 private nextAggregateID = 1;
    mapping(uint64 => uint64[]) public aggregations;
    mapping(uint64 => address) public aggregationPayout;
    mapping(uint64 => bool) public provenAggregations;
    mapping(bytes => uint64) public commPToAggregateID;
    mapping(uint64 => Offer) public offers;

    IAxelarGasService public gasService;

    constructor(address gateway_, address gasService_) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasService_);
    }

    // Receive messages from the source chain
    function _execute(
        string calldata sourceChain,
        string calldata sourceAddress,
        bytes calldata payload
    ) internal override {
        (string memory messageType, bytes memory data) = abi.decode(payload, (string, bytes));

        if (keccak256(bytes(messageType)) == keccak256(bytes("DataReady"))) {
            (Offer memory offer, uint64 id) = abi.decode(data, (Offer, uint64));
            offers[id] = offer;
        } else {
            revert("Unknown message type");
        }
    }

    // Function to commit an aggregate
    function commitAggregate(
        bytes calldata aggregate,
        uint64[] calldata claimedIDs,
        ProofData[] calldata inclusionProofs,
        address payoutAddr
    ) external {
        uint64 aggId = nextAggregateID++;
        uint64[] storage offerIDs = aggregations[aggId];

        // Prove all offers are committed by aggregate commP
        for (uint256 i = 0; i < claimedIDs.length; i++) {
            uint64 offerID = claimedIDs[i];
            offerIDs.push(offerID);
            bytes32 root = Cid.cidToPieceCommitment(aggregate);
            bytes32 leaf = Cid.cidToPieceCommitment(offers[offerID].commP);
            require(
                verify(
                    inclusionProofs[i],
                    root,
                    leaf
                ),
                "Proof verification failed"
            );
        }
        aggregationPayout[aggId] = payoutAddr;
        commPToAggregateID[aggregate] = aggId;
    }

    // Called by oracle to prove data is stored
    function proveDataStored(
        DataAttestation calldata attestation,
        string calldata sourceChain,
        string calldata sourceAddress
    ) external payable {
        uint64 aggID = commPToAggregateID[attestation.commP];
        require(aggID != 0, "Aggregate not found");

        // Prepare payload to send back to source chain
        bytes memory payload = abi.encode("ProveDataStored", attestation.commP);

        // Pay for gas
        if (msg.value > 0) {
            gasService.payNativeGasForContractCall{ value: msg.value }(
                address(this),
                sourceChain,
                sourceAddress,
                payload,
                msg.sender
            );
        }

        // Send message back to source chain
        gateway.callContract(sourceChain, sourceAddress, payload);

        provenAggregations[aggID] = true;
    }

    // Verification functions from PODSIVerifier

    // verify verifies that the given leaf is present in the merkle tree with the given root.
    function verify(
        ProofData memory proof,
        bytes32 root,
        bytes32 leaf
    ) public pure returns (bool) {
        return computeRoot(proof, leaf) == root;
    }

    // computeRoot computes the root of a Merkle tree given a leaf and a Merkle proof.
    function computeRoot(
        ProofData memory d,
        bytes32 subtree
    ) internal pure returns (bytes32) {
        require(
            d.path.length < 64,
            "merkleproofs with depths greater than 63 are not supported"
        );
        require(
            d.index >> d.path.length == 0,
            "index greater than width of the tree"
        );

        bytes32 carry = subtree;
        uint64 index = d.index;
        uint64 right;

        for (uint64 i = 0; i < d.path.length; i++) {
            right = index & 1;
            index = index >> 1;
            if (right == 1) {
                carry = computeNode(d.path[i], carry);
            } else {
                carry = computeNode(carry, d.path[i]);
            }
        }

        return carry;
    }

    // computeNode computes the parent node of two child nodes
    function computeNode(
        bytes32 left,
        bytes32 right
    ) internal pure returns (bytes32) {
        bytes32 digest = sha256(abi.encodePacked(left, right));
        return truncate(digest);
    }

    // truncate truncates a node to 254 bits.
    function truncate(bytes32 n) internal pure returns (bytes32) {
        // Set the two lowest-order bits of the last byte to 0
        return n & TRUNCATOR;
    }
}

