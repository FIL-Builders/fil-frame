// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;
 
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 
contract PythContract is ERC721URIStorage, Ownable {
  uint256 private mintedTicketCount;
  IPyth pyth = IPyth(0xA2aa501b19aff244D90cc15a4Cf739D2725B5729);
  bytes32 filUsdPriceId = 0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e;
 
  constructor() ERC721("FIL-B NFT", "FILB") Ownable(msg.sender) {}

  function mint(string memory cid) public payable {
    PythStructs.Price memory price = pyth.getPriceNoOlderThan(
      filUsdPriceId,
      60
    );
 
    uint filPrice18Decimals = (uint(uint64(price.price)) * (10 ** 18)) /
      (10 ** uint8(uint32(-1 * price.expo)));
    uint oneDollarInAttoFil = ((10 ** 18) * (10 ** 18)) / filPrice18Decimals;
 
    if (msg.value >= oneDollarInAttoFil) {
      uint256 newTicketId = mintedTicketCount;

      _safeMint(msg.sender, newTicketId);

      _setTokenURI(newTicketId, cid);

      mintedTicketCount++;
    } else {
      revert InsufficientFee();
    }
  }
 
  function updateAndMint(bytes[] calldata pythPriceUpdate, string memory cid) external payable {
    uint updateFee = pyth.getUpdateFee(pythPriceUpdate);
    pyth.updatePriceFeeds{ value: updateFee }(pythPriceUpdate);
 
    mint(cid);
  }
 
  // Error raised if the payment is not sufficient
  error InsufficientFee();
}