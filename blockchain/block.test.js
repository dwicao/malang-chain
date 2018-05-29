const Block = require('./block');

describe('Block', () => {
  let data, lastBlock, block;

  beforeEach(() => {
    data = 'bar';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock, data);
  });

  it('sets the `data` to match the input', () => {
    expect(block.data).toEqual(data);
  });

  it('sets the `lastHash` to match the hash of the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it('generates a hash that matches the difficulty', () => {
    expect(block.hash.substring(0, block.difficulty)).toEqual(
      '0'.repeat(block.difficulty)
    );
  });

  it('lowers the difficulty for slowly mined blocks', () => {
    const ONE_HOUR = 360000;

    expect(Block.adjustDifficulty(block, block.timestamp + ONE_HOUR)).toEqual(
      block.difficulty - 1
    );
  });

  it('raises the difficulty for quickly mined blocks', () => {
    const ONE_MS = 1;

    expect(Block.adjustDifficulty(block, block.timestamp + ONE_MS)).toEqual(
      block.difficulty + 1
    );
  });
});
