const express = require('express');
const router = express.Router();
const Shop = require('./models/shop');



// Relationships with apis
router.get('', async (req, res) => {
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

    res.location("/api/v1/shops/" + shopId).status(201).send();
});


module.exports = router;