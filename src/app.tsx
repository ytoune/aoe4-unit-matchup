import { useEffect, useMemo, useReducer, useRef, useState } from 'preact/hooks'
import type { JSX } from 'preact/jsx-runtime'
import { civsMap, civIds } from './civs'
import type { UnitData } from './data'
import { createLines } from './create-lines'
import { coef, trade } from './matchup'
import chroma from 'chroma-js'

type Mode = '1v1' | 'summary'
const modes = ['summary', '1v1'] as const satisfies Mode[]

type Age = '1' | '2' | '3' | '4'
const ages = ['1', '2', '3', '4'] as const satisfies Age[]

type CivId = (typeof civIds)[number]
const displayCivName = (v: CivId) => civsMap[v]?.name

type Locale = 'en' | 'ja' | 'zh-hant'
const locales = ['en', 'ja', 'zh-hant'] as const satisfies Locale[]

const parseHash = () => {
  const m = location.hash.match(/#\[([^\]]+)\]/)
  const r: Partial<HashState> = {}
  if (!location.hash) r.m = 'summary'
  if (m) {
    for (const t of m[1]!.split(',')) {
      const m = t.match(/^(c1|c2|m|a|a1|a2|u1|u2)=(.*)$/)
      if (m) {
        const k = m[1] as 'c1' | 'c2' | 'm' | 'a' | 'a1' | 'a2' | 'u1' | 'u2'
        const v = m[2] as string
        switch (k) {
          case 'c1':
          case 'c2':
            if ((civIds.includes as (v: string) => v is CivId)(v)) r[k] ??= v
            break
          case 'm':
            if ((modes.includes as (v: string) => v is Mode)(v)) r[k] ??= v
            break
          case 'a':
            if ((ages.includes as (v: string) => v is Age)(v))
              (r.a1 ??= v), (r.a2 ??= v)
            break
          case 'a1':
          case 'a2':
            if ((ages.includes as (v: string) => v is Age)(v)) r[k] ??= v
            break
          case 'u1':
          case 'u2':
            r[k] ??= v
            break
          default:
            k satisfies never
        }
      }
    }
  }
  return r
}
type HashState = {
  c1: CivId
  a1: Age
  c2: CivId
  a2: Age
  m: Mode
  u1?: string
  u2?: string
}
const makeHash = (r: HashState) =>
  `#[${[
    r.c1 && `c1=${r.c1}`,
    r.a1 && r.a1 !== r.a2 && `a1=${r.a1}`,
    r.c2 && `c2=${r.c2}`,
    r.a2 && (r.a1 !== r.a2 ? `a2=${r.a2}` : `a=${r.a2}`),
    r.m && `m=${r.m}`,
    !!r.u1 && r.m === '1v1' && `u1=${r.u1}`,
    !!r.u2 && r.m === '1v1' && `u2=${r.u2}`,
  ]
    .filter(Boolean)
    .join(',')}]`
const useHash = () => {
  const ref = useRef<null | HashState>(null)
  ref.current ??= {
    c1: 'hr',
    c2: 'hr',
    m: 'summary',
    a1: '2',
    a2: '2',
    u1: 'archer',
    u2: 'archer',
    ...parseHash(),
  }
  const [, pin] = useReducer<boolean, void>(v => !v, false)
  useEffect(() => {
    const h = () => {
      ref.current = { ...ref.current!, ...parseHash() }
      pin()
    }
    window.addEventListener('hashchange', h)
    return () => {
      window.removeEventListener('hashchange', h)
    }
  }, [ref, pin])
  const a = useMemo(() => {
    const push = (_v: unknown) => {
      location.hash = makeHash(ref.current!)
    }
    return {
      civ1: (c: CivId) => push((ref.current!.c1 = c)),
      civ2: (c: CivId) => push((ref.current!.c2 = c)),
      age1: (a: Age) => push((ref.current!.a1 = a)),
      age2: (a: Age) => push((ref.current!.a2 = a)),
      mode: (m: Mode, u1: string, u2: string) =>
        push(
          ((ref.current!.m = m),
          (ref.current!.u1 = u1),
          (ref.current!.u2 = u2)),
        ),
      unit1: (u: string) => push((ref.current!.u1 = u)),
      unit2: (u: string) => push((ref.current!.u2 = u)),
    } as const
  }, [ref, pin])
  return [ref.current!, a] as const
}

export const App = ({ data }: { readonly data: readonly UnitData[] }) => {
  const [locale, setLocale] = useState<Locale>(
    (navigator.languages as Locale[]).find(l => locales.includes(l)) ?? 'ja',
  )
  const [
    {
      c1: civ1,
      c2: civ2,
      a1: age1,
      a2: age2,
      m: mode,
      u1: u1id0 = '',
      u2: u2id0 = '',
    },
    actions,
  ] = useHash()
  const unitIds1 = useMemo(
    () =>
      data
        .filter(d =>
          d.variations.some(
            v => v.age <= Number(age1) && v.civs.includes(civ1),
          ),
        )
        .map(d => d.id),
    [data, civ1, age1],
  )
  const unitIds2 = useMemo(
    () =>
      data
        .filter(d =>
          d.variations.some(
            v => v.age <= Number(age2) && v.civs.includes(civ2),
          ),
        )
        .map(d => d.id),
    [data, civ2, age2],
  )
  const unitMap = useMemo(
    () => Object.fromEntries(data.map(d => [d.id, d])),
    [data],
  )
  const [displayUnitName, renderUnitName] = useMemo(() => {
    const map = Object.fromEntries(
      data.map(d => {
        const v =
          d.variations.find(
            v => v.name === d.name && v.locale?.[locale]?.name,
          ) || d.variations.find(v => v.locale?.[locale]?.name)
        return [d.id, v?.locale?.[locale]?.name || d.name]
      }),
    )
    return [
      (id: string) => map[id] ?? '?',
      (id: string, civ: CivId) => (
        <UnitName id={id} civ={civ} lang={locale}>
          {map[id] ?? '?'}
        </UnitName>
      ),
    ] as const
  }, [data, locale])
  const unitsForTable = useMemo(
    () =>
      data.filter(
        d =>
          d.id !== 'scout' &&
          !d.classes.includes('hero') &&
          d.classes.some(c =>
            ['melee', 'ranged', 'battle', 'religious'].includes(c),
          ) &&
          d.variations.some(
            v =>
              v.costs.total &&
              v.weapons.some(w => ['melee', 'ranged'].includes(w.type)),
          ),
      ),
    [data],
  )
  const u1id =
    (unitIds1.includes(u1id0)
      ? u1id0
      : unitsForTable.find(u => unitIds1.includes(u.id))?.id) || 'archer'
  const u2id =
    (unitIds2.includes(u2id0)
      ? u2id0
      : unitsForTable.find(u => unitIds2.includes(u.id))?.id) || 'archer'
  return (
    <div>
      <dl class="tools">
        <SelectorToolForSet<Locale>
          title="language"
          value={locale}
          values={locales}
          set={c => setLocale(c)}
        />
        <div>
          <SelectorToolForSet<CivId>
            title="civ1"
            value={civ1}
            values={civIds}
            set={actions.civ1}
            name={displayCivName}
          />
          <SelectorToolForSet<Age>
            title="age"
            value={age1}
            values={ages}
            set={actions.age1}
          />
        </div>
        <div>
          <SelectorToolForSet<CivId>
            title="civ2"
            value={civ2}
            values={civIds}
            set={actions.civ2}
            name={displayCivName}
          />
          <SelectorToolForSet<Age>
            title="age"
            value={age2}
            values={ages}
            set={actions.age2}
          />
        </div>
        <SelectorToolForSet<Mode>
          title="mode"
          value={mode}
          values={modes}
          set={m => actions.mode(m, u1id, u2id)}
        />
        {mode !== '1v1' ? null : (
          <>
            <SelectorToolForSet<string>
              title="unit1"
              value={u1id}
              values={unitIds1}
              set={actions.unit1}
              name={displayUnitName}
              lang={locale}
            />
            <SelectorToolForSet<string>
              title="unit2"
              value={u2id}
              values={unitIds2}
              set={actions.unit2}
              name={displayUnitName}
              lang={locale}
            />
          </>
        )}
      </dl>
      {mode === '1v1' ? (
        <Graph
          civ1={civ1}
          civ2={civ2}
          age1={age1}
          age2={age2}
          u1={unitMap[u1id]}
          u2={unitMap[u2id]}
          renderUnitName={renderUnitName}
        />
      ) : (
        <Table
          data={unitsForTable}
          civ1={civ1}
          civ2={civ2}
          age1={age1}
          age2={age2}
          renderUnitName={renderUnitName}
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
  lang,
}: {
  title: string
  value: T
  values: readonly T[]
  set: (v: T) => void
  name?: (v: T) => string | undefined
  lang?: string
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
          lang={lang}
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

const findUnit = (civ: CivId, age: Age, ud?: UnitData) => {
  if (!ud) return
  return Array.from(createLines(ud))
    .filter(u => u.age <= Number(age) && u.civs.includes(civ))
    .sort((q, w) => w.age - q.age)[0]
}

const Graph = ({
  civ1,
  civ2,
  age1,
  age2,
  u1: ud1,
  u2: ud2,
  renderUnitName,
}: {
  civ1: CivId
  civ2: CivId
  age1: Age
  age2: Age
  u1?: UnitData
  u2?: UnitData
  renderUnitName: (id: string, civ: CivId) => JSX.Element
}) => {
  if (!ud1 || !ud2) return null
  // @todo use echarts or d3
  const u1 = findUnit(civ1, age1, ud1)
  const u2 = findUnit(civ2, age2, ud2)
  if (!u1 || !u2) return null
  const [u1healthList, u2healthList, timestamps] = trade(u1, u2)
  const hpdiff1 =
    (u1healthList[0]! - u1healthList[u1healthList.length - 1]!) /
    u1healthList[0]!
  const c1 = u1.cost * hpdiff1
  const hpdiff2 =
    (u2healthList[0]! - u2healthList[u2healthList.length - 1]!) /
    u2healthList[0]!
  const c2 = u2.cost * hpdiff2
  const costRatio = c1 / c2
  const length = Math.min(
    u1healthList.length,
    u2healthList.length,
    timestamps.length,
  )
  return (
    <>
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
      <p>
        cost for {renderUnitName(u1.id, civ1)} : {c1.toFixed(6)}
      </p>
      <p>
        cost for {renderUnitName(u2.id, civ2)} : {c2.toFixed(6)}
      </p>
      <p>cost ratio : {costRatio.toFixed(6)}</p>
    </>
  )
}

const UnitName = (item: {
  id: string
  civ: CivId
  children: string
  lang?: string
}) => {
  const c = civsMap[item.civ]?.href ?? 'https://aoe4world.com/explorer'
  return (
    <a
      href={`${c}/units/${item.id}`}
      rel="nofollow noopener noreferrer"
      target="_blank"
      lang={item.lang}
    >
      {item.children}
    </a>
  )
}

const Table = ({
  data,
  civ1,
  civ2,
  age1,
  age2,
  renderUnitName,
}: {
  data: readonly UnitData[]
  civ1: CivId
  civ2: CivId
  age1: Age
  age2: Age
  renderUnitName: (id: string, civ: CivId) => JSX.Element
}) => {
  const makeList = (data: readonly UnitData[], civ: CivId, age: Age) =>
    data
      .map(ud => findUnit(civ, age, ud))
      .filter(<T,>(d: T | undefined): d is T => !!d)
  const list1 = makeList(data, civ1, age1)
  const list2 = makeList(data, civ2, age2)
  // chroma.brewer.RdYlGn
  const scale = useMemo(() => chroma.scale('RdYlGn'), [])
  let min = 1 / 0
  let max = -1 / 0
  const values = list1.map(u1 => ({
    u1,
    cols: list2.map(u2 => {
      const v = coef(u1, u2)
      if (min > v) min = v
      if (max < v && v !== 1 / 0) max = v
      return { u2, v }
    }),
  }))
  const color = (v: number) => {
    const mk = () => {
      if (v === 0) return 0
      if (v === 1 / 0) return 1
      if (min <= v && v < 1) return (v - min) / (1 - min) / 2
      if (1 <= v && v <= max) return 0.5 + Math.log(v) / Math.log(max) / 2
      return
      // if (min <= v && v <= max)
      //   return v < 1 ? (v - min) / (1 - min) / 2 : 0.5 + (v - 1) / (max - 1) / 2
    }
    const s = mk()
    if (void 0 !== s) {
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
          <th>
            <a
              href={makeHash({
                c1: civ2,
                c2: civ1,
                a1: age1,
                a2: age2,
                m: 'summary',
              })}
            >
              civ1\civ2
            </a>
          </th>
          {list2.map(u => (
            <th key={`head:${u.id}`}>{renderUnitName(u.id, civ2)}</th>
          ))}
        </tr>
        {values.map(({ u1, cols }) => {
          return (
            <tr key={`${u1.id}/head`}>
              <th>{renderUnitName(u1.id, civ1)}</th>
              {cols.map(({ u2, v }) => {
                //  {col: {row: coef(civ_1[row], civ_2[col]) for row in civ_1} for col in civ_2}
                const c = color(v)
                return (
                  <td key={`${u1.id}/${u2.id}`} style={c}>
                    <a
                      href={makeHash({
                        c1: civ1,
                        c2: civ2,
                        a1: age1,
                        a2: age2,
                        m: '1v1',
                        u1: u1.id,
                        u2: u2.id,
                      })}
                    >
                      {v.toFixed(6)}
                    </a>
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
