const Formateur = require ('../models/Formateur')
const Formation = require ('../models/Formation')
const Condidat = require ('../models/Condidat')
const sessionFormation = require('../models/SessionFormation')
const FormateurAccepte = require('../models/FormateurAccepte')

module.exports.addSession = async (req,res) => {

    try{
    const {formationId, formateurId} = req.params;
    const formation = await Formation.findById(formationId);
    if (!formation) {
        return res.status(404).json({ message: 'tarinig not found' });
    }

      
    const formateur = await FormateurAccepte.findById(formateurId);
    if(!formateur) {
       return res.json("formateur not found");
    }
    const matchingFormation = formateur.formations.find(f => f.equals(formationId));
        if (!matchingFormation) {
            return res.status(400).json({ message: 'Selected formation does not match formateur formations' });
        }
    const apprenantsIds = formation.condidat;
        if(apprenantsIds.length <= 5) {
            return res.status(404).json({ message: 'One or more apprenants not found' });
        }
    const session = new sessionFormation({
        formation:formationId,
        formateur:formateurId,
        condidat:apprenantsIds,
        date : req.body.date,
        heure_deb : req.body.heure_deb
    
    });
    if (formation.condidat.length >= 10) {
        await session.save();
        return res.json({message:'Session de formation démarrée pour la formation : '}, formation.name)
    }
    return false;     
    
    } catch(err) {
        res.status(500).json({message: 'Server error'});
    }
}

module.exports.deleteSession = async (req,res)=>{
    const {sessionId} = req.params
    try{
        const session =  sessionFormation.findById(sessionId)
        if(!session){
            res.status(404).json({message : 'Formation not found'})
        }
        await session.deleteOne()
        res.json('Fomation deleted')


    }catch(err)  {
        console.log(err)
        res.status(404).json({message:'Serveur Eroor'})
        
    }
}


module.exports.getAllSession = async (req,res)=>{
    
    try{
    const session = await sessionFormation.find();

 res.json(session)
    }catch(err){
        res.satut(404).json({message : "Serveur Error"})
        console.log(err)
    }
}

module.exports.getByIdSession   = async (req , res )=> {
const {sessionId} = req.params
try{
    const session = await sessionFormation.findById(sessionId)
    if(!session){
        res.satut(401).json({message : " Session de Formation n'existe pas"})
    }
  res.satut(201).json(session)
}catch (err){
console.log(err)
res.status(404).json({message : "Serveur Error"})
}
}

