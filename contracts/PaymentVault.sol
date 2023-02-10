pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract PaymentVault is Initializable {
	using SafeERC20Upgradeable for IERC20Upgradeable;
	address payable owner;

	event depositFundCompleted(address sender, uint256 amount);
	event withdrawFundsCompleted(address tokenWithdraw, address sentTo, uint256 amount);

	function initialize() public initializer {
		owner = payable(msg.sender);
	}

	/**
 	 * @notice Deposit `amount` of `erc20` tokens from this user's wallet to `contract`.
     * @param tokenToLock ERC20 token to be deposited
     * @param amount of tokens to deposit
     */
	function depositFunds(
		IERC20Upgradeable tokenToLock,
		uint256 amount
	) public {
		uint256 tokenBalanceSender = tokenToLock.balanceOf(address(msg.sender));
		require(tokenBalanceSender >= amount, "Balance for wallet is low!!!");
		tokenToLock.safeTransferFrom(msg.sender, address(this), amount);

		emit depositFundCompleted(msg.sender, amount);
	}

	/**
  	 * @notice Return balance of `erc20` token of user's wallet.
     * @param tokenToLock ERC20 token's balance to be checked
     * @param walletAddress for which balance needs to be checked
     */
	function returnBalance(
		IERC20Upgradeable token,
		address walletAddress
	) public view returns (uint256) {
		uint256 tokenAmount = token.balanceOf(address(walletAddress));
		return tokenAmount;
	}

	/**
     * @notice Return balance of `erc20` token of contract wallet.
     * @param tokenToLock ERC20 token's balance to be checked
     */
	function tokenBalance(
		IERC20Upgradeable token
	) public view returns (uint256) {
		uint256 tokenTotalBalance = token.balanceOf(address(this));
		return tokenTotalBalance;
	}

	/**
     * @notice Withdraw `amount` of `erc20` tokens from `contract` to owner's wallet.
     * @param tokenToLock ERC20 token to be withdrawn
     * @param amount of tokens to withdrawn
     */
	function withdrawFunds(
		IERC20Upgradeable tokenToWithdrawn,
		uint256 amount
	) public {
		require(msg.sender == owner, "Only owner can withdraw funds");
		require(amount > 0, "Withdraw amount must be greater than 0");
		require(tokenToWithdrawn.balanceOf(address(this)) >= amount, "Insufficient funds");
		tokenToWithdrawn.safeTransfer(msg.sender, amount);

		emit withdrawFundsCompleted(address(tokenToWithdrawn), msg.sender, amount);
	}
}
