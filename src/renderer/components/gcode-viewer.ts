import {createSVG} from 'cnctosvg'

// import {fromEvent} from 'rxjs'
import {map, shareReplay} from 'rxjs/operators'

import {readFileContentsOnChange} from 'renderer/dom'

const colours = {
  G0: 'red',
  G1: 'green',
  G2G3: 'blue'
}

const HEIGHT = window.innerHeight / 2
const WIDTH = HEIGHT

export const convertGCodeToSVG = (gcode: string, title: string): string =>
  createSVG(gcode, colours, title, HEIGHT, WIDTH, 1, true)

export const setupGCodeViewer = () => {
  const fileSelector = document.getElementById('gcode-selector') as HTMLElement
  const gcodeViewer = document.getElementById('gcode-viewer') as HTMLElement

  const gcodeAndFile$ = readFileContentsOnChange(fileSelector)
    .pipe(shareReplay(1))

  gcodeAndFile$
    .pipe(map(({text: gcode, file}) => convertGCodeToSVG(gcode, file.name)))
    .subscribe((svg) => {
      gcodeViewer.innerHTML = svg
    })

  return gcodeAndFile$
}
