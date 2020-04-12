import {ipcRenderer} from 'electron'
import {createIpcOn} from 'common/helpers'

export const ipcOn$ = createIpcOn(ipcRenderer)
