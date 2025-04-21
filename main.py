# Main script, taking in input two civs and one age
# The output is an html file containing the cost efficiency of any matchup
# How to read the cost effiency : It's basically the cost of the health lost
# of any unit, divided the cost of the health lost of the opponent, in any 1v1 between units.
# The lower the coefficient, the better your unit is against the opponent.
# The algorithm consider fights starting at melee range without micro
# TL;DR : Green means yeephee. Red means boohoo.
# %%
from create_csv import generate_csv
from matchup import display, load_units, generate_html

# --- PARAMETERS ---
# That's probably the only thing you want to modify
# if you're not interrested in civilisation-specific upgrades
# civs : ab, ay, by, ch, de, fr, hr, je, kt, ma, mo, ot, ru
civ_1 = "ma"
civ_2 = "zx"
age = 3


# step 1 : generate unit csv files
file_1 = generate_csv(civ_1, age)
file_2 = generate_csv(civ_2, age)
# step 2 : Start the game already !
units_1 = load_units(file_1)
units_2 = load_units(file_2)
generate_html(units_1, units_2)

# If you want to see beautiful lines, graphs and fancy useless stuff :
cost_ratio = display(units_1["Archer"], units_2["Spearman"], age)
# %%
