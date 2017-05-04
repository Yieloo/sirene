#!/usr/bin/sh
split -l 10000 $1 $2
for i in fichier.*;do mv $i $i.csv ;done
