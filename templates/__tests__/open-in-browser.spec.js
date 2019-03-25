import { shell } from 'electron';
import { launchInNewWindow } from '../open-in-browser';

describe('open-in-browser', () => {
  it('should use the shell to open a new window', () => {
    const mockListeners = [];
    const mockWindow = {
      webContents: {
        on: (name, action) => (mockListeners[name] = action)
      }
    };
    const mockEvent = {
      preventDefault: jest.fn()
    };

    launchInNewWindow(mockWindow);

    mockListeners['new-window'](mockEvent, 'url_to_launch');

    expect(shell.openExternal).toHaveBeenCalledWith('url_to_launch');
  });
});
