import { render } from 'preact'
import { App } from './app'
import { getData } from './data'

const main = async () => {
  const exports: Record<string, unknown> = globalThis
  const list = await getData()
  console.log(list)
  exports.list = list
  const root = document.querySelector('main')
  if (root) render(<App data={list} />, root)
}

Promise.resolve()
  .then(main)
  .catch(x => console.error(x))
