export const URL =  window.location.protocol+"//"+window.location.hostname;
var api = URL+':8080';
if(window.location.hostname!='location')
  api = 'https://voteapi.builtwithblockchain.io';
export const API=api;
