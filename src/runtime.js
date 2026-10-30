import {ArcadeEngine} from './engine.js';
export class GameRuntime{
 constructor(gl,canvas,callbacks){this.gl=gl;this.canvas=canvas;this.cb=callbacks;this.active=null;this.kind=null;this._sound=true}
 async start(game){const request=this.requestId=(this.requestId||0)+1;const kind=game.type==='kart'?'racing':'arcade';if(this.kind!==kind){let RacingEngine;if(kind==='racing'){({RacingEngine}=await import('./race/racing.js'));if(request!==this.requestId)return false}this.active?.dispose();this.gl=this.replace(this.gl);this.canvas=this.replace(this.canvas);this.canvas.style.pointerEvents='';this.active=kind==='racing'?new RacingEngine(this.gl,this.canvas,this.cb):new ArcadeEngine(this.gl,this.canvas,this.cb);this.kind=kind}this.active.sound=this._sound;this.active.start(game);return true}
 replace(canvas){const next=canvas.cloneNode(false);canvas.replaceWith(next);return next}
 get game(){return this.active?.game}get running(){return this.active?.running||false}get done(){return this.active?.done||false}set sound(value){this._sound=value;if(this.active)this.active.sound=value}get sound(){return this._sound}
 pause(){this.cb.onInputReset?.();this.requestId=(this.requestId||0)+1;this.active?.pause()}resume(){this.active?.resume()}pressKey(k){this.active?.pressKey(k)}releaseKey(k){this.active?.releaseKey(k)}action(){this.active?.action()}command(name,value){return this.active?.command?.(name,value)}dispose(){this.active?.dispose()}
}
