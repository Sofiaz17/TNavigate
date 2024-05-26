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

   

   

// routerCateg.get('/:category', async (req, res) => {
//     let shops = await Shop.find({category : req.params.category});
//     console.log('req.params.category: ' + req.params.category);
//     console.log('router shops: ' + shops);
//     console.log('router categ: ' + shops[0].category);
//     res.status(200).json({
//         self: '/api/v1/shopCategories/' + shops[0].category,
//         name: shops[0].category
//     });
// });

module.exports = routerCateg;