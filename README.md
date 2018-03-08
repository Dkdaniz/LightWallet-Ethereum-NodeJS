# LightWallet Ethereum NodeJS
Api in nodejs with all the functionalities that a lightwallet can make available. Compatible with token ERC20.

# Getting Started

```
npm install 
npm start

```


# Routes

## **`/seed/:point`**
```
add entropy to the wallet seed security phrase generation
```

__Inputs__

- `point:`

__Outputs__
- `data:[isError,Seed]`

<br>

## **`/wallet`**
```
function responsible for the generation of wallet.json where the seed is received from '/seed/:point'
```

__Inputs__

- `seed:`
- `password:`

__Outputs__
- `data:[wallet]`

<br>


## **`/wallet/seed`**
```
function responsible for return wallet for seed
```

__Inputs__ 

- `password:`
- `seed:`

__Outputs__
- `data:[wallet]`


<br>

## **`/wallet/validate`**
```
function responsible for validate if password is compatible with wallet
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[isError,Msg]`

<br>


## **`/seed`**
```
function responsible for show seed
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[isError,Seed]`

<br>



## **`/eth/balance`**
```
Function responsible for returning account balance in ETH 
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[address,balance]`

<br>



## **`/contract/balance`**
```
Function responsible for returning account balance in token contract ERC20
```

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[address,balance]`

<br>

## **`/eth/send`**
```
Function responsible for send ETH
```

__Inputs__ 

- `wallet:`
- `password:`
- `to:`
- `from:`
- `gasLimit:`
- `gasPrice:`
- `value:`

__Outputs__
- `data:[isError,hash]`

<br>

## **`/contract/send`**
```
Function responsible for send Token Contract
```

__Inputs__ 

- `wallet:`
- `password:`
- `to:`
- `from:`
- `gasLimit:`
- `gasPrice:`
- `value:`

__Outputs__
- `data:[isError,hash]`

<br>


## **`/transaction/:address`**
```
Function responsible for return list all transaction 
```
__Inputs__ 
- `address:`

__Outputs__
- `JSON all transaction`

<br>
