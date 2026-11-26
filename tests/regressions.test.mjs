import test from 'node:test';
import assert from 'node:assert/strict';
import {access} from 'node:fs/promises';
import {houses,rounds} from '../houses.mjs';
import {createGame,selectHouse,checkHome,advance} from '../logic.mjs';
test('both separate beds and a bunk bed satisfy two children needing their own beds',()=>{
 for(const id of ['family','bunk']){
 let s=selectHouse(createGame(rounds,houses),houses.findIndex(h=>h.id===id),houses);
 s=advance(checkHome(s,rounds,houses),rounds);s=checkHome(s,rounds,houses);
 assert.equal(s.phase,'matched',id);
 }
});
test('each story has a different named client and a real portrait file',async()=>{
 assert.equal(new Set(rounds.map(r=>r.client?.name)).size,10);
 assert.equal(new Set(rounds.map(r=>r.client?.portrait)).size,10);
 await Promise.all(rounds.map(r=>access('assets/'+r.client.portrait)));
});
test('feedback changes client identity with the story',()=>{
 let s={...createGame(rounds,houses),roundIndex:1};
 s=selectHouse(s,3,houses);s=checkHome(s,rounds,houses);
 assert.match(s.feedback,/Olivia/);assert.doesNotMatch(s.feedback,/Alex/);
});
