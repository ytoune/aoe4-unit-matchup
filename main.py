"""
Main script, taking in input two civs and one age
The output is an html file containing the cost efficiency of any matchup
How to read the cost effiency : It's basically the cost of the health lost
of any unit, divided the cost of the health lost of the opponent, in any 1v1 between units.
The lower the coefficient, the better your unit is against the opponent.
The algorithm consider fights starting at melee range without micro
TL;DR : Green means yeephee. Red means boohoo.
%%
"""

import argparse
import sys

from create_csv import generate_csv
from matchup import display, load_units, generate_html

parser = argparse.ArgumentParser(
    prog="AoE4matchups",
    description=sys.modules[__name__].__doc__,
)

# --- PARAMETERS ---
# That's probably the only thing you want to modify
# if you're not interrested in civilisation-specific upgrades
# civs : ab, ay, by, ch, de, fr, hr, je, kt, ma, mo, ot, ru
parser.add_argument(
    "-a",
    "--age",
    type=int,
    default=3,
    help="Age at witch the fight is simulated. Should be 1, 2, 3 or 4",
)
parser.add_argument(
    "-c",
    "--civs",
    type=str,
    default=["ma", "zx"],
    nargs=2,
    help="Pair of Civilisations. Supported civs: ab, ay, by, ch, de, fr, hr, je, kt, ma, mo, ot, ru",
)
parser.add_argument(
    "-u",
    "--units",
    type=str,
    default=["Archer", "Spearman"],
    nargs=2,
    help="Pair of units.",
)
args = parser.parse_args()

# In case users are like me and can't read:
if not (0 < args.age < 5):
    msg = f"Invalid age, got {args.age}, expected 1, 2, 3 or 4"
    raise ValueError(msg)

if len(args.civs) != 2:
    msg = f"Invalid matchup, got {len(args.civs)} civilizations, expected 2"
    raise ValueError(msg)

# step 1 : generate unit csv files
file_1 = generate_csv(args.civs[0], args.age)
file_2 = generate_csv(args.civs[1], args.age)
# step 2 : Start the game already !
units_1 = load_units(file_1)
units_2 = load_units(file_2)
generate_html(units_1, units_2)

if len(args.units) != 2:
    msg = f"Invalid matchup, got {len(args.units)} units, expected 2"
    raise ValueError(msg)
# If you want to see beautiful lines, graphs and fancy useless stuff :
cost_ratio = display(units_1[args.units[0]], units_2[args.units[1]], args.age)
# %%
