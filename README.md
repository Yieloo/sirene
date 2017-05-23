# sirene
API requêtant la base des entreprises Sirene de l'open data

## installation

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
    
