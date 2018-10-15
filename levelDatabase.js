/* ===== Persist data with LevelDB ===================================
  |  Learn more: level: https://github.com/Level/level     |
  |  =============================================================*/

  const level = require('level');
  const chainDB = './chaindata';
  const db = level(chainDB);

  // Get data as Promise from levelDB with key
  const getBlock = function(key) {

    return new Promise((resolve, reject) => {

      db.get(key, function(err, value) {
        
        if(err) {
          //console.log('Not found!', err);
          reject(err)
        } else {
          resolve(value);
        }
      })
    })
  }

  //get the Block's height as a Promise and print out db contents
  const getBlockHeight = function() {
      let self = this;
      let i = 0;

      return new Promise((resolve, reject) => {
        db.createReadStream()
          .on('data', function(data) {
            console.log("-> " + data.value)
            i++;
          }).on('error', function(err) {
            console.log(err);
            reject(0)
          }).on('close', function() {
            resolve(i);
          });
        })
  }

  const getBlockByAddress = function(address) {
    let blockArray = new Array();

    return new Promise((resolve, reject) => {
      db.createReadStream()
          .on('data', function(data) {
            let block = JSON.parse(data.value);

            console.log('block  '+ block);
            console.log('body ' + JSON.stringify(block.body))
            
            if (block.body.address !== undefined && block.body.address !== null) {
              console.log('address ' + block.body.address);

              let decodedHexStory = new Buffer(block.body.star.story, 'hex').toString();
              block.body.star["storyDecoded"] = decodedHexStory;

              blockArray.push(block);
            }
          }).on('error', function(err) {
            reject(err);
          }).on('close', function() {
            resolve(blockArray);
          });
    })
  }

  // Add data to levelDB with key/value pair
  function addDataToLevelDB(key, value) {

    db.put(key, value, function(err) {
      if (err) {
        console.log('Block ' + key + ' submission failed', err);
        return null;
      }
      console.log("successfully added : " + value)
    })
  }

  module.exports = {
    getBlock : getBlock,
    getBlockHeight : getBlockHeight,
    addDataToLevelDB : addDataToLevelDB,
    getBlockByAddress : getBlockByAddress
  }

  /* ===== Testing ==============================================================|
  |  - Self-invoking function to add blocks to chain                             |
  |  - Learn more:                                                               |
  |   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
  |                                                                              |
  |  * 100 Milliseconds loop = 36,000 blocks per hour                            |
  |     (13.89 hours for 500,000 blocks)                                         |
  |    Bitcoin blockchain adds 8640 blocks per day                               |
  |     ( new block every 10 minutes )                                           |
  |  ===========================================================================*/

  /*
  (function theLoop (i) {
    setTimeout(function () {
      addDataToLevelDB('Testing data');
      if (--i) theLoop(i);
    }, 100);
  })(10);
  */