import {mergeMap} from 'rxjs/operators'

import {FETCH_PORTS, LOADED_PORTS} from 'common/events'

import {listSerialPorts} from '../serial-connection'

import {ipcOn$} from 'main/helpers'
import {ipcBinding} from './helpers'
import {catchError$} from './error'

export const setupSerialBindings = ipcBinding((sendWindowMessage) => {
  ipcOn$<void>(FETCH_PORTS)
    .pipe(mergeMap(() =>
      listSerialPorts().pipe(catchError$(sendWindowMessage))))
    .subscribe(sendWindowMessage(LOADED_PORTS))
})
