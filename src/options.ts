import { useReducer } from 'preact/hooks'

export const make = <T extends string>(init: readonly [T, readonly T[]]) => {
  type State = readonly [T, readonly T[]]
  type Mut = Readonly<{ key: T }>

  const reduce = (st: State, mut: Mut): State => {
    return [mut.key, st[1]]
  }

  return () => {
    const [[val, arr], set] = useReducer(reduce, init)
    // const arr = val.filter(p => p[1]).map(p => p[0])
    return [val, set, arr] as const
  }
}
