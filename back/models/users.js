let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let users = new Schema({
	document: {type: Number, required: true},
	name:{type: String, required: true},
    type_policy: {type: String, required: true},
	policy_number: {type: Number, required: true},
	policy_value: {type: Number, required: true}
});

module.exports = mongoose.model('users', users);