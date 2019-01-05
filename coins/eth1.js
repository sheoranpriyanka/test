var Web3 = require('web3');
const config = require('config');
var web3 = new Web3(config.get('eth'));

//console.log(web3.eth.personal);
web3.eth.personal.newAccount('!@superpassword').then(function(){console.log});
