# BlockchainWebService

Web API with node and express used to access a private blockchain. Get and Add blocks to the chain.

## Getting Started

- Download git repo
- Run node application
- Interact with in browser

### Prerequisites

If things are acting funky then you need to install the dependencies using NPM

> We are using the [EXPRESS](https://expressjs.com/) Framework.

```
npm install level --save
npm install crypto-js --save
npm install express --save
```

## Running the tests

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

## Authors

* **Adrian Mohnacs** - *all da work* - [github](https://github.com/amohnacs15)

## Acknowledgments

https://classroom.udacity.com/nanodegrees/nd1309/parts/c4ecd959-25d3-46c3-91ba-e5d79c638a34/modules/66945d17-26b1-4370-9b8c-466f4fd3e6ff/lessons/8947cd58-2ad6-486b-8b04-3ae78310ce97/concepts/7f29108d-c59c-4cf6-945a-424dda143e46

# BlockchainNotaryService
