const mongoose = require('mongoose');
//const { useTransitionState } = require('vue');
const options = {discriminatorKey: 'type'};

const userSchema = new mongoose.Schema({
	name: String,
	surname: String,
	dateOfBirth: Date,
	userType: {
		type: String,
		enum: ['utente base', 'negoziante'],
		default: 'utente base'
	},
	email: String,
	password: String,
	auth: Boolean
}, options);

const User = mongoose.model('User', userSchema);
module.exports = User;


const negozianteSchema = User.discriminator('negoziante', new mongoose.Schema({
	shopName: String,
	shopType: {
		type: String,
		enum: ['supermercato', 
		'farmacia',
		'abbigliamento',
		'ferramenta',
		'elettronica',
		'ristorazione',
		'alimentari',
		'sport'],
		shopAddress: String
	}
}), options);

const Negoziante = mongoose.model('Negoziante', negozianteSchema);
module.exports = Negoziante;



