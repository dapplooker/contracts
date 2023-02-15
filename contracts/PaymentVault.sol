pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


/**
 * @notice Payment gateway which will be used to transfer token from wallet to
 * 		   contract and from contract to owner.
 *
 * @dev PaymentVault.deposit() function will deposit the amount of approved token
 *		to the PaymentVault contract, which later can be withdrawn using
 *		PaymentVault.withdraw() function to owners wallet.
 */
contract PaymentVault is Initializable {
	using SafeERC20Upgradeable for IERC20Upgradeable;

	/** Contains the address of owner. */
	address owner;

	/** Events which will be emitted on operation completes. */
	event DepositCompleted(address sender, uint256 amount);
	event withdrawCompleted(address tokenWithdraw, address sentTo, uint256 amount);

	function initialize() public initializer {
		owner = msg.sender;
	}

	/**
 	 * @notice Deposit `amount` of `erc20` tokens from this user's wallet to `contract`.
     * @param token ERC20 token to be deposited
     * @param amount of tokens to deposit
     */
	function deposit(
		IERC20Upgradeable token,
		uint256 amount
	) public {
		uint256 tokenBalanceSender = token.balanceOf(address(msg.sender));
		require(tokenBalanceSender >= amount, "Your wallet balance for token is low");
		token.safeTransferFrom(msg.sender, address(this), amount);

		emit DepositCompleted(msg.sender, amount);
	}

	/**
     * @notice Withdraw `amount` of `erc20` tokens from `contract` to owner's wallet.
     * @param token ERC20 token to be withdrawn
     * @param amount of tokens to withdrawn
     */
	function withdraw(
		IERC20Upgradeable token,
		uint256 amount
	) public {
		require(msg.sender == owner, "Only owner can withdraw funds");
		require(amount > 0, "Withdraw amount must be greater than 0");
		require(token.balanceOf(address(this)) >= amount, "Insufficient funds");
		token.safeTransfer(msg.sender, amount);

		emit withdrawCompleted(address(token), msg.sender, amount);
	}
}
