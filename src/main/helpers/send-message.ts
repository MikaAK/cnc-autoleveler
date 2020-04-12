import {BrowserWindow} from 'electron'

export const sendMessage = (window: BrowserWindow) =>
  (action: string) =>
    (data: any) => { window.webContents.send(action, data) })
