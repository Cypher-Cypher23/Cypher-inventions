const drinkArt = `<div class="drink-art"><svg viewBox="0 0 180 180" aria-hidden="true"><ellipse cx="89" cy="157" rx="45" ry="7" fill="#d7cbb1"/><path d="m52 49 11 104c15 9 39 9 54 0l11-104" fill="#e8a52f" stroke="#c37c1c" stroke-width="2"/><ellipse cx="90" cy="49" rx="38" ry="9" fill="#f6c64f" stroke="#c37c1c" stroke-width="2"/><path d="m102 119 14-100 22-9" fill="none" stroke="#b92d24" stroke-width="5"/><path d="m68 67 6 51m-2 9 2 11" stroke="#ffd981" stroke-width="5" stroke-linecap="round"/><circle cx="55" cy="43" r="24" fill="#e9ae34" stroke="#cc861c" stroke-width="2"/><circle cx="55" cy="43" r="18" fill="#f9d575"/><path d="m55 26 0 34m-15-24 30 15m-30 0 30-15" stroke="#f7f2e7" stroke-width="2"/><path d="M134 53q27-28 26-5-14 10-26 5" fill="#6a7742"/></svg></div>`;
const menu = [
  {id:'biryani',name:'Shishi Chicken Biryani',desc:'Slow-cooked chicken, fragrant rice, crispy onions & kachumbari.',price:15000,category:'rice',favourite:true,image:'biryani',label:'THE CROWD FAVOURITE',allergens:'Contains dairy. Includes chicken, rice, onions and spices.'},
  {id:'pilau',name:'Pilau ya Nyama',desc:'Spiced beef pilau. Deep, warm flavour in every single grain.',price:12000,category:'rice',favourite:true,image:'pilau',label:'A TASTE OF HOME',allergens:'Includes beef, rice, onions, garlic and whole spices.'},
  {id:'mishkaki',name:'Mishkaki Magic',desc:'Charcoal-kissed beef skewers, fresh kachumbari & a lime squeeze.',price:10000,category:'street',favourite:true,image:'mishkaki',label:'FRESH OFF THE GRILL',labelRed:true,allergens:'Includes beef, lime, tomato and onions. Marinade may contain soy.'},
  {id:'chipsi',name:'Chipsi Mayai',desc:'Golden chips meet fluffy eggs. A true street-food love story.',price:7000,category:'street',favourite:true,image:'chipsi',allergens:'Contains eggs. Includes potatoes, tomatoes and onions.'},
  {id:'ugali',name:'Ugali & Nyama',desc:'Soft ugali, rich beef stew & sukuma wiki. Comfort, the Tanzanian way.',price:12000,category:'plates',image:'ugali',label:'PROPER COMFORT FOOD',allergens:'Includes maize, beef, greens, tomatoes and onions.'},
  {id:'juice',name:'Fresh Passion Juice',desc:'Tangy passion fruit, freshly blended. A little sunshine in a glass.',price:4000,category:'drinks',image:'juice',label:'SIP THE SUNSHINE',allergens:'Includes passion fruit, water and sugar.'}
];
const grid = document.querySelector('#menu-grid');
let bag = {};
try { const saved = JSON.parse(localStorage.getItem('shishi-bag') || '{}'); for (const item of menu) if (Number.isInteger(saved[item.id]) && saved[item.id] > 0) bag[item.id] = Math.min(saved[item.id],99); } catch {}
let currentFilter = 'favourites';
let previousFocus;
let bagView = 'bag';
let toastTimer;
const money = value => value.toLocaleString('en-TZ');
const escapeText = text => String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const count = () => Object.values(bag).reduce((a,b)=>a+b,0);
const total = () => menu.reduce((sum,item)=>sum+item.price*(bag[item.id]||0),0);
function imageMarkup(item,thumb=false) {
  if (item.image==='biryani') return `<img src="assets/biryani.png" alt="Chicken biryani with saffron rice and kachumbari" loading="lazy" width="320" height="320">`;
  if (item.image==='juice') return drinkArt;
  return '';
}
function renderMenu(){
  const visible=menu.filter(item=>currentFilter==='all'||(currentFilter==='favourites'?item.favourite:item.category===currentFilter));
  grid.innerHTML=visible.map((item,i)=>`<article class="menu-card" style="animation-delay:${i*45}ms"><div class="card-image ${item.image!=='biryani'&&item.image!=='juice'?`food-sprite food-${item.image}`:''}" ${item.image!=='biryani'&&item.image!=='juice'?`role="img" aria-label="${item.name}"`:''}>${imageMarkup(item)}${item.label?`<span class="card-label ${item.labelRed?'red':''}">${item.label}</span>`:''}</div><div class="card-title-row"><h3>${item.name}</h3></div><p class="card-description">${item.desc}</p><div class="card-bottom"><span class="price"><small>TSh</small> ${money(item.price)}</span><button class="add-button" data-add="${item.id}" aria-label="Add ${item.name} to bag">+</button></div></article>`).join('');
}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  currentFilter=button.dataset.filter;
  document.querySelectorAll('.filter').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});
  renderMenu();
}));
function persist(){try{localStorage.setItem('shishi-bag',JSON.stringify(bag));}catch{}document.querySelectorAll('.bag-count').forEach(el=>el.textContent=count());}
function toast(message){const el=document.querySelector('.toast');el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2600);}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');
  if(add){const item=menu.find(i=>i.id===add.dataset.add);if(!item)return;if((bag[item.id]||0)>=99){toast('That’s a feast! Maximum 99 portions per dish.');return;}bag[item.id]=(bag[item.id]||0)+1;persist();toast(`${item.name} added. Good choice!`);}
  const qty=event.target.closest('[data-qty]');
  if(qty){const id=qty.dataset.id;if(!bag[id])return;bag[id]=Math.min(99,bag[id]+Number(qty.dataset.qty));if(bag[id]<=0)delete bag[id];persist();renderBag();const next=document.querySelector(`[data-id="${id}"][data-qty="${qty.dataset.qty}"]`);(next||document.querySelector('.close-bag')).focus();}
  const remove=event.target.closest('[data-remove]');if(remove){delete bag[remove.dataset.remove];persist();renderBag();document.querySelector('.close-bag').focus();}
});
const drawer=document.querySelector('.bag-drawer');
const overlay=document.querySelector('.drawer-overlay');
const content=document.querySelector('.bag-content');
const summary=document.querySelector('.bag-summary');
function openBag(){previousFocus=document.activeElement;bagView='bag';renderBag();drawer.hidden=false;overlay.hidden=false;document.body.style.overflow='hidden';document.querySelector('.close-bag').focus();}
function closeBag(){drawer.hidden=true;overlay.hidden=true;document.body.style.overflow='';previousFocus?.focus();}
document.querySelectorAll('[data-open-bag]').forEach(b=>b.addEventListener('click',openBag));
document.querySelector('.close-bag').addEventListener('click',closeBag);overlay.addEventListener('click',closeBag);
document.addEventListener('keydown',e=>{
  if(drawer.hidden)return;
  if(e.key==='Escape')closeBag();
  if(e.key==='Tab'){const focusable=[...drawer.querySelectorAll('button,a,input,textarea,select')].filter(el=>el.getClientRects().length);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
});
function renderBag(){
  bagView='bag';summary.hidden=!count();
  if(!count()){content.innerHTML='<div class="bag-empty"><div class="empty-icon" aria-hidden="true">✳</div><h3>A LITTLE EMPTY IN HERE.</h3><p>Your next favourite is waiting.<br>Let’s find you something delicious.</p><button class="button primary browse-menu">Explore the menu <span aria-hidden="true">↗</span></button></div>';content.querySelector('.browse-menu').addEventListener('click',()=>{closeBag();document.querySelector('#menu').scrollIntoView({behavior:'smooth'});});return;}
  content.innerHTML=menu.filter(item=>bag[item.id]).map(item=>`<div class="bag-item"><div class="bag-thumb ${!['biryani','juice'].includes(item.image)?`food-sprite food-${item.image}`:''}" aria-hidden="true">${imageMarkup(item,true)}</div><div class="bag-item-info"><h3>${item.name}</h3><p>TSh ${money(item.price)} each</p><div class="quantity"><button data-qty="-1" data-id="${item.id}" aria-label="One fewer ${item.name}">−</button><span aria-label="Quantity">${bag[item.id]}</span><button data-qty="1" data-id="${item.id}" aria-label="One more ${item.name}" ${bag[item.id]>=99?'disabled':''}>+</button><button class="remove-item" data-remove="${item.id}" aria-label="Remove ${item.name}">Remove</button></div></div></div>`).join('');
  summary.innerHTML=`<div class="total-row"><span>Subtotal</span><span>TSh ${money(total())}</span></div><button class="button primary review-order">Review your meal <span aria-hidden="true">↗</span></button><p class="demo-note">This is a demo menu. No payment is taken and no order is sent to a restaurant. Prices are illustrative.</p>`;
  summary.querySelector('.review-order').addEventListener('click',reviewOrder);
}
function reviewOrder(){
  bagView='review';summary.hidden=true;
  content.innerHTML=`<button class="back-to-bag">← Back to your bag</button><div class="order-review">${menu.filter(item=>bag[item.id]).map(item=>`<p>${bag[item.id]} × ${item.name} <strong>· TSh ${money(item.price*bag[item.id])}</strong></p>`).join('')}<p style="margin-top:14px"><strong>Total · TSh ${money(total())}</strong></p></div><form class="order-form"><label for="guest-name">Your name</label><input id="guest-name" name="name" placeholder="What should we call you?" autocomplete="given-name" maxlength="60" required><label for="meal-notes">Anything we should know? <span style="font-weight:400">(optional)</span></label><textarea id="meal-notes" name="notes" placeholder="Extra pili pili? No onions?" maxlength="400"></textarea><details class="order-review"><summary>Ingredients & allergy notes</summary>${menu.filter(item=>bag[item.id]).map(item=>`<p><strong>${item.name}:</strong> ${item.allergens}</p>`).join('')}<p>Illustrative ingredients only. A real kitchen must confirm allergens and cross-contact before ordering.</p></details><p class="demo-note">Try the experience: this creates a sample meal summary only. It does not place a real order.</p><button type="submit" class="button primary">Create demo meal <span aria-hidden="true">↗</span></button></form>`;
  content.scrollTop=0;content.querySelector('.back-to-bag').addEventListener('click',()=>{renderBag();summary.querySelector('button').focus();});content.querySelector('input').focus();
  content.querySelector('form').addEventListener('submit',e=>{e.preventDefault();const form=new FormData(e.target);const name=String(form.get('name')).trim();if(!name){const field=content.querySelector('input');field.setCustomValidity('Please enter your name.');field.reportValidity();field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});return;}const orderText=`SHISHI FOODZ — DEMO MEAL\nFor: ${name}\n\n${menu.filter(i=>bag[i.id]).map(i=>`${bag[i.id]} × ${i.name} — TSh ${money(i.price*bag[i.id])}`).join('\n')}\n\nTotal: TSh ${money(total())}\nNotes: ${form.get('notes')||'None'}\n\nThis is a sample. No real order has been placed.`;showSuccess(name,orderText);});
}
function showSuccess(name,text){
  bagView='success';content.innerHTML=`<div class="order-success"><span aria-hidden="true">✳</span><h3>NOW THAT’S<br>A GOOD MEAL, ${escapeText(name)}.</h3><p>Your demo meal is ready to save. No real order has been placed and no payment has been taken.</p><button class="button primary save-meal">Save meal summary <span aria-hidden="true">↓</span></button><p><button class="back-to-bag">Keep exploring the menu</button></p></div>`;
  content.scrollTop=0;content.querySelector('.save-meal').focus();content.querySelector('.save-meal').addEventListener('click',()=>{const blob=new Blob([text],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='shishi-demo-meal.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});content.querySelector('.back-to-bag').addEventListener('click',closeBag);
}
const toggle=document.querySelector('.mobile-toggle'),mobileNav=document.querySelector('.mobile-nav');
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',open);toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');mobileNav.hidden=!open;});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');mobileNav.hidden=true;}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');toggle.focus();}});
const navObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('.desktop-nav a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===`#${entry.target.id}`));}),{rootMargin:'-15% 0px -50% 0px'});
['menu','story','table'].forEach(id=>navObserver.observe(document.getElementById(id)));
persist();renderMenu();document.querySelector('#year').textContent=new Date().getFullYear();
