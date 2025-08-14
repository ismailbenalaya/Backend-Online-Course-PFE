// Importation du modèle de Formateur
const { set } = require("mongoose");
const Formateur = require("../models/Formateur");
const Formateur_Archive = require("../models/Formateur_Archive");
const FormateurAccepte = require("../models/FormateurAccepte");
const Formation = require("../models/Formation");
var bcrypt = require('bcrypt');
// Importation des modules nécessaires
// Importation nodemailer pour envoyer les email
var nodemailer = require("nodemailer");
const { resetPassword } = require("./auth");
// Configuration du service d'envoi d'email (Gmail dans cet exemple)
var transport = nodemailer.createTransport({
  service: "Gmail",
  secure: false,
  auth: {
    user: "mohamedbenalaya76@gmail.com",
    pass: "zoqgijnqhjeilngs",
  },
});

// Définition de la fonction signUp qui sera exportée comme middleware
module.exports.signup = async (req, res, next) => {
  try {
    const { originalname, path } = req.file;

    // Création d'une nouvelle instance de Formateur avec les données du corps de la requête
    let user = new Formateur({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      about: req.body.about,
      password: req.body.password,
      date_nais: req.body.date_nais,
      adress: req.body.adress,
      phone: req.body.phone,
      cv: {
        name: originalname,
        path: path,
      },
    });
    console.log(req.file);
    await user.save();
    res.status(201).send("success");
    var message = {
      from: "from@gmail.com",
      to: req.body.email,
      subject: "Bienvenue",
      html: "<p>Bienvenue à Intelect Academy!</p><p>Nous sommes ravis de vous accueillir dans notre académie intellectuelle. Nous sommes impatients de partager des connaissances et des expériences enrichissantes avec vous.</p><p>Si vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter.</p><p>Merci et bonne exploration!</p>",
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Serveur error" });
  }
};
module.exports.updateStatus = async (req, res) => {
  const { email } = req.params;
  const { status } = req.body;
  try {
    const formateur = await Formateur.findOneAndUpdate(
      { email },
      { $set: { status: status } }
    );
    /*   if(!formateur){
            return res.status(404).json({message : 'Formateur not found'})
    }
    formateur.status= status;*/
    //await formateur.save();
    await sendMail(
      formateur.email,
      "Status Update",
      "Your status has been Updates to " + status + " Please check your account"
    );
    res.json({ message: "Statue updated succesfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal  Server Error" });
  }
};
async function sendMail(to, subject, text) {
  const mailOptions = {
    from: "mohamedbenalaya76@gmail.com",
    to,
    subject,
    text,
  };
  try {
    await transport.sendMail(mailOptions);
    console.log("email sent to " + to);
  } catch (err) {
    console.err("Error sending email to ${to} :", err);
    throw err;
  }
}
module.exports.affectationFormationFormateur = async (req, res) => {
  try {
    const { formateurId, formationId } = req.body;
    const formateur = await Formateur.findById(formateurId);
    console.log(formateur);
    //console.log(formateur.status);
    /*if(!formateur){
            return res.status(404).json({message : 'formateur not found'})

        }*/
    const formation = await Formation.findById(formationId);
    console.log(formation);
    /*if(!formation){
            return res.status(404).json({message : 'formation not found'})
        }*/
    /*if(formateur.status!="active"){
            return  res.status(403).json({message:"only active Formateur Can affected"})
        }*/
    if (formateur.formations.includes(formationId)) {
      return res
        .status(409)
        .json({
          message: "This formateur is already linked with this formation",
        });
    }
    /*if (formateur.formations.includes(formationId)){
            return res.status(400).json({message:'This formation is already linked with this formateur'});
        }*/
    //on ajoute la formation au tableau des formations du formateur et on enregistre les modifications dans le document de base de données
    //formateur.formations.push(formationId);
    //await formateur.save();
    formateur.formations.push(formationId);
    formation.formateur = formateurId;
  
    await formateur.save();
    await formation.save();
    

    res.json({ message: "formation affected" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Serveur Error " });
  }
};
module.exports.supprimerFormateurAccepter = async (req, res) => {
  try {
    const { formateurId } = req.params;
    const formateur = await Formateur.findById(formateurId); // await is added here
    if (!formateur) {
      return res.status(404).json({ message: "Formateur not found" }); // return added to prevent further execution
    }
    await formateur.deleteOne(); // await is already here, which is correct
    res.json({ message: "Formateur supprimé" });
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports.getAllFormateur = async (req, res) => {
  try {
    const formateur = await Formateur.find();
    res.json(formateur);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports.forgetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await Formateur.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "Formateur not found " });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
    res.status(201).json({ message: "Password changed" });
    var message = {
      from: "from@gmail.com",
      to: req.body.email,
      subject: "Bienvenue",
      html: "Your password is Updated Succesfully",
    };
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "serveur erreur" });
  }
};

module.exports.accepterFormateur = async (req, res) => {
  const { formateurId } = req.params;
  try {
    const formateur = await Formateur.findById(formateurId);
    if (!formateur) {
      return res.status(404).json({ message: "Formateur non trouvé" });
    }

    // Mettre à jour le statut du formateur

    var formateurAccepter = new FormateurAccepte({
      firstName: formateur.firstName,
      lastName: formateur.lastName,
      date_nais: formateur.date_nais,
      adress: formateur.adress,
      email: formateur.email,
      password: formateur.password,
      phone: formateur.phone,
      cv: formateur.cv,
    });
    // Modifier le statut selon vos besoins

    await formateurAccepter.save();
    await Formateur.findByIdAndUpdate(formateurId, {
      $set: { status: "active" },
    });

    // Envoi de l'e-mail de bienvenue
    var message = {
      from: "from@gmail.com",
      to: formateur.email,
      subject: "Bienvenue",
      html: `<p>Bienvenue, ${formateur.nom}!</p>
                   <p>Nous sommes ravis de vous accueillir en tant que formateur dans notre académie intellectuelle. Votre expertise et votre passion seront des atouts précieux pour inspirer nos étudiants.</p>
                   <p>Nous sommes impatients de collaborer avec vous pour créer des expériences d'apprentissage enrichissantes et stimulantes.</p>
                   <p>Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à nous contacter.</p>
                   <p>Merci et bonne exploration!</p>`,
    };

    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({ message: "Formateur accepté avec succès" });
  } catch (e) {
    console.log("erreur :", e);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports.refuserFormateur = async (req, res) => {
  const { formateurId } = req.params;

  try {
    const formateur = await Formateur_Archive.findById(formateurId);

    // Mettre à jour le statut du formateur
    await formateur.deleteOne();

    // Envoi de l'e-mail de refus
    var message = {
      from: "from@gmail.com",
      to: formateur.email,
      subject: "Refus de candidature",
      html: `<p>Cher ${formateur.nom},</p>
            <p>Nous vous informons que votre candidature pour devenir formateur à Intelect Academy a été refusée.</p>
            <p>Nous vous remercions pour l'intérêt que vous avez porté à notre académie. Si vous avez des questions ou besoin de plus d'informations, n'hésitez pas à nous contacter.</p>
            <p>Meilleures salutations,</p>
            <p>L'équipe d'Intelect Academy</p>`,
    };

    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({ message: "Formateur refusé et supprime" });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({
        message: "Une erreur est survenue lors du traitement de la demande.",
      });
  }
};

module.exports.archeveFormateur = async (req, res) => {
  const { formateurId } = req.params;

  try {
    // Retrieve the formateur to be archived
    const formateur = await Formateur.findById(formateurId);
    if (!formateur) {
      return res.status(404).json({ message: "Formateur not found" });
    }

    // Check if the formateur is already active
    /*if (formateur.status === "active" || formateur.status === "refuse") {
            return res.status(400).json({ message: 'Formateur cannot archive' });
        }/*

        // Check if the formateur is already archived
       /* const existingArchive = await Formateur_Archive.findOne({ Formateurs : formateurId });
        if (existingArchive) {
            return res.status(400).json({ message: 'Formateur already exists in the archive' });
        }*/

    // Create a new archive entry
    const archiveEntry = new Formateur_Archive({
      firstName: formateur.firstName,
      lastName: formateur.lastName,
      date_nais: formateur.date_nais,
      email: formateur.email,
      password: formateur.password,
      phone: formateur.phone,
      cv: formateur.cv,
    });

    await archiveEntry.save();
    await formateur.deleteOne();
    return res.status(201).json({ message: "Formateur archived" });
  } catch (e) {
    console.log(e);
    res.status(501).json({ message: "serveur erreur" });
  }
};
module.exports.restoreFromArchive = async (req, res) => {
  const { formateurId } = req.params;
  try {
    const formateur = await Formateur_Archive.findById(formateurId);
    if (!formateur) {
    }
    const formateurAccepter = new FormateurAccepte({
      firstName: formateur.firstName,
      lastName: formateur.lastName,
      date_nais: formateur.date_nais,
      email: formateur.email,
      password: formateur.password,
      phone: formateur.phone,
      cv: formateur.cv,
    });
    var message = {
      from: "from@gmail.com",
      to: formateur.email,
      subject: "Bienvenue",
      html: `<p>Bienvenue, ${formateur.nom}!</p>
               <p>Nous sommes ravis de vous accueillir en tant que formateur dans notre académie intellectuelle. Votre expertise et votre passion seront des atouts précieux pour inspirer nos étudiants.</p>
               <p>Nous sommes impatients de collaborer avec vous pour créer des expériences d'apprentissage enrichissantes et stimulantes.</p>
               <p>Si vous avez des questions ou avez besoin d'assistance, n'hésitez pas à nous contacter.</p>
               <p>Merci et bonne exploration!</p>`,
    };

    await formateurAccepter.save();
    await formateur.deleteOne();
    transport.sendMail(message, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(201).json({ message: " formateur restored to accepted" });
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Error Serveur" });
  }
};

module.exports.getAllFormateurArhive = async (req, res) => {
  try {
    const formateur = await Formateur_Archive.find();
    if (!formateur) {
      res.status(401).json({ message: "No Archive Found" });
    }
    res.json(formateur);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports.getAllFormateurAcceepte = async (req, res) => {
  try {
    const formateur = await Formateur.find({ status: 'active' });
    if (!formateur) {
      res.status(404).json({ message: "No formateur Found" });
    }
    res.json(formateur);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
module.exports.deleteFormateurArchive = async (req, res) => {
  const { formateurId } = req.params;
  try {
    const formateur = Formateur_Archive.findById(formateurId);
    if (!formateur) {
      res.status(404).json({ message: "Formation not Found" });
    }
    await formateur.deleteOne();
    res.json({ message: "formation supprimee" });
  } catch (err) {
    console.error(e);
    res
      .status(500)
      .json({
        message: "Une erreur est survenue lors du traitement de la demande.",
      });
  }
};

module.exports.editProfilFormateur = async (req, res) => {
  try {
    const updatedUserData = req.body;
    const { formateurId } = req.params;
    const formateur = await Formateur.findByIdAndUpdate(
      formateurId,
      updatedUserData,
      { new: true }
    );
    if (!formateur) {
      res.json("formateur not found");
    }
    res.json(formateur);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};
module.exports.updateCv = async (req, res) => {
  const {formateurId} = req.params;
  
  const formateur = await Formateur.findById(formateurId);
  if (!formateur) {
    return res.status(404).json({ message: 'Formateur not found' });
  }

  const { originalname, path} = req.file;
  formateur.cv = {path:path, name:originalname};
  await formateur.save();
  res.json(formateur.cv);
  //res.json({ path : formateur.cv.path });
};



module.exports.downloadCvbyFormateur = async (req, res) => {
  try {
    const formateurcv = await Formateur.findById(req.params.id);
    if (!formateurcv) {
      return res.status(404).send("formateur not found");
    }
    res.sendFile(formateurcv.cv.path);
  } catch (err) {
    console.log(err);
    res.status(500).send("serveur errr");
  }
};
module.exports.changerPassword = async (req, res) => {
  try {
    const {formateurId} = req.params;
    const { currentPassword, newPassword} = req.body;
    const user = await Formateur.findById(formateurId);
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
    await Formateur.findByIdAndUpdate(formateurId, {
      password: hashedPassword,
    });
    res.json({ message: "Password changed succes" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getAllFormationAffected = async (req, res) => {
  const { formateurId } = req.params;
  try {
    const formateur = await Formateur.findById(formateurId).populate('formations');
    if (!formateur) {
      return res.status(404).json('Formateur not found');
    }
    
    // Assuming each formation has a condidat property which is an array
    const formationsWithCandidatsCount = formateur.formations.map(formation => ({
      ...formation.toObject(), // Convert Mongoose document to plain object
      candidatsCount: formation.condidat ? formation.condidat.length : 0 // Ensure the correct array name and default value
    }));

    res.json(formationsWithCandidatsCount);
  } catch (err) {
    console.log(err);
    res.status(500).json('Internal Server Error');
  }
};