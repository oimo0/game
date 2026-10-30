import test from 'node:test';
import assert from 'node:assert/strict';
import {controlsFor} from '../src/controls.js';
import {games} from '../src/games.js';
import {ArcadeEngine} from '../src/engine.js';
globalThis.window={addEventListener(){},removeEventListener(){}};globalThis.devicePixelRatio=1;globalThis.ResizeObserver=class{observe(){}disconnect(){}};globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
function canvas(){const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{}});return{style:{},getContext:()=>ctx,parentElement:{getBoundingClientRect:()=>({width:900,height:600}),getClientRects:()=>[1]},addEventListener(){},removeEventListener(){},setPointerCapture(){},getBoundingClientRect:()=>({left:0,top:0})}}
function engine(type){const e=new ArcadeEngine(canvas(),canvas());e.sound=false;e.start(games.find(g=>g.type===type));return e}
const pointer=(x,y,id=1)=>({clientX:x,clientY:y,pointerId:id,button:0,preventDefault(){}});
test('all 50 games have an explicit input profile',()=>{for(const g of games){const p=controlsFor(g);assert.ok(p.hint.length>15,g.id);assert.ok(Array.isArray(p.buttons));assert.ok(p.buttons.every(b=>b.key||b.command))}});
test('gravity button is only present for gravity level',()=>{assert.ok(controlsFor(games.find(g=>g.theme==='gravity')).buttons.some(b=>b.key==='g'));assert.ok(!controlsFor(games.find(g=>g.theme==='platform')).buttons.some(b=>b.key==='g'))});
test('race has simultaneous held steering, throttle and brake',()=>{const p=controlsFor(games[0]);for(const k of ['arrowleft','arrowright','arrowup','arrowdown','shift',' '])assert.ok(p.buttons.find(b=>b.key===k&&b.hold))});
test('runner swipe changes exactly one lane; tap jumps',()=>{const e=engine('runner');e.pointerDown(pointer(200,300));e.pointerUp(pointer(100,300));assert.equal(e.state.player.lane,0);e.pointerDown(pointer(100,300));e.pointerUp(pointer(100,300));assert.ok(e.state.player.vy<0);e.dispose()});
test('shooter dragging tracks finger and firing stops on release',()=>{const e=engine('shooter');e.pointerDown(pointer(150,400));assert.equal(e.state.pointerFire,true);e.pointerMove(pointer(300,430));assert.equal(e.state.player.x,300);assert.equal(e.state.player.y,395);e.pointerUp(pointer(300,430));assert.equal(e.state.pointerFire,false);e.dispose()});
test('pointer cancellation releases shooting and gesture',()=>{const e=engine('shooter');e.pointerDown(pointer(200,400));e.pointerCancel();assert.equal(e.gesture,null);assert.equal(e.state.pointerFire,false);e.dispose()});
test('repeated held lane key is not interpreted as repeated taps',()=>{const e=engine('runner');e.pressKey('arrowright');e.pressKey('arrowright');assert.equal(e.state.player.lane,2);e.releaseKey('arrowright');e.pressKey('arrowleft');assert.equal(e.state.player.lane,1);e.dispose()});
test('sudoku tap selects, keypad enters, erase preserves given cells',()=>{const e=engine('sudoku'),s=e.state;e._sudokuClick({x:405,y:165});assert.equal(s.selected,1);assert.equal(s.grid[1],0);e.pressKey('2');e.releaseKey('2');assert.equal(s.grid[1],2);e.pressKey('backspace');e.releaseKey('backspace');assert.equal(s.grid[1],0);s.selected=0;e.pressKey('backspace');assert.equal(s.grid[0],1);e.dispose()});
test('flag mode taps flag without revealing a tile',()=>{const e=engine('mines');assert.equal(e.command('flag-mode'),true);e._pointerAction({x:300,y:150},{});assert.equal(e.state.flags.size,1);assert.equal(e.state.revealed.size,0);assert.equal(e.command('flag-mode'),false);e.dispose()});
test('dash has cooldown and stays inside arena',()=>{const e=engine('survival');e.state.player.dx=1;e.state.player.dy=0;e.command('dash');const x=e.state.player.x;e.command('dash');assert.equal(e.state.player.x,x);assert.ok(e.state.dash>0);e.dispose()});
test('pause clears keyboard and pointer inputs',()=>{const e=engine('shooter');e.pressKey(' ');e.pointerDown(pointer(200,400));e.pause();assert.equal(e.keys.size,0);assert.equal(e.state.pointerFire,false);e.pressKey('arrowright');assert.equal(e.keys.size,0);e.dispose()});
test('gravity is a one-tap action without waiting a frame',()=>{const e=engine('platformer');e.start(games.find(g=>g.theme==='gravity'));e.pressKey('g');e.releaseKey('g');assert.equal(e.state.gravity,-1);e.dispose()});
// Verify browser input lifecycle with a minimal event-capable DOM adapter.
class Element {
 constructor(){this.children=[];this.events={};this.style={};this.attributes={};this.dataset={};this.classList={add(){},remove(){}}}
 append(e){this.children.push(e)}replaceChildren(){this.children=[]}setAttribute(k,v){this.attributes[k]=v}querySelectorAll(){return []}setPointerCapture(id){this.captured=id}addEventListener(k,fn){(this.events[k]??=[]).push(fn)}emit(k,e={}){for(const fn of this.events[k]||[])fn({preventDefault(){},stopPropagation(){},...e})}
}
const {TouchControls}=await import('../src/controls.js');
function touch(){globalThis.document={createElement:()=>new Element(),addEventListener(){}};const calls=[];const runtime={running:true,pressKey:k=>calls.push(['press',k]),releaseKey:k=>calls.push(['release',k])};const host=new Element(),control=new TouchControls(host,()=>runtime);control.configure(games[0]);return{calls,control,buttons:host.children[0].children}}
test('captured pointer cancellation releases a held pedal',()=>{const{calls,buttons}=touch();const gas=buttons[3];gas.emit('pointerdown',{pointerId:8});assert.equal(gas.captured,8);gas.emit('pointercancel',{pointerId:8});assert.deepEqual(calls,[['press','arrowup'],['release','arrowup']])});
test('steering and throttle can be held together and reset together',()=>{const{calls,buttons,control}=touch();buttons[0].emit('pointerdown',{pointerId:1});buttons[3].emit('pointerdown',{pointerId:2});control.release();assert.deepEqual(calls,[['press','arrowleft'],['press','arrowup'],['release','arrowleft'],['release','arrowup']])});
test('keyboard activation of held controls releases on keyup',()=>{const{calls,buttons}=touch();buttons[3].emit('keydown',{key:'Enter'});buttons[3].emit('keyup',{key:'Enter'});assert.deepEqual(calls,[['press','arrowup'],['release','arrowup']])});
