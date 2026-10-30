// ==CocoaCanvas Plugin==
// @id remove-background
// @name Remove Background
// @name_ru Удаление фона
// @version 2.0.0
// @author CocoaSuite
// @description Cuts the subject out of any photo with an AI model that runs on your device. The model downloads once (44 to 115 MB) and is kept for next time; your images never leave the device. A quick no-download mode handles plain backgrounds.
// @description_ru Вырезает объект с любого фото с помощью ИИ-модели, которая работает на устройстве. Модель скачивается один раз (от 44 до 115 МБ) и сохраняется; изображения не покидают устройство. Быстрый режим без загрузки справляется с однотонным фоном.
// @icon ✂
// @color #5B6CD9
// @permissions ui menu helper read edit net
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const TJS='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/dist/transformers.min.js';
const MODELS={best:{id:'onnx-community/BiRefNet_lite-ONNX',dtype:'fp16',size:'115 MB',gpu:true},fast:{id:'onnx-community/ormbg-ONNX',dtype:'q8',size:'44 MB',gpu:false}};
let last={engine:'auto',cut:50,soft:30,plainTol:22};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
const hasGPU=async()=>{try{return!!(self.navigator?.gpu&&await navigator.gpu.requestAdapter())}catch(e){return false}};
const toBlob=u=>{const m=/^data:([^;,]+)(;base64)?,(.*)$/.exec(u);if(!m)throw new Error('bad image');const b=m[2]?atob(m[3]):decodeURIComponent(m[3]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Blob([a],{type:m[1]})};
const url=async c=>new FileReaderSync().readAsDataURL(await c.convertToBlob({type:'image/png'}));
// ---- model loading (cached on the device through cocoa.cache) ----
let TF=null,LOADED={};
const CACHE={async match(k){const b=await cocoa.cache.get(String(k));return b?new Response(b):undefined},async put(k,res){try{const b=await res.arrayBuffer();await cocoa.cache.put(String(k),b)}catch(e){}}};
async function lib(){if(TF)return TF;TF=await import(TJS);const e=TF.env;e.allowLocalModels=false;e.useBrowserCache=false;e.useCustomCache=true;e.customCache=CACHE;try{e.backends.onnx.wasm.numThreads=1}catch(_){}return TF}
async function pickEngine(o){if(o.engine==='best'||o.engine==='fast')return o.engine;return(await hasGPU())?'best':'fast'}
let lastToast=0;const prog=(name)=>p=>{if(p.status!=='progress'||!p.total)return;const now=Date.now();if(now-lastToast<900&&p.progress<100)return;lastToast=now;cocoa.toast(T(`Downloading the AI model… ${Math.round(p.progress)}%`,`Загружаю ИИ-модель… ${Math.round(p.progress)}%`))};
async function load(engine){if(LOADED[engine])return LOADED[engine];const M=MODELS[engine],tf=await lib(),gpu=M.gpu&&await hasGPU();
 LOADED[engine]=(async()=>{const model=await tf.AutoModel.from_pretrained(M.id,{dtype:gpu?M.dtype:(engine==='best'?'fp32':M.dtype),device:gpu?'webgpu':'wasm',progress_callback:prog(engine)}),proc=await tf.AutoProcessor.from_pretrained(M.id,{progress_callback:prog(engine)});return{model,proc,tf}})();
 try{return await LOADED[engine]}catch(e){delete LOADED[engine];throw e}}
// ---- run: returns a Float32 alpha mask at the image's size ----
const MASKS=new Map();
async function aiMask(id,bm,engine){const key=id+'|'+engine;if(MASKS.has(key))return MASKS.get(key);const{model,proc,tf}=await load(engine);
 const c=new OffscreenCanvas(bm.width,bm.height);c.getContext('2d').drawImage(bm,0,0);const img=await tf.RawImage.fromBlob(await c.convertToBlob({type:'image/png'}));
 const{pixel_values}=await proc(img);let out;const names=['input_image','input','pixel_values'];let lastErr;
 for(const n of names){try{out=await model({[n]:pixel_values});break}catch(e){lastErr=e}}if(!out)throw lastErr;
 const t=Object.values(out)[0],d=t.data,[H,W]=t.dims.slice(-2);let mn=Infinity,mx=-Infinity;for(let i=0;i<d.length;i+=97){if(d[i]<mn)mn=d[i];if(d[i]>mx)mx=d[i]}const sig=mn<-0.01||mx>1.01;
 const u8=new Uint8ClampedArray(W*H);for(let i=0;i<W*H;i++){const v=sig?1/(1+Math.exp(-d[i])):d[i];u8[i]=Math.round(Math.max(0,Math.min(1,v))*255)}
 const small=new OffscreenCanvas(W,H),sx=small.getContext('2d'),id8=sx.createImageData(W,H);for(let i=0;i<W*H;i++){id8.data[i*4+3]=u8[i]}sx.putImageData(id8,0,0);
 const big=new OffscreenCanvas(bm.width,bm.height),bx=big.getContext('2d',{willReadFrequently:true});bx.imageSmoothingQuality='high';bx.drawImage(small,0,0,bm.width,bm.height);
 const a=bx.getImageData(0,0,bm.width,bm.height).data,m=new Float32Array(bm.width*bm.height);for(let i=0;i<m.length;i++)m[i]=a[i*4+3]/255;MASKS.set(key,m);return m}
// ---- quick mode for plain backgrounds (no download) ----
function lab(r,g,b){const f=c=>{c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)},R=f(r),G=f(g),B=f(b),X=(R*.4124+G*.3576+B*.1805)/.95047,Y=R*.2126+G*.7152+B*.0722,Z=(R*.0193+G*.1192+B*.9505)/1.08883,q=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;const fx=q(X),fy=q(Y),fz=q(Z);return[116*fy-16,500*(fx-fy),200*(fy-fz)]}
function plainMask(bm,o){const W=bm.width,H=bm.height,c=new OffscreenCanvas(W,H),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0);const d=x.getImageData(0,0,W,H).data,N=W*H,L=new Float32Array(N*3);
 for(let i=0;i<N;i++){const l=lab(d[i*4],d[i*4+1],d[i*4+2]);L[i*3]=l[0];L[i*3+1]=l[1];L[i*3+2]=l[2]}const s=[];for(let X=0;X<W;X+=4){s.push(X,X+(H-1)*W)}for(let Y=0;Y<H;Y+=4){s.push(Y*W,Y*W+W-1)}
 let b=[0,0,0];for(const i of s){b[0]+=L[i*3];b[1]+=L[i*3+1];b[2]+=L[i*3+2]}b=b.map(v=>v/s.length);const tol=4+(+o.plainTol)*1.6,soft=tol*1.6,m=new Float32Array(N).fill(1),q=new Int32Array(N),seen=new Uint8Array(N);let h=0,t=0;
 const dist=i=>Math.hypot(L[i*3]-b[0],(L[i*3+1]-b[1])*.8,(L[i*3+2]-b[2])*.8),push=i=>{if(!seen[i]&&dist(i)<soft){seen[i]=1;q[t++]=i}};for(let X=0;X<W;X++){push(X);push(X+(H-1)*W)}for(let Y=0;Y<H;Y++){push(Y*W);push(Y*W+W-1)}
 while(h<t){const i=q[h++],X=i%W,Y=(i/W)|0;m[i]=Math.max(0,Math.min(1,(dist(i)-tol)/(soft-tol)));if(dist(i)>=tol)continue;if(X>0)push(i-1);if(X<W-1)push(i+1);if(Y>0)push(i-W);if(Y<H-1)push(i+W)}return m}
// ---- compose ----
function compose(bm,mask,o){const W=bm.width,H=bm.height,c=new OffscreenCanvas(W,H),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0);const im=x.getImageData(0,0,W,H),d=im.data;
 const cut=(+o.cut)/100,sw=.02+(+o.soft)/100*.45,lo=Math.max(0,cut-sw/2),hi=Math.min(1,cut+sw/2);
 for(let i=0;i<W*H;i++){let a=mask[i];a=a<=lo?0:a>=hi?1:(a-lo)/(hi-lo);d[i*4+3]=Math.round(d[i*4+3]*a)}x.putImageData(im,0,0);return c}
async function getBM(id){const u=await cocoa.imageData(id);if(!u)throw new Error(T('This image has no pixels yet.','У этого изображения нет данных.'));return createImageBitmap(toBlob(u))}
async function maskFor(id,bm,o){if(o.engine==='plain')return plainMask(bm,o);return aiMask(id,bm,await pickEngine(o))}
async function apply(o,sel){let n=0;for(const im of sel){try{const bm=await getBM(im.id),m=await maskFor(im.id,bm,o);await cocoa.setImage(im.id,await url(compose(bm,m,o)));n++}catch(e){cocoa.toast(T('Couldn’t remove the background: ','Не удалось удалить фон: ')+String(e?.message||e).slice(0,140))}}
 cocoa.storage.set('opts',o);if(n)cocoa.toast(T(`Background removed from ${n} image${n>1?'s':''}. Undo brings it back.`,`Фон удалён: ${n}. Отмена вернёт его.`))}
async function pickImage(){const sel=(await cocoa.selection()).filter(n=>n.type==='image');if(!sel.length){cocoa.toast(T('Select an image first.','Сначала выделите изображение.'));return null}return sel}
let SRC=null;
async function preview(o){if(!SRC)return'';const k=Math.min(1,420/Math.max(SRC.bm.width,SRC.bm.height)),w=Math.max(1,Math.round(SRC.bm.width*k)),h=Math.max(1,Math.round(SRC.bm.height*k));
 let m;try{m=await maskFor(SRC.id,SRC.bm,o)}catch(e){return{src:''}}const full=compose(SRC.bm,m,o),P=new OffscreenCanvas(w,h),x=P.getContext('2d'),s=10;for(let Y=0;Y<h;Y+=s)for(let X=0;X<w;X+=s){x.fillStyle=((X+Y)/s)%2?'#d9d9d9':'#f5f5f5';x.fillRect(X,Y,s,s)}x.drawImage(full,0,0,w,h);return{src:await url(P)}}
async function open(){const sel=await pickImage();if(!sel)return;try{SRC={id:sel[0].id,bm:await getBM(sel[0].id)}}catch(e){return cocoa.toast(String(e.message||e))}
 const gpu=await hasGPU();
 await cocoa.ui.form({title:T('Remove background','Удаление фона'),ok:sel.length>1?T(`Remove from ${sel.length}`,`Удалить у ${sel.length}`):T('Remove background','Удалить фон'),
  fields:[{type:'preview',key:'pv',height:220},
   {type:'chips',key:'engine',label:T('Method','Способ'),value:last.engine,options:[['auto',T('AI, automatic','ИИ, автоматически')],['best',T('AI, best','ИИ, лучшее')],['fast',T('AI, fast','ИИ, быстрое')],['plain',T('Plain background','Однотонный фон')]]},
   {type:'info',key:'about',value:''},
   {type:'range',key:'cut',label:T('Edge position','Положение края'),min:5,max:95,value:last.cut,unit:'%'},
   {type:'range',key:'soft',label:T('Edge softness','Мягкость края'),min:0,max:100,value:last.soft},
   {type:'range',key:'plainTol',label:T('Strength','Сила'),min:1,max:60,value:last.plainTol}],
  onInput:async o=>{last={...last,...o};const eng=o.engine==='auto'?(gpu?'best':'fast'):o.engine,M=MODELS[eng];
   const about=o.engine==='plain'?T('No download. Best for studio shots, logos and scans on a plain background.','Без загрузки. Лучше всего для студийных снимков, логотипов и сканов на однотонном фоне.')
    :T(`Runs on your device. The ${eng==='best'?'best':'fast'} model downloads once (${M.size}) and is kept for next time.${eng==='best'&&!gpu?' This device has no WebGPU, so it will be slow; try Fast.':''}`,`Работает на устройстве. ${eng==='best'?'Лучшая':'Быстрая'} модель скачивается один раз (${M.size}) и сохраняется.${eng==='best'&&!gpu?' На этом устройстве нет WebGPU, будет медленно; попробуйте «Быстрое».':''}`);
   return{about,pv:await preview(last),$hide:o.engine==='plain'?['cut','soft']:['plainTol']}},
  onSubmit:o=>apply({...last,...o},sel)})}
cocoa.addMenuItem(T('Remove background…','Удалить фон…'),open);
cocoa.addMenuItem(T('Quick remove background','Быстро удалить фон'),async()=>{const sel=await pickImage();if(sel)apply(last,sel)});
cocoa.addMenuItem(T('Delete downloaded AI models','Удалить скачанные ИИ-модели'),async()=>{await cocoa.cache.clear();for(const k in LOADED)delete LOADED[k];MASKS.clear();cocoa.toast(T('Downloaded models removed.','Скачанные модели удалены.'))});
cocoa.helper.addCommand(/^(?:remove|cut out|delete|erase)\s+(?:the\s+)?(?:background|bg)$|^(?:удали|убери|вырежи)\s+фон$/i,async()=>{const sel=await pickImage();if(sel)apply(last,sel)},T('remove the image background','удалить фон изображения'));
