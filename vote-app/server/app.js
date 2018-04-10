/*********************************************************************/
/* server side app to get and post to the composer network REST API  */
/*********************************************************************/
const _ = require("underscore");
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

var Client = require('node-rest-client').Client;
var client = new Client();
/*
  allow cross domain access
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/*
  Make a vote
*/
app.post('/makevote', function(req, res) {
  var args = {
    data: {
      "$class": "org.acme.votenetwork.MakeVote",
      "voter": "resource:org.acme.votenetwork.Voter#"+req.body.email,
      "candidate": "resource:org.acme.votenetwork.Candidate#"+req.body.candidate,
      "timestamp": Date.now()
    },
    headers: {
      "Content-Type": "application/json",
      "Accept":"application/json"
    }
  };
  client.post("http://localhost:3000/api/MakeVote", args, function(data, response) {
    res.json(data);
  });
});
/*
  register voter
*/
app.post('/voter', function(req, res) {
  var args = {
    data: {
      "$class": "org.acme.votenetwork.Voter",
      "email": req.body.email,
      "voted": "false"
    },
    headers: {
      "Content-Type": "application/json",
      "Accept":"application/json"
    }
  };
  client.post("http://localhost:3000/api/Voter", args, function(data, response) {
    res.json(data);
  });
})
/*
  get candidates list
*/
app.get('/candidates', (req, res) => {
  client.get("http://localhost:3000/api/Candidate", function(data, response) {
    res.json(data);
  });
})
/*
  get voter by id 'email'
*/
app.get('/voter/:id', function (req, res) {
  client.get("http://localhost:3000/api/Voter/"+req.params.id, function(data, response) {
    res.json(data);
  });
})
/*
  get vote by id 'email'
*/
app.get('/vote/:voterId', function (req, res) {
  client.get("http://localhost:3000/api/queries/selectVoteByVoter?voter="+encodeURIComponent("resource:org.acme.votenetwork.Voter#"+req.params.voterId), function(data, response) {
    res.json(data);
  });
})

/*
  get last votes
*/
app.get('/lastvotes/:minDate/:maxDate', function (req, res) {
  client.get('http://localhost:3000/api/queries/listVotes?minDate='+req.params.minDate+'&maxDate='+req.params.maxDate, function(data, response) {
    data = _.map(data, function(obj){ return _.omit(obj,['voter','$class']); });
    res.json(data);
  });
})


app.listen(8080, () => console.log('Example app listening on port 8080!'))
