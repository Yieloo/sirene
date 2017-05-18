#Script de geocodage de la base mongodb
# Parametre 1 : le dossier de destination des fichiers temporaires CSV
echo "le dossier de destination choisi est : $1"

echo "*****************************************************************************"
echo "Debut de la creation des fichiers CSV"
echo "le dossier de destination choisi est : $1"
node createCSVFiles.js $1
echo "Fin de la creation des fichiers CSV dans le dossier $1"
echo "*****************************************************************************"


echo "Debut des appels de l'API de geocodage"
echo "*****************************************************************************"
liste_fichiers=`ls $1 | grep '^out[0-9]*.csv$'`
path=$1
for fichier in $liste_fichiers
do
        echo "Debut du geocodage du fichier : $fichier"
        pathfile=$path$fichier
        fichieroutput="$pathfile-geocode.csv"
        http --timeout 1000 -f POST http://api-adresse.data.gouv.fr/search/csv/ columns='voie' postcode='postcode' citycode='citycode' data@$pathfile --download --output $fichieroutput
        echo "Fin de geocodage du fichier : $fichier"
        echo "Insertion du fichier : $fichier dans la base de donnees"
        node insertGeocodingInDataBase $fichieroutput
        echo "Fin d'insertion du fichier : $fichier"
        echo "Mise en attente du script pendant 10 minutes..."
        sleep 600
done
echo "Fin des appels de l'API de geocodage"
echo "*****************************************************************************"

