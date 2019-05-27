export const onTitleChange = title => {
  const count = title.match(/\(([0-9]*)\)/)
  if (count && count.length > 1) {
    app.dock.setBadge(count[1])
  } else {
    app.dock.setBadge('')
  }
}

function createMainWindow() {
  window.on('page-title-updated', (event, title) => onTitleChange(title))
}
