// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VaultTesting {
	address tokenAddress;
	address owner;

	constructor() {
		owner = msg.sender;
	}

	// userAddress => tokenAddress => token amount
	mapping (address => uint256) tokenBalance;

	event tokenDepositCompleted(address tokenAddress, uint256 amount);
	event tokenApprovedCompleted(address tokenAddress, uint256 amount);

	function approveToken(address tokenAdd, uint256 amount) public {
		ERC20 tokenDetail = ERC20(tokenAdd);
		require(tokenDetail.balanceOf(msg.sender) >= amount, "Your token amount must be greater then you are trying to deposit");
		require(tokenDetail.approve(address(this), amount));

		emit tokenApprovedCompleted(tokenAdd, amount);
	}

	function depositToken(address tokenAdd, uint256 amount) public {
		ERC20 tokenDetail = ERC20(tokenAdd);
		require(tokenDetail.balanceOf(msg.sender) >= amount, "Your token amount must be greater then you are trying to deposit");
		require(tokenDetail.transferFrom(msg.sender, address(this), amount));

//		tokenBalance[tokenAdd] += amount;
		emit tokenDepositCompleted(tokenAdd, amount);
	}

	event tokenWithdrawalComplete(address tokenAddress, uint256 amount);

	function withDrawAll() public {
		require(tokenBalance[tokenAddress] > 0, "User doesnt has funds on this vault");
		uint256 amount = tokenBalance[tokenAddress];
		ERC20 tokenDetail = ERC20(tokenAddress);
		require(tokenDetail.transfer(msg.sender, amount), "the transfer failed");
		tokenBalance[tokenAddress] = 0;
		emit tokenWithdrawalComplete(tokenAddress, amount);
	}

	function withDrawAmount(uint256 amount) public {
		require(tokenBalance[tokenAddress] >= amount);
		ERC20 tokenDetail = ERC20(tokenAddress);
		require(tokenDetail.transfer(msg.sender, amount), "the transfer failed");
		tokenBalance[tokenAddress] -= amount;
		emit tokenWithdrawalComplete(tokenAddress, amount);
	}

}
