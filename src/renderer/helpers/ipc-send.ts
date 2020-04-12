import {ipcRenderer} from 'electron'

export const ipcSend = (event: string, payload: any = null) => ipcRenderer.send(event, payload)
export const curriedIpcSend = (event: string) => (payload: any = null) => ipcRenderer.send(event, payload)
