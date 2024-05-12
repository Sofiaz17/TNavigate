const express = require('express');
const routerShop = express.Router();
const Shop = require('./models/shop'); // get our mongoose model

var itemrouterShop = express.Router({mergeParams: true});

/**
 * Resource representation based on the following the pattern: 
 * https://cloud.google.com/blog/products/application-development/api-design-why-you-should-use-links-not-keys-to-represent-relationships-in-apis
 */
routerShop.get('', async (req, res) => {
    let shop;
    console.log("req query category: " + req.query.category);
    if(req.query.category){
        console.log('router, cat');
        shop = await Shop.find({category: req.query.category}).exec();
    } else if(req.query.name){
        console.log('router, name');
        shop = await Shop.find({name: req.query.name}).exec();
    } else{
    // https://mongoosejs.com/docs/api.html#model_Model.find
        shop = await Shop.find({}).exec();
    }
    shop = shop.map( (shop) => {
        return {
            self: '/api/v1/shops/' + shop.id,
            name: shop.name,
            category: shop.category,
            address: shop.address
        };
    });
    res.status(200).json(shop);
});

routerShop.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let shop = await Shop.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/shops/' + shop.id,
        name: shop.name,
        category: shop.category
    });
});
// routerShop.get('/categories', async (req, res) => {
//     // https://mongoosejs.com/docs/api.html#model_Model.findById
//     let shop = await Shop.findById(req.params.id);
//     res.status(200).json({
//         self: '/api/v1/shops/' + shop.id,
//         name: shop.name,
//         category: shop.category
//     });
// });
// Define an endpoint to get enum values


routerShop.delete('/:id', async (req, res) => {
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

routerShop.post('', async (req, res) => {

	let shop = new Shop({
        address: req.body.address,
        category: req.body.category
    });
    
	shop = await shop.save();
    
    let shopId = shop.id;
    let shopCat = shop.cat;

    console.log('Shop saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/shops/" + shopId).status(201).send();
    //res.location("/api/v1/shops/categories" + shopCat).status(201).send();
});


module.exports = routerShop;