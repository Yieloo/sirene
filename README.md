# Base Sirene

API requêtant la base des entreprises Sirene de l'open data

## Installation

### Sur Ubuntu 16.10

    sudo apt update
    sudo apt upgrade
    sudo apt install -y zip nodejs npm (node ne se lançait pas après cette commande)
    
    # Installation de Node.js
    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install stable
    
    # Installation Mongodb tools r3.4.4 
    sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
    echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
    sudo apt update
    sudo apt install -y mongodb-org-tools
    
    # Installation de p7zip
    sudo apt-get install p7zip-full
    
    git clone git@github.com:Yieloo/sirene.git
    cd sirene
    npm install
    
### Sur Docker

Le fichier docker-compose.yml est configuré par défaut pour stocker le contenu de la base Mongo sur le host dans
le réportoire /v/mongo. Changez ce volume si ça ne vous convient pas.

    docker build -t yieloo/sirene
    docker-compose up

## Première utilisation

Lancer SIRENE si ce n'est pas déjà fait :

    docker-compose up
    
- Initialisation de la base NAF :

*Cette base de données est statique. En effet les codes nafs français ne sont pas sujets à changer au cours du temps.*

    docker exec -i iksirene mongorestore --host ikmongo dump-codes-naf

- Import de la base SIRENE :

*Cette base de données contient toutes les informations des plus de 10 Millions d'entreprises françaises. Ces données 
sur les entreprises sont très variables et évoluent constamment de jours en jours. La commande suivante permet à la 
fois d'installer ou de mettre à jour la base des sociétés. Pour la mise à jour, il suffit de changer la date figurant 
à la fin de l'URL par une plus récente.*

    docker exec -i iksirene bash /usr/src/app/geocoding/scriptImportAndGeocodeSirene.sh http://212.47.238.202/geo_sirene/2017-06

## Méthodes de l'API Sirene
   
#### GET /companies/id/:id
Recherche d'entreprise par son id
   
#### GET /companies/siren/:siren
Recherche d'entreprise par numéro de SIREN
 
#### GET /companies/siret/:siret
Recherche d'entreprise par numéro de SIRET

#### GET /companies/name/:name
Recherche d'entreprise par son nom

#### GET /name-with-autocomplete
Recherche d'entreprise par son nom mais avec des traitements d'autocomplétion. Le paramètre obligatoire de la requête GET est :

    name : le nom de l'entreprise

Possibilités de filtrer la recherche via un paramètre GET optionnels :

    ville : la ville de l'entreprise

Cette méthode de l'API peut être paginée pour des raisons de performance dans des recherches d'autocomplétion. C'est-à-dire que les résultats sont limités à 10.
Pour paginer cette méthode, il faut décommenter la ligne indiquée dans le code, et utiliser le paramètre GET optionnel :

    page : la page
    ex : page=1 ou pas de paramètre page affichera les 10 premiers résultats, page=2 affichera les résultats de 10 à 20, pages=3 de 20 à 30 etc...

#### GET /companies/coordinates
Permet d'effectuer une recherche d'entreprise par coordonnées. Les paramètres obligatoires de la requête GET  sont :

    latitude : la latitude du point central
    longitude : la longitude du point central
    distance : la distance maximum de recherche par rapport au point central en mètres
    
Possibilités de filtrer la recherche via des paramètres GET optionnels :

    employees : une liste d'une ou plusieurs tranche(s) (chaîne de caractères séparée par des virgules)
    naf : une liste de code NAF (chaîne de caractères séparée par des virgules)
    siren : le numéro de SIREN
    siret : le numéro de SIRET
    nom : le nom de l'entreprise
    

#### POST /companies/listofsiren
Recherche d'entreprise par liste de numéro de SIREN

Le paramètre obligatoire de la requête POST est :

     siren : une liste de numéro de SIREN sous forme d'array

#### POST /companies/listOfIds
Recherche d'entreprise par liste de numéro d'Ids

Le paramètre obligatoire de la requête POST est :

     listIds : une liste d'Ids sous forme d'array


## Méthodes de l'API Code Nafs
    
    
#### GET /nafs/codes-naf/autocomplete
Recherche sur un libellé de code NAF, ou sur un code NAF. Le paramètre obligatoire de la requête GET est :

    libelle : le libelle ou le code NAF
