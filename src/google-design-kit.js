// ==CocoaCanvas Plugin==
// @id google-design-kit
// @name Google Design Kit
// @name_ru Google Design Kit
// @version 1.0.0
// @author CocoaSuite
// @description Unofficial Material 3-style components drawn from scratch, coloured from your own seed colour: app bars, navigation bar, FABs, buttons, chips, switches, checkboxes, text fields, cards, lists, dialogs, snackbars and Android screens. Light and dark. Not affiliated with Google.
// @description_ru Неофициальные компоненты в стиле Material 3, нарисованы с нуля и окрашены от вашего базового цвета: верхние панели, навигация, FAB, кнопки, чипы, переключатели, чекбоксы, поля, карточки, списки, диалоги, снекбары и экраны Android. Светлые и тёмные. Не связано с Google.
// @icon M
// @color #6750A4
// @permissions ui menu helper read insert
// ==/CocoaCanvas Plugin==
// Icons are Material Symbols (Apache License 2.0, (c) Google LLC). "Google", "Android" and "Material Design" are trademarks of Google LLC; this kit is an independent recreation.
/*@@KIT@@*/
const T=cocoa.t,{F,G,R,E,T:X,I,al}=K,W=412;
function pal(s){const d=s.theme==='dark',S=s.seed||'#6750A4',m=K.mix,wh='#FFFFFF',bk='#000000',tint=(t)=>m(S,d?'#141218':'#FEF7FF',t);
 return{d,ff:s.font||'Roboto',primary:d?m(S,wh,.55):S,onPrimary:d?m(S,bk,.7):wh,pc:d?m(S,bk,.45):m(S,wh,.8),onPc:d?m(S,wh,.82):m(S,bk,.62),sc:d?m(m(S,'#808080',.45),bk,.45):m(m(S,'#808080',.35),wh,.78),onSc:d?m(S,wh,.85):m(S,bk,.7),
  surface:tint(d?.92:.97),scl:tint(d?.86:.94),sc0:tint(d?.82:.91),sch:tint(d?.78:.88),schh:tint(d?.72:.85),onS:d?'#E6E0E9':'#1D1B20',onSV:d?'#CAC4D0':'#49454F',outline:d?'#938F99':'#79747E',ov:d?'#49454F':'#CAC4D0',inv:d?'#E6E0E9':'#322F35',onInv:d?'#322F35':'#F5EFF7',invP:d?S:m(S,wh,.55),err:d?'#F2B8B5':'#B3261E',onErr:d?'#601410':'#FFFFFF'}}
const Y=(t,o)=>X(t,Object.assign({ff:o&&o.p?o.p.ff:'Roboto'},o,{p:undefined}));
const ic=(n,c,s=24,o={})=>I(K.ms(n,c),Object.assign({w:s,h:s,name:n.replace('_fill1','')},o));
const elev=(lv,p)=>lv?[{t:'ds',x:0,y:lv,b:lv*2,s:0,c:'#000000',a:p.d?.4:.15},{t:'ds',x:0,y:1,b:2,s:0,c:'#000000',a:p.d?.3:.12}]:undefined;
const statusBar=p=>F({name:'Status bar',w:W,h:52,fill:null,al:al('h',0,[0,24],{ay:1,sw:'f',sh:'f',ga:true})},[Y('12:30',{p,fs:14,fw:500,fill:p.onS,name:'Time'}),F({name:'System icons',al:al('h',4,0,{ay:1})},[ic('wifi_fill1',p.onS,17),ic('signal_cellular_alt',p.onS,17),ic('battery_full_fill1',p.onS,17)])]);
const gestureBar=(p,y=0)=>F({name:'Gesture bar',w:W,h:24,y,fill:null},[R({name:'Handle',x:(W-108)/2,y:10,w:108,h:4,r:2,fill:p.onS})]);
const topBar=(p,kind='small',title)=>{title=title||T('Title','Заголовок');const lead=ic(kind==='small'?'menu':'arrow_back',p.onS,24),trail=F({name:'Actions',al:al('h',0,0,{ay:1})},[F({name:'Icon button',w:48,h:48,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[ic('search',p.onSV)]),F({name:'Icon button',w:48,h:48,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[ic('more_vert',p.onSV)])]);
 if(kind==='large')return F({name:'Top app bar / large',w:W,h:152,fill:p.surface},[F({name:'Row',x:0,y:8,w:W,h:48,al:al('h',0,[0,4,0,16],{ay:1,sw:'f',sh:'f',ga:true})},[lead,trail]),Y(title,{p,name:'Headline',x:16,y:96,fs:28,fill:p.onS})]);
 return F({name:'Top app bar / '+kind,w:W,h:64,fill:p.surface,al:al('h',16,[0,4,0,16],{ay:1,sw:'f',sh:'f'})},[F({name:'Leading',w:48,h:48,al:al('h',0,0,{ay:1,sw:'f',sh:'f'})},[lead]),Y(title,{p,fs:22,fill:p.onS,lw:'fill',ta:kind==='center'?'center':'left',fixW:true,w:200,name:'Headline'}),trail])};
const navBar=(p,sel=0)=>{const it=[['home',T('Home','Главная')],['favorite',T('Saved','Избранное')],['notifications',T('Updates','События')],['person',T('Profile','Профиль')]];
 return F({name:'Navigation bar',w:W,h:80,fill:p.sc0,al:al('h',8,[12,8,16,8],{sw:'f',sh:'f'})},it.map(([n,l],i)=>F({name:'Destination / '+l,w:92,lw:'fill',al:al('v',4,0,{ax:1,sw:'f'})},[F({name:'Indicator',w:64,h:32,r:16,fill:i===sel?p.sc:null,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[ic(i===sel?n+'_fill1':n,i===sel?p.onSc:p.onSV)]),Y(l,{p,fs:12,fw:i===sel?700:500,fill:i===sel?p.onS:p.onSV})])))};
const fab=(p,size='m',ext)=>{const S={s:[40,12,24],m:[56,16,24],l:[96,28,36]}[size];if(ext)return F({name:'Extended FAB',h:56,r:16,fill:p.pc,efx:elev(3,p),al:al('h',12,[0,20,0,16],{ay:1,sh:'f'})},[ic('edit',p.onPc),Y(T('Compose','Написать'),{p,fs:14,fw:500,fill:p.onPc})]);
 return F({name:'FAB / '+({s:'small',m:'regular',l:'large'}[size]),w:S[0],h:S[0],r:S[1],fill:p.pc,efx:elev(3,p),al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[ic('add',p.onPc,S[2])])};
const button=(p,kind,label,icon)=>{const c={filled:[p.primary,p.onPrimary],tonal:[p.sc,p.onSc],elevated:[p.scl,p.primary],outlined:[null,p.primary],text:[null,p.primary]}[kind];
 return F({name:'Button / '+kind,h:40,r:20,fill:c[0],stroke:kind==='outlined'?p.outline:undefined,sw:kind==='outlined'?1:undefined,sa:'i',efx:kind==='elevated'?elev(1,p):undefined,al:al('h',8,kind==='text'?[0,12]:icon?[0,24,0,16]:[0,24],{ax:1,ay:1,sh:'f'})},[icon&&ic(icon,c[1],18),Y(label,{p,fs:14,fw:500,fill:c[1]})])};
const chip=(p,label,kind)=>{const sel=kind==='filter-on';return F({name:'Chip / '+kind,h:32,r:8,fill:sel?p.sc:null,stroke:sel?undefined:p.ov,sw:sel?undefined:1,sa:'i',al:al('h',8,[0,16,0,sel||kind==='assist'?8:16],{ay:1,sh:'f'})},[sel?ic('check',p.onSc,18):kind==='assist'?ic('calendar_today',p.primary,18):null,Y(label,{p,fs:14,fw:500,fill:sel?p.onSc:p.onSV})])};
const sw=(p,on)=>F({name:on?'Switch / on':'Switch / off',w:52,h:32,r:16,fill:on?p.primary:p.schh,stroke:on?undefined:p.outline,sw:on?undefined:2,sa:'i'},[on?E({name:'Handle',x:24,y:4,w:24,h:24,fill:p.onPrimary}):E({name:'Handle',x:8,y:8,w:16,h:16,fill:p.outline})]);
const check=(p,on)=>F({name:on?'Checkbox / checked':'Checkbox',w:40,h:40,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[on?F({name:'Box',w:18,h:18,r:2,fill:p.primary,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[ic('check',p.onPrimary,16)]):R({name:'Box',w:18,h:18,r:2,fill:null,stroke:p.onSV,sw:2,sa:'i'})]);
const radio=(p,on)=>F({name:on?'Radio / selected':'Radio',w:40,h:40,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[F({name:'Ring',w:20,h:20,r:10,fill:null,stroke:on?p.primary:p.onSV,sw:2,sa:'i',al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[on?E({name:'Dot',w:10,h:10,fill:p.primary}):null])]);
const field=(p,kind)=>{const lab=T('Label','Подпись'),val=T('Input text','Текст');if(kind==='filled')return F({name:'Text field / filled',w:280,h:56,r:4,rc:[4,4,0,0],fill:p.sch,clip:true},[Y(lab,{p,x:16,y:8,fs:12,fill:p.primary,name:'Label'}),Y(val,{p,x:16,y:26,fs:16,fill:p.onS,name:'Input'}),R({name:'Active indicator',x:0,y:54,w:280,h:2,fill:p.primary})]);
 return F({name:'Text field / outlined',w:280,h:64},[R({name:'Outline',x:0,y:8,w:280,h:56,r:4,fill:null,stroke:p.primary,sw:2,sa:'i'}),F({name:'Label',x:12,y:0,fill:p.surface,al:al('h',0,[0,4])},[Y(lab,{p,fs:12,fill:p.primary})]),Y(val,{p,x:16,y:24,fs:16,fill:p.onS,name:'Input'})])};
const search=p=>F({name:'Search bar',w:360,h:56,r:28,fill:p.sch,al:al('h',16,[0,16],{ay:1,sw:'f',sh:'f'})},[ic('menu',p.onS),Y(T('Search','Поиск'),{p,fs:16,fill:p.onSV,lw:'fill',name:'Placeholder'}),F({name:'Avatar',w:30,h:30,r:15,fill:p.pc,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[Y('A',{p,fs:14,fw:500,fill:p.onPc})])]);
const card=(p,kind)=>{const f={elevated:p.scl,filled:p.schh,outlined:p.surface}[kind];return F({name:'Card / '+kind,w:320,r:12,fill:f,stroke:kind==='outlined'?p.ov:undefined,sw:kind==='outlined'?1:undefined,sa:'i',efx:kind==='elevated'?elev(1,p):undefined,clip:true,al:al('v',0,0,{sw:'f'})},
 [F({name:'Media',w:320,h:160,fill:p.sc,lw:'fill',al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[ic('photo_camera',p.onSc,40)]),F({name:'Content',lw:'fill',al:al('v',4,[16,16,8,16],{sw:'f'})},[Y(T('Card title','Заголовок'),{p,fs:22,fill:p.onS,name:'Headline'}),Y(T('Supporting text','Поясняющий текст'),{p,fs:14,fill:p.onSV,name:'Subhead'})]),F({name:'Actions',lw:'fill',al:al('h',8,[8,16,16,16],{ax:2,sw:'f'})},[button(p,'outlined',T('Share','Поделиться')),button(p,'filled',T('Open','Открыть'))])])};
const listItem=(p,lines=2)=>F({name:'List item',w:W,h:lines===3?88:72,fill:p.surface,al:al('h',16,[12,24,12,16],{ay:1,sw:'f',sh:'f'})},[F({name:'Avatar',w:40,h:40,r:20,fill:p.pc,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[Y('A',{p,fs:16,fw:500,fill:p.onPc})]),F({name:'Text',lw:'fill',al:al('v',0,0)},[Y(T('List item','Элемент списка'),{p,fs:16,fill:p.onS,name:'Headline'}),Y(T('Supporting text','Поясняющий текст'),{p,fs:14,fill:p.onSV,name:'Supporting'})]),ic('chevron_right',p.onSV)]);
const dialog=p=>F({name:'Dialog',w:312,r:28,fill:p.sch,al:al('v',16,24,{sw:'f'})},[F({name:'Icon',lw:'fill',al:al('h',0,0,{ax:1,sw:'f'})},[ic('info',p.primary)]),Y(T('Reset settings?','Сбросить настройки?'),{p,fs:24,fill:p.onS,ta:'center',fixW:true,w:264,lw:'fill',name:'Headline'}),Y(T('This will reset your device to its default factory settings.','Устройство вернётся к заводским настройкам.'),{p,fs:14,lh:1.43,fill:p.onSV,fixW:true,w:264,lw:'fill',name:'Supporting text'}),F({name:'Actions',lw:'fill',al:al('h',8,[8,0,0,0],{ax:2,sw:'f'})},[button(p,'text',T('Cancel','Отмена')),button(p,'text',T('Accept','Принять'))])]);
const snackbar=p=>F({name:'Snackbar',w:344,h:48,r:4,fill:p.inv,efx:elev(3,p),al:al('h',8,[0,8,0,16],{ay:1,sw:'f',sh:'f'})},[Y(T('Message archived','Сообщение в архиве'),{p,fs:14,fill:p.onInv,lw:'fill'}),Y(T('Undo','Отменить'),{p,fs:14,fw:500,fill:p.invP})]);
const slider=p=>F({name:'Slider',w:280,h:44},[R({name:'Active track',x:0,y:14,w:160,h:16,r:8,fill:p.primary}),R({name:'Handle',x:166,y:0,w:4,h:44,r:2,fill:p.primary}),R({name:'Inactive track',x:176,y:14,w:104,h:16,r:8,fill:p.sc})]);
const progress=p=>F({name:'Linear progress',w:280,h:4,al:al('h',4,0,{ay:1,sw:'f',sh:'f'})},[R({name:'Active',w:168,h:4,r:2,fill:p.primary}),R({name:'Track',w:108,h:4,r:2,fill:p.sc,lw:'fill'})]);
const badge=p=>F({name:'Badges',al:al('h',24,0,{ay:1})},[F({name:'Icon with dot',w:24,h:24},[ic('notifications',p.onSV,24),E({name:'Badge',x:16,y:2,w:6,h:6,fill:p.err})]),F({name:'Icon with count',w:24,h:24},[ic('mail',p.onSV,24),F({name:'Badge',x:12,y:-4,h:16,r:8,fill:p.err,al:al('h',0,[0,4],{ay:1,ax:1,sh:'f'})},[Y('3',{p,fs:11,fw:500,fill:p.onErr})])])]);
const screen=(p,kind)=>{const H=917,kids=[statusBar(p)];if(kind==='app'||kind==='list')kids.push(Object.assign(topBar(p,kind==='list'?'large':'small',kind==='list'?T('Inbox','Входящие'):T('Title','Заголовок')),{y:52}));
 if(kind==='list'){const L=F({name:'List',x:0,y:204,w:W,al:al('v',0,0,{sw:'f'})},[0,1,2,3].map(()=>listItem(p)));kids.push(L);kids.push(Object.assign(fab(p,'m'),{x:W-16-56,y:H-80-24-16-56}))}
 if(kind==='app'||kind==='list')kids.push(Object.assign(navBar(p),{y:H-24-80}),R({name:'Nav bar fill',x:0,y:H-24,w:W,h:24,fill:p.sc0}));kids.push(Object.assign(gestureBar(p),{y:H-24}));
 return F({name:'Android · Medium phone'+(kind==='list'?' · Inbox':''),w:W,h:H,fill:p.surface,clip:true},kids)};
const ITEMS=[
 {id:'s-blank',cat:'screens',label:T('Blank screen','Пустой экран'),screen:1,make:s=>screen(pal(s),'blank')},
 {id:'s-app',cat:'screens',label:T('App bar + navigation','Панели и навигация'),screen:1,make:s=>screen(pal(s),'app')},
 {id:'s-list',cat:'screens',label:T('Inbox list','Список «Входящие»'),screen:1,make:s=>screen(pal(s),'list')},
 {id:'b-status',cat:'bars',label:T('Status bar','Строка состояния'),make:s=>statusBar(pal(s))},
 {id:'b-top',cat:'bars',label:T('Top app bar','Верхняя панель'),make:s=>topBar(pal(s),'small')},
 {id:'b-center',cat:'bars',label:T('Centre-aligned bar','Панель по центру'),make:s=>topBar(pal(s),'center')},
 {id:'b-large',cat:'bars',label:T('Large top bar','Большая панель'),make:s=>topBar(pal(s),'large')},
 {id:'b-nav',cat:'bars',label:T('Navigation bar','Нижняя навигация'),make:s=>navBar(pal(s))},
 {id:'b-search',cat:'bars',label:T('Search bar','Поиск'),make:s=>search(pal(s))},
 {id:'b-gesture',cat:'bars',label:T('Gesture bar','Жестовая панель'),make:s=>gestureBar(pal(s))},
 {id:'a-filled',cat:'actions',label:T('Filled button','Кнопка'),make:s=>button(pal(s),'filled',T('Continue','Продолжить'))},
 {id:'a-tonal',cat:'actions',label:T('Tonal button','Тональная'),make:s=>button(pal(s),'tonal',T('Add to list','В список'),'add')},
 {id:'a-outlined',cat:'actions',label:T('Outlined button','Контурная'),make:s=>button(pal(s),'outlined',T('Learn more','Подробнее'))},
 {id:'a-elevated',cat:'actions',label:T('Elevated button','Приподнятая'),make:s=>button(pal(s),'elevated',T('Share','Поделиться'),'share')},
 {id:'a-text',cat:'actions',label:T('Text button','Текстовая'),make:s=>button(pal(s),'text',T('Skip','Пропустить'))},
 {id:'a-fab',cat:'actions',label:'FAB',make:s=>{const p=pal(s);return F({name:'FABs',al:al('h',16,0,{ay:1})},[fab(p,'s'),fab(p,'m'),fab(p,'l')])}},
 {id:'a-efab',cat:'actions',label:T('Extended FAB','Расширенная FAB'),make:s=>fab(pal(s),'m',1)},
 {id:'a-chips',cat:'actions',label:T('Chips','Чипы'),make:s=>{const p=pal(s);return F({name:'Chips',al:al('h',8,0,{ay:1})},[chip(p,T('Add to calendar','В календарь'),'assist'),chip(p,T('Running','Бег'),'filter-on'),chip(p,T('Walking','Ходьба'),'filter')])}},
 {id:'c-switch',cat:'controls',label:T('Switches','Переключатели'),make:s=>{const p=pal(s);return F({name:'Switches',al:al('h',16,0,{ay:1})},[sw(p,1),sw(p,0)])}},
 {id:'c-check',cat:'controls',label:T('Checkboxes','Чекбоксы'),make:s=>{const p=pal(s);return F({name:'Checkboxes',al:al('h',0,0,{ay:1})},[check(p,1),check(p,0)])}},
 {id:'c-radio',cat:'controls',label:T('Radio buttons','Радиокнопки'),make:s=>{const p=pal(s);return F({name:'Radio buttons',al:al('h',0,0,{ay:1})},[radio(p,1),radio(p,0)])}},
 {id:'c-filled',cat:'controls',label:T('Filled text field','Поле (заливка)'),make:s=>field(pal(s),'filled')},
 {id:'c-outlined',cat:'controls',label:T('Outlined text field','Поле (контур)'),make:s=>field(pal(s),'outlined')},
 {id:'c-slider',cat:'controls',label:T('Slider','Слайдер'),make:s=>slider(pal(s))},
 {id:'c-progress',cat:'controls',label:T('Progress','Прогресс'),make:s=>progress(pal(s))},
 {id:'c-badge',cat:'controls',label:T('Badges','Бейджи'),make:s=>badge(pal(s))},
 {id:'o-card-e',cat:'content',label:T('Elevated card','Карточка'),make:s=>card(pal(s),'elevated')},
 {id:'o-card-o',cat:'content',label:T('Outlined card','Карточка с контуром'),make:s=>card(pal(s),'outlined')},
 {id:'o-list',cat:'content',label:T('List item','Элемент списка'),make:s=>listItem(pal(s))},
 {id:'o-dialog',cat:'content',label:T('Dialog','Диалог'),make:s=>dialog(pal(s))},
 {id:'o-snack',cat:'content',label:T('Snackbar','Снекбар'),make:s=>snackbar(pal(s))}];
const CATS=[['screens',T('Screens','Экраны')],['bars',T('Bars','Панели')],['actions',T('Buttons & chips','Кнопки и чипы')],['controls',T('Controls','Элементы')],['content',T('Cards & dialogs','Карточки и диалоги')]];
const open=()=>kitWindow({title:'Google Design Kit',cats:CATS,items:ITEMS,columns:2,aspect:'4/3',cellBg:s=>{const p=pal(s);return p.surface},defaults:{cat:'screens',pick:'s-list',theme:'light',seed:'#6750A4',font:'Roboto'},
 fields:s=>[{type:'chips',key:'theme',label:T('Theme','Тема'),value:s.theme,options:[['light',T('Light','Светлая')],['dark',T('Dark','Тёмная')]]},{type:'color',key:'seed',label:T('Seed colour','Базовый цвет'),value:s.seed},
  {type:'select',key:'font',label:T('Font','Шрифт'),value:s.font,options:[['Roboto','Roboto'],['Sans',T('System','Системный')],['Inter','Inter']]},
  {type:'info',value:T('Unofficial, drawn from scratch in the style of Material 3. Colours are derived from the seed colour.','Неофициальный набор в стиле Material 3, нарисован с нуля. Цвета выводятся из базового цвета.')}]});
cocoa.addMenuItem(T('Insert component…','Вставить компонент…'),open);
cocoa.addMenuItem(T('New Android screen','Новый экран Android'),async()=>{const s=Object.assign({theme:'light',seed:'#6750A4',font:'Roboto'},(await cocoa.storage.get('opts'))||{});await cocoa.insert({nodes:[K.abs(screen(pal(s),'blank'))]},{place:'new'})});
cocoa.helper.addCommand(/^(?:add\s+|new\s+)?(?:an?\s+)?(?:android|material|андроид\S*)\s*(screen|экран\S*|fab|button|card|dialog|navigation|top bar)?$/i,async(raw,m)=>{const s=Object.assign({theme:'light',seed:'#6750A4',font:'Roboto'},(await cocoa.storage.get('opts'))||{}),k=(m[1]||'screen').toLowerCase(),id=/fab/.test(k)?'a-fab':/button/.test(k)?'a-filled':/card/.test(k)?'o-card-e':/dialog/.test(k)?'o-dialog':/navigation/.test(k)?'b-nav':/top/.test(k)?'b-top':'s-blank',it=ITEMS.find(x=>x.id===id);await cocoa.insert({nodes:[K.abs(it.make(s))]},it.screen?{place:'new'}:{})},T('add an Android screen or Material component','добавить экран Android или компонент Material'));
