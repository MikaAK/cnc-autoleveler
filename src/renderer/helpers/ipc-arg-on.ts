import {createIpcArgOn} from 'common/helpers'

import {ipcOn$} from './ipc-on'

export const ipcArgOn$ = createIpcArgOn(ipcOn$)
