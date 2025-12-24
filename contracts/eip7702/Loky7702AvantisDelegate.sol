// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IERC20
 * @notice Minimal ERC20 interface required by the Loky delegate.
 */
interface IERC20 {
    /**
     * @notice Transfers `value` tokens from `from` to `to` using the caller's allowance.
     * @param from Address to debit tokens from.
     * @param to Address to credit tokens to.
     * @param value Amount of tokens to transfer.
     * @return success Boolean indicating whether the operation succeeded.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool success);
}

/**
 * @title IAvantisRouter
 * @notice Minimal router interface that the Loky delegate calls into.
 */
interface IAvantisRouter {
    /**
     * @notice Opens a leveraged position with the given margin and notional.
     * @param marginAmount Margin posted by the trader.
     * @param notionalValue Notional size of the position.
     */
    function openPosition(uint256 marginAmount, uint256 notionalValue) external;
}

/**
 * @title Loky7702AvantisDelegate
 * @notice Loky delegate contract intended to be executed under EIP-7702 (type 0x04).
 *
 * @dev When invoked as the EOA code, msg.sender is the user EOA:
 *  - Collects a fixed execution fee in USDC
 *  - Forwards net margin to the Avantis router
 *  - Calls router.openPosition as the user (msg.sender)
 */
contract Loky7702AvantisDelegate {
    /// @notice USDC token used for margin and fee payments.
    IERC20 public immutable USDC;

    /// @notice Address that receives the fixed execution fees.
    address public immutable lokyTreasury;

    /// @notice Flat execution fee: 1 USDC (6 decimals) per transaction.
    uint256 public constant EXEC_FEE_USDC = 1e6;

    /**
     * @notice Initializes the delegate with the USDC token and treasury recipient.
     * @param _usdc Address of the USDC-compatible ERC20 token.
     * @param _lokyTreasury Address that will receive execution fees.
     */
    constructor(address _usdc, address _lokyTreasury) {
        USDC = IERC20(_usdc);
        lokyTreasury = _lokyTreasury;
    }

    /**
     * @notice Executes an Avantis trade via the router while charging a fixed USDC execution fee.
     * @dev
     *  - Pulls USDC from msg.sender: first the fixed fee to the Loky treasury, then the net margin to the router.
     *  - Invokes `router.openPosition` with `netMargin` as the margin and zero as notional (POC).
     * @param grossMarginAmount Total USDC the user is willing to provide (margin + fee).
     * @param notionalValue Notional size of the position (currently ignored in POC).
     * @param router Address of the Avantis router that will receive the net margin.
     */
    function executeOpenTradeWithFees(
        uint256 grossMarginAmount,
        uint256 notionalValue,
        address router
    ) external {
        // 1) Compute fees – single fixed execution fee per transaction (1 USDC)
        uint256 totalFee = EXEC_FEE_USDC;
        require(grossMarginAmount > totalFee, "Loky7702: margin too small");

        uint256 netMargin = grossMarginAmount - totalFee;

        // 2) Collect fees to treasury
        require(USDC.transferFrom(msg.sender, lokyTreasury, totalFee), "Loky7702: fee transfer failed");

        // 3) Transfer net margin to router
        require(USDC.transferFrom(msg.sender, router, netMargin), "Loky7702: margin transfer failed");
        // 4) Call router as user EOA (msg.sender) – fee is independent of notional
        IAvantisRouter(router).openPosition(netMargin, notionalValue);
    }
}

