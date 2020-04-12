import {setText} from './set-text'

export const buildUlList = (items: string[]) => items
  .map(item => setText(document.createElement('li'), item))
