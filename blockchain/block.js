const sha256 = require('crypto-js/sha256');
const {DIFFICULTY, MINE_RATE} = require('../config');

class Block {
  static genesis() {
    return new this(
      'Genesis Time',
      '----------',
      'f1r5t-h45h',
      [],
      0,
      DIFFICULTY
    );
  }

  static mineBlock(lastBlock, data) {
    let hash, timestamp;
    let nonce = 0;
    let {difficulty} = lastBlock;

    const lastHash = lastBlock.hash;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = Block.hash(timestamp, lastHash, data, nonce, difficulty);
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return new this(timestamp, lastHash, hash, data, nonce, difficulty);
  }

  static hash(timestamp, lastHash, data, nonce, difficulty) {
    return sha256(
      `${timestamp}${lastHash}${data}${nonce}${difficulty}`
    ).toString();
  }

  static blockHash(block) {
    const {timestamp, lastHash, data, nonce, difficulty} = block;

    return Block.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  static adjustDifficulty(lastBlock, currentTime) {
    let {difficulty} = lastBlock;

    return lastBlock.timestamp + MINE_RATE > currentTime
      ? difficulty + 1
      : difficulty - 1;
  }

  constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY;
  }

  toString() {
    return `Block -
      Timestamp   : ${this.timestamp}
      Last Hash   : ${this.lastHash}
      Hash        : ${this.hash}
      Nonce       : ${this.nonce}
      Difficulty  : ${this.difficulty}
      Data        : ${this.data}
    `;
  }
}

module.exports = Block;
