pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";


contract MultiTokenPaymentGateway is Initializable {
	using SafeERC20Upgradeable for IERC20Upgradeable;
	address payable owner;
	mapping(address => uint) balances;
	mapping(IERC20Upgradeable => uint) tokens;


	function initialize() public initializer {
		owner = payable(msg.sender);
		// for (uint i = 0; i < _tokens.length; i++) {
		//	tokens[address(_tokens[i])] = _tokens[i];
		// }
	}

	function depositFunds(IERC20Upgradeable tokenToLock, uint256 amount) public {
		// uint256 amount = msg.value;
		// uint256 tokenAmount = IERC20Upgradeable(tokenToLock).balanceOf(address(msg.sender));
		// require(tokenAmount >= amount, "Balance for wallet is low!!!");
		// IERC20Upgradeable tokenAddress = IERC20Upgradeable(tokenToLock);
		// tokenToLock.safeIncreaseAllowance(address(this), amount);
		tokenToLock.safeTransfer(address(this), amount);
		// ERC20Utils.tokenTransferFrom(tokenToLock, msg.sender, address(this), amount);
		// require(!success, "Transfer failed");
		balances[msg.sender] += amount;
	}

	function returnBalance(IERC20Upgradeable token, address walletAddress) public view returns (uint256) {
		uint256 tokenAmount = token.balanceOf(address(walletAddress));
		return tokenAmount;
	}

	function withdrawFunds(IERC20Upgradeable tokenToLock, uint256 amount) public {
		require(msg.sender == owner, "Only owner can withdraw funds");
		require(amount > 0, "Withdraw amount must be greater than 0");
		require(tokenToLock.balanceOf(address(this)) >= amount, "Insufficient funds");
		tokenToLock.safeTransfer(msg.sender, amount);
		// owner.transfer(amount);
	}
}
