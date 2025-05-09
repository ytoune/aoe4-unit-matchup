// # Python file that structure units specifications, simulate battle between two units, and generate matchup summary files
// # TODO : add documentation .-.
// # TODO : account for movement speed/range
// import csv
// import ast
// from matplotlib.colors import TwoSlopeNorm
// import matplotlib.pylab as mpl
// import pandas as pd

import { Line } from './create-lines'

// class Unit:
type Unit = Readonly<{
  // basic
  id: string
  hp: number
  name: string
  // damage
  meleeDamage: number
  rangeDamage: number
  weaponRange: number
  speed: number
  attackSpeed: number
  meleeAttackUpgrade: number
  rangeAttackUpgrade: number
  damageBonusType: readonly (readonly string[])[]
  damageBonus: readonly number[]
  trueDamage: number
  numberOfAttacks: number
  // we consider the following bonus as applying to both base and bonus damage (ex : university upgrade)
  meleeMultBonus: number
  rangeMultBonus: number
  // armor
  meleeArmor: number
  rangeArmor: number
  meleeDefUpgrade: number
  rangeDefUpgrade: number
  // misc
  unitType: readonly string[]
  cost: number
}>
//     def __init__(
//         self,
//         hp: float,
//         name: str = "",
//         melee_damage: float = 0,
//         range_damage: float = 0,
//         weapon_range: float = 0,
//         speed: float = 0,
//         attack_speed: float = 1.375,
//         melee_armor: float = 0,
//         range_armor: float = 0,
//         unit_type: list = None,
//         damage_bonus_type: list = None,
//         damage_bonus: list = None,
//         cost: float = 0,
//         melee_attack_upgrade: float = 0,
//         range_attack_upgrade: float = 0,
//         melee_def_upgrade: float = 0,
//         range_def_upgrade: float = 0,
//         melee_mult_bonus: float = 1,
//         range_mult_bonus: float = 1,
//         hp_mult: float = 1,
//         true_damage: float = 0,
//         number_of_attacks: int = 1,
//     ):
type float = number
type int = number
const createUnit = ({
  hp,
  id = '',
  name = '',
  meleeDamage = 0,
  rangeDamage = 0,
  weaponRange = 0,
  speed = 0,
  attackSpeed = 1.375,
  meleeArmor = 0,
  rangeArmor = 0,
  unitType = null,
  damageBonusType = null,
  damageBonus = null,
  cost = 0,
  meleeAttackUpgrade = 0,
  rangeAttackUpgrade = 0,
  meleeDefUpgrade = 0,
  rangeDefUpgrade = 0,
  meleeMultBonus = 1,
  rangeMultBonus = 1,
  hpMult = 1,
  trueDamage = 0,
  numberOfAttacks = 1,
}: Readonly<{
  hp: number
  id?: string
  name?: string
  meleeDamage?: float
  rangeDamage?: float
  weaponRange?: float
  speed?: float
  attackSpeed?: float
  meleeArmor?: float
  rangeArmor?: float
  unitType?: readonly string[] | null
  damageBonusType?: readonly (readonly string[])[] | null
  damageBonus?: readonly number[] | null
  cost?: float
  meleeAttackUpgrade?: float
  rangeAttackUpgrade?: float
  meleeDefUpgrade?: float
  rangeDefUpgrade?: float
  meleeMultBonus?: float
  rangeMultBonus?: float
  hpMult?: float
  trueDamage?: float
  numberOfAttacks?: int
}>): Unit => {
  //         if unit_type is None:
  //             unit_type = []
  if (unitType === null) unitType = []
  //         if damage_bonus_type is None:
  //             damage_bonus_type = []
  if (damageBonusType === null) damageBonusType = []
  //         if damage_bonus is None:
  //             damage_bonus = []
  if (damageBonus === null) damageBonus = []
  //         # basic
  //         self.hp = hp * hp_mult
  //         self.name = name
  //         # damage
  //         self.melee_damage = melee_damage
  //         self.range_damage = range_damage
  //         self.weapon_range = weapon_range
  //         self.speed = speed
  //         self.attack_speed = attack_speed
  //         self.melee_attack_upgrade = melee_attack_upgrade
  //         self.range_attack_upgrade = range_attack_upgrade
  //         self.damage_bonus_type = damage_bonus_type
  //         self.damage_bonus = damage_bonus
  //         self.true_damage = true_damage
  //         self.number_of_attacks = number_of_attacks
  //         # we consider the following bonus as applying to both base and bonus damage (ex : university upgrade)
  //         self.melee_mult_bonus = melee_mult_bonus
  //         self.range_mult_bonus = range_mult_bonus
  //         # armor
  //         self.melee_armor = melee_armor
  //         self.range_armor = range_armor
  //         self.melee_def_upgrade = melee_def_upgrade
  //         self.range_def_upgrade = range_def_upgrade
  //         # misc
  //         self.unit_type = unit_type
  //         self.cost = cost
  return {
    id,
    hp: hp * hpMult,
    name,
    meleeDamage,
    rangeDamage,
    weaponRange,
    speed,
    attackSpeed,
    meleeAttackUpgrade,
    rangeAttackUpgrade,
    damageBonusType,
    damageBonus,
    trueDamage,
    numberOfAttacks,
    meleeMultBonus,
    rangeMultBonus,
    meleeArmor,
    rangeArmor,
    meleeDefUpgrade,
    rangeDefUpgrade,
    unitType,
    cost,
  }
}

// def load_units(filename: str = "units.csv") -> dict:
export const loadUnits = (lines: readonly Line[]): Record<Unit['id'], Unit> => {
  //     with open(filename, newline="") as csvfile:
  //         units = {}
  const units: Record<Unit['id'], Unit> = {}
  for (const l of lines) {
    units[l.id] = createUnit(l)
  }
  //         reader = csv.DictReader(csvfile)
  //         for row in reader:
  //             parsed_row = {}
  //             for key, value in row.items():
  //                 if value.strip() == "":
  //                     continue
  //                 if key in {"unit_type", "damage_bonus_type", "damage_bonus"}:
  //                     parsed_row[key] = ast.literal_eval(value)
  //                 elif key in {
  //                     "hp",
  //                     "melee_damage",
  //                     "range_damage",
  //                     "weapon_range",
  //                     "speed",
  //                     "attack_speed",
  //                     "melee_armor",
  //                     "range_armor",
  //                     "cost",
  //                     "melee_attack_upgrade",
  //                     "range_attack_upgrade",
  //                     "melee_def_upgrade",
  //                     "range_def_upgrade",
  //                     "melee_mult_bonus",
  //                     "range_mult_bonus",
  //                     "hp_mult",
  //                     "true_damage",
  //                     "number_of_attacks",
  //                 }:
  //                     parsed_row[key] = float(value)
  //                 else:
  //                     parsed_row[key] = value
  //             unit = Unit(**parsed_row)
  //             units[unit.name] = unit
  //     return units
  return units
}

// def check_bonus_damage(unit_1: Unit, unit_2: Unit) -> float:
const checkBonusDamage = (u1: Unit, u2: Unit): float => {
  //     bonus_value = 0
  let bonusValue = 0
  //     for bonus, value in zip(unit_1.damage_bonus_type, unit_1.damage_bonus):
  let length = Math.min(u1.damageBonusType.length, u1.damageBonus.length)
  for (let i = 0; i < length; ++i) {
    const bonus = u1.damageBonusType[i]!
    const value = u1.damageBonus[i]!
    //         if all(bonus_type in unit_2.unit_type for bonus_type in bonus):
    //             bonus_value += value
    if (bonus.every(type => u2.unitType.includes(type))) bonusValue += value
  }
  //     return bonus_value
  return bonusValue
}

// def compute_damage(unit_1: Unit, unit_2: Unit) -> float:
const computeDamage = (u1: Unit, u2: Unit): float => {
  //     flag_melee = unit_1.melee_damage > unit_1.range_damage
  //     bonus_damage = check_bonus_damage(unit_1, unit_2)
  const prop = u1.meleeDamage > u1.rangeDamage ? 'melee' : 'range'
  const bonusDamage = checkBonusDamage(u1, u2)
  //     if flag_melee:
  //         damage = (
  //             unit_1.melee_damage + unit_1.melee_attack_upgrade + bonus_damage
  //         ) * unit_1.melee_mult_bonus
  //         armor = unit_2.melee_armor + unit_2.melee_def_upgrade
  //     else:
  //         damage = (
  //             unit_1.range_damage + unit_1.range_attack_upgrade + bonus_damage
  //         ) * unit_1.range_mult_bonus
  //         armor = unit_2.range_armor + unit_2.range_def_upgrade
  const damage =
    (u1[`${prop}Damage`] + u1[`${prop}AttackUpgrade`] + bonusDamage) *
    u1[`${prop}MultBonus`]
  const armor = u2[`${prop}Armor`] + u2[`${prop}DefUpgrade`]
  //     return (max(damage - armor, 1) + unit_1.true_damage) * unit_1.number_of_attacks
  return (Math.max(damage - armor, 1) + u1.trueDamage) * u1.numberOfAttacks
}

// def trade(unit_1: Unit, unit_2: Unit) -> (list, list, list):
export const trade = (
  u1: Unit,
  u2: Unit,
): readonly [readonly number[], readonly number[], readonly number[]] => {
  let u1healthList: number[]
  let u2healthList: number[]
  let timestamps: number[]
  let u1nextAttackTime: number
  let u2nextAttackTime: number
  //     def _get_last_samuraied(shooter: Unit, target: Unit) -> (list, list, float):
  //         """
  //         simulates a shooting gallery.
  //         The outranging unit will attack the running unit until that latter one would catch up before the next shot.
  //         if the range diff is already 'smaller than' the attack speed it default to computing a time offset of the last striker
  //         (looking at you, Sipahi! always striking first!)
  //         """
  /**
   * simulates a shooting gallery.
   * The outranging unit will attack the running unit until that latter one would catch up before the next shot.
   * if the range diff is already 'smaller than' the attack speed it default to computing a time offset of the last striker
   * (looking at you, Sipahi! always striking first!)
   */
  const _getLastSamuraied = (
    shooter: Unit,
    target: Unit,
  ): readonly [number[], number[], float] => {
    //         timestamps = [0]
    const timestamps = [0]
    //         no_kiting_speed = target.speed
    const noKitingSpeed = target.speed
    //         shoot_time = shooter.attack_speed
    const shootTime = shooter.attackSpeed
    const computedDamage = computeDamage(shooter, target)
    //         target_health_list = [max(target.hp - compute_damage(shooter, target), 0)]
    const targetHealthList = [Math.max(target.hp - computedDamage, 0)]
    //         distance = shooter.weapon_range - target.weapon_range
    let distance = shooter.weaponRange - target.weaponRange
    //         # only one unit strikes the other
    //         while distance > no_kiting_speed*shoot_time:
    while (distance > noKitingSpeed * shootTime) {
      //             target_health_list.append(
      //                 max(target_health_list[-1] - compute_damage(shooter, target), 0)
      //             )
      targetHealthList.push(
        Math.max(
          targetHealthList[targetHealthList.length - 1]! - computedDamage,
          0,
        ),
      )
      //             timestamps.append(timestamps[-1]+shoot_time)
      timestamps.push(timestamps[timestamps.length - 1]! + shootTime)
      //             distance -= no_kiting_speed*shoot_time
      distance -= noKitingSpeed * shootTime
    }
    //         return target_health_list, timestamps, distance/no_kiting_speed
    return [targetHealthList, timestamps, distance / noKitingSpeed]
  }
  //     if unit_1.weapon_range > unit_2.weapon_range:
  if (u1.weaponRange > u2.weaponRange) {
    //         unit_2_health_list, timestamps, unit_2_next_attack_time  = _get_last_samuraied(unit_1, unit_2)
    ;[u2healthList, timestamps, u2nextAttackTime] = _getLastSamuraied(u1, u2)
    //         unit_1_health_list = [unit_1.hp] * len(timestamps)
    u1healthList = timestamps.map(() => u1.hp)
    //         unit_1_next_attack_time = unit_1.attack_speed
    u1nextAttackTime = u1.attackSpeed
  }
  //     elif unit_1.weapon_range < unit_2.weapon_range:
  else if (u1.weaponRange < u2.weaponRange) {
    //         unit_1_health_list, timestamps, unit_1_next_attack_time = _get_last_samuraied(unit_2, unit_1)
    ;[u1healthList, timestamps, u1nextAttackTime] = _getLastSamuraied(u2, u1)
    //         unit_2_health_list = [unit_2.hp] * len(timestamps)
    u2healthList = timestamps.map(() => u2.hp)
    //         unit_2_next_attack_time = unit_2.attack_speed
    u2nextAttackTime = u2.attackSpeed
  }
  //     else:
  else {
    //         unit_1_health_list = [unit_1.hp]
    //         unit_2_health_list = [unit_2.hp]
    //         timestamps = [0]
    u1healthList = [u1.hp]
    u2healthList = [u2.hp]
    timestamps = [0]
    //         unit_1_next_attack_time = unit_1.attack_speed
    //         unit_2_next_attack_time = unit_2.attack_speed
    u1nextAttackTime = u1.attackSpeed
    u2nextAttackTime = u2.attackSpeed
  }
  //     while unit_1_health_list[-1] > 0 and unit_2_health_list[-1] > 0:
  while (
    u1healthList[u1healthList.length - 1]! > 0 &&
    u2healthList[u2healthList.length - 1]! > 0
  ) {
    //         dt = min(unit_1_next_attack_time, unit_2_next_attack_time)
    const dt = Math.min(u1nextAttackTime, u2nextAttackTime)
    //         timestamps.append(timestamps[-1] + dt)
    timestamps.push(timestamps[timestamps.length - 1]! + dt)
    //         if unit_1_next_attack_time < unit_2_next_attack_time:
    if (u1nextAttackTime < u2nextAttackTime) {
      //             unit_2_health_list.append(
      //                 max(unit_2_health_list[-1] - compute_damage(unit_1, unit_2), 0)
      //             )
      u2healthList.push(
        Math.max(
          u2healthList[u2healthList.length - 1]! - computeDamage(u1, u2),
          0,
        ),
      )
      //             unit_1_health_list.append(unit_1_health_list[-1])
      u1healthList.push(u1healthList[u1healthList.length - 1]!)
      //             unit_2_next_attack_time -= unit_1_next_attack_time
      u2nextAttackTime -= u1nextAttackTime
      //             unit_1_next_attack_time = unit_1.attack_speed
      u1nextAttackTime = u1.attackSpeed
    }
    //         elif unit_1_next_attack_time == unit_2_next_attack_time:
    else if (u1nextAttackTime === u2nextAttackTime) {
      //             unit_1_health_list.append(
      //                 max(unit_1_health_list[-1] - compute_damage(unit_2, unit_1), 0)
      //             )
      u1healthList.push(
        Math.max(
          u1healthList[u1healthList.length - 1]! - computeDamage(u2, u1),
          0,
        ),
      )
      //             unit_2_health_list.append(
      //                 max(unit_2_health_list[-1] - compute_damage(unit_1, unit_2), 0)
      //             )
      u2healthList.push(
        Math.max(
          u2healthList[u2healthList.length - 1]! - computeDamage(u1, u2),
          0,
        ),
      )
      //             unit_2_next_attack_time = unit_2.attack_speed
      u2nextAttackTime = u2.attackSpeed
      //             unit_1_next_attack_time = unit_1.attack_speed
      u1nextAttackTime = u1.attackSpeed
    }
    //         else:
    else {
      //             unit_1_health_list.append(
      //                 max(unit_1_health_list[-1] - compute_damage(unit_2, unit_1), 0)
      //             )
      u1healthList.push(
        Math.max(
          u1healthList[u1healthList.length - 1]! - computeDamage(u2, u1),
          0,
        ),
      )
      //             unit_2_health_list.append(unit_2_health_list[-1])
      u2healthList.push(u2healthList[u2healthList.length - 1]!)
      //             unit_1_next_attack_time -= unit_2_next_attack_time
      u1nextAttackTime -= u2nextAttackTime
      //             unit_2_next_attack_time = unit_2.attack_speed
      u2nextAttackTime = u2.attackSpeed
    }
  }
  //     return unit_1_health_list, unit_2_health_list, timestamps
  return [u1healthList, u2healthList, timestamps]
}

// def display(unit_1: Unit, unit_2: Unit, age: int):
//     unit_1_health_list, unit_2_health_list, timestamps = trade(unit_1, unit_2)
//     fig = mpl.figure()
//     ax = fig.add_subplot(111)
//     hpdiff1 = (unit_1_health_list[0] - unit_1_health_list[-1]) / unit_1_health_list[0]
//     c1 = unit_1.cost * hpdiff1
//     hpdiff2 = (unit_2_health_list[0] - unit_2_health_list[-1]) / unit_2_health_list[0]
//     c2 = unit_2.cost * hpdiff2
//     cost_ratio = c1 / c2
//     print(f"cost for {unit_1.name} : {c1}")
//     print(f"cost for {unit_2.name} : {c2}")
//     print(f"cost ratio : {cost_ratio}")
//     ax.step(timestamps, unit_1_health_list, "-", where="post")
//     ax.step(timestamps, unit_2_health_list, "-", where="post")
//     ax.set_xlabel("time (s)")
//     ax.set_ylabel("health")
//     ax.set_title(f"Unit trade at age {age}")
//     ax.legend([unit_1.name, unit_2.name])
//     mpl.show()
//     return fig

// def coef(unit_1: Unit, unit_2: Unit):
export const coef = (u1: Unit, u2: Unit): float => {
  //     unit_1_health_list, unit_2_health_list, timestamps = trade(unit_1, unit_2)
  const [u1healthList, u2healthList, _timestamps] = trade(u1, u2)
  //     hpdiff1 = (unit_1_health_list[0] - unit_1_health_list[-1]) / unit_1_health_list[0]
  const hpdiff1 =
    (u1healthList[0]! - u1healthList[u1healthList.length - 1]!) /
    u1healthList[0]!
  //     c1 = unit_1.cost * hpdiff1
  const c1 = u1.cost * hpdiff1
  //     hpdiff2 = (unit_2_health_list[0] - unit_2_health_list[-1]) / unit_2_health_list[0]
  const hpdiff2 =
    (u2healthList[0]! - u2healthList[u2healthList.length - 1]!) /
    u2healthList[0]!
  //     c2 = unit_2.cost * hpdiff2
  const c2 = u2.cost * hpdiff2
  //     cost_ratio = c1 / c2
  const costRatio = c1 / c2
  //     return cost_ratio
  return costRatio
}

// def generate_html(civ_1: dict, civ_2: dict, output_file="ouput.html"):
//     df = pd.DataFrame(
//         {col: {row: coef(civ_1[row], civ_2[col]) for row in civ_1} for col in civ_2}
//     )
//     norm = TwoSlopeNorm(vmin=df.min().min(), vcenter=1.0, vmax=df.max().max())
//     gmap = df.map(norm)
//     styled_df = df.style.background_gradient(cmap="RdYlGn_r", axis=None, gmap=gmap)
//     styled_df.to_html(output_file)
