  import HashMap "mo:base/HashMap";
  import Iter "mo:base/Iter";
  import Principal "mo:base/Principal";
  import Nat "mo:base/Nat";
  import Hash "mo:base/Hash";
  import Nat32 "mo:base/Nat32";

  actor class NFTCanister() = this {

    func natHash(n : Nat) : Hash.Hash {
      // Use modulo a large prime number for safer hashing (or customize as needed)
      return Nat32.fromNat(n % 0xFFFF_FFFF);
    };

    // Token ID to owner mapping
    var tokenOwners : HashMap.HashMap<Nat, Principal> = HashMap.HashMap<Nat, Principal>(10, Nat.equal, natHash);

    // Next token ID
    var nextTokenId : Nat = 0;

    // Optional: stable version for upgrade support
    stable var _stableTokenOwners : [(Nat, Principal)] = [];

    system func preupgrade() {
      _stableTokenOwners := Iter.toArray(tokenOwners.entries());
    };

    system func postupgrade() {
      tokenOwners := HashMap.fromIter(_stableTokenOwners.vals(), 10, Nat.equal, natHash);
    };

    /// Mint a new token to a recipient
    public func mint(recipient : Principal) : async Nat {
      let tokenId = nextTokenId;
      nextTokenId += 1;

      tokenOwners.put(tokenId, recipient);

      return tokenId;
    };

    /// Get the owner of a token
    public query func ownerOf(tokenId : Nat) : async ?Principal {
      tokenOwners.get(tokenId)
    };

    /// Get all tokens owned by a principal (slow for large data!)
    public query func tokensOf(owner : Principal) : async [Nat] {
      Iter.toArray(
        Iter.map<(Nat, Principal), Nat>(
          Iter.filter<(Nat, Principal)>(
            tokenOwners.entries(),
            func(entry : (Nat, Principal)) : Bool {
              let (tokenId, tokenOwner) = entry;
              tokenOwner == owner
            }
          ),
          func(entry : (Nat, Principal)) : Nat {
            let (tokenId, _) = entry;
            tokenId
          }
        )
      )
    };

    /// Get total supply of minted tokens
    public query func totalSupply() : async Nat {
      nextTokenId
    };

    /// Get a simple tokenURI (metadata URL or string)
    /// For demo, returns a simple string containing tokenId
    public query func tokenURI(tokenId : Nat) : async Text {
      switch (tokenOwners.get(tokenId)) {
        case (?_) {
          // Return a dummy metadata URL or JSON string
          // In production, link this to IPFS or real metadata storage
          "https://my-nft-metadata-server.com/metadata/" # Nat.toText(tokenId)
        };
        case null {
          "Token does not exist"
        };
      }
    };

    /// Transfer NFT to another principal (simple ownership check)
    /// Transfer NFT to another principal (simple ownership check)
  // shared func transfer(to : Principal, tokenId : Nat) : async Bool {
  //   switch (tokenOwners.get(tokenId)) {
  //     case (?owner) {
  //       if (owner == caller) {
  //         tokenOwners.put(tokenId, to);
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     };
  //     case null {
  //       return false;
  //     };
  //   }
  // };

    /// Get all minted tokens (can be large, use carefully!)
    public query func allTokens() : async [Nat] {
      // Since token IDs are sequential from 0 to nextTokenId-1, just build the array
      Iter.toArray(Iter.range(0, nextTokenId - 1))
    };

  }
