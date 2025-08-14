const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Formateur = require("../models/Formateur");
const Condidat = require("../models/Condidat");
const Admin = require("../models/Admin");
const passport = require("passport");
const FormateurAccepte = require("../models/FormateurAccepte");
const TokenCondidat = require("../models/TokenCondidat");
const nodemailer = require('nodemailer')
require("dotenv").config();





exports.verifyToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Split the token to remove the 'Bearer ' prefix
  const tokenWithoutBearer = token.split(" ")[1];

  // Verify the token
  jwt.verify(tokenWithoutBearer, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token verification failed" });
    }

    // Attach the decoded payload to the request object for further use
    req.user = decoded;

    // Continue to the next middleware or route handler
    next();
  });
};
module.exports.checkUserRole = (requireRole)=>{
    return async (req,res,next)=>{
        try{
            const token = req.headers.authorization.split(" ")[1];
            const  decoded = jwt.verify(token,process.env.TOKEN_SECRET);
            const formateur =await Formateur.findOne(decoded.userId);
            if (formateur && formateur.role === requireRole)
            {
                req.user =formateur
                next();
                return;

            }
            const condidat = await Condidat.findOne(decoded.userId);
            if (condidat && condidat.role === requireRole)
            {
                req.user =condidat
                next();
                return;

            }
            const admin = await Admin.findOne(decoded.userId)
            if (admin && admin.role === requireRole)
            {   req.user = admin
                next();
                return;

                }
            res.status(403).json({message:"Unautheized access"});
        }catch(err){
            console.log(err)
            res.status(500).json({message: "Invalid Token"});
        }
        
    
}
}


module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const formateur = await Formateur.findOne({ email });
    const condidat = await Condidat.findOne({ email });

    if (!formateur && !condidat) {
      return res.status(401).send({ message: "Invalid credential" });
    }

    if (formateur && formateur.status === 'inactive') {
      return res.status(400).json({ message: "Formateur account is inactive" });
    }

    if (condidat && condidat.verified === false) {
      return res.status(400).json({ message: "Account not activated" });
    }

    const user = formateur || condidat;
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign({ user: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      success: true,
      token: token,
      user: user,
    });

  } catch (err) {
    console.log("Error verifying fields");
    console.log(err);
    res.status(500).send({ message: "Internal server error" });
  }
};


module.exports.signInAdmin = async(req,res)=>{
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });

    
    if (!admin ) {
      return res.status(401).send({ message: "Invalid cerdential" });
    }
    const user =admin;
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }
    const token = jwt.sign({ user: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "1h",
    });
    
      res.json({
        success: true,
        token: token,

        user: user,
      });
    
    
    
    
    
  } catch (err) {
    console.log("erreur de verification des champs");
  }
}

/*module.exports.forgetUserPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const condidat = Condidat.findOne({ email });
    if (!condidat) {
      res.status(404).json({message : "condidat not fond"})
    }
    
    const payload = { email: condidat.email };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "5m" }); // Corrected property name

    const newToken = new TokenCondidat({
      userId: condidat._id,
      token: token
    });

    var maildetail = {
      from: "mohamedbenalaya76@gmail.com",
      to: req.body.email,
      subject: "Password Change",
      html: `
      <html>
          <head>
              <style>
                  .button {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #007bff;
                      color: #fff;
                      text-decoration: none;
                      border-radius: 5px;
                  }
              </style>
          </head>
          <body>
           
              <p>Dear ${condidat.nom}, click on the following button to change your password:</p>
              <a class="button" href="http://localhost:4200/user/reset-password/${token}">Reset Password</a>
          </body>
      </html>`
      
    };

    transport.sendMail(maildetail, async (err, data) => {
      if (err) {
        console.log('error', err);
        
      } else {
        await newToken.save();
       res.status(201).json({message : "email sent "})
      }
    });
  } catch (err) {
    console.log(err);
  }
};*/

module.exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Find user by email
    const user = await Condidat.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const token = crypto.randomBytes(20).toString('hex');
    const now = new Date();
    const expiry = new Date(now.getTime() + 3600000); // 1 hour expiry
    user.resetToken = token;
    user.resetTokenExpire = expiry;
    await user.save();

    // Send reset password email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      secure: false,
      auth: {
        user: "mohamedbenalaya76@gmail.com",
        pass: "zoqgijnqhjeilngs",
      },
    });
    const mailOptions = {
      to: user.email,
      from: 'your-email@gmail.com',
      subject: 'Reset your password',
      text:`You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        + Please click on the following link, or paste this into your browser to complete the process:\n\n
        + http://localhost:4200/user/reset-password/${token}\n\n
        ,`
    };
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
      return res.json({ message: 'Email sent' });
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    // Find user by reset token
    const user = await Condidat.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Update password
    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

