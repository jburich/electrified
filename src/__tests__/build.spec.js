jest.mock('../run-yarn');
import build from '../build';
import yarn from '../run-yarn';

describe('build', () => {
  it('should run the build step from yar', () => {
    build('testdir');
    expect(yarn).toHaveBeenCalledWith('testdir', 'dist');
  });
});
