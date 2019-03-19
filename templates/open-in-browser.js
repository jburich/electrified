import { shell } from 'electron'

function createMainWindow() {
  window.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })
}
