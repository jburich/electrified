import { getAppListeners } from '../../__mocks__/globals'

describe('close', () => {
  it('should quite the app', () => {
    //run the code
    require('../close')

    //call the listener that should have gotten set up
    getAppListeners()['window-all-closed']()

    expect(global.app.quit).toHaveBeenCalled()
  })
})
