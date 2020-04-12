export const setText = <T extends HTMLElement>(item: T, text: string) => {
  item.innerText = text

  return item
}
