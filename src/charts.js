// ==CocoaCanvas Plugin==
// @id charts
// @name Charts & Tables
// @name_ru Графики и таблицы
// @version 1.0.0
// @author CocoaSuite
// @description Bar, column, line, area, pie and donut charts and neat tables from your own numbers. Paste data from a spreadsheet; everything arrives as editable shapes and text.
// @description_ru Столбчатые, линейные, областные, круговые и кольцевые диаграммы и аккуратные таблицы из ваших чисел. Вставьте данные из таблицы; всё появится редактируемыми фигурами и текстом.
// @icon ▥
// @color #2F8F83
// @permissions ui menu helper read insert
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const PAL={cocoa:['#D15A2C','#F2A541','#3C7A6E','#4E7AC7','#8A5CC2','#E5484D','#6B6B78'],ocean:['#0B5FA5','#2E86C1','#48A9C5','#6CC4C1','#9AD9B9','#C9E7A7','#F2E394'],sunset:['#F94144','#F3722C','#F8961E','#F9C74F','#90BE6D','#43AA8B','#577590'],pastel:['#A5C8FF','#FFB3C6','#B9F3C9','#FFE29A','#D7BDFF','#FFC9A8','#BDE0FE'],mono:['#1F1F1F','#4A4A4A','#757575','#9E9E9E','#C2C2C2','#DDDDDD','#EEEEEE'],apple:['#007AFF','#34C759','#FF9500','#FF2D55','#AF52DE','#5AC8FA','#FFCC00'],material:['#6750A4','#7D5260','#625B71','#B3261E','#006A6A','#8B5000','#386A20']};
const SAMPLE=T('Month,Sales,Costs\nJan,32,20\nFeb,45,26\nMar,38,24\nApr,56,30\nMay,62,34\nJun,71,39','Месяц,Продажи,Расходы\nЯнв,32,20\nФев,45,26\nМар,38,24\nАпр,56,30\nМай,62,34\nИюн,71,39');
let last={kind:'column',data:SAMPLE,pal:'cocoa',w:560,h:340,title:T('Monthly sales','Продажи по месяцам'),legend:true,grid:true,values:false,radius:6,smooth:true,dark:false,stripes:true,font:'Inter'};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function parse(txt){const lines=String(txt||'').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);if(!lines.length)return{head:[],rows:[]};
 const sep=lines[0].includes('\t')?'\t':lines[0].includes(';')&&!lines[0].includes(',')?';':',',split=l=>{const o=[];let cur='',q=false;for(const ch of l){if(ch==='"'){q=!q;continue}if(ch===sep&&!q){o.push(cur.trim());cur='';continue}cur+=ch}o.push(cur.trim());return o};
 const all=lines.map(split),num=v=>{const x=parseFloat(String(v).replace(/\s/g,'').replace(/,(?=\d{1,2}$)/,'.').replace(/[^0-9.\-]/g,''));return isFinite(x)?x:null};
 const hasHead=all[0].slice(1).some(v=>num(v)===null)||all.length>1&&all[0].every(v=>num(v)===null);const head=hasHead?all[0]:all[0].map((_,i)=>i?T('Series ','Ряд ')+i:'');const body=hasHead?all.slice(1):all;
 return{head,raw:body,rows:body.map(r=>({label:r[0],vals:r.slice(1).map(num)}))}}
const nice=m=>{if(m<=0)return 1;const e=Math.pow(10,Math.floor(Math.log10(m))),f=m/e;return(f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*e};
const fmt=v=>Math.abs(v)>=1e6?(v/1e6).toFixed(Math.abs(v)>=1e7?0:1)+'M':Math.abs(v)>=1e4?(v/1e3).toFixed(Math.abs(v)>=1e5?0:1)+'k':String(Math.round(v*100)/100);
function chartSVG(o){const D=parse(o.data),W=Math.max(200,+o.w||560),H=Math.max(150,+o.h||340),pal=PAL[o.pal]||PAL.cocoa,ink=o.dark?'#F2F2F2':'#1F1F1F',mute=o.dark?'#A0A0A0':'#6E6E6E',line=o.dark?'#3A3A3A':'#E6E6E6',bg=o.dark?'#1C1C1E':'#FFFFFF',F=`font-family="${o.font}, sans-serif"`;
 const ser=D.head.slice(1).map((h,i)=>({name:h||T('Series ','Ряд ')+(i+1),c:pal[i%pal.length],vals:D.rows.map(r=>r.vals[i]??0)})).filter(s=>s.vals.some(v=>v!==null));
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" rx="16" fill="${bg}"/>`,top=20;
 if(o.title){s+=`<text x="24" y="40" ${F} font-size="18" font-weight="700" fill="${ink}">${esc(o.title)}</text>`;top=58}
 const pie=o.kind==='pie'||o.kind==='donut';
 if(o.legend&&(ser.length>1||pie)){let x=24;const items=pie?D.rows.map((r,i)=>[r.label,pal[i%pal.length]]):ser.map(q=>[q.name,q.c]);for(const[l,c]of items){const w=String(l).length*7+28;if(x+w>W-16)break;s+=`<rect x="${x}" y="${top}" width="10" height="10" rx="3" fill="${c}"/><text x="${x+16}" y="${top+9.5}" ${F} font-size="12" fill="${mute}">${esc(l)}</text>`;x+=w}top+=26}
 if(!ser.length||!D.rows.length)return s+`<text x="24" y="${top+20}" ${F} font-size="13" fill="${mute}">${T('Add some numbers to see a chart','Добавьте числа, чтобы увидеть график')}</text></svg>`;
 if(pie){const vals=D.rows.map(r=>Math.max(0,r.vals[0]||0)),sum=vals.reduce((a,b)=>a+b,0)||1,cx=W/2,cy=top+(H-top)/2,R=Math.min(W/2-30,(H-top)/2-14),ri=o.kind==='donut'?R*.58:0;let a=-Math.PI/2;
  vals.forEach((v,i)=>{if(!v)return;const b=a+v/sum*Math.PI*2,lg=b-a>Math.PI?1:0,p=(r,t)=>`${(cx+r*Math.cos(t)).toFixed(2)} ${(cy+r*Math.sin(t)).toFixed(2)}`;
   const d=v>=sum?(ri?`M${p(R,a)}A${R} ${R} 0 1 1 ${p(R,a+Math.PI)}A${R} ${R} 0 1 1 ${p(R,a)}ZM${p(ri,a)}A${ri} ${ri} 0 1 0 ${p(ri,a+Math.PI)}A${ri} ${ri} 0 1 0 ${p(ri,a)}Z`:`M${p(R,a)}A${R} ${R} 0 1 1 ${p(R,a+Math.PI)}A${R} ${R} 0 1 1 ${p(R,a)}Z`):ri?`M${p(R,a)}A${R} ${R} 0 ${lg} 1 ${p(R,b)}L${p(ri,b)}A${ri} ${ri} 0 ${lg} 0 ${p(ri,a)}Z`:`M${cx} ${cy}L${p(R,a)}A${R} ${R} 0 ${lg} 1 ${p(R,b)}Z`;
   s+=`<path d="${d}" fill="${pal[i%pal.length]}" stroke="${bg}" stroke-width="2" fill-rule="evenodd"/>`;
   if(o.values&&v/sum>.04){const m=(a+b)/2,rr=ri?(R+ri)/2:R*.62;s+=`<text x="${(cx+rr*Math.cos(m)).toFixed(1)}" y="${(cy+rr*Math.sin(m)+4).toFixed(1)}" text-anchor="middle" ${F} font-size="12" font-weight="600" fill="#FFFFFF">${Math.round(v/sum*100)}%</text>`}a=b});
  if(ri)s+=`<text x="${cx}" y="${cy+7}" text-anchor="middle" ${F} font-size="20" font-weight="700" fill="${ink}">${fmt(sum)}</text>`;return s+'</svg>'}
 const horiz=o.kind==='bar',all=ser.flatMap(q=>q.vals),mx=Math.max(0,...all),mn=Math.min(0,...all),step=nice((mx-mn)/4||1),hi=Math.ceil(mx/step)*step||step,lo=Math.floor(mn/step)*step,ticks=[];for(let v=lo;v<=hi+step/2;v+=step)ticks.push(Math.round(v*1e6)/1e6);
 const lw=Math.max(...ticks.map(t=>fmt(t).length))*7+10,catW=Math.max(...D.rows.map(r=>String(r.label).length))*6.6+12;
 const L=horiz?24+Math.min(catW,W*.3):24+lw,R0=W-24,B=H-(horiz?30:36),Tp=top+8,pw=R0-L,ph=B-Tp,n=D.rows.length;
 const vy=v=>B-(v-lo)/(hi-lo)*ph,vx=v=>L+(v-lo)/(hi-lo)*pw;
 for(const t of ticks){if(horiz){const x=vx(t).toFixed(1);if(o.grid)s+=`<path d="M${x} ${Tp}V${B}" stroke="${t===0?mute:line}" stroke-width="1"/>`;s+=`<text x="${x}" y="${B+20}" text-anchor="middle" ${F} font-size="11" fill="${mute}">${fmt(t)}</text>`}
  else{const y=vy(t).toFixed(1);if(o.grid)s+=`<path d="M${L} ${y}H${R0}" stroke="${t===0?mute:line}" stroke-width="1"/>`;s+=`<text x="${L-8}" y="${(+y+4).toFixed(1)}" text-anchor="end" ${F} font-size="11" fill="${mute}">${fmt(t)}</text>`}}
 const every=Math.max(1,Math.ceil(n*Math.max(30,catW)/(horiz?ph*1.6:pw)));
 D.rows.forEach((r,i)=>{if(i%every)return;if(horiz){const y=Tp+(i+.5)*ph/n;s+=`<text x="${L-8}" y="${(y+4).toFixed(1)}" text-anchor="end" ${F} font-size="11" fill="${mute}">${esc(r.label)}</text>`}else{const x=L+(o.kind==='column'?(i+.5)*pw/n:(n>1?i*pw/(n-1):pw/2));s+=`<text x="${x.toFixed(1)}" y="${B+20}" text-anchor="middle" ${F} font-size="11" fill="${mute}">${esc(r.label)}</text>`}});
 if(o.kind==='column'||horiz){const band=(horiz?ph:pw)/n,g=band*.22,bw=(band-g*2)/ser.length,rad=Math.min(+o.radius||0,bw/2);
  ser.forEach((q,k)=>q.vals.forEach((v,i)=>{if(v==null)return;const a=(horiz?Tp:L)+i*band+g+k*bw+bw*.06,th=bw*.88;
   if(horiz){const x0=vx(Math.max(lo,0)),x1=vx(v),x=Math.min(x0,x1),w=Math.abs(x1-x0);s+=`<rect x="${x.toFixed(1)}" y="${a.toFixed(1)}" width="${w.toFixed(1)}" height="${th.toFixed(1)}" rx="${Math.min(rad,w/2).toFixed(1)}" fill="${q.c}"/>`;if(o.values)s+=`<text x="${(x+w+6).toFixed(1)}" y="${(a+th/2+4).toFixed(1)}" ${F} font-size="11" fill="${ink}">${fmt(v)}</text>`}
   else{const y0=vy(Math.max(lo,0)),y1=vy(v),y=Math.min(y0,y1),h=Math.abs(y1-y0);s+=`<rect x="${a.toFixed(1)}" y="${y.toFixed(1)}" width="${th.toFixed(1)}" height="${h.toFixed(1)}" rx="${Math.min(rad,h/2).toFixed(1)}" fill="${q.c}"/>`;if(o.values)s+=`<text x="${(a+th/2).toFixed(1)}" y="${(y-6).toFixed(1)}" text-anchor="middle" ${F} font-size="11" fill="${ink}">${fmt(v)}</text>`}}));return s+'</svg>'}
 ser.forEach(q=>{const P=q.vals.map((v,i)=>[n>1?L+i*pw/(n-1):L+pw/2,vy(v??0)]);let d=`M${P[0][0].toFixed(1)} ${P[0][1].toFixed(1)}`;
  for(let i=1;i<P.length;i++){if(o.smooth){const p0=P[i-2]||P[i-1],p1=P[i-1],p2=P[i],p3=P[i+1]||p2,t=.18;d+=`C${(p1[0]+(p2[0]-p0[0])*t).toFixed(1)} ${(p1[1]+(p2[1]-p0[1])*t).toFixed(1)} ${(p2[0]-(p3[0]-p1[0])*t).toFixed(1)} ${(p2[1]-(p3[1]-p1[1])*t).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`}else d+=`L${P[i][0].toFixed(1)} ${P[i][1].toFixed(1)}`}
  if(o.kind==='area')s+=`<path d="${d}L${P[P.length-1][0].toFixed(1)} ${vy(Math.max(lo,0)).toFixed(1)}L${P[0][0].toFixed(1)} ${vy(Math.max(lo,0)).toFixed(1)}Z" fill="${q.c}" fill-opacity="${ser.length>1?.28:.22}"/>`;
  s+=`<path d="${d}" fill="none" stroke="${q.c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  P.forEach(([x,y],i)=>{s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="${bg}" stroke="${q.c}" stroke-width="2.5"/>`;if(o.values)s+=`<text x="${x.toFixed(1)}" y="${(y-10).toFixed(1)}" text-anchor="middle" ${F} font-size="11" fill="${ink}">${fmt(q.vals[i]??0)}</text>`})});
 return s+'</svg>'}
function tableNodes(o){const D=parse(o.data),rows=[D.head,...(D.raw||[])].filter(r=>r&&r.length),cols=Math.max(...rows.map(r=>r.length)),pal=PAL[o.pal]||PAL.cocoa,ink=o.dark?'#F2F2F2':'#1F1F1F',mute=o.dark?'#A0A0A0':'#6E6E6E',bg=o.dark?'#1C1C1E':'#FFFFFF',zebra=o.dark?'#242427':'#F6F6F7',hdr=pal[0];
 const width=c=>Math.max(...rows.map((r,i)=>String(r[c]??'').length*(i?7.4:7.8)))+32,ws=[...Array(cols)].map((_,c)=>Math.max(64,Math.min(320,width(c)))),isNum=c=>rows.slice(1).every(r=>r[c]===undefined||r[c]===''||/^[-+$€£₽¥]?\s?[\d\s.,]+%?\s?[$€£₽¥%]?$/.test(String(r[c]).trim()));
 const W=ws.reduce((a,b)=>a+b,0);const row=(r,i)=>({type:'frame',name:i?T('Row ','Строка ')+i:T('Header','Заголовок'),w:W,h:40,fill:i?(o.stripes&&i%2===0?zebra:bg):hdr,clip:false,al:{d:'h',g:0,p:[0,0,0,0],ay:1,sw:'h',sh:'h'},
  children:[...Array(cols)].map((_,c)=>({type:'frame',name:String(r[c]??'').slice(0,30)||T('Cell','Ячейка'),w:ws[c],h:40,fill:null,clip:false,al:{d:'h',g:0,p:[11,14,11,14],ax:c&&isNum(c)?2:0,ay:1,sw:'f',sh:'h'},
   children:[{type:'text',name:String(r[c]??'').slice(0,30)||' ',text:String(r[c]??''),fs:i?14:13,ff:o.font,fw:i?(c?400:500):700,fill:i?(c?ink:ink):'#FFFFFF',lh:1.3}]}))});
 return{type:'frame',name:o.title||T('Table','Таблица'),w:W,h:rows.length*40,fill:bg,r:+o.radius>0?Math.min(16,+o.radius*2):0,stroke:o.dark?'#3A3A3A':'#E6E6E6',sw:1,sa:'i',clip:true,al:{d:'v',g:0,p:[0,0,0,0],sw:'h',sh:'h'},children:rows.map(row)}}
async function insert(o){if(o.kind==='table'){await cocoa.insert({nodes:[tableNodes(o)]})}else{await cocoa.insert({svg:chartSVG(o)})}cocoa.storage.set('opts',o);cocoa.toast(o.kind==='table'?T('Table added. Every cell is editable text.','Таблица добавлена. Каждая ячейка — редактируемый текст.'):T('Chart added as editable shapes and text.','График добавлен редактируемыми фигурами и текстом.'))}
const KINDS=[['column',T('Columns','Столбцы')],['bar',T('Bars','Полосы')],['line',T('Line','Линия')],['area',T('Area','Область')],['pie',T('Pie','Круг')],['donut',T('Donut','Кольцо')],['table',T('Table','Таблица')]];
async function open(kind){await cocoa.ui.form({title:T('Charts & tables','Графики и таблицы'),ok:T('Insert','Вставить'),
 fields:[{type:'chips',key:'kind',value:kind||last.kind,options:KINDS},{type:'preview',key:'pv',height:180},
  {type:'textarea',key:'data',label:T('Data (paste from a spreadsheet; first row = names)','Данные (вставьте из таблицы; первая строка — названия)'),value:last.data},
  {type:'text',key:'title',label:T('Title','Заголовок'),value:last.title},
  {type:'select',key:'pal',label:T('Colours','Цвета'),value:last.pal,options:[['cocoa','Cocoa'],['ocean',T('Ocean','Океан')],['sunset',T('Sunset','Закат')],['pastel',T('Pastel','Пастель')],['apple','Apple'],['material','Material'],['mono',T('Mono','Моно')]]},
  {type:'number',key:'w',label:T('Width','Ширина'),value:last.w},{type:'number',key:'h',label:T('Height','Высота'),value:last.h},
  {type:'toggle',key:'legend',label:T('Legend','Легенда'),value:last.legend},{type:'toggle',key:'grid',label:T('Grid lines','Сетка'),value:last.grid},
  {type:'toggle',key:'values',label:T('Show values','Показывать значения'),value:last.values},{type:'toggle',key:'smooth',label:T('Smooth lines','Плавные линии'),value:last.smooth},
  {type:'range',key:'radius',label:T('Bar corners','Скругление столбцов'),min:0,max:16,value:last.radius},{type:'toggle',key:'stripes',label:T('Striped rows','Полосатые строки'),value:last.stripes},
  {type:'toggle',key:'dark',label:T('Dark','Тёмная'),value:last.dark}],
 onInput:async o=>{last={...last,...o,w:+o.w||last.w,h:+o.h||last.h};const k=last.kind,tb=k==='table',pie=k==='pie'||k==='donut';let pv='';
  if(tb){try{pv=await cocoa.preview({nodes:[tableNodes(last)]})}catch(e){}}else pv=chartSVG(last);
  return{pv,$hide:[...(tb?['legend','grid','smooth','values','w','h']:['stripes']),...(pie?['grid','smooth','radius']:[]),...(k==='line'||k==='area'?['radius']:['smooth'])]}},
 onSubmit:o=>insert({...last,...o,w:+o.w||last.w,h:+o.h||last.h})})}
cocoa.addMenuItem(T('Chart…','График…'),()=>open());
cocoa.addMenuItem(T('Table…','Таблица…'),()=>open('table'));
cocoa.helper.addCommand(/^(?:add\s+)?(?:a\s+)?(bar|column|line|area|pie|donut)\s+(?:chart|graph)$|^(?:add\s+)?(?:a\s+)?(?:chart|graph)$/i,(raw,m)=>insert({...last,kind:(m[1]||last.kind||'column').toLowerCase()}),T('add a chart','добавить график'));
cocoa.helper.addCommand(/^(?:add\s+)?(?:a\s+)?table$|^(?:добавь\s+)?таблиц\w*$/i,()=>insert({...last,kind:'table'}),T('add a table','добавить таблицу'));
cocoa.helper.addCommand(/^(?:добавь\s+)?(?:график|диаграмм\w*)$/i,()=>insert({...last}),T('add a chart','добавить график'));
