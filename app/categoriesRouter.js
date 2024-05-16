// const categories = require('express').Router();
// const Shop = require('./models/shop'); // get our mongoose model


// The root router for requests to our tracks path
// categories.get('/', async function(req, res, next) {
//   let categ = await Shop.schema.path('category').enumValues;
//   categ = categ.map( (categ) => {
//     return {
//         self: '/api/v1/shops/categories' + categ,
//         name: categ
//     };
//   });
// res.status(200).json(categ);
//   // retrieve album's track data and render track list page
// });

// The route for handling a request to a specific track
// categories.get('/:categName', async function(req, res, next) {
//   let categId = req.params.categId;
//   res.status(200).json({
//       self: '/api/v1/shops/categories' + categId,
//       name: shop.name,
//       category: shop.category
//   });

//   // retrieve individual track data and render on single track page
// });

//...

//module.exports = categories;


const express = require('express');
const routerCateg = express.Router();
const Shop = require('./models/shop'); // get our mongoose model


/**
* @swagger
* /shopCategories:
*   get:
*       description: Get the list of categories with a certain name.
*       summary: View categories according to request parameters
*   responses:
*       '200':
*           description: 'Collection of categories'
*           content:
*               application/json:
*                   schema:
*                       type: array
*                   items:
*                       name:
*                           type: string
*                           description: 'Name of the category'
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

module.exports = routerCateg;