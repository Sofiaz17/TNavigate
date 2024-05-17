const express = require('express');
const router = express.Router();
const Student = require('./models/utenteBase'); 



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