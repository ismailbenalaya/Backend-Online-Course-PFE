const Categorie = require('../models/Categorie');

module.exports.add = (req,res,next)=>{
    try{
    let category = new Categorie({
        nom : req.body.nom,
        description : req.body.description
})
category.save();    
res.status(201).json(category);
if ((err)=> {
    console.log(err);
})
    console.log('Categorie added succesfuly ');

    }catch(err){
        console.log(err);
    }
}
module.exports.getAll= async(req, res) => {
    try{        
        const categorie = await Categorie.find();
        res.json(categorie)
    }catch(err){
        console.log(err)
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports.supprimerCategorie = async(req,res)=>{
    try{
        const {categorieId} = req.params;
        const categorie = Categorie.findById(categorieId)
        if(!categorie){
            res.json({message : 'Categorie not Found'})
        }
        await categorie.deleteOne();
        res.status(201).json({message :'Categorie  supprimee'});
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({message :'Internal Server error'});

    }
}
module.exports.UpdateCategorie = async (req, res) => {
    const { categorieId } = req.params;
    const { nom, description } = req.body;

    try {
        if (!categorieId) {
            return res.status(400).json({ message: 'No Category Id Provided' }); // Return a 400 Bad Request status if no category ID is provided
        }

        // Find the category by ID and update its properties
        const updatedCategorie = await Categorie.findByIdAndUpdate(categorieId, { nom, description }, { new: true });

        if (!updatedCategorie) {
            return res.status(404).json({ message: 'Category not found' }); // Return a 404 Not Found status if the category is not found
        }

        res.status(200).json({ message: "Category updated successfully", updatedCategorie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error in updating the category' }); // Return a 500 Internal Server Error status for other errors
    }
};
module.exports.getByidCategorie = async (req, res) => {
    try {
        const { categorieId } = req.params;
        const categorie = await Categorie.findById(categorieId);
        if (!categorie) {
            return res.status(404).json({ message: "No Category found" }); // Return 404 if category not found
        }
        res.status(200).json( categorie ); // Return category if found
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' }); // Handle internal server error
    }
}
