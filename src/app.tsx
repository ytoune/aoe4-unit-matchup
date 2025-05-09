import { useMemo, useState } from 'preact/hooks'
import { useCivs, civsMap, civIds, useAges } from './civs'
import type { UnitData } from './data'
import { createLines, unitNames } from './create-lines'
import { coef, trade } from './matchup'
import chroma from 'chroma-js'

type Mode = '1v1' | 'summary'
const modes = ['summary', '1v1'] as const satisfies Mode[]

type Age = '1' | '2' | '3' | '4'
const ages = ['1', '2', '3', '4'] as const satisfies Age[]

type CivId = (typeof civIds)[number]
const displayCivName = (v: (typeof civIds)[number]) => civsMap[v]?.name

type Locale = 'en' | 'ja'
const locales = ['en', 'ja'] as const satisfies Locale[]

export const App = ({ data }: { readonly data: readonly UnitData[] }) => {
  const [locale, setLocale] = useState<Locale>(
    (navigator.languages as Locale[]).find(l => locales.includes(l)) ?? 'ja',
  )
  const [civ1, setCiv1] = useCivs()
  const [civ2, setCiv2] = useCivs()
  const [age, setAge] = useAges()
  const [mode, setMode] = useState<Mode>('summary')
  const unitIds1 = useMemo(
    () =>
      data
        .filter(
          d =>
            d.variations.some(v => `${v.age}` === age) &&
            d.civs.some(c => c === civ1),
        )
        .map(d => d.id),
    [data, civ1],
  )
  const unitIds2 = useMemo(
    () =>
      data
        .filter(
          d =>
            d.variations.some(v => `${v.age}` === age) &&
            d.civs.some(c => c === civ2),
        )
        .map(d => d.id),
    [data, civ2],
  )
  const unitMap = useMemo(
    () => Object.fromEntries(data.map(d => [d.id, d])),
    [data],
  )
  const displayUnitName = useMemo(() => {
    const map = Object.fromEntries(
      data.map(d => {
        const v =
          d.variations.find(
            v => v.name === d.name && v.locale?.[locale]?.name,
          ) || d.variations.find(v => v.locale?.[locale]?.name)
        return [d.id, v?.locale?.ja?.name || d.name]
      }),
    )
    return (id: string) => map[id] ?? '?'
  }, [data, locale])
  const [u1id0, setU1id] = useState<string>('archer')
  const [u2id0, setU2id] = useState<string>('archer')
  const u1id = (unitIds1.includes(u1id0) ? u1id0 : unitIds1[0]) || 'archer'
  const u2id = (unitIds2.includes(u2id0) ? u2id0 : unitIds2[0]) || 'archer'
  const unitsForTable = useMemo(
    () =>
      unitNames
        .map(name => data.find(d => d.name === name))
        .filter(<T,>(d: T | undefined): d is T => !!d),
    [data, unitNames],
  )
  return (
    <div>
      <dl class="tools">
        <SelectorToolForSet<Locale>
          title="language"
          value={locale}
          values={locales}
          set={c => setLocale(c)}
        />
        <SelectorToolForSet<CivId>
          title="civ1"
          value={civ1}
          values={civIds}
          set={c => setCiv1({ key: c })}
          name={displayCivName}
        />
        <SelectorToolForSet<CivId>
          title="civ2"
          value={civ2}
          values={civIds}
          set={c => setCiv2({ key: c })}
          name={displayCivName}
        />
        <SelectorToolForSet<Age>
          title="age"
          value={age}
          values={ages}
          set={c => setAge({ key: c })}
        />
        <SelectorToolForSet<Mode>
          title="mode"
          value={mode}
          values={modes}
          set={c => setMode(c)}
        />
        {mode !== '1v1' ? null : (
          <>
            <SelectorToolForSet<string>
              title="unit1"
              value={u1id}
              values={unitIds1}
              set={c => setU1id(c)}
              name={displayUnitName}
            />
            <SelectorToolForSet<string>
              title="unit2"
              value={u2id}
              values={unitIds2}
              set={c => setU2id(c)}
              name={displayUnitName}
            />
          </>
        )}
      </dl>
      {mode === '1v1' ? (
        <Graph
          civ1={civ1}
          civ2={civ2}
          age={age}
          u1={unitMap[u1id]}
          u2={unitMap[u2id]}
        />
      ) : (
        <Table
          data={unitsForTable}
          civ1={civ1}
          civ2={civ2}
          age={age}
          displayUnitName={displayUnitName}
        />
      )}
    </div>
  )
}

const SelectorToolForSet = <T extends string>({
  title,
  value,
  values,
  set,
  name,
}: {
  title: string
  value: T
  values: readonly T[]
  set: (v: T) => void
  name?: (v: T) => string | undefined
}) => {
  return (
    <label>
      <dt>{title}</dt>
      <dd>
        <select
          value={value}
          onChange={e =>
            set((e as unknown as { target: { value: T } }).target.value)
          }
        >
          {values.map(v => (
            <option key={v} value={v}>
              {name?.(v) ?? v}
            </option>
          ))}
        </select>
      </dd>
    </label>
  )
}

const Graph = ({
  civ1,
  civ2,
  age,
  u1: ud1,
  u2: ud2,
}: {
  civ1: CivId
  civ2: CivId
  age: Age
  u1?: UnitData
  u2?: UnitData
}) => {
  if (!ud1 || !ud2) return null
  // @todo use echarts
  const u1 = Array.from(createLines(ud1)).find(
    u => `${u.age}` === age && u.civs.includes(civ1),
  )
  const u2 = Array.from(createLines(ud2)).find(
    u => `${u.age}` === age && u.civs.includes(civ2),
  )
  if (!u1 || !u2) return null
  const [u1healthList, u2healthList, timestamps] = trade(u1, u2)
  const length = Math.min(
    u1healthList.length,
    u2healthList.length,
    timestamps.length,
  )
  return (
    <table>
      <thead>
        <tr>
          <th>timestamp</th>
          <th>unit1hp</th>
          <th>unit2hp</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length }, (_, i) => {
          const u1health = u1healthList[i]!
          const u2health = u2healthList[i]!
          const ts = timestamps[i]!.toFixed(3)
          return (
            <tr key={`${i}`}>
              <td>{ts}</td>
              <td>{u1health}</td>
              <td>{u2health}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const Table = ({
  data,
  civ1,
  civ2,
  age,
  displayUnitName,
}: {
  data: readonly UnitData[]
  civ1: CivId
  civ2: CivId
  age: Age
  displayUnitName: (id: string) => string
}) => {
  const makeList = (data: readonly UnitData[], civ: CivId, age: Age) =>
    data
      .map(ud =>
        Array.from(createLines(ud)).find(
          u => `${u.age}` === age && u.civs.includes(civ),
        ),
      )
      .filter(<T,>(d: T | undefined): d is T => !!d)
  const list1 = makeList(data, civ1, age)
  const list2 = makeList(data, civ2, age)
  // @todo add background color
  // chroma.brewer.RdYlGn
  const scale = useMemo(() => chroma.scale('RdYlGn'), [])
  let min = 1 / 0
  let max = -1 / 0
  const values = list1.map(u1 => ({
    u1,
    cols: list2.map(u2 => {
      const v = coef(u1, u2)
      if (min > v) min = v
      if (max < v) max = v
      return { u2, v }
    }),
  }))
  const color = (v: number) => {
    if (min <= v && v <= max) {
      const s =
        v < 1 ? (v - min) / (1 - min) / 2 : 0.5 + (v - 1) / (max - 1) / 2
      const r = scale(1 - s)
      const l = r.oklch()[0]
      return {
        backgroundColor: r.css(),
        color: l < 0.7 ? 'white' : 'black',
      }
    }
  }
  return (
    <table>
      <tbody>
        <tr>
          <th>civ1\civ2</th>
          {list2.map(u => (
            <th key={`head:${u.id}`}>{displayUnitName(u.id)}</th>
          ))}
        </tr>
        {values.map(({ u1, cols }) => {
          return (
            <tr key={`${u1.id}/head`}>
              <th>{displayUnitName(u1.id)}</th>
              {cols.map(({ u2, v }) => {
                //  {col: {row: coef(civ_1[row], civ_2[col]) for row in civ_1} for col in civ_2}
                const c = color(v)
                return (
                  <td key={`${u1.id}/${u2.id}`} style={c}>
                    {coef(u1, u2).toFixed(6)}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
