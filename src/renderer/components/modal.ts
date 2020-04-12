import MicroModal from 'micromodal'

import {BehaviorSubject} from 'rxjs'

import {clearChildren} from 'renderer/dom'

export const modalChange$ = new BehaviorSubject<boolean>(false)

MicroModal.init({
  onShow: () => modalChange$.next(true),
  onClose: () => modalChange$.next(false)
})

const modalContent = document.getElementById('modal-content') as HTMLElement

const MODAL_ID = 'modal'

export const showModal = () => MicroModal.show(MODAL_ID)
export const hideModal = () => MicroModal.close(MODAL_ID)

export const changeModalContents = (htmlElement: HTMLElement) => {
  clearChildren(modalContent)

  modalContent.append(htmlElement)
}
