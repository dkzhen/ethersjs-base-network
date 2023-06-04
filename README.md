# Hi there 

<p align="center">
  <img height="auto" width="auto" src="https://scroll.io/static/media/logo_with_text.7c6cafcac81093d6f83b.png">
</p>

## Claim USDC

[claim manual](https://blockscout.scroll.io/address/0xeF71Ddc12Bac8A2ba0b9068b368189FFa2628942/write-contract#address-tabs)

### How to auto claim

### clone git repository

```
git clone https://github.com/dkzhen/ethersjs-base-network
```

### install npm

```
 npm install
```

### create .env file

```
nano .env
```

### edit environment

```
PROVIDER = "https://scroll-alpha-public.unifra.io" #scroll-alpha-network
PRIVATE_KEY = "<private_key>"
MY_ADDRESS='<received_address>'
```
> edit <> disesuaikan.

### edit generate account

```
nano GeneratePrivateKey.js
```
> edit numAccounts = <jumlah_account_created> position line 33.
> save 

### run GeneratePrivateKey.js

```
npm run Generate
```
> config.json created

### run script

```
npm run main-scroll
```
