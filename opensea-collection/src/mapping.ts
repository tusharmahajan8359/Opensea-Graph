import { BigInt } from "@graphprotocol/graph-ts";
import {
  CoreCollection,
  Approval,
  ApprovalForAll,
  CollectionCreated,
  NFTCreated,
  TokenCreated,
  Transfer,
} from "../generated/CoreCollection/CoreCollection";
import { Collection, Token, NFT } from "../generated/schema";

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  // BigInt and BigDecimal math are supported
  // Entity fields can be set based on event parameters
  // Entities can be written to the store with `.save()`
  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.
  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.NFTs(...)
  // - contract.balanceOf(...)
  // - contract.collectionIdToUser(...)
  // - contract.collections(...)
  // - contract.getAllCollections(...)
  // - contract.getApproved(...)
  // - contract.getCollectionIds(...)
  // - contract.getItems(...)
  // - contract.getMyNFTs(...)
  // - contract.isApprovedForAll(...)
  // - contract.name(...)
  // - contract.ownerOf(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
  // - contract.userToCollectionIds(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleCollectionCreated(event: CollectionCreated): void {
  let entity = new Collection(event.params._collectionId.toHex());
  entity.name = event.params._name;
  entity.collectionId = event.params._collectionId;
  entity.collectionLink = event.params._collectionLink;
  entity.creator = event.params._creator;

  entity.save();
}

export function handleNFTCreated(event: NFTCreated): void {
  let entity = new NFT(event.params._itemId.toHex());
  entity.itemId = event.params._itemId;
  entity.nftName = event.params._NFTName;
  entity.collectionId = event.params._collectionId;
  entity.creator = event.params._creator;
  entity.nftLink = event.params._NftLink;
  entity.save();

  let collection = Collection.load(event.params._collectionId.toHex());
  if (collection) {
    let nfts = collection.nfts;
    if (nfts) {
      nfts.push(event.params._itemId);
      collection.nfts = nfts;
    } else {
      let nft: Array<BigInt> = [];
      nft.push(event.params._itemId);
      collection.nfts = nft;
    }

    collection.save();
    //save
  }
}

export function handleTokenCreated(event: TokenCreated): void {
  let entity = new Token(event.params._newItemId.toHex());
  entity.tokenURI = event.params._tokenURI;
  entity.itemId = event.params._newItemId;
  entity.save();
}

export function handleTransfer(event: Transfer): void {
  let id = event.params.tokenId.toHex();
  let nft = NFT.load(id);
  if (nft) {
    nft.creator = event.params.to;
    nft.save();
  }
}
