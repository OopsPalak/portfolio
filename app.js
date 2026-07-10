/* =========================================================
   LOADER
========================================================= */
(function loaderSeq(){
  const bar = document.getElementById('loaderProgress');
  const loader = document.getElementById('loader');
  let p = 0;
  const int = setInterval(()=>{
    p += Math.random()*18;
    if(p>=100){ p=100; clearInterval(int); }
    bar.style.width = p+'%';
    if(p===100){
      setTimeout(()=>{ loader.classList.add('hidden'); }, 350);
    }
  }, 180);
})();

/* =========================================================
   DOODLE FIELD — floating sparkles/hearts/stars in the background
========================================================= */
(function doodles(){
  const field = document.getElementById('doodleField');
  const glyphs = ['✿','✦','♡','✧','❀','⋆'];
  const count = window.innerWidth < 700 ? 10 : 20;
  for(let i=0;i<count;i++){
    const el = document.createElement('span');
    el.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    el.style.left = Math.random()*100+'%';
    el.style.top = Math.random()*100+'%';
    el.style.fontSize = (0.9 + Math.random()*1.4)+'rem';
    el.style.animationDuration = (6+Math.random()*6)+'s';
    el.style.animationDelay = (Math.random()*5)+'s';
    field.appendChild(el);
  }
})();

/* =========================================================
   CUTE CURSOR — blob + trailing bubbles
========================================================= */
(function cursor(){
  const blob = document.getElementById('cursorBlob');
  if(!blob) return;
  let mx=innerWidth/2, my=innerHeight/2, bx=mx, by=my;
  let lastBubble = 0;

  window.addEventListener('mousemove', e=>{
    mx = e.clientX; my = e.clientY;
    const now = performance.now();
    if(now - lastBubble > 55){
      spawnBubble(mx,my);
      lastBubble = now;
    }
  });

  function spawnBubble(x,y){
    const b = document.createElement('div');
    b.className = 'cursor-bubble';
    const size = 5 + Math.random()*8;
    b.style.width = size+'px';
    b.style.height = size+'px';
    b.style.left = x+'px';
    b.style.top = y+'px';
    document.body.appendChild(b);
    const dx = (Math.random()-0.5)*40;
    const dy = -20 - Math.random()*30;
    b.animate([
      { transform:'translate(-50%,-50%) translate(0,0) scale(1)', opacity:.8 },
      { transform:`translate(-50%,-50%) translate(${dx}px,${dy}px) scale(0.2)`, opacity:0 }
    ], { duration:700+Math.random()*300, easing:'cubic-bezier(.22,1,.36,1)' });
    setTimeout(()=>b.remove(), 1000);
  }

  function loop(){
    bx += (mx-bx)*0.22; by += (my-by)*0.22;
    blob.style.transform = `translate(${bx}px,${by}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();

  document.querySelectorAll('a, button, .project-card, .chip-cloud span').forEach(el=>{
    el.addEventListener('mouseenter', ()=>blob.classList.add('hover'));
    el.addEventListener('mouseleave', ()=>blob.classList.remove('hover'));
  });
})();

/* =========================================================
   NAV: scroll state + mobile menu
========================================================= */
(function nav(){
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', ()=>{
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', ()=>menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>menu.classList.remove('open')));
})();

/* =========================================================
   SCROLL REVEALS
========================================================= */
(function reveals(){
  const targets = document.querySelectorAll(
    '.section-head, .about-copy, .about-card, .skill-block, .timeline-item, .project-card, .contact-box, .stat, .hero-3d'
  );
  targets.forEach(t=>t.setAttribute('data-reveal',''));

  const bars = document.querySelectorAll('.bar');

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold:0.15 });
  targets.forEach(t=>io.observe(t));

  const barIo = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold:0.4 });
  bars.forEach(b=>barIo.observe(b));

  const counters = document.querySelectorAll('.stat-num');
  const counterIo = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const el = entry.target;
        const target = parseInt(el.dataset.count,10);
        let cur = 0;
        const step = Math.max(1, Math.round(target/30));
        const t = setInterval(()=>{
          cur += step;
          if(cur>=target){ cur=target; clearInterval(t); }
          el.textContent = cur;
        }, 40);
        counterIo.unobserve(el);
      }
    });
  }, { threshold:0.6 });
  counters.forEach(c=>counterIo.observe(c));
})();

/* =========================================================
   3D CHARACTER — "Blossom"
   Stylized pastel figure with a flower crown, tracks cursor.
========================================================= */
(function character3D(){
  const canvasEl = document.getElementById('character-canvas');
  if(!canvasEl || typeof THREE === 'undefined') return;

  let scene, camera, renderer, group;
  let head, ponytail;
  let targetRotY = 0, targetRotX = 0;
  let currentRotY = 0, currentRotX = 0;
  let clock = new THREE.Clock();

  function init(){
    scene = new THREE.Scene();
    const container = canvasEl.parentElement;
    const w = container.clientWidth, h = container.clientHeight;

    camera = new THREE.PerspectiveCamera(32, w/h, 0.1, 100);
    camera.position.set(0, 0.15, 8.4);

    renderer = new THREE.WebGLRenderer({ canvas:canvasEl, antialias:true, alpha:true });
    renderer.setSize(w,h);
    renderer.setPixelRatio(Math.min(devicePixelRatio,2));

    const key = new THREE.PointLight(0xffb3d9, 2.3, 20);
    key.position.set(2.5, 3, 4);
    scene.add(key);

    const rim = new THREE.PointLight(0xa9e1ff, 2.1, 20);
    rim.position.set(-3, 1, -2);
    scene.add(rim);

    const fill = new THREE.AmbientLight(0xfff2e0, 1.0);
    scene.add(fill);

    const top = new THREE.PointLight(0xffffff, 0.7, 15);
    top.position.set(0, 4, 2);
    scene.add(top);

    group = new THREE.Group();
    scene.add(group);

    buildCharacter();
    buildOrbitAccents();

    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, {passive:true});

    animate();
  }

  function buildCharacter(){
    const matSkin = new THREE.MeshStandardMaterial({ color:0xffddc2, roughness:0.55, metalness:0.05 });
    const matHair = new THREE.MeshStandardMaterial({ color:0xc9a7e8, roughness:0.4, metalness:0.15 });
    const matTop = new THREE.MeshStandardMaterial({ color:0xff9ec4, roughness:0.5, metalness:0.15, emissive:0xff6fa8, emissiveIntensity:0.15 });
    const matAccent = new THREE.MeshStandardMaterial({ color:0xaef0d6, roughness:0.3, metalness:0.3, emissive:0x6fd9ac, emissiveIntensity:0.35 });
    const matPetal = new THREE.MeshStandardMaterial({ color:0xffe29b, roughness:0.4, metalness:0.1, emissive:0xffb347, emissiveIntensity:0.2 });

    // Torso
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 1.15, 6, 16), matTop);
    torso.position.y = -0.55;
    torso.scale.set(0.92,1,0.78);
    group.add(torso);

    // Collar accent
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.34,0.035,8,24), matAccent);
    collar.rotation.x = Math.PI/2;
    collar.position.y = 0.05;
    group.add(collar);

    // Head group
    head = new THREE.Group();
    head.position.y = 0.92;
    group.add(head);

    const face = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), matSkin);
    face.scale.set(0.86,1,0.92);
    head.add(face);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18,0.22,0.32,16), matSkin);
    neck.position.y = 0.42;
    group.add(neck);

    // Hair back volume
    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.56,24,24), matHair);
    hair.scale.set(0.94,1.02,0.98);
    hair.position.set(0,0.02,-0.06);
    head.add(hair);

    // Fringe
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.52,24,24,0,Math.PI*2,0,Math.PI*0.55), matHair);
    fringe.position.set(0,0.22,0.02);
    head.add(fringe);

    // Ponytail
    ponytail = new THREE.Mesh(new THREE.ConeGeometry(0.16,0.75,12), matHair);
    ponytail.position.set(0,-0.15,-0.48);
    ponytail.rotation.x = 0.55;
    head.add(ponytail);

    // ---- Flower crown ----
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 0.42, 0.06);
    const flowerCount = 6;
    for(let i=0;i<flowerCount;i++){
      const a = (i/flowerCount) * Math.PI * 1.15 - Math.PI*0.55;
      const fx = Math.sin(a)*0.46;
      const fz = Math.cos(a)*0.46;
      const flower = new THREE.Group();
      const petalMat = (i%2===0) ? matTop : matPetal;
      for(let p=0;p<5;p++){
        const petal = new THREE.Mesh(new THREE.SphereGeometry(0.05,8,8), petalMat);
        const pa = (p/5)*Math.PI*2;
        petal.position.set(Math.cos(pa)*0.06, 0, Math.sin(pa)*0.06);
        petal.scale.set(1,0.6,1);
        flower.add(petal);
      }
      const center = new THREE.Mesh(new THREE.SphereGeometry(0.035,8,8), new THREE.MeshStandardMaterial({color:0xffe27a, emissive:0xffb347, emissiveIntensity:0.4}));
      flower.add(center);
      flower.position.set(fx, 0.03*Math.sin(i*1.3), fz);
      crownGroup.add(flower);
    }
    head.add(crownGroup);

    // Eyes
    const eyeGeo = new THREE.SphereGeometry(0.045,12,12);
    const eyeMat = new THREE.MeshStandardMaterial({ color:0x4e3f58, roughness:0.2, metalness:0.3 });
    const eyesL = new THREE.Mesh(eyeGeo, eyeMat); eyesL.position.set(-0.17,0.02,0.46); head.add(eyesL);
    const eyesR = new THREE.Mesh(eyeGeo, eyeMat); eyesR.position.set(0.17,0.02,0.46); head.add(eyesR);

    const sparkGeo = new THREE.SphereGeometry(0.014,6,6);
    const sparkMat = new THREE.MeshBasicMaterial({ color:0xffffff });
    const s1 = new THREE.Mesh(sparkGeo, sparkMat); s1.position.set(-0.15,0.045,0.49); head.add(s1);
    const s2 = new THREE.Mesh(sparkGeo, sparkMat); s2.position.set(0.19,0.045,0.49); head.add(s2);

    // Blush
    const blushMat = new THREE.MeshStandardMaterial({ color:0xff9ec4, roughness:0.9, transparent:true, opacity:0.55 });
    const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.06,10,10), blushMat); blushL.position.set(-0.28,-0.08,0.4); blushL.scale.set(1,0.6,0.4); head.add(blushL);
    const blushR = new THREE.Mesh(new THREE.SphereGeometry(0.06,10,10), blushMat); blushR.position.set(0.28,-0.08,0.4); blushR.scale.set(1,0.6,0.4); head.add(blushR);

    // Smile
    const mouthGeo = new THREE.TorusGeometry(0.09,0.012,8,16,Math.PI);
    const mouthMat = new THREE.MeshStandardMaterial({ color:0xd97a8f, roughness:0.5 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0,-0.16,0.46);
    mouth.rotation.z = Math.PI;
    head.add(mouth);

    // Earrings
    const earGeo = new THREE.SphereGeometry(0.03,8,8);
    const earL = new THREE.Mesh(earGeo, matAccent); earL.position.set(-0.48,-0.06,0.02); head.add(earL);
    const earR = new THREE.Mesh(earGeo, matAccent); earR.position.set(0.48,-0.06,0.02); head.add(earR);

    // Arms
    const armGeo = new THREE.CapsuleGeometry(0.09,0.72,4,10);
    const armL = new THREE.Mesh(armGeo, matSkin);
    armL.position.set(-0.68,-0.45,0.02); armL.rotation.z = 0.32; group.add(armL);
    const armR = new THREE.Mesh(armGeo, matSkin);
    armR.position.set(0.68,-0.45,0.02); armR.rotation.z = -0.32; group.add(armR);

    group.position.y = 0.3;
    group.scale.setScalar(1.55);
  }

  function buildOrbitAccents(){
    const accentGroup = new THREE.Group();
    group.add(accentGroup);

    const shapes = [
      { geo:new THREE.SphereGeometry(0.07,12,12), color:0xaef0d6, r:2.1, speed:0.4, y:0.4 },
      { geo:new THREE.SphereGeometry(0.06,12,12), color:0xc6b6ff, r:1.9, speed:-0.3, y:-0.3 },
      { geo:new THREE.TorusGeometry(0.07,0.02,8,16), color:0xffe29b, r:2.3, speed:0.25, y:0.8 },
      { geo:new THREE.SphereGeometry(0.05,12,12), color:0xff9ec4, r:2.0, speed:-0.45, y:-0.7 },
    ];

    shapes.forEach(s=>{
      const mat = new THREE.MeshStandardMaterial({ color:s.color, emissive:s.color, emissiveIntensity:0.5, roughness:0.4, metalness:0.15 });
      const mesh = new THREE.Mesh(s.geo, mat);
      mesh.userData = { r:s.r, speed:s.speed, yOff:s.y, phase:Math.random()*Math.PI*2 };
      accentGroup.add(mesh);
    });

    character3D._accentGroup = accentGroup;
  }

  function onMouseMove(e){
    const nx = (e.clientX / innerWidth) * 2 - 1;
    const ny = (e.clientY / innerHeight) * 2 - 1;
    targetRotY = nx * 0.55;
    targetRotX = ny * 0.28;
  }
  function onTouchMove(e){
    if(!e.touches[0]) return;
    const nx = (e.touches[0].clientX / innerWidth) * 2 - 1;
    const ny = (e.touches[0].clientY / innerHeight) * 2 - 1;
    targetRotY = nx * 0.4;
    targetRotX = ny * 0.2;
  }
  function onResize(){
    const container = canvasEl.parentElement;
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  }

  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    currentRotY += (targetRotY - currentRotY) * 0.06;
    currentRotX += (targetRotX - currentRotX) * 0.06;

    if(head){
      head.rotation.y = currentRotY * 1.1;
      head.rotation.x = -currentRotX * 0.6;
    }
    if(group){
      group.rotation.y = currentRotY * 0.28;
      group.position.y = 0.3 + Math.sin(t*1.2)*0.045;
    }
    if(ponytail){
      ponytail.rotation.x = 0.55 + Math.sin(t*1.6)*0.08;
    }

    if(character3D._accentGroup){
      character3D._accentGroup.children.forEach(mesh=>{
        const { r, speed, yOff, phase } = mesh.userData;
        const angle = t*speed + phase;
        mesh.position.x = Math.cos(angle)*r;
        mesh.position.z = Math.sin(angle)*r*0.6;
        mesh.position.y = yOff + Math.sin(t*0.8+phase)*0.15;
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.015;
      });
    }

    renderer.render(scene, camera);
  }

  init();
})();