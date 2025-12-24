// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DummyAvantisRouter
 * @notice Simplified Avantis-like router used only for the EIP-7702 POC.
 * @dev It only emits an event and does not perform any real margin or position management.
 */
contract DummyAvantisRouter {
    /**
     * @notice Emitted when a new position is "opened" in this POC router.
     * @param trader Address that opened the position (msg.sender).
     * @param marginAmount Margin amount forwarded to the router.
     * @param notionalValue Notional value for the position (unused in this POC).
     */
    event PositionOpened(address indexed trader, uint256 marginAmount, uint256 notionalValue);

    /**
     * @notice Logs a new position open event for the caller.
     * @dev `notionalValue` is currently ignored and always passed as zero in this POC.
     * @param marginAmount Margin that the user is posting for the position.
     * @param notionalValue Intended notional value of the position (unused).
     */
    function openPosition(uint256 marginAmount, uint256 notionalValue) external {
        // notionalValue is intentionally informational; core logic only relies on marginAmount.
        emit PositionOpened(msg.sender, marginAmount, notionalValue);
    }
}

