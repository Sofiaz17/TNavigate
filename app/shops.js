const express = require('express');
const router = express.Router();
//const Book = require('./models/book'); // get our mongoose model
const Shop = require('./models/shop');



/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
router.get('', async (req, res) => {
     // https://mongoosejs.com/docs/api.html#model_Model.find
    let shops = await Shop.find({});
    shops = shops.map( (shop) => {
        return {
            self: '/api/v1/shops/' + shop.id,
            name: shop.name
        };
    });
    res.status(200).json(shops);
});

router.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let shop = await Shop.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/shops/' + shop.id,
        name: shop.name
    });
});

router.delete('/:id', async (req, res) => {
    let shop = await Shop.findById(req.params.id).exec();
    if (!shop) {
        res.status(404).send()
        console.log('shop not found')
        return;
    }
    await shop.deleteOne()
    console.log('shop removed')
    res.status(204).send()
});

router.post('', async (req, res) => {

	let shop = new Shop({
        name: req.body.name
    });
    
	shop = await shop.save();
    
    let shopId = shop.id;

    console.log('Shop saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/shops/" + shopId).status(201).send();
});


module.exports = router;