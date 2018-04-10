import React from 'react';
import {Client} from 'node-rest-client';
import {_} from 'underscore';
import {URL,API} from "./const.js";
import '../../node_modules/flatpickr/dist/themes/light.css';
import Flatpickr from 'react-flatpickr';
var moment = require("moment");
var client = new Client();

/********************************************
  CandidateList compnent props came from logged user state
  <List/>
********************************************/
export class List extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      lastvotes: false,
      loaded: false,
      startDate: moment().format('YYYY-MM-DD'),
      endDate: moment().add(1, 'days').format('YYYY-MM-DD')
    };
  };

  /********************************************
    on compnent will mount
  ********************************************/
  componentWillMount() {
    const _this = this;
    // get list of candidates
    client.get(API+"/lastvotes/" + this.state.startDate + "/" + this.state.endDate, function(data, response) {
      _this.setState({lastvotes: data, loaded: true}); // set the state
    });
  };

  _handleChangeDate() {
    const _this = this;
    // get votes
    client.get(API+"/lastvotes/" + this.state.startDate + "/" + this.state.endDate, function(data, response) {
      _this.setState({lastvotes: data, loaded: true}); // set the state
    });
  }

  _renderVotes() {
    return _.map(this.state.lastvotes, function(vote, k) {
      let date = ((vote.timestamp).split('.')[0]).replace('T', ' ')
      return (<div className="row" key={k}>
        <div className="col-md-3">
          <small>{date}</small>
        </div>
        <div className="col-md-7 text-left break">{vote.transactionId}</div>
        <div className="col-md-2 text-uppercase">{(vote.candidate).split('#')[1]}</div>
        <div className="col-md-12"><hr/></div>
      </div>)
    });

  }
  /********************************************
    render candidate
  ********************************************/
  render() {
    const {startDate, endDate} = this.state;
    return (<div className="listVotes container text-light">
      <div className="row">
        <div className="col">

          <div className="row">
            <div className="col-md-8">
              <h2 className="text-uppercase text-light">Last votes</h2>
            </div>
            <div className="col-md-2">
              <div className="input-group  mb-1">
                <Flatpickr className="form-control" value={startDate} onChange={startDate => {
                    this.setState({
                      startDate: moment(new Date(startDate)).format('YYYY-MM-DD')
                    });
                    this._handleChangeDate();
                  }}/>
              </div>
            </div>
            <div className="col-md-2">
              <div className="input-group mb-1">
                <Flatpickr className="form-control" value={endDate} onChange={endDate => {
                    this.setState({
                      endDate: moment(new Date(endDate)).format('YYYY-MM-DD')
                    });
                    this._handleChangeDate();
                  }}/>
              </div>
            </div>
          </div>
          <hr className="bg-light py-1 mt-0"/>
        </div>
      </div>
      {this._renderVotes()}
    </div>);
  };

};
