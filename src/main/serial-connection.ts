import
  SerialPort,
  {Binding as dumbBinding, PortInfo, OpenOptions}
from 'serialport'

import {Observable, from, fromEvent} from 'rxjs'
import {map, debounceTime} from 'rxjs/operators'

const Binding = <unknown>dumbBinding as {list: () => Promise<PortInfo[]>}

// const Readline = parsers.Readline

const DEFAULTS = {
  autoOpen: false,
  baudRate: 115200
}

export const createSerialConnection = (port: string, config = DEFAULTS) =>
  new SerialPort(port, config)

const humanizePortObject = (port: PortInfo) =>
  port.manufacturer ? `${port.manufacturer} - ${port.path}` : port.path

const byManifacture = (portA: PortInfo, portB: PortInfo) => {
  const bothHaveManifacturer = portA.manufacturer && portB.manufacturer
  if (bothHaveManifacturer || (!portA.manufacturer && !portB.manufacturer)) {
    return 0
  } else if (portA.manufacturer) {
    return -1
  } else {
    return 1
  }
}

export const listSerialPorts = () => from(Binding.list())
  .pipe(map((ports) =>
    (<unknown>ports as PortInfo[]).sort(byManifacture).map(humanizePortObject)))

export type SerialPortControl = {
  port: string
  read$: Observable<string>,
  write: (str: string) => boolean
}

const removeManifacturerPrefix = (port: string) => (port.match(/(?:[ ]+)?([^\ ]+)$/) as string[])[1]

export const connectToSerialPort = (port: string, config: OpenOptions = {}) => {
  port = removeManifacturerPrefix(port)

  const serialPort = new SerialPort(port, {...config, autoOpen: false, baudRate: 115200})

  const serialPort$ = new Observable<SerialPortControl>((observer) => {
    serialPort.open((err) => {
      if (err) {
        console.error('SerialPort Error', err)

        observer.error(err)
      }

      const read$ = fromEvent<Buffer>(serialPort, 'data')
        .pipe(
          // Due to button debouncing not working for pullup buttons
          // introduce a sofftware debounce
          debounceTime(20),
          map((buffer) => buffer.toString())
        )

      observer.next({
        port,
        read$,

        write(str: string) {
          return serialPort.write(str)
        }
      })
    })

    return () => {
      if (serialPort.isOpen)
        serialPort.close()
    }
  })

  return serialPort$
}
