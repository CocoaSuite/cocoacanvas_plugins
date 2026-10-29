// ==CocoaCanvas Plugin==
// @id lorem-ipsum
// @name Lorem Ipsum
// @name_ru Lorem Ipsum
// @version 1.0.0
// @author CocoaSuite
// @description Placeholder text in Latin, English or Russian. Fills the selected text layers or adds a new text box.
// @description_ru Текст-заглушка на латыни, английском или русском. Заполняет выделенные тексты или добавляет новый.
// @icon ¶
// @color #8B6B4E
// @permissions ui menu helper read insert edit
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const W={
 la:'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum curabitur pretium tincidunt lacus nulla gravida orci a odio nullam varius turpis et commodo pharetra est eros bibendum elit nec luctus magna felis sollicitudin mauris integer'.split(' '),
 en:'the quiet morning light falls across a small studio where people sketch new ideas share simple stories and build useful things together every detail matters from the first rough line to the final careful polish good design feels calm clear and honest it helps someone finish a task without thinking about the tool at all we test often listen closely and keep what works while letting the rest go'.split(' '),
 ru:'утренний свет мягко ложится на стол где команда рисует новые идеи обсуждает простые истории и вместе создаёт полезные вещи каждая деталь важна от первого наброска до финальной полировки хороший дизайн спокойный понятный и честный он помогает человеку закончить дело не думая об инструменте мы часто проверяем внимательно слушаем и оставляем то что работает'.split(' ')};
const START={la:'Lorem ipsum dolor sit amet',en:'The quiet morning light',ru:'Утренний свет мягко ложится'};
let seed=1;const rnd=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646};
const pick=a=>a[Math.floor(rnd()*a.length)],cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
function sentence(lang){const n=6+Math.floor(rnd()*9),w=[];for(let i=0;i<n;i++)w.push(pick(W[lang]));let s=w.join(' ');if(n>9&&rnd()<.5){const k=s.indexOf(' ',s.length/2);if(k>0)s=s.slice(0,k)+','+s.slice(k)}return cap(s)+'.'}
function para(lang){const n=3+Math.floor(rnd()*3),o=[];for(let i=0;i<n;i++)o.push(sentence(lang));return o.join(' ')}
function gen(o){seed=(o.seed||1)*7919+13;const lang=o.lang||'la',k=Math.max(1,Math.min(200,Math.round(+o.count||1)));let t;
 if(o.unit==='words'){const w=[];for(let i=0;i<k;i++)w.push(pick(W[lang]));t=cap(w.join(' '))}
 else if(o.unit==='sentences'){const s=[];for(let i=0;i<k;i++)s.push(sentence(lang));t=s.join(' ')}
 else{const p=[];for(let i=0;i<Math.min(k,30);i++)p.push(para(lang));t=p.join('\n\n')}
 if(o.start){const st=START[lang];if(o.unit==='words'){const w=t.split(' ');const sw=st.split(' ');t=[...sw,...w.slice(sw.length).map(x=>x.toLowerCase())].slice(0,Math.max(k,1)).join(' ')}else t=st+(lang==='la'?', consectetur adipiscing elit. ':' ')+t.replace(/^[^.]*\.\s*/,'')}
 return t}
let last={unit:'paragraphs',count:2,lang:cocoa.lang==='ru'?'ru':'la',start:true,seed:1};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
async function apply(o,quick){const t=gen(o),sel=(await cocoa.selection()).filter(n=>n.type==='text');
 if(sel.length){for(let i=0;i<sel.length;i++)await cocoa.update(sel[i].id,{text:i?gen({...o,seed:o.seed+i}):t,runs:null});cocoa.toast(T(`Filled ${sel.length} text layer${sel.length>1?'s':''}`,`Заполнено текстов: ${sel.length}`))}
 else{await cocoa.insert({nodes:[{type:'text',name:'Lorem ipsum',text:t,fs:16,lh:1.5,fixW:true,w:o.unit==='words'?Math.min(600,Math.max(120,t.length*8)):360,fill:'#1d1b20',ff:'Sans'}]});cocoa.toast(T('Added placeholder text','Добавлен текст-заглушка'))}
 cocoa.storage.set('opts',o)}
async function open(){const sel=(await cocoa.selection()).filter(n=>n.type==='text');
 const v=await cocoa.ui.form({title:'Lorem ipsum',ok:sel.length?T(`Fill ${sel.length} text layer${sel.length>1?'s':''}`,`Заполнить: ${sel.length}`):T('Add text','Добавить текст'),
  fields:[{type:'chips',key:'unit',label:T('Amount of','Количество'),value:last.unit,options:[['words',T('Words','Слова')],['sentences',T('Sentences','Предложения')],['paragraphs',T('Paragraphs','Абзацы')]]},
   {type:'number',key:'count',label:T('How many','Сколько'),value:last.count},
   {type:'chips',key:'lang',label:T('Language','Язык'),value:last.lang,options:[['la','Latin'],['en','English'],['ru','Русский']]},
   {type:'toggle',key:'start',label:T('Start with the classic opening','Начинать с классической фразы'),value:last.start},
   {type:'heading',label:T('Preview','Пример')},{type:'info',key:'pv',value:''}],
  onInput:o=>({pv:gen({...o,seed:last.seed}).slice(0,560)})});
 if(v){last={...last,...v};await apply(last)}}
cocoa.addMenuItem(T('Lorem ipsum…','Lorem ipsum…'),open);
cocoa.addMenuItem(T('Fill selected text','Заполнить выделенный текст'),()=>{last.seed++;apply(last,1)});
cocoa.helper.addCommand(/^(?:lorem(?:\s+ipsum)?|рыба|текст[- ]заглушка)(?:\s+(\d+))?\s*(words?|sentences?|paragraphs?|слов\S*|предлож\S*|абзац\S*)?\s*$/i,(raw,m)=>{const u=m[2]||'',unit=/^(word|слов)/i.test(u)?'words':/^(sent|предл)/i.test(u)?'sentences':'paragraphs';apply({...last,unit,count:+m[1]||(unit==='words'?12:unit==='sentences'?3:2),seed:++last.seed})},T('add placeholder text','добавить текст-заглушку'));
