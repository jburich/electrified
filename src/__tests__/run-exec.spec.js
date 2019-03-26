jest.mock('child_process');
import test from '../run-exec';
import { execSync } from 'child_process';

describe('run-exec', () => {
  it('should run the command successfully', async () => {
    await test('testdir', 'the command to run');

    expect(execSync).toHaveBeenCalledWith('the command to run', {
      cwd: 'testdir',
      stdio: 'inherit'
    });
  });
});
