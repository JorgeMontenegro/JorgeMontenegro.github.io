var userServices = require('../servers/userServer.js');

let express = require('express');
let router = express.Router();

router.get('/', function(req, res){
	userServices.get(function(err, doc){
		if(err){
		   	res.send('error');
		}else{
            res.setHeader('Content-Type', 'application/json');
			res.send(doc);
		}
	});
});

router.post('/', function(req, res){
	userServices.create(req.body, function(err, doc){
		if(err){
		   	res.send('error');
		}else{
            res.setHeader('Content-Type', 'application/json');
		   	res.send(doc);
		}
	});
});

router.post('/filter', function(req, res){
    userServices.getQuery(req.body, function(err, doc){
        if(!err){
            res.setHeader('Content-Type', 'application/json');
            res.send(doc);
        }else{
            res.send(err);
        }
    });
});

module.exports = router;