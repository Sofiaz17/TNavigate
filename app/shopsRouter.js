const express = require('express');
const routerShop = express.Router();
const Shop = require('./models/shop'); // get our mongoose model

/** 
 * @swagger
 * components:
 *  schemas:
 *   Shop:
 *      type: object
 *      required:
 *          - name
 *          - address
 *          - category
 *      properties:
 *          name:
 *             type: string
 *             description: 'Name of the shop'
 *          address:
 *             type: string
 *             description: 'Complete address (street, house number, postal code, city, province) of the shop'
 *          category:
 *             type: string
 *             enum: ['supermercato', 'farmacia', 'abbigliamento', 'ferramenta','elettronica','ristorazione','alimentari','sport','cartoleria','ortofrutta','gelateria']
 *             description: 'Category of the shop'
 */

/**
* @swagger
* /shops:
*   get:
*       description: Get the list of shops with a certain name or belonging to a certain category.
*       summary: View shops according to request parameters
*   responses:
*       '200':
*           description: 'Collection of shops'
*           content:
*               application/json:
*                   schema:
*                       type: array
*                   items:
*                       $ref: '#/components/schemas/Shop'
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
            address: shop.address,
            coordinates: shop.coordinates
        };
    });
    res.status(200).json(shop);
});


 /**
 * @swagger
 * /shops/{id}:
 *   get:
 *     summary: Retrieve a single shop.
 *     description: Retrieve a single shop. Can be used to see information about the specific shop.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the shop to retrieve.
 *         schema:
 *          type: integer 
 *     responses:
 *      200:
 *          description: A single shop.
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Shop'
*/
routerShop.get('/:id', async (req, res) => {
    // https://mongoosejs.com/docs/api.html#model_Model.findById
    let shop = await Shop.findById(req.params.id);
    res.status(200).json({
        self: '/api/v1/shops/' + shop.id,
        name: shop.name,
        category: shop.category,
        address: shop.address,
        coordinates: shop.coordinates
    });
});

 /**
 * @swagger
 * /shops/{id}:
 *   delete:
 *     summary: Delete a single shop.
 *     description: Delete a single shop.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the shop to delete.
 *         schema:
 *          type: integer  
 *     responses:
 *         204:
 *              description: Remove a single shop.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Shop'
*/
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


/**
 * @swagger
 *  /shops:
 *      post:
 *          description: Create a new shop in the system.
 *          summary: Register a new shop
 *          requestBody:
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Shop'
 *          responses:
 *               '201':
 *                   description: 'Shop created. Link in the Location header'
 *                   headers:
 *                       'Location':
 *                          schema:
 *                              type: string
 *                          description: Link to the newly created shop.
 */       
routerShop.post('', async (req, res) => {

	let shop = new Shop({
        name: req.body.name,
        category: req.body.category,
        address: req.body.address,
        coordinates: req.body.coordinates,
        address: req.body.address,
        category: req.body.category
    });
    
	shop = await shop.save();
    
    let shopId = shop.id;

    console.log('Shop saved successfully');

    res.location("/api/v1/shops/" + shopId).status(201).send();
    //res.location("/api/v1/shops/categories" + shopCat).status(201).send();
});


module.exports = routerShop;