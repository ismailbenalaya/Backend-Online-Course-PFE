const Formation = require("../models/Formation");
const Categorie = require("../models/Categorie");
const Formateur = require("../models/Formateur");
const Condidat = require("../models/Condidat");
const Review = require("../models/Review");
const { rtrim } = require("validator");
const { set } = require("mongoose");

// Controller method to add a new formation
module.exports.addFormation = async (req, res, next) => {
  // Extract data from the request body
  const { nom, prix, cas, categorieId, description } = req.body;

  try {
    // Find the category by its ID
   const categorie = await Categorie.findById(categorieId);
    // If category not found, return an error
    if (!categorie) {
      return res.status(400).json({ error: "Category not found" });
    }

    // Create a new instance of Formation with the provided data
    const formation = new Formation({
      nom,
      prix,
      categorie: categorie._id,
      cas,
      description
    });

    // Save the new formation
    await formation.save();
    console.log("Formation added successfully");
    res.status(201).send("Formation ajouter avec success ");
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};

// Controller method to delete a formation
module.exports.supprimerFormation = async (req, res) => {
  try {
    // Extract the formationId from request parameters
    const { formationId } = req.params;
    // Find the formation by its ID
    const formation = Formation.findById(formationId);
    // If formation not found, return an error
    if (!formation) {
      res.status(404).json({ message: "Formation not Found" });
    }
    // Delete the formation
    await formation.deleteOne();
    res.json({ message: "Formation deleted" });
  } catch (err) {
    // Handle errors
    console.log(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

// Controller method to get all formations for a formateur
// inserer la formation dans  le tableau  du formateur 
module.exports.getFormationForFormateur = async (req, res) => {
  try {
    // Extract the formateurId from request parameters
    const { formateurId } = req.params;
    // Find the formateur by its ID and populate its formations
    const formateur = await Formateur.findById(formateurId).populate("formations");
    // If formateur not found, return an error
    if (!formateur) {
      res.status(404).json({ message: "Formateur not Found" });
    }
    // Extract formations from the formateur and send as response
    const formations = formateur.formations;
    res.json({ formations });
  } catch (err) {
    // Handle errors
    console.log(err);
    res.status(500).json({ message: "Error" });
  }
};

// Controller method to get all formations
module.exports.getAllFormation = async (req, res) => {
  try {
    // Find all formations
    const formations = await Formation.find().populate("categorie").populate("formateur");
    // Send formations as response
    res.json( formations);
  } catch (err) {
    // Handle errors
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller method to add a review for a formation
module.exports.likeFormation = async (req, res) => {
  const { formationId, apprenantId } = req.params;
  // Check if the training exists
  const formation = await Formation.findById(formationId);
  const apprenant = await Condidat.findById(apprenantId); // Assuming user is authenticated and user object is attached to request

  try {
    if (!formation) {
      return res.status(404).json({ message: "Training not found." });
    }

    if (!apprenant) {
      return res.status(404).json({ message: "Apprenant not found." });
    }
    // Check if the post is already liked by the user
    const reviewExiste = await Review.findOne({
      formation: formationId,
      user: apprenantId,
    });
    if (reviewExiste) {
      return res.status(400).json({ error: "Training already liked" });
    }

    const review = new Review({
      user: apprenantId,
      formation: formationId
      
    });

    // Save the review
    await review.save();

    // Add the review to the training's reviews array
    /*formation.reviews.push(review._id);
    await formation.save();*/
       // Increment the like count in the post document
    await Formation.findByIdAndUpdate(formationId, { $inc: { reviews: 1 } });
    res.json({ message: "Review submitted successfully." });

 

 
  } catch (error) {
    console.error("Error liking post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.dislikeFormation = async (req, res) => {
  const { formationId, apprenantId } = req.params;

  try {
      // Find the like and delete it
      const like = await Review.findOneAndDelete({ user: apprenantId, formation: formationId });
      if (!like) {
          return res.status(400).json({ error: 'Post not liked' });
      }

      // Decrement the like count in the post document
      await Formation.findByIdAndUpdate(formationId, { $inc: { reviews: -1 } });

      res.json({ message: 'Post unliked successfully' });
  } catch (error) {
      console.error('Error unliking post:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
}

  module.exports.getByIdFormation = async (req, res) => {
    try {
        const { formationId } = req.params;
        const formation = await Formation.findById(formationId);
        if (!formation) {
            return res.status(404).json({ message: "No Formation found" }); 
        }
        res.json(formation); 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }

module.exports.updateFormation = async (req,res)=>{
  const{formationId}=req.params
  const {nom,description,cas,prix,categorieId}= req.body
  try{
   
    if(!formationId){
      res.status(400).json("no formation found")
    }
    
    const updatedFormation = await Formation.findByIdAndUpdate(formationId, { categorieId,nom,description,cas,prix }, { new: true });
    if(!updatedFormation){
      return res.status(404).json({ message: 'formation not found' });
    }
    res.status(201).json({message :'formation Updated avec success'})

  }catch(err){

  }
}

  module.exports.getFormationByCategorie =  async(req,res)=>{
    const { categorieId }=req.params
    try{
      const  categorie =  await Categorie.findById(categorieId)
      const formation =  await Formation.find({categorie})
      res.json(formation)

    }catch(err){
      console.log(err)
      res.status(500).json({message :" Erreur serveur"})
    }

  } 

  module.exports.getFormationDetaille =  async(req,res)=>{
    const { formationId }=req.params
    try{
      const formation =  await Formation.findById(formationId).populate('formateur')
      res.json(formation)

    }catch(err){
      console.log(err)
      res.status(500).json({message :" Erreur serveur"})
    }

  }

  module.exports.calculRatingByFormation = async(req,res)=>{
  
    const { formationid } = req.params || { formationId: null };
    try {
        const reviews = await Review.find({ formation: formationid });
        var ratings = reviews.map(review => review.rating);
        console.log(ratings) // Extract ratings from reviews
        const ratingSum = ratings.reduce((acc, curr) => acc + curr, 0); // Calculate sum of ratings
        res.json({ ratingSum });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
    
  } 

  module.exports.getAllInscriptedFormationsAdmin = async (req, res) => {
    const { formationId } = req.params;
    try {
        const formation = await Formation.findById(formationId).populate('condidat');

        if (!formation) {
            return res.status(404).json({ message: 'Aucune formation trouvée' });
        }

        const condidats = formation.condidat;

        res.json(condidats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur Interne du Serveur' });
    }
}

module.exports.AddAvis = async(req,res)=>{
  const {formationId, userId} = req.params
  const {message} = req.body
     try{
    const formation =await Formation.findById(formationId)
    if(!formation){
       return res.status(400).json('formation not fond')

    }
    const user = await Condidat.findById(userId)
    if(!user){
      return res.status(400).json('condidat not fond')
    }
    const Avis = new Review({
      formation: formationId,
      user : userId,
      message : message
    })
    await Avis.save()
    res.status(201).json('avis created avec success ')
  }catch(err){
    console.log(err)
    res.status(404).json('sereveur error')

  }
}
module.exports.AccepterComment = async (req, res) => {
  const { Reviewid } = req.body;
  try {
    const Reviews = await Review.findByIdAndUpdate(
      Reviewid,
      { accepted: true },
    );

  

    res.status(200).json({ message: 'Review accepted successfully', review: Review });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports.getAllReviews = async(req,res)=>{
  try{
    const reviews = await Review.find().populate('formation').populate('user')
    res.json(reviews)
  }catch(err){
    console.log(err)
    res.status(404).json('serveur erreur')

  }
}
module.exports.getReveiwByFormation = async (req,res)=>{
  const {formationId}= req.params
  try{
    const reviews = await Review.find({formation :formationId ,accepted : true}).populate('formation').populate('user')
    if(!reviews) {
      return res.status(404).json('no reveiw  found')
    }
    res.json(reviews)
  }catch(err){
    console.log(err)

  }
}
module.exports.deleteAvis = async (req,res)=>{
  const {reviewId} = req.params
  try{
    const review = await Review.findById(reviewId)
    if(!review) {
     return res.status(404).json('no reveiw  found')
    }
    await review.deleteOne()
    res.json('avis deleted')

  }catch(err){
    console.log(err)
    res.status(500 ).json('serveur erreur ')
  }
} 

module.exports.calculNbrCommentByFormation = async (req, res) => {
  const { formationId } = req.params;
  
  try {
    const review = await Review.countDocuments({ formation: formationId, accepted: true });
    res.json(review);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.getAllReviewsAccepted = async (req, res) => {
  try {
    const reviews = await Review.find({ accepted: true }).populate('formation').populate('user').limit(5); // Limit to first 5 reviews
    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports.nombreDeCommentaire = async (req,res)=> {
  try{
const review = await Review.countDocuments()
if(!review){
  return res.status(404).json({message : 'Not Found'})
}
res.json(review)
  }catch(err){
console.log(err)

  }
}

