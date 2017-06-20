# Base Sirene
API requêtant la base des entreprises Sirene de l'open data

## Installation

Sur Ubuntu 16.10

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
    
## Méthodes de l'API Sirene
   
#### GET /companies/id/:id
Permet d'effectuer une recherche d'entreprise par son id
   
#### GET /companies/siren/:siren
Permet d'effectuer une recherche d'entreprise par numéro de SIREN
 
#### GET /companies/siret/:siret
Permet d'effectuer une recherche d'entreprise par numéro de SIRET

#### GET /companies/name/:name
Permet d'effectuer une recherche d'entreprise par son nom

#### GET /name-with-autocomplete
Permet également d'effectuer une recherche d'entreprise par son nom mais avec un traitement d'autocomplete. Le paramètre obligatoire de la requête GET est :

    name : le nom de l'entreprise

Possibilités de filtrer la recherche via des paramètres GET optionnels :

    ville : la ville de l'enreprise

Cette méthode de l'API est paginée pour des raisons de performance dans des recherches d'autocompletion. C'est-à-dire que les résultats sont limités à 10. Pour accéder aux pages suivantes, il faut utiliser le paramètre GET optionnel :

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
Permet d'effectuer une recherche d'entreprise par liste de numéro de SIREN

Le paramètre obligatoire de la requête POST est :

     siren : une liste de numéro de SIREN sous forme d'array

#### POST /companies/listOfIds
Permet d'effectuer une recherche d'entreprise par liste de numéro d'Ids

Le paramètre obligatoire de la requête POST est :

     listIds : une liste d'Ids sous forme d'array


## Méthodes de l'API Code Nafs
    
    
#### GET /nafs/codes-naf/autocomplete
Permet d'effectuer une recherche sur un libellé de code NAF, ou sur un code NAF. Le paramètre obligatoire de la requête GET est :

    libelle : le libelle ou le code NAF
