# Script to read the all-unified.json file, and export unit stats for one civ/age as a csv file, accounting for upgrades.
# TODO : add civilisation-specific upgrades
# TODO : add documentation
# TODO : add output directory
# TODO : add more stats such as movespeed/range/specific ressource cost
import json
import csv


def generate_csv(civ: str, age: str) -> str:
    # I've selected only "mass-able" units, feel free to add more.
    unit_names = [
        "Archer",
        "Camel Archer",
        "Camel Rider",
        "Crossbowman",
        "Ghulam",
        "Handcannoneer",
        "Horseman",
        "Lancer",
        "Scout",
        "Spearman",
        "Camel Lancer",
        "Arbalétrier",
        "Cataphract",
        "Grenadier",
        "Horse Archer",
        "Javelin Thrower",
        "Keshik",
        "Limitanei",
        "Landsknecht",
        "Longbowman",
        "Mangudai",
        "Musofadi Warrior",
        "Sipahi",
        "Streltsy",
        "Tower Elephant",
        "Varangian Guard",
        "War Elephant",
        "Zhuge Nu",
        "Palace Guard",
        "Ghazi Raider",
        "Man-at-Arms",
        "Knight",
        "Mounted Samurai",
        "Onna-Bugeisha",
        "Ozutsu",
        "Samurai",
        "Shinobi",
        "Donso",
        "Freeborn Warrior",
        "Mansa Javelineer",
        "Mansa Musofadi Warrior",
        "Musofadi Gunner",
        "Sofa",
        "Warrior Scout",
        "Gilded Archer",
        "Gilded Crossbowman",
        "Gilded Handcannoneer",
        "Gilded Horseman",
        "Gilded Knight",
        "Gilded Landsknecht",
        "Gilded Man-at-Arms",
        "Gilded Spearman",
        "Janissary",
        "Imperial Guard",
        "Chevalier Confrere",
        "Condottiero",
        "Genitour",
        "Genoese Crossbowman",
        "Heavy Spearman",
        "Hospitaller Knight",
        "Serjeant",
        "Szlachta Cavalry",
        "Templar Brother",
        "Teutonic Knight",
        "Veteran Demilancer",
        "Hobelar",
        "Yeoman",
    ]

    with open("all-unified.json", "r") as json_file:
        data = json.load(json_file)["data"]

    with open(f"{civ}_{age}_units.csv", "w", newline="") as csv_file:
        writer = csv.writer(csv_file)
        writer.writerow(
            [
                "name",
                "hp",
                "melee_damage",
                "range_damage",
                "attack_speed",
                "melee_armor",
                "range_armor",
                "unit_type",
                "damage_bonus_type",
                "damage_bonus",
                "cost",
                "melee_attack_upgrade",
                "range_attack_upgrade",
                "melee_def_upgrade",
                "range_def_upgrade",
                "melee_mult_bonus",
                "range_mult_bonus",
                "hp_mult",
                "true_damage",
                "number_of_attacks",
            ]
        )
        for unit in data:
            name = unit.get("name", "")
            for unit in unit["variations"]:
                if not (
                    civ in unit["civs"]
                    and age == unit["age"]
                    and name in unit_names
                ):
                    continue

                hp = unit.get("hitpoints", 0)

                # weapon stuff
                weapon = unit["weapons"][0]
                if weapon["type"] == "melee":
                    melee_damage = weapon.get("damage", "")
                    range_damage = 0
                elif weapon["type"] == "ranged":
                    melee_damage = 0
                    range_damage = weapon.get("damage", "")
                else:
                    print(f"issue with damage for {name}")
                attack_speed = weapon.get("speed", "")
                damage_bonus = []
                damage_bonus_type = []
                for bonus in weapon["modifiers"]:
                    damage_bonus.append(bonus.get("value", ""))
                    damage_bonus_type.append(
                        bonus["target"].get("class", [""])[0])
                if "burst" in weapon.keys():
                    number_of_attacks = weapon["burst"].get("count", "")
                else:
                    number_of_attacks = 1

                # armor stuff
                melee_armor = 0
                range_armor = 0
                for armor in unit["armor"]:
                    if armor["type"] == "melee":
                        melee_armor = armor.get("value", 0)
                    elif armor["type"] == "ranged":
                        range_armor = armor.get("value", 0)

                # misc
                cost = unit["costs"].get("total")
                unit_type = unit.get("classes", [])

                # upgrades, tweak according to unit manually
                melee_attack_upgrade = age
                range_attack_upgrade = age
                melee_def_upgrade = age
                range_def_upgrade = age
                hp_mult = 1  # default value, do not modify
                range_mult_bonus = 1  # default value, do not modify
                melee_mult_bonus = 1  # default value, do not modify
                if age == 4:
                    if "cavalry" in unit_type:
                        hp_mult = 1.25
                    if "ranged" in unit_type and "gunpowder" not in unit_type:
                        range_mult_bonus = 1.2
                    if (
                        "ranged" in unit_type
                        and "gunpowder" in unit_type
                        and name != "Janissary"
                    ):
                        damage_bonus.append(5)
                        damage_bonus_type.append(["melee", "infantry"])
                    if "infantry" in unit_type and "melee" in unit_type:
                        hp_mult = 1.15
                        melee_mult_bonus = 1.15

                true_damage = 0

                writer.writerow(
                    [
                        name,
                        hp,
                        melee_damage,
                        range_damage,
                        attack_speed,
                        melee_armor,
                        range_armor,
                        unit_type,
                        damage_bonus_type,
                        damage_bonus,
                        cost,
                        melee_attack_upgrade,
                        range_attack_upgrade,
                        melee_def_upgrade,
                        range_def_upgrade,
                        melee_mult_bonus,
                        range_mult_bonus,
                        hp_mult,
                        true_damage,
                        number_of_attacks,
                    ]
                )
    return f"{civ}_{age}_units.csv"
