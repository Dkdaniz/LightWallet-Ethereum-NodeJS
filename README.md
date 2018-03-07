# LightWallet-Ethereum-NodeJS
Api in nodejs with all the functionalities that a lightwallet can make available. Compatible with token ERC20.

## Routes

## **`/seed/:point`**


__Inputs__

- `point:`

__Outputs__
- `data:[isError,Seed]`

<br>

## **`/wallet`**

__Inputs__

- `seed:`
- `password:`

__Outputs__
- `data:[wallet]`

<br>


## **`/wallet/seed`**

__Inputs__ 

- `password:`
- `seed:`

__Outputs__
- `data:[wallet]`


<br>

## **`/wallet/validate`**

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[isError,Msg]`

<br>


## **`/seed`**

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[isError,Seed]`

<br>



## **`/eth/balance`**

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[address,balance]`

<br>



## **`/contract/balance`**

__Inputs__ 

- `wallet:`
- `password:`

__Outputs__
- `data:[address,balance]`

<br>

## **`/eth/send`**

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
- `address:`

__Outputs__
- `JSON all transaction`

<br>
