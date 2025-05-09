import type * as ty from 'aoe4data/src/types/items'

export type UnitData = ty.UnifiedItem<UnitVariation>

export type UnitVariation = ty.Unit & {
  locale: {
    [k in string]?: {
      name: string
      description: string
      displayClasses: string[]
    }
  }
}

// type Out = (typeof import('./all-unified.json'))['data'][number] //['type']

export const getData = async (): Promise<readonly UnitData[]> =>
  await import('./all-unified.json')
    .then(d => d.default.data as UnitData[])
    .then(list =>
      list
        .filter(
          u =>
            !(
              u.id === 'cavalry-archer' &&
              u.civs.join('') === 'ot' &&
              u.variations.every(v => !v.locale)
            ),
        )
        .map((u, _, data) => {
          const id = u.id
          const costNum = u.variations.map(v => v.costs.total)

          type PartialCost = Partial<{
            food: number
            wood: number
            gold: number
            stone: number
            oliveoil: number
            time?: number
            popcap?: number
          }>
          const makeCost = (c: PartialCost, div: number) => {
            const food = (c.food ?? 0) / div
            const wood = (c.wood ?? 0) / div
            const gold = (c.gold ?? 0) / div
            const stone = (c.stone ?? 0) / div
            const oliveoil = (c.oliveoil ?? 0) / div
            const time = c.time ?? 0
            const popcap = (c.popcap ?? 1) / div
            const total = food + wood + gold + stone + oliveoil
            return {
              food,
              wood,
              gold,
              stone,
              oliveoil,
              time,
              popcap,
              total,
            } as const
          }
          const replaceCost = (c: PartialCost, div: number = 1) => {
            const costs = makeCost(c, div)
            for (const v of u.variations) v.costs = costs
          }
          if ('shinobi' === id && costNum.join(':') === '0')
            replaceCost({ food: 50, gold: 50 })
          if ('wynguard-footman' === id) {
            const item = data
              .find(d => 'wynguard-footmen' === d.id)
              ?.variations.find(d => d.costs)
            if (item?.costs) replaceCost(item.costs, item.costs.popcap)
          }
          if ('wynguard-ranger' === id) {
            const item = data
              .find(d => 'wynguard-rangers' === d.id)
              ?.variations.find(d => d.costs)
            if (item?.costs) replaceCost(item.costs, item.costs.popcap)
          }
          if ('bedouin-swordsman' === id) replaceCost({ gold: 425 / 8 })
          if ('bedouin-skirmisher' === id) replaceCost({ gold: 425 / 8 })
          if ('militia' === id) replaceCost({ food: 55 }, 2)
          return u
        }),
    )
