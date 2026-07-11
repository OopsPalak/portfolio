/* Cursor spotlight */
(function spotlight(){
  const el = document.getElementById('spotlight');
  if(!el || window.innerWidth < 760) return;
  window.addEventListener('mousemove', e=>{
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    el.style.setProperty('--sx', x+'%');
    el.style.setProperty('--sy', y+'%');
  });
})();

/* Nav scroll state + mobile menu */
(function nav(){
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', ()=>menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>menu.classList.remove('open')));
})();

/* Scroll reveals */
(function reveals(){
  const targets = document.querySelectorAll(
    '.section, .hero, .work-item, .contact-list li, .skills-group'
  );
  targets.forEach(t=>t.setAttribute('data-reveal',''));
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold:0.1 });
  targets.forEach(t=>io.observe(t));
})();

/* =========================================================
   HERO AVATAR — gentle float + cursor interaction
========================================================= */

(function heroAvatar() {

    const el = document.getElementById("heroAvatar");

    if (!el) return;

    let mouseX = -9999;
    let mouseY = -9999;

    const REPEL_RADIUS = 220;
    const REPEL_STRENGTH = 18;

    window.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
        mouseX = -9999;
        mouseY = -9999;
    });

    function animate(time) {

        const rect = el.getBoundingClientRect();

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = cx - mouseX;
        const dy = cy - mouseY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        let moveX = 0;
        let moveY = 0;

        if (distance < REPEL_RADIUS) {

            const angle = Math.atan2(dy, dx);

            const force = (1 - distance / REPEL_RADIUS) * REPEL_STRENGTH;

            moveX = Math.cos(angle) * force;
            moveY = Math.sin(angle) * force;
        }

        const floatY = Math.sin(time / 900) * 8;
        const rotate = Math.sin(time / 1400) * 2;

        el.style.transform =
            `translate(${moveX}px, ${moveY + floatY}px)
             rotate(${rotate}deg)
             scale(1.02)`;

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);

})();
