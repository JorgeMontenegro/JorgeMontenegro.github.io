let express = require('express');
let router = express.Router();
const policies = [{'name':'SOAT','value': 300000},{'name':'Seguro todo riesgo de vehículo','value': 900000}];

router.get('/', function(req, res){
	if(policies){
		res.setHeader('Content-Type', 'application/json');
	   	res.send(policies);
	}else{
		res.send('error');
	}
});

module.exports = router;