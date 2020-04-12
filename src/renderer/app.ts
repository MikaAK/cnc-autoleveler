import {setupSerialList, showErrorInModal} from './components'
import {mainError$} from './ipc-bindings'

mainError$.subscribe(showErrorInModal)

setupSerialList()
