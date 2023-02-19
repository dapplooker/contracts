pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


/**
 * @notice Payment gateway which will be used to transfer token from wallet to
 * 		   contract and from contract to owner.
 *
 * @dev PaymentVault.deposit() function will deposit the amount of approved token
 *		to the PaymentVault contract, which later can be withdrawn using
 *		PaymentVault.withdraw() function to owners wallet.
 */
contract PaymentVault is Initializable, OwnableUpgradeable {

	using SafeERC20Upgradeable for IERC20Upgradeable;


	/* Events */

	event DepositCompleted(
        address sender,
        uint256 amount)
    ;

	event WithdrawCompleted(
        address token,
        address beneficiary,
        uint256 amount
    );

    /** Variables */

	address owner;

    /* Special Functions */
	function initialize() public initializer {
		__Ownable_init();
	}

    /* External Functions */

	/**
 	 * @dev Deposit `amount` of `erc20` tokens from this user's wallet to `contract`.
 	 *
     * @param _token ERC20 token to be deposited.
     * @param _amount of tokens to deposit.
     */
	function deposit(
		IERC20Upgradeable _token,
		uint256 _amount
	) external {

		uint256 balance = _token.balanceOf(address(msg.sender));

		require(balance >= _amount, "Your wallet balance for token is low.");

		_token.safeTransferFrom(msg.sender, address(this), _amount);

		emit DepositCompleted(msg.sender, _amount);
	}

	/**
     * @dev Withdraw `amount` of `erc20` tokens from `contract` to owner's wallet.
     *
     * @param _token ERC20 token to be withdrawn.
     * @param _amount of tokens to withdrawn.
     */
	function withdraw(
		IERC20Upgradeable _token,
		uint256 _amount
	) public onlyOwner {
		require(_amount > 0, "Withdraw amount must be greater than 0");

		require(_token.balanceOf(address(this)) >= _amount, "Insufficient funds");

		_token.safeTransfer(msg.sender, _amount);

		emit WithdrawCompleted(address(_token), msg.sender, _amount);
	}
}
