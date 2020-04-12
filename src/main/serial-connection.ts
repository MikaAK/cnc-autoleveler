import SerialPort, {Binding as dumbBinding, PortInfo} from 'serialport'

import {from} from 'rxjs'
import {map} from 'rxjs/operators'

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

const byManifacture = (portA: PortInfo, _portB: PortInfo) =>
  portA.manufacturer ? 1 : 0)

export const listSerialPorts = () => from(Binding.list())
  .pipe(map((ports) =>
    (<unknown>ports as PortInfo[]).sort(byManifacture).map(humanizePortObject)))
