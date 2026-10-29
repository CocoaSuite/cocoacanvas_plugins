// ==CocoaCanvas Plugin==
// @id qr-code
// @name QR Code
// @name_ru QR-код
// @version 1.0.0
// @author CocoaSuite
// @description QR codes for links, text, Wi-Fi, email, phone, SMS and contacts. Inserted as an editable vector, with square, rounded or dot styles.
// @description_ru QR-коды для ссылок, текста, Wi-Fi, почты, телефона, SMS и контактов. Вставляются редактируемым вектором: квадраты, скругления или точки.
// @icon ▣
// @color #222222
// @permissions ui menu helper insert
// ==/CocoaCanvas Plugin==
// Uses "QR Code Generator for JavaScript" (c) 2009 Kazuhiko Arase, MIT licence. "QR Code" is a registered trademark of DENSO WAVE INCORPORATED.
/*@@QRLIB@@*/
qrcode.stringToBytes=qrcode.stringToBytesFuncs['UTF-8'];
const T=cocoa.t;
const esc=s=>String(s).replace(/([\;,:"])/g,'\\$1');
function payload(o){switch(o.kind){
 case'wifi':return`WIFI:T:${o.sec==='none'?'nopass':o.sec};S:${esc(o.ssid||'')};${o.sec==='none'?'':`P:${esc(o.pass||'')};`}${o.hidden?'H:true;':''};`;
 case'email':{const q=[o.subj&&'subject='+encodeURIComponent(o.subj),o.body&&'body='+encodeURIComponent(o.body)].filter(Boolean).join('&');return`mailto:${o.to||''}${q?'?'+q:''}`}
 case'phone':return`tel:${String(o.tel||'').replace(/[^\d+*#]/g,'')}`;
 case'sms':return`SMSTO:${String(o.tel||'').replace(/[^\d+]/g,'')}:${o.body||''}`;
 case'contact':return['BEGIN:VCARD','VERSION:3.0',`N:${o.name||''}`,`FN:${o.name||''}`,o.org&&`ORG:${o.org}`,o.tel&&`TEL:${o.tel}`,o.to&&`EMAIL:${o.to}`,o.url&&`URL:${o.url}`,'END:VCARD'].filter(Boolean).join('\n');
 default:{let t=String(o.text||'').trim();if(/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(t)&&!/\s/.test(t))t='https://'+t;return t}}}
function matrix(text,ec){const q=qrcode(0,ec||'M');q.addData(text||' ','Byte');q.make();const n=q.getModuleCount(),m=[];for(let r=0;r<n;r++){m.push([]);for(let c=0;c<n;c++)m[r].push(q.isDark(r,c))}return m}
const R=v=>Math.round(v*1000)/1000;
function svg(o){const m=matrix(payload(o),o.ec),n=m.length,q=Math.max(0,Math.min(8,+o.margin||0)),N=n+q*2,S=Math.max(16,+o.size||200),u=S/N,fg=o.fg||'#000000';
 const eye=(r,c)=>(r<7&&c<7)||(r<7&&c>=n-7)||(r>=n-7&&c<7),custom=o.eyes!=='square'||o.style!=='square';let d='';
 const rr=(x,y,w,h,k)=>{k=Math.min(k,w/2,h/2);return k<=0?`M${R(x)} ${R(y)}h${R(w)}v${R(h)}h${R(-w)}Z`:`M${R(x+k)} ${R(y)}h${R(w-2*k)}a${R(k)} ${R(k)} 0 0 1 ${R(k)} ${R(k)}v${R(h-2*k)}a${R(k)} ${R(k)} 0 0 1 ${R(-k)} ${R(k)}h${R(-(w-2*k))}a${R(k)} ${R(k)} 0 0 1 ${R(-k)} ${R(-k)}v${R(-(h-2*k))}a${R(k)} ${R(k)} 0 0 1 ${R(k)} ${R(-k)}Z`};
 const circ=(cx,cy,rad)=>`M${R(cx-rad)} ${R(cy)}a${R(rad)} ${R(rad)} 0 1 0 ${R(2*rad)} 0a${R(rad)} ${R(rad)} 0 1 0 ${R(-2*rad)} 0Z`;
 for(let r=0;r<n;r++){if(o.style==='square'){let c=0;while(c<n){if(m[r][c]&&!(custom&&eye(r,c))){let e=c;while(e<n&&m[r][e]&&!(custom&&eye(r,e)))e++;d+=`M${R((c+q)*u)} ${R((r+q)*u)}h${R((e-c)*u)}v${R(u)}h${R(-(e-c)*u)}Z`;c=e}else c++}}
  else for(let c=0;c<n;c++)if(m[r][c]&&!eye(r,c)){const x=(c+q)*u,y=(r+q)*u;d+=o.style==='dots'?circ(x+u/2,y+u/2,u*.48):rr(x+u*.04,y+u*.04,u*.92,u*.92,u*.32)}}
 let e='';if(custom||o.style!=='square')for(const[r0,c0]of[[0,0],[0,n-7],[n-7,0]]){const x=(c0+q)*u,y=(r0+q)*u,k=o.eyes==='circle'?3.5*u:o.eyes==='rounded'?1.6*u:0;
  if(o.eyes==='circle')e+=circ(x+3.5*u,y+3.5*u,3.5*u)+circ(x+3.5*u,y+3.5*u,2.5*u).replace(/a([\d.]+) ([\d.]+) 0 1 0/g,'a$1 $2 0 1 1')+circ(x+3.5*u,y+3.5*u,1.5*u);
  else e+=rr(x,y,7*u,7*u,k)+rr(x+u,y+u,5*u,5*u,Math.max(0,k-u)).replace(/a([\d.]+) ([\d.]+) 0 0 1/g,'a$1 $2 0 0 0').replace(/h([-\d.]+)a/,'h$1a')+rr(x+2*u,y+2*u,3*u,3*u,k?k*.6:0)}
 const bg=o.transparent?'':`<rect width="${R(S)}" height="${R(S)}" fill="${o.bg||'#ffffff'}"${o.radius?` rx="${+o.radius}"`:''}/>`;
 return{svg:`<svg xmlns="http://www.w3.org/2000/svg" width="${R(S)}" height="${R(S)}" viewBox="0 0 ${R(S)} ${R(S)}">${bg}<path d="${d}${e}" fill="${fg}" fill-rule="evenodd"/></svg>`,n}}
const KINDS=[['text',T('Link / text','Ссылка / текст')],['wifi','Wi-Fi'],['email',T('Email','Почта')],['phone',T('Phone','Телефон')],['sms','SMS'],['contact',T('Contact','Контакт')]];
const SHOW={text:['text'],wifi:['ssid','pass','sec','hidden'],email:['to','subj','body'],phone:['tel'],sms:['tel','body'],contact:['name','tel','to','org','url']};
const ALL=['text','ssid','pass','sec','hidden','to','subj','body','tel','name','org','url'];
let last={kind:'text',text:'https://cocoasuite.github.io/cocoacanvas/',ssid:'',pass:'',sec:'WPA',hidden:false,to:'',subj:'',body:'',tel:'',name:'',org:'',url:'',style:'square',eyes:'square',fg:'#000000',bg:'#FFFFFF',transparent:false,margin:2,size:240,ec:'M',radius:0};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
async function insert(o){let r;try{r=svg(o)}catch(e){return cocoa.toast(T('That is too much text for a QR code.','Слишком много текста для QR-кода.'))}
 await cocoa.insert({svg:r.svg,name:'QR code'});cocoa.storage.set('opts',o);cocoa.toast(T('QR code added as a vector. Test it with your phone camera before printing.','QR-код добавлен как вектор. Проверьте его камерой телефона перед печатью.'))}
async function open(){await cocoa.ui.form({title:T('QR code','QR-код'),ok:T('Insert','Вставить'),
 fields:[{type:'chips',key:'kind',value:last.kind,options:KINDS},
  {type:'textarea',key:'text',label:T('Link or text','Ссылка или текст'),rows:3,value:last.text},
  {type:'text',key:'ssid',label:T('Network name','Имя сети'),value:last.ssid},{type:'text',key:'pass',label:T('Password','Пароль'),value:last.pass},{type:'select',key:'sec',label:T('Security','Защита'),value:last.sec,options:[['WPA','WPA/WPA2/WPA3'],['WEP','WEP'],['none',T('None','Без пароля')]]},{type:'toggle',key:'hidden',label:T('Hidden network','Скрытая сеть'),value:last.hidden},
  {type:'text',key:'name',label:T('Name','Имя'),value:last.name},{type:'text',key:'tel',label:T('Phone number','Номер телефона'),value:last.tel},{type:'text',key:'to',label:T('Email address','Адрес почты'),value:last.to},{type:'text',key:'subj',label:T('Subject','Тема'),value:last.subj},{type:'textarea',key:'body',label:T('Message','Сообщение'),rows:2,value:last.body},{type:'text',key:'org',label:T('Company','Компания'),value:last.org},{type:'text',key:'url',label:T('Website','Сайт'),value:last.url},
  {type:'preview',key:'pv',height:170},{type:'info',key:'nfo',value:''},
  {type:'heading',label:T('Style','Стиль')},{type:'chips',key:'style',label:T('Modules','Модули'),value:last.style,options:[['square',T('Square','Квадраты')],['rounded',T('Rounded','Скруглённые')],['dots',T('Dots','Точки')]]},
  {type:'chips',key:'eyes',label:T('Corners','Углы'),value:last.eyes,options:[['square',T('Square','Квадрат')],['rounded',T('Rounded','Скруглённые')],['circle',T('Circle','Круг')]]},
  {type:'color',key:'fg',label:T('Colour','Цвет'),value:last.fg},{type:'color',key:'bg',label:T('Background','Фон'),value:last.bg},{type:'toggle',key:'transparent',label:T('Transparent background','Прозрачный фон'),value:last.transparent},
  {type:'range',key:'size',label:T('Size','Размер'),min:64,max:1024,step:8,value:last.size,unit:' px'},{type:'range',key:'margin',label:T('Quiet zone','Поля'),min:0,max:8,value:last.margin},{type:'range',key:'radius',label:T('Background corners','Углы фона'),min:0,max:60,value:last.radius},
  {type:'select',key:'ec',label:T('Error correction','Коррекция ошибок'),value:last.ec,options:[['L',T('Low (7%)','Низкая (7%)')],['M',T('Medium (15%)','Средняя (15%)')],['Q',T('Quartile (25%)','Высокая (25%)')],['H',T('High (30%)','Максимальная (30%)')]]}],
 hide:ALL.filter(k=>!SHOW[last.kind].includes(k)),
 onInput:o=>{last={...last,...o};let pv='',nfo='';try{const r=svg(last);pv=r.svg;const p=payload(last);nfo=T(`${r.n} × ${r.n} modules · ${p.length} characters`,`${r.n} × ${r.n} модулей · символов: ${p.length}`)+(last.fg&&last.bg&&!last.transparent&&lum(last.fg)>lum(last.bg)?T(' · Light-on-dark codes may not scan everywhere.',' · Светлый код на тёмном фоне читается не везде.'):'')}catch(e){nfo=T('Too long for a QR code.','Слишком длинно для QR-кода.')}
  return{pv,nfo,$hide:[...ALL.filter(k=>!SHOW[last.kind].includes(k)),...(last.transparent?['bg','radius']:[])]}},
 onSubmit:o=>insert({...last,...o})})}
const lum=h=>{const v=parseInt(h.slice(1),16);return.3*(v>>16)+.59*(v>>8&255)+.11*(v&255)};
cocoa.addMenuItem(T('QR code…','QR-код…'),open);
cocoa.helper.addCommand(/^(?:qr|qr code|qr-код|qr код|куар)\s+(.+)$/i,(raw,m)=>insert({...last,kind:'text',text:m[1].trim()}),T('add a QR code','добавить QR-код'));
