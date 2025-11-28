export const list = [
  {
    id: 'ab',
    name: 'Abbasid Dynasty',
    href: 'https://aoe4world.com/explorer/civs/abbasid',
  },
  {
    id: 'ay',
    name: 'Ayyubids',
    href: 'https://aoe4world.com/explorer/civs/ayyubids',
  },
  {
    id: 'by',
    name: 'Byzantines',
    href: 'https://aoe4world.com/explorer/civs/byzantines',
  },
  {
    id: 'ch',
    name: 'Chinese',
    href: 'https://aoe4world.com/explorer/civs/chinese',
  },
  {
    id: 'de',
    name: 'Delhi Sultanate',
    href: 'https://aoe4world.com/explorer/civs/delhi',
  },
  {
    id: 'en',
    name: 'English',
    href: 'https://aoe4world.com/explorer/civs/english',
  },
  {
    id: 'fr',
    name: 'French',
    href: 'https://aoe4world.com/explorer/civs/french',
  },
  {
    id: 'gol',
    name: 'Golden Horde',
    href: 'https://aoe4world.com/explorer/civs/goldenhorde',
  },
  {
    id: 'hr',
    name: 'Holy Roman Empire',
    href: 'https://aoe4world.com/explorer/civs/hre',
  },
  {
    id: 'hl',
    name: 'House of Lancaster',
    href: 'https://aoe4world.com/explorer/civs/lancaster',
  },
  {
    id: 'ja',
    name: 'Japanese',
    href: 'https://aoe4world.com/explorer/civs/japanese',
  },
  {
    id: 'je',
    name: "Jeanne d'Arc",
    href: 'https://aoe4world.com/explorer/civs/jeannedarc',
  },
  {
    id: 'kt',
    name: 'Knights Templar',
    href: 'https://aoe4world.com/explorer/civs/templar',
  },
  {
    id: 'mac',
    name: 'Macedonian Dynasty',
    href: 'https://aoe4world.com/explorer/civs/macedonian',
  },
  {
    id: 'ma',
    name: 'Malians',
    href: 'https://aoe4world.com/explorer/civs/malians',
  },
  {
    id: 'mo',
    name: 'Mongols',
    href: 'https://aoe4world.com/explorer/civs/mongols',
  },
  {
    id: 'od',
    name: 'Order of the Dragon',
    href: 'https://aoe4world.com/explorer/civs/orderofthedragon',
  },
  {
    id: 'ot',
    name: 'Ottomans',
    href: 'https://aoe4world.com/explorer/civs/ottomans',
  },
  {
    id: 'ru',
    name: 'Rus',
    href: 'https://aoe4world.com/explorer/civs/rus',
  },
  {
    id: 'sen',
    name: 'Sengoku Daimyo',
    href: 'https://aoe4world.com/explorer/civs/sengoku',
  },
  {
    id: 'tug',
    name: 'Tughlaq Dynasty',
    href: 'https://aoe4world.com/explorer/civs/tughlaq',
  },
  {
    id: 'zx',
    name: "Zhu Xi's Legacy",
    href: 'https://aoe4world.com/explorer/civs/zhuxi',
  },
] as const satisfies {
  id: string
  name: string
  href: `https://aoe4world.com/explorer/civs/${string}`
}[]

// const init = list.map(i => [i.id, true as boolean] as const)

export const civIds = list.map(i => i.id)
export const civsMap = Object.fromEntries(list.map(c => [c.id, c]))
