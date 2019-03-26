import checkout from '../checkout';
import { Clone } from 'nodegit';
import rm from 'rimraf';

describe('build', () => {
  beforeEach(() => {
    Clone.mockReset();
    rm.sync.mockReset();
  });

  it('should remove the directory first to start clean and then checkout into it', async () => {
    Clone.mockResolvedValue(); // test a successful clone

    await checkout('testdir');

    expect(rm.sync).toHaveBeenCalledWith('testdir');
    expect(Clone).toHaveBeenCalledWith(
      'https://github.com/electron-userland/electron-webpack-quick-start.git',
      'testdir'
    );
    expect(rm.sync).toHaveBeenCalledWith('testdir/.git');
    expect(rm.sync).toHaveBeenCalledWith('testdir/.gitignore');
  });
});
