# mern-auth
https://www.youtube.com/watch?v=7BTsepZ9xp8&amp;t=1542s
https://www.youtube.com/watch?v=7BTsepZ9xp8&t=1542s
https://www.youtube.com/watch?v=7BTsepZ9xp8


install modules: npm i 

2. 25:40 to 1:13:40 register login logout
3. 1:13:40 to 1:27:20 register email

Brevo: Login https://app.brevo.com
SMTP EMAIL: praptiiapu@gmail.com; SMTP Server: smtp-relay.brevo.com; Port: 587; Login: 8d7f24001@smtp-brevo.com; SMTP key value: sX65AfG2I3Np9ETh

4. 1:27:20 to 1:55:00 verify email
userModel.js e number 10 line was duplicate
server.js e line 13 is duplicate
* added this code in userAuth.js before [req.body.userId = token.Decode.id;]
[if (typeof req.body !== 'object' || req.body === null){req.body = {};}]

* Improve sendVerifyOtp controller (minor logical bug): if (user.isAccountVerified)

5. 1:55:00 to 1:58:17 is authenticated or not

6. 1:58:17 to 2:15:36 reset password

7. 2:15:36 to 2:24:50 get user data

8. 2:25:00 to 3:48:00 frontend login (solved previous issues)
npm create vit@latest
npm install
npm install axios react-router-dom react-toastify 
npm run dev
clean App.css
clean App.jsx and type "rafce" then add some text and test it. (before typing "rafce", check vs code ES7 extension)
add some assets files in src/assets/ and public/ directory. create an assets.js file there where import all assets file and export it as a assets module.
clean index.css and open and edit index.html
create 3 directories src/pages/, src/components/ src/context
add some files: pages/Home.jsx, pages/Login.jsx, pages/EmailVerify.jsx, pages/ResetPassword.jsx, components/Header.jsx, components/Navbar.jsx, context/AppContext.jsx, client/.env
Set React Routing: go to main.jsx, import BrowserRouter from react-router-dom, use BrowserRouter in code. go to App.jsx, import Routes and Route from react-router-dom and use it in code. add routing and pages there. add (/, /logn, /email-verify, /reset-password)
in Navbar.jsx, import and use assets module to locate assets file.
import useNavigate from react-router-dom and use useNavigate() in Navbar.jsx
import useState from react and use useState hook in Login.jsx
go to AppContext.jsx, import createContext from react. export AppContent and AppContextProvider function. then go to .env file and add VITE_BACKEND_URL and use it in AppContextProvider. then use information in Login.jsx. then use AppContextProvider in main.jsx. add onSubmit property on Login.jsx. 
import and add toastify in App.jsx and Login.jsx
add cors information in server/server.js
go to Header.jsx and use useContext(AppContent)
add getAuthState function in AppContext.jsx
go to server/routes/authRoutes.jsx and change /is-auth post to get
go to Navbar.jsx and add something


4:29:10 until pasting otp
4:39:23 email verification
5:18:18 complete mern-auth backend and client project 
create server/config/emailTemplate.js file.



add frontend url for backend login using cors







👉 React Complete tutorial for Beginners:  https://www.youtube.com/watch?v=gbAdFfSdtQ4
👉 30 Days React.js Learning Plan: https://topmate.io/greatstack/1514677
👉 Check Your Resume Score: https://10xresume.co/
👉 Download the assets: https://drive.google.com/file/d/1ZNYR...

Images Credit:
https://www.pexels.com/
https://unsplash.com/
https://www.freepik.com/


