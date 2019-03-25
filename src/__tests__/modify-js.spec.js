import { setBrowserOptions } from '../modify-js';

describe('modify-js', () => {
  describe('setBrowserOptions', () => {
    xit('should not fail on an empty "base"', () => {
      expect(setBrowserOptions([])).toEqual([]);
    });
    xit('should find the new BrowserWindow line and add the options to the constructor', () => {
      const input = [
        'an import line',
        'a function line',
        'const window = new BrowserWindow()',
        'some other codes',
        '}'
      ];
      expect(setBrowserOptions(input)).toEqual([
        'an import line',
        'a function line',
        'const window = new BrowserWindow({webPreferences:{sandbox:true}})',
        'some other codes',
        '}'
      ]);
    });
  });
});
