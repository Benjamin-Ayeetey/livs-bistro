import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import '@iconify/iconify';

// All photography and the original logo are provided by Liv's Bistro in /assets.
// Dish names, pricing, location and contact details are demo content pending confirmation.
const meals = [
  {id:1,name:'The Jollof Affair',category:'rice',image:'food1',price:85,subtitle:'Smoky jollof · chicken · golden plantain',description:'A generous plate of jollof rice, grilled chicken, sweet plantain and a bright side salad.'},
  {id:2,name:'Jollof & Chichinga',category:'rice',image:'food2',price:95,subtitle:'Jollof · spiced beef · sweet plantain',description:'Ghanaian-style spiced beef skewers, jollof rice, plantain and a crisp side of slaw. A plate full of familiar favourites.'},
  {id:3,name:'The Golden Plate',category:'rice',image:'food4',price:85,subtitle:'Vegetable rice · chargrilled chicken',description:'Colourful vegetable rice with beautifully grilled chicken and a side of seasonal vegetables.'},
  {id:4,name:'The Comfort Combo',category:'comfort',image:'food7',price:100,subtitle:'Golden chips · chicken · crisp slaw',description:'Golden chips, grilled chicken and fresh slaw, with a little sauce on the side. Simple pleasures, generously served.'},
  {id:5,name:'Fresh off the Fire',category:'grill',image:'food8',price:120,subtitle:'Grilled fish · yam · fresh vegetables',description:'A beautifully grilled fish with golden yam and a colourful side salad. Made for lovers of bold, savoury flavours.'},
  {id:6,name:'The Happy Bowl',category:'fresh',image:'food6',price:100,subtitle:'Grilled prawns · avocado · greens',description:'Grilled prawns, avocado, crisp greens and colourful vegetables, with dressing on the side. Fresh, bright and full of flavour.'}
];
const currency = value => `GH₵${value.toLocaleString('en-GH')}`;
const grid=document.querySelector('#meal-grid');
function renderMeals(filter='all') {
  grid.innerHTML=meals.filter(m=>filter==='all'||m.category===filter).map(m=>`<article class="meal-card"><button data-meal="${m.id}" aria-label="View ${m.name}"><div class="meal-picture"><img src="/media/${m.image}-640.webp" srcset="/media/${m.image}-640.webp 640w, /media/${m.image}-1120.webp 1120w" sizes="(max-width:700px) 45vw, 30vw" alt="${m.name}: ${m.subtitle}" loading="lazy" width="640" height="800"/><span class="meal-number">0${m.id}</span><span class="meal-arrow"><span class="iconify" data-icon="solar:arrow-right-up-linear"></span></span></div><div class="meal-info"><div><h3>${m.name}</h3><p>${m.subtitle}</p></div><span>${currency(m.price)}</span></div></button></article>`).join('');
}
renderMeals();
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderMeals(button.dataset.filter);ScrollTrigger.refresh();}));

let lenis;
let lastFocused;
const openDialog=dialog=>{lastFocused=document.activeElement;lenis?.stop();document.documentElement.classList.add('dialog-open');dialog.showModal();};
document.querySelectorAll('dialog').forEach(dialog=>{dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{document.documentElement.classList.remove('dialog-open');lenis?.start();if(lastFocused?.isConnected)lastFocused.focus();});});
const orderDialog=document.querySelector('#order-dialog');
const form=document.querySelector('#order-form');
function startEnquiry(message='') {form.hidden=false;document.querySelector('#enquiry-result').hidden=true;form.elements.request.value=message;openDialog(orderDialog);}
document.querySelectorAll('[data-open-order]').forEach(b=>b.addEventListener('click',()=>startEnquiry(b.dataset.orderType==='gather'?'I’m planning a gathering. Occasion: \nGuests: \nDate: ':'')));
grid.addEventListener('click',event=>{const button=event.target.closest('[data-meal]');if(!button)return;const meal=meals.find(m=>m.id===Number(button.dataset.meal));document.querySelector('#meal-detail').innerHTML=`<div class="detail"><div class="detail-photo"><img src="/media/${meal.image}-1120.webp" alt="${meal.name}" /></div><span class="eyebrow">A LITTLE SOMETHING FROM OUR KITCHEN</span><h2>${meal.name}</h2><p>${meal.description}</p><div class="detail-price">${currency(meal.price)} <span class="detail-tags">/ SAMPLE PRICE</span></div><p class="detail-warning">Please confirm ingredients, allergens and availability before ordering.</p><button class="pill" id="choose-meal">Make this my plate <span class="iconify" data-icon="solar:arrow-right-up-linear"></span></button></div>`;openDialog(document.querySelector('#meal-dialog'));document.querySelector('#choose-meal').addEventListener('click',()=>{document.querySelector('#meal-dialog').close();startEnquiry(`I’d like to enquire about ${meal.name}.\nQuantity: 1\nDietary needs: `);});});
form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);document.querySelector('#enquiry-text').textContent=`Hello Liv’s Bistro!\n\n${data.get('request')}\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\n\nPlease confirm availability, pricing and delivery options.`;form.hidden=true;document.querySelector('#enquiry-result').hidden=false;document.querySelector('#copy-enquiry').textContent='Copy enquiry';});
document.querySelector('#copy-enquiry').addEventListener('click',async event=>{try{await navigator.clipboard.writeText(document.querySelector('#enquiry-text').textContent);event.target.textContent='Copied!';}catch{event.target.textContent='Select the message to copy';const range=document.createRange();range.selectNodeContents(document.querySelector('#enquiry-text'));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);}});
document.querySelector('#edit-enquiry').addEventListener('click',()=>{form.hidden=false;document.querySelector('#enquiry-result').hidden=true;form.elements.name.focus();});
const toggle=document.querySelector('.mobile-toggle');const mobileNav=document.querySelector('.mobile-nav');
function closeNav(){mobileNav.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';mobileNav.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
mobileNav.querySelectorAll('a,button').forEach(a=>a.addEventListener('click',closeNav));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});

gsap.registerPlugin(ScrollTrigger);
const mm=gsap.matchMedia();
mm.add('(prefers-reduced-motion: no-preference)',()=>{
  // Lenis is the sole scrolling engine; native scroll remains the reduced-motion fallback.
  lenis=new Lenis({duration:1.05,smoothWheel:true,anchors:true});
  lenis.on('scroll',ScrollTrigger.update);const tick=time=>lenis?.raf(time*1000);gsap.ticker.add(tick);
  const intro=gsap.timeline({defaults:{ease:'power3.out'}});
  intro.from('.hero-kicker',{y:10,opacity:0,duration:.6}).from('h1',{y:35,duration:1},.1).from('.hero-bottom',{y:15,opacity:0,duration:.7},.25).from('.hero-frame',{y:65,opacity:0,duration:1.2,stagger:.12},.35);
  const restoreHeadings=[];
  document.querySelectorAll('.reveal').forEach(heading=>{const original=heading.innerHTML;const accessible=heading.cloneNode(true);accessible.querySelectorAll('br').forEach(br=>br.replaceWith(' '));const label=accessible.textContent.replace(/\s+/g,' ').trim();heading.setAttribute('aria-label',label);const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='split-word';span.setAttribute('aria-hidden','true');span.textContent=word;fragment.append(span);}});node.replaceWith(fragment);});gsap.from(heading.querySelectorAll('.split-word'),{y:24,opacity:0,duration:.8,stagger:.045,scrollTrigger:{trigger:heading,start:'top 90%',once:true}});restoreHeadings.push(()=>{heading.innerHTML=original;heading.removeAttribute('aria-label');});});
  gsap.utils.toArray('.story-photo,.gather-image').forEach(el=>gsap.from(el,{y:45,duration:1.1,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
  // Animate the link wrapper so the logo's hover/focus transform stays independent.
  gsap.from('.footer-logo-link',{y:18,rotation:-8,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:'.footer-identity',start:'top 95%',once:true}});
  const refresh=()=>ScrollTrigger.refresh();document.fonts.ready.then(refresh);document.querySelectorAll('img').forEach(img=>{if(!img.complete)img.addEventListener('load',refresh,{once:true});});
  return()=>{gsap.ticker.remove(tick);lenis.destroy();lenis=undefined;restoreHeadings.forEach(restore=>restore());};
});
window.addEventListener('pagehide',()=>{mm.revert();ScrollTrigger.getAll().forEach(t=>t.kill());});
