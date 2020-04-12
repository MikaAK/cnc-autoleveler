import {ipcRenderer} from 'electron'

export const ipcSend = <T>(event: string, payload: T | null = null) => {
  console.debug(`Sending Event ${event}`, payload)

  ipcRenderer.send(event, payload)
}

export const curriedIpcSend = (event: string) => <T>(payload: T | null = null) => {
  console.debug(`Sending Event ${event}`, payload)

  ipcRenderer.send(event, payload)
}
