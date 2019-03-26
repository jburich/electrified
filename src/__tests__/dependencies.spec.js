jest.mock('../run-yarn');
import test from '../dependencies';
import yarn from '../run-yarn';

describe('build', () => {
  it('should run the build step from yar', () => {
    test('testdir');
    expect(yarn).toHaveBeenCalledWith('testdir');
  });
});
