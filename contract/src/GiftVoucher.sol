// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "openzeppelin-contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/utils/ReentrancyGuard.sol";

/// @title GiftVoucher
/// @notice Claimable USDC gift vouchers on Arc. A sender locks USDC against the
///         hash of a secret code. Whoever presents the code redeems the funds
///         to their own wallet; the sender can reclaim an unredeemed voucher.
/// @dev The code plaintext is only revealed on redeem, so the create step leaks
///      nothing. This is testnet software: a redeem transaction does expose the
///      code in the mempool, so a voucher is a bearer instrument, treat the code
///      like cash.
contract GiftVoucher is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Voucher {
        address sender;
        uint256 amount;
        bool closed; // redeemed or reclaimed
    }

    IERC20 public immutable token;

    /// @notice Vouchers keyed by keccak256(bytes(code)).
    mapping(bytes32 codeHash => Voucher) public vouchers;

    event VoucherCreated(bytes32 indexed codeHash, address indexed sender, uint256 amount);
    event VoucherRedeemed(bytes32 indexed codeHash, address indexed recipient, uint256 amount);
    event VoucherReclaimed(bytes32 indexed codeHash, address indexed sender, uint256 amount);

    error ZeroAmount();
    error CodeInUse();
    error VoucherMissing();
    error AlreadyClosed();
    error NotSender();

    constructor(IERC20 _token) {
        token = _token;
    }

    /// @notice Lock `amount` USDC against `codeHash` = keccak256(bytes(code)).
    /// @dev The caller computes the hash off-chain so the code never appears here.
    function createVoucher(bytes32 codeHash, uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (vouchers[codeHash].sender != address(0)) revert CodeInUse();

        vouchers[codeHash] = Voucher({sender: msg.sender, amount: amount, closed: false});
        token.safeTransferFrom(msg.sender, address(this), amount);
        emit VoucherCreated(codeHash, msg.sender, amount);
    }

    /// @notice Redeem a voucher by presenting its `code`; funds go to the caller.
    function redeem(string calldata code) external nonReentrant {
        bytes32 codeHash = keccak256(bytes(code));
        Voucher storage v = vouchers[codeHash];
        if (v.sender == address(0)) revert VoucherMissing();
        if (v.closed) revert AlreadyClosed();

        v.closed = true;
        uint256 amount = v.amount;
        token.safeTransfer(msg.sender, amount);
        emit VoucherRedeemed(codeHash, msg.sender, amount);
    }

    /// @notice Sender takes back an unredeemed voucher.
    function reclaim(bytes32 codeHash) external nonReentrant {
        Voucher storage v = vouchers[codeHash];
        if (v.sender == address(0)) revert VoucherMissing();
        if (msg.sender != v.sender) revert NotSender();
        if (v.closed) revert AlreadyClosed();

        v.closed = true;
        uint256 amount = v.amount;
        token.safeTransfer(v.sender, amount);
        emit VoucherReclaimed(codeHash, v.sender, amount);
    }

    /// @notice Whether a voucher exists and is still claimable.
    function isClaimable(bytes32 codeHash) external view returns (bool) {
        Voucher storage v = vouchers[codeHash];
        return v.sender != address(0) && !v.closed;
    }
}
