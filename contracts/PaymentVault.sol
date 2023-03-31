pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @notice Payment gateway which will be used to transfer token from wallet to
 * 		   contract and from contract to owner.
 *
 * @dev PaymentVault.deposit() function will deposit the amount of approved token
 *		to the PaymentVault contract, which later can be withdrawn using
 *		PaymentVault.withdraw() function to owners wallet.
 */
contract PaymentVault is Ownable {

	/* Events */

	event DepositCompleted(
		address indexed sender,
		uint256 amount)
	;

	event WithdrawCompleted(
		address indexed token,
		address indexed beneficiary,
		uint256 amount
	);

	/* Constructor */
	constructor() Ownable() {

	}

	/* External Functions */

	/**
 	 * @dev Deposit `amount` of `erc20` tokens from this user's wallet to `contract`.
 	 *
     * @param _token ERC20 token to be deposited.
     * @param _amount of tokens to deposit.
     */
	function deposit(
		ERC20 _token,
		uint256 _amount
	)
	external
	{

		uint256 balance = _token.balanceOf(address(msg.sender));

		require(balance >= _amount, "Your wallet balance for token is low.");

		_token.transferFrom(msg.sender, address(this), _amount);

		emit DepositCompleted(msg.sender, _amount);
	}

	/**
     * @dev Withdraw `amount` of `erc20` tokens from `contract` to owner's wallet.
     *
     * @param _token ERC20 token to be withdrawn.
     * @param _amount of tokens to withdrawn.
     */
	function withdraw(
		ERC20 _token,
		uint256 _amount
	)
	external
	onlyOwner
	{
		require(_amount > 0, "Withdraw amount must be greater than 0");

		require(_token.balanceOf(address(this)) >= _amount, "Insufficient funds");

		_token.transfer(msg.sender, _amount);

		emit WithdrawCompleted(address(_token), msg.sender, _amount);
	}

	/**
 	 * @dev renounceOwnership of contract.
     *
     */
	function renounceOwnership() public override onlyOwner {

	}
}
