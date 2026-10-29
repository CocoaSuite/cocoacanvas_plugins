// ==CocoaCanvas Plugin==
// @id apple-design-kit
// @name Apple Design Kit
// @name_ru Apple Design Kit
// @version 1.0.0
// @author CocoaSuite
// @description Unofficial iOS-style components drawn from scratch: status and navigation bars, tab bar, buttons, switches, segmented controls, lists, alerts, action sheets, keyboard and iPhone screens. Light and dark. Not affiliated with Apple.
// @description_ru Неофициальные компоненты в стиле iOS, нарисованные с нуля: строка состояния, навигация, таб-бар, кнопки, переключатели, сегменты, списки, алерты, клавиатура и экраны iPhone. Светлые и тёмные. Не связано с Apple.
// @icon ⌘
// @color #0A84FF
// @permissions ui menu helper read insert
// ==/CocoaCanvas Plugin==
// Icons are from Lucide (ISC licence, (c) Lucide Icons and Contributors). "Apple", "iPhone" and "iOS" are trademarks of Apple Inc.; this kit is an independent recreation.
/*@@KIT@@*/
const T=cocoa.t,{F,G,R,E,T:X,I,al}=K,W=393;
function pal(s){const d=s.theme==='dark',tint=s.tint||(d?'#0A84FF':'#007AFF');return{d,tint,label:d?'#FFFFFF':'#000000',sec:d?'#EBEBF5':'#3C3C43',secA:.6,ter:d?'#EBEBF54D':'#3C3C434D',bg:d?'#000000':'#FFFFFF',grouped:d?'#000000':'#F2F2F7',cell:d?'#1C1C1E':'#FFFFFF',sep:d?'#38383A':'#C6C6C8',fill:d?'#787880':'#787880',fillA:d?.36:.2,
 green:d?'#30D158':'#34C759',red:d?'#FF453A':'#FF3B30',orange:d?'#FF9F0A':'#FF9500',gray:d?'#8E8E93':'#8E8E93',bar:d?'#1C1C1E':'#F9F9F9',barA:.94,thumb:'#FFFFFF',key:d?'#6B6B6B':'#FFFFFF',keyD:d?'#474747':'#ABB0BC',kbd:d?'#2B2B2B':'#D1D3D9'}}
const sec=(p,t,o={})=>X(t,Object.assign({fs:15,fill:p.sec,op:p.secA},o)),SF=(t,o)=>X(t,Object.assign({ff:'Sans'},o));
const glyph={signal:c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12"><rect x="0" y="7.5" width="3" height="4.5" rx=".8" fill="${c}"/><rect x="5" y="5" width="3" height="7" rx=".8" fill="${c}"/><rect x="10" y="2.5" width="3" height="9.5" rx=".8" fill="${c}"/><rect x="15" y="0" width="3" height="12" rx=".8" fill="${c}"/></svg>`,
 wifi:c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12"><path d="M8 2.3c2.4 0 4.6.9 6.2 2.5l1.2-1.2C13.4 1.6 10.8.5 8 .5S2.6 1.6.6 3.6l1.2 1.2C3.4 3.2 5.6 2.3 8 2.3zm0 3.4c1.5 0 2.8.6 3.8 1.5l1.2-1.2C11.7 4.7 9.9 3.9 8 3.9S4.3 4.7 3 6l1.2 1.2c1-.9 2.3-1.5 3.8-1.5zm0 3.4c.6 0 1.1.2 1.5.6L8 11.5 6.5 9.7c.4-.4.9-.6 1.5-.6z" fill="${c}"/></svg>`,
 battery:c=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="${c}" stroke-opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2.5" fill="${c}"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="${c}" fill-opacity=".45"/></svg>`};
const statusBar=p=>F({name:'Status bar',w:W,h:54,fill:null},[SF('9:41',{name:'Time',x:51,y:17,fs:17,fw:600,fill:p.label}),I(glyph.signal(p.label),{name:'Cellular',x:293,y:22,w:18,h:12}),I(glyph.wifi(p.label),{name:'Wi-Fi',x:316,y:22,w:16,h:12}),I(glyph.battery(p.label),{name:'Battery',x:337,y:21.5,w:27,h:13})]);
const homeInd=(p,y=0)=>F({name:'Home indicator',w:W,h:34,y,fill:null},[R({name:'Bar',x:(W-134)/2,y:21,w:134,h:5,r:3,fill:p.label})]);
const navLarge=(p,title)=>F({name:'Navigation bar / large',w:W,h:96,fill:p.grouped},[F({name:'Back',x:8,y:11,al:al('h',3,0,{ay:1})},[I(K.lu('chevron-left',p.tint,2.4),{w:28,h:28,name:'chevron'}),SF(T('Back','Назад'),{fs:17,fill:p.tint})]),SF(T('Edit','Изм.'),{name:'Action',x:W-16-34,y:11,fs:17,fill:p.tint}),SF(title||T('Title','Заголовок'),{name:'Large title',x:16,y:49,fs:34,fw:700,fill:p.label})]);
const navInline=(p,title)=>F({name:'Navigation bar',w:W,h:44,fill:p.bar,op:1},[F({name:'Back',x:8,y:11,al:al('h',3,0,{ay:1})},[I(K.lu('chevron-left',p.tint,2.4),{w:28,h:28,name:'chevron'}),SF(T('Back','Назад'),{fs:17,fill:p.tint})]),SF(title||T('Title','Заголовок'),{name:'Title',x:0,y:12,w:W,fixW:true,ta:'center',fs:17,fw:600,fill:p.label}),SF(T('Done','Готово'),{name:'Action',x:W-16-46,y:11,fs:17,fw:600,fill:p.tint}),R({name:'Separator',x:0,y:43.5,w:W,h:.5,fill:p.sep})]);
const tabBar=(p,sel=0)=>{const items=[['house',T('Home','Главная')],['search',T('Search','Поиск')],['heart',T('Saved','Избранное')],['user',T('Profile','Профиль')]],w=W/items.length;
 return F({name:'Tab bar',w:W,h:83,fill:p.bar},[R({name:'Separator',x:0,y:0,w:W,h:.5,fill:p.sep}),...items.map(([ic,l],i)=>F({name:'Tab / '+l,x:i*w,y:7,w,h:44,al:al('v',3,0,{ax:1,sw:'f',sh:'f'})},[I(K.lu(ic,i===sel?p.tint:p.gray,2),{w:26,h:26,name:ic}),SF(l,{fs:10,fw:500,fill:i===sel?p.tint:p.gray})])),homeInd(p,49)])};
const button=(p,kind,label,o={})=>{const big=!o.small,bg=kind==='filled'?p.tint:kind==='tinted'?K.mix(p.tint,p.d?'#000000':'#FFFFFF',p.d?.75:.84):kind==='gray'?K.mix(p.fill,p.d?'#000000':'#FFFFFF',p.d?.6:.84):null,c=kind==='filled'?'#FFFFFF':kind==='destructive'?p.red:p.tint;
 return F({name:'Button / '+kind,w:o.w||(big?361:undefined),h:big?50:34,r:o.capsule?25:big?12:17,fill:kind==='destructive'?K.mix(p.red,p.d?'#000000':'#FFFFFF',p.d?.75:.86):bg,al:al('h',6,big?[0,20]:[0,14],{ax:1,ay:1,sw:o.w||big?'f':'h',sh:'f'})},[SF(label,{fs:big?17:15,fw:600,fill:c})])};
const toggle=(p,on)=>F({name:on?'Switch / on':'Switch / off',w:51,h:31,r:15.5,fill:on?p.green:(p.d?'#39393D':'#E9E9EA')},[E({name:'Thumb',x:on?22:2,y:2,w:27,h:27,fill:'#FFFFFF',efx:[{t:'ds',x:0,y:3,b:8,s:0,c:'#000000',a:.15},{t:'ds',x:0,y:3,b:1,s:0,c:'#000000',a:.06}]})]);
const segmented=(p,labels,sel=0)=>{const w=361,sw=(w-4)/labels.length;return F({name:'Segmented control',w,h:32,r:9,fill:K.mix(p.fill,p.d?'#000000':'#FFFFFF',p.d?.65:.88)},[R({name:'Selection',x:2+sel*sw,y:2,w:sw,h:28,r:7,fill:p.d?'#636366':'#FFFFFF',efx:K.shadow(3,8,.12)}),...labels.map((l,i)=>SF(l,{x:2+i*sw,y:7,w:sw,fixW:true,ta:'center',fs:13,fw:i===sel?600:500,fill:p.label}))])};
const row=(p,o)=>F({name:'Row / '+o.title,w:o.w||361,h:44,fill:p.cell,al:al('h',12,[0,16],{ay:1,sw:'f',sh:'f'})},[o.icon&&F({name:'Icon',w:29,h:29,r:7,fill:o.color||p.tint,al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[I(K.lu(o.icon,'#FFFFFF',2),{w:18,h:18,name:o.icon})]),SF(o.title,{fs:17,fill:p.label,lw:'fill',name:'Title'}),o.value&&sec(p,o.value,{fs:17,name:'Value'}),o.toggle!=null?toggle(p,o.toggle):I(K.lu('chevron-right',p.gray,2.2),{w:16,h:16,name:'chevron',op:.7})]);
const list=(p,header,rows,footer)=>F({name:'List / inset grouped',w:361,al:al('v',0,0,{sw:'f'})},[header&&sec(p,header.toUpperCase(),{fs:13,name:'Header',x:16,lw:'fill'}),header&&R({name:'Spacer',w:361,h:7,fill:null}),F({name:'Section',w:361,r:10,clip:true,fill:p.cell,al:al('v',0,0,{sw:'f'})},rows.flatMap((r,i)=>[i?F({name:'Separator',w:361,h:.5,fill:p.cell,al:al('h',0,[0,0,0,r.icon?57:16],{sw:'f',sh:'f'})},[R({w:300,h:.5,fill:p.sep,lw:'fill'})]):null,row(p,r)])),footer&&R({name:'Spacer',w:361,h:7,fill:null}),footer&&sec(p,footer,{fs:13,name:'Footer',fixW:true,w:329,lh:1.35})]);
const searchBar=p=>F({name:'Search bar',w:361,h:36,r:10,fill:K.mix(p.fill,p.d?'#000000':'#FFFFFF',p.d?.64:.88),al:al('h',6,[0,8],{ay:1,sw:'f',sh:'f'})},[I(K.lu('search',p.gray,2.2),{w:17,h:17,name:'search'}),SF(T('Search','Поиск'),{fs:17,fill:p.gray,lw:'fill',name:'Placeholder'}),I(K.lu('mic',p.gray,2.2),{w:17,h:17,name:'mic'})]);
const textField=p=>F({name:'Text field',w:361,h:44,r:10,fill:p.cell,al:al('h',8,[0,16],{ay:1,sw:'f',sh:'f'})},[SF(T('Name','Имя'),{fs:17,fill:p.label,name:'Label'}),SF(T('Required','Обязательно'),{fs:17,fill:p.gray,op:.7,lw:'fill',ta:'right',fixW:true,w:200,name:'Placeholder'})]);
const alert=p=>{const bg=p.d?'#252525':'#F2F2F2',sepc=p.d?'#545458':'#C6C6C8';return F({name:'Alert',w:270,r:14,fill:bg,op:1,clip:true,al:al('v',0,0,{sw:'f'})},[F({name:'Content',w:270,al:al('v',2,[19,16,20,16],{ax:1,sw:'f'})},[SF(T('Allow notifications?','Разрешить уведомления?'),{fs:17,fw:600,fill:p.label,ta:'center',fixW:true,w:238,name:'Title'}),SF(T('Get updates when someone replies to you.','Получайте сообщения, когда вам отвечают.'),{fs:13,fill:p.label,ta:'center',fixW:true,w:238,lh:1.3,name:'Message'})]),R({name:'Separator',w:270,h:.5,fill:sepc}),F({name:'Actions',w:270,h:44,al:al('h',0,0,{sw:'f',sh:'f'})},[F({name:'Cancel',w:134.75,h:44,lw:'fill',al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[SF(T('Don’t Allow','Запретить'),{fs:17,fill:p.tint})]),R({name:'Separator',w:.5,h:44,fill:sepc}),F({name:'Default',w:134.75,h:44,lw:'fill',al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[SF(T('Allow','Разрешить'),{fs:17,fw:600,fill:p.tint})])])])};
const actionSheet=p=>{const bg=p.d?'#252525':'#F2F2F2',sepc=p.d?'#545458':'#C6C6C8',btn=(t,c,b)=>F({name:t,w:361,h:57,lw:'fill',al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[SF(t,{fs:20,fw:b?600:400,fill:c})]);
 return F({name:'Action sheet',w:361,al:al('v',8,0,{sw:'f'})},[F({name:'Actions',w:361,r:14,fill:bg,clip:true,al:al('v',0,0,{sw:'f'})},[F({name:'Header',w:361,lw:'fill',al:al('v',0,[14,16],{ax:1,sw:'f'})},[SF(T('Delete this photo?','Удалить фото?'),{fs:13,fill:p.gray,ta:'center'})]),R({name:'Separator',w:361,h:.5,fill:sepc,lw:'fill'}),btn(T('Delete Photo','Удалить фото'),p.red),R({name:'Separator',w:361,h:.5,fill:sepc,lw:'fill'}),btn(T('Duplicate','Дублировать'),p.tint)]),F({name:'Cancel',w:361,r:14,fill:p.d?'#2C2C2E':'#FFFFFF',al:al('v',0,0,{sw:'f'})},[btn(T('Cancel','Отмена'),p.tint,1)])])};
const slider=(p,v=.6)=>F({name:'Slider',w:361,h:28},[R({name:'Track',x:0,y:12,w:361,h:4,r:2,fill:K.mix(p.fill,p.d?'#000000':'#FFFFFF',p.d?.5:.75)}),R({name:'Fill',x:0,y:12,w:361*v,h:4,r:2,fill:p.tint}),E({name:'Thumb',x:361*v-14,y:0,w:28,h:28,fill:'#FFFFFF',efx:[{t:'ds',x:0,y:3,b:8,s:0,c:'#000000',a:.18}]})]);
const stepper=p=>{const bg=K.mix(p.fill,p.d?'#000000':'#FFFFFF',p.d?.64:.88);return F({name:'Stepper',w:94,h:32,r:8,fill:bg},[I(K.lu('minus',p.label,2),{x:14,y:7,w:18,h:18,name:'minus'}),R({name:'Divider',x:46.5,y:8,w:1,h:16,fill:p.sep}),I(K.lu('plus',p.label,2),{x:62,y:7,w:18,h:18,name:'plus'})])};
const progress=p=>F({name:'Progress view',w:361,h:4,r:2,fill:K.mix(p.fill,p.d?'#000000':'#FFFFFF',p.d?.5:.75),clip:true},[R({name:'Progress',w:200,h:4,r:2,fill:p.tint})]);
const pageDots=p=>F({name:'Page control',al:al('h',9,[6,10],{ay:1})},[0,1,2,3,4].map(i=>E({name:'Dot',w:7,h:7,fill:p.label,op:i===0?1:.3})));
const keyboard=p=>{const rows=['qwertyuiop','asdfghjkl','zxcvbnm'],kw=32,kh=42,key=(t,w,o={})=>F({name:'Key '+t,w:w||kw,h:kh,r:5,fill:o.dark?p.keyD:p.key,efx:[{t:'ds',x:0,y:1,b:0,s:0,c:'#000000',a:.3}],al:al('h',0,0,{ax:1,ay:1,sw:'f',sh:'f'})},[o.icon?I(K.lu(o.icon,p.label,1.8),{w:20,h:20,name:o.icon}):SF(t,{fs:o.fs||22,fill:p.label})]);
 return F({name:'Keyboard',w:W,h:291,fill:p.kbd,al:al('v',11,[8,3,0,3],{ax:1,sw:'f',sh:'f'})},[F({name:'Row 1',al:al('h',6,0)},[...rows[0]].map(c=>key(c))),F({name:'Row 2',al:al('h',6,0)},[...rows[1]].map(c=>key(c))),
  F({name:'Row 3',al:al('h',6,0,{ay:1})},[key('⇧',42,{dark:1,fs:20}),F({name:'Letters',al:al('h',6,[0,8])},[...rows[2]].map(c=>key(c))),key('⌫',42,{dark:1,fs:18})]),
  F({name:'Row 4',al:al('h',6,0)},[key('123',87,{dark:1,fs:16}),key(T('space','пробел'),182,{fs:16}),key(T('return','ввод'),87,{dark:1,fs:16})]),R({name:'Bottom',w:W,h:44,fill:null})])};
const screen=(p,kind)=>{const kids=[statusBar(p)];let H=852;
 if(kind==='list'){kids.push(Object.assign(navLarge(p,T('Settings','Настройки')),{y:54}));const L=(list(p,T('General','Основные'),[{title:T('Notifications','Уведомления'),icon:'bell',color:p.red},{title:T('Sounds','Звуки'),icon:'mic',color:'#FF2D55'},{title:'Wi-Fi',icon:'wifi',color:p.tint,value:'Home'}],null));L.x=16;L.y=160;kids.push(L);
  const L2=list(p,null,[{title:T('Dark mode','Тёмная тема'),icon:'star',color:'#5856D6',toggle:p.d},{title:T('Privacy','Конфиденциальность'),icon:'eye',color:p.tint}],T('Changes apply to all your devices.','Изменения применяются на всех ваших устройствах.'));L2.x=16;L2.y=330;kids.push(L2)}
 if(kind==='nav')kids.push(Object.assign(navInline(p,T('Title','Заголовок')),{y:54}));
 if(kind==='tabs'||kind==='list')kids.push(Object.assign(tabBar(p),{y:H-83}));else kids.push(homeInd(p,H-34));
 return F({name:'iPhone 16'+(kind==='list'?' · Settings':''),w:W,h:H,fill:kind==='list'?p.grouped:p.bg,clip:true,r:0},kids)};
const ITEMS=[
 {id:'s-blank',cat:'screens',label:T('Blank screen','Пустой экран'),screen:1,make:s=>screen(pal(s),'blank')},
 {id:'s-nav',cat:'screens',label:T('With navigation bar','С навигацией'),screen:1,make:s=>screen(pal(s),'nav')},
 {id:'s-tabs',cat:'screens',label:T('With tab bar','С таб-баром'),screen:1,make:s=>screen(pal(s),'tabs')},
 {id:'s-list',cat:'screens',label:T('Settings list','Список настроек'),screen:1,make:s=>screen(pal(s),'list')},
 {id:'b-status',cat:'bars',label:T('Status bar','Строка состояния'),make:s=>statusBar(pal(s))},
 {id:'b-navlarge',cat:'bars',label:T('Large title bar','Большой заголовок'),make:s=>navLarge(pal(s))},
 {id:'b-nav',cat:'bars',label:T('Navigation bar','Навигация'),make:s=>navInline(pal(s))},
 {id:'b-tab',cat:'bars',label:T('Tab bar','Таб-бар'),make:s=>tabBar(pal(s))},
 {id:'b-search',cat:'bars',label:T('Search bar','Поиск'),make:s=>searchBar(pal(s))},
 {id:'b-home',cat:'bars',label:T('Home indicator','Индикатор «Домой»'),make:s=>homeInd(pal(s))},
 {id:'c-filled',cat:'controls',label:T('Filled button','Кнопка'),make:s=>button(pal(s),'filled',T('Continue','Продолжить'))},
 {id:'c-tinted',cat:'controls',label:T('Tinted button','Тонированная'),make:s=>button(pal(s),'tinted',T('Add to Library','В библиотеку'))},
 {id:'c-gray',cat:'controls',label:T('Gray button','Серая'),make:s=>button(pal(s),'gray',T('Not Now','Не сейчас'))},
 {id:'c-small',cat:'controls',label:T('Capsule button','Капсула'),make:s=>button(pal(s),'filled',T('Get','Загрузить'),{small:1,capsule:1})},
 {id:'c-destructive',cat:'controls',label:T('Destructive','Опасное действие'),make:s=>button(pal(s),'destructive',T('Delete Account','Удалить аккаунт'))},
 {id:'c-switch',cat:'controls',label:T('Switches','Переключатели'),make:s=>{const p=pal(s);return F({name:'Switches',al:al('h',16,0)},[toggle(p,1),toggle(p,0)])}},
 {id:'c-seg',cat:'controls',label:T('Segmented control','Сегменты'),make:s=>segmented(pal(s),[T('Day','День'),T('Week','Неделя'),T('Month','Месяц')])},
 {id:'c-slider',cat:'controls',label:T('Slider','Слайдер'),make:s=>slider(pal(s))},
 {id:'c-stepper',cat:'controls',label:T('Stepper','Степпер'),make:s=>stepper(pal(s))},
 {id:'c-progress',cat:'controls',label:T('Progress','Прогресс'),make:s=>progress(pal(s))},
 {id:'c-dots',cat:'controls',label:T('Page dots','Точки страниц'),make:s=>pageDots(pal(s))},
 {id:'c-field',cat:'controls',label:T('Text field','Поле ввода'),make:s=>textField(pal(s))},
 {id:'l-inset',cat:'lists',label:T('Inset grouped list','Список-группа'),make:s=>{const p=pal(s);return list(p,T('Account','Аккаунт'),[{title:T('Apple ID','Учётная запись'),icon:'user',color:p.gray},{title:T('Notifications','Уведомления'),icon:'bell',color:p.red},{title:T('Airplane mode','Авиарежим'),icon:'compass',color:p.orange,toggle:false}],T('Manage how this device connects.','Настройте, как устройство подключается.'))}},
 {id:'l-row',cat:'lists',label:T('List row','Строка списка'),make:s=>{const p=pal(s);return F({name:'Row',w:361,r:10,clip:true,fill:p.cell,al:al('v',0,0,{sw:'f'})},[row(p,{title:'Wi-Fi',icon:'wifi',color:p.tint,value:T('Home','Дом')})])}},
 {id:'l-toggle',cat:'lists',label:T('Row with switch','Строка с переключателем'),make:s=>{const p=pal(s);return F({name:'Row',w:361,r:10,clip:true,fill:p.cell,al:al('v',0,0,{sw:'f'})},[row(p,{title:T('Dark mode','Тёмная тема'),icon:'star',color:'#5856D6',toggle:true})])}},
 {id:'a-alert',cat:'alerts',label:T('Alert','Алерт'),make:s=>alert(pal(s))},
 {id:'a-sheet',cat:'alerts',label:T('Action sheet','Меню действий'),make:s=>actionSheet(pal(s))},
 {id:'a-keyboard',cat:'alerts',label:T('Keyboard','Клавиатура'),make:s=>keyboard(pal(s))}];
const CATS=[['screens',T('Screens','Экраны')],['bars',T('Bars','Панели')],['controls',T('Controls','Элементы')],['lists',T('Lists','Списки')],['alerts',T('Alerts & keyboard','Алерты и клавиатура')]];
const open=()=>kitWindow({title:'Apple Design Kit',cats:CATS,items:ITEMS,columns:2,aspect:'4/3',cellBg:s=>s.theme==='dark'?'#000000':'#F2F2F7',defaults:{cat:'screens',pick:'s-list',theme:'light',tint:'#007AFF'},
 fields:s=>[{type:'chips',key:'theme',label:T('Appearance','Оформление'),value:s.theme,options:[['light',T('Light','Светлое')],['dark',T('Dark','Тёмное')]]},{type:'color',key:'tint',label:T('Tint colour','Цвет акцента'),value:s.tint},
  {type:'info',value:T('Unofficial, drawn from scratch in the style of iOS. Text uses the system font, which is San Francisco on Apple devices.','Неофициальный набор в стиле iOS, нарисован с нуля. Текст использует системный шрифт: на устройствах Apple это San Francisco.')}]});
cocoa.addMenuItem(T('Insert component…','Вставить компонент…'),open);
cocoa.addMenuItem(T('New iPhone screen','Новый экран iPhone'),async()=>{const s=Object.assign({theme:'light',tint:'#007AFF'},(await cocoa.storage.get('opts'))||{});await cocoa.insert({nodes:[K.abs(screen(pal(s),'blank'))]},{place:'new'})});
cocoa.helper.addCommand(/^(?:add\s+|new\s+)?(?:an?\s+)?(?:ios|iphone|айфон\S*)\s*(screen|экран\S*|status bar|tab bar|keyboard|alert)?$/i,async(raw,m)=>{const s=Object.assign({theme:'light',tint:'#007AFF'},(await cocoa.storage.get('opts'))||{}),k=(m[1]||'screen').toLowerCase(),id=/status/.test(k)?'b-status':/tab/.test(k)?'b-tab':/keyboard/.test(k)?'a-keyboard':/alert/.test(k)?'a-alert':'s-blank',it=ITEMS.find(x=>x.id===id);await cocoa.insert({nodes:[K.abs(it.make(s))]},it.screen?{place:'new'}:{})},T('add an iOS screen or component','добавить экран или компонент iOS'));
