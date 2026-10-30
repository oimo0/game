#!/usr/bin/env python3
"""Rebuild the exact DE440 subset and CSPICE fixtures (development only).
Requires: pip install jplephem spiceypy numpy
No JPL API is called by the published browser application.
"""
import argparse,hashlib,json,math,pathlib,random,urllib.request
import numpy as np
import spiceypy as spice
from jplephem.spk import SPK
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE='https://naif.jpl.nasa.gov/pub/naif/generic_kernels/'
START,END=2460676.5,2462867.5
parser=argparse.ArgumentParser();parser.add_argument('--cache',type=pathlib.Path,default=ROOT/'.cache/space');args=parser.parse_args();args.cache.mkdir(parents=True,exist_ok=True)
def cached(name,path):
 dest=args.cache/name
 if not dest.exists():
  req=urllib.request.Request(BASE+path,headers={'User-Agent':'PLAYROOM-DeepField/4.0 (https://github.com/oimo0/game)'})
  with urllib.request.urlopen(req,timeout=90) as response:dest.write_bytes(response.read())
 return dest
kernel=cached('de440s.bsp','spk/planets/de440s.bsp');pck=cached('pck00011.tpc','pck/pck00011.tpc');lsk=cached('naif0012.tls','lsk/naif0012.tls')
data=ROOT/'src/space/data';data.mkdir(exist_ok=True)
chunks=[];segments=[]
for seg in SPK.open(kernel).segments:
 if seg.target in [9,199,299]:continue
 initial,step,c=seg.load_array();a=max(0,math.floor((START-initial)/step));b=min(c.shape[1],math.ceil((END-initial)/step));cut=np.ascontiguousarray(c[:,a:b,:].transpose(1,0,2),dtype='<f8').ravel()
 segments.append(dict(center=seg.center,target=seg.target,start=initial+a*step,step=step,count=b-a,degree=c.shape[2]-1,offset=sum(len(x) for x in chunks)));chunks.append(cut)
raw=np.concatenate(chunks).astype('<f8').tobytes();(data/'de440-2025-2031.bin').write_bytes(raw)
meta=dict(source='NASA/JPL DE440s',sourceUrl=BASE+'spk/planets/de440s.bsp',sourceSha256=hashlib.sha256(kernel.read_bytes()).hexdigest(),sha256=hashlib.sha256(raw).hexdigest(),frame='ICRF / J2000 equatorial',units='km',timeScale='TDB',startJd=START,endJd=END,segments=segments)
(data/'ephemeris-meta.js').write_text('export const ephemerisMeta='+json.dumps(meta,separators=(',',':'))+';\n')
for file in [kernel,pck,lsk]:spice.furnsh(str(file))
orientation={}
for code in [10,199,299,399,499,599,699,799,899,301]:
 body={}
 for key in ['POLE_RA','POLE_DEC','PM','RADII','NUT_PREC_RA','NUT_PREC_DEC','NUT_PREC_PM']:
  try:body[key]=spice.gdpool(f'BODY{code}_{key}',0,100).tolist()
  except spice.utils.exceptions.NotFoundError:pass
 try:body['ANGLES']=spice.gdpool(f'BODY{code//100}_NUT_PREC_ANGLES',0,1000).tolist()
 except spice.utils.exceptions.NotFoundError:body['ANGLES']=[]
 orientation[code]=body
(data/'orientation.js').write_text('export const orientationData='+json.dumps(orientation,separators=(',',':'))+';\n')
random.seed(440);times=[START,END-1e-6]+[START+random.random()*(END-START) for _ in range(100)]
for seg in segments:
 for k in [1,seg['count']//2,seg['count']-1]:
  t=seg['start']+k*seg['step']
  if START<t<END:times.extend([t-1e-8,t,t+1e-8])
fixtures=ROOT/'tests/fixtures';fixtures.mkdir(exist_ok=True);rows=[]
for jd in times:
 for i,target in enumerate([10,1,2,399,4,5,6,7,8,301]):
  vec,_=spice.spkezr(str(target),(jd-2451545)*86400,'J2000','NONE','10');rows.append(dict(jd=jd,body=i,position=vec[:3].tolist(),velocity=vec[3:].tolist()))
(fixtures/'de440-spice.json').write_text(json.dumps(dict(reference='NAIF CSPICE N0067 via spiceypy / original de440s.bsp',rows=rows),separators=(',',':')))
rows=[]
for jd in [START,2460980.5,2461350.123456,2462500.1]:
 for i,name in enumerate(['SUN','MERCURY','VENUS','EARTH','MARS','JUPITER','SATURN','URANUS','NEPTUNE','MOON']):
  m=spice.pxform('IAU_'+name,'J2000',(jd-2451545)*86400);rows.append(dict(jd=jd,body=i,axes=[m[:,k].tolist() for k in range(3)]))
(fixtures/'orientation-spice.json').write_text(json.dumps(dict(reference='CSPICE pxform IAU body -> J2000 / pck00011.tpc',rows=rows),separators=(',',':')))
print('Wrote',len(raw),'bytes; checksum',meta['sha256']);print('Run: node scripts/validate-space.mjs --write && npm test')
