/* BM25: Robertson/Lucene positive IDF, k1=1.2, b=0.75. */
(function(root){
'use strict';
const stop=new Set('a an and are as at be been being but by can did do does for from had has have he her hers him his how i if in into is it its me my of on or our ours she so than that the their them then there these they this those to too was we were what when where which who why will with you your'.split(' '));
function normalize(s){return s.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase();}
function tokens(s){return (normalize(s).match(/[\p{L}\p{N}]+/gu)||[]).filter(t=>!stop.has(t));}
function build(documents){const postings=Object.create(null),lengths=[];documents.forEach((d,i)=>{const ts=tokens(d.text),tf=Object.create(null);lengths.push(ts.length);for(const t of ts)tf[t]=(tf[t]||0)+1;for(const t of Object.keys(tf)){if(!postings[t])postings[t]=[];postings[t].push([i,tf[t]]);}});return {documents,postings,lengths,averageLength:lengths.reduce((a,b)=>a+b,0)/Math.max(1,documents.length)};}
function search(index,query,options={}){const terms=[...new Set(tokens(query))],N=index.documents.length,scores=new Float64Array(N),counts=new Uint32Array(N),hits=new Uint32Array(N);for(const t of terms){const list=index.postings[t]||[],idf=Math.log(1+(N-list.length+0.5)/(list.length+0.5));for(const [i,tf]of list){scores[i]+=idf*(tf*2.2)/(tf+1.2*(0.25+0.75*index.lengths[i]/(index.averageLength||1)));counts[i]+=tf;hits[i]++;}}
let rows=[];index.documents.forEach((d,i)=>{if(options.caseId&&String(d.caseId)!==String(options.caseId))return;if(options.episode&&d.id!==options.episode)return;if(terms.length&&(options.mode==='all'?hits[i]!==terms.length:!hits[i]))return;rows.push({document:d,score:scores[i],matches:counts[i],termsMatched:hits[i]});});if(!terms.length&&query.trim())rows=[];rows.sort((a,b)=>(options.sort==='matches'?b.matches-a.matches:b.score-a.score)||a.document.id.localeCompare(b.document.id,undefined,{numeric:true}));return {rows,terms};}
const api={normalize,tokens,build,search};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.ExposeSearch=api;
})(typeof window==='undefined'?globalThis:window);
