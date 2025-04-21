# Python file that structure units specifications, simulate battle between two units, and generate matchup summary files
# TODO : add documentation .-.
# TODO : account for movement speed/range
import csv
import ast
from matplotlib.colors import TwoSlopeNorm
import matplotlib.pylab as mpl
import pandas as pd


class Unit:
    def __init__(
        self,
        hp: float,
        name: str = "",
        melee_damage: float = 0,
        range_damage: float = 0,
        attack_speed: float = 1.375,
        melee_armor: float = 0,
        range_armor: float = 0,
        unit_type: list = None,
        damage_bonus_type: list = None,
        damage_bonus: list = None,
        cost: float = 0,
        melee_attack_upgrade: float = 0,
        range_attack_upgrade: float = 0,
        melee_def_upgrade: float = 0,
        range_def_upgrade: float = 0,
        melee_mult_bonus: float = 1,
        range_mult_bonus: float = 1,
        hp_mult: float = 1,
        true_damage: float = 0,
        number_of_attacks: int = 1
    ):
        if unit_type is None:
            unit_type = []
        if damage_bonus_type is None:
            damage_bonus_type = []
        if damage_bonus is None:
            damage_bonus = []

        # basic
        self.hp = hp * hp_mult
        self.name = name

        # damage
        self.attack_speed = attack_speed
        self.melee_damage = melee_damage
        self.range_damage = range_damage
        self.melee_attack_upgrade = melee_attack_upgrade
        self.range_attack_upgrade = range_attack_upgrade
        self.damage_bonus_type = damage_bonus_type
        self.damage_bonus = damage_bonus
        self.true_damage = true_damage
        self.number_of_attacks = number_of_attacks
        # we consider the following bonus as applying to both base and bonus damage (ex : university upgrade)
        self.melee_mult_bonus = melee_mult_bonus
        self.range_mult_bonus = range_mult_bonus

        # armor
        self.melee_armor = melee_armor
        self.range_armor = range_armor
        self.melee_def_upgrade = melee_def_upgrade
        self.range_def_upgrade = range_def_upgrade

        # misc
        self.unit_type = unit_type
        self.cost = cost


def load_units(filename: str = "units.csv") -> dict:
    with open(filename, newline="") as csvfile:
        units = {}
        reader = csv.DictReader(csvfile)
        for row in reader:
            parsed_row = {}

            for key, value in row.items():
                if value.strip() == "":
                    continue

                if key in {"unit_type", "damage_bonus_type", "damage_bonus"}:
                    parsed_row[key] = ast.literal_eval(value)

                elif key in {
                    "hp", "melee_damage", "range_damage", "attack_speed",
                    "melee_armor", "range_armor", "cost",
                    "melee_attack_upgrade", "range_attack_upgrade",
                    "melee_def_upgrade", "range_def_upgrade",
                    "melee_mult_bonus", "range_mult_bonus", "hp_mult", "true_damage", "number_of_attacks"
                }:
                    parsed_row[key] = float(value)
                else:
                    parsed_row[key] = value

            unit = Unit(**parsed_row)
            units[unit.name] = unit
    return units


def check_bonus_damage(unit_1: Unit, unit_2: Unit) -> float:
    bonus_value = 0
    for bonus, value in zip(unit_1.damage_bonus_type, unit_1.damage_bonus):
        if all(bonus_type in unit_2.unit_type for bonus_type in bonus):
            bonus_value += value
    return bonus_value


def compute_damage(unit_1: Unit, unit_2: Unit) -> float:
    flag_melee = unit_1.melee_damage > unit_1.range_damage
    bonus_damage = check_bonus_damage(unit_1, unit_2)
    if flag_melee:
        damage = (
            unit_1.melee_damage + unit_1.melee_attack_upgrade + bonus_damage
        ) * unit_1.melee_mult_bonus
        armor = unit_2.melee_armor + unit_2.melee_def_upgrade
    else:
        damage = (
            unit_1.range_damage + unit_1.range_attack_upgrade + bonus_damage
        ) * unit_1.range_mult_bonus
        armor = unit_2.range_armor + unit_2.range_def_upgrade

    return (max(damage - armor, 1) + unit_1.true_damage)*unit_1.number_of_attacks


def trade(unit_1: Unit, unit_2: Unit):
    unit_1_health_list = [unit_1.hp]
    unit_1_next_attack_time = unit_1.attack_speed
    unit_2_next_attack_time = unit_2.attack_speed
    unit_2_health_list = [unit_2.hp]
    timestamps = [0]
    while unit_1_health_list[-1] > 0 and unit_2_health_list[-1] > 0:
        dt = min(unit_1_next_attack_time, unit_2_next_attack_time)
        timestamps.append(timestamps[-1] + dt)
        if unit_1_next_attack_time < unit_2_next_attack_time:
            unit_2_health_list.append(
                max(unit_2_health_list[-1] - compute_damage(unit_1, unit_2), 0))
            unit_1_health_list.append(unit_1_health_list[-1])
            unit_2_next_attack_time -= unit_1_next_attack_time
            unit_1_next_attack_time = unit_1.attack_speed
        elif unit_1_next_attack_time == unit_2_next_attack_time:
            unit_1_health_list.append(
                max(unit_1_health_list[-1] - compute_damage(unit_2, unit_1), 0))
            unit_2_health_list.append(
                max(unit_2_health_list[-1] - compute_damage(unit_1, unit_2), 0))
            unit_2_next_attack_time = unit_2.attack_speed
            unit_1_next_attack_time = unit_1.attack_speed

        else:
            unit_1_health_list.append(
                max(unit_1_health_list[-1] - compute_damage(unit_2, unit_1), 0))
            unit_2_health_list.append(unit_2_health_list[-1])
            unit_1_next_attack_time -= unit_2_next_attack_time
            unit_2_next_attack_time = unit_2.attack_speed
    return unit_1_health_list, unit_2_health_list, timestamps


def display(unit_1: Unit, unit_2: Unit, age: int):
    unit_1_health_list, unit_2_health_list, timestamps = trade(unit_1, unit_2)
    fig = mpl.figure()
    ax = fig.add_subplot(111)
    hpdiff1 = (unit_1_health_list[0] -
               unit_1_health_list[-1]) / unit_1_health_list[0]
    c1 = unit_1.cost * hpdiff1
    hpdiff2 = (unit_2_health_list[0] -
               unit_2_health_list[-1]) / unit_2_health_list[0]
    c2 = unit_2.cost * hpdiff2
    cost_ratio = c1 / c2
    print(f"cost for {unit_1.name} : {c1}")
    print(f"cost for {unit_2.name} : {c2}")
    ax.step(timestamps, unit_1_health_list, "-", where="post")
    ax.step(timestamps, unit_2_health_list, "-", where="post")
    ax.set_xlabel("time (s)")
    ax.set_ylabel("health")
    ax.set_title(f"Unit trade at age {age}")
    ax.legend([unit_1.name, unit_2.name])
    return cost_ratio


def coef(unit_1: Unit, unit_2: Unit):
    unit_1_health_list, unit_2_health_list, timestamps = trade(unit_1, unit_2)
    hpdiff1 = (unit_1_health_list[0] -
               unit_1_health_list[-1]) / unit_1_health_list[0]
    c1 = unit_1.cost * hpdiff1
    hpdiff2 = (unit_2_health_list[0] -
               unit_2_health_list[-1]) / unit_2_health_list[0]
    c2 = unit_2.cost * hpdiff2
    cost_ratio = c1 / c2
    return cost_ratio


def generate_html(civ_1: dict, civ_2: dict, output_file="ouput.html"):
    df = pd.DataFrame(
        {col: {row: coef(civ_1[row], civ_2[col])
               for row in civ_1} for col in civ_2}
    )
    norm = TwoSlopeNorm(vmin=df.min().min(), vcenter=1.0, vmax=df.max().max())
    gmap = df.applymap(norm)
    styled_df = df.style.background_gradient(
        cmap='RdYlGn_r',
        axis=None,
        gmap=gmap
    )
    styled_df.to_html(output_file)
