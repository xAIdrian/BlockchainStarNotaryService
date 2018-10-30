<img width="1200" alt="half_size_asbanner_2x_v2test4" src="https://user-images.githubusercontent.com/39571240/47747419-90809480-dc45-11e8-8c3a-9a58d3f204eb.png">

Web API with node and express used to access a private blockchain. Get and Add blocks to the chain.

### Table of Contents:
* [Getting Started](#getting_started)
* [Running the Application](#run)
* [Configure Star Registration Endpoint](#star_registration)
* [Search by Blockchain Wallet Address](#search_address)
* [Search by Star Block Hash](#search_hash)
* [Search by Star Block Height](#search_height)

### <a name="getting_started"></a>Prerequisites

If things are acting funky then you need to install the dependencies using NPM

> We are using the [EXPRESS](https://expressjs.com/) Framework.

```
npm install level --save
npm install crypto-js --save
npm install express --save
```

### <a name="getting_started"></a>Getting Started

- Download git repo
- Run node application
- Interact with in browser

## <a name="run"></a>Running the Application

In your terminal run the application once you have navigated to the proper package :
````
node index.js
````

We can get the data at a specific height with the endpoint :

*blockheight* is the index of the block we want to retrieve

````
http://localhost:8000/block/<blockheight>
````

We post data with the same endpoint :

A new block will only be added to the chain if you include data in the body of the POST request.

````
http://localhost:8000/block
````

For both requests, the block will be displayed to the browser window in JSON format :
````
"{\"hash\":\"d0bf72ce71844ac65aa37849118e81581499b5e3922f6eda1ca0b491a54b1dbd\",\"height\":1,\"body\":\"boss data\",\"time\":\"1537838613\",\"previousBlockHash\":\"b911e16c74f6fb8a63415e4ac98abbc1d26c63438a04148bf5c7775942cd1764\"}"
````

### <a name="star_registration"></a>Configure Star Registration Endpoint

URL
This functionality should be provided at the following URL.
````
http://localhost:8000/block
````
Payload
Wallet address (blockchain identity), star object with the following properties.

> Requires address [Wallet address]

> Requires star object with properties

> right_ascension

> declination

> magnitude [optional]

> constellation [optional]

> star_story [Hex encoded Ascii string limited to 250 words/500 bytes]

JSON Response

block object

Example: Block with star object endpoint
Post block with curl
````
curl -X "POST" "http://localhost:8000/block" \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
  "star": {
    "dec": "-26° 29'\'' 24.9",
    "ra": "16h 29m 1.0s",
    "story": "Found star using https://www.google.com/sky/"
  }
}'
````
JSON Response Example
````
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
````

### <a name="search_address"></a>Search by Blockchain Wallet Address
Details
> Get endpoint with URL parameter for wallet address
> JSON Response
> Star block objects
URL
````
http://localhost:8000/stars/address:[ADDRESS]
````

Payload
URL parameter with wallet address.

> Example: stars/address:[address] endpoint

Get request with curl
````
curl "http://localhost:8000/stars/address:142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"
````
Example: JSON response
````
[
  {
    "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
    "height": 1,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "16h 29m 1.0s",
        "dec": "-26° 29' 24.9",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532296234",
    "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
  },
  {
    "hash": "6ef99fc533b9725bf194c18bdf79065d64a971fa41b25f098ff4dff29ee531d0",
    "height": 2,
    "body": {
      "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
      "star": {
        "ra": "17h 22m 13.1s",
        "dec": "-27° 14' 8.2",
        "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
        "storyDecoded": "Found star using https://www.google.com/sky/"
      }
    },
    "time": "1532330848",
    "previousBlockHash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
  }
]
````
### <a name="search_hash"></a>Search by Star Block Hash
Get endpoint with URL parameter for star block hash JSON Response

> Star block object
URL
````
http://localhost:8000/stars/hash:[HASH]
````
Payload
URL parameter with star block hash.

> Example: stars/hash:[hash] endpoint

Get request with curl
````
curl "http://localhost:8000/stars/hash:a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f"
````
Example: JSON response
````
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
````

### <a name="search_height"></a>Search by Star Block Height

Details
> Get endpoint with URL parameter for star block height
> JSON Response
> Star block object
URL
````
http://localhost:8000/block/[HEIGHT]
````
Payload
URL parameter with block height.

> Example: stars/address:[address] endpoint

Get request with curl
````
curl "http://localhost:8000/block/1"
````
Example: JSON response
````
{
  "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
  "height": 1,
  "body": {
    "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
    "star": {
      "ra": "16h 29m 1.0s",
      "dec": "-26° 29' 24.9",
      "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
      "storyDecoded": "Found star using https://www.google.com/sky/"
    }
  },
  "time": "1532296234",
  "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
}
````


## Author

* **Adrian Mohnacs** - *all da work* - [github](https://github.com/amohnacs15)

## Acknowledgments

https://classroom.udacity.com/nanodegrees/nd1309/parts/c4ecd959-25d3-46c3-91ba-e5d79c638a34/modules/66945d17-26b1-4370-9b8c-466f4fd3e6ff/lessons/8947cd58-2ad6-486b-8b04-3ae78310ce97/concepts/7f29108d-c59c-4cf6-945a-424dda143e46
