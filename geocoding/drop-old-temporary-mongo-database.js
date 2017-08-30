//Supprime l'ancienne base temporaire "new-companies"
//Elle sert à supprimer l'ancienne base temporaire avant l'import des fichiers CSV, si la précédante exécution de ce script à planté
//Elle évite donc de ne pas insérer des doublons dans le base de données à la prochaine excécution de ce script si la précédante a plantée
//Return true si elle existait, false sinon
db.getCollection('new-companies').drop();