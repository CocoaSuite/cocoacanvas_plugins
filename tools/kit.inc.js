// ---- shared layer builders (coordinates are relative to the parent; K.abs() makes them absolute) ----
const K={};
K.F=(o,kids)=>Object.assign({type:'frame',name:'Frame',x:0,y:0,w:100,h:100,fill:null,clip:false},o,{children:(kids||[]).flat().filter(Boolean)});
K.G=(o,kids)=>Object.assign({type:'group',name:'Group',x:0,y:0},o,{children:(kids||[]).flat().filter(Boolean)});
K.R=o=>Object.assign({type:'rect',name:'Rectangle',x:0,y:0,w:10,h:10,fill:'#D9D9D9'},o);
K.E=o=>Object.assign({type:'ellipse',name:'Ellipse',x:0,y:0,w:10,h:10,fill:'#D9D9D9'},o);
K.T=(text,o)=>Object.assign({type:'text',name:String(text).split('\n')[0].slice(0,40),text:String(text),x:0,y:0,fs:14,fw:400,ff:'Sans',fill:'#000000',lh:1.25},o);
K.I=(svg,o)=>Object.assign({type:'svg',name:'Icon',svg,x:0,y:0,w:24,h:24},o);
K.al=(d,g,p,o)=>Object.assign({d,g:g||0,p:Array.isArray(p)?p.length===2?[p[0],p[1],p[0],p[1]]:p:[p||0,p||0,p||0,p||0],ax:0,ay:0,sw:'h',sh:'h'},o);
K.abs=(n,ox=0,oy=0)=>{n.x=(n.x||0)+ox;n.y=(n.y||0)+oy;if(n.children){for(const c of n.children)K.abs(c,n.x,n.y);if(n.type==='group'){delete n.x;delete n.y}}return n};
K.hex=h=>{h=String(h).replace('#','');if(h.length===3)h=h.replace(/./g,c=>c+c);return[0,2,4].map(i=>parseInt(h.substr(i,2),16))};
K.mix=(a,b,t)=>{const A=K.hex(a),B=K.hex(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('')};
K.lum=h=>{const[r,g,b]=K.hex(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return.2126*r+.7152*g+.0722*b};
K.on=h=>K.lum(h)>.45?'#111111':'#FFFFFF';
K.lu=(name,color,sw)=>`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw||2}" stroke-linecap="round" stroke-linejoin="round">${LU[name]||''}</svg>`;
K.ms=(name,color)=>`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960"><path fill="${color}" d="${MS[name]||''}"/></svg>`;
K.shadow=(y,b,a,c)=>[{t:'ds',x:0,y:y||2,b:b||8,s:0,c:c||'#000000',a:a==null?.15:a}];
// a component gallery window shared by the kits
async function kitWindow(cfg){let st=Object.assign({},cfg.defaults,(await cocoa.storage.get('opts'))||{});const cats=cfg.cats,build=id=>{const c=cfg.items.find(x=>x.id===id);return c?K.abs(c.make(st)):null};
 const prevCache={};const pv=async id=>{const k=id+JSON.stringify(st);if(prevCache[k])return prevCache[k];const n=build(id);if(!n)return'';try{return prevCache[k]=await cocoa.preview({nodes:[n]})}catch(e){return''}};
 const items=async()=>{const L=cfg.items.filter(x=>x.cat===st.cat);const out=[];for(const it of L)out.push({id:it.id,label:it.label,svg:await pv(it.id),bg:cfg.cellBg?cfg.cellBg(st):undefined});return out};
 await cocoa.ui.form({title:cfg.title,ok:cocoa.t('Insert','Вставить'),text:cocoa.t('Double-click a component to insert it.','Двойное нажатие вставляет компонент.'),
  fields:[{type:'chips',key:'cat',value:st.cat,options:cats},{type:'gallery',key:'pick',columns:cfg.columns||2,aspect:cfg.aspect||'4/3',labels:true,value:st.pick},...cfg.fields(st)],
  onInput:async o=>{const catChanged=o.cat&&o.cat!==st.cat;st={...st,...o};if(catChanged||!cfg.items.find(x=>x.id===st.pick&&x.cat===st.cat))st.pick=(cfg.items.find(x=>x.cat===st.cat)||{}).id;cocoa.storage.set('opts',st);
   return{pick:{items:await items(),value:st.pick},...(cfg.hide?{$hide:cfg.hide(st)}:{})}},
  onSubmit:async o=>{st={...st,...o};const it=cfg.items.find(x=>x.id===st.pick);if(!it)return cocoa.toast(cocoa.t('Pick a component first.','Сначала выберите компонент.'));const n=build(it.id);await cocoa.insert({nodes:[n]},it.screen?{place:'new'}:{});cocoa.storage.set('opts',st)}})}
