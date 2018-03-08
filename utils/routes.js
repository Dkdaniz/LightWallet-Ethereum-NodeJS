'use strict';

//Author: Daniel Marques
//Twitter: @dkdaniz
//Github: @dkdaniz
//WebSite: www.descentralizado.com.br

const helper = require('./helper');
const fs = require("fs");
const Lightwallet = require('eth-lightwallet');
const isNullOrUndefined = require('util');
const Web3 = require('web3');
const HookedWeb3Provider = require('hooked-web3-provider');
const async = require('async');
const Request = require('request');

let web3 = new Web3();
let contractAddress = '<YOUR-SMART-CONTRACT-ADRESS>';
let contractAbi = '<YOUR-JSON-API-CONTRACT>';
let hostInfura = "https://rinkeby.infura.io/" + "<YOUR-API-INFURA>";
let contractInstance = web3.eth.contract(contractAbi).at(contractAddress);
let txutils = Lightwallet.txutils;
let signing = Lightwallet.signing;
let encryption = Lightwallet.encryption;
let txOptions = Lightwallet.txOptions; 

let Apikeys = ['<YOUR-SMART-CONTRACT-ADRESS>','<YOUR-SMART-CONTRACT-ADRESS>'];

class Routes{

	constructor(app){
		this.app = app;
	}

	/* creating app Routes starts */
	appRoutes(){

		this.app.get('/seed/:point',(request, response) => {
			if(isNullOrUndefined.isNullOrUndefined(request.params.point))
			{
				let error = { 
					isError: true,
					msg: "Error read parameter <point>"
				};
				response.status(400).json(error);
			}
			
			let seedPoint = request.params.point.toString();	
			let data = { 
				isError: false,
				seed: Lightwallet.keystore.generateRandomSeed(seedPoint) 
			};
			response.status(200).json(data);
		})		

		//create new wallet ERC20
		this.app.post('/wallet', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.seed))
			{
				let error = { 
					isError: true,
					msg: "Error read parameter <seed>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let error = { 
					isError: true,
					msg: "Error read parameter <password>"
				};
				response.status(400).json(error);
			}	
			let paramPassword = request.body.password.toString();
			let paramSeed = request.body.seed.toString();
			let numAddr = 1;

			Lightwallet.keystore.createVault({
				password: paramPassword,
				seedPhrase: paramSeed,
				//random salt 
				hdPathString: "m/0'/0'/0'"
			  }, function (err, ks) { 
				ks.keyFromPassword(paramPassword, function(err, pwDerivedKey) {
					if(ks.isDerivedKeyCorrect(pwDerivedKey))
					{
						ks.generateNewAddress(pwDerivedKey, numAddr);  
						let data = {							
							wallet: ks
						};
						response.status(200).json(data);
					}else{	
						let error = {
							isError: true,
							msg: 'Password incorret'						
						};				
						response.status(400).json(error);
					}	
				  })
				})	
		});	
		
		//Load wallet for seed
		this.app.post('/wallet/seed', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.seed))
			{
				let error = { 
					isError: true,
					msg: "Error read parameter <seed>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let error = { 
					isError: true,
					msg: "Error read parameter <password>"
				};
				response.status(400).json(error);
			}	

			let numAddr = 1;
			let pass = request.body.password.toString();
			let randomSeed = request.body.seed.toString();			
			Lightwallet.keystore.createVault({		
				password: pass,	
				seedPhrase: randomSeed,	
				hdPathString: "m/0'/0'/0'"	
			}, function (err, ks) {					   
				ks.keyFromPassword(pass, function(err, pwDerivedKey) {
					if(ks.isDerivedKeyCorrect(pwDerivedKey))
					{
						ks.generateNewAddress(pwDerivedKey, numAddr);
						let data = {							
							wallet: ks
						} 					
						response.status(200).json(data);
					}
					else{	
						let error = {
							isError: true,
							msg: 'Password incorret'						
						};		
						response.status(400).json(error);
					}					  
				})								
			});	
		});	

		this.app.post('/wallet/validate', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.wallet))
			{
				let error = {
					isError: true, 
					msg: "Error read Wallet Json"
					
				};
				response.status(400).json(error);
				
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let error =  { 
					isError: true, 
					msg: "Error read parameter <password>"
				};
				response.status(400).json(error);
			}							
			let walletJson = JSON.stringify(request.body.wallet);	
			let ks = new Lightwallet.keystore.deserialize(walletJson);
			let password = request.body.password.toString();			
			ks.keyFromPassword(password, function(err, pwDerivedKey) {
				if(ks.isDerivedKeyCorrect(pwDerivedKey))
				{
					let data = {
						isError: false,												
					}
					response.status(200).json(data);
				}else{	
					let error = {
						isError: true,
						msg: 'Password incorret'						
					};				
					response.status(400).json(error);
				}	
			});			
		});

		//show seed for wallet
		this.app.post('/seed', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.wallet))
			{
				let error = { 
					isError: true, 
					msg: "Error read Wallet Json"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let error =  { 
					isError: true, 
					msg: "Error read parameter <password>"
				};
				response.status(400).json(error);
			}				
			let walletJson = JSON.stringify(request.body.wallet);	
			let ks = Lightwallet.keystore.deserialize(walletJson);
			let password = request.body.password.toString();
			ks.keyFromPassword(password, function(err, pwDerivedKey) {				
				if(ks.isDerivedKeyCorrect(pwDerivedKey))
				{
					let data = {
						isError: false,
						seed: ks.getSeed(pwDerivedKey)						
					}
					response.status(200).json(data);
				}
				else{	
					let error = {
						isError: true,
						msg: 'Password incorret'						
					};				
					response.status(400).json(error);
				}
			});
			
		});	

		//get balance Eth
		this.app.post('/eth/balance', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.wallet))
			{
				let error = { 
					isError: true, 
					msg: "Error read Wallet Json"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let error =  { 
					isError: true, 
					msg: "Error read parameter <password>"
				};
				response.status(400).json(error);
			}							
			let walletJson = JSON.stringify(request.body.wallet);	
			let ks = Lightwallet.keystore.deserialize(walletJson);
			let password = request.body.password.toString();
			ks.keyFromPassword(password, function(err, pwDerivedKey) {
				if(!err)
				{
					let addresses = ks.getAddresses();
					let web3Provider = new HookedWeb3Provider({
						host: hostInfura,
						transaction_signer: ks
					});		  
					web3.setProvider(web3Provider); 
					
					async.map(addresses, web3.eth.getBalance, function(err, balances) {
						async.map(addresses, web3.eth.getTransactionCount, function(err, nonces) {
							let balance = {
								isError: false,
								address: addresses[0],
								balance: balances[0] / 1.0e18
							};
							response.status(200).json(balance);					  
						})
					})					
				}
				else{	
					let error = {
						isError: true,
						msg: err						
					};
					response.status(400).json(error);
				}
			});
		});

		//get balance contract token
		this.app.post('/contract/balance', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.wallet))
			{
				let msg = { msg: "Error read Wallet Json"};
				response.status(400).json(msg);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let msg =  { msg: "Error read parameter <password>"};
				response.status(400).json(msg);
			}							
			let walletJson = JSON.stringify(request.body.wallet);	
			let ks = Lightwallet.keystore.deserialize(walletJson);
			let password = request.body.password.toString();
			ks.keyFromPassword(password, function(err, pwDerivedKey) {
				if(!err)
				{
					let web3Provider = new HookedWeb3Provider({
						host: hostInfura,
						transaction_signer: ks
					});		  
					web3.setProvider(web3Provider); 	


					let addr = ks.getAddresses()[0];     
					let contractData = contractInstance.balanceOf.getData(addr);

					web3.eth.call({
						to: contractAddress, // Contract address, used call the token balance of the address in question
						data: contractData // Combination of contractData and tokenAddress, required to call the balance of an address 
						}, function(err, result) {
					if (result) { 
						let tokens = web3.toBigNumber(result).toString(); // Convert the result to a usable number string
						let balance = {
							address: addr,
							balance: web3.fromWei(tokens, 'ether')
						};
						response.status(200).json(balance);
					}
					else {
						response.status(400).json(err); // Dump errors here
					}
					}); 
				} else {
					response.status(400).json(err);
				}      
			});			
		});

		//send Ether for other address
		this.app.post('/eth/send', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.wallet))
			{
				let error = { 
					isError: true,
					msg: "Error read Wallet Json"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <password>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.to))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <to>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.gasLimit))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <gasLimit>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.gasPrice))
			{
				let error =  { 
					isError: true,					
					msg: "Error read parameter <gasPrice>"};
				response.status(400).json(error);
			}
			if(isNullOrUndefined.isNullOrUndefined(request.body.from))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <from>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.value))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <value>"
				};
				response.status(400).json(error);
			}	
									
			let walletJson = JSON.stringify(request.body.wallet);				
			let ks = Lightwallet.keystore.deserialize(walletJson);			
			let password = request.body.password.toString();
			ks.keyFromPassword(password, function(err, pwDerivedKey) {	
				if(ks.isDerivedKeyCorrect(pwDerivedKey))
				{					
					if(ks.getAddresses()[0] == request.body.to)  
					{
						let error = { 
							isError: true,
							msg: "Invalid Recipient"
						};
						response.status(400).json(error);
					}  

					let web3Provider = new HookedWeb3Provider({
						host: "https://rinkeby.infura.io/7xNw0DpR7VrQxYmSs303",
						transaction_signer: ks
					});		  
					web3.setProvider(web3Provider); 
					
					let sendingAddr = request.body.from.toString();
					let nonceNumber = parseInt(web3.eth.getTransactionCount(sendingAddr.toString(), "pending"));
					
					txOptions = {};
					txOptions.to = request.body.to;
					txOptions.gasLimit = request.body.gasLimit; 
					txOptions.gasPrice = parseInt(request.body.gasPrice) * 1000000000;            
					txOptions.value =  parseFloat(request.body.value) * 1.0e18;   
					txOptions.nonce = nonceNumber;

					console.log(txOptions);
					let valueTx = txutils.valueTx(txOptions);
					let signedValueTx = signing.signTx(ks, pwDerivedKey, valueTx, sendingAddr);
					console.log(signedValueTx) ;      
					web3.eth.sendRawTransaction('0x' + signedValueTx, function(err, hash) { 
						if(!isNullOrUndefined.isNullOrUndefined(err)){
							let error = { 
								isError: true,
								msg: err
							};
							response.status(400).json(error);
						}   
						if(!isNullOrUndefined.isNullOrUndefined(hash)){
							let data = { 
								isError: false,
								hash: hash 
							};
							response.status(200).json(data);
						}
						else
						{							
							let error = { 
								isError: true,
								msg: 'return hash is null'
							};
							response.status(400).json(error);
						}
											
					});
				}else{	
					let error = {
						isError: true,
						msg: 'Password incorret'						
					};				
					response.status(400).json(error);
				}
			});	
		});

		//send token for other address
		this.app.post('/contract/send', function(request, response){
			if(isNullOrUndefined.isNullOrUndefined(request.body.wallet))
			{
				let error = { 
					isError: true,
					msg: "Error read Wallet Json"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.password))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <password>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.to))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <to>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.gasLimit))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <gasLimit>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.gasPrice))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <gasPrice>"
				};
				response.status(400).json(error);
			}
			if(isNullOrUndefined.isNullOrUndefined(request.body.from))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <from>"
				};
				response.status(400).json(error);
			}	
			if(isNullOrUndefined.isNullOrUndefined(request.body.value))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <value>"
				};
				response.status(400).json(error);
			}	
									
			let walletJson = JSON.stringify(request.body.wallet);	
			let ks = Lightwallet.keystore.deserialize(walletJson);
			let password = request.body.password.toString();
			ks.keyFromPassword(password, function(err, pwDerivedKey) {	
				if(ks.isDerivedKeyCorrect(pwDerivedKey))
				{
					if(ks.getAddresses()[0] == request.body.to)  
					{
						let error = { 
							isError: true,
							msg: "Invalid Recipient"
						};
						response.status(400).json(error);
					}  

					let web3Provider = new HookedWeb3Provider({
						host: hostInfura,
						transaction_signer: ks
					});		  
					web3.setProvider(web3Provider); 
					
					let nonceNumber = parseInt(web3.eth.getTransactionCount(ks.getAddresses()[0], "pending"));
					let gasprices = parseInt(request.body.gasPrice) * 1000000000;
					let gasLimit = parseInt(request.body.gasLimit);				
					let sendingAddr = ks.getAddresses()[0];
					let value = parseFloat(request.body.value) * 1.0e18   //Address wallet     
					let txOptions = {
						nonce: web3.toHex(nonceNumber),
						gasLimit: web3.toHex(gasLimit),
						gasPrice: web3.toHex(gasprices),
						to: '<YOUR-CONTRACT-ADRESSS>'
					}
					let arg = Array.prototype.slice.call([request.body.to,value]);   
					let rawTx = txutils.functionTx(contractAbi, 'transfer', arg, txOptions)
					let signedSetValueTx = signing.signTx(ks, pwDerivedKey, rawTx, sendingAddr)  
					web3.eth.sendRawTransaction('0x' + signedSetValueTx, function(err, hash) { 
						if(!isNullOrUndefined.isNullOrUndefined(err)){
							let error =  { 
								isError: true,
								msg: err
							};
							response.status(400).json(error);							
						}   
						if(!isNullOrUndefined.isNullOrUndefined(hash)){
							let data = {
								isError: false,
								hash: hash						
							};				
							response.status(200).json(data);							
						}
						else
						{							
							let error = { 
								isError: true,
								msg: 'return hash is null'
							};
							response.status(400).json(error);
						}	           
					}); 
				}
				else{	
					let error = {
						isError: true,
						msg: 'Password incorret'						
					};			
					response.status(400).json(error);
				}
			});
		});		
		
		//comunicação com api EtherScan retorna todas as transações nao testado
		this.app.get('/transaction/:address',(request, response) => {		
			if(isNullOrUndefined.isNullOrUndefined(request.params.address))
			{
				let error =  { 
					isError: true,
					msg: "Error read parameter <address>"
				};
				response.status(400).json(error);
			}		
			let address = request.params.address;
			let rondom =  Math.floor((Math.random() * 2));
			let endpoint = 'https://api-rinkeby.etherscan.io/api?module=account&action=txlist&address=' + address +'&startblock=0&endblock=99999999&sort=asc&apikey=' + Apikeys[rondom];
			Request(endpoint, function (err, res, body) {
				if (!err) {	
					let transactions = JSON.parse(body);
					let Result = [];					
					for (let index = transactions.result.length -1; index >=0 ; index--) {
						console.log(index);

						let isMyTokenValue = "";			

						if(transactions.result[index].to == contractAddress)							
							isMyTokenValue = "1";
						else
							isMyTokenValue = "0";

						var transaction = {	
							blockNumber : transactions.result[index].blockNumber,
							timeStamp : transactions.result[index].timeStamp,
							hash : transactions.result[index].hash,
							nonce : transactions.result[index].nonce,
							from : transactions.result[index].from,
							to : transactions.result[index].to,
							value : transactions.result[index].value,
							gas : transactions.result[index].gas,
							gasPrice : transactions.result[index].gasPrice,
							isError : transactions.result[index].isError,
							cumulativeGasUsed : transactions.result[index].cumulativeGasUsed,
							gasUsed : transactions.result[index].gasUsed,
							confirmations : transactions.result[index].confirmations,
							isMyToken : isMyTokenValue
						};		
						console.log(transaction);			
						Result.push(transaction);							
					}

					let data = {
						isError: false,
						transactions: Result						
					}				
					response.status(200).json(data);					
				} else {
					let error =  { 
						isError: true,
						msg: err
					};
					response.status(400).json(error);					
				}
			});
		});

		this.app.get('/', function (request, response) {
			response.send('Server ON');
		});	

		this.app.get('/web', function (request, response) {
			response.redirect('web/');
		});	

	}

	routesConfig(){
		this.appRoutes();
	}

}

module.exports = Routes;