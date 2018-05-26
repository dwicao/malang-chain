const sha256 = require('crypto-js/sha256');

class Block {
  static genesis() {
    return new this('Genesis Time', '----------', 'f1r5t-h45h', []);
  }

  static mineBlock(lastBlock, data) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;
    const hash = Block.hash(timestamp, lastHash, data);

    return new this(timestamp, lastHash, hash, data);
  }

  static hash(timestamp, lastHash, data) {
    return sha256(`${timestamp}${lastHash}${data}`).toString();
  }

  constructor(timestamp, lastHash, hash, data) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp : ${this.timestamp}
      Last Hash : ${this.lastHash}
      Hash      : ${this.hash}
      Data      : ${this.data}
    `;
  }
}

module.exports = Block;
