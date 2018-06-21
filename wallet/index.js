const {INITIAL_BALANCE} = require('../config');
const ChainUtils = require('../utils/chain');
const Transaction = require('./transaction');

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtils.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  static blockchainWallet() {
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }

  toString() {
    return `Wallet -
      Public Key  : ${this.publicKey.toString()}
      Balance     : ${this.balance}
    `;
  }

  sign(dataHash) {
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain);

    if (amount > this.balance) {
      console.log(`Amount: ${amount} exceeds current balance: ${this.balance}`);
      return;
    }

    let transaction = transactionPool.existingTransaction(this.publicKey);

    if (transaction) {
      transaction.update(this, recipient, amount);
    } else {
      transaction = Transaction.newTransaction(this, recipient, amount);
      transactionPool.updateOrAddTransaction(transaction);
    }

    return transaction;
  }

  calculateBalance(blockchain) {
    let balance = this.balance;
    let transactions = [];

    blockchain.chain.forEach(block =>
      block.data.forEach(transaction => {
        transactions.push(transaction);
      })
    );

    const walletInputTransactions = transactions.filter(
      transaction => transaction.input.address === this.publicKey
    );

    let startTime = 0;

    if (walletInputTransactions.length) {
      const recentInputTransaction = walletInputTransactions.reduce(
        (prev, current) =>
          prev.input.timestamp > current.input.timestamp ? prev : current
      );

      balance = recentInputTransaction.outputs.find(
        output => output.address === this.publicKey
      ).amount;

      startTime = recentInputTransaction.input.timestamp;
    }

    transactions.forEach(transaction => {
      if (transaction.input.timestamp > startTime) {
        transaction.outputs.find(output => {
          if (output.address === this.publicKey) {
            balance = balance + output.amount;
          }
        });
      }
    });

    return balance;
  }
}

module.exports = Wallet;
