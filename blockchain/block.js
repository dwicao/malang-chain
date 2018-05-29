const sha256 = require('crypto-js/sha256');
const {DIFFICULTY} = require('../config');

class Block {
  static genesis() {
    return new this('Genesis Time', '----------', 'f1r5t-h45h', [], 0);
  }

  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    let nonce = 0;

    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timestamp = Date.now();
      hash = Block.hash(timestamp, lastHash, data, nonce);
    } while (hash.substring(0, DIFFICULTY) !== '0'.repeat(DIFFICULTY));

    return new this(timestamp, lastHash, hash, data, nonce);
  }

  static hash(timestamp, lastHash, data, nonce) {
    return sha256(`${timestamp}${lastHash}${data}${nonce}`).toString();
  }

  static blockHash(block) {
    const {timestamp, lastHash, data, nonce} = block;

    return Block.hash(timestamp, lastHash, data, nonce);
  }

  constructor(timestamp, lastHash, hash, data, nonce) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash}
      Hash      : ${this.hash}
      Nonce     : ${this.nonce}
      Data      : ${this.data}
    `;
  }
}

module.exports = Block;
