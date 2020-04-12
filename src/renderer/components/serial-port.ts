import {fromEvent} from 'rxjs'

import {tap} from 'rxjs/operators'

import {fetchPorts, loadedPorts$} from 'renderer/ipc-bindings'
import {buildUlList, clearChildren} from 'renderer/dom'

export const setupSerialList = () => {
  const serialList = document.getElementById('serial-list') as HTMLElement
  const fetchSerialButton = document.getElementById('fetch-serial') as HTMLElement

  fromEvent(fetchSerialButton, 'click')
    .pipe(tap(() => fetchSerialButton.innerText = 'Refresh Devices'))
    .subscribe(fetchPorts)

  loadedPorts$
    .subscribe((items) => {
      const ulItems = buildUlList(items)

      clearChildren(serialList)
      ulItems.map(item => serialList.append(item))
    })
}
