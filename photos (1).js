/* Прихована вкладка «Фото»: лише перегляд. Відкривається п'ятьма швидкими натисканнями на назву «Облік сублімації». */
(function(){
var UK='inv-photo-url',CK='inv-photo-cache',DEF='https://script.google.com/macros/s/AKfycbwwk0u8yVjx79HIghVLT-xx7uyCTa6o1I23EvP1X-7jMZNw8nourVqejOH0le_CRY4n/exec';
function url(){return ls(UK)||DEF}
var ov=null,busy=false,err='',taps=0,tt=0,D=null;
function ls(k){try{return localStorage.getItem(k)||''}catch(e){return ''}}
function ss(k,v){try{localStorage.setItem(k,v)}catch(e){}}
try{D=JSON.parse(ls(CK)||'null')}catch(e){D=null}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function p2(n){return('0'+n).slice(-2)}
function iso(d){return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
function sm(a){var t=0;for(var i=0;i<a.length;i++)t+=+a[i]||0;return t}
function fm(n){return Math.round(n).toLocaleString('uk-UA')}
function dd(d,n){return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n)}
function mon(d){return dd(d,-((d.getDay()+6)%7))}
function ds(d){var a=D.days[iso(d)];return a?sm(a):0}
function ws(m){var t=0;for(var i=0;i<7;i++)t+=ds(dd(m,i));return t}
function dm(d){return d.getDate()+'.'+p2(d.getMonth()+1)}

var st=document.createElement('style');
st.textContent='.pov{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;z-index:8}'+
'.psh{background:var(--card);color:var(--tx);width:100%;max-width:560px;max-height:88%;overflow:auto;border-radius:20px 20px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px))}'+
'.psh h3{margin:0 0 8px}.pg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}'+
'.pg div{background:var(--bg);border:1px solid var(--ln);border-radius:14px;padding:10px}.pg b{display:block;font-size:24px}'+
'.pl{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--ln);font-size:15px}'+
'.prow{display:flex;gap:8px;margin-top:12px}.prow .btn{flex:1}';
document.head.appendChild(st);

function draw(){
if(!ov)return;
var h='<div class="psh"><h3>Друк фото</h3>';
if(!D||!D.days){
h+='<div class="mut">'+(busy?'Завантаження…':esc(err||'Немає даних'))+'</div>'+
'<div class="prow"><button class="btn" data-p="r">Оновити</button><button class="btn s" data-p="x">Закрити</button></div>';
}else{
var n=new Date(),m=mon(n),mk=iso(n).slice(0,7),mt=0,all=0,ks=Object.keys(D.days),i,rows='';
for(i=0;i<ks.length;i++){var s=sm(D.days[ks[i]]);all+=s;if(ks[i].slice(0,7)==mk)mt+=s}
for(i=0;i<4;i++){var w=dd(m,-7*i);rows+='<div class="pl"><span>'+dm(w)+' – '+dm(dd(w,5))+(i?'':' (цей)')+'</span><b>'+fm(ws(w))+'</b></div>'}
var at=D._at?new Date(D._at):null;
h+='<div class="pg"><div><span class="mut">Сьогодні</span><b>'+fm(ds(n))+'</b></div>'+
'<div><span class="mut">Цей тиждень</span><b>'+fm(ws(m))+'</b></div>'+
'<div><span class="mut">Цей місяць</span><b>'+fm(mt)+'</b></div>'+
'<div><span class="mut">Усього</span><b>'+fm(all)+'</b></div></div>'+
'<div class="mut" style="margin-bottom:4px">Тижні (пн–сб)</div>'+rows+
'<div class="mut" style="margin-top:10px">'+(busy?'Оновлюю…':(err?esc(err):(at?'Дані на '+p2(at.getHours())+':'+p2(at.getMinutes()):'')))+'</div>'+
'<div class="prow"><button class="btn" data-p="r">Оновити</button><button class="btn s" data-p="x">Закрити</button></div>'+
'<div class="prow"><button class="btn s" data-p="chg">Змінити адресу</button></div>';
}
ov.innerHTML=h+'</div>';
}

function load(){
var u=url();if(!u||busy)return;
busy=true;err='';draw();
fetch(u+(u.indexOf('?')>-1?'&':'?')+'action=data',{cache:'no-store'})
.then(function(r){return r.json()})
.then(function(d){
if(d&&d.days){d._at=Date.now();D=d;ss(CK,JSON.stringify(d))}else err='Незрозуміла відповідь скрипта';
busy=false;draw();
}).catch(function(){busy=false;err=D?'Немає зв’язку, показано останні збережені дані':'Немає зв’язку';draw()});
}

function show(){
if(ov)return;
ov=document.createElement('div');ov.className='pov';document.body.appendChild(ov);
draw();load();
}
function hide(){if(ov){ov.parentNode.removeChild(ov);ov=null}}

document.addEventListener('click',function(e){
var t=e.target;if(!t||!t.closest)return;
if(ov&&t===ov){hide();return}
if(!ov&&t.closest('.top b')){
var now=Date.now();taps=(now-tt<1500)?taps+1:1;tt=now;
if(taps>=5){taps=0;show()}
return;
}
var b=t.closest('[data-p]');if(!b||!ov)return;
var a=b.getAttribute('data-p');
if(a=='x')hide();
else if(a=='r')load();
else if(a=='chg'){var v=prompt('Адреса скрипта (закінчується на /exec)',url());v=(v||'').trim();if(/^https:\/\//.test(v)){ss(UK,v);ss(CK,'');D=null;load()}}
});
})();
