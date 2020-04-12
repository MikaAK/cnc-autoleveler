import {LOADED_PORTS, FETCH_PORTS} from 'common/events'

import {ipcArgOn$, ipcSend} from 'renderer/helpers'

export const loadedPorts$ = ipcArgOn$<string[]>(LOADED_PORTS)
export const fetchPorts = () => ipcSend(FETCH_PORTS)
