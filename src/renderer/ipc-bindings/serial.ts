import {
  LOADED_PORTS, FETCH_PORTS,
  CONNECTED_PORT, CONNECT_PORT,
  CONNECTION_ERROR, PORT_MESSAGE
} from 'common/events'

import {ipcArgOn$, ipcSend} from 'renderer/helpers'

export const fetchPorts = () => ipcSend(FETCH_PORTS)
export const loadedPorts$ = ipcArgOn$<string[]>(LOADED_PORTS)

export const connectToPort = (port: string) => ipcSend(CONNECT_PORT, port)
export const connectedToPort$ = ipcArgOn$<string>(CONNECTED_PORT)
export const portConnectionError$ = ipcArgOn$<string>(CONNECTION_ERROR)
export const portMessage$ = ipcArgOn$<string>(PORT_MESSAGE)
