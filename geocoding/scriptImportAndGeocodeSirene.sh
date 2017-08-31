#Script de téléchargement de la base de données SIRENE en version géocodée
#L'argument 1 correspond à l'url où on va télécharger les données SIRENE
#Ex ./scriptImportAndGeocodeSirene.sh http://212.47.238.202/geo_sirene/2017-06


#L'option set -e permet de quitter immédiatement le script si une commande echoue
#Si la commande wget plante par exemple ou si il y a une erreur dans les csv
set -e

curdir=`dirname $0`

# Initilialisation de la liste de départements français
liste_departement=(01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 21 22 23 24 25 26 27 28 29 2A 2B 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56 57 58 59 60 61 62 63 64 65 66 67 68 69 70 71 72 73 74 75101 75102 75103 75104 75105 75106 75107 75108 75109 75110 75111 75112 75113 75114 75115 75116 75117 75118 75119 75120 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90 91 92 93 94 95 971 972 973 974 975 976 98 99)

# Obtient la taille du tableau (nombre de départements)
nombre_departement=${#liste_departement[@]}

#Supprime l'ancienne base temporaire si elle existe
mongo --host ikmongo sirene < $curdir/drop-old-temporary-mongo-database.js

TEMPDIR=`mktemp -d`
#Pour chaque département
for (( i=0; i<${nombre_departement}; i++ ));
do
  #Téléchargement de l'archive
  wget -O $TEMPDIR/geo-sirene_${liste_departement[$i]}.csv.7z $1/geo-sirene_${liste_departement[$i]}.csv.7z
  #Décompression du CSV puis suppression de l'archive
  7za x $TEMPDIR/geo-sirene_${liste_departement[$i]}.csv.7z -o$TEMPDIR
  rm $TEMPDIR/geo-sirene_${liste_departement[$i]}.csv.7z
  #Insertion dans la base de données mongodb
  sed -i '1d' $TEMPDIR/geo-sirene_${liste_departement[$i]}.csv
  #Import dans la base de données MongoDB
  mongoimport --host ikmongo -d sirene -c new-companies --type csv --file $TEMPDIR/geo-sirene_${liste_departement[$i]}.csv --fieldFile $curdir/header/header.csv --columnsHaveTypes
  #Enfin suppression du fichier pour libérer l'espace
  rm $TEMPDIR/geo-sirene_${liste_departement[$i]}.csv
done

rm -rf $TEMPDIR

#Modification de la localisation(latitude/longitude) permettant d'y placer un index 2dshpere
#Ajout des index (sur le numero de Siren, le Nom et la geolocalisation)
#Renomage de la base et suppression de l'ancienne
mongo --host ikmongo sirene < $curdir/update-mongo-database.js

echo "Script termine"