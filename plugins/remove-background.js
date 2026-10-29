// ==CocoaCanvas Plugin==
// @id remove-background
// @name Remove Background
// @name_ru Удаление фона
// @version 1.0.0
// @author CocoaSuite
// @description Cuts the background out of a photo, product shot, logo or scan, right on your device. Works best when the background is fairly plain; tune the strength and edge softness, or pick the colour to remove.
// @description_ru Вырезает фон с фото, снимка товара, логотипа или скана прямо на устройстве. Лучше всего работает с однотонным фоном; настройте силу и мягкость края или выберите цвет для удаления.
// @icon ✂
// @color #5B6CD9
// @permissions ui menu helper read edit
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
let last={mode:'auto',tol:22,soft:40,holes:false,keep:'largest',despill:true,color:'#FFFFFF'};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
const toBlob=u=>{const m=/^data:([^;,]+)(;base64)?,(.*)$/.exec(u);if(!m)throw new Error('bad image');const b=m[2]?atob(m[3]):decodeURIComponent(m[3]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Blob([a],{type:m[1]})};
const hex=h=>[1,3,5].map(i=>parseInt(String(h).slice(i,i+2),16)||0);
// perceptual-ish distance in a cheap Lab-like space
function lab(r,g,b){const f=c=>{c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)},R=f(r),G=f(g),B=f(b),X=(R*.4124+G*.3576+B*.1805)/.95047,Y=R*.2126+G*.7152+B*.0722,Z=(R*.0193+G*.1192+B*.9505)/1.08883,q=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;const fx=q(X),fy=q(Y),fz=q(Z);return[116*fy-16,500*(fx-fy),200*(fy-fz)]}
function kmeans(px,k){let C=px.slice(0,k).map(p=>p.slice());for(let it=0;it<8;it++){const S=C.map(()=>[0,0,0,0]);for(const p of px){let bi=0,bd=1e9;C.forEach((c,i)=>{const d=(c[0]-p[0])**2+(c[1]-p[1])**2+(c[2]-p[2])**2;if(d<bd){bd=d;bi=i}});const s=S[bi];s[0]+=p[0];s[1]+=p[1];s[2]+=p[2];s[3]++}C=S.map((s,i)=>s[3]?[s[0]/s[3],s[1]/s[3],s[2]/s[3],s[3]]:C[i])}return C}
let SRC=null;
async function load(id){const url=await cocoa.imageData(id);if(!url)throw new Error(T('This image has no pixels yet.','У этого изображения нет данных.'));const bm=await createImageBitmap(toBlob(url));return bm}
function process(bm,o,maxSide){const k=Math.min(1,(maxSide||4096)/Math.max(bm.width,bm.height)),W=Math.max(1,Math.round(bm.width*k)),H=Math.max(1,Math.round(bm.height*k)),c=new OffscreenCanvas(W,H),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0,W,H);
 const im=x.getImageData(0,0,W,H),d=im.data,N=W*H,L=new Float32Array(N*3);for(let i=0;i<N;i++){const l=lab(d[i*4],d[i*4+1],d[i*4+2]);L[i*3]=l[0];L[i*3+1]=l[1];L[i*3+2]=l[2]}
 let bgs;if(o.mode==='pick'){bgs=[lab(...hex(o.color))]}else{const s=[],step=Math.max(1,Math.floor((2*(W+H))/600));for(let X=0;X<W;X+=step){s.push(X,X+(H-1)*W)}for(let Y=0;Y<H;Y+=step){s.push(Y*W,Y*W+W-1)}
  const px=s.filter(i=>d[i*4+3]>10).map(i=>[L[i*3],L[i*3+1],L[i*3+2]]);if(!px.length)return{c,W,H,cut:0};const C=kmeans(px,Math.min(3,px.length)).filter(c=>c[3]>px.length*.12);bgs=C.length?C:kmeans(px,1)}
 const tol=4+(+o.tol)*1.6,soft=tol*(1+(+o.soft)/40),dist=new Float32Array(N);for(let i=0;i<N;i++){let m=1e9;for(const b of bgs){const v=Math.hypot(L[i*3]-b[0],(L[i*3+1]-b[1])*.8,(L[i*3+2]-b[2])*.8);if(v<m)m=v}dist[i]=d[i*4+3]<8?0:m}
 const bg=new Uint8Array(N),q=new Int32Array(N);let h=0,t=0;const push=i=>{if(!bg[i]&&dist[i]<tol){bg[i]=1;q[t++]=i}};
 if(o.holes){for(let i=0;i<N;i++)if(dist[i]<tol)bg[i]=1}else{for(let X=0;X<W;X++){push(X);push(X+(H-1)*W)}for(let Y=0;Y<H;Y++){push(Y*W);push(Y*W+W-1)}
  while(h<t){const i=q[h++],X=i%W,Y=(i/W)|0;if(X>0)push(i-1);if(X<W-1)push(i+1);if(Y>0)push(i-W);if(Y<H-1)push(i+W)}}
 if(o.keep==='largest'){const lab2=new Int32Array(N).fill(-1),sizes=[];let id=0;for(let s=0;s<N;s++){if(bg[s]||lab2[s]>=0)continue;let hh=0,tt=0;q[tt++]=s;lab2[s]=id;let n=0;while(hh<tt){const i=q[hh++];n++;const X=i%W,Y=(i/W)|0;for(const j of[X>0?i-1:-1,X<W-1?i+1:-1,Y>0?i-W:-1,Y<H-1?i+W:-1])if(j>=0&&!bg[j]&&lab2[j]<0){lab2[j]=id;q[tt++]=j}}sizes.push(n);id++}
  if(sizes.length>1){const big=Math.max(...sizes),keep=sizes.map(s=>s>=big*.04);for(let i=0;i<N;i++)if(!bg[i]&&!keep[lab2[i]])bg[i]=1}}
 // alpha: hard inside, soft ramp near threshold, then a 1px blur of the edge
 const A=new Float32Array(N);for(let i=0;i<N;i++)A[i]=bg[i]?0:1;
 {const band=new Uint8Array(N);for(let Y=0;Y<H;Y++)for(let X=0;X<W;X++){const i=Y*W+X;if(bg[i])continue;let near=false;for(let dy=-2;dy<=2&&!near;dy++)for(let dx=-2;dx<=2;dx++){const xx=X+dx,yy=Y+dy;if(xx>=0&&yy>=0&&xx<W&&yy<H&&bg[yy*W+xx]){near=true;break}}if(near&&dist[i]<soft)A[i]=Math.max(0,Math.min(1,(dist[i]-tol)/Math.max(1,soft-tol)))}}
 const B=new Float32Array(N);for(let Y=0;Y<H;Y++)for(let X=0;X<W;X++){const i=Y*W+X;if(A[i]===1&&(X===0||A[i-1]===1)&&(X===W-1||A[i+1]===1)&&(Y===0||A[i-W]===1)&&(Y===H-1||A[i+W]===1)){B[i]=1;continue}let s=0,n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=X+dx,yy=Y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;s+=A[yy*W+xx]*(dx||dy?1:2);n+=dx||dy?1:2}B[i]=s/n}
 const bgRGB=o.mode==='pick'?hex(o.color):null;let cut=0;
 for(let i=0;i<N;i++){const a=B[i];if(a<.999){cut++;if(o.despill&&a>.02){let br,bgc,bb;if(bgRGB)[br,bgc,bb]=bgRGB;else{br=255;bgc=255;bb=255;let m=1e9;for(const b of bgs){const v=Math.hypot(L[i*3]-b[0],L[i*3+1]-b[1],L[i*3+2]-b[2]);if(v<m){m=v}}}
   if(!bgRGB){/* estimate local background from the nearest fully transparent neighbour */for(let r=1;r<=3;r++){const X=i%W,Y=(i/W)|0;let f=false;for(const[dx,dy]of[[r,0],[-r,0],[0,r],[0,-r]]){const xx=X+dx,yy=Y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;const j=yy*W+xx;if(B[j]<.05){br=d[j*4];bgc=d[j*4+1];bb=d[j*4+2];f=true;break}}if(f)break}}
   const ea=Math.max(a,.35),dc=(v,b)=>Math.max(0,Math.min(255,(v-(1-ea)*b)/ea));d[i*4]=d[i*4]*.4+dc(d[i*4],br)*.6;d[i*4+1]=d[i*4+1]*.4+dc(d[i*4+1],bgc)*.6;d[i*4+2]=d[i*4+2]*.4+dc(d[i*4+2],bb)*.6}d[i*4+3]=Math.round(d[i*4+3]*a)}}
 x.putImageData(im,0,0);return{c,W,H,cut:cut/N}}
async function url(c){return new FileReaderSync().readAsDataURL(await c.convertToBlob({type:'image/png'}))}
async function preview(o){if(!SRC)return'';const r=process(SRC.bm,o,420),P=new OffscreenCanvas(r.W,r.H),x=P.getContext('2d'),s=10;for(let Y=0;Y<r.H;Y+=s)for(let X=0;X<r.W;X+=s){x.fillStyle=((X+Y)/s)%2?'#d9d9d9':'#f5f5f5';x.fillRect(X,Y,s,s)}x.drawImage(r.c,0,0);return{src:await url(P)}}
async function pickImage(){const sel=(await cocoa.selection()).filter(n=>n.type==='image');if(!sel.length){cocoa.toast(T('Select an image first.','Сначала выделите изображение.'));return null}return sel}
async function apply(o,sel){let n=0;for(const im of sel){try{const bm=await load(im.id),r=process(bm,o);await cocoa.setImage(im.id,await url(r.c));n++}catch(e){cocoa.toast(String(e.message||e))}}cocoa.storage.set('opts',o);if(n)cocoa.toast(T(`Background removed from ${n} image${n>1?'s':''}. Undo brings it back.`,`Фон удалён: ${n}. Отмена вернёт его.`))}
async function open(){const sel=await pickImage();if(!sel)return;try{SRC={id:sel[0].id,bm:await load(sel[0].id)}}catch(e){return cocoa.toast(String(e.message||e))}
 await cocoa.ui.form({title:T('Remove background','Удаление фона'),ok:sel.length>1?T(`Remove from ${sel.length}`,`Удалить у ${sel.length}`):T('Remove background','Удалить фон'),
  fields:[{type:'preview',key:'pv',height:200},{type:'chips',key:'mode',value:last.mode,options:[['auto',T('Automatic','Автоматически')],['pick',T('Pick a colour','Выбрать цвет')]]},
   {type:'color',key:'color',label:T('Background colour','Цвет фона'),value:last.color},
   {type:'range',key:'tol',label:T('Strength','Сила'),min:1,max:60,value:last.tol},{type:'range',key:'soft',label:T('Edge softness','Мягкость края'),min:0,max:100,value:last.soft},
   {type:'toggle',key:'holes',label:T('Also remove enclosed areas (inside letters, gaps)','Удалять и замкнутые области (внутри букв, просветы)'),value:last.holes},
   {type:'select',key:'keep',label:T('Keep','Оставить'),value:last.keep,options:[['largest',T('Main subject only','Только главный объект')],['all',T('Everything that is not background','Всё, что не фон')]]},
   {type:'toggle',key:'despill',label:T('Clean colour fringes','Убирать цветную кайму'),value:last.despill},
   {type:'info',value:T('Runs on your device. Best with plain or studio backgrounds; busy scenes may need a lower strength.','Работает на устройстве. Лучше всего с однотонным фоном; для сложных сцен уменьшите силу.')}],
  onInput:async o=>{last={...last,...o};return{pv:await preview(last),$hide:o.mode==='pick'?[]:['color']}},
  onSubmit:o=>apply({...last,...o},sel)})}
cocoa.addMenuItem(T('Remove background…','Удалить фон…'),open);
cocoa.addMenuItem(T('Quick remove background','Быстро удалить фон'),async()=>{const sel=await pickImage();if(sel)apply(last,sel)});
cocoa.helper.addCommand(/^(?:remove|cut out|delete|erase)\s+(?:the\s+)?(?:background|bg)$|^(?:удали|убери|вырежи)\s+фон$/i,async()=>{const sel=await pickImage();if(sel)apply(last,sel)},T('remove the image background','удалить фон изображения'));
