export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const bodies=[
 {name:'太陽',en:'SUN',r:6,d:0,speed:0,phase:0,color:'#ffd27c',kind:0,info:'星々を照らす光の中心。表面の揺らぎも観察してみよう。'},
 {name:'水星',en:'MERCURY',r:.75,d:20,speed:.19,phase:2,color:'#b6a89c',kind:1,info:'クレーターのある小さな岩石の世界。'},
 {name:'金星',en:'VENUS',r:1.8,d:32,speed:.14,phase:4,color:'#e8bd85',kind:2,info:'厚い雲に包まれた、淡い金色の惑星。'},
 {name:'地球',en:'EARTH',r:2.3,d:48,speed:.1,phase:.4,color:'#4ca9ff',kind:3,info:'青い海と雲、その周りを巡る衛星の光を探そう。'},
 {name:'火星',en:'MARS',r:1.2,d:66,speed:.08,phase:2.3,color:'#d87a54',kind:4,info:'赤茶色の大地と明るい極を眺めよう。'},
 {name:'木星',en:'JUPITER',r:4.7,d:95,speed:.045,phase:4.7,color:'#d9b48c',kind:5,info:'流れるような縞模様を持つ、大きなガスの世界。'},
 {name:'土星',en:'SATURN',r:4,d:128,speed:.033,phase:1.4,color:'#e8d6a6',kind:6,info:'氷の粒をイメージした幾重もの環を、角度を変えて観察。'},
 {name:'天王星',en:'URANUS',r:2.6,d:158,speed:.023,phase:3.1,color:'#8fe0e0',kind:7,info:'静かな青緑色の惑星。'},
 {name:'海王星',en:'NEPTUNE',r:2.5,d:188,speed:.018,phase:5.4,color:'#587dec',kind:8,info:'遠くに浮かぶ深い青色の惑星。'},
 {name:'月',en:'MOON',r:.64,d:0,speed:0,phase:0,color:'#bbc1cc',kind:1,info:'地球を巡る月。近づいてクレーターを見てみよう。'}
];
export function positions(time){const p=bodies.map(b=>[Math.cos(time*b.speed+b.phase)*b.d,0,Math.sin(time*b.speed+b.phase)*b.d]);p[9]=[p[3][0]+Math.cos(time*.5)*6,.5,p[3][2]+Math.sin(time*.5)*6];return p}
// Illustrative constellation, not live SpaceX ephemerides. 6 planes × 12 spacecraft.
export function satellites(time,earth){const list=[];for(let plane=0;plane<6;plane++)for(let i=0;i<12;i++){const a=i*Math.PI/6+time*.38+plane*.13,node=plane*Math.PI/6,inc=.925,r=2.82,x=Math.cos(a)*r,z=Math.sin(a)*Math.cos(inc)*r,y=Math.sin(a)*Math.sin(inc)*r;list.push([earth[0]+x*Math.cos(node)-z*Math.sin(node),y,earth[2]+x*Math.sin(node)+z*Math.cos(node)])}return list}
export const add=(a,b)=>a.map((v,i)=>v+b[i]);export const sub=(a,b)=>a.map((v,i)=>v-b[i]);export const mul=(a,s)=>a.map(v=>v*s);export const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);export const unit=a=>mul(a,1/(Math.hypot(...a)||1));export const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export function cameraBasis(yaw,pitch){const forward=unit([-Math.sin(yaw)*Math.cos(pitch),-Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch)]),right=unit(cross(forward,[0,1,0]));return {forward,right,up:cross(right,forward)}}
export function advanceFlight(state,move,dt){const basis=cameraBasis(state.yaw,state.pitch),speed=state.boost?25:7;state.free=add(state.free,mul(add(mul(basis.right,move.x),mul(basis.forward,-move.y)),speed*dt));return state.free}
