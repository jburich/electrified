jest.mock('../run-exec');
import test from '../open-dmg';
import exe from '../run-exec';

describe('open-app', () => {
  it('should launch the app on a Mac', async () => {
    //NOTE this works on a Mac right now because it is assumed that it will only be run on a Mac
    await test('testdir', 'testPackageName');

    expect(exe).toHaveBeenCalledWith(
      'testdir',
      'open dist/testPackageName.dmg'
    );
  });
});
