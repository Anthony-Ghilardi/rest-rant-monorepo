const router = require('express').Router()
const db = require("../models")
const bcrypt = require('bcrypt')
const jwt = require('json-web-token')

const { User } = db

router.post('/', async (req, res) => {
    
    let user = await User.findOne({
        where: { email: req.body.email }
    })

    if (!user || !await bcrypt.compare(req.body.password, user.passwordDigest)) {
        res.status(404).json({ 
            message: `Could not find a user with the provided username and password` 
        })
    } else {
        const result = await jwt.encode(process.env.JWT_SECRET, { id: user.userid })
        res.json({ user: user, token: result.value })
    }
})

router.get('/profile', async (req, res) => {
    try {
        const [authenticationMethod, token] = req.headers.authorization.split(' ')

        if (authenticationMethod == 'Bearer') {
            const result = await jwt.decode(process.env.JWT_SECRET, token)
            const { id } = result.value
            let user = await User.findOne({
                where: {
                    userId: id
                }
            })
            res.json(user)
        }
    } catch {
        res.json(null)
    }
})

// router.get('/profile', async (req, res) => {
//     try {
//         const authHeader = req.headers.authorization;
//         if (!authHeader) {
//             console.log('No Authorization header found');
//             return res.status(401).json({ message: 'No Authorization header provided' });
//         }

//         const [authenticationMethod, token] = authHeader.split(' ');

//         if (authenticationMethod !== 'Bearer') {
//             console.log('Invalid authentication method:', authenticationMethod);
//             return res.status(401).json({ message: 'Invalid authentication method' });
//         }

//         const result = await jwt.decode(process.env.JWT_SECRET, token);
        
//         if (!result.value) {
//             console.log('Failed to decode token');
//             return res.status(401).json({ message: 'Failed to decode token' });
//         }

//         const { id } = result.value;
//         let user = await User.findOne({
//             where: {
//                 userId: id
//             }
//         });

//         if (user) {
//             res.json(user);
//         } else {
//             console.log('User not found for ID:', id);
//             res.status(401).json({ message: 'User not found' });
//         }
//     } catch (error) {
//         console.error("Error decoding token or fetching user:", error);
//         res.status(401).json({ message: 'Failed to authenticate user' });
//     }
// });



module.exports = router