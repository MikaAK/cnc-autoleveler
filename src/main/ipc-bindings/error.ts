import {ObservableInput, empty} from 'rxjs'
import {catchError} from 'rxjs/operators'

import {MAIN_ERROR} from 'common/events'
import {SendMessageFunction} from 'main/helpers'

export const catchError$ = <T>(sendMessage: SendMessageFunction) => catchError<T, ObservableInput<T>>((error: string) => {
    sendMessage(MAIN_ERROR)(error)

    return empty()
  })
