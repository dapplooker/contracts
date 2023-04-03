pragma solidity ^0.8.17;

/**
* @dev Contract defines way for 2-setp access control for the owner of contract.
* To avoid accidental transfer owner will have to first propose a new owner
* then new owner have to accept the ownership.
*/
abstract contract SafeOwn {
	address private _Owner;
	address private _pendingOwner;

	/**
	* @dev Emitted when the Ownership is transferred.
     */
	event ownershipTransferred(
		address indexed currentOwner,
		address indexed newOwner,
		uint256 indexed trasnferredTimestamp
	);
	/**
	* @dev Emitted when the Ownership is retained by the current Owner.
     */
	event ownershipRetained(
		address indexed currentOwner,
		uint256 indexed trasnferredTimestamp
	);

	/**
	* @notice Initializes the Deployer as the Owner of the contract.
     */

	constructor()
    {
		_Owner = msg.sender;
		emit ownershipTransferred(address(0), _Owner, block.timestamp);
	}

	/**
	* @notice Throws if the caller is not the Owner.
     */
	modifier onlyOwner()
    {
		require(Owner() == msg.sender, "SafeOwn: Caller is the not the Owner");
		_;
	}

	/**
	* @notice Throws if the caller is not the Pending Owner.
     */
	modifier onlyPendingOwner()
    {
		require(_pendingOwner == msg.sender, "SafeOwn: Caller is the not the Pending Owner");
		_;
	}

	/**
	* @notice Returns the current Owner.
     * @dev Returns owner of contract
     */

	function Owner()
	public
	view
	virtual
	returns (address)
    {
		return _Owner;
	}

	/**
	* @notice Returns the Pending Owner.
     */
	function pendingOwner()
	public
	view
	virtual
	returns (address)
    {
		return _pendingOwner;
	}

	/**
	* @notice Owner can propose ownership to a new Owner(newOwner).
     * @dev Owner can not propose ownership, if it has called renounceOwnership and
     * not retained the ownership yet.
     * @param newOwner address of the new owner to propose ownership to.
     */
	function proposeOwnership(
		address newOwner
	)
    public
	virtual
	onlyOwner
    {
		require(newOwner != address(0), "SafeOwn: New Owner can not be a Zero Address");
		_pendingOwner = newOwner;
	}

	/**
	* @notice Pending Owner can accept the ownership proposal and become the new Owner.
     */
	function acceptOwnership()
	public
	virtual
	onlyPendingOwner
    {
		address currentOwner = _Owner;
		address newOwner = _pendingOwner;
		_Owner = _pendingOwner;
		_pendingOwner = address(0);
		emit ownershipTransferred(currentOwner, newOwner, block.timestamp);
	}
}
