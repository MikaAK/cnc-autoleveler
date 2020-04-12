import {map as rxMap} from 'rxjs/operators'
import {IPCEvent} from './create-ipc-on'

export const rxMapIpcArg = <T>() => rxMap<IPCEvent<T>, T>(({arg}) => arg)
