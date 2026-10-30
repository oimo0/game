import {rasterSurface} from './surface.js?v=science-2';
let textures=new Map();
self.onmessage=({data})=>{if(data.type==='textures'){textures=new Map(data.maps);return}if(data.type==='surface'){try{const result=rasterSurface(data.job,textures);self.postMessage({id:data.id,key:data.key,i:data.i,big:data.big,...result},[result.pixels.buffer])}catch(error){self.postMessage({id:data.id,i:data.i,error:String(error)})}}};
