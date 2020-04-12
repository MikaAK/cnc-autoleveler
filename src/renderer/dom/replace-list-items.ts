import {clearChildren} from './clear-children'

export const replaceListItems = (
  list: HTMLUListElement | HTMLOListElement,
  liItems: HTMLLIElement[]
) => {
  const fragment = document.createDocumentFragment()

  liItems.forEach(item => fragment.append(item))

  clearChildren(list)
  list.append(fragment)

  return list
}

