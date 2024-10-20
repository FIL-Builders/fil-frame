// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StorachaNFT is ERC721 {
    uint256 private _tokenIdCounter; // Replace Counters.Counter with a simple uint256

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("StorachaNFT", "SNFT") {}

    function mint(string memory storacha_cid) public {
        _tokenIdCounter++; // Increment the counter directly
        uint256 tokenId = _tokenIdCounter;
        _mint(msg.sender, tokenId);
        _tokenURIs[tokenId] = storacha_cid;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }

    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
}