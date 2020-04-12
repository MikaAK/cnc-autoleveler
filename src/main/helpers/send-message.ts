import {BrowserWindow} from 'electron'

export type SendMessageFunction = (action: string) => (data: any) => void

export const sendMessage = (window: BrowserWindow): SendMessageFunction =>
  (action: string) => <T>(data: T) => {
    console.debug(`Sending Event: ${action}`, data)

    window.webContents.send(action, data)
  })
