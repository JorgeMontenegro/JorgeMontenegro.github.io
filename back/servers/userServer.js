var userModel = require('../models/users.js');

class userServices {
	constructor(){}
	
	create(user, callback){
		var newUser = new userModel({
			document: user.document,
			name: user.name,
			type_policy: user.type_policy,
			policy_number: user.policy_number,
			policy_value: user.policy_value,
		});
		newUser.save(callback);
	}
	
	get(callback){
		userModel.find({}, callback);
	}
    
    getQuery(query, callback){
        userModel.find(query, callback);
    }
}

module.exports = new userServices();