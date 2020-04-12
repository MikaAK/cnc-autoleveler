import {fromEvent, merge, BehaviorSubject} from 'rxjs'
import {map, mapTo, tap, switchMap, switchMapTo} from 'rxjs/operators'

import {buildUlList, replaceListItems} from 'renderer/dom'

import {
  fetchPorts,
  loadedPorts$,
  connectedToPort$,
  connectToPort,
  portConnectionError$,
  portMessage$
} from 'renderer/ipc-bindings'

import {showErrorInModal} from './error-modal'

const listenForClick = (liItems: HTMLLIElement[]) => {
  const itemClicks = liItems
    .map((liItem) => fromEvent(liItem, 'click').pipe(mapTo(liItem.innerText)))

  return merge(...itemClicks)
}

export const setupSerialList = () => {
  const findSerialContainer = document.getElementById('find-serial') as HTMLElement
  const serialSelectedContainer = document.getElementById('serial-selected') as HTMLElement
  const currentPort = document.getElementById('current-serial-port') as HTMLElement
  const serialList = document.getElementById('serial-list') as HTMLOListElement
  const fetchSerialButton = document.getElementById('fetch-serial') as HTMLElement
  const serialPortLoading = document.getElementById('serial-port-loading') as HTMLElement

  const selectedPort$ = new BehaviorSubject<string | null>(null)

  fromEvent(fetchSerialButton, 'click')
    .pipe(tap(() => fetchSerialButton.innerText = 'Refresh Devices'))
    .subscribe(fetchPorts)

  loadedPorts$
    .pipe(
      map(buildUlList),
      tap((portLiItems) => replaceListItems(serialList, portLiItems)),
      switchMap(listenForClick)
    )
    .subscribe(selectedPort$)

  selectedPort$
    .asObservable()
    .subscribe((port) => {
      if (port) {
        currentPort.innerText = `Selected Port: ${port}`
        serialPortLoading.hidden = false

        connectToPort(port)
      }

      findSerialContainer.hidden = !!port
      serialSelectedContainer.hidden = !port
    })

  connectedToPort$
    .pipe(
      tap(() => serialPortLoading.hidden = true),
      switchMapTo(portMessage$)
    )
    .subscribe((message) => console.log('got message', message))

  portConnectionError$
    .pipe(
      tap((error) => {
        serialPortLoading.hidden = true
        showErrorInModal(error, 'Connection Error')
      }),
      mapTo(null)
    )
    .subscribe(selectedPort$)
}
