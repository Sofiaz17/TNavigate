const express = require('express');
const routerCateg = express.Router();
const Shop = require('./models/shop'); // get our mongoose model


/**
* @swagger
* /shopCategories:
*   get:
*       description: Get the list of categories.
*       summary: View all the possible categories a shop can belong to
*   responses:
*       '200':
*           description: 'Enum of categories'
*           content:
*               application/json:
*                   schema:
*                       type: array
*                   items:
*                       type: string
 */
routerCateg.get('', async (req, res) => {
    let categ = await Shop.schema.path('category').enumValues;
    categ = categ.map( (categ) => {
        return {
            self: '/api/v1/shopCategories/' + categ,
            name: categ
        };
    });
    res.status(200).json(categ);
});

routerCateg.get('/:category', async (req, res) => {
    let categ = await Shop.schema.path('category').enumValues;
   // categ = categ.map( (categ) => {
        if(categ.includes(req.params.category)){
            res.status(200).json({
                self: '/api/v1/shopCategories/' + req.params.category,
                name: req.params.category
            });
        }  else {
            console.log('Categoria non trovata');
        }
    });


module.exports = routerCateg;