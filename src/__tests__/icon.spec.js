jest.mock('../run-exec');
jest.mock('image-downloader');
import test from '../icon';
import exe from '../run-exec';
import download from 'image-downloader';

describe('build', () => {
  it('should download the icon if a url is passed in', async () => {
    await test('testdir', 'https://placekitten.com/1000/1000');

    expect(exe).toHaveBeenCalledWith('testdir', 'mkdir build');

    expect(download.image).toHaveBeenCalledWith({
      url: 'https://placekitten.com/1000/1000',
      dest: 'testdir/build/icon.png'
    });
  });

  it('should copy the icon if a path is passed in', async () => {
    await test('testdir', '/usr/local/puppy_picture.png');

    expect(exe).toHaveBeenCalledWith('testdir', 'mkdir build');

    expect(exe).toHaveBeenCalledWith(
      'testdir/build',
      'cp /usr/local/puppy_picture.png icon.png'
    );
  });
});
