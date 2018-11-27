const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

const levelDatabase = require('./levelDatabase.js')
const Blockchain = require('./simpleChain.js')

const Block = require('./model/block.js')
const ValidationStatus = require('./model/validationStatus.js')
const MessageSignature = require('./model/messageSignature.js')

//global variables
var validationStatus;
var isValid = false;
var starRegisterCount = 0;

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

app.get('/block', (req, res) => {
	res.send("no op")
})

//using leveldb we print the block at the specified height to the browser
app.get('/block/:blockHeight', (req, res) => {
	let params = req.params;

	levelDatabase.getBlock(params.blockHeight).then(function(result) {
		var block = JSON.parse(result)
		res.send(block)
	}, function(error) {
		res.send('error : getting block at height ' + req.params.blockHeight)
	})
})

//star lookup
app.get('/stars/address/:starAddress', (req, res) => {

	let starAddress = req.params.starAddress;

	levelDatabase.getBlockByAddress(starAddress).then(function(result) {
		res.send(result);
	}, function(error) {
		res.send('error : getting star at address ' + starAddress + " => " + error);
	})
})

app.get('/stars/hash/:starHash', (req, res) => {

	let starHash = req.params.starHash;

	levelDatabase.getBlockByHash(starHash).then(function(result) {
		res.send(result)
	}, function(error) {
		res.send('error : getting block at hash ' + starHash + " => " + error);
	})
})

//POST
app.post('/',(req, res) => {
	res.send('root post')
})

/* add a star to your blockchain's body */
app.post('/block', (req, res) => {

	if(isValid && starRegisterCount == 0) {
		var bodyData = req.body;

		let chain = new Blockchain();

		if (bodyData !== undefined && bodyData !== null && bodyData !== "") {

			let validProperties = bodyData.star.dec && bodyData.star.ra && bodyData.star.story;

			if (validProperties && bodyData.star.story.split(' ').length <= 250) {
				let hexEncodedStory = new Buffer(bodyData.star.story).toString('hex');
				bodyData.star.story = hexEncodedStory;

				let newBlock = new Block(bodyData);

				chain.addBlockResponse(newBlock).then(function(result) {
					starRegisterCount++;

					var block = JSON.parse(result)
					res.send(block)
				}, function(error) {
					res.send('addBlockResponse error')
				})
			} else {
				res.send('Star parameters invalid');
			}
		} else {
			res.send('error : post body is not defined, is null, or is empty')
		}	
	} else {
		res.send("Session Invalid. Please revalidate.")
	}
})

/*This signature proves the users blockchain identity. Upon validation of this identity, the user should be granted access to register a single star.*/
app.post('/requestValidation', (req, res) => {

	//expired session
	if (validationStatus !== undefined && validationStatus !== null) {

		//update validationWindow
		let predictedTime = validationStatus.requestTimeStamp + (5 * 60000);
		let windowRemaining = predictedTime - new Date().getTime();
		validationStatus.validationWindow = Math.round(windowRemaining / 1000);

		console.log(validationStatus.validationWindow);
		console.log(validationStatus.validationWindow < 0);

		//expired session
		if (parseInt(validationStatus.validationWindow,10) < parseInt(0, 10)) {
			
			validationStatus = null;
			isValid = null;
			res.send("Session Expired. Please resend request.")
		} else {
			//valid session
			delete validationStatus.messageSignature
			res.send(validationStatus);		
		}

	//new session		
	} else {
		validationStatus = new ValidationStatus(req.body.address);
		let window = validationStatus.validationWindow;
		validationStatus.validationWindow = window / 1000;

		res.send(validationStatus);
	}
})

/*After receiving the response, users will prove their blockchain identity by signing a message with 
their wallet. Once they sign this message, the application will validate their request and grant 
access to register a star.*/
app.post('/message-signature/validate', (req, res) => {
	//expecting payload with 1)wallet address and 2)message signature
	let address = req.body.address;
	let signature = req.body.signature;
	//Message for verification can be configured within the application logic from validation request.
	if (validationStatus !== undefined && validationStatus !== null) {
		isValid = bitcoinMessage.verify(validationStatus.message, address, signature);

		if (isValid) {
			validationStatus["messageSignature"] = "valid";
			let messageSignature = new MessageSignature(validationStatus);
			res.status(200).send(messageSignature);
		} else {
			validationStatus["messageSignature"] = "invalid";
			res.status(417).send("Session Invalid");
		}
	} else {
		res.send("Session Expired. Please resend request.")
	}
})
