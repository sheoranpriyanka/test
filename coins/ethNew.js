
//let config = require('config');
let Web3 = require('web3');
let { convertETH } = require('cryptocurrency-unit-convert');
let hexToDec = require('hex-to-dec')
let { convert } = require('../helpers/index')
let { dec2hex } = convert;
//let eth_unlockAccount = require("./eth.js");
let web3 = new Web3("http://3.120.128.206:8545");

const getBalance = async (address) => {
  return web3.eth.getBalance(address);
}

const unlockAddress = async (address, password) => {
    return await await new Promise((rs, rj) => {
        web3.eth.personal.unlockAccount(
            address,
            password,

            async (err, res) => {
                if (err) rj(err);
                else rs(res);
            })
    });
};

const newAccount = async (password) => {
  console.log(password);
  return web3.eth.personal.newAccount(password);
}


const sendTransaction = async(from,to,amount) => {

  if (!from) throw new Error('From address is required.');
  if (!to) throw new Error('Address is required.');
  if (!amount) throw new Error('Amount is required.');
//  if (!options.password) throw new Error('Eth Password is required.');
  let tx = { from, to, value: '0x' + dec2hex(convertETH(amount, 'eth', 'wei')) };
  console.log(tx);
  return web3.eth.sendTransaction(tx);
}
module.exports = { getBalance,unlockAddress,newAccount,sendTransaction };
