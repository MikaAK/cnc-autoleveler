import {empty, ObservableInput} from 'rxjs'
import {catchError} from 'rxjs/operators'

import {showModal, changeModalContents} from './modal'

export type ErrorModal = {title: string, message: string}

const createErrorElement = (error: string, title: string) => {
  const divEle = document.createElement('div')
  const titleEle = document.createElement('h3')
  const descriptionEle = document.createElement('p')

  titleEle.innerText = title
  descriptionEle.innerText = error

  divEle.append(titleEle)
  divEle.append(descriptionEle)

  return divEle
}

export const showErrorInModal = (message: string, title = 'Error') =>  {
  changeModalContents(createErrorElement(message, title))

  showModal()
}

export const catchErrorInModal = <T>() => catchError<T, ObservableInput<T>>((error: string) => {
  console.error(error)

  showErrorInModal(error)


  return empty()
})
