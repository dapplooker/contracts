// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockUSDC
 * @notice Minimal 6-decimal ERC20 used for the EIP-7702 POC.
 * @dev No external dependencies to keep compilation simple. Intended only for testing/demo.
 */
contract MockUSDC {
    string public name = "Mock USDC";
    string public symbol = "mUSDC";
    uint8 public constant decimals = 6;

    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @notice Deploys the token and mints the full supply to the deployer.
     * @dev Mints 1B tokens with 6 decimals to msg.sender.
     */
    constructor() {
        // Mint 1B tokens to deployer for convenience: 1,000,000,000 * 1e6
        uint256 mintAmount = 1_000_000_000 * 10 ** uint256(decimals);
        totalSupply = mintAmount;
        balanceOf[msg.sender] = mintAmount;
        emit Transfer(address(0), msg.sender, mintAmount);
    }

    /**
     * @notice Sets `value` as the allowance of `spender` over the caller's tokens.
     * @param spender The address that will be allowed to spend the caller's tokens.
     * @param value The allowance amount to grant.
     * @return success Boolean indicating whether the operation succeeded.
     */
    function approve(address spender, uint256 value) external returns (bool success) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        success = true;
    }

    /**
     * @notice Transfers `value` tokens from the caller to `to`.
     * @param to Recipient address.
     * @param value Amount of tokens to transfer.
     * @return success Boolean indicating whether the operation succeeded.
     */
    function transfer(address to, uint256 value) external returns (bool success) {
        _transfer(msg.sender, to, value);
        success = true;
    }

    /**
     * @notice Transfers `value` tokens from `from` to `to` using the caller's allowance.
     * @param from Address to debit tokens from.
     * @param to Address to credit tokens to.
     * @param value Amount of tokens to transfer.
     * @return success Boolean indicating whether the operation succeeded.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool success) {
        uint256 allowed = allowance[from][msg.sender];
        require(allowed >= value, "ERC20: insufficient allowance");
        allowance[from][msg.sender] = allowed - value;
        _transfer(from, to, value);
        success = true;
    }

    /**
     * @notice Internal transfer helper that moves `value` tokens from `from` to `to`.
     * @dev Reverts if `to` is the zero address or if `from` has insufficient balance.
     * @param from Address to debit tokens from.
     * @param to Address to credit tokens to.
     * @param value Amount of tokens to transfer.
     */
    function _transfer(address from, address to, uint256 value) internal {
        require(to != address(0), "ERC20: transfer to zero");
        uint256 bal = balanceOf[from];
        require(bal >= value, "ERC20: transfer exceeds balance");
        balanceOf[from] = bal - value;
        balanceOf[to] += value;
        emit Transfer(from, to, value);
    }
}

