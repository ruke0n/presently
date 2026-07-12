// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {GiftVoucher} from "../src/GiftVoucher.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract GiftVoucherTest is Test {
    GiftVoucher internal gift;
    MockUSDC internal usdc;

    address internal sender = address(0x5E);
    address internal recipient = address(0xEC);
    string internal code = "PRES-8F3A-Q27K";
    bytes32 internal codeHash = keccak256(bytes("PRES-8F3A-Q27K"));
    uint256 internal amount = 25e6;

    function setUp() public {
        usdc = new MockUSDC();
        gift = new GiftVoucher(IERC20(address(usdc)));
        usdc.mint(sender, 1000e6);
        vm.prank(sender);
        usdc.approve(address(gift), type(uint256).max);
    }

    function _create() internal {
        vm.prank(sender);
        gift.createVoucher(codeHash, amount);
    }

    function test_create_locksFunds() public {
        _create();
        assertEq(usdc.balanceOf(address(gift)), amount);
        assertTrue(gift.isClaimable(codeHash));
        (address s, uint256 a, bool closed) = gift.vouchers(codeHash);
        assertEq(s, sender);
        assertEq(a, amount);
        assertFalse(closed);
    }

    function test_redeem_paysCaller() public {
        _create();
        vm.prank(recipient);
        gift.redeem(code);
        assertEq(usdc.balanceOf(recipient), amount);
        assertFalse(gift.isClaimable(codeHash));
    }

    function test_redeem_rejectsWrongCode() public {
        _create();
        vm.prank(recipient);
        vm.expectRevert(GiftVoucher.VoucherMissing.selector);
        gift.redeem("WRONG-CODE");
    }

    function test_redeem_rejectsDoubleRedeem() public {
        _create();
        vm.prank(recipient);
        gift.redeem(code);
        vm.prank(address(0xAB));
        vm.expectRevert(GiftVoucher.AlreadyClosed.selector);
        gift.redeem(code);
    }

    function test_create_rejectsReusedCode() public {
        _create();
        vm.prank(sender);
        vm.expectRevert(GiftVoucher.CodeInUse.selector);
        gift.createVoucher(codeHash, amount);
    }

    function test_create_rejectsZero() public {
        vm.prank(sender);
        vm.expectRevert(GiftVoucher.ZeroAmount.selector);
        gift.createVoucher(codeHash, 0);
    }

    function test_reclaim_returnsToSender() public {
        _create();
        vm.prank(sender);
        gift.reclaim(codeHash);
        assertEq(usdc.balanceOf(sender), 1000e6);
        assertFalse(gift.isClaimable(codeHash));
    }

    function test_reclaim_onlySender() public {
        _create();
        vm.prank(recipient);
        vm.expectRevert(GiftVoucher.NotSender.selector);
        gift.reclaim(codeHash);
    }

    function test_reclaim_rejectsAfterRedeem() public {
        _create();
        vm.prank(recipient);
        gift.redeem(code);
        vm.prank(sender);
        vm.expectRevert(GiftVoucher.AlreadyClosed.selector);
        gift.reclaim(codeHash);
    }

    function testFuzz_redeem_anyCode(string calldata c, uint96 amt) public {
        vm.assume(bytes(c).length > 0);
        uint256 a = bound(uint256(amt), 1, 1000e6);
        bytes32 h = keccak256(bytes(c));
        vm.prank(sender);
        gift.createVoucher(h, a);
        vm.prank(recipient);
        gift.redeem(c);
        assertEq(usdc.balanceOf(recipient), a);
    }
}
