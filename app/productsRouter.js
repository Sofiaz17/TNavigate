const express = require('express');
const routerProduct = express.Router();
const Product = require('./models/product'); // get our mongoose model

routerProduct.get('', async (req, res) => {
    let product;

    if(req.query.name){
        product = await Product.find({name: req.query.name}).exec();
    } else {
        product = await Product.find().exec();
    }
    
    product = product.map( (product) => {
        return {
            self: '/api/v1/products/' + product.id,
            name: product.name,
            category: product.category
        };
    });
    res.status(200).json(product);
});

routerProduct.get('/:id', async (req, res) => {
    let product = await Product.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/products/' + product.id,
        name: encodeURI(product.name),
        category: product.category
    });
});

routerProduct.delete('/:id', async (req, res) => {
    let product = await Product.findById(req.params.id).exec();
    if (!product) {
        res.status(404).send()
        console.log('product not found')
        return;
    }
    await product.deleteOne()
    console.log('product removed')
    res.status(204).send()
});

routerProduct.post('', async (req, res) => {

	let product = new Product({
        name: req.body.name,
        category: req.body.category,
        keywords: req.body.keywords
    });
    
	product = await product.save();
    
    let prodId = product.id;
    let prodCat = product.category;

    console.log('product saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/products/" + prodId).status(201).send();
    //res.location("/api/v1/shops/categories" + shopCat).status(201).send();
});
module.exports = routerProduct;