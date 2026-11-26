export function createGame(rounds, houses) {
  if (!rounds.length || !houses.length) throw new Error('Missing game content');
  return { roundIndex:0, factIndex:0, selectedHouseIndex:0, phase:'search', score:0, attempts:0, feedback:'' };
}
export function selectHouse(state,index,houses) {
  if (state.phase!=='search') return state;
  return {...state, selectedHouseIndex:(index%houses.length+houses.length)%houses.length, feedback:''};
}
export function checkHome(state,rounds,houses) {
  if(state.phase!=='search') return state;
  const facts=rounds[state.roundIndex].facts.slice(0,state.factIndex+1);
  const house=houses[state.selectedHouseIndex];
  const missing=facts.find(f=>!house.features.includes(f.feature));
  if(missing) return {...state,attempts:state.attempts+1,feedback:missing.negative};
  const last=state.factIndex===rounds[state.roundIndex].facts.length-1;
  const name=rounds[state.roundIndex].client.name;
  return {...state,phase:last?'matched':'reveal',feedback:last?"This home fits both of "+name+"'s wishes. Great match!":"Good start! "+name+" has one more wish. Let's hear it.",score:state.score+(last?1:0)};
}
export function advance(state,rounds) {
  if(state.phase==='reveal') return {...state,factIndex:state.factIndex+1,phase:'search',feedback:''};
  if(state.phase!=='matched') return state;
  if(state.roundIndex===rounds.length-1) return {...state,phase:'finished'};
  return {...state,roundIndex:state.roundIndex+1,factIndex:0,selectedHouseIndex:0,phase:'search',feedback:''};
}

