// ==CocoaCanvas Plugin==
// @id sticky-notes
// @name Sticky Notes
// @name_ru Стикеры
// @version 2.0.0
// @author CocoaSuite
// @description Sticky notes and to-do lists that float above your canvas for planning and feedback. They never become layers or end up in exports. Tap a note to edit it, change its colour or turn it into a checklist; tap a box to tick it.
// @description_ru Стикеры и списки дел поверх холста для планирования и заметок. Они не становятся слоями и не попадают в экспорт. Коснитесь стикера, чтобы изменить текст, цвет или превратить его в список; коснитесь квадратика, чтобы отметить пункт.
// @icon ✎
// @color #E2B93B
// @permissions ui menu helper insert
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const COLORS=[['yellow',T('Yellow','Жёлтый')],['peach',T('Peach','Персик')],['pink',T('Pink','Розовый')],['lilac',T('Lilac','Сирень')],['blue',T('Blue','Голубой')],['mint',T('Mint','Мята')],['grey',T('Grey','Серый')]];
let last={kind:'note',color:'yellow',text:'',title:T('To do','Дела'),items:'',size:220,fs:18};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v,{text:'',items:''})});
async function add(o){await cocoa.addNote({kind:o.kind,color:o.color,text:o.text,title:o.title,items:o.items,w:o.size,fs:o.fs});cocoa.storage.set('opts',{kind:o.kind,color:o.color,title:o.title,size:o.size,fs:o.fs})}
async function open(kind){await cocoa.ui.form({title:T('Sticky note','Стикер'),ok:T('Add','Добавить'),
 fields:[{type:'chips',key:'kind',value:kind||last.kind,options:[['note',T('Note','Заметка')],['todo',T('To-do list','Список дел')]]},
  {type:'chips',key:'color',label:T('Colour','Цвет'),value:last.color,options:COLORS},
  {type:'textarea',key:'text',label:T('Text (you can also type on the note itself)','Текст (можно писать и прямо на стикере)'),value:''},
  {type:'text',key:'title',label:T('Title','Заголовок'),value:last.title},
  {type:'textarea',key:'items',label:T('One task per line. Start with [x] for done.','Одна задача в строке. [x] в начале — выполнено.'),value:''},
  {type:'range',key:'size',label:T('Width','Ширина'),min:140,max:480,step:10,value:last.size},
  {type:'range',key:'fs',label:T('Text size','Размер текста'),min:12,max:32,value:last.fs},
  {type:'info',value:T('Notes float above the canvas and stay out of layers and exports. Hide them all from View → Show/hide sticky notes.','Стикеры лежат поверх холста и не попадают в слои и экспорт. Скрыть их все: «Вид → Показать/скрыть стикеры».')}],
 onInput:o=>{last={...last,...o};return{$hide:o.kind==='todo'?['text']:['title','items']}},
 onSubmit:async o=>{await add({...last,...o});cocoa.closeForm()}})}
cocoa.addMenuItem(T('Sticky note…','Стикер…'),()=>open('note'));
cocoa.addMenuItem(T('To-do list…','Список дел…'),()=>open('todo'));
cocoa.addMenuItem(T('Quick note','Быстрый стикер'),()=>add({...last,kind:'note',text:''}));
cocoa.addMenuItem(T('Quick to-do list','Быстрый список дел'),()=>add({...last,kind:'todo',items:''}));
cocoa.helper.addCommand(/^(?:add\s+)?(?:a\s+)?(?:sticky(?:\s+note)?|note|стикер|заметк\w*)(?:\s+(.+))?$/i,(raw,m)=>add({...last,kind:'note',text:m[1]||''}),T('add a sticky note','добавить стикер'));
cocoa.helper.addCommand(/^(?:add\s+)?(?:a\s+)?(?:to-?do(?: list)?|checklist|список дел|чек-?лист)(?:\s*:\s*(.+))?$/i,(raw,m)=>add({...last,kind:'todo',items:m[1]?m[1].split(/\s*[,;]\s*/).join('\n'):''}),T('add a to-do list','добавить список дел'));
