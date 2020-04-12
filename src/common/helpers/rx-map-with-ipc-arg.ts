import {map as rxMap} from 'rxjs/operators'

export const rxMapWithIpcArg = (fn: (item: any) => any) => rxMap<any, any>(({arg}) => fn(arg))
