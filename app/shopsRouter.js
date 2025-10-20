const express = require('express');
const routerShop = express.Router();
const Shop = require('./models/shop'); // get our mongoose model
const tokenChecker = require('./tokenChecker');

/**
 * Middleware to validate shop ownership
 */
const validateShopOwnership = async (req, res, next) => {
    try {
        const shop = await Shop.findById(req.params.id);
        
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        
        if (shop.owner !== req.loggedUser.email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        req.shop = shop;
        next();
    } catch (error) {
        console.error('Shop ownership validation error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Middleware to set owner from token
 */
const setOwnerFromToken = (req, res, next) => {
    if (req.loggedUser && req.loggedUser.email) {
        req.body.owner = req.loggedUser.email;
    }
    next();
};

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
*       description: If name or category are specified, get the list of all shops with a certain name or belonging to a certain category. Otherwise, get all shops
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
*       '404':
            description: 'No shop found'
 */
routerShop.get('', async (req, res) => {
    let shop;
    console.log("req query category: " + req.query.category);
    console.log("req query name : " + req.query.name);
    console.log("req query owner : " + req.query.owner);

    // Handle owner-based querying for shop owners
    if (req.query.owner) {
        shop = await Shop.find({ owner: req.query.owner }).exec();
    } else if (req.query.category) {
        console.log('router, cat');
        shop = await Shop.find({category: req.query.category}).exec();
    } else if (req.query.name) {
        console.log('router, name');
        shop = await Shop.find({name: req.query.name}).exec();
    } else {
        // https://mongoosejs.com/docs/api.html#model_Model.find
        shop = await Shop.find({}).exec();
    }
    // console.log('SHOP' + shop.forEach((shop) => {
    //     console.log(shop.name + ' :'); 
    //     shop.opening_hours.forEach((day1) => {
     
    //         //console.log(`${'D',day1.day}: ${'P',day1.periods.forEach(per => console.log('S',per.startHours) )}`);
    //         console.log('D:'+ day1.day +': '+ 'P:'+ day1.periods.forEach(per => per.startHours) )});
    //             //console.log(`${day1.day}: ${day1.periods[i].startHours}:${day1.periods[i].startMinutes} - ${day1.periods[i].endHours}:${day1.periods[i].endMinutes}`); 
            
    //   }));
    if(shop.length === 0){
        console.log('Nessun risultato trovato!');
        res.status(404).json({ message: 'No shops found' });
        return;
    }
      console.log('SHOP' +
      shop.forEach((shop) =>{
        console.log('\n' + shop.name +' :');
        shop.opening_hours.forEach((day1) => {
            console.log(`Day: ${day1.day}`);
            day1.periods.forEach(period => {
              console.log(`Start Hours: ${period.startHours}`);
            });
      })
      
      }));
     //console.log('SHOP' + shop.opening_hours[0].day);

   

    shop = shop.map( (shop) => {
        return {
            self: '/api/v1/shops/' + shop.id,
            name: shop.name,
            category: shop.category,
            address: shop.address,
            coordinates: shop.coordinates,
            opening_hours: shop.opening_hours,
            state: shop.state,
            owner: shop.owner
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
 *          200:
 *              description: A single shop.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Shop'
 *          404:
 *              description: Shop not found
*/
routerShop.get('/:id', async (req, res) => {
    try {
        let shop = await Shop.findById(req.params.id);
        if(!shop){
            res.status(404).json({ message: 'Shop not found' });
            console.log('shop not found!');
            return;
        }
        
        res.status(200).json({
            self: '/api/v1/shops/' + shop.id,
            name: shop.name,
            category: shop.category,
            address: shop.address,
            coordinates: shop.coordinates,
            opening_hours: shop.opening_hours,
            state: shop.state,
            owner: shop.owner
        });
    } catch (error) {
        console.error('Get shop error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

/**
 * @swagger
 *  /shops/{id}:
 *      patch:
 *          description: Updates coordinates of a shop.
 *          requestBody:
 *               content:
 *                   application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Shop'
 *          responses:
 *               '200':
 *                   description: 'Coordinates updated successfully'
 *               '404':
 *                   description: 'Shop not found'
 */ 
routerShop.patch('/:id', tokenChecker, validateShopOwnership, async (req, res) =>{
    try {
        console.log('in patch');
        console.log('REQ.BODY.COORD: '+ req.body.coordinates[0] + ' '+ req.body.coordinates[1]);

        // Update the shop (ownership already validated by middleware)
        let updatedShop = await Shop.findByIdAndUpdate(req.params.id, {
            coordinates: req.body.coordinates
        }, { new: true }).exec();

        console.log('shop modified');
        res.status(200).json({
            self: '/api/v1/shops/' + updatedShop.id,
            name: updatedShop.name,
            category: updatedShop.category,
            address: updatedShop.address,
            coordinates: updatedShop.coordinates,
            opening_hours: updatedShop.opening_hours,
            state: updatedShop.state,
            owner: updatedShop.owner
        });
    } catch (error) {
        console.error('Update shop error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
})

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
 *         '204':
 *              description: Remove a single shop.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Shop'
 *         '404':
 *              description: Shop not found
*/
routerShop.delete('/:id', tokenChecker, validateShopOwnership, async (req, res) => {
    try {
        console.log('in delete');
        
        // Delete the shop (ownership already validated by middleware)
        await req.shop.deleteOne();
        console.log('shop removed');
        res.status(200).json({
            message: 'Shop deleted successfully'
        });
    } catch (error) {
        console.error('Delete shop error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
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
 *                   description: 'Shop created'
 */       
routerShop.post('', tokenChecker, setOwnerFromToken, async (req, res) => {
    try {
        // Only shop_owner users can create shops
        if (req.loggedUser.userType !== 'shop_owner') {
            return res.status(403).json({
                message: 'Only shop owners can create shops'
            });
        }

        let shop = new Shop({
            name: req.body.name,
            category: req.body.category,
            address: req.body.address,
            coordinates: req.body.coordinates,
            opening_hours: req.body.opening_hours,
            state: req.body.state,
            owner: req.body.owner
        });
        
        shop = await shop.save();
        
        let shopId = shop.id;

        console.log('Shop saved successfully');

        res.status(201).json({
            self: '/api/v1/shops/' + shopId,
            name: shop.name,
            category: shop.category,
            address: shop.address,
            coordinates: shop.coordinates,
            opening_hours: shop.opening_hours,
            state: shop.state,
            owner: shop.owner
        });
    } catch (error) {
        console.error('Create shop error:', error);
        
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error'
            });
        }

        res.status(500).json({
            message: 'Internal server error'
        });
    }
});


module.exports = routerShop;