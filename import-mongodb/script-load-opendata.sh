#Recupere le numero du mois precedent
MOISPRECEDENT=$(date -d "1 month ago" "+%m")
echo "recuperation de la base de donnee du ${MOISPRECEDENT} eme mois de l'annee"

#Telecharge la base de donnee en fonction du mois
echo "Telechargement du fichier zip"
wget http://files.data.gouv.fr/sirene/sirene_2017${MOISPRECEDENT}_L_M.zip

#Decompresse l'archive obtenue
echo "Decompression du fichier zip"
unzip sirene_2017${MOISPRECEDENT}_L_M.zip

#Change le nom du fichier CSV
mv *.csv opendata.csv

#Supprime le zip
rm *.zip

#Converti le fichier en UTF-8
iconv -f ISO-8859-15 -t UTF-8 opendata.csv -o opendata-utf8.csv

#Supprime le fichier encode en ISO-8859-15
rm opendata.csv

#Change les ";" en ","
echo "Change les ; en ,"
sed -i 's/";"/","/g' opendata-utf8.csv

#Supprime la premiere ligne du csv permettant de preciser a mongoimport un fichier de header
echo "Supprime la premiere ligne du csv permettant de preciser a mongoimport un fichier de header"
sed -i '1d' opendata-utf8.csv

#Supprime l'ancienne base de donnée
mongo < drop-database.js

#Insertion du csv dans mongodb
echo "Insertion du fichier csv dans mongodb"

mongoimport -d mydb -c companies --type csv --file opendata-utf8.csv --fieldFile header/headers.csv --columnsHaveTypes

#Supprime le fichier encode en utf8
rm opendata-utf8.csv

#Ajoute les index sur les libellées SIREN et L1_NORMALISEE
mongo < add-index.js

echo "Insertion dans la base de donnee mongobd terminee !"