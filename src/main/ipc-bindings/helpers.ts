import {BrowserWindow} from 'electron'

import {sendMessage} from 'main/helpers'

type SendMessageFunction = (event: string) => (data: any) => void

export const ipcBinding = (func: (sendMessageFnc: SendMessageFunction) => void) =>
  (window: BrowserWindow) => func(sendMessage(window))
