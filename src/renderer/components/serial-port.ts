import {fromEvent, merge, BehaviorSubject, Observable} from 'rxjs'
import {map, mapTo, tap, switchMap, shareReplay, withLatestFrom} from 'rxjs/operators'

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

const isProbeTouching = (event: string) =>
  event === 'PROBE_CONNECTED'

export const onFetchSerialButton = (button: HTMLElement) => fromEvent(button, 'click')
  .pipe(tap(() => button.innerText = 'Refresh Devices'))

export const onDisconnectPortButtonClick = (
  button: HTMLElement,
  selectedPort$: Observable<string | null>
) => fromEvent(button, 'click')
  .pipe(withLatestFrom(selectedPort$))

export const onPortSelection = (
  loadedPorts$: Observable<string[]>,
  serialList: HTMLOListElement
) => loadedPorts$
  .pipe(
    map(buildUlList),
    tap((portLiItems) => replaceListItems(serialList, portLiItems)),
    switchMap(listenForClick)
  )

export const setupSerialList = () => {
  const findSerialContainer = document.getElementById('find-serial') as HTMLElement
  const serialSelectedContainer = document.getElementById('serial-selected') as HTMLElement
  const currentPort = document.getElementById('current-serial-port') as HTMLElement
  const serialList = document.getElementById('serial-list') as HTMLOListElement
  const fetchSerialButton = document.getElementById('fetch-serial') as HTMLElement
  const serialPortLoading = document.getElementById('serial-port-loading') as HTMLElement
  const disconnectPortButton = document.getElementById('serial-port-disconnect') as HTMLElement
  const probeStatus = document.getElementById('probe-status') as HTMLElement

  const selectedPort$ = new BehaviorSubject<string | null>(null)

  onDisconnectPortButtonClick(disconnectPortButton, selectedPort$)
    .subscribe(([, port]) => {
      if (port)
        disconnectPort(port)
    })

  onFetchSerialButton(fetchSerialButton).subscribe(fetchPorts)
  onPortSelection(loadedPorts$, serialList).subscribe(selectedPort$)

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
        probeStatus.innerText = ''
      }

      findSerialContainer.hidden = isPortSelected
      disconnectPortButton.hidden = !isPortSelected
      serialSelectedContainer.hidden = !isPortSelected
    })

  connectedToPort$.subscribe(() => serialPortLoading.hidden = true)

  disconnectedPort$
    .pipe(mapTo(null))
    .subscribe(selectedPort$)

  portConnectionError$
    .subscribe((error) => {
      serialPortLoading.hidden = true
      showErrorInModal(error, 'Connection Error')
    })

  const isProbeTouching$ = portMessage$
    .pipe(
      map(isProbeTouching),
      shareReplay(1)
    )

  isProbeTouching$.subscribe((isTouching) => {
    probeStatus.innerText = isTouching ? 'Probe Touching' : 'Probe Not Touching'
  })

  return isProbeTouching$
}
