# mern-auth
https://www.youtube.com/watch?v=7BTsepZ9xp8&amp;t=1542s
https://www.youtube.com/watch?v=7BTsepZ9xp8&t=1542s
https://www.youtube.com/watch?v=7BTsepZ9xp8


GreatStack	Complete MERN Authentication System With Password Reset, Email Verification, JWT auth	https://www.youtube.com/watch?v=7BTsepZ9xp8&t=1542s
Create some directories and files for backend	"server/server.js
server/.env
server/config/emailTemplate.js
server/config/mongodb.js
server/config/nodemailer.js
server/controllers/authController.js
server/controllers/userController.js
server/middleware/userAuth.js
server/models/userModel.js
server/routes/authRoutes.js
server/routes/userRoutes.js"	
run, "npm init" in terminal	npm init	
Add some line in server/package.json file	"  ""main"": ""server.js"",
  ""type"": ""module"",
  ""scripts"": {
    ""start"": ""node server.js"",
    ""server"": ""nodemon server.js""
  },"	
install packages	npm i express cors dotenv nodemon jsonwebtoken mongoose bcryptjs nodemailer cookie-parser	
import express, cors, dotenv/config, cookieParser and use express.json(), cookieParser(), cors() and add express(), process.env.PORT in server.js file	"import express from ""express"";
import cors from ""cors"";
import 'dotenv/config';
import cookieParser from ""cookie-parser"";

// import connectDB from ""./config/mongodb.js""; (will add later)
// import authRouter from ""./routes/authRoutes.js""; (will add later)
// import userRouter from ""./routes/userRoutes.js""; (will add later)

const app = express();
const port = process.env.PORT || 4000

// connectDB(); (will add later)

// const allowedOrigins = ['http://localhost:5173'] (will add later)

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
// app.use(cors({origin: allowedOrigins, credentials: true })); (will add later)

// API Endpoints
app.get('/', (req, res) => res.send(""API Working""));
// app.use('/api/auth', authRouter); (will add later)
// app.use('/api/user', userRouter); (will add later)


app.listen(port, () => console.log(`server started on PORT: ${port}`));"	
run the server and browse it "http://localhost:4000/"	"node server.js" or "npm start"	
Get a connection link with mongodb atlas and set network access 0.0.0.0/0 from that website. Then add mongodb atlas url in .env file	MONGODB_URI='mongodb+srv://haydenj951:Mymongodb1@cluster0.ao6k7.mongodb.net'	
import mongoose and create "connectDB" function in mongodb.js	"import mongoose from ""mongoose"";


const connectDB = async () => {

    mongoose.connection.on('connected', () => console.log(""Database Connected""));

    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
};

export default connectDB;"	
import and use connectDB() from mongodb.js in server.js	"import connectDB from ""./config/mongodb.js"";
connectDB();"	
Create a userModel in userModel.js and export it	"import mongoose, { mongo } from ""mongoose"";


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },

})


const userModel = mongoose.models.user || mongoose.model('user', userSchema);


export default userModel;"	
create an account in brevo.com for email	"Brevo: Login https://app.brevo.com
SMTP EMAIL: praptiiapu@gmail.com; SMTP Server: smtp-relay.brevo.com; Port: 587; Login: 8d7f24001@smtp-brevo.com; SMTP key value: sX65AfG2I3Np9ETh"	
add some register module related information in .env file	"JWT_SECRET='secret#text'
NODE_ENV='development'

SMTP_USER=""8d7f24001@smtp-brevo.com""
SMTP_PASS=""sX65AfG2I3Np9ETh""

SENDER_EMAIL=""praptiiapu@gmail.com"""	
import nodemailer and create transporter module in nodemailer.js	"import nodemailer from 'nodemailer'


// const nodemailer = require(""nodemailer"");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: ""smtp-relay.brevo.com"",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


export default transporter;
"	
import bcrypt, jwt, userModel, transporter and add register module in authController.js	"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';



export const register = async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to GreatStack',
            text: `Welcome to new website. your account has been created with email id: ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}"	
add login module in authController.js	"export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true });


    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}"	
add logout module in authController.js	"export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {

            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        })
        return res.json({ success: true, message: ""Logged Out"" });

    } catch (error) {
        return res.json({ success: false, message: error.message });

    }


}"	
set EMAIL_VERIFY_TEMPLATE and PASSWORD_RESET_TEMPLATE in emailTemplate.js	"export const EMAIL_VERIFY_TEMPLATE = `

<!DOCTYPE html>
<html xmlns=""http://www.w3.org/1999/xhtml"">

<head>
  <title>Email Verify</title>
  <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
  <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <link href=""https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"" rel=""stylesheet"" type=""text/css"">
  <style type=""text/css"">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" bgcolor=""#F6FAFB"">
    <tbody>
      <tr>
        <td valign=""top"" align=""center"">
          <table class=""container"" width=""600"" cellspacing=""0"" cellpadding=""0"" border=""0"">
            <tbody>
              <tr>
                <td class=""main-content"">
                  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"">
                    <tbody>
                      <tr>
                        <td style=""padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;"">
                          Verify your email
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          You are just one step away to verify your account for this email: <span style=""color: #4C83EE;"">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;"">
                          Use below OTP to verify your account.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 24px;"">
                          <p class=""button"" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          This OTP is valid for 24 hours.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`

export const PASSWORD_RESET_TEMPLATE = `

<!DOCTYPE html>
<html xmlns=""http://www.w3.org/1999/xhtml"">

<head>
  <title>Password Reset</title>
  <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
  <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <link href=""https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"" rel=""stylesheet"" type=""text/css"">
  <style type=""text/css"">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" bgcolor=""#F6FAFB"">
    <tbody>
      <tr>
        <td valign=""top"" align=""center"">
          <table class=""container"" width=""600"" cellspacing=""0"" cellpadding=""0"" border=""0"">
            <tbody>
              <tr>
                <td class=""main-content"">
                  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"">
                    <tbody>
                      <tr>
                        <td style=""padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;"">
                          Forgot your password?
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          We received a password reset request for your account: <span style=""color: #4C83EE;"">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;"">
                          Use the OTP below to reset the password.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 24px;"">
                          <p class=""button"" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          The password reset otp is only valid for the next 15 minutes.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`
"	
import email verify and password reset template in authController.js	import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplate.js';	
add sendVerifyOtp module in authController.js	"// Send Verification OTP to the User's Email
export const sendVerifyOtp = async (req, res) => {

    try {

        const { userId } = req.body;

        const user = await userModel.findById(userId);

        // Add this check:
        if (!user) {
            return res.json({ success: false, message: ""User not found."" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: ""Account already verified"" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;

        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            // text: `Your OTP is: ${otp}. Verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace(""{{otp}}"", otp).replace(""{{email}}"", user.email)
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: ""Verification OTP Sent on email"" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}"	
add verifyEmail module in authController.js	"// Check verify Email
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing details' });
    }

    try {

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Email verified successfully' })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}"	
add isAuthenticated module in authController.js	"// Check if user is authenticated
export const isAuthenticated = async (req, res) => {

    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}"	
add sendResetOtp module in authController.js	"// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' })
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your OTP for resetting your password is: ${otp}. Use this OTP to proceed with resetting your password.`,
            html: PASSWORD_RESET_TEMPLATE.replace(""{{otp}}"", otp).replace(""{{email}}"", user.email)
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP sent to your email' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }

}"	
add resetPassword module in authController.js	"// Reset User password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, and new password are required' });
    }

    try {

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.resetOtp === """" || user.resetOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully.' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}"	
add userAuth module in userAuth.js	"import jwt from ""jsonwebtoken"";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not Authorized. Login again' });
    }

    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            
            // Ensure req.body is an object. If it's undefined or null, initialize it.
            if (typeof req.body !== 'object' || req.body === null) {
                req.body = {};
            }

            req.body.userId = tokenDecode.id

        } else {
            return res.json({ success: false, message: 'Not Authorized. Login again' });
        }

        next();

    } catch (error) {
        console.error(""Error in userAuth middleware:"", error);
        res.json({ success: false, message: ""Authentication failed: "" + error.message });
    }

}

export default userAuth;
"	
add authRouter module in authRoutes.js	"import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);


export default authRouter;"	
import authRouter and use it in server.js	"import authRouter from ""./routes/authRoutes.js"";
app.use('/api/auth', authRouter);"	
Test everything using postman		
import userModel and add getUserData module in userController.js	"import userModel from ""../models/userModel.js"";


export const getUserData = async (req, res) => {
    try {

        const { userId } = req.body;

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            userData: {
                name: user.name,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


"	
import express, userAuth, getUserData and add userRouter module in userRoutes.js	"import express from 'express';
import userAuth from '../middleware/userAuth.js';
import { getUserData } from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);


export default userRouter;"	
import userRouter and use it in server.js	"import userRouter from ""./routes/userRoutes.js"";
app.use('/api/user', userRouter);"	
Create a directory "client" directory and run this command	npm create vit@latest	
	npm install	
install some modules	npm install axios react-router-dom react-toastify	
run react server and browse it "http://localhost:5173/"	npm run dev	
Create some directories and files	"client/.env
client/src/pages/Home.jsx
client/src/pages/Login.jsx
client/src/pages/ResetPassword.jsx
client/src/pages/EmailVerify.jsx
client/src/components/Header.jsx
client/src/components/Navbar.jsx
client/src/components/Sidebar.jsx
client/src/components/Footer.jsx
client/src/context/AppContext.jsx
client/src/assets/assets.js
client/src/assets/emailTemplates.js"	
add some assets files in src/assets/ and public/ directory. Public directory for logo, favicon and assets directory for all type of assets files		
Delete App.css		
clean App.jsx and type "rafce" using vs code ES7 extension. then add some text and test it in the browser	http://localhost:5173/	
Add some editable code in src/assets/assets.js and import all assets file and export it as a assets module.	"import arrow_icon from './arrow_icon.svg'
import lock_icon from './lock_icon.svg'
import logo from './logo.svg'
import mail_icon from './mail_icon.svg'
import person_icon from './person_icon.svg'
import hand_wave from './hand_wave.png'
import header_img from './header_img.png'

export const assets = {
    arrow_icon,
    lock_icon,
    logo,
    mail_icon,
    person_icon,
    hand_wave,
    header_img
}"	
edit client/index.html and bootstrap script there		
Edit client/src/index.css		
add basic code using "rafce" in all pages and components .jsx files		
To set React Routing, go to main.jsx, import BrowserRouter from react-router-dom and use BrowserRouter in code	"import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// import { AppContextProvider } from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {/* <AppContextProvider> */}
      <App />
    {/* </AppContextProvider> */}
  </BrowserRouter>,
)"	
go to App.jsx, import Routes, Route, ToastContainer, and all pages and use it in code with route url	"import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>
    </div>
  )
}

export default App"	
in Navbar.jsx, import and use assets, useNavigate, toast module to locate assets file. (pasted whole code of Navbar.jsx. some code will use later)	"import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Navbar = () => {

    const navigate = useNavigate()
    const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent)

    const sendVerificationOtp = async ()=>{
        try {
            axios.defaults.withCredentials = true;

            const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

            if(data.success){
                navigate('/email-verify')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const logout = async ()=>{
        try {

            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')

        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div>
            <div className=""container"">
                <img src={assets.logo} alt='' className='float-start' />

                {userData ?

                    <div className='float-end'>
                        <ul class=""nav nav-pills"">

                            <li class=""nav-item dropdown"">
                                <a class=""nav-link dropdown-toggle fs-1"" data-bs-toggle=""dropdown"" href=""#"">
                                    {userData.name[0].toUpperCase()}
                                </a>
                                <ul class=""dropdown-menu"">

                                    {!userData.isAccountVerified &&
                                        <li onClick={sendVerificationOtp}><a class=""dropdown-item"" href=""#"">Verify Email</a></li>
                                    }

                                    <li onClick={logout}><a class=""dropdown-item"" href=""#"">Logout</a></li>
                                </ul>
                            </li>

                        </ul>
                    </div>

                    : <button onClick={() => navigate('/login')} className='float-end'>Login <img src={assets.arrow_icon} alt="""" /></button>
                }


            </div>
        </div>
    )
}

export default Navbar"	
in Header.jsx, import and use assets, useNavigate module to locate assets file. (pasted whole code of Header.jsx. some code will use later)	"import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'

const Header = () => {

const navigate = useNavigate()
const {userData} = useContext(AppContent)

    return (
        <div>
            <div className=""container"">
                <img
                    src={assets.header_img}
                    className=""img-fluid d-block mx-auto""
                    alt=""Centered Image""
                    style={{ width: '100px', height: 'auto' }}
                />
                <p className='text-center fs-1'>Hey {userData ? userData.name : 'Developer'} ! <img src={assets.hand_wave} alt="""" /></p>
                <p className=""text-center fs-6"">Welcome to our App</p>
                <button onClick={()=>navigate('/login')} className='btn btn-primary d-block mx-auto fs-6'>Get Started</button>
            </div>
        </div>
    )
}

export default Header"	
Add Navbar.jsx and Header.jsx in Home.jsx	"import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div>
        <Navbar />
        <Header />
    </div>
  )
}

export default Home"	
In Login.jsx, import module and add code (pasted whole code of Login.jsx. some code will use later)	"import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'


const Login = () => {

    const navigate = useNavigate()

    const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent)

    const [state, setState] = useState('Sign Up')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            axios.defaults.withCredentials = true

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className='container'>
            <div className=""container"">
                <img onClick={() => navigate('/')} src={assets.logo} alt="""" className='' />
            </div>

            <div className=""mt-5 d-inline-block"">

                <div className=""border p-3 bg-light mt-4"" style={{ height: 'auto' }}>
                    <h2>{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
                    <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account'}</p>
                    <form onSubmit={onSubmit}>
                        {state === 'Sign Up' && (
                            <div className='container'>
                                <img src={assets.person_icon} alt="""" />
                                <input onChange={e => setName(e.target.value)} value={name} type=""text"" placeholder='Full Name' required />
                            </div>
                        )}

                        <div className='container'>
                            <img src={assets.mail_icon} alt="""" />
                            <input onChange={e => setEmail(e.target.value)} value={email} type=""email"" placeholder='sample@mail.com' required />
                        </div>
                        <div className='container'>
                            <img src={assets.lock_icon} alt="""" />
                            <input onChange={e => setPassword(e.target.value)} value={password} type=""password"" placeholder='password' required />
                        </div><br />


                        <p onClick={() => navigate('/reset-password')} className='link-primary link-opacity-75-hover'>Forgot password?</p><br />

                        <button className='btn bg-primary text-white'>{state}</button>

                    </form>

                    {state === 'Sign Up' ? (
                        <p>Already have an account?{' '}
                            <span onClick={() => setState('Login')} className='btn btn-link'>Login here</span>
                        </p>
                    ) : (
                        <p>Don't have an account?{' '}
                            <span onClick={() => setState('Sign Up')} className='btn btn-link'>Sign Up</span>
                        </p>
                    )}

                </div>
            </div>



        </div>
    )
}



export default Login"	
go to .env file and add VITE_BACKEND_URL	VITE_BACKEND_URL = 'http://localhost:4000'	
go to AppContext.jsx, import createContext from react. export AppContent and AppContextProvider function	"import axios from ""axios"";
import { createContext, useEffect, useState } from ""react"";
import { data } from ""react-router-dom"";

export const AppContent = createContext()

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth')
            if (data.success) {
                setIsLoggedin(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        getAuthState();
    }, [])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )

}

"	
Import and add AppContextProvider in main.jsx (already added or commented there)	"import { AppContextProvider } from './context/AppContext.jsx'
<AppContextProvider>
</AppContextProvider>"	
Import and add it in Login.jsx (already added. some data is not created yet in AppContext.jsx)	"import React, { useContext } from 'react'
 const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent)"	
declare onSubmitHandler function in Login.jsx (already added)	"    const onSubmit = async (e) => {
        try {
            e.preventDefault();

            axios.defaults.withCredentials = true

            if (state === 'Sign Up') {
                const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            } else {
                const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })

                if (data.success) {
                    setIsLoggedin(true)
                    getUserData()
                    navigate('/')
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }"	
use onSubmitHandler function in Login.jsx (already added)	<form onSubmit={onSubmit}>	
import and use axios in Login.jsx (already added)	"axios.defaults.withCredentials = true
import axios from 'axios'
const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })"	
import and add cors code in server/server.js (if it is not added, then add it. this code needs to add at the first time)	"import cors from ""cors"";
const allowedOrigins = ['http://localhost:5173']
app.use(cors({origin: allowedOrigins, credentials: true }));"	
add code in AppContext.jsx (already added)	"    const getUserData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data')
            data.success ? setUserData(data.userData) : toast.error(data.message)
        } catch (error) {
            toast.error(error.message)
        }
    }"	
import and add code in Header.jsx from AppContext.jsx and use it in Header.jsx (already added)	"import { AppContent } from '../context/AppContext'
const {userData} = useContext(AppContent)"	
create and use getAuthState function in AppContext.jsx		
Go to server/routes/authRoutes.js change post to get method (if already added, don't need to change it)	authRouter.get('/is-auth', userAuth, isAuthenticated);	
import and use AppContent in Navbar.jsx and use it in Navbar.jsx (already added)	"import { AppContent } from '../context/AppContext'
const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent)"	
add sendVerificationOtp function in Navbar.jsx (already added)	"    const sendVerificationOtp = async ()=>{
        try {
            axios.defaults.withCredentials = true;

            const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

            if(data.success){
                navigate('/email-verify')
                toast.success(data.message)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }"	
add logout function in Navbar.jsx and use it in Navbar.jsx (already added)	"    const logout = async ()=>{
        try {

            axios.defaults.withCredentials = true
            const { data } = await axios.post(backendUrl + '/api/auth/logout')
            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            navigate('/')

        } catch (error) {
            toast.error(error.message)
        }
    }"	
add whole code in EmailVerify.jsx (added whole code)	"import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { AppContent } from '../context/AppContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const EmailVerify = () => {

  axios.defaults.withCredentials = true;
  const { backendUrl, isLoggedin, userData, getUserData } = useContext(AppContent)

  const navigate = useNavigate()

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e => e.value)
      const otp = otpArray.join('')

      const { data } = await axios.post(backendUrl + '/api/auth/verify-account', { otp })

      if (data.success) {
        toast.success(data.message)
        getUserData()
        navigate('/')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

useEffect(() => {
  isLoggedin && userData && userData.isAccountVerified && navigate('/')
}, [isLoggedin, userData])

  return (
    <div className='container'>
      <div className=""container"">
        <img onClick={() => navigate('/')} src={assets.logo} alt="""" className='' />
      </div>
      <form onSubmit={onSubmitHandler} className='container pt-3 m-2'>
        <h1>Email Verify OTP</h1>
        <p>Enter the 6 digit code sent to your email id.</p>

        <div className='' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type=""text"" maxLength={1} key={index} required className=''
              ref={e => inputRefs.current[index] = e}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className='btn bg-primary'>Verify Email</button>

      </form>
    </div>
  )
}

export default EmailVerify"	
add whole code in ResetPassword.jsx (added whole code)	"import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {

  const {backendUrl} = useContext(AppContent)
  axios.defaults.withCredentials = true

  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const [isEmailSent, setisEmailSent] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSubmited, setisOtpSubmited] = useState('')

  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text')
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.post(backendUrl + '/api/auth/send-reset-otp', {email})
      data.success ? toast.success(data.message) : toast.error(data.message)
      data.success && setisEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''))
    setisOtpSubmited(true)
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      
const {data} = await axios.post(backendUrl + '/api/auth/reset-password', {email, otp, newPassword})
data.success ? toast.success(data.message) : toast.error(data.message)
data.success && navigate('/login')

    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className='container'>
      <div className=""container"">
        <img onClick={() => navigate('/')} src={assets.logo} alt="""" className='' />
      </div>

      {/* enter email id */}

      {!isEmailSent &&

        <form onSubmit={onSubmitEmail} className='container pt-3 m-2'>
          <h1>Reset Password</h1>
          <p>Enter your register email address</p>
          <div className='mt-2'>
            <img src={assets.mail_icon} alt="""" className='' />{'  '}
            <input type=""email"" placeholder='example@mail.com' className=''
              value={email} onChange={e => setEmail(e.target.value)} required
            />
          </div>

          <button className='btn bg-primary mt-2'>Submit</button>

        </form>

      }


      {/* OTP input form  */}

      {!isOtpSubmited && isEmailSent &&

        <form onSubmit={onSubmitOTP} className='container pt-3 m-2'>
          <h1>Reset Password OTP</h1>
          <p>Enter the 6 digit code sent to your email id.</p>

          <div className='' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type=""text"" maxLength={1} key={index} required className=''
                ref={e => inputRefs.current[index] = e}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button className='btn bg-primary'>Submit</button>

        </form>

      }

      {/* Enter new password */}

      {isOtpSubmited && isEmailSent &&

        <form onSubmit={onSubmitNewPassword} className='container pt-3 m-2'>
          <h1>New Password</h1>
          <p>Enter the new password below</p>
          <div className='mt-2'>
            <img src={assets.lock_icon} alt="""" className='' />{'  '}
            <input type=""password"" placeholder='password' className=''
              value={newPassword} onChange={e => setnewPassword(e.target.value)} required
            />
          </div>

          <button className='btn bg-primary mt-2'>Submit</button>

        </form>

      }

    </div>
  )
}

export default ResetPassword"	
add email template in server/config/emailTemplate.js	"export const EMAIL_VERIFY_TEMPLATE = `

<!DOCTYPE html>
<html xmlns=""http://www.w3.org/1999/xhtml"">

<head>
  <title>Email Verify</title>
  <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
  <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <link href=""https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"" rel=""stylesheet"" type=""text/css"">
  <style type=""text/css"">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" bgcolor=""#F6FAFB"">
    <tbody>
      <tr>
        <td valign=""top"" align=""center"">
          <table class=""container"" width=""600"" cellspacing=""0"" cellpadding=""0"" border=""0"">
            <tbody>
              <tr>
                <td class=""main-content"">
                  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"">
                    <tbody>
                      <tr>
                        <td style=""padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;"">
                          Verify your email
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          You are just one step away to verify your account for this email: <span style=""color: #4C83EE;"">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;"">
                          Use below OTP to verify your account.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 24px;"">
                          <p class=""button"" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          This OTP is valid for 24 hours.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`

export const PASSWORD_RESET_TEMPLATE = `

<!DOCTYPE html>
<html xmlns=""http://www.w3.org/1999/xhtml"">

<head>
  <title>Password Reset</title>
  <meta http-equiv=""X-UA-Compatible"" content=""IE=edge"">
  <meta http-equiv=""Content-Type"" content=""text/html; charset=UTF-8"">
  <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
  <link href=""https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap"" rel=""stylesheet"" type=""text/css"">
  <style type=""text/css"">
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #E5E5E5;
    }

    table, td {
      border-collapse: collapse;
    }

    .container {
      width: 100%;
      max-width: 500px;
      margin: 70px 0px;
      background-color: #ffffff;
    }

    .main-content {
      padding: 48px 30px 40px;
      color: #000000;
    }

    .button {
      width: 100%;
      background: #22D172;
      text-decoration: none;
      display: inline-block;
      padding: 10px 0;
      color: #fff;
      font-size: 14px;
      text-align: center;
      font-weight: bold;
      border-radius: 7px;
    }

    @media only screen and (max-width: 480px) {
      .container {
        width: 80% !important;
      }

      .button {
        width: 50% !important;
      }
    }
  </style>
</head>

<body>
  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" bgcolor=""#F6FAFB"">
    <tbody>
      <tr>
        <td valign=""top"" align=""center"">
          <table class=""container"" width=""600"" cellspacing=""0"" cellpadding=""0"" border=""0"">
            <tbody>
              <tr>
                <td class=""main-content"">
                  <table width=""100%"" cellspacing=""0"" cellpadding=""0"" border=""0"">
                    <tbody>
                      <tr>
                        <td style=""padding: 0 0 24px; font-size: 18px; line-height: 150%; font-weight: bold;"">
                          Forgot your password?
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          We received a password reset request for your account: <span style=""color: #4C83EE;"">{{email}}</span>.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 16px; font-size: 14px; line-height: 150%; font-weight: 700;"">
                          Use the OTP below to reset the password.
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 24px;"">
                          <p class=""button"" >{{otp}}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style=""padding: 0 0 10px; font-size: 14px; line-height: 150%;"">
                          The password reset otp is only valid for the next 15 minutes.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
</html>

`
"	
import and add email template in authController.js (already added before)	"import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplate.js';

// text: `Your OTP is: ${otp}. Verify your account using this OTP.`,
html: EMAIL_VERIFY_TEMPLATE.replace(""{{otp}}"", otp).replace(""{{email}}"", user.email)


// text: `Your OTP for resetting your password is: ${otp}. Use this OTP to proceed with resetting your password.`,
html: PASSWORD_RESET_TEMPLATE.replace(""{{otp}}"", otp).replace(""{{email}}"", user.email)"	



👉 React Complete tutorial for Beginners:  https://www.youtube.com/watch?v=gbAdFfSdtQ4
👉 30 Days React.js Learning Plan: https://topmate.io/greatstack/1514677
👉 Check Your Resume Score: https://10xresume.co/
👉 Download the assets: https://drive.google.com/file/d/1ZNYR...

Images Credit:
https://www.pexels.com/
https://unsplash.com/
https://www.freepik.com/


