import test from 'node:test';import assert from 'node:assert/strict';
import {createGame,selectHouse,checkHome,advance} from '../logic.mjs';
import {houses,rounds} from '../houses.mjs';
test('first choice reveals a second fact; mismatch can be retried without losing progress',()=>{
 let s=createGame(rounds,houses);s=checkHome(s,rounds,houses);assert.equal(s.phase,'reveal');assert.equal(s.score,0);
 assert.equal(checkHome(s,rounds,houses),s);
 s=advance(s,rounds);assert.equal(s.factIndex,1);s=checkHome(s,rounds,houses);assert.equal(s.phase,'search');assert.match(s.feedback,/two beds for the children/);
 s=selectHouse(s,1,houses);s=checkHome(s,rounds,houses);assert.equal(s.phase,'matched');assert.equal(s.score,1);assert.equal(checkHome(s,rounds,houses),s);
});
test('every story can be completed and the game ends with exactly ten matches',()=>{
 let s=createGame(rounds,houses);
 for(const r of rounds){s=selectHouse(s,houses.findIndex(h=>h.id===r.answer),houses);s=checkHome(s,rounds,houses);s=advance(s,rounds);s=checkHome(s,rounds,houses);assert.equal(s.phase,'matched');s=advance(s,rounds);}
 assert.equal(s.phase,'finished');assert.equal(s.score,10);assert.equal(checkHome(s,rounds,houses),s);
});
test('unanswered clues cannot be skipped and navigation wraps',()=>{const s=createGame(rounds,houses);assert.equal(advance(s,rounds),s);assert.equal(selectHouse(s,-1,houses).selectedHouseIndex,9);});

