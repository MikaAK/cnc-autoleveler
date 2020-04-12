import {switchMap, tap} from 'rxjs/operators'

import {
  FETCH_PORTS, LOADED_PORTS,
  CONNECTED_PORT, CONNECT_PORT,
  CONNECTION_ERROR, PORT_MESSAGE
} from 'common/events'

import {IPCEvent} from 'common/helpers'

import {listSerialPorts, connectToSerialPort} from 'main/serial-connection'
import {ipcOn$} from 'main/helpers'

import {ipcBinding} from './helpers'
import {catchError$} from './error'

export const setupSerialBindings = ipcBinding((sendWindowMessage) => {
  ipcOn$<void>(FETCH_PORTS)
    .pipe(switchMap(() =>
      listSerialPorts().pipe(catchError$(sendWindowMessage))))
    .subscribe(sendWindowMessage(LOADED_PORTS))

  const attemptSerialConnection = ({arg: port}: IPCEvent<string>) =>
    connectToSerialPort(port).pipe(catchError$(sendWindowMessage, CONNECTION_ERROR))

  ipcOn$<string>(CONNECT_PORT)
    .pipe(
      switchMap(attemptSerialConnection),
      tap(({port}) => sendWindowMessage(CONNECTED_PORT)(port)),
      switchMap((portControl) => portControl.read$.pipe(catchError$(sendWindowMessage)))
    )
    .subscribe(sendWindowMessage(PORT_MESSAGE)
})
