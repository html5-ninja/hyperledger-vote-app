import React from 'react';
import {Client} from 'node-rest-client';
import {CandidateList} from './CandidateList.jsx';
import {URL,API} from "./const.js";
var client = new Client();
var Loader = require('react-loader');

export class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: '', //user id 'email'
      session: localStorage.getItem('session'), // if logged this will contail the userId email
      voted: localStorage.getItem('voted'), // user voted or not
      votedFor: localStorage.getItem('votedFor'), // candidate voted for
      loaded: true
    };
    // handle the login form
    this.handleChange = this._handleChange.bind(this);
    this.handleSubmit = this._handleSubmit.bind(this);
  }
  /********************************************
    get registred  voter by id 'email' or session storage
  ********************************************/
  _getVoter(email) {
    const _this = this;
    // argument to send to SERVER
    let args = {
      path: {
        "id": email
      }
    };
    // Fectch the voter in the app API by id 'email'

    if (email) {
      client.get(API+"/voter/${id}", args, function(data, response) {
        // save id 'email' on 'session' local storage item
        localStorage.setItem('session', data.email);
        // save id 'voted' on 'voted' local storage item : take true or false
        localStorage.setItem('voted', data.voted);
        // set the state
        _this.setState({session: data.email, voted: data.voted});
        // test if already voted : can be bool or string (true || "true")
        if (data.voted || data.voted === "true") {
          // set argument to find vote by user
          let args = {
            path: {
              "voterId": data.email
            }
          };
          // get vote regitred by user id 'email'
          client.get(API+"/vote/${voterId}", args, function(data, response) {
            if (data) {
              // save the voted for candidate
              localStorage.setItem('votedFor', data[0].candidate);
              // set the state
              _this.setState({votedFor: data[0].candidate,transactionId:data[0].transactionId});
            }
          });
        }

      });
    }
  }
  /********************************************
    handle email input change in login form
  ********************************************/
  _handleChange(event) {
    this.setState({userId: event.target.value});
  }
  /********************************************
    On submit register / login Form
  ********************************************/
  _handleSubmit(event) {
    const _this = this;
    this.setState({loaded: false});
    event.preventDefault();
    // set content-type header and data as json in args parameter
    let args = {
      data: {
        "email": this.state.userId
      },
      headers: {
        "Content-Type": "application/json"
      }
    };
    // Register / login user
    client.post(API+"/voter", args, function(data, response) {
      if (data.error) {
        // if error mean that user exist so get voter
        _this._getVoter(_this.state.userId);
      } else {
        // regiter the voter
        localStorage.setItem('session', data.email); // save session 'eamil'
        localStorage.setItem('voted', data.voted); // save if alredy voted
        _this.setState({session: data.email, voted: data.voted}); // set the state
      }
      _this.setState({loaded: true});
    });
  }
  /********************************************
    Logout and empty local storage , unset the state
  ********************************************/
  _logOut(e) {
    localStorage.removeItem("session");
    localStorage.removeItem("voted");
    localStorage.removeItem("votedFor");
    this.setState({userId: '', session: localStorage.getItem('session'), voted: false, votedFor: '',transactionId:false});
  }
  _renderSartHere() {
    return (<div>
      <h2 className="text-light text-uppercase">Start here</h2>
      <hr className="bg-light py-1 mt-0"/>
      <p>Thank you for taking the time to try this web app based on blockchain with hyperledger composer.</p>
      <p>Before choosing your candidate enter an email address to login, next you can simply click on candidate's avatar, that's it.</p>
      <p>Here the email address is used as voter ID, we encourage you to use as many fake email as you want.</p>
    </div>);
  }
  /********************************************
    on compnent will mount get the voter by session
    useful on refresh the page
  ********************************************/
  componentWillMount() {
    this._getVoter(this.state.session);
  }
  /********************************************
    render the compnent
  ********************************************/
  render() {
    var options = {
      lines: 13,
      length: 5,
      width: 3,
      radius: 10,
      scale: 1.00,
      corners: 1,
      color: '#fff',
      opacity: 0.25,
      rotate: 0,
      direction: 1,
      speed: 1,
      trail: 60,
      fps: 20,
      zIndex: 2e9,
      shadow: false,
      hwaccel: false,
      position: 'relative',
      className:'spinnerLoger'
    };
    if (!this.state.session) {
      return (<div>
        <CandidateList data={this.state}/>
        <div className="container pt-4">
          <div className="row">
            <div className="col-md-6 text-light">{this._renderSartHere()}</div>
            <div className="col-md-6 mb-4">

                <form onSubmit={this.handleSubmit}>
                  <h2 className="text-light text-uppercase">Login / Register</h2>
                  <hr className="bg-light py-1 mt-0"/>
                  <Loader loaded={this.state.loaded} options={options} >
                  <div className="input-group input-group-lg">
                    <input type="email" className="form-control" placeholder="@" value={this.state.userId} onChange={this.handleChange} required="required"/>
                    <span className="input-group-btn">
                      <button type="submit" className="btn  btn-primary btn-lg">Submit</button>
                    </span>
                  </div>

                  <p className="text-light mt-4">We don't use your email and we keep it private, for more security please use fake email.</p>
                  </Loader>
                </form>

            </div>
          </div>
        </div>
      </div>);
    } else {
      return (<div>
        <CandidateList data={this.state}/>
        <div className="container pt-4">
          <div className="row">
            <div className="col-md-6 text-light">{this._renderSartHere()}</div>
            <div className="col-md-6 mb-4 text-light">
              <h2 className="text-uppercase">You are logged</h2>
              <hr className="bg-light py-1 mt-0"/>
              <button onClick={(e) => this._logOut(e)} className="btn btn-danger float-right btn-sm">logout</button>
              <div className="mb-2 d-block">
              <h5><span className="pt-1 d-block">{this.state.session}</span></h5>
              <hr className="bg-light my-2"/>
              </div>
              <p>You can choose your candidate if you hadn't done yet</p>
            </div>
          </div>
        </div>

      </div>);
    }
  }
}
