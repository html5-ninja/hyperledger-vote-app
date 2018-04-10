import React from 'react';
import {Client} from 'node-rest-client';
import {_} from 'underscore';
import {animation} from "./animation.js";
import {URL,API} from "./const.js";
var client = new Client();
var Loader = require('react-loader');
/********************************************
  CandidateList compnent props came from logged user state
  <CandidateList data={this.state}/>
********************************************/
export class CandidateList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      candidates: [], // list of candidates
      votedFor: '',
      voted: false,
      candidatesLoaded: false,
      voteLoaded: true,
      transactionId : ''
    };
    //  console.log(props.data.votedFor)
  }
  componentDidMount() {
    animation();
  }
  /********************************************
    on compnent will mount
  ********************************************/
  componentWillMount() {
    const _this = this;
    // get list of candidates
    client.get(API+"/candidates", function(data, response) {
      _this.setState({candidates: data, candidatesLoaded: true}); // set the state
    });
  }
  /********************************************
    on receive props set the current user voted
    for candidate
  ********************************************/
  componentWillReceiveProps(nextProps) {
    this.setState({
      votedFor: nextProps.data.votedFor
        ? (nextProps.data.votedFor).split('#')[1]
        : '',
      voted: nextProps.data.votedFor
        ? true
        : false
    ,transactionId:nextProps.data.transactionId? nextProps.data.transactionId : false});
  }
  /********************************************
    return true if current user voted for this
    candidate
  ********************************************/
  _votedFor(name) {
    if (this.state.votedFor === name) {
      return 'voted';
    }
    return '';
  }
  /********************************************
    make vote action
  ********************************************/
  _MakeVote(candidate) {
    const _this = this;
    let userId = this.props.data.session; // user id 'email'
    // set content-type header and data as json in args parameter
    let args = {
      data: {
        "email": userId,
        "candidate": candidate // candidate name
      },
      headers: {
        "Content-Type": "application/json"
      }
    };
    this.setState({voteLoaded: false});
    // Post to the vote
    client.post(API+"/makevote", args, function(data, response) {
      _this.setState({voteLoaded: true});
      if (!data.error) { // if not already voted
        let candidate = data.candidate.split('#')[1]; // get candidate name from data response
        _this.setState({votedFor: candidate, voted: true,transactionId : data.transactionId}); // set state
        localStorage.setItem('voted', true); // local storage item
        localStorage.setItem('votedFor', candidate); // local storage item
        let allCandidates = _this.state.candidates; // candidates list from state
        let candidateIndex = _.findIndex(allCandidates, {name: candidate}); // find candidate index in the  list
        (allCandidates)[candidateIndex].votes += 1; // increment vote to avoid recall the app API
        _this.setState({candidates: allCandidates}); // update the state with updated candidate list
      }
    });
  }
  /********************************************
    render the vote btn
  ********************************************/
  _renderVoteBtn(candidate) {
    if (this.props.data.session) { // if logged
      if (!this.state.votedFor) { // if not voted yet
        return (<div>
          <button className="vote-btn" onClick={(e) => this._MakeVote(candidate)}>
            <span className="fa fa-thumbs-up"></span>
          </button>
        </div>)
      } else { // if alredy voted
        return (<button className="vote-btn">
          <span className="fa fa-thumbs-up"></span>
        </button>)
      }
    }
    return false;
  }
  /********************************************
    render candidate
  ********************************************/
  _renderCandidate() {
    // option for the loader
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
      position: 'absolute'
    };
    const _this = this;
    // map and render candidate with button , votes , name
    return _.map((this.state.candidates), function(v, k) {
      let img = "/img/" + v.name + ".png";
      return (<div className="col text-center candidate mb-4" key={k}>
        <div className={'img-block'} style={{
            backgroundImage: "url(./img/" + v.name + ".png)"
          }}>
          <div className={"hover " + _this._votedFor(v.name) + " " + _this.state.voted+" "+(!_this.state.voteLoaded?'loading':'')}>
            <Loader loaded={_this.state.voteLoaded} options={options} className="spinner">{_this._renderVoteBtn(v.name)}</Loader>
          </div>
        </div>
        <h2 className="text-light text-uppercase text-left mb-0">{v.name}
          <small className="float-right mt-2">{v.votes}</small>
        </h2>
        <hr className="bg-light py-1 mt-0"/>
      </div>)
    })
  }
  /********************************************
    render candidate
  ********************************************/
  render() {
    // option for the loader
    var options = {
      lines: 13,
      length: 20,
      width: 10,
      radius: 30,
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
      position: 'absolute'
    };
    return (<div className="candidates-list my-4">
      <Loader loaded={this.state.candidatesLoaded} options={options} className="spinner">
        <div className="container">
          <div className="row">
            {this._renderCandidate()}
            <div className="col-12 text-light tx">
              <div className={(!this.state.transactionId) ? 'd-none':''}>
              Your vote ID <small>(transaction ID)</small> : {(this.state.transactionId)?this.state.transactionId :''}
              </div>
            </div>
          </div>
        </div>
      </Loader>
    </div>);
  }
}
