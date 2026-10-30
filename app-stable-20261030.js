const modal=document.querySelector('#modal'),content=document.querySelector('#modal-content'),shell=document.querySelector('#modal-shell'),close=document.querySelector('#close');
const categories=new Set(['outdoor','images','email','bonus','web','print']);
let active=null,trigger=null,request=0;
function fit(){
  const width=document.documentElement.clientWidth;
  document.documentElement.style.setProperty('--canvas-scale',String(Math.min(1,width/1440)));
  const scale=shell.clientWidth/1440;
  content.style.setProperty('--modal-scale',String(scale));
  shell.style.height=(content.offsetHeight*scale)+'px';
}
function dismiss(){if(modal.open)modal.close();document.body.style.overflow='';active=null;fit();trigger?.focus({preventScroll:true});}
async function sync(){const category=location.hash.slice(1);if(!categories.has(category)){dismiss();return;}if(active===category)return;active=category;const ticket=++request;trigger=document.activeElement;content.innerHTML='<p class="loading" role="status">Загрузка работ…</p>';if(!modal.open)modal.showModal();document.body.style.overflow='hidden';fit();close.focus();try{const response=await fetch(category+'.html?v=arrows-7');if(!response.ok)throw Error(response.status);const markup=await response.text();if(ticket!==request)return;content.innerHTML=markup;fit();modal.scrollTop=0;for(const el of content.querySelectorAll('[data-name="Group 337487"]'))el.style.display='none';}catch(e){content.innerHTML='<p class="loading">Не удалось загрузить работы. Попробуйте открыть раздел ещё раз.</p>';}}
function goBack(){if(categories.has(location.hash.slice(1)))history.replaceState(null,'',location.pathname+location.search);request++;dismiss();}
document.addEventListener('click',e=>{const link=e.target.closest('[data-category]');if(link){e.preventDefault();const name=link.dataset.category;if(location.hash==='#'+name)sync();else location.hash=name;}});
close.addEventListener('click',goBack);modal.addEventListener('cancel',e=>{e.preventDefault();goBack();});modal.addEventListener('click',e=>{if(e.target===modal)goBack();});window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);window.addEventListener('resize',fit);window.addEventListener('orientationchange',fit);window.addEventListener('pageshow',fit);if(window.visualViewport)window.visualViewport.addEventListener('resize',fit);document.fonts?.ready.then(fit);fit();sync();
