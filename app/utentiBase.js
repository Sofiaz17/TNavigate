const express = require('express');
const router = express.Router();
const Student = require('./models/utenteBase'); // get our mongoose model



router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let utenteBase = await UtenteBase.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: '/api/v1/utentiBase/' + utenteBase.id,
        email: utenteBase.email
    });
});

router.get('', async (req, res) => {
    let utentiBase;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        utentiBase = await UtenteBase.find({email: req.query.email}).exec();
    else
        utentiBase = await UtenteBase.find().exec();

    utentiBase = utentiBase.map( (entry) => {
        return {
            self: '/api/v1/utentiBase/' + entry.id,
            email: entry.email
        }
    });

    res.status(200).json(utentiBase);
});

router.post('', async (req, res) => {
    
	let utenteBase = new UtenteBase({
        email: req.body.email,
        password: req.body.password
    });

    if (!utenteBase.email || typeof utenteBase.email != 'string' || !checkIfEmailInString(utenteBase.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    
	utenteBase = await utenteBase.save();
    
    let utenteBaseId = utenteBase.id;

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/utentiBase/" + utenteBaseId).status(201).send();
});



// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}



module.exports = router;