const express = require('express');
const routerCateg = express.Router();
const Shop = require('./models/shop'); // get our mongoose model


/**
* @swagger
* /shopCategories:
*   get:
*       description: Get the list of categories.
*       summary: View all the possible categories a shop can belong to (predefined values from enum in database)
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

 /**
 * @swagger
 * /shopCategories/{category}:
 *   get:
 *     description: Retrieve a single category.
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: Category name of the category to retrieve (unique because comes from enum)
 *         schema:
 *          type: string 
 *     responses:
 *      200:
 *          description: A single category.
 *          content:
 *              application/json:
 *                  schema:
 *                      type: String
 *      404:
 *         description: Category not found
*/

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
            res.status(404).json({ error: 'Not found' }).send();
            return;
        }
    });


module.exports = routerCateg;