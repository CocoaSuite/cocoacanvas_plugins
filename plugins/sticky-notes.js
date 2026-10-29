// ==CocoaCanvas Plugin==
// @id sticky-notes
// @name Sticky Notes
// @name_ru Стикеры
// @version 1.0.0
// @author CocoaSuite
// @description Sticky notes and to-do lists for planning on the canvas. Notes come in soft colours and resize with their text; tick to-do items straight from the Plugins menu or Cocoa Helper.
// @description_ru Стикеры и списки дел для планирования прямо на холсте. Заметки мягких цветов подстраиваются под текст; отмечайте задачи из меню плагинов или через Cocoa Helper.
// @icon ✎
// @color #E2B93B
// @permissions ui menu helper read insert edit
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const COLORS=[['yellow','#FFE68A',T('Yellow','Жёлтый')],['peach','#FFC9A8',T('Peach','Персик')],['pink','#FFB8CF',T('Pink','Розовый')],['lilac','#D7C4FF',T('Lilac','Сирень')],['blue','#B8DBFF',T('Blue','Голубой')],['mint','#B8F0D2',T('Mint','Мята')],['grey','#E4E1DC',T('Grey','Серый')]];
const INK='#2B2621',DONE='#8D867D',CHECK='#2B2621';
const col=k=>(COLORS.find(c=>c[0]===k)||COLORS[0])[1];
let last={kind:'note',color:'yellow',text:'',title:T('To do','Дела'),items:T('Sketch the home screen\nPick a colour palette\nShare with the team','Набросать главный экран\nВыбрать палитру\nПоказать команде'),size:240,font:'Rounded',fsz:18,author:false};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
const today=()=>new Date().toLocaleDateString(cocoa.lang==='ru'?'ru-RU':undefined,{day:'numeric',month:'short'});
const shadow=[{t:'ds',x:0,y:6,b:16,s:0,c:'#000000',a:.16}];
const P=(x,y)=>({x,y,ix:0,iy:0,ox:0,oy:0});
function checkbox(done){return{type:'frame',name:done?'☑ box':'☐ box',w:20,h:20,fill:done?CHECK:null,stroke:CHECK,sw:2,sa:'i',r:5,clip:false,al:{d:'h',g:0,p:[0,0,0,0],ax:1,ay:1,sw:'f',sh:'f'},children:[{type:'path',name:'Tick',x:0,y:0,w:11,h:8,pts:[P(.5,4),P(4,7.5),P(10.5,.5)],closed:false,fill:null,stroke:'#FFFFFF',sw:2.4,cap:'round',join:'round',hid:!done}]}}
function todoItem(text,done,o,w){return{type:'frame',name:(done?'☑ ':'☐ ')+text.slice(0,40),fill:null,clip:false,w,h:24,al:{d:'h',g:10,p:[2,0,2,0],ay:1,sw:'f',sh:'h'},lw:'fill',
 children:[checkbox(done),{type:'text',name:text.slice(0,40),text,fs:o.fsz,ff:o.font,fw:500,fill:done?DONE:INK,sk:!!done,lh:1.3,fixW:true,w:w-30,lw:'fill'}]}}
function build(o){const S=Math.max(140,Math.min(800,+o.size||240)),bg=col(o.color),pad=Math.round(S*.09);
 if(o.kind==='todo'){const its=String(o.items||'').split('\n').map(s=>s.trim()).filter(Boolean).slice(0,60),W=Math.max(S,260);
  return{type:'frame',name:T('To-do list','Список дел')+(o.title?' · '+o.title:''),w:W,h:S,fill:bg,r:6,clip:true,efx:shadow,al:{d:'v',g:12,p:[pad,pad,pad,pad],sw:'f',sh:'h'},
   children:[...(o.title?[{type:'text',name:o.title,text:o.title,fs:Math.round(o.fsz*1.35),ff:o.font,fw:700,fill:INK,lh:1.2,fixW:true,w:W-pad*2,lw:'fill'}]:[]),
    ...its.map(t=>{const m=t.match(/^\[(x| )\]\s*(.*)$/i);return todoItem(m?m[2]:t,!!m&&m[1].toLowerCase()==='x',o,W-pad*2)}),
    ...(o.author?[{type:'text',name:T('Date','Дата'),text:today(),fs:12,ff:o.font,fw:500,fill:DONE,fixW:true,w:W-pad*2,lw:'fill'}]:[])]}}
 const txt=String(o.text||'').trim()||T('Write something…','Напишите что-нибудь…');
 return{type:'frame',name:T('Sticky note','Стикер'),w:S,h:S,fill:bg,r:4,clip:true,efx:shadow,al:{d:'v',g:10,p:[pad,pad,pad,pad],sw:'f',sh:'f'},
  children:[{type:'text',name:txt.slice(0,40),text:txt,fs:o.fsz,ff:o.font,fw:500,fill:INK,lh:1.35,fixW:true,w:S-pad*2,lw:'fill'},...(o.author?[{type:'text',name:T('Date','Дата'),text:today(),fs:12,ff:o.font,fw:500,fill:DONE,fixW:true,w:S-pad*2,lw:'fill'}]:[])]}}
async function add(o,opts){const n=build(o);await cocoa.insert({nodes:[n]},Object.assign({top:true},opts||{}));cocoa.storage.set('opts',o)}
function find(nodes,pred,out=[]){for(const n of nodes||[]){if(pred(n))out.push(n);if(n.children)find(n.children,pred,out)}return out}
async function toggle(force){const sel=await cocoa.selection();let items=find(sel,n=>n.type==='frame'&&/^[☐☑] /.test(n.name||'')&&!/ box$/.test(n.name));
 if(!items.length){const own=sel.filter(n=>/^[☐☑] /.test(n.name||''));items=own}
 if(!items.length)return cocoa.toast(T('Select to-do items (or a whole list) first.','Сначала выделите задачи или весь список.'));
 const all=items.every(n=>/^☑/.test(n.name)),to=force!=null?force:!all,ups=[];
 for(const it of items){const box=(it.children||[]).find(k=>/ box$/.test(k.name||'')),tx=(it.children||[]).find(k=>k.type==='text');if(!box||!tx)continue;
  const label=String(it.name).slice(2);ups.push({id:it.id,props:{name:(to?'☑ ':'☐ ')+label}});ups.push({id:tx.id,props:{fill:to?DONE:INK,sk:to}});
  ups.push({id:box.id,props:{name:to?'☑ box':'☐ box',fill:to?CHECK:null}});const tick=(box.children||[])[0];if(tick)ups.push({id:tick.id,props:{hid:!to}})}
 await cocoa.updateMany(ups);cocoa.toast(to?T(`Ticked ${items.length}`,`Отмечено: ${items.length}`):T(`Unticked ${items.length}`,`Снято отметок: ${items.length}`))}
async function open(kind){await cocoa.ui.form({title:T('Sticky notes','Стикеры'),ok:T('Add','Добавить'),
 fields:[{type:'chips',key:'kind',value:kind||last.kind,options:[['note',T('Note','Заметка')],['todo',T('To-do list','Список дел')]]},
  {type:'chips',key:'color',label:T('Colour','Цвет'),value:last.color,options:COLORS.map(c=>[c[0],c[2]])},
  {type:'preview',key:'pv',height:150},
  {type:'textarea',key:'text',label:T('Note','Заметка'),value:last.text},
  {type:'text',key:'title',label:T('Title','Заголовок'),value:last.title},
  {type:'textarea',key:'items',label:T('One task per line. Start with [x] for done.','Одна задача в строке. [x] в начале — выполнено.'),value:last.items},
  {type:'range',key:'size',label:T('Size','Размер'),min:160,max:480,step:10,value:last.size},
  {type:'range',key:'fsz',label:T('Text size','Размер текста'),min:12,max:32,value:last.fsz},
  {type:'select',key:'font',label:T('Font','Шрифт'),value:last.font,options:[['Rounded',T('Rounded','Округлый')],['Sans','Sans'],['Serif','Serif'],['Mono','Mono']]},
  {type:'toggle',key:'author',label:T('Add today’s date','Добавить дату'),value:last.author}],
 onInput:async o=>{last={...last,...o};const n=build(last);let pv='';try{pv=await cocoa.preview({nodes:[n]})}catch(e){}return{pv,$hide:o.kind==='todo'?['text']:['title','items']}},
 onSubmit:o=>add({...last,...o})})}
cocoa.addMenuItem(T('Sticky note…','Стикер…'),()=>open('note'));
cocoa.addMenuItem(T('To-do list…','Список дел…'),()=>open('todo'));
cocoa.addMenuItem(T('Quick yellow note','Быстрый жёлтый стикер'),()=>add({...last,kind:'note',color:'yellow',text:''}));
cocoa.addMenuItem(T('Tick / untick selected to-dos','Отметить / снять отметку'),()=>toggle(null));
cocoa.helper.addCommand(/^(?:add\s+)?(?:a\s+)?(sticky(?:\s+note)?|note|стикер|заметк\w*)(?:\s+(.+))?$/i,(raw,m)=>add({...last,kind:'note',text:m[2]||''}),T('add a sticky note','добавить стикер'));
cocoa.helper.addCommand(/^(?:add\s+)?(?:a\s+)?(?:to-?do|todo list|checklist|список дел|чек-?лист)(?:\s*:\s*(.+))?$/i,(raw,m)=>add({...last,kind:'todo',items:m[1]?m[1].split(/\s*[,;]\s*/).join('\n'):last.items}),T('add a to-do list','добавить список дел'));
cocoa.helper.addCommand(/^(?:tick|check|done|untick|uncheck|отметить|выполнено|снять отметку)$/i,raw=>toggle(/^(un|снять)/i.test(raw)?false:/^(tick|check|done|отметить|выполнено)/i.test(raw)?true:null),T('tick selected to-dos','отметить выбранные задачи'));
