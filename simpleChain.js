/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const levelDatabase = require('./levelDatabase.js')
const Block = require('./block.js')

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

var genesis = false;

class Blockchain {

  constructor(){
    let self = this;

    levelDatabase.getBlock(0).then(function(result) {
      //we have a genesis block let's add blocks manually from here on
      console.log('Genesis has already been established, sir')
    }, function(error) {

      console.log('GENESIS!');

        genesis = true;

        var genesisBlock = new Block("First block in the chain - Genesis block");
        self.addBlock(genesisBlock);
    })
  }

  // Add new block
  addBlock(newBlock){
    let self = this;

    this.genesisChecker(genesis);

    //so what we are doing is getting the block height
    //this is then used to get the 'last' block in the chain
    //the last block's hash is the new Block's previous hash
    levelDatabase.getBlockHeight().then(function(height) {
      return height;
    }, function(error) {
        return 0;
    }).then(function(index) {
      self.processBlock(newBlock, index)       
    });
  }

  // Add new Block and return a PROMISE to return newly added Block
  addBlockResponse(newBlock) {
    let self = this;

    this.genesisChecker(genesis);

    return new Promise((resolve, reject) => {

      levelDatabase.getBlockHeight().then(function(height) {
          return height;
      }, function(error) {
          return 0;
      }).then(function(height) {

        newBlock.time = new Date().getTime().toString().slice(0,-3);      

        if (height >= 0) {

          let previousIndex = height - 1;
          // previous block hash
          levelDatabase.getBlock(previousIndex).then(function(value) {
              var block = JSON.parse(value)

              newBlock.height = height;
              newBlock.previousBlockHash = block.hash;
              newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

              levelDatabase.addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString());

              resolve(JSON.stringify(newBlock).toString())
            }, function(error) {
              // Block height
              newBlock.height = height;
              // Block hash with SHA256 using newBlock and converting to a string
              newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
              // Adding block object to chain
              levelDatabase.addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString())

              resolve(JSON.stringify(newBlock).toString())
            })
        }       
      })
    })
  }

  genesisChecker(param) {
    if (param == false) {
      genesis = true;

      var genesisBlock = new Block("First block in the chain - Genesis block");
      this.addBlock(genesisBlock);
    }
  }

  processBlock(newBlock, height) {
    let self = this;
      // UTC timestamp
      newBlock.time = new Date().getTime().toString().slice(0,-3);      

      if (height >= 0) {

        let previousIndex = height - 1;
        // previous block hash
        levelDatabase.getBlock(previousIndex).then(function(value) {
            var block = JSON.parse(value)

            newBlock.height = height;
            newBlock.previousBlockHash = block.hash;
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

            levelDatabase.addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString());
          }, function(error) {
            // Block height
            newBlock.height = height;
            // Block hash with SHA256 using newBlock and converting to a string
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            // Adding block object to chain
            levelDatabase.addDataToLevelDB(newBlock.height, JSON.stringify(newBlock).toString())
          })
      }
  }

   // validate block
  validateBlock(blockHeight){

    levelDatabase.getBlock(blockHeight).then(function(value) {

      var block = new Block();

      if (value != null) {
        let block = JSON.parse(value)

        // get block hash
        let blockHash = block.hash;
        // remove block hash to test block integrity
        block.hash = '';
        // generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash===validBlockHash) {
          console.log('Block #' + blockHeight + '\nblock hash:\n' + blockHash + '\nvalid block hash:\n' + validBlockHash);
          return true;
        } else {
          console.log('Block #' + blockHeight + ' INVALID hash:\n' + blockHash + '<>' + validBlockHash);
          return false;
        }
      }

      return false;

    }, function(error) {
      return false;
    })
  }

  validateBlock(blockHeight) {

    return new Promise((resolve, reject) => {

        levelDatabase.getBlock(blockHeight).then(function(value) {

          var block = new Block();

          if (value != null) {
            let block = JSON.parse(value)

            // get block hash
            let blockHash = block.hash;
            // remove block hash to test block integrity
            block.hash = '';
            // generate block hash
            let validBlockHash = SHA256(JSON.stringify(block)).toString();
            // Compare
            if (blockHash===validBlockHash) {
              console.log('Block #' + blockHeight + ' : valid block hash:' + validBlockHash);
              resolve(true);
            } else {
              console.log('Block #' + blockHeight + ' INVALID hash:\n' + blockHash + '<>' + validBlockHash);
              resolve(false)
            }
          }

          resolve(false)

        }, function(error) {
          reject(error)
        })
      })
  }

  validateChainPromise(index) {

    let self = this;
  
    return new Promise((resolve, reject) => {

      self.validateBlock(index).then(function(blockIsValid) {
                //validate block
                if (!blockIsValid) {
                  console.log('ERROR : blockIsNotValid')
                  console.log('invalid block ' + (index + 1))

                  reject(index)
                } else {

                  console.log('block valid')

                  if (index > 0) {
                    levelDatabase.getBlock(index).then(function(currentBlock) {

                      levelDatabase.getBlock(index).then(function(previousBlock) {

                        let previousBlockHash = previousBlock.hash;
                        let currentPreviousHash = currentBlock.previousBlockHash;

                        if (previousBlockHash !== currentPreviousHash) {
                          console.log('ERROR : previousBlockHash != currPreviousHash')
                          console.log('previousblockhash: ' + previousBlockHash)
                          console.log('currPreviousHash: ' + currentPreviousHash)

                          reject(index)
                        }

                        resolve(index)

                      }, function(error) {
                        console.log(error)
                        reject(index)
                      })

                    }, function(error) {
                        console.log(error)
                        reject(index)
                    })
                  }
                }          
      })
    })
  }  

  // Validate blockchain
    validateChain() {

      let self = this;

      let errorLog = [];
      let promiseLog = [];

      levelDatabase.getBlockHeight().then(function(result) {

        for (var i = 0; i < result; i++) {
            
            promiseLog.push(
              self.validateChainPromise(i).then(function(index) {
                
                //last loop complete
                if (index == result - 1) {
                  console.log('iteration has completed')
                  
                  if (errorLog.length > 0) {
                    console.log('Block errors = ' + errorLog.length);
                    console.log('error is block at index: '+ errorLog);
                  } else {
                    console.log('No errors detected');
                  }
                }
              }, function(error) {
                errorLog.push(error);
              })
            );
        }

        }, function(error) {
            console.log('validateChain height error : ' + error)
        });
    }

    buildTestChain() {
      for (var i = 0; i <= 10; i++) {
        this.addBlock(new Block("test data "+ i));
      }
    }
}

module.exports = Blockchain;

