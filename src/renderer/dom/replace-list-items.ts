import {clearChildren} from './clear-children'

export const replaceListItems = (
  list: HTMLUListElement | HTMLOListElement,
  liItems: HTMLLIElement[]
) => {
  clearChildren(list)

  liItems.map(item => list.append(item))

  return list
}

