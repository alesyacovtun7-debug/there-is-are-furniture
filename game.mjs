import { houses, rounds } from './houses.mjs';
import { createGame, selectHouse, checkHome, advance } from './logic.mjs';
const $=id=>document.getElementById(id);
let state=createGame(rounds,houses);
let soundEnabled=true;
let houseReady=false;
let displayedHouse='';
const prefetchedHouses=new Set();
function showHouse(house,index,force=false){
 const src='./assets/'+encodeURIComponent(house.image);
 if(displayedHouse===src&&!force)return;
 displayedHouse=src;houseReady=false;
 const img=$('house-image'),status=$('house-load-status');
 img.style.visibility='hidden';status.hidden=false;status.textContent='Loading home '+(index+1)+'…';
 $('retry-house').hidden=true;$('check-button').disabled=true;$('zoom-button').disabled=true;
 img.onload=()=>{
  if(!img.complete||!img.naturalWidth)return;
  houseReady=true;img.style.visibility='visible';status.hidden=true;
  $('retry-house').hidden=true;$('check-button').disabled=false;$('zoom-button').disabled=false;
  // Warm only neighbouring houses, after the selected image is visible.
  for(const offset of [-1,1]){
   const neighbour=houses[(index+offset+houses.length)%houses.length];
   if(prefetchedHouses.has(neighbour.image))continue;
   prefetchedHouses.add(neighbour.image);
   const next=new Image();next.src='./assets/'+encodeURIComponent(neighbour.image);
  }
 };
 img.onerror=()=>{houseReady=false;img.style.visibility='hidden';status.hidden=false;status.textContent='This home could not load. Please try again.';$('retry-house').hidden=false;$('check-button').disabled=true;$('zoom-button').disabled=true;};
 img.src=src;
 if(img.complete&&img.naturalWidth)img.onload();
}
function speak(text){if(!soundEnabled||!window.speechSynthesis)return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.88;const voice=window.speechSynthesis.getVoices().find(v=>v.lang.startsWith('en'));if(voice)u.voice=voice;window.speechSynthesis.speak(u);}
function render(){
 const finished=state.phase==='finished';$('game').hidden=finished;$('results-screen').hidden=!finished;
 if(finished){$('final-score').textContent=state.score+' happy clients out of '+rounds.length;return;}
 const round=rounds[state.roundIndex],house=houses[state.selectedHouseIndex],fact=round.facts[state.factIndex];
 const client=round.client;
 $('client-portrait').src='./assets/'+client.portrait;
 $('client-portrait').alt=client.name+', your client';
 $('client-label').textContent=client.name.toUpperCase()+' · YOUR CLIENT';
 $('speaking-title').textContent='Tell '+client.name+' about this home.';
 $('listen-button').textContent='Listen to '+client.name;
 $('round-label').textContent='Story '+(state.roundIndex+1)+' / '+rounds.length;
 $('progress-fill').style.width=((state.roundIndex+(state.phase==='matched'?1:0))/rounds.length*100)+'%';
 $('story-title').textContent=round.title;
 $('clues').replaceChildren();
 round.facts.forEach((f,i)=>{const item=document.createElement('div');item.className='clue '+(i>state.factIndex?'locked':i===state.factIndex?'current':'revealed');const label=document.createElement('span');label.textContent='FACT '+(i+1);const text=document.createElement('p');text.textContent=i>state.factIndex?'A little surprise… Find a home to unlock it.':f.text;item.append(label,text);$('clues').append(item);});
 showHouse(house,state.selectedHouseIndex);$('house-image').alt='Home '+(state.selectedHouseIndex+1)+' — a cutaway showing all rooms';
 $('house-counter').textContent='HOME '+String(state.selectedHouseIndex+1).padStart(2,'0')+' / 10';
 $('house-picks').innerHTML=houses.map((h,i)=>'<button class="house-pick '+(i===state.selectedHouseIndex?'active':'')+'" data-index="'+i+'" aria-label="Home '+(i+1)+'" aria-pressed="'+(i===state.selectedHouseIndex)+'" '+(state.phase!=='search'?'disabled':'')+'>'+String(i+1).padStart(2,'0')+'</button>').join('');
 $('request').textContent=state.phase==='matched'?'This is the one! Thank you for finding my new home.':fact.text;
 $('agent-response').textContent=state.feedback||(state.factIndex===0?'Let’s help '+client.name+' find a home. Describe the rooms and furniture using There is or There are.':'A new fact! The home must fit BOTH clues. You can keep this home or find a better one.');
 $('check-button').hidden=state.phase!=='search';$('continue-button').hidden=state.phase==='search';
 $('continue-button').textContent=state.phase==='reveal'?'Reveal the next fact':state.roundIndex===rounds.length-1?'See your results':'Start the next story';
 $('previous-house').disabled=$('next-house').disabled=state.phase!=='search';
 $('example').hidden=true;
 $('example-button').hidden=state.phase!=='search';
 document.body.dataset.phase=state.phase;
}
function choose(index){state=selectHouse(state,index,houses);window.speechSynthesis?.cancel();render();}
$('previous-house').onclick=()=>choose(state.selectedHouseIndex-1);
$('next-house').onclick=()=>choose(state.selectedHouseIndex+1);
$('house-picks').onclick=e=>{const b=e.target.closest('[data-index]');if(b)choose(Number(b.dataset.index));};
$('check-button').onclick=()=>{if(!houseReady)return;state=checkHome(state,rounds,houses);render();speak(state.feedback);};
$('retry-house').onclick=()=>showHouse(houses[state.selectedHouseIndex],state.selectedHouseIndex,true);
$('continue-button').onclick=()=>{state=advance(state,rounds);window.speechSynthesis?.cancel();render();};
$('example-button').onclick=()=>{const fact=rounds[state.roundIndex].facts[state.factIndex];const house=houses[state.selectedHouseIndex];const has=house.features.includes(fact.feature);$('example').textContent=has?(fact.models?.[house.id]||fact.model):fact.negative.split('. ')[0]+'.';$('example').hidden=!$('example').hidden;};
$('listen-button').onclick=()=>speak($('request').textContent);
$('agent-listen').onclick=()=>speak($('agent-response').textContent);
$('sound-toggle').onclick=()=>{soundEnabled=!soundEnabled;if(!soundEnabled)window.speechSynthesis?.cancel();$('sound-toggle').textContent=soundEnabled?'Sound on':'Sound off';$('sound-toggle').setAttribute('aria-pressed',String(soundEnabled));};
$('restart-button').onclick=()=>{state=createGame(rounds,houses);window.speechSynthesis?.cancel();render();};
$('zoom-button').onclick=()=>{$('large-image').src=$('house-image').src;$('large-image').alt=$('house-image').alt;$('image-dialog').showModal();};
$('close-zoom').onclick=()=>$('image-dialog').close();
document.addEventListener('keydown',e=>{if(e.altKey||e.ctrlKey||e.metaKey||$('image-dialog').open)return;if(e.key==='ArrowLeft'){e.preventDefault();choose(state.selectedHouseIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();choose(state.selectedHouseIndex+1);}});
render();

