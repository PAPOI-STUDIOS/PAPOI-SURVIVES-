/* ======================================================================
   MAPA 3 · ZONA DESIERTA
   ----------------------------------------------------------------------
   Arena dorada con dunas, mesetas de arenisca, cactus, un oasis con palmeras
   (el agua frena un poco a Papoi), huesos, ruinas de arenisca y matas
   rodantes. Una ruta de caravana atraviesa el mapa.
   Colisiones: SÍ (mesetas, rocas, cactus, palmeras y ruinas bloquean el
   paso). La ruta de caravana se mantiene despejada.
   Formato y ayudas del kit `k`: ver el encabezado de mapa_rocoso.js.
   ====================================================================== */
registerMap({
  id:'desierto',
  nombre:'Desierto',
  icono:'🏜️',
  descripcion:'Dunas, cactus y un oasis. Con obstáculos.',
  semilla:6260,
  mundo:{w:1900,h:1900},
  colisiones:true,
  suelo:{color:'#c8a66a',tile:false},
  pastoColor:'#9a8446',
  limiteColor:'#b8452a',

  solidR:{mesa:26,sandrock:13,cactus:7,barrel:8,palm:6,sandruin:16,bones:0,tumbleweed:0,deadbush:0},
  sway:['palm'],

  /* ---------- Sprites propios de este mapa ---------- */
  estampas(k){
    const shadow=(c,w,h,rx)=>{
      c.fillStyle='rgba(70,45,15,.28)';
      c.beginPath();c.ellipse(w/2,h-4,rx,rx*.26,0,0,Math.PI*2);c.fill();
    };
    const mesa=seed=>{
      const rng=k.mulberry32(seed);
      const bands=[['#d9905a','#b96f3f'],['#c2764a','#9d5a33'],['#d69a62','#b27443'],['#a9633d','#834a2b']];
      return k.makeStamp(96,84,(c,w,h)=>{
        shadow(c,w,h,40);
        const bw=w*.78, top=14+rng()*8, topW=bw*(.62+rng()*.14), cx=w/2+(rng()-.5)*4, by=h-8;
        const bands_n=4, bh=(by-top)/bands_n;
        for(let i=0;i<bands_n;i++){
          const y0=top+i*bh, y1=y0+bh;
          const w0=topW+(bw-topW)*(i/bands_n)*(1+rng()*.06), w1=topW+(bw-topW)*((i+1)/bands_n)*(1+rng()*.06);
          const g=c.createLinearGradient(cx-w1/2,0,cx+w1/2,0);
          g.addColorStop(0,bands[i][0]);g.addColorStop(1,bands[i][1]);
          c.fillStyle=g;c.beginPath();
          c.moveTo(cx-w0/2,y0);c.lineTo(cx+w0/2,y0);c.lineTo(cx+w1/2,y1);c.lineTo(cx-w1/2,y1);c.closePath();c.fill();
          c.strokeStyle='rgba(60,30,10,.28)';c.lineWidth=1;
          c.beginPath();c.moveTo(cx-w0/2,y0);c.lineTo(cx+w0/2,y0);c.stroke();
        }
        // grietas verticales y tapa superior
        c.strokeStyle='rgba(60,30,10,.25)';
        for(let i=0;i<3;i++){const x=cx-topW/2+rng()*topW;c.beginPath();c.moveTo(x,top+2);c.lineTo(x+(rng()-.5)*8,top+bh*(1.5+rng()*2));c.stroke();}
        const tg=c.createLinearGradient(0,top-8,0,top+6);
        tg.addColorStop(0,'#e8bb84');tg.addColorStop(1,'#c99459');
        c.fillStyle=tg;c.beginPath();c.ellipse(cx,top,topW/2,7,0,0,Math.PI*2);c.fill();
        c.fillStyle='rgba(255,255,255,.12)';c.beginPath();c.ellipse(cx-topW*.15,top-2,topW*.22,2.5,0,0,Math.PI*2);c.fill();
        // arena acumulada en la base
        c.fillStyle='rgba(216,185,120,.75)';c.beginPath();c.ellipse(cx,by+2,bw*.55,6,0,0,Math.PI*2);c.fill();
      });
    };
    const sandrock=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(44,32,(c,w,h)=>{
        shadow(c,w,h,16);
        const cx=w/2,cy=h-15,n=8+((rng()*3)|0),pts=[];
        for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+rng()*.25,r=.8+rng()*.35;pts.push([cx+Math.cos(a)*17*r,cy+Math.sin(a)*12*r]);}
        const g=c.createLinearGradient(cx,cy-12,cx,cy+12);
        g.addColorStop(0,'#cdb283');g.addColorStop(1,'#7f6642');
        c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();
        c.strokeStyle='rgba(60,40,15,.4)';c.lineWidth=1.1;c.stroke();
        c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.ellipse(cx-4,cy-4,6,3,0,0,Math.PI*2);c.fill();
        c.fillStyle='rgba(225,195,135,.8)';c.beginPath();c.ellipse(cx,cy+11,15,3.5,0,0,Math.PI*2);c.fill();
      });
    };
    const cactus=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(46,78,(c,w,h)=>{
        shadow(c,w,h,12);
        const cx=w/2, gr=(x0,x1)=>{const g=c.createLinearGradient(x0,0,x1,0);g.addColorStop(0,'#2f7a3a');g.addColorStop(.5,'#4aa055');g.addColorStop(1,'#1f5a2b');return g;};
        const limb=(x,y0,y1,wd)=>{
          c.fillStyle=gr(x-wd,x+wd);c.beginPath();
          c.moveTo(x-wd,y1);c.lineTo(x-wd,y0+wd);c.arc(x,y0+wd,wd,Math.PI,0);c.lineTo(x+wd,y1);c.closePath();c.fill();
          c.strokeStyle='rgba(0,40,10,.3)';c.lineWidth=1;
          for(const f of[-.5,0,.5]){c.beginPath();c.moveTo(x+wd*f,y0+wd);c.lineTo(x+wd*f,y1);c.stroke();}
        };
        limb(cx,8,h-6,6.5);
        const arms=1+((rng()*2)|0);
        for(let i=0;i<arms;i++){
          const side=i===0?-1:1, ay=h-24-rng()*16, ax=cx+side*12, top=ay-14-rng()*8;
          c.fillStyle=gr(cx,ax);c.fillRect(Math.min(cx,ax)+(side<0?0:0),ay-4,Math.abs(ax-cx)+2,8);
          limb(ax,top,ay+2,4.6);
        }
        c.fillStyle='#f08ab0';c.beginPath();c.arc(cx,7,3,0,Math.PI*2);c.fill();
        c.fillStyle='rgba(255,255,255,.5)';
        for(let i=0;i<10;i++)c.fillRect(cx-8+rng()*16,12+rng()*(h-28),1,1);
      });
    };
    const barrel=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(34,30,(c,w,h)=>{
        shadow(c,w,h,11);
        const cx=w/2,cy=h-13;
        const g=c.createRadialGradient(cx-3,cy-4,2,cx,cy,12);
        g.addColorStop(0,'#5db068');g.addColorStop(1,'#1f5a2b');
        c.fillStyle=g;c.beginPath();c.ellipse(cx,cy,11,11.5,0,0,Math.PI*2);c.fill();
        c.strokeStyle='rgba(0,40,10,.35)';c.lineWidth=1;
        for(const f of[-.6,-.2,.2,.6]){c.beginPath();c.ellipse(cx,cy,11*Math.abs(f),11.5,0,0,Math.PI*2);c.stroke();}
        c.fillStyle='rgba(255,240,200,.8)';
        for(let i=0;i<9;i++)c.fillRect(cx-8+rng()*16,cy-8+rng()*16,1,1);
        c.fillStyle='#f4d24a';c.beginPath();c.arc(cx,cy-11,2.6,0,Math.PI*2);c.fill();
      });
    };
    const palm=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(84,112,(c,w,h)=>{
        shadow(c,w,h,20);
        const lean=(rng()-.5)*20, bx=w/2, by=h-6, tx=bx+lean, ty=34;
        c.lineCap='round';
        c.strokeStyle='#6b4a2a';c.lineWidth=7;
        c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx+lean*.2,(by+ty)/2,tx,ty);c.stroke();
        c.strokeStyle='rgba(30,15,5,.35)';c.lineWidth=1;
        for(let i=1;i<9;i++){const t=i/9,x=bx+(tx-bx)*t,y=by+(ty-by)*t;c.beginPath();c.moveTo(x-3.5,y);c.lineTo(x+3.5,y-1.5);c.stroke();}
        const n=8;
        for(let i=0;i<n;i++){
          const a=(i/n)*Math.PI*2+rng()*.3, len=28+rng()*10;
          const ex=tx+Math.cos(a)*len, ey=ty+Math.sin(a)*len*.55+10*Math.abs(Math.sin(a))+ (Math.sin(a)>0?6:-4);
          c.strokeStyle=i%2?'#2f7a3a':'#3f9448';c.lineWidth=5;
          c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*len*.6,ty-12-rng()*6,ex,ey);c.stroke();
          c.strokeStyle='rgba(20,70,25,.45)';c.lineWidth=1;
          c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*len*.6,ty-12,ex,ey);c.stroke();
        }
        c.fillStyle='#5a3b1e';
        c.beginPath();c.arc(tx-3,ty+4,3.4,0,Math.PI*2);c.arc(tx+3,ty+5,3.4,0,Math.PI*2);c.fill();
      });
    };
    const bones=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(46,20,(c,w,h)=>{
        c.fillStyle='rgba(70,45,15,.22)';c.beginPath();c.ellipse(w/2,h-4,17,3.5,0,0,Math.PI*2);c.fill();
        c.strokeStyle='#eee2c4';c.lineCap='round';c.lineWidth=2.2;
        for(let i=0;i<4;i++){const x=10+i*7;c.beginPath();c.moveTo(x,h-6);c.quadraticCurveTo(x+3,h-16,x+9,h-9+rng()*2);c.stroke();}
        c.lineWidth=2.6;c.beginPath();c.moveTo(8,h-6);c.lineTo(38,h-5);c.stroke();
        c.fillStyle='#f3e9d0';c.beginPath();c.ellipse(rng()<.5?9:37,h-9,5,4.2,0,0,Math.PI*2);c.fill();
        c.fillStyle='#3a2a18';c.fillRect(rng()<.5?7:35,h-11,1.6,2.2);c.fillRect(rng()<.5?10:38,h-11,1.6,2.2);
      });
    };
    const tumbleweed=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(34,30,(c,w,h)=>{
        c.fillStyle='rgba(70,45,15,.2)';c.beginPath();c.ellipse(w/2,h-3,10,3,0,0,Math.PI*2);c.fill();
        c.lineWidth=1;
        for(let i=0;i<26;i++){
          c.strokeStyle=rng()<.5?'#8b6a3a':'#a58150';
          const a=rng()*Math.PI*2,a2=a+1+rng()*1.6,r=8+rng()*3;
          c.beginPath();c.arc(w/2,h-13,r,a,a2);c.stroke();
        }
      });
    };
    const deadbush=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(38,26,(c,w,h)=>{
        c.lineCap='round';
        for(let i=0;i<7+((rng()*4)|0);i++){
          const a=-Math.PI/2+(rng()-.5)*1.9,len=9+rng()*11;
          c.strokeStyle=rng()<.5?'#7b6238':'#96794a';c.lineWidth=1.3;
          c.beginPath();c.moveTo(w/2+(rng()-.5)*5,h-3);
          c.quadraticCurveTo(w/2+Math.cos(a)*len*.4,h-3+Math.sin(a)*len*.6,w/2+Math.cos(a)*len,h-3+Math.sin(a)*len);c.stroke();
        }
      });
    };
    const sandruin=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(70,52,(c,w,h)=>{
        shadow(c,w,h,26);
        const block=(x,y,bw,bh)=>{
          const g=c.createLinearGradient(x,y,x+bw,y);
          g.addColorStop(0,'#d8bd8a');g.addColorStop(1,'#a78a5c');
          c.fillStyle=g;c.fillRect(x,y,bw,bh);
          c.strokeStyle='rgba(60,40,15,.4)';c.lineWidth=1;c.strokeRect(x+.5,y+.5,bw-1,bh-1);
          c.fillStyle='rgba(255,255,255,.14)';c.fillRect(x+1,y+1,bw-2,2);
        };
        const cols=2+((rng()*2)|0);
        for(let i=0;i<cols;i++){
          const x=8+i*(w-24)/cols+rng()*4, ht=18+rng()*22;
          block(x,h-7-ht,11,ht);
          block(x-2,h-7-ht-3,15,4);
        }
        block(w*.35,h-16,w*.38,9);
        c.fillStyle='rgba(225,195,135,.85)';c.beginPath();c.ellipse(w/2,h-6,w*.42,4,0,0,Math.PI*2);c.fill();
      });
    };
    return {
      mesa:[mesa(201),mesa(202),mesa(203)],
      sandrock:[sandrock(211),sandrock(212),sandrock(213),sandrock(214)],
      cactus:[cactus(221),cactus(222),cactus(223),cactus(224),cactus(225)],
      barrel:[barrel(231),barrel(232),barrel(233)],
      palm:[palm(241),palm(242),palm(243),palm(244)],
      bones:[bones(251),bones(252),bones(253)],
      tumbleweed:[tumbleweed(261),tumbleweed(262),tumbleweed(263)],
      deadbush:[deadbush(271),deadbush(272),deadbush(273)],
      sandruin:[sandruin(281),sandruin(282),sandruin(283)],
    };
  },

  /* ---------- Terreno y colocación de objetos ---------- */
  build(k){
    const W=k.world.w, H=k.world.h;

    // Dunas: manchas grandes claras/oscuras y motas de arena
    const prng=k.mulberry32(6261);
    k.addPatches(prng,{n:26,rMin:90,rVar:130,shades:['#d9bd7e','#e2c98f'],opMin:.30,opVar:.20,pts:10,irr:.55});
    k.addPatches(prng,{n:34,rMin:70,rVar:110,shades:['#a98a52','#b89a5f'],opMin:.22,opVar:.16,pts:10,irr:.55});
    k.addPatches(prng,{n:16,rMin:60,rVar:90,shades:['#b06b45','#9c5a3a'],opMin:.10,opVar:.08,pts:9,irr:.5});
    k.addPatches(prng,{n:70,rMin:12,rVar:26,shades:['#ecd8a0','#b39456'],opMin:.25,opVar:.18,pts:7,irr:.6});
    k.addPatches(prng,{n:45,rMin:5,rVar:9,shades:['#8d7240'],opMin:.25,opVar:.2,pts:6,irr:.7});

    // Oasis (arriba a la derecha) con anillo de vegetación
    const OA={x:1370,y:520,rx:175,ry:112};
    const orng=k.mulberry32(6262);
    const noise=[];for(let i=0;i<20;i++)noise.push(orng());
    const opts=[];
    for(let i=0;i<20;i++){
      const a=(i/20)*Math.PI*2, m=1+Math.sin(a*3+.7)*.14+(noise[i]-.5)*.18;
      opts.push({x:OA.x+Math.cos(a)*OA.rx*m,y:OA.y+Math.sin(a)*OA.ry*m});
    }
    const ring=k.mulberry32(6263);
    for(let i=0;i<9;i++){
      const a=(i/9)*Math.PI*2+ring()*.5, d=OA.rx*(1.15+ring()*.35);
      k.patches.push({x:OA.x+Math.cos(a)*d,y:OA.y+Math.sin(a)*d*.75,r:60+ring()*50,
        shade:ring()<.5?'#7f8f47':'#93a255',op:.32+ring()*.14,pts:k.makeBlobPoints(ring,1,9,.5)});
    }
    k.addWater({pts:opts,cx:OA.x,cy:OA.y,slow:.6,fill:'#1f6f78',
      ripple:{rx:60,ry:38,dx:42,dy:28,n:3,color:'rgba(255,255,255,.16)'}});

    // Ruta de caravana (despejada) y ramal hacia el oasis
    k.paths.push(
      {pts:[[110,1640],[420,1500],[700,1330],[950,1000],[1080,780],[1240,640]],
       w:84,w2:58,c1:'#b48f56',c2:'#c9a86a',despejar:true},
      {pts:[[950,1000],[1250,1180],[1520,1330],[1790,1250]],
       w:60,w2:38,c1:'#b48f56',c2:'#c9a86a',despejar:true}
    );
    // Ondulaciones del viento sobre la arena
    const wrng=k.mulberry32(6264);
    for(let i=0;i<34;i++){
      let x=wrng()*W,y=wrng()*H;
      const pts=[[x,y]],segs=3+((wrng()*2)|0);
      for(let s=0;s<segs;s++){x+=30+wrng()*28;y+=(wrng()-.5)*16;pts.push([x,y]);}
      k.paths.push({pts,w:2.5,c1:wrng()<.5?'rgba(120,90,45,.35)':'rgba(250,235,190,.4)',c2:false});
    }

    // Decoración
    const dunes=[{x:400,y:400,r:230},{x:1500,y:1550,r:250},{x:250,y:1100,r:200},{x:900,y:300,r:200},{x:1650,y:800,r:180},{x:1000,y:1650,r:200}];
    const mesaZones=[{x:1700,y:1700,r:150},{x:300,y:250,r:140},{x:1750,y:300,r:120},{x:200,y:1750,r:130}];
    const palmZone=[{x:OA.x,y:OA.y,r:250}];
    const clear=(x,y)=>!k.nearPath(x,y,32);

    k.scatter('mesa',12,{clusters:mesaZones,clusterChance:.75,minSpawn:260,gap:110,filter:clear});
    k.scatter('sandrock',44,{clusters:dunes,clusterChance:.5,minSpawn:110,gap:34,filter:clear});
    k.scatter('cactus',40,{clusters:dunes,clusterChance:.55,minSpawn:120,gap:46,filter:clear});
    k.scatter('barrel',34,{minSpawn:100,gap:40,filter:clear});
    k.scatter('palm',15,{clusters:palmZone,clusterChance:.95,minSpawn:120,gap:52,waterMargin:26,filter:clear});
    k.scatter('sandruin',7,{minSpawn:280,gap:90,filter:clear});
    k.scatter('bones',16,{minSpawn:100,gap:60});
    k.scatter('deadbush',56,{minSpawn:70,gap:26});
    k.scatter('tumbleweed',22,{minSpawn:80,gap:50});
    k.scatter('pebble',150,{minSpawn:55,gap:11});

    // Matas secas, escasas
    k.addGrass({seed:612,step:70,threshold:.88});
  }
});
