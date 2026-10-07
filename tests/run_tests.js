/* Microscope tests: engine vs tests/expected.json (python oracle). */
'use strict';
const fs=require('fs'),path=require('path');
const M=require(path.join(__dirname,'..','engine.js'));
const items=JSON.parse(fs.readFileSync(path.join(__dirname,'expected.json'),'utf8')).items;
let pass=0,fail=0;
const tol=(a,b,t)=>Math.abs(a-b)<=t;
function ok(){pass++;}
function bad(l,a,b){fail++;console.log('FAIL '+l+': got '+JSON.stringify(a)+' want '+JSON.stringify(b));}
for(const it of items){
  const T=it.kind+' '+JSON.stringify(it.args);
  let r;
  if(it.kind==='optics'){
    r=M.optics(it.args[0],it.args[1],it.args[2],it.args[3],it.args[4]);
    const o=it.oracle;
    const good=(r===null&&o===null)||(r&&o&&r.totalMag===o.totalMag
      &&tol(r.resolutionUm,o.resolutionUm,0.002)&&tol(r.fovMm,o.fovMm,0.02)
      &&tol(r.dofUm,o.dofUm,0.02)&&tol(r.usefulMin,o.usefulMin,1)&&tol(r.usefulMax,o.usefulMax,1)
      &&r.empty===o.empty&&r.belowBand===o.belowBand);
    if(good)ok(); else bad(T,r,o);
  }else{
    r=M.maxPixelUm(it.args[0],it.args[1]);
    if((r===null&&it.oracle===null)||(r!==null&&it.oracle!==null&&tol(r,it.oracle,0.015)))ok();
    else bad(T,r,it.oracle);
  }
}
/* known reference: 100x/1.25 with 10x eyepiece at 550nm -> res 0.268um, band 625-1250, not empty */
const k=M.optics(100,1.25,10,550,20);
if(k&&k.totalMag===1000&&k.resolutionUm===0.268&&k.fovMm===0.2&&k.dofUm===0.35&&k.usefulMin===625&&k.usefulMax===1250&&!k.empty)pass++;
else bad('ref 100x oil',k,'0.268/625-1250');
/* empty magnification verdict: 100x/0.65 with 10x -> 1000 > 650 band max */
const e=M.optics(100,0.65,10,550,20);
if(e&&e.empty===true&&e.usefulMax===650)pass++; else bad('empty verdict',e,'empty');
console.log(pass+' passed, '+fail+' failed');
process.exit(fail?1:0);
