import {rxMapIpcArg} from './rx-map-ipc-arg'
import {IPCObservable} from './create-ipc-on'

export const createIpcArgOn = (ipc$: IPCObservable) => <T>(event: string) => ipc$<T>(event)
  .pipe(rxMapIpcArg())
