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

	function depositFunds(IERC20Upgradeable tokenToLock, uint256 amount) public {
		uint256 tokenBalanceSender = tokenToLock.balanceOf(address(msg.sender));
		require(tokenBalanceSender >= amount, "Balance for wallet is low!!!");
		tokenToLock.safeTransferFrom(msg.sender, address(this), amount);

		emit depositFundCompleted(msg.sender, amount);
	}

	function returnBalance(IERC20Upgradeable token, address walletAddress) public view returns (uint256) {
		uint256 tokenAmount = token.balanceOf(address(walletAddress));
		return tokenAmount;
	}

	function tokenBalance(IERC20Upgradeable token) public view returns (uint256) {
		uint256 tokenTotalBalance = token.balanceOf(address(this));
		return tokenTotalBalance;
	}

	function withdrawFunds(IERC20Upgradeable tokenToLock, uint256 amount) public {
		require(msg.sender == owner, "Only owner can withdraw funds");
		require(amount > 0, "Withdraw amount must be greater than 0");
		require(tokenToLock.balanceOf(address(this)) >= amount, "Insufficient funds");

		tokenToLock.safeTransfer(msg.sender, amount);

		emit withdrawFundsCompleted(address(tokenToLock), msg.sender, amount);
		// owner.transfer(amount);
	}
}
