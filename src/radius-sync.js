// ==CocoaCanvas Plugin==
// @id radius-sync
// @name Radius Sync
// @name_ru Синхронизация скруглений
// @version 1.0.0
// @author CocoaSuite
// @description Makes nested corners look right. Inner layers get the outer radius minus the gap between them, so cards, buttons and screens share one smooth curve. Can also match one radius across many layers.
// @description_ru Делает вложенные углы аккуратными. Внутренние слои получают внешний радиус минус отступ между ними, и карточки, кнопки и экраны повторяют одну плавную кривую. Также может задать один радиус многим слоям.
// @icon ◜
// @color #4E7AC7
// @permissions ui menu helper read edit
// ==/CocoaCanvas Plugin==
const T=cocoa.t;
const ROUNDABLE=new Set(['rect','frame','image']),CONT=new Set(['frame','group']);
const rcOf=n=>Array.isArray(n.rc)&&n.rc.length===4?n.rc.map(v=>+v||0):[+n.r||0,+n.r||0,+n.r||0,+n.r||0];
let last={mode:'nested',deep:true,min:0,perCorner:true,match:16,round:true};
cocoa.storage.get('opts').then(v=>{if(v)last=Object.assign(last,v)});
function plan(sel,o){const ups=new Map(),rd=v=>o.round?Math.round(v):Math.round(v*10)/10;
 const setR=(n,R)=>{if(!ROUNDABLE.has(n.type))return;R=R.map(v=>Math.max(+o.min||0,Math.min(rd(v),n.w/2,n.h/2)));const same=R.every(v=>v===R[0]);ups.set(n.id,same?{r:R[0],rc:null}:{r:R[0],rc:R})};
 const radOf=n=>ups.has(n.id)?(ups.get(n.id).rc||[0,0,0,0].map(()=>ups.get(n.id).r)):rcOf(n);
 function inner(outer,kid){const R=radOf(outer);if(R.every(v=>v<=0))return null;const ox2=outer.x+outer.w,oy2=outer.y+outer.h,kx2=kid.x+kid.w,ky2=kid.y+kid.h,
   gap=[[kid.x-outer.x,kid.y-outer.y],[ox2-kx2,kid.y-outer.y],[ox2-kx2,oy2-ky2],[kid.x-outer.x,oy2-ky2]];
  if(gap.some(([a,b])=>a<-0.5||b<-0.5))return null;
  const out=gap.map(([a,b],i)=>{const g=Math.max(a,b);return R[i]>0?R[i]-g:0});
  if(!o.perCorner){const m=Math.max(...out);return[m,m,m,m]}return out}
 function walkC(outer,depth){for(const k of outer.children||[]){if(k.rot&&Math.abs(k.rot)%90>.5)continue;
   const R=ROUNDABLE.has(k.type)?inner(outer,k):null;if(R)setR(k,R);
   if(o.deep&&CONT.has(k.type)&&k.children?.length){if(k.type==='group'){walkC({...outer,children:k.children},depth+1)}else walkC(k,depth+1)}}}
 if(o.mode==='match'){const v=+o.match||0;const each=n=>{if(ROUNDABLE.has(n.type))setR(n,[v,v,v,v]);if(o.deep&&n.children)n.children.forEach(each)};sel.forEach(each);return ups}
 if(sel.length===1){const n=sel[0];if(!n.children?.length)return ups;walkC(n,0);return ups}
 const box=n=>n.w*n.h,outer=[...sel].sort((a,b)=>box(b)-box(a))[0];walkC({...outer,children:sel.filter(n=>n!==outer)},0);if(o.deep)sel.filter(n=>n!==outer&&n.children?.length).forEach(n=>walkC(n,1));return ups}
async function run(o){const sel=await cocoa.selection();if(!sel.length)return cocoa.toast(T('Select a frame, card or a few layers first.','Сначала выделите фрейм, карточку или несколько слоёв.'));
 const ups=plan(sel,o),list=[...ups].map(([id,props])=>({id,props}));
 if(!list.length)return cocoa.toast(o.mode==='match'?T('Nothing here can have rounded corners.','Здесь нечего скруглять.'):T('Give the outer layer a corner radius first, then sync.','Сначала задайте скругление внешнему слою, затем синхронизируйте.'));
 await cocoa.updateMany(list);cocoa.storage.set('opts',o);cocoa.toast(T(`Synced ${list.length} corner${list.length>1?'s':''}`,`Скругления обновлены: ${list.length}`))}
async function open(){await cocoa.ui.form({title:T('Radius sync','Синхронизация скруглений'),ok:T('Sync','Синхронизировать'),
 fields:[{type:'chips',key:'mode',value:last.mode,options:[['nested',T('Nested','Вложенные')],['match',T('Same radius','Один радиус')]]},
  {type:'info',key:'how',value:''},
  {type:'number',key:'match',label:T('Radius','Радиус'),value:last.match},
  {type:'toggle',key:'deep',label:T('Include everything inside','Включая всё внутри'),value:last.deep},
  {type:'toggle',key:'perCorner',label:T('Each corner separately','Каждый угол отдельно'),value:last.perCorner},
  {type:'number',key:'min',label:T('Smallest radius','Наименьший радиус'),value:last.min},
  {type:'toggle',key:'round',label:T('Whole pixels','Целые пиксели'),value:last.round}],
 onInput:o=>{last={...last,...o};return{how:o.mode==='nested'?T('Select a container (or a few layers). Inner corners become outer radius − gap, so curves stay parallel.','Выделите контейнер (или несколько слоёв). Внутренние углы станут внешним радиусом минус отступ, и кривые будут параллельны.'):T('Every selected layer gets the same radius.','Все выделенные слои получат одинаковый радиус.'),$hide:o.mode==='nested'?['match']:['perCorner','min']}},
 onSubmit:o=>run({...last,...o})})}
cocoa.addMenuItem(T('Radius sync…','Синхронизация скруглений…'),open);
cocoa.addMenuItem(T('Sync nested corners','Синхронизировать вложенные углы'),()=>run({...last,mode:'nested'}));
cocoa.helper.addCommand(/^(?:sync|match)\s+(?:radius|radii|corners?)$|^(?:синхронизир\w*|выровня\w*)\s+(?:скруглени\w*|углы|радиус\w*)$/i,()=>run({...last,mode:'nested'}),T('sync nested corner radii','синхронизировать вложенные скругления'));
