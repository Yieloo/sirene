#L'argument $1 du script est le dossier de destination des fichiers temporaires zip et csv téléchargés
#Prevoir au moins 20 Go de libre pour ce dossier
#Exemple de lancement du script : ./script-load-opendata.sh /any/folder

#L'option set -e permet de quitter immédiatement le script si une commande echoue
#Si la commande wget plante par exemple ou si il y a une erreur dans le csv
set -e

#Recupere le numero du mois precedent
MOISPRECEDENT=$(date -d "1 month ago" "+%m")

#Recupere l'annee du mois precedent
ANNEE=$(date -d "1 month ago" "+%Y")
echo "Récupération de la base de donnees du ${MOISPRECEDENT} eme mois de l'année ${ANNEE}"

#Telecharge la base de donnee en fonction du mois et de l'annee
echo "Telechargement du fichier zip"
wget -O $1/sirene.zip http://files.data.gouv.fr/sirene/sirene_${ANNEE}${MOISPRECEDENT}_L_M.zip

#Decompresse l'archive obtenue
echo "Decompression du fichier zip"
unzip $1/sirene.zip -d $1

#Change le nom du fichier CSV
mv $1/*.csv $1/opendata.csv

#Supprime le zip
rm $1/sirene.zip

#Converti le fichier en UTF-8
echo "Converti le fichier en UTF-8"
iconv -f ISO-8859-15 -t UTF-8 $1/opendata.csv -o $1/opendata-utf8.csv

#Supprime le fichier encode en ISO-8859-15
rm $1/opendata.csv

#Change les ";" en ","
echo "Change les ; en ,"
sed -i 's/";"/","/g' $1/opendata-utf8.csv

#Supprime la premiere ligne du csv permettant de preciser a mongoimport un fichier de header
echo "Supprime la premiere ligne du csv permettant de preciser a mongoimport un fichier de header"
sed -i '1d' $1/opendata-utf8.csv

#Supprime l'ancienne base de donnée
echo "Supprime l'ancienne base de donnee"
mongo < drop-database.js

#Insertion du csv dans mongodb
echo "Insertion du fichier csv dans mongodb"

mongoimport -d mydb -c companies --type csv --file $1/opendata-utf8.csv --fieldFile header/headers.csv --columnsHaveTypes

#Supprime le fichier encode en utf8
rm $1/opendata-utf8.csv

#Ajoute les index sur les libellées SIREN et L1_NORMALISEE
echo "Ajoute les index"
mongo < add-index.js

echo "Insertion dans la base de donnee mongobd terminee !"