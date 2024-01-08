// const jwt = require('jsonwebtoken');
// const secretToken = process.env.SECRET_TOKEN;

// const verifyToken = (req, res, next) => {
//     const token = req.headers.authorization;
  
//     if (!token) {
//       return res.status(401).json({ error: 'Unauthorized: No token provided' });
//     }
  
//     jwt.verify(token, secretToken, (err, decoded) => {
//       if (err) {
//         return res.status(403).json({ error: 'Unauthorized: Invalid token' });
//       }
  
//       req.user = decoded;
//       next();
//     });
//   };
  
// module.exports = verifyToken;
const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).send('Unauthorized: Missing or invalid authorization header');
        }

        const token = authHeader.split(' ')[1];
        const verify = jwt.verify(token, process.env.SECRET_TOKEN);
        if (verify) {
            req.user = verify;

            // Check user role
            if (verify.role !== 'ADMIN') {
                console.log('Not authorized');
                return res.status(403).send('Forbidden');
            }

            next(); // Proceed to the next middleware or route handler
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).send('Invalid token');
        } else {
            console.log(error);
            res.status(500).send('Internal server error!');
        }
    }
};


module.exports = verifyToken;
