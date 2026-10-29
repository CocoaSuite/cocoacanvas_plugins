// ==CocoaCanvas Plugin==
// @id noise
// @name Noise Generator
// @name_ru Генератор шума
// @version 1.0.0
// @author CocoaSuite
// @description Film grain, colour noise, soft clouds and paper texture. Adds a seamless noise layer over the selection with the blend mode of your choice.
// @description_ru Плёночное зерно, цветной шум, мягкие облака и текстура бумаги. Добавляет бесшовный слой шума поверх выделенного с нужным режимом наложения.
// @icon ░
// @color #6B6B78
// @permissions ui menu helper read insert
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const TYPES=[['grain',T('Grain','Зерно')],['color',T('Colour','Цветной')],['soft',T('Soft clouds','Облака')],['paper',T('Paper','Бумага')],['static',T('Static','Помехи')]];
const BLENDS=[['overlay',T('Overlay','Перекрытие')],['soft-light',T('Soft light','Мягкий свет')],['multiply',T('Multiply','Умножение')],['screen',T('Screen','Экран')],['normal',T('Normal','Обычный')]];
function rng(s){s=(s>>>0)||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return(s>>>0)/4294967296}}
function vnoise(n,L,R){const g=new Float32Array(L*L);for(let i=0;i<g.length;i++)g[i]=R();const sm=t=>t*t*(3-2*t);return(x,y)=>{const fx=x/n*L,fy=y/n*L,x0=Math.floor(fx),y0=Math.floor(fy),tx=sm(fx-x0),ty=sm(fy-y0),a=g[(y0%L)*L+x0%L],b=g[(y0%L)*L+(x0+1)%L],c=g[((y0+1)%L)*L+x0%L],d=g[((y0+1)%L)*L+(x0+1)%L];return a+(b-a)*tx+(c-a)*ty+(a-b-c+d)*tx*ty}}
function fbm(n,R,base){const O=[];for(let i=0;i<5;i++)O.push(vnoise(n,base<<i,R));return(x,y)=>{let v=0,w=.5,s=0;for(const f of O){v+=f(x,y)*w;s+=w;w*=.5}return v/s}}
async function tile(o,S){S=S||+o.tile||256;const k=Math.max(1,Math.min(8,Math.round(+o.grain||1))),w=Math.ceil(S/k),R=rng(+o.seed||7),c=new OffscreenCanvas(w,w),x=c.getContext('2d'),id=x.createImageData(w,w),d=id.data,a=Math.round(255*Math.max(0,Math.min(100,+o.amount))/100),ct=(+o.contrast||100)/100;
 const F=o.type==='soft'||o.type==='paper'?fbm(w,R,o.type==='soft'?4:8):null,mono=o.type!=='color',tint=/^#[0-9a-f]{6}$/i.test(o.tint||'')&&o.useTint?[1,3,5].map(i=>parseInt(o.tint.substr(i,2),16)/255):null;
 for(let i=0,p=0;i<w*w;i++,p+=4){const X=i%w,Y=(i/w)|0;let v;
  if(o.type==='soft')v=F(X,Y);else if(o.type==='paper')v=F(X,Y)*.55+R()*.45;else if(o.type==='static')v=R()<.5?0:1;else v=R();
  v=Math.max(0,Math.min(1,.5+(v-.5)*ct*(o.type==='soft'?1.8:1)));
  if(mono){const q=v*255;d[p]=tint?q*tint[0]:q;d[p+1]=tint?q*tint[1]:q;d[p+2]=tint?q*tint[2]:q}else{d[p]=R()*255;d[p+1]=R()*255;d[p+2]=R()*255}d[p+3]=a}
 x.putImageData(id,0,0);let out=c;if(k>1){out=new OffscreenCanvas(S,S);const y=out.getContext('2d');y.imageSmoothingEnabled=o.type==='soft'||o.type==='paper';y.drawImage(c,0,0,S,S)}
 return out}
const url=async c=>new FileReaderSync().readAsDataURL(await c.convertToBlob({type:'image/png'}));
async function preview(o){const W=600,Hh=280,c=new OffscreenCanvas(W,Hh),x=c.getContext('2d'),g=x.createLinearGradient(0,0,W,Hh);g.addColorStop(0,'#D15A2C');g.addColorStop(.5,'#F2A541');g.addColorStop(1,'#2C3E50');x.fillStyle=g;x.fillRect(0,0,W,Hh);
 const t=await tile(o,256);x.globalCompositeOperation=o.blend==='normal'?'source-over':o.blend;const pat=x.createPattern(t,'repeat');x.fillStyle=pat;x.fillRect(0,0,W,Hh);return{src:await url(c)}}
let last={type:'grain',amount:18,grain:1,contrast:100,blend:'overlay',tile:256,useTint:false,tint:'#3A2A20',seed:7};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
async function insert(o){const t=await tile(o),src=await url(t),b=await cocoa.bounds(),s=!!b.selection;
 await cocoa.insert({nodes:[{type:'image',name:T('Noise','Шум')+' · '+(TYPES.find(k=>k[0]===o.type)||[0,''])[1],src,w:s?b.selection.w:800,h:s?b.selection.h:600,fit:'tile',tsc:1,bl:o.blend==='normal'?undefined:o.blend}]},s?{fit:'selection'}:{});
 cocoa.storage.set('opts',o);cocoa.toast(T('Noise layer added on top. Change its opacity or blend mode any time.','Слой шума добавлен сверху. Прозрачность и режим наложения можно менять.'))}
async function open(){await cocoa.ui.form({title:T('Noise','Шум'),ok:T('Insert','Вставить'),
 fields:[{type:'chips',key:'type',value:last.type,options:TYPES},{type:'preview',key:'pv',height:150},
  {type:'range',key:'amount',label:T('Strength','Сила'),min:1,max:100,value:last.amount,unit:'%'},{type:'range',key:'grain',label:T('Grain size','Размер зерна'),min:1,max:8,value:last.grain},
  {type:'range',key:'contrast',label:T('Contrast','Контраст'),min:20,max:300,step:5,value:last.contrast,unit:'%'},{type:'select',key:'blend',label:T('Blend mode','Режим наложения'),value:last.blend,options:BLENDS},
  {type:'toggle',key:'useTint',label:T('Tint the grain','Тонировать зерно'),value:last.useTint},{type:'color',key:'tint',label:T('Tint','Оттенок'),value:last.tint},
  {type:'select',key:'tile',label:T('Tile size','Размер тайла'),value:String(last.tile),options:[['128','128'],['256','256'],['512','512']]},
  {type:'info',value:T('Adds a layer above the selection, the same size. With nothing selected, adds an 800 × 600 area.','Добавляет слой над выделенным, того же размера. Если ничего не выделено, добавляет область 800 × 600.')}],
 onInput:async o=>{last={...last,...o,tile:+o.tile};return{pv:await preview(last),$hide:[...(last.useTint&&last.type!=='color'?[]:['tint']),...(last.type==='color'?['useTint']:[])]}},
 onSubmit:o=>{last.seed=(last.seed*48271)%2147483647;return insert({...last,...o,tile:+o.tile})}})}
cocoa.addMenuItem(T('Noise…','Шум…'),open);
cocoa.addMenuItem(T('Quick film grain','Быстрое плёночное зерно'),()=>insert({...last,type:'grain',amount:16,grain:1,blend:'overlay'}));
cocoa.helper.addCommand(/^(?:add\s+)?(?:noise|grain|шум|зерно)(?:\s+(\d+))?%?$/i,(raw,m)=>insert({...last,amount:+m[1]||last.amount}),T('add a noise layer','добавить слой шума'));
