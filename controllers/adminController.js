const Admin = require('../models/Admin')
var bcrypt = require('bcrypt');
module.exports.addAdmin = async(req,res,next)=>{
    const {firstName,lastName,email,password} =  req.body
    try {
        const user = new  Admin({
            firstName,
            lastName,
            email,
            password

        })
        await user.save()
        res.status(201).json('Admin Added successfully');
    
    }catch(err){
        console.log(err)
        res.status(500).send('Internal Server Error')
    }

} 


module.exports.editProfilAmdin = async(req,res)=>{
    
    try{
        const updatedUserData = req.body;
        const {adminId}=req.params;
          const admin = await Admin.findByIdAndUpdate(adminId,updatedUserData ,{new:true}) 
          if(!admin){
            res.json("formateur not found")
          }
          res.json(admin)
    }catch(err){
        console.log(err)
        res.status(500).send('Server error')
    }
 }

 module.exports.changerPassword = async (req, res) => {
    try {
      const {adminId} = req.params;
      const { currentPassword, newPassword} = req.body;
      const user = await Admin.findById(adminId);
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
      await Admin.findByIdAndUpdate(adminId, {
        password: hashedPassword,
      });
      res.json({ message: "Password changed succes" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };