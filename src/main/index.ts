import {BrowserWindow} from 'electron'

import {setupSerialBindings} from './ipc-bindings'

export const main = (window: BrowserWindow) => {
  setupSerialBindings(window)
}
