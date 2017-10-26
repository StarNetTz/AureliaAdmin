import {Shell} from '../../src/shell';

describe('the shell', () => {
  it('says hello', () => {
    expect(new Shell().message).toBe('Hello World!');
  });
});
