import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {houses, rounds} from '../houses.mjs';

test('navigation hides a pending house and prevents checking unseen furniture', async()=>{
 const nodes=new Map();
 const element=()=>({style:{},dataset:{},hidden:false,disabled:false,complete:false,naturalWidth:0,
  replaceChildren(){},append(){},setAttribute(){}});
 const get=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);};
 const document={getElementById:get,createElement:element,body:element(),addEventListener(){}};
 const code=await readFile('standalone.js','utf8');
 runInNewContext(code,{document,window:{},Image:class {}});
 const img=get('house-image'),check=get('check-button');
 assert.equal(check.disabled,true,'cannot check a house before its image loads');
 assert.equal(img.style.visibility,'hidden','do not leave the previous image visible');
 img.complete=true;img.naturalWidth=1536;img.onload();
 assert.equal(check.disabled,false);
 assert.equal(img.style.visibility,'visible');
 const first=img.src;
 img.complete=false;img.naturalWidth=0;
 get('next-house').onclick();
 assert.notEqual(img.src,first);
 assert.match(get('house-counter').textContent,/02/);
 assert.equal(check.disabled,true);
 assert.equal(img.style.visibility,'hidden');
 img.onerror();
 assert.match(get('house-load-status').textContent,/load/i);
 assert.equal(get('retry-house').hidden,false);
 assert.equal(check.disabled,true);
 get('retry-house').onclick();
 img.complete=true;img.naturalWidth=1536;img.onload();
 assert.equal(check.disabled,false);
 assert.equal(get('retry-house').hidden,true);
});

test('published houses and portraits have a small transfer budget',async()=>{
 for(const file of [...houses.map(h=>h.image),...rounds.map(r=>r.client.portrait)]){
  assert.ok((await stat('assets/'+file)).size<450_000,file+' should be under 450 KB');
 }
});
