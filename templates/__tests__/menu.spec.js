import { Menu } from 'electron'
import contextMenu from 'electron-context-menu'

import { setUpMenu, template } from '../menu'

describe('menu', () => {
  it('should set the context menu', () => {
    setUpMenu()
    expect(contextMenu).toHaveBeenCalled()
  })
  it('should set Application Menu', () => {
    Menu.buildFromTemplate.mockReturnValueOnce('mockTemplate')

    setUpMenu()
    expect(Menu.buildFromTemplate).toHaveBeenCalledWith(template)
    expect(Menu.setApplicationMenu).toHaveBeenCalledWith('mockTemplate')
  })
})
