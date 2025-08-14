const Condidat = require("../models/Condidat");
const nodemailer = require("nodemailer");
const Formation = require("../models/Formation");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const uuid = require('uuid')
const Token = require("../models/TokenCondidat");


// Create a nodemailer transporter
var transport = nodemailer.createTransport({
  service: "Gmail",
  secure: false,
  auth: {
    user: "mohamedbenalaya76@gmail.com",
    pass: "zoqgijnqhjeilngs",
  },
});

// Controller method to handle user signup
module.exports.signup = async (req, res, next) => {
  try {

    const verificationToken = uuid.v4(); // generate random token for email verification
    // Create a new Condidat instance with request body data
    let user = new Condidat({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
     
      email: req.body.email,
      password: req.body.password,
      date_nais: req.body.date_nais,
      adress: req.body.adress,
      phone: req.body.phone,
 

    });

    // Save the new user
    await user.save();

  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(16).toString('hex')
  })
  await token.save()
  console.log(token)

  const link =`http://localhost:2700/condidat/confirmatoken/${token.token}`


  await verifEmail (user.email,link)

    // Construct confirmation link
    //const link = `http://localhost:2700/condidat/confirmation/${token}`;

    // Send verification email
   /* await verifEmail(user.email,verificationToken);*/

    res.status(200).json({
      message:
        "Your account has been created. Please confirm your registration.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server error" });
  }
};


const verifEmail =async (email,link)=>{
  try{
    var message = {
      from: "from@gmail.com",
      to: email,
      subject: "Welcome",
      html: `<p>Welcome to Intelect Academy!</p><p>If you have any questions or need assistance, feel free to contact us.</p><p>Thank you and happy exploring!</p><br><a href=${link}>Click here to activate your account</a>`
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }catch(err){

  }
}


// Change route definition to "/confirmtoken/:token"
module.exports.confirmtoken = async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token }); // Use findOne instead of find
    if (!token) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    await Condidat.updateOne({ _id: token.userId }, { $set: { verified: true } });
    await  token.deleteOne()
    res.status(201).json({ message: 'Account verified' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server error' });
  }
};

// Function to send verification email
/*const verifEmail = async (email, token) => {
  try {
    var message = {
      from: "from@gmail.com",
      to: email,
      subject: "Welcome",
      html: `<p>Welcome to Intelect Academy!</p><p>If you have any questions or need assistance, feel free to contact us.</p><p>Thank you and happy exploring!</p><br><a href="http://localhost:2700/condidat/confirmation/${token}">Click here to activate your account</a>`
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    console.log("error");
  }
};

// Controller method to confirm user account
module.exports.confirmacount = async(req,res)=>{
  const userId = req.body.id;
  try {
  
   const token = req.query.token
    // Update user's verified status
    const user = await Condidat.findOneAndUpdate({verificationToken : token}, {$set: { "verified" : true, verificationToken : null}});
    res.status(201).json({message : "Account verified"});
  } catch (err) {
    console.log(err);
    res.status(404).json({message: 'Error'});
  }
}*/

// Controller method to handle user enrollment in a formation
module.exports.InscriptioFormation = async (req, res) => {
  try {
    const { condidatId, formationId } = req.params;

    // Check if the condidat is already enrolled in the formation
    const condidat = await Condidat.findById(condidatId);
    if (!condidat) {
      return res.status(404).json({ message: "Condidat not found" });
    }

    const formation = await Formation.findById(formationId);
    if (!formation) {
      return res.status(404).json({ message: "Formation not found" });
    }

    if (condidat.formations.includes(formation)) {
      return res.status(409).json({
        message: "This condidat is already linked with this formation",
      });
    }

    if (formation.condidat.some(c => c.equals(condidat._id))) {
      return res.status(409).json({
        message: "This formation is already linked with this condidat",
      });
    }

    // Enroll the condidat in the formation
    condidat.formations.push(formation);
    await condidat.save();
    formation.condidat.push(condidat);
    await formation.save();
    res.status(201).json({ message:"Formation enrollment successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports.getAllInscriptedFormation = async (req, res) => {
  const { condidatId } = req.params;
  try {
      const condidat = await Condidat.findById(condidatId).populate('formations');
      if (!condidat) {
          return res.status(404).json({ message: 'User Not Found' });
      }
      const  formations = condidat.formations;

      // Assuming 'Formation' is the model for formations and there's a reference to condidat in the Formation model
      res.json(formations);
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};


// Controller method to handle user unenrollment from a formation
module.exports.DesnscriptioFormation = async (req, res) => {
  try {
    const { condidatId, formationId } = req.params;

    // Check if the condidat is enrolled in the formation
    const condidat = await Condidat.findById(condidatId);
    if (!condidat) {
      res.status(404).json({ message: "Condidat not found " });
    }

    const formation = await Formation.findById(formationId);
    if (!formation) {
      res.status(404).json({ message: "Formation not found " });
    }

    /*if (!condidat.formations.includes(formation)) {
      return res.status(409).json({
        message: "This condidat is not linked with this formation",
      });
    }*/

    // Unenroll the condidat from the formation
    condidat.formations.pull(formation);
    await condidat.save();
    formation.condidat.pull(condidat);
    await formation.save();

    res.status(201).json({ message: "Formation unenrollment successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller method to handle password reset
module.exports.forgetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Condidat.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "Condidat not found " });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Save the updated password
    await user.save();

    // Send email notification about password change
    var message = {
      from: "from@gmail.com",
      to: req.body.email,
      subject: "Bienvenue",
      html: "Your password is Updated Successfully",
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json({ message: "Password changed" });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "Server error" });
  }
};


module.exports.getAllApprenant= async(req,res)=>{
  try{
 const condidat = await Condidat.find()
 res.json(condidat)
  }catch(err){
    console.log(err)
    res.status(404).json({message : 'probleme de serveur'})

  }
}
module.exports.supprimerApprenant = async(req,res)=>{
  try{
      const {condidatId} = req.params;
      const condidat = Condidat.findById(condidatId)
      if(!condidat){
          res.json({message : 'Categorie not Found'})
      }
      await condidat.deleteOne();
      res.status(201).json({message :'Categorie  supprimee'});
  }
  catch(err)
  {
      console.log(err);
      res.status(500).json({message :'Internal Server error'});

  }
};


module.exports.getAllInscriptedFormationsById = async (req, res) => {
  try {
    const candidats = await Condidat.find().populate('formations');
    
    if (!candidats || candidats.length === 0) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }
    
    let formations = [];

    // Parcourir tous les candidats pour récupérer leurs formations
    candidats.forEach(candidat => {
      if (candidat.formations && candidat.formations.length > 0) {
        formations = formations.concat(candidat.formations);
      }
    });

    res.json({ formations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur Interne du Serveur' });
  }
}


module.exports.editProfilCondiat = async(req,res)=>{
    
  try{
      const updatedUserData = req.body;
      const {condidatId}=req.params;
      
        const condidat = await Condidat.findByIdAndUpdate(condidatId,updatedUserData,{new:true}) 
        if(!condidat){
          res.json("Condiat not found")
        }
      
        res.json(condidat)
  }catch(err){
      console.log(err)
      res.status(500).send('Server error')
  }
}

module.exports.changerPassword = async (req, res) => {
  try {
    const {condidatId} = req.params;
    const { currentPassword, newPassword} = req.body;
    const user = await Condidat.findById(condidatId);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ message: "invalid current password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Admin.findByIdAndUpdate(condidatId, {
      password: hashedPassword,
    });
    res.json({ message: "Password changed succes" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};