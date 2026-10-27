/* Four-case coded evidence browser. Source data is inserted only as text. */
(function () {
  'use strict';
  const D = window.EXPOSE_CODED;
  const $ = id => document.getElementById(id);
  const fields = ['case', 'episode', 'group', 'variable', 'strategy', 'tactic', 'year'];
  const colors = {Ignoring:'#1f8fd6',Deceiving:'#e4572e',Obfuscating:'#8a5cf6',Violation:'#c1121f'};
  let current = [], limit = 30;
  function option(id, values, all) {
    $(id).replaceChildren(new Option(all, ''));
    values.forEach(([value,label]) => $(id).add(new Option(label,value)));
  }
  const unique = a => [...new Set(a)].sort();
  option('case',D.cases.map(c=>[String(c.id),c.name+' · Case '+c.id]),'All four cases');
  function populateEpisodes() {
    const selected=$('episode').value;
    option('episode',D.episodes.filter(e=>!$('case').value||String(e.caseId)===$('case').value).map(e=>[e.id,`${e.case} ${e.id} · ${e.start} – ${e.end}`]),'All episodes');
    if([...$('episode').options].some(o=>o.value===selected)) $('episode').value=selected;
  }
  populateEpisodes();
  option('group',['Goods','Money','Services','Other'].map(x=>[x,x]),'All groups');
  const vars = [...new Map(D.variables.map(v=>[v.variableId,v])).values()];
  option('variable',vars.map(v=>[v.variableId,`${v.variableId} · ${v.variable}`]),'All variables (including uncoded)');
  option('strategy',['Ignoring','Deceiving','Obfuscating','Violation','Strategy not coded'].map(x=>[x,x]),'All strategies');
  option('tactic',unique(D.records.flatMap(r=>r.tactics)).map(x=>[x,x]),'All tactics');
  option('year',unique(D.records.map(r=>r.reportYear).filter(Boolean)).reverse().map(x=>[x,x]),'All report years');
  const initial = new URLSearchParams(location.search);
  fields.forEach(f=>{if ([...$(f).options].some(o=>o.value===initial.get(f))) $(f).value=initial.get(f);});
  populateEpisodes();
  $('q').value = initial.get('q') || '';
  if (['source','newest','oldest'].includes(initial.get('sort'))) $('sort').value=initial.get('sort');
  function node(tag,text,cls) {const n=document.createElement(tag);n.textContent=text;if(cls)n.className=cls;return n;}
  function detail(dl,label,value) {dl.append(node('dt',label),node('dd',value));}
  function card(r) {
    const ep=D.episodes.find(e=>e.id===r.episode);
    const a=node('article','','case');a.style.setProperty('--c',colors[r.strategies[0]]||'#1f8fd6');
    const top=node('div','','top');top.append(node('span',r.case+' · Episode '+r.episode,'badge'),node('span',r.reportYear || 'Year unspecified','badge year'),node('span',r.id,'id'));
    a.append(top,node('h3',r.variable));
    const tags=node('div','','tags');r.strategies.forEach(s=>{const t=node('span',s,'tag');t.style.setProperty('--c',colors[s]);tags.append(t);});a.append(tags);
    a.append(node('p',r.group+' · '+(r.tactics.join(' · ') || 'No tactic specified'),'coding'));
    const preview=r.example.length>300?r.example.slice(0,300)+'…':r.example;a.append(node('p',preview,'sum'));
    const details=document.createElement('details');details.append(node('summary','Read full example and source'));
    details.append(node('p',r.example,'source-excerpt'));
    const dl=document.createElement('dl');
    detail(dl,'Case label in source document',r.sourceCaseLabel);
    detail(dl,'Episode period',ep.start+' – '+ep.end);
    detail(dl,'Variable',r.variableId+' · '+r.group+' · '+r.variable);
    detail(dl,'Original strategy and tactic coding',r.codingOriginal);
    detail(dl,'Source location',`${r.sourceFile} · table ${r.sourceTable} · row ${r.sourceRow}`);
    detail(dl,'Excerpt identifier',r.excerptId);
    const dd=document.createElement('dd');r.reports.forEach(symbol=>{const link=node('a',symbol);link.href='https://docs.un.org/en/'+symbol;link.target='_blank';link.rel='noopener noreferrer';dd.append(link,document.createTextNode(' '));});
    dl.append(node('dt','Report references extracted from supplied text'),dd);details.append(dl);a.append(details);return a;
  }
  function render() {
    $('cases').replaceChildren();
    if (!current.length) $('cases').append(node('p','No coded examples match these filters. A blank variable does not establish absence of evasion.','empty'));
    current.slice(0,limit).forEach(r=>$('cases').append(card(r)));
    $('more').hidden=limit>=current.length;
    $('count').textContent=`${current.length} of ${D.records.length} coded rows · ${new Set(current.map(r=>r.excerptId)).size} distinct excerpts · ${Math.min(limit,current.length)} displayed`;
  }
  function update() {
    const q=$('q').value.trim().toLowerCase();
    current=D.records.filter(r=>(!$('case').value||String(r.caseId)===$('case').value)&&(!$('episode').value||r.episode===$('episode').value)&&(!$('group').value||r.group===$('group').value)&&(!$('variable').value||r.variableId===$('variable').value)&&(!$('strategy').value||r.strategies.includes($('strategy').value))&&(!$('tactic').value||r.tactics.includes($('tactic').value))&&(!$('year').value||String(r.reportYear)===$('year').value)&&(!q||JSON.stringify(r).toLowerCase().includes(q)));
    if ($('sort').value!=='source') current.sort((a,b)=>($('sort').value==='newest'?-1:1)*((a.reportYear||0)-(b.reportYear||0))||a.id.localeCompare(b.id));
    const ep=D.episodes.find(e=>e.id===$('episode').value);
    $('episode-info').textContent=ep?`Episode ${ep.id}: ${ep.start} – ${ep.end}. Source: ${ep.file}.`:'Four cases · 16 episodes. Ongoing dates follow the source documents at 31/12/2025.';
    const p=new URLSearchParams();fields.concat(['q','sort']).forEach(f=>{if($(f).value&&$(f).value!=='source')p.set(f,$(f).value);});
    try{history.replaceState(null,'',location.pathname+(p.size?'?'+p.toString():''));}catch(e){}
    limit=30;render();
  }
  fields.concat(['sort']).forEach(f=>$(f).addEventListener('change',()=>{if(f==='case')populateEpisodes();update();}));$('q').addEventListener('input',update);
  $('clear').addEventListener('click',()=>{fields.forEach(f=>$(f).value='');$('q').value='';$('sort').value='source';populateEpisodes();update();});
  $('more').addEventListener('click',()=>{limit+=30;render();});
  $('csv').addEventListener('click',()=>{
    const head=['id','caseId','case','sourceCaseLabel','episode','episodeStart','episodeEnd','variableId','group','variable','strategies','tactics','codingOriginal','example','reports','reportYear','sourceFile','sourceTable','sourceRow','excerptId'];
    const escape=v=>'"'+String(v??'').replace(/"/g,'""')+'"';
    const rows=current.map(r=>{const ep=D.episodes.find(e=>e.id===r.episode);const row={...r,episodeStart:ep.start,episodeEnd:ep.end};return head.map(k=>escape(Array.isArray(row[k])?row[k].join('; '):row[k])).join(',');});
    const url=URL.createObjectURL(new Blob(['\uFEFF'+[head.join(','),...rows].join('\r\n')],{type:'text/csv;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='expose-four-cases-coded-rows.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  update();
})();
