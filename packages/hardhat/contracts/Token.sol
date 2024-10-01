// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Nickle is ERC20 {
    constructor() ERC20("Nickle", "NICKLE") {
        _mint(
            msg.sender,
            10000000000000000000000000000000000000000000000000000000000000000
        );
    }
}

contract BronzeCowry is ERC20 {
    constructor() ERC20("Bronze Cowry", "SHELL") {
        _mint(
            msg.sender,
            10000000000000000000000000000000000000000000000000000000000000000
        );
    }
}

contract AthenianDrachma is ERC20 {
    constructor() ERC20("Athenian Drachma", "ATH") {
        _mint(
            msg.sender,
            10000000000000000000000000000000000000000000000000000000000000000
        );
    }
}

contract DebasedTowerPoundSterling is ERC20 {
    constructor() ERC20("DebasedTowerPoundSterling", "NEWTON") {
        _mint(
            msg.sender,
            10000000000000000000000000000000000000000000000000000000000000000
        );
    }
}
