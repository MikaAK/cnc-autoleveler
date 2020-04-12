import {Observable} from 'rxjs'
import {Event} from 'electron'

export type IPCEvent<T> = {event: Event, arg: T}

export type IPCObservable = <T>(eventName: string) => Observable<IPCEvent<T>>

export const createIpcOn = (ipc: any): IPCObservable => <T>(eventName: string) => new Observable<IPCEvent<T>>((observer) => {
  const callback = (event: Event, arg: T) => {
    observer.next({event, arg})
  }

  ipc.on(eventName, callback)

  return () => ipc.removeListener(eventName, callback)
})
