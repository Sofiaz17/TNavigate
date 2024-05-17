const express = require('express');
const router = express.Router();
const UtenteBase = require('./models/utenteBase'); 

/** 
 * @swagger
 * components:
 *  schemas:
 *   UtenteBase:
 *      type: object
 *      required:
 *          - username
 *          - email
 *          - password
 *      properties:
 *          username:
 *             type: string
 *             description: 'Name of the user'
 *          email:
 *             type: string
 *             description: 'Email of the user'
 *          password:
 *             type: string  
 *             description: 'Password of the user'
 */

/**
* @swagger
* /utentiBase/me:
*   get:
*       description: Directory for authenticated user
*       summary: Access user's private area
*       responses:
*           '200':
*               description: 'User data'
*       content:
*           application/json:
*               schema:
*                   type: array
*                   items:
*                       $ref: '#/components/schemas/UtenteBase'
 */
router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    let utenteBase = await UtenteBase.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: '/api/v1/utentiBase/' + utenteBase.id,
        email: utenteBase.email
    });
});

/**
* @swagger
* /utentiBase:
*   get:
*       description: Get the list of base users.
*       summary: View users according to request parameters
*   responses:
*       '200':
*           description: 'Collection of users'
*           content:
*               application/json:
*                   schema:
*                       type: array
*                   items:
*                       $ref: '#/components/schemas/UtenteBase'
 */
router.get('', async (req, res) => {
    let utentiBase;

    if (req.query.email)
        { utentiBase = await UtenteBase.find({email: req.query.email}).exec();}
    else
        { utentiBase = await UtenteBase.find().exec();}

    utentiBase = utentiBase.map( (entry) => {
        return {
            self: '/api/v1/utentiBase/' + entry.id,
            email: entry.email
        }
    });

    res.status(200).json(utentiBase);
});

/**
 * @swagger
 *  /utentiBase:
 *      post:
 *          description: Create a new user in the system.
 *          summary: Register a new user
 *          requestBody:
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/UtenteBase'
 *          responses:
 *               '201':
 *                   description: 'User created. Link in the Location header'
 *                   headers:
 *                       'Location':
 *                          schema:
 *                              type: string
 *                          description: Link to the newly created user.
 */ 
router.post('', async (req, res) => {
    
	let utenteBase = new UtenteBase({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    // Check if email has been inserted correctly and in a valid format
    if (!utenteBase.email || typeof utenteBase.email != 'string' || !checkIfEmailInString(utenteBase.email)) {
        res.status(400).json({ error: 'Il campo email non è stato inserito correttamente, verifica che il formato sia corretto!' });
        return;
    }
    
	utenteBase = await utenteBase.save();
    
    let utenteBaseId = utenteBase.id;

    res.location("/api/v1/utentiBase/" + utenteBaseId).status(201).send();
});



// Email address validation
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}



module.exports = router;