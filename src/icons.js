// ==CocoaCanvas Plugin==
// @id icons
// @name Icons
// @name_ru Иконки
// @version 1.0.0
// @author CocoaSuite
// @description About 6,000 free icons: Lucide outline icons plus Google Material Symbols, outlined and filled. Search, pick a size and colour, and insert as editable vectors.
// @description_ru Около 6000 бесплатных иконок: контурные Lucide и Google Material Symbols (контурные и заливные). Поиск, размер и цвет, вставка редактируемым вектором.
// @icon ✦
// @color #2F6FDE
// @permissions ui menu helper read insert
// ==/CocoaCanvas Plugin==
// Lucide icons: ISC licence, (c) Lucide Icons and Contributors (https://lucide.dev).
// Material Symbols: Apache License 2.0, (c) Google LLC (https://fonts.google.com/icons).
// Full licence texts: https://github.com/CocoaSuite/cocoacanvas_plugins/tree/main/licenses
/*@@ICONS@@*/
const T=cocoa.t;let SETS=null;
function load(){if(SETS)return SETS;const lu=LU_RAW.split('\n').map(l=>{const a=l.indexOf('|'),b=l.indexOf('|',a+1);const n=l.slice(0,a);return{id:'lucide:'+n,n,k:(n.replace(/-/g,' ')+' '+l.slice(a+1,b)).toLowerCase(),body:l.slice(b+1)}});
 const mo={},m1=MO_RAW.split('\n').map(l=>{const a=l.indexOf('|'),n=l.slice(0,a),d=l.slice(a+1);mo[n]=d;return{id:'mso:'+n,n,k:n.replace(/_/g,' '),d}});
 const m2=MF_RAW.split('\n').map(l=>{const a=l.indexOf('|'),n=l.slice(0,a),d=l.slice(a+1);return{id:'msf:'+n,n,k:n.replace(/_/g,' '),d:d==='='?mo[n]:d}});
 return SETS={lucide:lu,mso:m1,msf:m2}}
const svgOf=(it,o)=>{const S=o.size||24,c=o.color||'#000000';if(it.body){const sw=o.abs?(o.sw||2)*24/S:(o.sw||2);return`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${Math.round(sw*1000)/1000}" stroke-linecap="round" stroke-linejoin="round">${it.body}</svg>`}
 return`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 -960 960 960"><path fill="${c}" d="${it.d}"/></svg>`};
function search(set,q,lim){const L=load()[set]||[];q=String(q||'').toLowerCase().trim();if(!q)return{items:L.slice(0,lim),total:L.length};const terms=q.split(/\s+/);
 const r=[];for(const it of L){if(!terms.every(t=>it.k.includes(t)))continue;const nm=it.n.toLowerCase().replace(/[-_]/g,' ');r.push([nm===q?0:nm.startsWith(q)?1:nm.includes(q)?2:3,it.n.length,it])}r.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);return{items:r.slice(0,lim).map(x=>x[2]),total:r.length}}
const byId=id=>{const[s,n]=String(id).split(':');return(load()[s]||[]).find(x=>x.n===n)};
let last={set:'lucide',size:24,color:'#1D1B20',sw:2,abs:false,pick:'lucide:house'};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
async function insert(o,it){it=it||byId(o.pick);if(!it)return cocoa.toast(T('Pick an icon first.','Сначала выберите иконку.'));
 await cocoa.insert({svg:svgOf(it,o),name:it.n});cocoa.storage.set('opts',{...o})}
const LIM=180,disp=it=>svgOf(it,{size:24,color:'#E6E6E6',sw:2});
async function open(){load();await cocoa.ui.form({title:T('Icons','Иконки'),ok:T('Insert','Вставить'),
 text:T('Double-click an icon to insert it right away.','Двойное нажатие вставляет иконку сразу.'),
 fields:[{type:'chips',key:'set',value:last.set,options:[['lucide','Lucide'],['mso','Material'],['msf',T('Material filled','Material заливка')]]},
  {type:'gallery',key:'pick',search:true,placeholder:T('Search icons','Поиск иконок'),columns:6,value:last.pick},
  {type:'range',key:'size',label:T('Size','Размер'),min:12,max:256,value:last.size,unit:' px'},{type:'color',key:'color',label:T('Colour','Цвет'),value:last.color},
  {type:'range',key:'sw',label:T('Stroke','Толщина'),min:.5,max:4,step:.25,value:last.sw},{type:'toggle',key:'abs',label:T('Same stroke at any size','Одинаковая толщина при любом размере'),value:last.abs},
  {type:'info',value:T('Lucide: ISC licence. Material Symbols: Apache 2.0. Both are free for commercial use.','Lucide: лицензия ISC. Material Symbols: Apache 2.0. Обе можно использовать в коммерческих проектах.')}],
 onInput:o=>{const set=o.set||'lucide',changed=set!==last.set;last={...last,...o,set};const r=search(set,o.pick_q,LIM);let pick=o.pick;if(changed||!String(pick).startsWith(set+':')){const n=String(pick).split(':')[1];pick=byId(set+':'+n)?set+':'+n:r.items[0]?.id;last.pick=pick}
  return{pick:{items:r.items.map(it=>({id:it.id,label:it.n,svg:disp(it)})),value:pick,note:r.total>LIM?T(`Showing ${LIM} of ${r.total}. Type to narrow it down.`,`Показано ${LIM} из ${r.total}. Уточните поиск.`):T(`${r.total} icons`,`Иконок: ${r.total}`)},$hide:set==='lucide'?[]:['sw','abs']}},
 onSubmit:o=>insert({...last,...o})})}
cocoa.addMenuItem(T('Browse icons…','Каталог иконок…'),open);
cocoa.helper.addCommand(/^(?:add\s+)?(?:an?\s+)?(?:icon|иконк[аую])\s+(.+)$/i,(raw,m)=>{const q=m[1].trim();for(const s of['lucide','mso']){const r=search(s,q,1);if(r.items[0])return insert({...last,set:s},r.items[0])}cocoa.toast(T('No icon matches “'+q+'”.','Нет иконки «'+q+'».'))},T('add an icon','добавить иконку'));
