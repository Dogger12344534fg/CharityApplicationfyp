import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import sendMail from '../utils/sendMail.js';

const sendWelcome = async(email, name) => {
  const html = `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f7fb; padding: 40px;">
    <div style="max-width: 600px; background: #ffffff; border-radius: 12px; margin: auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;">
      
      <div style="background: linear-gradient(135deg, #4e54c8, #8f94fb); padding: 25px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 26px;">Welcome to Our App, ${name || "Friend"} 🎉</h1>
      </div>

      <div style="padding: 30px;">
        <p style="font-size: 16px; color: #333;">Hi <b>${name || "there"}</b>,</p>
        <p style="font-size: 15px; color: #555;">
          We’re so excited to have you join our community! Your account has been successfully created and you’re all set to explore what we have to offer.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://yourapp.com/login" 
            style="background: linear-gradient(135deg, #8f94fb, #4e54c8);
                   color: white; 
                   padding: 12px 24px; 
                   text-decoration: none; 
                   border-radius: 30px;
                   font-weight: 600;
                   display: inline-block;">
            Go to Dashboard
          </a>
        </div>

        <p style="font-size: 15px; color: #555;">
          If you have any questions or need assistance, our support team is here to help.
        </p>

        <p style="font-size: 15px; color: #555;">
          Cheers,<br>
          <b>The Your App Team</b>
        </p>
      </div>

      <div style="background: #f4f7fb; text-align: center; padding: 20px; font-size: 13px; color: #888;">
        <p>© ${new Date().getFullYear()} Your App. All rights reserved.</p>
      </div>
    </div>
  </div>
  `

  await sendMail({to: email, subject: "Welcome ", html})
}

export const register = async(req,res)=>{
  
  const {name,email,password}=req.body;
  if(!name || !email || !password){
    return res.json({success: false, message:'Missing details'})
  }

  try {

    const existingUser = await userModel.findOne({email})
    
    if(existingUser){
      return res.json({success: false, message: "User already exists"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({name, email, password:hashedPassword});
    await user.save();

    const token = jwt.sign({id: user._id},process.env.JWT_SECRET, { expiresIn: '7d'});

    res.cookie('token',token, {httpOnly:true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV ==='production' ? 'none': 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    await sendWelcome(email, name)
    return res.json({success:true});


  }catch(error){
    res.json({success:false,message:error.message})
  }
}



export const login = async(req,res)=>{
  const {email, password}= req.body;

  if(!email || !password){
    return res.json({success:false, message:'Email and password are required'})
  }

  try{

    const user = await userModel.findOne({email});

    if(!user){
      return res.json({success:false,message:'Invalid email'})
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
      return res.json({success:false, message:'Invalid message'
      })}
    
      const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn: '7d'})

      res.cookie('token',token,{
        httpOnly: true,
        secure:process.env.NODE_ENV ==='production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none':'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({success:true});
  }catch(error){
    return res.json({success:false, message:error.message});
  }
}



export const logout = async(req,res)=>{
  try{
   res.clearCookie('token',{
    httpOnly:true,
    secure:process.env.NODE_ENV ==='production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none':'strict',
   })

   return res.json({success:true, message:'Logged out'})
  }catch(error){
    return res.json({success:false, message: error.message});
  }
}




//Send verification OTP to the user's Email
export const sendVerifyOtp = async (req, res)=>{
  try{
    const userId = req.userId;
    const user = await userModel.findById(userId);
    if(user.isAccountVerified){
      return res.json({success:false, message:"Account already verifies"})
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now()+ 24 * 60 * 60 *1000

    await user.save();


   await sendMail({ to: user.email, subject: "Account verification OTP",
     html: `<p>Your OTP is <b>${otp}</b>. Verify your account using this code.</p>` });

    res.json({success:true,message:'Verification OTP sent on Email'});


  }catch(error){
    console.log("Error while sending otp :", error.message);
    
    res.json({success:false, message: 'deep'});
  }
}




export const verifyEmail = async(req,res)=>{
  const {otp}= req.body;
  const userId = req.userId;
  if(!userId || !otp){
    return res.json({success:false, message:'Missing details'});
  }
  try{
    const user = await userModel.findById(userId);

    if(!user){
      return res.json({success:false, message:'Not found'});
    }

    if(user.verifyOtp == '' || user.verifyOtp !== otp){
      return res.json({success:false, message:'Invalid OTP'});

    }

    if(user.verifyOtpExpireAt <Date.now()){
      return res.json({success:false,message:'OTP expired'});
    }

    user.isAccountVerified =true;
    user.verifyOtp ='';
    user.verifyOtpExpireAt=0;
    await user.save();
    return res.json({success:true, message:'Email verified'})
  }catch(error){
    return res.json({success:false,message:error.message});
  }
}



export const isAuthenticated = async(req,res)=>{
  try{
    return res.json({success:true});

  }catch(error){
    res.json({success:false, message:error.message});
  }
}



