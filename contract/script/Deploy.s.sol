// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script, console} from "forge-std/Script.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {GiftVoucher} from "../src/GiftVoucher.sol";

/// @notice Deploys GiftVoucher. Set USDC_ADDRESS via env.
///   forge script script/Deploy.s.sol --rpc-url $ARC_RPC_URL --broadcast
contract Deploy is Script {
    function run() external returns (GiftVoucher gift) {
        address usdc = vm.envAddress("USDC_ADDRESS");
        vm.startBroadcast();
        gift = new GiftVoucher(IERC20(usdc));
        vm.stopBroadcast();
        console.log("GiftVoucher:", address(gift));
        console.log("token (USDC):", usdc);
    }
}
