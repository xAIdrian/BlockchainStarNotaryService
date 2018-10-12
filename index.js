const express = require('express')
const app = express()
var bodyParser = require('body-parser');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const levelDatabase = require('./levelDatabase.js')
const Blockchain = require('./simpleChain.js')

const Block = require('./block.js')
const ValidationResponse = require('./validationResponse.js')

//middle-ware to be run before get/post methods
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//start listening on specific port
app.listen(8000, () => {
	let chain = new Blockchain()
	console.log('App listening on port 8000!')
})

//GET
app.get('/', (req, res) => res.send('root'))

app.get('/block', (req, res) => res.send('root/block'))

//using leveldb we print the block at the specified height to the browser
app.get('/block/:blockHeight', (req, res) => {
	let params = req.params;

	levelDatabase.getBlock(params.blockHeight).then(function(result) {
		var block = JSON.parse(result)
		res.send(JSON.stringify(block))
	}, function(error) {
		res.send('error : getting block at height ' + req.params.blockHeight)
	})
})

//POST
app.post('/',(req, res) => {
	res.send('root post')
})

app.post('/block', (req, res) => {

	var bodyData = req.body.body;
	let chain = new Blockchain();

	if (bodyData !== undefined && bodyData !== null && bodyData != "") {

		let newBlock = new Block(bodyData);
		chain.addBlockResponse(newBlock).then(function(result) {
			var block = JSON.parse(result)
			res.send(JSON.stringify(block))
		}, function(error) {
			res.send('addBlockResponse error')
		})

	} else {
		res.send('error : post body is not defined, is null, or is empty')
	}	
})

app.post('/requestValidation', (req, res) => {

	let response = new ValidationResponse(req.body.address);
	res.send(response);
})

app.post('/message-signature/validate', (req, res) => {
	//expecting payload with 1)wallet address and 2)message signature
	//Message for verification can be configured within the application logic from validation request.

})