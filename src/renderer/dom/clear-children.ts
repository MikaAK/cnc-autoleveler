export const clearChildren = <T extends HTMLElement>(item: T) => {
  item.innerHTML = ''

  return item
}
