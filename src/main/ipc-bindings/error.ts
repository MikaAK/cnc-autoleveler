import {ObservableInput, empty} from 'rxjs'
import {catchError} from 'rxjs/operators'

import {MAIN_ERROR} from 'common/events'
import {SendMessageFunction} from 'main/helpers'

const errorMessage = (error: string | Error) => {
  if (error instanceof Error) {
    console.error(error.message, error.stack)

    return error.message
  } else {
    return error
  }
}

export const catchError$ = <T>(
  sendMessage: SendMessageFunction,
  errorEvent: string = MAIN_ERROR
) => catchError<T, ObservableInput<T>>((error: string | Error) => {
  sendMessage(errorEvent)(errorMessage(error))

  return empty()
})
