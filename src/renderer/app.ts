import {setupSerialList, showErrorInModal, setupGCodeViewer} from './components'
import {mainError$} from './ipc-bindings'

mainError$.subscribe(showErrorInModal)

setupSerialList()
setupGCodeViewer()
