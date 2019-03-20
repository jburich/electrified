import {shell} from 'electron'

export const launchInNewWindow = window => {
  window.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })
};

function createMainWindow() {
  launchInNewWindow(window)
}
