import test from 'node:test';import assert from 'node:assert/strict';import {access,readFile} from 'node:fs/promises';import {houses,rounds} from '../houses.mjs';
test('every story accepts all visually suitable homes, including alternate solutions',async()=>{
 const expected=[['family','bunk'],['greenhouse'],['office'],['bunk'],['art'],['library'],['nursery'],['music'],['patio'],['classic','family','office','nursery','patio']];
 rounds.forEach((r,i)=>{const first=houses.filter(h=>h.features.includes(r.facts[0].feature));assert.ok(first.length>1,r.title);const final=houses.filter(h=>r.facts.every(f=>h.features.includes(f.feature)));assert.deepEqual(final.map(h=>h.id),expected[i],r.title);});
 await Promise.all(houses.map(h=>access('assets/'+h.image)));await access('assets/realtor.png');
});
test('oral activity has no text inputs and all visible copy is English',async()=>{const html=await readFile('index.html','utf8');assert.doesNotMatch(html,/<textarea|<input|[а-яА-Я]/);assert.match(html,/Check this home/);});

