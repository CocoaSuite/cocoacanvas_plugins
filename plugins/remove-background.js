// ==CocoaCanvas Plugin==
// @id remove-background
// @name Remove Background
// @name_ru Удаление фона
// @version 3.0.0
// @author CocoaSuite
// @description Cuts the subject out of any photo with an AI model that runs on your device. The first time, the model downloads (44 or 115 MB) and is tested before you can use it; it is kept for next time and your photos never leave the device. A quick no-download mode handles plain backgrounds.
// @description_ru Вырезает объект с любого фото с помощью ИИ-модели, которая работает на устройстве. В первый раз модель скачивается (44 или 115 МБ) и проверяется, прежде чем ей можно пользоваться; она сохраняется, а фото не покидают устройство. Быстрый режим без загрузки справляется с однотонным фоном.
// @icon ✂
// @color #5B6CD9
// @permissions ui menu helper read edit net
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const ORT_BASE='https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
const ORT_FILES=['ort.webgpu.min.mjs','ort.min.mjs','ort.all.min.mjs'];
const HF='https://huggingface.co/';
const MODELS={
 fast:{name:T('Fast','Быстрая'),repo:'onnx-community/ormbg-ONNX',file:'onnx/model_quantized.onnx',size:44,mb:'44 MB',S:1024,mean:[0,0,0],std:[1,1,1]},
 best:{name:T('Best','Лучшая'),repo:'onnx-community/BiRefNet_lite-ONNX',file:'onnx/model_fp16.onnx',size:115,mb:'115 MB',S:1024,mean:[.485,.456,.406],std:[.229,.224,.225],gpuOnly:true}};
let last={engine:'fast',cut:50,soft:30,plainTol:22};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
const toBlob=u=>{const m=/^data:([^;,]+)(;base64)?,(.*)$/.exec(u);if(!m)throw new Error('bad image');const b=m[2]?atob(m[3]):decodeURIComponent(m[3]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);return new Blob([a],{type:m[1]})};
const url=async c=>new FileReaderSync().readAsDataURL(await c.convertToBlob({type:'image/png'}));
const msg=e=>String(e&&(e.message||e)||'unknown error').slice(0,220);
// ---------- runtime ----------
let ORT=null,GPU=null;
async function hasGPU(){if(GPU!==null)return GPU;try{GPU=!!(self.navigator&&navigator.gpu&&await navigator.gpu.requestAdapter())}catch(e){GPU=false}return GPU}
async function ort(){if(ORT)return ORT;let err;for(const f of ORT_FILES){try{const m=await import(ORT_BASE+f);const o=m.default&&m.default.InferenceSession?m.default:m;if(!o.InferenceSession)throw new Error('no InferenceSession in '+f);o.env.wasm.wasmPaths=ORT_BASE;o.env.wasm.numThreads=1;o.env.wasm.proxy=false;ORT=o;return o}catch(e){err=e}}throw new Error(T('Couldn’t load the AI runtime from jsDelivr: ','Не удалось загрузить ИИ-среду с jsDelivr: ')+msg(err))}
// ---------- download with progress, kept on the device ----------
const KEY=k=>'model:'+MODELS[k].repo+'/'+MODELS[k].file;
async function download(k,onP){const M=MODELS[k],cached=await cocoa.cache.get(KEY(k));if(cached&&cached.byteLength>1e6)return cached;
 let r;try{r=await fetch(HF+M.repo+'/resolve/main/'+M.file,{mode:'cors'})}catch(e){throw new Error(T('Couldn’t reach Hugging Face. Check the internet connection. ','Не удалось связаться с Hugging Face. Проверьте интернет. ')+msg(e))}
 if(!r.ok)throw new Error(T('Hugging Face answered ','Hugging Face ответил ')+r.status);
 const total=+r.headers.get('content-length')||M.size*1048576,rd=r.body?.getReader?.();let buf;
 if(!rd){buf=await r.arrayBuffer()}else{const parts=[];let got=0;for(;;){const{done,value}=await rd.read();if(done)break;parts.push(value);got+=value.length;onP&&onP(got,total)}buf=new Uint8Array(got);let o=0;for(const p of parts){buf.set(p,o);o+=p.length}buf=buf.buffer}
 if(buf.byteLength<1e6)throw new Error(T('The download was incomplete.','Загрузка не завершилась.'));
 try{await cocoa.cache.put(KEY(k),buf)}catch(e){throw new Error(T('Couldn’t keep the model on this device (storage full?): ','Не удалось сохранить модель на устройстве (нет места?): ')+msg(e))}return buf}
// ---------- session ----------
const SES={};
async function session(k,bytes){if(SES[k])return SES[k];const o=await ort(),gpu=await hasGPU();const tries=gpu?[['webgpu'],['wasm']]:[['wasm']];let err;
 for(const ep of tries){try{const s=await o.InferenceSession.create(bytes||await download(k),{executionProviders:ep,graphOptimizationLevel:'all'});SES[k]={s,ep:ep[0]};return SES[k]}catch(e){err=e}}
 throw new Error(T('The model couldn’t start on this device: ','Модель не запустилась на этом устройстве: ')+msg(err))}
// ---------- inference ----------
async function infer(k,bm){const M=MODELS[k],{s}=await session(k),o=ORT,S=M.S,c=new OffscreenCanvas(S,S),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0,S,S);const px=x.getImageData(0,0,S,S).data,N=S*S,inp=new Float32Array(3*N);
 for(let i=0;i<N;i++)for(let ch=0;ch<3;ch++)inp[ch*N+i]=(px[i*4+ch]/255-M.mean[ch])/M.std[ch];
 const feeds={[s.inputNames[0]]:new o.Tensor('float32',inp,[1,3,S,S])},out=await s.run(feeds),t=out[s.outputNames[0]],d=t.data,dims=t.dims,H=dims[dims.length-2],W=dims[dims.length-1];
 let mn=Infinity,mx=-Infinity;for(let i=0;i<d.length;i+=101){const v=Number(d[i]);if(v<mn)mn=v;if(v>mx)mx=v}const sig=mn<-0.01||mx>1.01;
 const small=new OffscreenCanvas(W,H),sx=small.getContext('2d'),id=sx.createImageData(W,H);for(let i=0;i<W*H;i++){let v=Number(d[i]);if(sig)v=1/(1+Math.exp(-v));id.data[i*4+3]=Math.round(Math.max(0,Math.min(1,v))*255)}sx.putImageData(id,0,0);
 const big=new OffscreenCanvas(bm.width,bm.height),bx=big.getContext('2d',{willReadFrequently:true});bx.imageSmoothingQuality='high';bx.drawImage(small,0,0,bm.width,bm.height);const a=bx.getImageData(0,0,bm.width,bm.height).data,m=new Float32Array(bm.width*bm.height);for(let i=0;i<m.length;i++)m[i]=a[i*4+3]/255;return m}
// ---------- the self-test that has to pass before the plugin opens ----------
async function selfTest(k){const c=new OffscreenCanvas(256,256),x=c.getContext('2d');x.fillStyle='#e8e8e8';x.fillRect(0,0,256,256);x.fillStyle='#c0392b';x.beginPath();x.arc(128,128,70,0,7);x.fill();const bm=await createImageBitmap(c),m=await infer(k,bm);
 if(!m||m.length!==256*256||m.some(v=>!isFinite(v)))throw new Error(T('The model gave an unreadable result.','Модель вернула нечитаемый результат.'));return true}
const ready=async k=>{const v=await cocoa.storage.get('ok:'+KEY(k));if(!v)return false;const b=await cocoa.cache.get(KEY(k));return!!(b&&b.byteLength>1e6)};
// ---------- plain backgrounds (no download) ----------
function lab(r,g,b){const f=c=>{c/=255;return c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4)},R=f(r),G=f(g),B=f(b),X=(R*.4124+G*.3576+B*.1805)/.95047,Y=R*.2126+G*.7152+B*.0722,Z=(R*.0193+G*.1192+B*.9505)/1.08883,q=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;const fx=q(X),fy=q(Y),fz=q(Z);return[116*fy-16,500*(fx-fy),200*(fy-fz)]}
function plainMask(bm,o){const W=bm.width,H=bm.height,c=new OffscreenCanvas(W,H),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0);const d=x.getImageData(0,0,W,H).data,N=W*H,L=new Float32Array(N*3);
 for(let i=0;i<N;i++){const l=lab(d[i*4],d[i*4+1],d[i*4+2]);L[i*3]=l[0];L[i*3+1]=l[1];L[i*3+2]=l[2]}const s=[];for(let X=0;X<W;X+=4){s.push(X,X+(H-1)*W)}for(let Y=0;Y<H;Y+=4){s.push(Y*W,Y*W+W-1)}
 let b=[0,0,0];for(const i of s){b[0]+=L[i*3];b[1]+=L[i*3+1];b[2]+=L[i*3+2]}b=b.map(v=>v/s.length);const tol=4+(+o.plainTol)*1.6,soft=tol*1.6,m=new Float32Array(N).fill(1),q=new Int32Array(N),seen=new Uint8Array(N);let h=0,t=0;
 const dist=i=>Math.hypot(L[i*3]-b[0],(L[i*3+1]-b[1])*.8,(L[i*3+2]-b[2])*.8),push=i=>{if(!seen[i]&&dist(i)<soft){seen[i]=1;q[t++]=i}};for(let X=0;X<W;X++){push(X);push(X+(H-1)*W)}for(let Y=0;Y<H;Y++){push(Y*W);push(Y*W+W-1)}
 while(h<t){const i=q[h++],X=i%W,Y=(i/W)|0;m[i]=Math.max(0,Math.min(1,(dist(i)-tol)/(soft-tol)));if(dist(i)>=tol)continue;if(X>0)push(i-1);if(X<W-1)push(i+1);if(Y>0)push(i-W);if(Y<H-1)push(i+W)}return m}
function compose(bm,mask,o){const W=bm.width,H=bm.height,c=new OffscreenCanvas(W,H),x=c.getContext('2d',{willReadFrequently:true});x.drawImage(bm,0,0);const im=x.getImageData(0,0,W,H),d=im.data;
 const cut=(+o.cut)/100,sw=.02+(+o.soft)/100*.45,lo=Math.max(0,cut-sw/2),hi=Math.min(1,cut+sw/2);for(let i=0;i<W*H;i++){let a=mask[i];a=a<=lo?0:a>=hi?1:(a-lo)/(hi-lo);d[i*4+3]=Math.round(d[i*4+3]*a)}x.putImageData(im,0,0);return c}
async function getBM(id){const u=await cocoa.imageData(id);if(!u)throw new Error(T('This photo has no pixels yet.','У этого фото нет данных.'));return createImageBitmap(toBlob(u))}
const MASKS=new Map();
async function maskFor(id,bm,o){if(o.engine==='plain')return plainMask(bm,o);const key=id+'|'+o.engine;if(!MASKS.has(key))MASKS.set(key,await infer(o.engine,bm));return MASKS.get(key)}
async function apply(o,sel){let n=0;for(const im of sel){try{const bm=await getBM(im.id),m=await maskFor(im.id,bm,o);await cocoa.setImage(im.id,await url(compose(bm,m,o)));n++}catch(e){cocoa.toast(T('Couldn’t remove the background: ','Не удалось удалить фон: ')+msg(e))}}
 cocoa.storage.set('opts',o);if(n)cocoa.toast(T(`Background removed from ${n} photo${n>1?'s':''}. Undo brings it back.`,`Фон удалён: ${n}. Отмена вернёт его.`))}
async function pickImage(){const sel=(await cocoa.selection()).filter(n=>n.type==='image');if(!sel.length){cocoa.toast(T('Select a photo first.','Сначала выделите фото.'));return null}return sel}
// ---------- setup: download, start and test the model before anything else ----------
async function setup(then){const gpu=await hasGPU(),def=gpu?'best':'fast';let running=false;
 await cocoa.ui.form({title:T('Set up background removal','Настройка удаления фона'),ok:T('Download and test','Скачать и проверить'),
  fields:[{type:'info',value:T('The AI model runs on your device, so it has to be downloaded once. It is checked before use and kept for next time.','ИИ-модель работает на устройстве, поэтому её нужно один раз скачать. Перед использованием она проверяется и сохраняется.')},
   {type:'chips',key:'engine',label:T('Model','Модель'),value:def,options:[['fast',T('Fast · 44 MB','Быстрая · 44 МБ')],['best',T('Best · 115 MB','Лучшая · 115 МБ')],...(then?[['plain',T('Plain background · no download','Однотонный фон · без загрузки')]]:[])]},
   {type:'info',key:'note',value:''},{type:'info',key:'status',value:''}],
  onInput:o=>(o.engine==='plain'?{note:T('Removes plain, even backgrounds without any download. You can set up an AI model later from the Plugins menu.','Убирает однотонный фон без загрузки. ИИ-модель можно настроить позже в меню плагинов.'),$ok:T('Continue','Продолжить')}:{$ok:T('Download and test','Скачать и проверить'),note:o.engine==='best'?(gpu?T('Sharpest edges. Uses the graphics chip.','Самые чёткие края. Использует видеочип.'):T('This device has no WebGPU, so Best would be very slow. Choose Fast.','На этом устройстве нет WebGPU, «Лучшая» будет очень медленной. Выберите «Быстрая».')):T('Good for people, products and most photos. Works on every device.','Подходит для людей, товаров и большинства фото. Работает на любом устройстве.')}),
  onSubmit:async o=>{if(o.engine==='plain'){last.engine='plain';cocoa.closeForm();return then&&then()}if(running)return;running=true;const k=o.engine,up=v=>cocoa.ui.update(v);up({$busy:true,status:T('Loading the AI runtime…','Загружаю ИИ-среду…')});
   try{await ort();let lastP=0;const bytes=await download(k,(g,t)=>{const now=Date.now();if(now-lastP<250)return;lastP=now;up({status:T(`Downloading… ${Math.min(100,Math.round(g/t*100))}% (${(g/1048576).toFixed(0)} of ${(t/1048576).toFixed(0)} MB)`,`Скачиваю… ${Math.min(100,Math.round(g/t*100))}% (${(g/1048576).toFixed(0)} из ${(t/1048576).toFixed(0)} МБ)`)})});
    up({status:T('Starting the model…','Запускаю модель…')});const ses=await session(k,bytes);up({status:T('Testing on a sample picture…','Проверяю на тестовой картинке…')});await selfTest(k);
    await cocoa.storage.set('ok:'+KEY(k),{at:Date.now(),ep:ses.ep});last.engine=k;cocoa.storage.set('opts',last);up({status:T(`Ready (${ses.ep==='webgpu'?'graphics chip':'processor'}).`,`Готово (${ses.ep==='webgpu'?'видеочип':'процессор'}).`)});
    cocoa.closeForm();then&&then()}
   catch(e){delete SES[k];up({$busy:false,$ok:T('Try again','Повторить'),status:'⚠ '+msg(e)+' '+T('You can still use “Plain background”, which needs no download.','Можно пользоваться режимом «Однотонный фон», он не требует загрузки.')})}finally{running=false}}})}
let SRC=null;
async function preview(o){if(!SRC)return'';const k=Math.min(1,420/Math.max(SRC.bm.width,SRC.bm.height)),w=Math.max(1,Math.round(SRC.bm.width*k)),h=Math.max(1,Math.round(SRC.bm.height*k));let m;
 try{m=await maskFor(SRC.id,SRC.bm,o)}catch(e){cocoa.toast(msg(e));return''}const full=compose(SRC.bm,m,o),P=new OffscreenCanvas(w,h),x=P.getContext('2d'),s=10;for(let Y=0;Y<h;Y+=s)for(let X=0;X<w;X+=s){x.fillStyle=((X+Y)/s)%2?'#d9d9d9':'#f5f5f5';x.fillRect(X,Y,s,s)}x.drawImage(full,0,0,w,h);return{src:await url(P)}}
async function mainForm(sel){const okF=await ready('fast'),okB=await ready('best'),opts=[...(okF?[['fast',T('AI, fast','ИИ, быстрая')]]:[]),...(okB?[['best',T('AI, best','ИИ, лучшая')]]:[]),['plain',T('Plain background','Однотонный фон')]];
 let eng=opts.some(x=>x[0]===last.engine)?last.engine:opts[0][0];
 try{SRC={id:sel[0].id,bm:await getBM(sel[0].id)}}catch(e){return cocoa.toast(msg(e))}
 await cocoa.ui.form({title:T('Remove background','Удаление фона'),ok:sel.length>1?T(`Remove from ${sel.length}`,`Удалить у ${sel.length}`):T('Remove background','Удалить фон'),
  fields:[{type:'preview',key:'pv',height:220},{type:'chips',key:'engine',label:T('Method','Способ'),value:eng,options:opts},
   {type:'range',key:'cut',label:T('Edge position','Положение края'),min:5,max:95,value:last.cut,unit:'%'},{type:'range',key:'soft',label:T('Edge softness','Мягкость края'),min:0,max:100,value:last.soft},
   {type:'range',key:'plainTol',label:T('Strength','Сила'),min:1,max:60,value:last.plainTol},
   {type:'info',value:T('Everything runs on your device. Other models: Plugins → Set up AI models.','Всё работает на устройстве. Другие модели: Плагины → Настроить ИИ-модели.')}],
  onInput:async o=>{last={...last,...o};return{pv:await preview(last),$hide:o.engine==='plain'?['cut','soft']:['plainTol']}},
  onSubmit:o=>apply({...last,...o},sel)})}
async function open(){const sel=await pickImage();if(!sel)return;if(!(await ready('fast'))&&!(await ready('best')))return setup(()=>mainForm(sel));mainForm(sel)}
cocoa.addMenuItem(T('Remove background…','Удалить фон…'),open);
cocoa.addMenuItem(T('Set up AI models…','Настроить ИИ-модели…'),()=>setup(null));
cocoa.addMenuItem(T('Delete downloaded AI models','Удалить скачанные ИИ-модели'),async()=>{await cocoa.cache.clear();for(const k in MODELS)await cocoa.storage.set('ok:'+KEY(k),null);for(const k in SES)delete SES[k];MASKS.clear();cocoa.toast(T('Downloaded models removed.','Скачанные модели удалены.'))});
cocoa.helper.addCommand(/^(?:remove|cut out|delete|erase)\s+(?:the\s+)?(?:background|bg)$|^(?:удали|убери|вырежи)\s+фон$/i,open,T('remove the photo background','удалить фон фото'));
