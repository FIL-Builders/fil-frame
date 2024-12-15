// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;
 
import "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
 
contract PythContract {
  IPyth pyth = IPyth(0xA2aa501b19aff244D90cc15a4Cf739D2725B5729);
  bytes32 filUsdPriceId = 0x150ac9b959aee0051e4091f0ef5216d941f590e1c5e7f91cf7635b5c11628c0e;
 
  function mint() public payable {
    PythStructs.Price memory price = pyth.getPriceNoOlderThan(
      filUsdPriceId,
      60
    );
 
    uint ethPrice18Decimals = (uint(uint64(price.price)) * (10 ** 18)) /
      (10 ** uint8(uint32(-1 * price.expo)));
    uint oneDollarInWei = ((10 ** 18) * (10 ** 18)) / ethPrice18Decimals;
 
    if (msg.value >= oneDollarInWei) {
      // User paid enough money.
      // TODO: mint the NFT here
    } else {
      revert InsufficientFee();
    }
  }
 
  function updateAndMint(bytes[] calldata pythPriceUpdate) external payable {
    uint updateFee = pyth.getUpdateFee(pythPriceUpdate);
    pyth.updatePriceFeeds{ value: updateFee }(pythPriceUpdate);
 
    mint();
  }
 
  // Error raised if the payment is not sufficient
  error InsufficientFee();
}