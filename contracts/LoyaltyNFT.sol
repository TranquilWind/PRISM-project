// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LoyaltyNFT is ERC721, ERC721Enumerable, Ownable {
    using Strings for uint256;

    // Loyalty Program States
    enum Level { BRONZE, SILVER, GOLD, PLATINUM }
    
    struct LoyaltyData {
        Level level;
        uint256 points;
        uint256 lastActivity;
        uint256 referralCount;
        uint256 holdingPeriod;
    }

    mapping(uint256 => LoyaltyData) public tokenLoyalty;
    mapping(address => bool) public authorizedOperators;
    
    uint256 private _nextTokenId;
    
    // Points thresholds
    uint256 public constant SILVER_THRESHOLD = 100;
    uint256 public constant GOLD_THRESHOLD = 500;
    uint256 public constant PLATINUM_THRESHOLD = 1000;
    
    // Events
    event PointsEarned(uint256 indexed tokenId, uint256 points, string activity);
    event LevelUp(uint256 indexed tokenId, Level newLevel);
    event ReferralBonus(uint256 indexed tokenId, address referrer);

    constructor() ERC721("LoyaltyNFT", "LNFT") Ownable(msg.sender) {}

    function safeMint(address to) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        tokenLoyalty[tokenId] = LoyaltyData(Level.BRONZE, 0, block.timestamp, 0, 0);
    }

    function addPoints(uint256 tokenId, uint256 points, string memory activity) public {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) != address(0), "Token must have an owner");
        
        LoyaltyData storage data = tokenLoyalty[tokenId];
        data.points += points;
        data.lastActivity = block.timestamp;
        
        _updateLevel(tokenId);
        emit PointsEarned(tokenId, points, activity);
    }

    function addReferral(uint256 tokenId, address referrer) public {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(referrer != address(0), "Invalid referrer address");
        
        LoyaltyData storage data = tokenLoyalty[tokenId];
        data.referralCount++;
        data.points += 50; // Bonus points for referral
        
        _updateLevel(tokenId);
        emit ReferralBonus(tokenId, referrer);
    }

    function _updateLevel(uint256 tokenId) internal {
        LoyaltyData storage data = tokenLoyalty[tokenId];
        Level newLevel = data.level;

        if (data.points >= PLATINUM_THRESHOLD) {
            newLevel = Level.PLATINUM;
        } else if (data.points >= GOLD_THRESHOLD) {
            newLevel = Level.GOLD;
        } else if (data.points >= SILVER_THRESHOLD) {
            newLevel = Level.SILVER;
        }

        if (newLevel != data.level) {
            data.level = newLevel;
            emit LevelUp(tokenId, newLevel);
        }
    }

    function getDiscount(uint256 tokenId) public view returns (uint256) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        Level level = tokenLoyalty[tokenId].level;
        
        if (level == Level.PLATINUM) return 25;
        if (level == Level.GOLD) return 15;
        if (level == Level.SILVER) return 10;
        return 5; // BRONZE level
    }

    function getLoyaltyData(uint256 tokenId) public view returns (LoyaltyData memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenLoyalty[tokenId];
    }

    // Override required functions
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 