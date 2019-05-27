jest.mock('fs')
jest.mock('util')
import fs from 'fs'
import { promisify } from 'util'
import {
  setBrowserOptions,
  read,
  isImport,
  isConst,
  isFunction,
  isLoadUrl,
  isElse,
  isListener
} from '../modify-js'

describe('modify-js', () => {
  describe('setBrowserOptions', () => {
    it('should not fail on an empty "base"', () => {
      expect(setBrowserOptions([])).toEqual([])
    })

    it('should find the new BrowserWindow line and add the options to the constructor', () => {
      const input = [
        'an import line',
        'a function line',
        'const window = new BrowserWindow()',
        'some other codes',
        '}'
      ]
      expect(setBrowserOptions(input)).toEqual([
        'an import line',
        'a function line',
        'const window = new BrowserWindow({webPreferences:{sandbox:true}})',
        'some other codes',
        '}'
      ])
    })
  })
  describe('read', () => {
    beforeEach(fs.clearMockData)

    it('should read a file into an array of lines', () => {
      fs.setMockFile(
        'testfile',
        `
        this is
        a file
        with multiple
        lines`
      )

      expect(read('testfile')).toEqual([
        '',
        '        this is',
        '        a file',
        '        with multiple',
        '        lines'
      ])
    })
  })

  describe('isImport', () => {
    it('should find an import line', () => {
      expect(isImport("import something from 'somewhere';")).toBeTruthy()
    })
    it('should find a "use strict" line', () => {
      expect(isImport("'use strict'")).toBeTruthy()
    })
  })

  describe('isConst', () => {
    it('should find a const line', () => {
      expect(isConst("const foo = 'bar';")).toBeTruthy()
    })
  })

  describe('isFunction', () => {
    it('should find a function line', () => {
      expect(isFunction('function createMainWindow() {')).toBeTruthy()
    })
  })

  describe('isLoadUrl', () => {
    it('should find the url load line', () => {
      expect(
        isLoadUrl("window.loadURL('https://mail.google.com/mail/u/0/');")
      ).toBeTruthy()
    })
  })

  describe('isElse', () => {
    it('should find an else', () => {
      expect(isElse('} else {')).toBeTruthy()
    })
    it('should find an else if', () => {
      expect(isElse('} else if(something) {')).toBeTruthy()
    })
  })

  describe('isListener', () => {
    it('should find an app listener line', () => {
      expect(isListener("app.on('window-all-closed', () => {")).toBeTruthy()
    })
  })

  describe('isElseEnd', () => {
    it('should find an app listener line', () => {
      expect(isListener("app.on('window-all-closed', () => {")).toBeTruthy()
    })
  })

  describe('isReturn', () => {
    it('should find an app listener line', () => {
      expect(isListener("app.on('window-all-closed', () => {")).toBeTruthy()
    })
  })
})
