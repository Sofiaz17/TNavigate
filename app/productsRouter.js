const express = require('express');
const routerProduct = express.Router();
const Product = require('./models/product'); // get our mongoose model

/** 
 * @swagger
 * components:
 *  schemas:
 *   Product:
 *      type: object
 *      required:
 *          - name
 *          - category
 *          - keywords
 *      properties:
 *          name:
 *             type: string
 *             description: 'Name of the product'
 *          category:
 *             type: string
 *             enum: ['supermercato', 'farmacia', 'abbigliamento', 'ferramenta','elettronica','ristorazione','alimentari','sport','cartoleria','ortofrutta','gelateria']
 *             description: 'Category of the product'
 *          keywords:
 *             type: [string]
 *             description: 'Keywords to search the product'
 */


/**
 * @swagger
 * /products:
 *   get:
 *     description: Get the list of products with a certain name or get all products if name not specified in query
 *     summary: View products according to request parameters
 *     responses:
 *       '200':
 *         description: Collection of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: No product found
 */

routerProduct.get('', async (req, res) => {
    let product;

    
    if(req.query.name=='') {
        console.log('Specificare un parametro valido');
        res.status(400).json({ error: 'Inserire un parametro di ricerca valido' });
        return;
    } else if(req.query.name){
        product = await Product.find({name: req.query.name}).exec();
    } else if(req.query.category){
        product = await Product.find({category: req.query.category}).exec();
    } else {
        product = await Product.find({}).exec();
    }
    
    if(product.length === 0){
        console.log('Nessun risultato trovato!');
        res.status(404).json({ error: 'Not found' }).send();
        return;
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


 /**
 * @swagger
 * /products/{id}:
 *   get:
 *     description: Retrieve a single product.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the product to retrieve.
 *         schema:
 *          type: integer 
 *     responses:
 *      200:
 *          description: A single product.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Product'
 *      404:
 *         description: Product not found
*/

routerProduct.use('/:id', async(req, res, next) =>{
    let product = await Product.findById(req.params.id);
    if(!product){
        res.status(404).send();
        console.log('product not found!');
        return;
    }
    req.product = product;
    next();
});
routerProduct.get('/:id', async (req, res) => {
    res.status(200).json({
        self: '/api/v1/products/' + req.product.id,
        name: encodeURI(req.product.name),
        category: req.product.category
    });
});


/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a single product.
 *     description: Deletes a single product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to delete.
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Product deleted successfully.
 *       '404':
 *         description: Product not found.
 */
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

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product.
 *     description: Creates a new product.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '201':
 *         description: Product created successfully.
 *       '400':
 *         description: Bad request, validation error.
 */
routerProduct.post('', async (req, res) => {

	let product = new Product({
        name: req.body.name,
        category: req.body.category,
        keywords: req.body.keywords
    });
   
	product = await product.save();
   
    let prodId = product.id;

    console.log('product saved successfully');

    /**
     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/products/" + prodId).status(201).send();
    //res.location("/api/v1/shops/categories" + shopCat).status(201).send();
});
module.exports = routerProduct;