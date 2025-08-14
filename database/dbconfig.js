// Importation du module mongoose pour la gestion de la base de données MongoDB
const mongoose = require ('mongoose');

// Connexion à la base de données MongoDB hébergée sur MongoDB Atlas
mongoose.connect('mongodb+srv://mohamedbenalaya76:159632ghjk@cluster0.9sjohyx.mongodb.net/pfeFormation?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connexion à la base de données établie avec succès');
    })
    .catch((err) => {
        console.error('Erreur lors de la connexion à la base de données :', err);
    });


module.exports = mongoose;
