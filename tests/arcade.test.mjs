import test from 'node:test';
import assert from 'node:assert/strict';
import {ArcadeEngine} from '../src/engine.js';
import {games} from '../src/games.js';
globalThis.window={addEventListener(){},removeEventListener(){}};
globalThis.devicePixelRatio=1;
globalThis.ResizeObserver=class{observe(){}disconnect(){}};
globalThis.requestAnimationFrame=()=>1;
globalThis.cancelAnimationFrame=()=>{};
function canvas(){const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{}});return{style:{},getContext:()=>ctx,parentElement:{getBoundingClientRect:()=>({width:900,height:600}),getClientRects:()=>[1]},addEventListener(){},removeEventListener(){},getBoundingClientRect:()=>({left:0,top:0,width:900,height:600})}}
for(const g of games.filter(g=>!['kart','space','lander','orbit','slingshot','constellation'].includes(g.type)))test(`${g.id}: start, advance, draw, pause and restart`,()=>{const engine=new ArcadeEngine(canvas(),canvas());engine.sound=false;engine.start(g);for(let i=0;i<180&&!engine.done;i++){engine.elapsed+=1/60;engine._stepGame(1/60);engine._drawGame(1/60)}engine.pause();assert.equal(engine.running,false);engine.start(g);assert.equal(engine.score,0);assert.equal(engine.done,false);assert.ok(engine.state);engine.dispose()});
test('catalog has 55 unique entries; exploration is untimed',()=>{assert.equal(games.length,55);assert.equal(new Set(games.map(g=>g.id)).size,55);assert.ok(games.every(g=>g.type==='space'?g.duration===0:g.duration>0))});
