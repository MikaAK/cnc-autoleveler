import {mergeMap} from 'rxjs/operators'

import {FETCH_PORTS, LOADED_PORTS} from 'common/events'

import {listSerialPorts} from '../serial-connection'

import {ipcOn$} from 'main/helpers'
import {ipcBinding} from './helpers'

export const setupSerialBindings = ipcBinding((sendWindowMessage) => {
  ipcOn$(FETCH_PORTS)
    .pipe(mergeMap(listSerialPorts))
    .subscribe(sendWindowMessage(LOADED_PORTS))
})
