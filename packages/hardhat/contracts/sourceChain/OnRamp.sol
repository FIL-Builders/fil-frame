// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Cid} from "../Cid.sol";
import {TRUNCATOR} from "../Const.sol";
import {DataAttestation} from "./Oracles.sol";

// Adapted from https://github.com/lighthouse-web3/raas-starter-kit/blob/main/contracts/data-segment/Proof.sol
// adapted rather than imported to
//  1) avoid build issues
//  2) avoid npm deps
//3)  avoid use of deprecated @zondax/filecoin-solidity
contract PODSIVerifier {
    // ProofData is a Merkle proof
    struct ProofData {
        uint64 index;
        bytes32[] path;
    }

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
        uint64 right = 0;

        for (uint64 i = 0; i < d.path.length; i++) {
            (right, index) = (index & 1, index >> 1);
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

contract OnRampContract is PODSIVerifier {
    struct Offer {
        bytes commP;
        uint64 size;
        string cid;
        string location;
        uint256 amount;
        IERC20 token;
    }
    // Possible rearrangement:
    // struct Hint {string location, uint64 size} ?
    // struct Payment {uint256 amount, IERC20 token}?

    event DataReady(Offer offer, uint64 id);
    uint64 private nextOfferId = 1;
    uint64 private nextAggregateID = 1;
    address public dataProofOracle;
    mapping(uint64 => Offer) public offers;
    mapping(uint64 => uint64[]) public aggregations;
    mapping(uint64 => address) public aggregationPayout;
    mapping(uint64 => bool) public provenAggregations;
    mapping(bytes => uint64) public commPToAggregateID;

    function setOracle(address oracle_) external {
        if (dataProofOracle == address(0)) {
            dataProofOracle = oracle_;
        } else {
            revert("Oracle already set");
        }
    }

    function offerData(Offer calldata offer) external payable returns (uint64) {
        if(offer.amount > 0) {
            require(offer.token.transferFrom(msg.sender, address(this), offer.amount),
                "Payment transfer failed."
            );
        }
        
        uint64 id = nextOfferId++;
        offers[id] = offer;

        emit DataReady(offer, id);
        return id;
    }

    function commitAggregate(
        bytes calldata aggregate,
        uint64[] calldata claimedIDs,
        ProofData[] calldata inclusionProofs,
        address payoutAddr
    ) external {
        uint64[] memory offerIDs = new uint64[](claimedIDs.length);
        uint64 aggId = nextAggregateID++;
        // Prove all offers are committed by aggregate commP
        for (uint64 i = 0; i < claimedIDs.length; i++) {
            uint64 offerID = claimedIDs[i];
            offerIDs[i] = offerID;
            require(
                verify(
                    inclusionProofs[i],
                    Cid.cidToPieceCommitment(aggregate),
                    Cid.cidToPieceCommitment(offers[offerID].commP)
                ),
                "Proof verification failed"
            );
        }
        aggregations[aggId] = offerIDs;
        aggregationPayout[aggId] = payoutAddr;
        commPToAggregateID[aggregate] = aggId;
    }

    function verifyDataStored(
        uint64 aggID,
        uint idx,
        uint64 offerID
    ) external view returns (bool) {
        require(provenAggregations[aggID], "Provided aggregation not proven");
        require(
            aggregations[aggID][idx] == offerID,
            "Aggregation does not include offer"
        );

        return true;
    }

    // Called by oracle to prove the data is stored
    function proveDataStored(DataAttestation calldata attestation) external {
        require(
            msg.sender == dataProofOracle,
            "Only oracle can prove data stored"
        );
        uint64 aggID = commPToAggregateID[attestation.commP];
        require(aggID != 0, "Aggregate not found");

        // transfer payment to the receiver
        for (uint i = 0; i < aggregations[aggID].length; i++) {
            uint64 offerID = aggregations[aggID][i];
            require(
                offers[offerID].token.transfer(
                    aggregationPayout[aggID],
                    offers[offerID].amount
                ),
                "Payment transfer failed"
            );
        }
        provenAggregations[aggID] = true;
    }
}
