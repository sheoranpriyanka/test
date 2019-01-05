
let config = require('config');
let Web3 = require('web3');
let eth_unlockAccount = require("./eth.js");
let web3 = new Web3("http://3.120.128.206:8545");
const getContract = (from) => {
    return new web3.eth.Contract(
        require('../config/usdt.json'),
        '0xdac17f958d2ee523a2206206994597c13d831ec7',
        { gas: "100000", from }
    );
};


const getBalance = async (address) => {
    const ctx = getContract(address);
    console.log("BALANCE OF = ", address);
    const promise = await new Promise((rs, rj) => {
        ctx.methods.balanceOf(address).call(function (err, res) {
          //  console.log("BALANCE OF ERRR= ", err.message);
            //console.log(res);
            if (err) rs(0);
            else {

                res = res / 1000000;
              //  console.log(res);
                rs(res);
            }
        });
    });
    return promise;
};
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
const transferAmount = async (address, pwd, options) => {
    const ctx = getContract(address);
    const unlocked = await eth_unlockAccount.unlockAccount(address,pwd);
    const promise = new Promise((rs, rj) => {
        ctx.methods.transfer(options.address, 100000000 * (options.amount)).send(function (err, res) {
            if (err) rj(err);
            else rs(res);
        });
    });
    return promise;
};

const unlockAccount = async (address,password) => {
  eth_unlockAccount.unlockAccount(address,password);
  //web3.personal.unlockAccount(address,password).then(console.log("account unlocked"));
}
module.exports = { getBalance, transferAmount,unlockAccount };
