let mockListeners = []

global.app = {
  on: (name, action) => (mockListeners[name] = action),
  quit: jest.fn().mockName('quit')
}

export const getAppListeners = () => mockListeners

beforeEach(() => {
  mockListeners = []
})
