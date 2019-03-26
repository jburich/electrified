jest.mock('../run-exec');
import test from '../run-yarn';
import mockExec from '../run-exec';

describe('run-yarn', () => {
  it('should run the command successfully', async () => {
    await test('testdir', 'testCommand');

    expect(mockExec).toHaveBeenCalledWith('testdir', 'yarn testCommand');
  });

  it('should run yarn with no parameters if nothing is passed in for the command', async () => {
    await test('testdir');

    expect(mockExec).toHaveBeenCalledWith('testdir', 'yarn ');
  });
});
