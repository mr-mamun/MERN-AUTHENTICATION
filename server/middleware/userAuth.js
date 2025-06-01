import jwt from "jsonwebtoken";

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
        console.error("Error in userAuth middleware:", error);
        res.json({ success: false, message: "Authentication failed: " + error.message });
    }

}

export default userAuth;

