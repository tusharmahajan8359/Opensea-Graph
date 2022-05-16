import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  Market,
  CancelListing,
  ItemListed,
  MarketSaleCreated,
  OfferAccepted,
  OfferCanceled,
  OfferSent,
  TransferNFT,
  priceLowered,
} from "../generated/Market/Market";
import {
  Offer,
  NftTransfer,
  ItemList,
  Listing,
  MarketSaleCreat,
  OfferAccept,
  TokenOffer,
} from "../generated/schema";

export function handleItemListed(event: ItemListed): void {
  let entity = new ItemList(event.params._tokenId.toHex());
  entity.tokenId = event.params._tokenId;
  entity.price = event.params._price;
  entity.status = event.params._status;
  entity.save();

  let listing = new Listing(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  listing.tokenId = event.params._tokenId;
  listing.price = event.params._price;

  listing.time = event.block.timestamp;

  listing.save();
  //save
}
export function handlepriceLowered(event: priceLowered): void {
  let id = event.params._tokenId.toHex();
  let entity = ItemList.load(id);
  if (entity) {
    entity.tokenId = event.params._tokenId;
    entity.price = event.params._loweredPrice;
    entity.save();
  }
}
export function handleCancelListing(event: CancelListing): void {
  let id = event.params._tokenId.toHex();
  let entity = ItemList.load(id);
  if (entity) {
    entity.status = false;
    entity.save();
  }
}

export function handleMarketSaleCreated(event: MarketSaleCreated): void {
  let entity = new MarketSaleCreat(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.tokenId = event.params._tokenId;
  entity.buyer = event.params._buyer;
  entity.save();
}

export function handleOfferSent(event: OfferSent): void {
  let entity = new Offer(event.params._offerId.toHex());

  entity.offerId = event.params._offerId;
  entity.tokenId = event.params._tokenId;
  entity.offerPrice = event.params._offerPrice;
  entity.offerSender = event.params._offerSender;
  entity.status = event.params._status;
  entity.save();

  let offerIdentity = TokenOffer.load(event.params._tokenId.toHex());
  if (offerIdentity == null) {
    offerIdentity = new TokenOffer(event.params._tokenId.toHex());
    let ids = offerIdentity.offerIds;
    ids.push(event.params._offerId);
    offerIdentity.offerIds = ids;
    offerIdentity.tokenId = event.params._tokenId;
    offerIdentity.save();
  } else {
    let ids = offerIdentity.offerIds;
    ids.push(event.params._offerId);
    offerIdentity.offerIds = ids;
    offerIdentity.save();
  }
}

export function handleOfferCanceled(event: OfferCanceled): void {
  let id = event.params._offerId.toHex();

  let entity = Offer.load(id);

  store.remove("Offer", id);
}

export function handleOfferAccepted(event: OfferAccepted): void {
  let entity = new OfferAccept(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.tokenId = event.params._tokenId;
  entity.offerPrice = event.params._offerPrice;
  entity.save();

  let offerIdentity = TokenOffer.load(event.params._tokenId.toHex());
  if (offerIdentity) {
    let offers = offerIdentity.offerIds;
    for (let id = 0; id < offers.length; id++) {
      store.remove("Offer", offers[id].toHex());
    }
  }

  store.remove("TokenOffer", event.params._tokenId.toHex());

  let id = event.params._tokenId.toHex();
  let listentity = ItemList.load(id);
  if (listentity) {
    listentity.status = false;
  }
}

export function handleTransferNFT(event: TransferNFT): void {
  let entity = new NftTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  );
  entity.tokenId = event.params._tokenId;
  entity.from = event.params._from;
  entity.to = event.params._to;
  entity.save();
}
