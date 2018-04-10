/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
  * give a vote to candidate and change voter statu to voted
  * @param {org.acme.votenetwork.MakeVote} MakeVote - the MakeVote to be processed
  * @transaction
  */
function MakeVote(vote) {
  // get voter
  var voter = vote.voter;
  // get candidate
  var candidate = vote.candidate;
  // if voter already voted
  if (voter.voted) {
    throw new Error('Already voted');
  }
  // if voter has not voted give a vote to candidate
  candidate.votes += 1;
  // get asset 'org.acme.votenetwork.Candidate'
  return getAssetRegistry('org.acme.votenetwork.Candidate').then(function(CandidateRegistry) {
    // Get participant 'org.acme.votenetwork.Voter'
    getParticipantRegistry('org.acme.votenetwork.Voter').then(function(participantRegistry) {
      // Modify the properties of the voter .
      voter.voted = true;
      // Update the voter in the participant registry.
      return participantRegistry.update(voter);
    }).catch(function(error) {
      // Add optional error handling here.
    });
    // update the candidate registry
    return CandidateRegistry.update(candidate);
  });
}
