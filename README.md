# AOE4-Unit-Matchup

A **TypeScript** project to explore the cost efficiency between any of the AOE4 units, accounting for upgrades, attack speed, etc...

[web page](https://ytoune.github.io/aoe4-unit-matchup/)

forked from owelcomm/AOE4-Unit-Matchup

# AOE4-Unit-Matchup

A python project to explore the cost efficiency between any of the AOE4 units, accounting for upgrades, attack speed, etc...

# What it does

## Matchup cost efficiency summary

Basically, you give the script **two civs and one age**, and it gives you back an summary of the how much ressources you lost on the encounter.

It considers an 1v1 between two units, without any micro, **starting at melee range** (might be modified later). It also consider the unit as fully upgraded for its age (without civ-specific upgrades, which can be added manually).

The resulting array is an array that looks like this :

![image](https://github.com/user-attachments/assets/e251d7f3-67dd-42b7-8746-13b14932ab06)

Basically, it's the proportion of resources you need to invest to kill your opponent units, comparing to the resources your opponent invested.
In other words :

- a value of "1" means that in term of ressources, your 1v1 is even. By spending the same amount of resource, you will have an even fight if you keep doing 1v1 units without any micro. **It does not mean that ONE unit is better than ONE other unit (a lancer can 1v1 a spearman, but it does not mean it's worth for the lancer, considering the cost of the units).**
- A value of "0.5" means that you need to spend half your opponent ressources to win the fight.
- A value of "2" means that you need to spend twice your opponent ressources to win the fight.

You get it ? In case you don't :

**TL;DR** :

- **GREEN means WHOOOWIIIIE for the unit in the row, and means BOOOHOOO for the unit in the column.**
- **RED means BOOOHOOOO for the unit mentionned in the row, and means YEEPEEEEH for the unit mentionned in the column.**

---

## 1v1 Fight simulation

Basically, as a process of cost coefficient computation, a fight is simulated. Any specific fight can be seen, to have an idea of how an encounter is handled ingame when not looking (considering starting at melee range). Just specify two units included in the civ/age you mentionned in the script, and it'll do the rest.
![image](https://github.com/user-attachments/assets/174f3321-c609-4622-ac64-0d27f40b6338)

# How to use ?

It's very easy and simple to use, you only need python (programming language) to run it. I'll create a windows executable at some point, or you can do it if you wanna be useful.

## Python env

Any recent python version should work. As for the libraries used, I still didn't write any requirements.txt, but any anaconda env should do the trick. Reach out to me if you have issues, or ask your local chatgpt/google friend about how to install it, it can be done in 2 minutes for any OS.

## Running the script.

**The main.py should be the entry point. There, you can specify two civs, and one age, and run the script. An html file will be created, that you can open with any browser**

# What is taken in account

All the vanilla upgrades are taken in acocunt. Attack speed, damage, armor, health, cost and unit type are taken in account when simulating the fight.

# What is not taken in account

The starting range of the fight, the range/movespeed of the units, and the civilisation-specific upgrades. The upgrades are not hard to add at all, but require a bit of time to do it for all civs. Feel free to manually edit the `create_csv.py` file, or the `.csv` files (very easy to understand, it's basically a summary of each unit stats).

# Data source / Update the unit list

The data I use is from the **AoE4 World Data**, which today is actively updated. Just replace the ´all-unified.json´ file to update the unit list. The data can be found here : https://data.aoe4world.com/
