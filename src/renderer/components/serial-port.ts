import {fromEvent} from 'rxjs'

import {fetchPorts, loadedPorts$} from 'renderer/ipc-bindings'
import {buildUlList} from 'renderer/dom'

export const setupSerialList = () => {
  const serialList = document.getElementById('serial-list') as HTMLElement
  const fetchSerialButton = document.getElementById('fetch-serial') as HTMLElement

  fromEvent(fetchSerialButton, 'click').subscribe(fetchPorts)

  loadedPorts$
    .subscribe((items) => {
      const ulItems = buildUlList(items)

      serialList.innerHTML = ''
      ulItems.map(item => serialList.append(item))
    })
}
