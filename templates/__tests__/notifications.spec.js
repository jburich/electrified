import { onTitleChange } from '../notifications'

describe('notifications', () => {
  it('should set the badge number on unread', () => {
    const mockSetBadge = jest.fn()
    const mockApp = {
      dock: {
        setBadge: mockSetBadge
      }
    }
    global.app = mockApp
    onTitleChange('Inbox (42) - jburich@gmail.com - Gmail')

    expect(mockSetBadge.mock.calls.length).toEqual(1)
    expect(mockSetBadge.mock.calls[0][0]).toEqual('42')
  })

  it('should set the badge number to blank when none are present', () => {
    const mockSetBadge = jest.fn()
    const mockApp = {
      dock: {
        setBadge: mockSetBadge
      }
    }
    global.app = mockApp
    onTitleChange('Inbox - jburich@gmail.com - Gmail')

    expect(mockSetBadge.mock.calls.length).toEqual(1)
    expect(mockSetBadge.mock.calls[0][0]).toEqual('')
  })
})
