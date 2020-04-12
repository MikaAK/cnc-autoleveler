import {MAIN_ERROR} from 'common/events'

import {ipcArgOn$} from 'renderer/helpers'

export const mainError$ = ipcArgOn$<string>(MAIN_ERROR)
