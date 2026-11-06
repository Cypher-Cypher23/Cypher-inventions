'use strict';
const dishes=SHISHI_MENU.items;
const $=selector=>document.querySelector(selector);
const $$=selector=>[...document.querySelectorAll(selector)];
const money=value=>value.toLocaleString('en-TZ');
const escapeText=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=false;
try{motionPaused=localStorage.getItem('shishi-motion')==='paused';}catch{}
const motionEnabled=()=>!motionPaused&&!reducedMotion.matches;
const ease='cubic-bezier(.22,1,.36,1)';
let toastTimer;
function toast(message){$('.toast').textContent=message;$('.toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('.toast').classList.remove('visible'),3000);}
function downloadText(name,text){const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

// Three photographic planes share a camera axis: approach, enter, settle at the plate.
const cinema=$('.cinema'),exterior=$('.scene-exterior'),room=$('.scene-room'),table=$('.scene-table');
const tour={elapsed:0,duration:14500,last:0,raf:0,paused:false,complete:false,ready:false};
const clamp=value=>Math.min(1,Math.max(0,value));
const smooth=value=>{const x=clamp(value);return x*x*(3-2*x);};
function paintTour(time){
 const entrance=smooth(time/6100),inside=smooth((time-4300)/6500),settle=smooth((time-8500)/6000);
 exterior.style.transform=`scale(${1+entrance*1.85})`;exterior.style.opacity=String(1-smooth((time-4600)/1800));
 room.style.transform=`scale(${1+inside*1.05})`;room.style.opacity=String(smooth((time-4300)/2000)*(1-smooth((time-9200)/1900)));
 table.style.transform=`scale(${1.2-settle*.2})`;table.style.opacity=String(smooth((time-8700)/2300));
 $('.intro-copy').style.opacity=String(1-smooth((time-6000)/2200));
 cinema.style.setProperty('--tour-progress',String(clamp(time/tour.duration)));
 const chapter=time<5100?0:time<10000?1:2;
 $$('[data-chapter]').forEach(el=>el.classList.toggle('current',Number(el.dataset.chapter)===chapter));
}
function finishTour(){
 cancelAnimationFrame(tour.raf);tour.complete=true;tour.paused=false;tour.elapsed=tour.duration;paintTour(tour.duration);
 cinema.classList.add('arrived');$('.intro-copy').hidden=true;$('.arrival-copy').hidden=false;
 $('.tour-skip').hidden=true;$('.tour-pause').hidden=true;$('.tour-replay').hidden=false;$('.tour-loading').hidden=true;
}
function tickTour(now){
 if(tour.paused||tour.complete||document.hidden)return;
 if(tour.last)tour.elapsed+=Math.min(now-tour.last,100);
 tour.last=now;paintTour(tour.elapsed);
 if(tour.elapsed>=tour.duration){finishTour();return;}
 tour.raf=requestAnimationFrame(tickTour);
}
function startTour(){
 cancelAnimationFrame(tour.raf);tour.elapsed=0;tour.last=0;tour.complete=false;tour.paused=false;
 cinema.classList.remove('arrived');$('.arrival-copy').hidden=true;$('.intro-copy').hidden=false;
 $('.tour-skip').hidden=false;$('.tour-replay').hidden=true;$('.tour-pause').hidden=false;$('.tour-loading').hidden=true;
 $('.tour-pause').textContent='Pause';$('.tour-pause').setAttribute('aria-pressed','false');paintTour(0);
 if(!motionEnabled()){finishTour();return;}tour.raf=requestAnimationFrame(tickTour);
}
function setTourPause(paused){
 if(tour.complete)return;tour.paused=paused;cancelAnimationFrame(tour.raf);tour.last=0;
 $('.tour-pause').textContent=paused?'Continue':'Pause';$('.tour-pause').setAttribute('aria-pressed',String(paused));
 if(!paused)tour.raf=requestAnimationFrame(tickTour);
}
$('.tour-skip').addEventListener('click',finishTour);
$('.tour-pause').addEventListener('click',()=>setTourPause(!tour.paused));
$('.tour-replay').addEventListener('click',()=>{if(!motionEnabled()){toast('Enable motion in the footer to replay the entrance.');return;}startTour();});
document.addEventListener('visibilitychange',()=>{if(tour.complete||tour.paused||!tour.ready)return;if(document.hidden){cancelAnimationFrame(tour.raf);tour.last=0;}else{tour.last=0;tour.raf=requestAnimationFrame(tickTour);}});
const decode=img=>img.decode?img.decode().catch(()=>{}):Promise.resolve();
Promise.all([exterior,room,table].map(decode)).then(()=>{tour.ready=true;$('.tour-loading').hidden=true;if(!tour.complete)startTour();});
if(!motionEnabled())finishTour();

// The menu is one shared image panel, with an interruptible two-plane transition.
let selectedDish=dishes[0].id,currentFilter='food',currentGroup='all',menuQuery='',selectionVersion=0,photoIndex=0;
let photoAnimations=[];
const photos=[$('.shot-a'),$('.shot-b')];
const photoCache=new Map();
function loadPhoto(source){
 if(photoCache.has(source)){const cached=photoCache.get(source);photoCache.delete(source);photoCache.set(source,cached);return cached;}
 const img=new Image();img.decoding='async';img.src=source;
 const request=img.decode().then(()=>img).catch(()=>{if(photoCache.get(source)===request)photoCache.delete(source);return null;});
 photoCache.set(source,request);while(photoCache.size>8)photoCache.delete(photoCache.keys().next().value);return request;
}
function visibleDishes(){const query=menuQuery.trim().toLowerCase();return dishes.filter(dish=>(currentFilter==='all'||dish.category===currentFilter)&&(currentGroup==='all'||dish.group===currentGroup)&&(!query||dish.name.toLowerCase().includes(query)));}
const defaultChoice=dish=>({servings:1,heat:dish.category==='food'?'Shishi heat':dish.allowIce?'Chilled':'As listed',extra:false});
const dishChoices=Object.fromEntries(dishes.map(dish=>[dish.id,defaultChoice(dish)]));
function dishUnitPrice(dish,choice){return dish.price*choice.servings;}
function portionLabel(dish,servings){const unit=dish.unit||'plate';return `${servings===1?'One':'Two'} ${unit}${servings===2?'s':''}`;}
function choiceDescription(dish,choice){return [portionLabel(dish,choice.servings),...(choice.heat==='As listed'?[]:[choice.heat])].join(' · ');}
function renderDishOptions(dish){
 const choice=dishChoices[dish.id],drink=dish.category==='drinks';
 const temperatures=dish.allowIce?['Chilled','No ice']:drink?[]:['Mild','Shishi heat','Pili pili'];
 return `<div class="dish-options"><div class="dish-option-row"><span>${drink?'Your quantity':'Your appetite'}</span><div class="choice-group" role="group" aria-label="Quantity for ${escapeText(dish.name)}">${[1,2].map(servings=>`<button class="choice-button" data-choice="servings" data-choice-dish="${dish.id}" data-choice-value="${servings}" aria-pressed="${choice.servings===servings}">${portionLabel(dish,servings)}</button>`).join('')}</div></div>${temperatures.length?`<div class="dish-option-row"><span>${drink?'Your pour':'A little heat?'}</span><div class="choice-group" role="group" aria-label="${drink?'Ice':'Spice preference'} for ${escapeText(dish.name)}">${temperatures.map(heat=>`<button class="choice-button" data-choice="heat" data-choice-dish="${dish.id}" data-choice-value="${heat}" aria-pressed="${choice.heat===heat}">${heat}</button>`).join('')}</div></div>`:''}</div>`;
}
function updateDishChoice(id){
 const item=$(`[data-dish-item="${id}"]`),dish=dishes.find(entry=>entry.id===id);if(!item||!dish)return;
 const choice=dishChoices[id];item.querySelectorAll('[data-choice]').forEach(button=>button.setAttribute('aria-pressed',String(String(choice[button.dataset.choice])===button.dataset.choiceValue)));
 item.querySelector('.dish-price-value').textContent=money(dishUnitPrice(dish,choice));
 item.querySelector('.dish-serves').textContent=choiceDescription(dish,choice);
}
function renderMenu(){
 const available=visibleDishes();$('#menu-results').textContent=`${available.length} ${available.length===1?'item':'items'}`;
 $('#menu-list').innerHTML=available.length?available.map(dish=>{const selected=dish.id===selectedDish;const number=String(dishes.indexOf(dish)+1).padStart(2,'0');const choice=dishChoices[dish.id];return `<article class="dish-item ${selected?'selected':''}" data-dish-item="${dish.id}"><button class="dish-select" id="select-${dish.id}" data-select-dish="${dish.id}" aria-expanded="${selected}" aria-controls="details-${dish.id}"><span class="dish-index">${number}</span><span class="dish-item-name">${escapeText(dish.name)}</span><span class="dish-list-price"><small>TSh</small> ${money(dish.price)}</span></button><div class="dish-details" id="details-${dish.id}" aria-hidden="${!selected}" ${selected?'':'inert'}><div class="dish-details-inner"><div class="dish-details-content"><p class="dish-description">${escapeText(dish.description)}</p>${renderDishOptions(dish)}<p class="dish-serves">${choiceDescription(dish,choice)}</p><div class="dish-order"><span class="dish-price"><small>TSh</small> <span class="dish-price-value">${money(dishUnitPrice(dish,choice))}</span></span><button class="add-dish" data-add="${dish.id}" aria-label="Add ${escapeText(dish.name)} to bag">Add to your bag</button></div><p class="dish-allergens">${dish.allergens}</p></div></div></div></article>`;}).join(''):'<div class="menu-empty"><p>No matches at this table.</p><button class="text-link dark-link" data-clear-menu>Clear your search</button></div>';
}
function populateMenuGroups(){
 $('#menu-category').innerHTML='<option value="all">All categories</option>'+SHISHI_MENU.groups.filter(group=>currentFilter==='all'||group.type===currentFilter).map(group=>`<option value="${group.id}">${escapeText(group.label)}</option>`).join('');
 $('#menu-category').value=currentGroup;
}
function refreshMenu(){const available=visibleDishes();if(available.length&&!available.some(dish=>dish.id===selectedDish))selectedDish=available[0].id;renderMenu();if(available.length)selectDish(selectedDish);else $('#dish-announcement').textContent='No matching menu items.';}
function markSelection(){
 $$('[data-dish-item]').forEach(item=>{const active=item.dataset.dishItem===selectedDish;item.classList.toggle('selected',active);item.querySelector('.dish-select').setAttribute('aria-expanded',String(active));const details=item.querySelector('.dish-details');details.setAttribute('aria-hidden',String(!active));details.inert=!active;});
}
async function selectDish(id){
 const dish=dishes.find(item=>item.id===id);if(!dish)return;
 selectedDish=id;markSelection();const version=++selectionVersion;
 $('#dish-visual').setAttribute('aria-busy','true');$('.photo-loading').hidden=false;
 const loaded=await loadPhoto(dish.image);if(version!==selectionVersion)return;
 if(!loaded){$('.photo-loading').hidden=true;$('#dish-visual').removeAttribute('aria-busy');toast('The photograph could not load. Please try this dish again.');return;}
 photoAnimations.forEach(animation=>animation.cancel());photoAnimations=[];
 const outgoing=photos[photoIndex],incoming=photos[1-photoIndex];
 outgoing.style.opacity='1';outgoing.style.transform='none';incoming.src=dish.image;incoming.style.objectPosition=dish.position;incoming.style.zIndex='2';outgoing.style.zIndex='1';
 incoming.alt=dish.photoAlt;incoming.classList.toggle('is-packaged',['bottle','can'].includes(dish.unit));incoming.removeAttribute('aria-hidden');outgoing.alt='';outgoing.setAttribute('aria-hidden','true');
 $('#dish-visual').style.setProperty('--dish-backdrop',`url("${dish.image}")`);
 $('.photo-loading').hidden=true;$('#dish-visual').removeAttribute('aria-busy');
 $('#dish-category').textContent=dish.label;$('#dish-photo-name').textContent=dish.native;
 $('.dish-photo-number').innerHTML=`${String(dishes.indexOf(dish)+1).padStart(2,'0')} <i>/ ${String(dishes.length).padStart(2,'0')}</i>`;
 $('#dish-announcement').textContent=`Now showing ${dish.name}. TSh ${money(dish.price)}.`;
 incoming.style.opacity='1';incoming.style.transform='none';photoIndex=1-photoIndex;
 if(!motionEnabled()){outgoing.style.opacity='0';scheduleNextPhoto();return;}
 const arrival=incoming.animate([{opacity:0,transform:'scale(1.11) translateX(2%)',filter:'blur(3px)'},{opacity:1,transform:'scale(1)',filter:'blur(0px)'}],{duration:1150,easing:ease,fill:'none'});
 const departure=outgoing.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.035) translateX(-1%)'}],{duration:1100,easing:ease,fill:'none'});
 outgoing.style.opacity='0';photoAnimations=[arrival,departure];
 Promise.allSettled(photoAnimations.map(animation=>animation.finished)).then(()=>{if(version===selectionVersion){outgoing.style.opacity='0';photoAnimations=[];}});scheduleNextPhoto();
}
$('#menu-list').addEventListener('click',event=>{const button=event.target.closest('[data-select-dish]');if(button)selectDish(button.dataset.selectDish);});
$('#menu-list').addEventListener('click',event=>{const button=event.target.closest('[data-choice]');if(!button)return;const id=button.dataset.choiceDish,key=button.dataset.choice;dishChoices[id][key]=key==='servings'?Number(button.dataset.choiceValue):button.dataset.choiceValue;updateDishChoice(id);});
$('#menu-list').addEventListener('change',event=>{const extra=event.target.closest('[data-extra]');if(!extra)return;dishChoices[extra.dataset.extra].extra=extra.checked;updateDishChoice(extra.dataset.extra);});
$('#menu-list').addEventListener('keydown',event=>{const button=event.target.closest('[data-select-dish]');if(!button)return;const buttons=$$('[data-select-dish]');const index=buttons.indexOf(button);let next;if(event.key==='ArrowDown')next=(index+1)%buttons.length;else if(event.key==='ArrowUp')next=(index-1+buttons.length)%buttons.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=buttons.length-1;else return;event.preventDefault();buttons[next].focus({preventScroll:true});selectDish(buttons[next].dataset.selectDish);});
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{currentFilter=button.dataset.filter;currentGroup='all';menuQuery='';$('#menu-search').value='';$$('[data-filter]').forEach(el=>{el.classList.toggle('active',el===button);el.setAttribute('aria-pressed',String(el===button));});populateMenuGroups();refreshMenu();}));
$('#menu-category').addEventListener('change',event=>{currentGroup=event.target.value;refreshMenu();});
$('#menu-search').addEventListener('input',event=>{menuQuery=event.target.value;refreshMenu();});
$('#menu-list').addEventListener('click',event=>{if(event.target.closest('[data-clear-menu]')){menuQuery='';$('#menu-search').value='';refreshMenu();$('#menu-search').focus();}});
// Warm only the next choice; the full individual-photo library stays on demand.
let nextPhotoTask=0;
function scheduleNextPhoto(){
 const warm=()=>{const available=visibleDishes(),index=available.findIndex(dish=>dish.id===selectedDish),next=available[index+1];if(next)loadPhoto(next.image);};
 if('requestIdleCallback' in window){cancelIdleCallback(nextPhotoTask);nextPhotoTask=requestIdleCallback(warm,{timeout:1500});}
 else{clearTimeout(nextPhotoTask);nextPhotoTask=setTimeout(warm,250);}
}

// Store configured plates separately; migrate selections from the earlier pitch.
let bag={},fulfilment='At our table';
const lineKey=line=>[line.dishId,line.servings,line.heat,line.extra?'extra':'classic'].join('|');
try{
 const saved=JSON.parse(localStorage.getItem('shishi-bag')||'{}');
 for(const [key,value] of Object.entries(saved)){
  const legacy=Number.isInteger(value);const dish=dishes.find(item=>item.id===(legacy?key:value?.dishId));if(!dish)continue;
  const line=legacy?{dishId:dish.id,servings:1,heat:defaultChoice(dish).heat,extra:false,qty:Math.min(99,value)}:{...value};
  const allowed=dish.category==='food'?['Mild','Shishi heat','Pili pili']:dish.allowIce?['Chilled','No ice']:['As listed'];
  if(!Number.isInteger(line.qty)||line.qty<1||![1,2].includes(line.servings)||!allowed.includes(line.heat))continue;
  line.qty=Math.min(line.qty,99);line.extra=false;bag[lineKey(line)]=line;
 }
}catch{}
const bagCount=()=>Object.values(bag).reduce((sum,line)=>sum+line.qty,0);
const bagTotal=()=>Object.values(bag).reduce((sum,line)=>sum+dishUnitPrice(dishes.find(dish=>dish.id===line.dishId),line)*line.qty,0);
function persistBag(){try{localStorage.setItem('shishi-bag',JSON.stringify(bag));}catch{}$$('.bag-count').forEach(el=>el.textContent=String(bagCount()));}
let bagPreviousFocus;
function openBag(){bagPreviousFocus=document.activeElement;renderBag();$('.bag-drawer').hidden=false;$('.drawer-overlay').hidden=false;document.body.style.overflow='hidden';$$('main,header,footer').forEach(el=>el.inert=true);$('.close-bag').focus();}
function closeBag(){const drawer=$('.bag-drawer');if(drawer.hidden)return;drawer.hidden=true;$('.drawer-overlay').hidden=true;document.body.style.overflow='';$$('main,header,footer').forEach(el=>el.inert=false);bagPreviousFocus?.focus();}
function renderBag(){
 const content=$('.bag-content'),summary=$('.bag-summary');summary.hidden=!bagCount();
 if(!bagCount()){content.innerHTML='<div class="bag-empty"><h3>A little empty in here.</h3><p>Your next favourite is waiting.<br>Let’s find you something delicious.</p><button class="button wine-button" data-browse>Explore the menu</button></div>';content.querySelector('[data-browse]').addEventListener('click',()=>{closeBag();$('#menu').scrollIntoView({behavior:motionEnabled()?'smooth':'instant'});});return;}
 content.innerHTML=Object.entries(bag).map(([key,line])=>{const dish=dishes.find(item=>item.id===line.dishId);return `<div class="bag-item"><img src="${dish.image}" alt="" width="75" height="85"><div class="bag-item-info"><h3>${dish.name}</h3><p class="bag-options">${choiceDescription(dish,line)}</p><p>TSh ${money(dishUnitPrice(dish,line))} each</p><div class="quantity"><button data-quantity="-1" data-id="${key}" aria-label="One fewer ${dish.name}">−</button><span>${line.qty}</span><button data-quantity="1" data-id="${key}" aria-label="One more ${dish.name}" ${line.qty>=99?'disabled':''}>+</button><button class="remove-item" data-remove="${key}" aria-label="Remove ${dish.name}">Remove</button></div></div></div>`;}).join('')+`<div class="bag-fulfilment"><span class="eyebrow">WHERE WILL YOU ENJOY IT?</span><div class="fulfilment-options" role="group" aria-label="Choose how to enjoy your meal">${['At our table','Collect & go','At your door'].map(value=>`<button data-fulfilment="${value}" aria-pressed="${fulfilment===value}">${value}</button>`).join('')}</div></div>`;
 content.querySelectorAll('[data-fulfilment]').forEach(button=>button.addEventListener('click',()=>{fulfilment=button.dataset.fulfilment;content.querySelectorAll('[data-fulfilment]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));}));
 summary.innerHTML=`<div class="total-row"><span>Your meal</span><span>TSh ${money(bagTotal())}</span></div><button class="button wine-button" data-review-meal>Review your order</button><p class="demo-note">A little more pili pili. A little more time together.</p>`;
 summary.querySelector('[data-review-meal]').addEventListener('click',renderOrderReview);
}
function renderOrderReview(){
 const content=$('.bag-content'),summary=$('.bag-summary');
 content.innerHTML=`<div class="order-review"><button class="back-to-bag" data-back-to-bag>Back to your bag</button><h3>Good choices.<br><em>Great company.</em></h3><p>A final look at the flavours coming together.</p><div class="order-preview-list">${Object.values(bag).map(line=>{const dish=dishes.find(item=>item.id===line.dishId);return `<div class="order-preview-line"><div><strong>${line.qty} × ${dish.name}</strong><small>${choiceDescription(dish,line)}</small></div><span>TSh ${money(dishUnitPrice(dish,line)*line.qty)}</span></div>`;}).join('')}</div><p class="order-preview-meta">${fulfilment}${fulfilment==='At your door'?'<br>Delivery arranged with the restaurant. Any delivery fee is separate.':''}</p></div>`;
 summary.innerHTML=`<div class="total-row"><span>${fulfilment==='At your door'?'Food subtotal':'Your total'}</span><span>TSh ${money(bagTotal())}</span></div><button class="button wine-button" data-save-meal>Keep your meal summary</button><p class="demo-note">Interactive pitch preview · no order or payment is sent.</p>`;
 content.scrollTop=0;content.querySelector('[data-back-to-bag]').addEventListener('click',()=>{renderBag();$('.bag-summary [data-review-meal]').focus();});
 summary.querySelector('[data-save-meal]').addEventListener('click',()=>{downloadText('shishi-meal-preview.txt',`SHISHI FOODZ — YOUR MEAL\n\n${Object.values(bag).map(line=>{const dish=dishes.find(item=>item.id===line.dishId);return `${line.qty} × ${dish.name}\n${choiceDescription(dish,line)}\nTSh ${money(dishUnitPrice(dish,line)*line.qty)}`;}).join('\n\n')}\n\nFood total: TSh ${money(bagTotal())}\nEnjoy it: ${fulfilment}\n\nInteractive pitch. No order or payment has been sent.`);toast('Your meal summary is ready.');});
 content.querySelector('[data-back-to-bag]').focus();
}
document.addEventListener('click',event=>{
 const add=event.target.closest('[data-add]');if(add){const id=add.dataset.add;const line={dishId:id,...dishChoices[id],qty:1},key=lineKey(line);if((bag[key]?.qty||0)>=99){toast('Maximum 99 portions per selection.');return;}if(bag[key])bag[key].qty++;else bag[key]=line;persistBag();toast(`${dishes.find(dish=>dish.id===id).name}, just how you like it. Added to your bag.`);}
 const qty=event.target.closest('[data-quantity]');if(qty){const id=qty.dataset.id;if(!bag[id])return;bag[id].qty=Math.min(99,bag[id].qty+Number(qty.dataset.quantity));if(bag[id].qty<=0)delete bag[id];persistBag();renderBag();const next=$(`[data-id="${id}"][data-quantity="${qty.dataset.quantity}"]`);(next||$('.close-bag')).focus();}
 const remove=event.target.closest('[data-remove]');if(remove){delete bag[remove.dataset.remove];persistBag();renderBag();$('.close-bag').focus();}
});
$$('[data-open-bag]').forEach(button=>button.addEventListener('click',openBag));$('.close-bag').addEventListener('click',closeBag);$('.drawer-overlay').addEventListener('click',closeBag);
document.addEventListener('keydown',event=>{if($('.bag-drawer').hidden)return;if(event.key==='Escape')closeBag();if(event.key==='Tab'){const targets=[...$('.bag-drawer').querySelectorAll('button,a,input')].filter(el=>el.getClientRects().length&&!el.disabled);const first=targets[0],last=targets.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});

// A sharing table becomes a single coherent evening plan.
const sharingPrices=Object.fromEntries(SHISHI_MENU.sharing.flatMap(tier=>Array.from({length:tier.max-tier.min+1},(_,i)=>[tier.min+i,tier.price])));
let sharingGuests=4,sharingOccasion='Just because';
function sharingPlan(guests=sharingGuests,occasion=sharingOccasion){
 return {kind:'sharing',guests,occasion,name:`Visinia for ${guests}`,total:sharingPrices[guests],includes:`A Shishi group meal for ${guests} people. Ask the restaurant about the day's selection.`};
}
function updateSharing(){
 const plan=sharingPlan();$('#sharing-size').value=String(sharingGuests);$$('[data-party]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.party)===sharingGuests)));
 $$('[data-occasion]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.occasion===sharingOccasion)));
 $('#feast-name').textContent=plan.name;$('#feast-includes').textContent=plan.includes;$('#feast-total').textContent=`TSh ${money(plan.total)}`;$('#feast-per-person').textContent=`About TSh ${money(Math.round(plan.total/plan.guests))} / person`;
 if(motionEnabled())$('.feast-description').animate([{opacity:.3,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:450,easing:ease});
}
$$('[data-party]').forEach(button=>button.addEventListener('click',()=>{sharingGuests=Number(button.dataset.party);updateSharing();}));
$$('[data-occasion]').forEach(button=>button.addEventListener('click',()=>{sharingOccasion=button.dataset.occasion;updateSharing();}));
$('#sharing-size').addEventListener('change',event=>{sharingGuests=Number(event.target.value);updateSharing();});
$('#plan-sharing').addEventListener('click',()=>openReservation(sharingPlan()));
$('#plan-event').addEventListener('click',()=>openReservation({kind:'event',guests:sharingGuests,occasion:'Graduation / Birthday',name:SHISHI_MENU.event.name,total:SHISHI_MENU.event.price,includes:'Special event listing. Guest capacity and package inclusions to be confirmed with the restaurant.'}));

// Native dialog provides focus containment, Escape, and screen-reader semantics.
const reservationDialog=$('.reservation-dialog'),reservationForm=$('#reservation-form');
let reservationPreviousFocus,reservationText='',reservationContext=null,moodVersion=0;
const atmosphereImages={'Garden benches':{image:'assets/garden-dining.png',alt:'The Shishi garden with white benches, green pillars and colourful umbrellas'},'Under the umbrellas':{image:'assets/references/venue-interior.jpg',alt:'The supplied Shishi interior photograph beneath the colourful umbrellas'},'Sharing table':{image:'assets/shishi-group-tray.png',alt:'A generous Shishi sharing tray with grilled meats, rice, chips and fruit'}};
async function setAtmosphere(value){
 const data=atmosphereImages[value];if(!data)return;const version=++moodVersion;
 reservationForm.elements.atmosphere.value=value;$$('[data-atmosphere]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.atmosphere===value)));
 $('#reservation-mood-caption').textContent=`THE ${value.toUpperCase()}`;
 const loaded=await loadPhoto(data.image);if(version!==moodVersion||!loaded)return;
 const image=$('.reservation-room-photo');image.src=data.image;image.alt=data.alt;
 if(motionEnabled())image.animate([{opacity:.3,transform:'scale(1.035)'},{opacity:1,transform:'scale(1)'}],{duration:650,easing:ease});
}
$$('[data-atmosphere]').forEach(button=>button.addEventListener('click',()=>setAtmosphere(button.dataset.atmosphere)));
function renderReservationFeast(){
 const block=$('.reservation-feast');block.hidden=!reservationContext;if(!reservationContext)return;
 block.innerHTML=`<strong>${reservationContext.name}</strong>${reservationContext.occasion} · TSh ${money(reservationContext.total)}<br><span>${reservationContext.includes}</span>`;
}
function todayInDar(){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Dar_es_Salaam',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const get=type=>parts.find(part=>part.type===type).value;return `${get('year')}-${get('month')}-${get('day')}`;}
function openReservation(context=null){
 if(reservationDialog.open)return;finishTour();closeMobileNav();reservationPreviousFocus=document.activeElement;
 reservationContext=['sharing','event'].includes(context?.kind)?{...context}:null;
 [...reservationForm.elements.guests.options].forEach(option=>option.disabled=reservationContext?.kind==='sharing'&&Number(option.value)<2);
 if(reservationContext)reservationForm.elements.guests.value=String(reservationContext.guests);
 renderReservationFeast();setAtmosphere(reservationForm.elements.atmosphere.value||'Garden benches');
 reservationForm.elements.date.min=todayInDar();$('.reservation-content').hidden=false;$('.reservation-success').hidden=true;
 reservationDialog.showModal();document.body.style.overflow='hidden';reservationDialog.scrollTop=0;
 requestAnimationFrame(()=>reservationForm.elements.name.focus({preventScroll:true}));
}
function closeReservation(){reservationDialog.close();}
$$('[data-reserve]').forEach(button=>button.addEventListener('click',openReservation));$$('[data-close-reservation]').forEach(button=>button.addEventListener('click',closeReservation));
reservationDialog.addEventListener('close',()=>{document.body.style.overflow='';reservationPreviousFocus?.focus();});
reservationDialog.addEventListener('click',event=>{if(event.target!==reservationDialog)return;const rect=reservationDialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)closeReservation();});
reservationForm.elements.date.addEventListener('input',()=>reservationForm.elements.date.setCustomValidity(''));
reservationForm.elements.name.addEventListener('input',()=>reservationForm.elements.name.setCustomValidity(''));
reservationForm.elements.guests.addEventListener('change',()=>{if(reservationContext){const guests=Number(reservationForm.elements.guests.value);reservationContext=reservationContext.kind==='sharing'?sharingPlan(guests,reservationContext.occasion):{...reservationContext,guests};renderReservationFeast();}});
reservationForm.addEventListener('submit',event=>{
 event.preventDefault();const data=new FormData(reservationForm);const name=String(data.get('name')).trim();const date=String(data.get('date'));const guests=String(data.get('guests'));const time=String(data.get('time'));const notes=String(data.get('notes')).trim();
 if(!name){reservationForm.elements.name.setCustomValidity('Please enter your name.');reservationForm.elements.name.reportValidity();return;}
 if(date<todayInDar()){reservationForm.elements.date.setCustomValidity('Choose today or a future date.');reservationForm.elements.date.reportValidity();return;}
 const formatted=new Intl.DateTimeFormat('en-GB',{dateStyle:'full',timeZone:'Africa/Dar_es_Salaam'}).format(new Date(`${date}T12:00:00+03:00`));const atmosphere=String(data.get('atmosphere'));
 $('.reservation-summary').innerHTML=`<div class="invitation-ticket"><div class="ticket-monogram footer-brand"><img src="assets/logo.svg" alt="Shishi Foodz" width="116" height="38"></div><span class="ticket-label">AN INVITATION TO SLOW DOWN</span><p class="ticket-name">For ${escapeText(name)}<br><em>& good company.</em></p><dl class="ticket-info"><div class="ticket-wide"><dt>THE DAY</dt><dd>${escapeText(formatted)}</dd></div><div><dt>THE TIME</dt><dd>${escapeText(time)} <small>EAT</small></dd></div><div><dt>THE PEOPLE</dt><dd>${guests} ${guests==='1'?'guest':'guests'}</dd></div><div class="ticket-wide"><dt>YOUR CORNER OF SHISHI</dt><dd>${escapeText(atmosphere)}</dd></div></dl>${reservationContext?`<div class="ticket-feast"><strong>${reservationContext.name}</strong>${reservationContext.occasion} · TSh ${money(reservationContext.total)}<br>${reservationContext.includes}</div>`:''}${notes?`<p class="ticket-feast">${escapeText(notes)}</p>`:''}</div>`;
 reservationText=`SHISHI FOODZ — YOUR EVENING\n\nFor: ${name}\nGuests: ${guests}\nDate: ${formatted}\nTime: ${time} (Africa/Dar_es_Salaam)\nYour setting: ${atmosphere}\n${reservationContext?`Your table: ${reservationContext.name}\nOccasion: ${reservationContext.occasion}\nIncludes: ${reservationContext.includes}\nSample total: TSh ${money(reservationContext.total)}\n`:''}Notes: ${notes||'None'}\n\nInteractive pitch preview. No booking has been sent.`;
 $('.reservation-content').hidden=true;$('.reservation-success').hidden=false;reservationDialog.scrollTop=0;$('.reservation-success').focus({preventScroll:true});
});
$('#download-reservation').addEventListener('click',()=>downloadText('shishi-reservation-preview.txt',reservationText));

const navigation=$('#mobile-navigation'),navToggle=$('.nav-toggle');
function closeMobileNav(){navigation.hidden=true;navToggle.setAttribute('aria-expanded','false');navToggle.textContent='Navigate';}
navToggle.addEventListener('click',()=>{const open=navigation.hidden;navigation.hidden=!open;navToggle.setAttribute('aria-expanded',String(open));navToggle.textContent=open?'Close':'Navigate';});
navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMobileNav));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!navigation.hidden){closeMobileNav();navToggle.focus();}});
$$('a[href="#menu"]').forEach(link=>link.addEventListener('click',()=>{if(!tour.complete)finishTour();}));

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.1,rootMargin:'0px 0px -25px 0px'});
$$('.reveal').forEach(el=>observer.observe(el));
function syncMotion(){document.documentElement.classList.toggle('motion-paused',motionPaused);document.body.classList.toggle('motion-ready',!reducedMotion.matches);$('.motion-toggle').setAttribute('aria-pressed',String(motionPaused));$('.motion-toggle').textContent=motionPaused?'Resume motion':'Pause motion';if(!motionEnabled()){finishTour();photoAnimations.forEach(animation=>animation.cancel());photoAnimations=[];}}
$('.motion-toggle').addEventListener('click',()=>{motionPaused=!motionPaused;try{localStorage.setItem('shishi-motion',motionPaused?'paused':'playing');}catch{}syncMotion();});
reducedMotion.addEventListener('change',syncMotion);
let scrollQueued=false;
function updateHeader(){const boundary=cinema.offsetHeight-90;$('.header').classList.toggle('is-solid',scrollY>boundary);scrollQueued=false;}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateHeader);}},{passive:true});window.addEventListener('resize',updateHeader,{passive:true});
populateMenuGroups();updateSharing();renderMenu();$('#dish-photo-name').textContent=dishes[0].native;$('#dish-category').textContent=dishes[0].label;$('.dish-photo-number i').textContent=`/ ${String(dishes.length).padStart(2,'0')}`;persistBag();syncMotion();updateHeader();$('#year').textContent=new Date().getFullYear();
