import Error "mo:base/Error";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import P "mo:base/Prelude";

actor Dip721Nft {
	public shared query (doIOwn__msg) func doIOwn(tokenId : Nat) : async Bool {
		let caller = doIOwn__msg.caller; // First input
		_ownerOf(tokenId) == ?caller;
	};
	
	stable var name_ : Text = "etasesNFT";
	
	stable var symbol_ : Text = "ETAXN";
	
	// Adapted from: https://github.com/SuddenlyHazel/DIP721/blob/main/src/DIP721/DIP721.mo
	
	private type TokenAddress = Principal;
	private type TokenId = Nat;
	
	private stable var tokenPk : Nat = 0;
	
	private stable var tokenURIEntries : [(TokenId, Text)] = [];
	private stable var ownersEntries : [(TokenId, Principal)] = [];
	
	private let tokenURIs : HashMap.HashMap<TokenId, Text> = HashMap.fromIter<TokenId, Text>(tokenURIEntries.vals(), 10, Nat.equal, Hash.hash);
	private let owners : HashMap.HashMap<TokenId, Principal> = HashMap.fromIter<TokenId, Principal>(ownersEntries.vals(), 10, Nat.equal, Hash.hash);
	
	private func _unwrap<T>(x : ?T) : T {
		switch x {
			case null { P.unreachable() };
			case (?x_) { x_ };
		}
	};

	public shared query func allTokens() : async [TokenId] {
		return Iter.toArray(tokenURIs.keys());
	};
	
	public shared query func ownerOf(tokenId : TokenId) : async ?Principal {
		return _ownerOf(tokenId);
	};
	
	public shared query func tokenURI(tokenId : TokenId) : async ?Text {
		return _tokenURI(tokenId);
	};
	
	public shared query func name() : async Text {
		return name_;
	};
	
	public shared query func symbol() : async Text {
		return symbol_;
	};
	
	public shared(msg) func transferFrom(from : Principal, to : Principal, tokenId : Nat) : () {
		assert _exists(tokenId);
		assert (msg.caller == _unwrap(_ownerOf(tokenId)));
		
		_transfer(from, to, tokenId);
	};
	
	public shared(msg) func mint(uri : Text) : async Nat {
		tokenPk += 1;
		_mint(msg.caller, tokenPk, uri);
		return tokenPk;
	};
	
	
	// Internal
	
	private func _ownerOf(tokenId : TokenId) : ?Principal {
		return owners.get(tokenId);
	};
	
	private func _tokenURI(tokenId : TokenId) : ?Text {
		return tokenURIs.get(tokenId);
	};
	
	private func _exists(tokenId : Nat) : Bool {
		return Option.isSome(owners.get(tokenId));
	};
	
	private func _transfer(from : Principal, to : Principal, tokenId : Nat) : () {
		assert _exists(tokenId);
		assert _unwrap(_ownerOf(tokenId)) == from;
		
		owners.put(tokenId, to);
	};
	
	private func _mint(to : Principal, tokenId : Nat, uri : Text) : () {
		assert not _exists(tokenId);
		
		owners.put(tokenId, to);
		tokenURIs.put(tokenId,uri)
	};
	
	private func _burn(tokenId : Nat) {
		let owner = _unwrap(_ownerOf(tokenId));
		
		ignore owners.remove(tokenId);
	};
	
	system func preupgrade() {
		tokenURIEntries := Iter.toArray(tokenURIs.entries());
		ownersEntries := Iter.toArray(owners.entries());
	};
	
	system func postupgrade() {
		tokenURIEntries := [];
		ownersEntries := [];
	};
}
