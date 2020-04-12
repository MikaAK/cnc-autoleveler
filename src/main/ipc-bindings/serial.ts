import {switchMap, tap, takeUntil, finalize} from 'rxjs/operators'

import {
  FETCH_PORTS, LOADED_PORTS,
  CONNECTED_PORT, CONNECT_PORT,
  CONNECTION_ERROR, PORT_MESSAGE,
  DISCONNECT_PORT, DISCONNECTED_PORT
} from 'common/events'

import {IPCEvent} from 'common/helpers'

import {listSerialPorts, connectToSerialPort, SerialPortControl} from 'main/serial-connection'
import {ipcOn$} from 'main/helpers'

import {ipcBinding} from './helpers'
import {catchError$} from './error'

export const setupSerialBindings = ipcBinding((sendWindowMessage) => {
  ipcOn$<void>(FETCH_PORTS)
    .pipe(switchMap(() =>
      listSerialPorts().pipe(catchError$(sendWindowMessage))))
    .subscribe(sendWindowMessage(LOADED_PORTS))

  const attemptSerialConnection = ({arg: port}: IPCEvent<string>) =>
    connectToSerialPort(port)
      .pipe(
        takeUntil(disconnectPort$),
        finalize(() => sendWindowMessage(DISCONNECTED_PORT)(null))
        tap(({port}) => sendWindowMessage(CONNECTED_PORT)(port)),
        catchError$(sendWindowMessage, CONNECTION_ERROR)
      )

  const readPort = (portControl: SerialPortControl) => portControl.read$
    .pipe(tap((a) => console.log(a)), catchError$(sendWindowMessage))

  const disconnectPort$ = ipcOn$<string>(DISCONNECT_PORT)
    .pipe(tap(() => console.log("DISCONNECTED")))

  ipcOn$<string>(CONNECT_PORT)
    .pipe(
      switchMap(attemptSerialConnection),
      switchMap(readPort)
    )
    .subscribe(sendWindowMessage(PORT_MESSAGE))
})
