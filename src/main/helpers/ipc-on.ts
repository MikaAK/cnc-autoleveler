import {ipcMain} from 'electron'

import {createIpcOn} from 'common/helpers'

export const ipcOn$ = createIpcOn(ipcMain)
