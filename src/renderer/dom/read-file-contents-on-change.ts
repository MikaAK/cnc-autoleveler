import {fromEvent} from 'rxjs'
import {filter, switchMap, map} from 'rxjs/operators'

interface IFile extends File {
  text(): Promise<string>
}

export const readFileContentsOnChange = (fileElement: HTMLElement) =>
  fromEvent<Event>(fileElement, 'change')
    .pipe(
      map((event) => event.target?.files as FileList),
      filter<FileList>((fileList) => Boolean(fileList && fileList.length)),
      switchMap((fileList) => {
        const file = (fileList[0] as IFile)

        return file.text().then((text) => ({text, file}))
      })
    )
