// ==CocoaCanvas Plugin==
// @id patterns
// @name Pattern Generator
// @name_ru Генератор узоров
// @version 1.0.0
// @author CocoaSuite
// @description Seamless background patterns: dots, grids, stripes, checks, waves, zigzags, hexagons and more. Inserted as a crisp vector tile that fills the selected frame or a new area.
// @description_ru Бесшовные фоновые узоры: точки, сетки, полосы, клетка, волны, зигзаги, соты и другие. Вставляются чётким векторным тайлом на весь выделенный фрейм или новую область.
// @icon ▦
// @color #3C7A6E
// @permissions ui menu helper read insert
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const KINDS=[['dots',T('Dots','Точки')],['grid',T('Grid','Сетка')],['lines',T('Lines','Линии')],['stripes',T('Diagonal','Диагональ')],['checker',T('Checker','Клетка')],['waves',T('Waves','Волны')],['zigzag',T('Zigzag','Зигзаг')],['hex',T('Hexagons','Соты')],['plus',T('Plus','Плюсы')],['triangles',T('Triangles','Треугольники')],['rings',T('Rings','Кольца')],['diamonds',T('Diamonds','Ромбы')],['herring',T('Herringbone','Ёлочка')],['cross',T('Crosshatch','Штриховка')]];
const r=v=>Math.round(v*100)/100;
function tile(o){const s=Math.max(4,Math.min(400,+o.size||24)),fg=o.fg||'#D15A2C',bg=o.bg,t=Math.max(.5,+o.weight||2),d=Math.max(.5,+o.dot||3);let w=s,h=s,b='';
 const st=`fill="none" stroke="${fg}" stroke-width="${t}" stroke-linecap="round" stroke-linejoin="round"`;
 switch(o.kind){
 case'dots':b=`<circle cx="${s/2}" cy="${s/2}" r="${d}" fill="${fg}"/>`;if(o.offset){w=s;h=s;b+=`<circle cx="0" cy="0" r="${d}" fill="${fg}"/><circle cx="${s}" cy="0" r="${d}" fill="${fg}"/><circle cx="0" cy="${s}" r="${d}" fill="${fg}"/><circle cx="${s}" cy="${s}" r="${d}" fill="${fg}"/>`}break;
 case'grid':b=`<path d="M0 ${t/2}H${s}M${t/2} 0V${s}" ${st} stroke-linecap="butt"/>`;break;
 case'lines':b=`<path d="M0 ${s/2}H${s}" ${st} stroke-linecap="butt"/>`;break;
 case'stripes':b=`<path d="M${-s/2} ${s/2}L${s/2} ${-s/2}M0 ${s}L${s} 0M${s/2} ${s*1.5}L${s*1.5} ${s/2}" ${st} stroke-linecap="butt"/>`;break;
 case'checker':b=`<rect width="${s/2}" height="${s/2}" fill="${fg}"/><rect x="${s/2}" y="${s/2}" width="${s/2}" height="${s/2}" fill="${fg}"/>`;break;
 case'waves':h=s/2;b=`<path d="M0 ${h/2}C${s/4} ${-h/4} ${s/4} ${-h/4} ${s/2} ${h/2}S${s*3/4} ${h*1.25} ${s} ${h/2}" ${st}/>`;break;
 case'zigzag':h=s/2;b=`<path d="M0 ${h*.75}L${s/2} ${h*.25}L${s} ${h*.75}" ${st}/><path d="M${-s/2} ${h*.25}L0 ${h*.75}M${s} ${h*.75}L${s*1.5} ${h*.25}" ${st}/>`;break;
 case'hex':{const a=s/2,hh=Math.sqrt(3)*a;w=3*a;h=hh;const P=(cx,cy)=>{let q='';for(let i=0;i<6;i++){const g=Math.PI/3*i;q+=(i?'L':'M')+r(cx+a*.98*Math.cos(g))+' '+r(cy+a*.98*Math.sin(g))}return q+'Z'};b=`<path d="${P(a,hh/2)}${P(a*2.5,0)}${P(a*2.5,hh)}${P(-a/2,0)}${P(-a/2,hh)}" ${st}/>`;break}
 case'plus':{const k=Math.max(d*1.5,3);b=`<path d="M${s/2-k} ${s/2}H${s/2+k}M${s/2} ${s/2-k}V${s/2+k}" ${st}/>`;break}
 case'triangles':h=r(s*Math.sqrt(3)/2);b=`<path d="M0 ${h}L${s/2} 0L${s} ${h}Z" fill="${fg}"/>`;break;
 case'rings':b=`<circle cx="${s/2}" cy="${s/2}" r="${Math.max(1,s/2-t*1.5)}" ${st}/>`;break;
 case'diamonds':b=`<path d="M${s/2} ${s*.1}L${s*.9} ${s/2}L${s/2} ${s*.9}L${s*.1} ${s/2}Z" fill="${fg}"/>`;break;
 case'herring':b=`<path d="M0 ${s*.25}L${s/2} ${s*.75}L${s} ${s*.25}M0 ${s*.75}L${s/2} ${s*1.25}L${s} ${s*.75}M0 ${-s*.25}L${s/2} ${s*.25}L${s} ${-s*.25}" ${st} stroke-linecap="butt"/>`;break;
 case'cross':b=`<path d="M${-s/2} ${s/2}L${s/2} ${-s/2}M0 ${s}L${s} 0M${s/2} ${s*1.5}L${s*1.5} ${s/2}M${-s/2} ${s/2}L${s/2} ${s*1.5}M0 0L${s} ${s}M${s/2} ${-s/2}L${s*1.5} ${s/2}" ${st} stroke-linecap="butt"/>`;break}
 w=r(w);h=r(h);return{w,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${bg&&bg!=='none'?`<rect width="${w}" height="${h}" fill="${bg}"/>`:''}${b}</svg>`}}
const uri=s=>'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(s)));
function previewSVG(o,W=300,Hh=140){const t=tile(o);return`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${Hh}" viewBox="0 0 ${W} ${Hh}"><defs><pattern id="p" width="${t.w}" height="${t.h}" patternUnits="userSpaceOnUse">${t.svg.replace(/^<svg[^>]*>|<\/svg>$/g,'')}</pattern></defs><rect width="${W}" height="${Hh}" fill="url(#p)"/></svg>`}
let last={kind:'dots',fg:'#D15A2C',bg:'#F6EFE9',transparent:false,size:24,weight:2,dot:3,offset:false};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
async function insert(o){const t=tile({...o,bg:o.transparent?null:o.bg}),b=await cocoa.bounds(),hasSel=!!b.selection;
 await cocoa.insert({nodes:[{type:'image',name:T('Pattern','Узор')+' · '+(KINDS.find(k=>k[0]===o.kind)||[0,''])[1],src:uri(t.svg),w:hasSel?b.selection.w:800,h:hasSel?b.selection.h:600,fit:'tile',tsc:1}]},hasSel?{fit:'selection'}:{});
 cocoa.storage.set('opts',o);cocoa.toast(T('Pattern added. Resize it any way, it keeps repeating.','Узор добавлен. Меняйте размер как угодно, он продолжает повторяться.'))}
async function open(){await cocoa.ui.form({title:T('Pattern','Узор'),ok:T('Insert','Вставить'),
 fields:[{type:'chips',key:'kind',value:last.kind,options:KINDS},{type:'preview',key:'pv',height:150},
  {type:'color',key:'fg',label:T('Colour','Цвет'),value:last.fg},{type:'color',key:'bg',label:T('Background','Фон'),value:last.bg},{type:'toggle',key:'transparent',label:T('Transparent background','Прозрачный фон'),value:last.transparent},
  {type:'range',key:'size',label:T('Size','Размер'),min:6,max:120,value:last.size},{type:'range',key:'weight',label:T('Line weight','Толщина линий'),min:.5,max:12,step:.5,value:last.weight},{type:'range',key:'dot',label:T('Dot size','Размер точек'),min:.5,max:20,step:.5,value:last.dot},
  {type:'toggle',key:'offset',label:T('Offset rows','Смещать ряды'),value:last.offset},
  {type:'info',value:T('Fills the selected layer or frame. With nothing selected, adds an 800 × 600 area.','Заполняет выделенный слой или фрейм. Если ничего не выделено, добавляет область 800 × 600.')}],
 onInput:o=>{last={...last,...o};const lineK=['grid','lines','stripes','waves','zigzag','hex','plus','rings','herring','cross'].includes(o.kind),dotK=['dots','plus'].includes(o.kind);
  return{pv:previewSVG({...o,bg:o.transparent?null:o.bg}),$hide:[...(lineK?[]:['weight']),...(dotK?[]:['dot']),...(o.kind==='dots'?[]:['offset']),...(o.transparent?['bg']:[])]}},
 onSubmit:o=>insert({...last,...o})})}
cocoa.addMenuItem(T('Pattern…','Узор…'),open);
cocoa.helper.addCommand(/^(?:pattern|узор)\s*(\w+)?$/i,(raw,m)=>{const k=KINDS.find(x=>m[1]&&(x[0]===m[1].toLowerCase()||x[1].toLowerCase().startsWith(m[1].toLowerCase())));if(k)last.kind=k[0];insert(last)},T('fill with a pattern','заполнить узором'));
