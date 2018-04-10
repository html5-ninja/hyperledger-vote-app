# hyperledger-vote-app
Blockchain vote app built with hyperledger composer  https://www.builtwithblockchain.io/livepreview/vote-app/

This web app is meant to prove a simple vote use case and technichly this can be turned into real electronique election app and fit the regulators laws.

The project is built essentially with **hyperledger fabric** , **hyperledger composer** , **reactjs** for the client side , **expressjs** for the server side.
The web app interact with hyperledger through the composer REST JSON server..

## Structure

- vote-network :
> Contain  the hyperledger composer business newtork "where all the magic happens" and the REST JSON server sources.

- vote-app :
  - server :
  > The server side Expressjs, this part expose what we need for the client web app.
  - client :
  > The web app client app built with Reactjs ... the fun part.

<hr>

## Install

### 1/ Get the Repo

```
git clone https://github.com/html5-ninja/hyperledger-vote-app.git
```

### 2/ Fabric & Composer

Now you need to get **hyperledger fabric** and   **hyperledger composer** , all you need is here

#### - Installing pre-requisites

https://hyperledger.github.io/composer/latest/installing/installing-prereqs.html

#### - Installing the development environment

https://hyperledger.github.io/composer/latest/installing/development-tools.html

<br>Note : Skip the **Start the web app ("Playground")** section.

### 3/ Deploying to Hyperledger Fabric for a single organization

```
cd ~/fabric-tools
./stopFabric.sh
./teardownFabric.sh
./downloadFabric.sh
./startFabric.sh
```

```
composer card delete -c PeerAdmin@fabric-network
composer card delete -c admin@vote-network
```

```
rm -fr ~/.composer
```

##### Creating a business network card for the Hyperledger Fabric administrator

```
composer card create -p connection.json -u PeerAdmin -c admincerts/Admin@org1.example.com-cert.pem -k keystore/xxxxxxx_your_keyxxxxxxxxx_sk -r PeerAdmin -r ChannelAdmin
```

Replace xxxxxxx_your_keyxxxxxxxxx_sk with your key , visit https://hyperledger.github.io/composer/latest/tutorials/deploy-to-fabric-single-org "Step Four: Locating the certificate and private key for the Hyperledger Fabric administrator" for more details.

##### Importing the business network card

```
composer card import -f PeerAdmin@vote-network.card
```

### 4/ Installing the Hyperledger Composer business network

we will install our vote app bna file

```
composer network install -c PeerAdmin@fabric-network -a [path to repo]/vote-network/vote-network@0.0.6.bna
```

### 5/  Starting the blockchain business network

```
composer network start --networkName vote-network --networkVersion 0.0.6 -A admin -S adminpw -c PeerAdmin@fabric-network
```

### 6/ Importing the business network card for the business network administrator

```
composer card import -f admin@vote-network.card
```
### 7/ Testing the connection to the blockchain business network

```
composer network ping -c admin@vote-network
```
<hr>

## Run the app
first we need to install node modules, should be done **once**.

```
cd [path to hyperledger-vote-app]/vote-app/server/
npm install
```

```
cd [path to hyperledger-vote-app]/vote-app/client/
npm install
```

```
cd [path to hyperledger-vote-app]/vote-network/
npm install
```

### Start the composer REST SERVER

```
cd [path to hyperledger-vote-app]/vote-network/
composer-rest-server -c admin@vote-network -n never -w true
```
This will start the composer REST SERVER on port 3000, the magic happen here http://localhost:3000 <br>
Now we will add candidates this is the assets on our business network
- go to http://localhost:3000/explorer/
- click "Candidate" and "POST"
- on "data" paste , it's the same data as the live demo
```
[
  {
    "name": "clinton",
    "votes": 0
  },
  {
    "name": "developer",
    "votes": 0
  },
  {
    "name": "trump",
    "votes": 0
  }
]
```

### Start the app server side

```
cd [path to hyperledger-vote-app]/vote-app/server/
node app.js
```

### Start the app client side

```
cd [path to hyperledger-vote-app]/vote-app/client/
npm start
```

<hr>

## Have fun

If everything goes right open http://localhost:3002

<hr>

My to do list<br>
- TODO[ ] : Deploying a Hyperledger Composer blockchain business network to Hyperledger Fabric (multiple organizations)
- TODO[ ] : Better UI
- TODO[ ] : fix minors bugs
