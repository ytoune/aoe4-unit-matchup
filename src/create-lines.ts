// Script to read the all-unified.json file, and export unit stats for one civ/age as a csv file, accounting for upgrades.
// TODO : add civilisation-specific upgrades
// TODO : add documentation
// TODO : add output directory
// TODO : add more stats such as movespeed/range/specific ressource cost

import { UnitData } from './data'

// I've selected only "mass-able" units, feel free to add more.
export const unitNames = [
  'Archer',
  'Camel Archer',
  'Camel Rider',
  'Crossbowman',
  'Ghulam',
  'Handcannoneer',
  'Horseman',
  'Lancer',
  'Scout',
  'Spearman',
  'Camel Lancer',
  'Arbalétrier',
  'Cataphract',
  'Grenadier',
  'Horse Archer',
  'Javelin Thrower',
  'Keshik',
  'Limitanei',
  'Landsknecht',
  'Longbowman',
  'Mangudai',
  'Musofadi Warrior',
  'Sipahi',
  'Streltsy',
  'Tower Elephant',
  'Varangian Guard',
  'War Elephant',
  'Zhuge Nu',
  'Palace Guard',
  'Ghazi Raider',
  'Man-at-Arms',
  'Knight',
  'Mounted Samurai',
  'Onna-Bugeisha',
  'Ozutsu',
  'Samurai',
  'Shinobi',
  'Donso',
  'Freeborn Warrior',
  'Mansa Javelineer',
  'Mansa Musofadi Warrior',
  'Musofadi Gunner',
  'Sofa',
  'Warrior Scout',
  'Gilded Archer',
  'Gilded Crossbowman',
  'Gilded Handcannoneer',
  'Gilded Horseman',
  'Gilded Knight',
  'Gilded Landsknecht',
  'Gilded Man-at-Arms',
  'Gilded Spearman',
  'Janissary',
  'Imperial Guard',
  'Chevalier Confrere',
  'Condottiero',
  'Genitour',
  'Genoese Crossbowman',
  'Heavy Spearman',
  'Hospitaller Knight',
  'Serjeant',
  'Szlachta Cavalry',
  'Templar Brother',
  'Teutonic Knight',
  'Veteran Demilancer',
  'Hobelar',
  'Yeoman',
]

export type Line = Readonly<{
  id: string
  locale: {
    [k in 'ja']?: Readonly<{
      name: string
      displayClasses: string[]
    }>
  }
  name: string
  civs: string[]
  age: number
  hp: number
  meleeDamage: number
  rangeDamage: number
  weaponRange: number
  speed: number
  attackSpeed: number
  meleeArmor: number
  rangeArmor: number
  unitType: readonly string[]
  damageBonusType: readonly (readonly string[])[]
  damageBonus: readonly number[]
  cost: number
  meleeAttackUpgrade: number
  rangeAttackUpgrade: number
  meleeDefUpgrade: number
  rangeDefUpgrade: number
  meleeMultBonus: number
  rangeMultBonus: number
  hpMult: number
  trueDamage: number
  numberOfAttacks: number
}>

export const createLines = function* (unit: UnitData): Iterable<Line> {
  //             name = unit.get("name", "")
  const name = unit.name
  //             for unit in unit["variations"]:
  for (const u of unit.variations) {
    //                 if not (
    //                     civ in unit["civs"] and age == unit["age"] and name in unit_names
    //                 ):
    //                     continue
    const civs = u.civs
    const age = u.age
    //                 hp = unit.get("hitpoints", 0)
    const hp = u.hitpoints ?? 0
    //                 speed = unit["movement"]["speed"]
    const speed = u.movement?.speed ?? 0
    //                 # weapon stuff
    //                 weapon = unit["weapons"][0]
    //                 if weapon["type"] == "melee":
    //                     melee_damage = weapon.get("damage", "")
    //                     range_damage = 0
    //                 elif weapon["type"] == "ranged":
    //                     melee_damage = 0
    //                     range_damage = weapon.get("damage", "")
    //                 else:
    //                     print(f"issue with damage for {name}")
    const weapon =
      u.weapons.find(w => w.type === 'melee') ||
      u.weapons.find(w => w.type === 'ranged') ||
      null
    const meleeDamage = weapon?.type === 'melee' ? weapon.damage : 0
    const rangeDamage = weapon?.type === 'ranged' ? weapon.damage : 0
    //                 weapon_range = weapon.get("range", {"max":0})["max"]
    const weaponRange = weapon?.range?.max ?? 0
    //                 attack_speed = weapon.get("speed", "")
    const attackSpeed = weapon?.speed ?? 0
    //                 damage_bonus = []
    //                 damage_bonus_type = []
    //                 for bonus in weapon["modifiers"]:
    //                     damage_bonus.append(bonus.get("value", ""))
    //                     damage_bonus_type.append(bonus["target"].get("class", [""])[0])
    const damageBonus: number[] = []
    const damageBonusType: string[][] = []
    if (weapon?.modifiers)
      for (const bonus of weapon.modifiers) {
        damageBonus.push(bonus.value)
        damageBonusType.push(...(bonus.target?.class || []))
      }
    //                 if "burst" in weapon.keys():
    //                     number_of_attacks = weapon["burst"].get("count", "")
    //                 else:
    //                     number_of_attacks = 1
    const numberOfAttacks = weapon?.burst ? weapon.burst.count : 1
    //                 # armor stuff
    //                 melee_armor = 0
    //                 range_armor = 0
    //                 for armor in unit["armor"]:
    //                     if armor["type"] == "melee":
    //                         melee_armor = armor.get("value", 0)
    //                     elif armor["type"] == "ranged":
    //                         range_armor = armor.get("value", 0)
    const meleeArmor = u.armor.find(a => a.type === 'melee')?.value ?? 0
    const rangeArmor = u.armor.find(a => a.type === 'ranged')?.value ?? 0
    //                 # misc
    //                 cost = unit["costs"].get("total")
    const cost = u.costs.total
    //                 unit_type = unit.get("classes", [])
    const unitType = u.classes ?? []
    //                 # upgrades, tweak according to unit manually
    //                 melee_attack_upgrade = age
    //                 range_attack_upgrade = age
    //                 melee_def_upgrade = age
    //                 range_def_upgrade = age
    const meleeAttackUpgrade = age
    const rangeAttackUpgrade = age
    const meleeDefUpgrade = age
    const rangeDefUpgrade = age
    //                 hp_mult = 1  # default value, do not modify
    //                 range_mult_bonus = 1  # default value, do not modify
    //                 melee_mult_bonus = 1  # default value, do not modify
    let hpMult = 1 // default value, do not modify
    let rangeMultBonus = 1 // default value, do not modify
    let meleeMultBonus = 1 // default value, do not modify
    //                 if age == 4:
    if (age === 4) {
      //                     if "cavalry" in unit_type:
      //                         hp_mult = 1.25
      if (unitType.includes('cavalry')) {
        hpMult = 1.25
      }
      //                     if "ranged" in unit_type and "gunpowder" not in unit_type:
      //                         range_mult_bonus = 1.2
      if (unitType.includes('ranged') && !unitType.includes('gunpowder')) {
        rangeMultBonus = 1.2
      }
      //                     if (
      //                         "ranged" in unit_type
      //                         and "gunpowder" in unit_type
      //                         and name != "Janissary"
      //                     ):
      //                         damage_bonus.append(5)
      //                         damage_bonus_type.append(["melee", "infantry"])
      if (
        unitType.includes('ranged') &&
        unitType.includes('gunpowder') &&
        name !== 'Janissary'
      ) {
        damageBonus.push(5)
        damageBonusType.push(['melee', 'infantry'])
      }
      //                     if "infantry" in unit_type and "melee" in unit_type:
      //                         hp_mult = 1.15
      //                         melee_mult_bonus = 1.15
      if (unitType.includes('infantry') && unitType.includes('melee')) {
        hpMult = 1.15
        meleeMultBonus = 1.15
      }
    }
    //                 true_damage = 0
    const trueDamage = 0
    yield {
      id: u.baseId,
      locale: u.locale,
      name,
      civs,
      age,
      hp,
      meleeDamage,
      rangeDamage,
      weaponRange,
      speed,
      attackSpeed,
      meleeArmor,
      rangeArmor,
      unitType,
      damageBonusType,
      damageBonus,
      cost,
      meleeAttackUpgrade,
      rangeAttackUpgrade,
      meleeDefUpgrade,
      rangeDefUpgrade,
      meleeMultBonus,
      rangeMultBonus,
      hpMult,
      trueDamage,
      numberOfAttacks,
    }
  }
}
