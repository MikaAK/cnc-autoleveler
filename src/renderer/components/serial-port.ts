import {fromEvent, merge, BehaviorSubject} from 'rxjs'
import {map, mapTo, tap, switchMap, switchMapTo, withLatestFrom} from 'rxjs/operators'

import {buildUlList, replaceListItems} from 'renderer/dom'

import {
  fetchPorts,
  loadedPorts$,
  connectedToPort$,
  connectToPort,
  portConnectionError$,
  portMessage$,
  disconnectPort,
  disconnectedPort$
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
  const disconnectPortButton = document.getElementById('serial-port-disconnect') as HTMLElement

  const selectedPort$ = new BehaviorSubject<string | null>(null)

  fromEvent(fetchSerialButton, 'click')
    .pipe(tap(() => fetchSerialButton.innerText = 'Refresh Devices'))
    .subscribe(fetchPorts)

  fromEvent(disconnectPortButton, 'click')
    .pipe(withLatestFrom(selectedPort$))
    .subscribe(([, port]) => {
      if (port)
        disconnectPort(port)
    })

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
      const isPortSelected = !!port
      if (port) {
        currentPort.innerText = `Selected Port: ${port}`
        serialPortLoading.hidden = false

        connectToPort(port)
      } else {
        currentPort.innerText = ''
      }

      findSerialContainer.hidden = isPortSelected
      disconnectPortButton.hidden = !isPortSelected
      serialSelectedContainer.hidden = !isPortSelected
    })

  connectedToPort$
    .pipe(
      tap(() => serialPortLoading.hidden = true),
      switchMapTo(portMessage$)
    )
    .subscribe((message) => console.log('got message', message))

  disconnectedPort$
    .pipe(mapTo(null))
    .subscribe(selectedPort$)

  portConnectionError$
    .subscribe((error) => {
      serialPortLoading.hidden = true
      showErrorInModal(error, 'Connection Error')
    })
}
