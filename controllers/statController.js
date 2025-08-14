const Condidat = require("../models/Condidat");
const Formateur = require("../models/Formateur");
const Formation = require("../models/Formation");
const Categorie = require("../models/Categorie")
const FormateurAccepter = require("../models/FormateurAccepte")

module.exports.calculFormation = async (req, res) => {
    try {
        const count = await Formation.countDocuments();
        res.json(count );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.calculNombreCondidat = async (req, res) => {
    try {
        const count = await Condidat.countDocuments();
        res.json( count );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.calculNombreFormateur = async (req, res) => {
    try {
        const count = await FormateurAccepter.countDocuments();
        res.json( count );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports.calculNombreCategorie = async (req, res) => {
    try {
        const count = await Categorie.countDocuments();
        res.json( count );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.calculNombreFormateurAceepter = async (req, res) => {
    try {
        const count = await FormateurAccepter.countDocuments();
        res.json( count );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.calculCondidatForFormation = async (req, res) => {
    const { formationId } = req.params;
    try {
        const formationData = await Formation.findById(formationId, 'condidat');
        
        if (!formationData) {
            return res.status(404).json({ error: 'Formation not found' });
        }

        const numberOfCandidates = formationData.condidat.length;

        res.status(200).json( numberOfCandidates );
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};