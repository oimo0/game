import {json2satrec,sgp4,gstime,eciToEcf,eciToGeodetic} from './vendor/satellite.es.js?v=science-1';
import {AstroTime,SiderealTime,Rotation_EQD_EQJ,RotateVector,Vector} from './vendor/astronomy.js?v=science-1';
import {starlinkData} from './data/starlink-omm.js?v=science-1';
import {icrfToWorld,add} from './model.js?v=science-1';
export {starlinkData};
export function preciseEpochMs(text){const s=text.endsWith('Z')?text:text+'Z',digits=(text.match(/\.(\d+)/)||[0,'0'])[1],fraction=Number('0.'+digits)*1000;return Date.parse(s)+fraction-Math.floor(fraction)}
export class SatelliteCatalog{
 constructor(data=starlinkData){this.install(data)}
 install(data){this.data=data;this.records=data.records.map(omm=>({omm,record:json2satrec(omm),epoch:preciseEpochMs(omm.EPOCH)}));this.lastTime=null}
 propagate(ms,earth){const astro=new AstroTime(new Date(ms));astro.tt=(ms/86400000+2440587.5+69.184/86400)-2451545;const rotation=Rotation_EQD_EQJ(astro),eqeq=SiderealTime(astro)*Math.PI/12-gstime(new Date(ms)),co=Math.cos(eqeq),si=Math.sin(eqeq);const result=[];for(const s of this.records){const age=(ms-s.epoch)/86400000;if(Math.abs(age)>3)continue;const state=sgp4(s.record,(ms-s.epoch)/60000);if(!state?.position||![state.position.x,state.position.y,state.position.z].every(Number.isFinite))continue;const p=state.position,v=RotateVector(rotation,new Vector(co*p.x-si*p.y,si*p.x+co*p.y,p.z,astro));const geodetic=eciToGeodetic(p,gstime(new Date(ms)));result.push({name:s.omm.OBJECT_NAME,id:s.omm.NORAD_CAT_ID,epoch:s.omm.EPOCH,age,altitudeKm:geodetic.height,velocity:Math.hypot(state.velocity.x,state.velocity.y,state.velocity.z),position:add(earth,icrfToWorld([v.x,v.y,v.z])),teme:[p.x,p.y,p.z],earthFixed:eciToEcf(p,gstime(new Date(ms)))})}return result}
 async refresh(){const response=await fetch('https://celestrak.org/NORAD/elements/gp.php?GROUP=starlink&FORMAT=JSON',{signal:AbortSignal.timeout(12000)});if(!response.ok)throw Error('衛星データを更新できませんでした');const all=await response.json();if(!Array.isArray(all)||!all.length)throw Error('衛星データが空です');const records=Array.from({length:Math.min(256,all.length)},(_,i)=>all[Math.round(i*(all.length-1)/Math.min(255,all.length-1))]);this.install({...starlinkData,records,catalogCount:all.length,retrieved:new Date().toISOString()});return records.length}
}
