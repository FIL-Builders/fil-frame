// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LighthouseNFT is ERC721 {
    // Counter for the next token ID
    uint256 private _tokenIdCounter;

    // Mapping from token ID to token URI
    mapping(uint256 => string) private _tokenURIs;

    // Mapping from token ID to a mapping of addresses with access
    mapping(uint256 => mapping(address => bool)) private tokenContentAccess;

    // Mapping to check if a token is open access
    mapping(uint256 => bool) private openAccessTokens;

    // Constructor to initialize the ERC721 token with a name and symbol
    constructor() ERC721("LighthouseNFT", "LNFT") {}

    // Function to mint a new token with open access
    function mint(string memory lighthouse_cid) public {
        _tokenIdCounter++; // Increment the token ID counter
        uint256 tokenId = _tokenIdCounter;
        _mint(msg.sender, tokenId); // Mint the token to the sender
        _tokenURIs[tokenId] = lighthouse_cid; // Set the token URI
        openAccessTokens[tokenId] = true; // Mark the token as open access
    }

    // Function to mint a new token with restricted access
    function mintPrivate(string memory lighthouse_cid, address[] memory accessList) public {
        _tokenIdCounter++; // Increment the token ID counter
        uint256 tokenId = _tokenIdCounter;
        _mint(msg.sender, tokenId); // Mint the token to the sender
        _tokenURIs[tokenId] = lighthouse_cid; // Set the token URI
        tokenContentAccess[tokenId][msg.sender] = true; // Grant access to the sender
        // Grant access to the specified addresses
        for (uint i = 0; i < accessList.length; i++) {
            tokenContentAccess[tokenId][accessList[i]] = true;
        }
    }

    // Function to grant access to specific addresses for a token
    function grantAccess(uint256 tokenId, address[] memory accessList) public {
        require(ownerOf(tokenId) == msg.sender, "Lighthouse NFT: Only owner can grant access");
        // Grant access to the specified addresses
        for (uint i = 0; i < accessList.length; i++) {
            tokenContentAccess[tokenId][accessList[i]] = true;
        }
    }

    // Function to revoke access from specific addresses for a token
    function revokeAccess(uint256 tokenId, address[] memory accessList) public {
        require(ownerOf(tokenId) == msg.sender, "Lighthouse NFT: Only owner can revoke access");
        // Revoke access from the specified addresses
        for (uint i = 0; i < accessList.length; i++) {
            tokenContentAccess[tokenId][accessList[i]] = false;
        }
    }

    // Function to check if an account has access to a token's content
    function hasAccess(uint256 tokenId, address account) public view returns (bool) {
        // Access is granted if the token is open, the account is in the access list, or the token ID is not yet minted to allow lighthouse to apply the rules
        return openAccessTokens[tokenId] || tokenContentAccess[tokenId][account];
    }

    // Function to check if a token is open access
    function isOpenToken(uint256 tokenId) public view returns (bool) {
        return openAccessTokens[tokenId];
    }

    // Function to get the URI of a token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    // Function to get the total number of tokens minted
    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}