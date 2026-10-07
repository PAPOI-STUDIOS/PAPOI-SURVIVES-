/* ======================================================================
   MAPA 4 · ZONA MARINA
   ----------------------------------------------------------------------
   Playa de arena con un mar al sur (orilla de aguas poco profundas y fondo
   más oscuro), una laguna al noreste, pozas de marea, palmeras, corales,
   rocas mojadas, boyas, restos de naufragios y un muelle de madera.
   El agua frena a Papoi: poco en la orilla, más en el fondo. Sobre el muelle
   camina normal.
   Colisiones: SÍ (palmeras, rocas, corales, boyas y naufragios bloquean el
   paso, también dentro del agua). El muelle se mantiene despejado.
   Formato y ayudas del kit `k`: ver el encabezado de mapa_rocoso.js.
   ====================================================================== */
registerMap({
  id:'marino',
  nombre:'Marino',
  icono:'🌊',
  descripcion:'Playa, mar y naufragios. Con obstáculos.',
  semilla:7370,
  mundo:{w:1900,h:1900},
  colisiones:true,
  suelo:{color:'#e2d1a0',tile:false},
  pastoColor:'#7d9a52',
  limiteColor:'#2c8fb5',

  solidR:{palm:6,seaRock:15,coral:9,wreck:30,buoy:8,driftwood:0,shell:0,starfish:0,seagrass:0},
  sway:['palm','seagrass'],

  /* ---------- Sprites propios de este mapa ---------- */
  estampas(k){
    const shadow=(c,w,h,rx,col)=>{
      c.fillStyle=col||'rgba(60,45,20,.26)';
      c.beginPath();c.ellipse(w/2,h-4,rx,rx*.26,0,0,Math.PI*2);c.fill();
    };
    const palm=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(84,112,(c,w,h)=>{
        shadow(c,w,h,20);
        const lean=(rng()-.5)*26, bx=w/2, by=h-6, tx=bx+lean, ty=36;
        c.lineCap='round';
        c.strokeStyle='#7a5a36';c.lineWidth=7;
        c.beginPath();c.moveTo(bx,by);c.quadraticCurveTo(bx+lean*.1,(by+ty)/2,tx,ty);c.stroke();
        c.strokeStyle='rgba(40,25,10,.35)';c.lineWidth=1;
        for(let i=1;i<9;i++){const t=i/9,x=bx+(tx-bx)*t,y=by+(ty-by)*t;c.beginPath();c.moveTo(x-3.5,y);c.lineTo(x+3.5,y-1.5);c.stroke();}
        for(let i=0;i<9;i++){
          const a=(i/9)*Math.PI*2+rng()*.3, len=28+rng()*10;
          const ex=tx+Math.cos(a)*len, ey=ty+Math.sin(a)*len*.55+10*Math.abs(Math.sin(a))+(Math.sin(a)>0?6:-4);
          c.strokeStyle=i%2?'#2e8a4a':'#43a85a';c.lineWidth=5;
          c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*len*.6,ty-12-rng()*6,ex,ey);c.stroke();
          c.strokeStyle='rgba(15,70,30,.45)';c.lineWidth=1;
          c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+Math.cos(a)*len*.6,ty-12,ex,ey);c.stroke();
        }
        c.fillStyle='#5a3b1e';
        c.beginPath();c.arc(tx-3,ty+4,3.4,0,Math.PI*2);c.arc(tx+3,ty+5,3.4,0,Math.PI*2);c.fill();
      });
    };
    const seaRock=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(52,38,(c,w,h)=>{
        c.fillStyle='rgba(255,255,255,.28)';c.beginPath();c.ellipse(w/2,h-6,21,6,0,0,Math.PI*2);c.fill();
        shadow(c,w,h,18,'rgba(10,30,40,.3)');
        const cx=w/2,cy=h-17,n=9+((rng()*3)|0),pts=[];
        for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2+rng()*.25,r=.8+rng()*.35;pts.push([cx+Math.cos(a)*19*r,cy+Math.sin(a)*14*r]);}
        const g=c.createLinearGradient(cx,cy-14,cx,cy+14);
        g.addColorStop(0,'#7f8d95');g.addColorStop(.7,'#3d4a52');g.addColorStop(1,'#26323a');
        c.fillStyle=g;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.fill();
        c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1.1;c.stroke();
        c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.ellipse(cx-5,cy-6,7,3,0,0,Math.PI*2);c.fill();
        c.fillStyle='rgba(230,240,235,.7)';
        for(let i=0;i<7;i++)c.fillRect(cx-12+rng()*24,cy+2+rng()*8,1.4,1.4);
        c.fillStyle='rgba(70,140,90,.5)';c.beginPath();c.ellipse(cx+5,cy+9,8,3,0,0,Math.PI*2);c.fill();
      });
    };
    const CORAL=[['#ff7aa8','#c23a70'],['#ff9a4a','#c2571a'],['#b98cff','#6a3fc2'],['#ffd24a','#c28f1a']];
    const coral=seed=>{
      const rng=k.mulberry32(seed), p=CORAL[seed%CORAL.length];
      return k.makeStamp(50,50,(c,w,h)=>{
        c.fillStyle='rgba(255,255,255,.22)';c.beginPath();c.ellipse(w/2,h-6,17,5,0,0,Math.PI*2);c.fill();
        c.lineCap='round';
        const branch=(x,y,ang,len,wd,d)=>{
          const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;
          c.strokeStyle=d%2?p[0]:p[1];c.lineWidth=wd;
          c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();
          if(d<3){
            branch(x2,y2,ang-.55-rng()*.3,len*.72,wd*.75,d+1);
            branch(x2,y2,ang+.55+rng()*.3,len*.72,wd*.75,d+1);
          }else{c.fillStyle=p[0];c.beginPath();c.arc(x2,y2,wd*.9,0,Math.PI*2);c.fill();}
        };
        branch(w/2-6,h-7,-Math.PI/2-.2,13,5,0);
        branch(w/2+6,h-7,-Math.PI/2+.25,12,5,0);
        branch(w/2,h-7,-Math.PI/2,10,4.5,1);
      });
    };
    const wreck=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(120,96,(c,w,h)=>{
        c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.ellipse(w/2,h-8,50,10,0,0,Math.PI*2);c.fill();
        shadow(c,w,h,46,'rgba(10,30,40,.28)');
        // mástil roto detrás del casco
        c.strokeStyle='#4a3220';c.lineCap='round';c.lineWidth=6;
        c.beginPath();c.moveTo(w*.55,h-30);c.lineTo(w*.42+rng()*12,10+rng()*8);c.stroke();
        c.fillStyle='rgba(232,224,200,.85)';
        c.beginPath();c.moveTo(w*.46,20);c.lineTo(w*.7,34);c.lineTo(w*.5,54);c.lineTo(w*.44,36);c.closePath();c.fill();
        // casco
        const bx=w/2,by=h-12;
        const g=c.createLinearGradient(0,by-40,0,by);
        g.addColorStop(0,'#8a6236');g.addColorStop(1,'#4a3220');
        c.fillStyle=g;c.beginPath();
        c.moveTo(bx-52,by-34);c.quadraticCurveTo(bx-44,by-2,bx-10,by);
        c.lineTo(bx+22,by);c.quadraticCurveTo(bx+50,by-6,bx+56,by-28);
        c.lineTo(bx+44,by-30);c.lineTo(bx+38,by-24);c.lineTo(bx+26,by-32);c.lineTo(bx+12,by-24);
        c.lineTo(bx,by-34);c.lineTo(bx-14,by-26);c.lineTo(bx-28,by-34);c.lineTo(bx-38,by-28);c.closePath();c.fill();
        c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1.2;c.stroke();
        c.strokeStyle='rgba(20,10,0,.35)';c.lineWidth=1;
        for(let i=1;i<4;i++){c.beginPath();c.moveTo(bx-46+i*4,by-34+i*8);c.quadraticCurveTo(bx,by-30+i*9,bx+52-i*3,by-28+i*7);c.stroke();}
        // costillas rotas asomando
        c.strokeStyle='#5a3f26';c.lineWidth=3.5;
        for(let i=0;i<4;i++){const x=bx-30+i*24;c.beginPath();c.moveTo(x,by-30);c.lineTo(x+(rng()-.5)*6,by-44-rng()*10);c.stroke();}
        // algas y espuma
        c.fillStyle='rgba(60,130,80,.6)';c.beginPath();c.ellipse(bx+20,by-2,14,4,0,0,Math.PI*2);c.fill();
      });
    };
    const driftwood=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(58,18,(c,w,h)=>{
        c.fillStyle='rgba(60,45,20,.22)';c.beginPath();c.ellipse(w/2,h-4,22,3.5,0,0,Math.PI*2);c.fill();
        const g=c.createLinearGradient(0,h-13,0,h-4);
        g.addColorStop(0,'#c9b48a');g.addColorStop(1,'#8b7248');
        c.fillStyle=g;c.beginPath();
        c.moveTo(6,h-8);c.quadraticCurveTo(w/2,h-16+rng()*3,w-6,h-9);c.quadraticCurveTo(w/2,h-3,6,h-8);c.fill();
        c.strokeStyle='rgba(60,40,15,.35)';c.lineWidth=1;
        c.beginPath();c.moveTo(12,h-9);c.lineTo(w-14,h-9);c.stroke();
        c.strokeStyle='#8b7248';c.lineWidth=2;c.lineCap='round';
        c.beginPath();c.moveTo(w*.4,h-11);c.lineTo(w*.5,h-16);c.stroke();
      });
    };
    const shell=seed=>{
      const rng=k.mulberry32(seed), col=['#f4c6d4','#f7e2bc','#e8b7a0'][seed%3];
      return k.makeStamp(24,16,(c,w,h)=>{
        c.fillStyle='rgba(60,45,20,.2)';c.beginPath();c.ellipse(w/2,h-3,7,2.4,0,0,Math.PI*2);c.fill();
        c.fillStyle=col;c.beginPath();c.moveTo(w/2,h-3);c.quadraticCurveTo(w/2-9,h-6,w/2-7,h-11);
        c.quadraticCurveTo(w/2,h-16,w/2+7,h-11);c.quadraticCurveTo(w/2+9,h-6,w/2,h-3);c.fill();
        c.strokeStyle='rgba(120,70,60,.45)';c.lineWidth=.8;
        for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(w/2,h-3);c.lineTo(w/2+i*2.8,h-13+Math.abs(i)*.8);c.stroke();}
      });
    };
    const starfish=seed=>{
      const col=['#ff8a4a','#ff5c7a','#ffb84a'][seed%3];
      return k.makeStamp(26,16,(c,w,h)=>{
        c.fillStyle='rgba(60,45,20,.18)';c.beginPath();c.ellipse(w/2,h-3,8,2.4,0,0,Math.PI*2);c.fill();
        c.fillStyle=col;c.beginPath();
        const cx=w/2,cy=h-8;
        for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?3:8.5;const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r*.55;i?c.lineTo(x,y):c.moveTo(x,y);}
        c.closePath();c.fill();
        c.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<5;i++){const a=-Math.PI/2+i*Math.PI*.4;c.fillRect(cx+Math.cos(a)*4-.4,cy+Math.sin(a)*2.3-.4,1,1);}
      });
    };
    const buoy=seed=>{
      return k.makeStamp(30,44,(c,w,h)=>{
        c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(w/2,h-5,11,3.2,0,0,Math.PI*2);c.fill();
        shadow(c,w,h,9,'rgba(10,30,40,.25)');
        c.strokeStyle='#2d3a40';c.lineWidth=2;c.beginPath();c.moveTo(w/2,h-14);c.lineTo(w/2,8);c.stroke();
        c.fillStyle='#e94a3a';c.beginPath();c.moveTo(w/2-9,h-6);c.lineTo(w/2-6,h-26);c.lineTo(w/2+6,h-26);c.lineTo(w/2+9,h-6);c.closePath();c.fill();
        c.fillStyle='#f6f2e6';c.fillRect(w/2-7.5,h-19,15,5);
        c.fillStyle='rgba(255,255,255,.3)';c.fillRect(w/2-6,h-25,3,17);
        c.fillStyle='#ffd24a';c.beginPath();c.arc(w/2,7,3,0,Math.PI*2);c.fill();
      });
    };
    const seagrass=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(34,30,(c,w,h)=>{
        c.lineCap='round';
        for(let i=0;i<9;i++){
          const x=w/2+(rng()-.5)*14,len=12+rng()*14,tilt=(rng()-.5)*.9;
          c.strokeStyle=rng()<.5?'#7d9a52':'#a3b866';c.lineWidth=1.5;
          c.beginPath();c.moveTo(x,h-3);c.quadraticCurveTo(x+tilt*len*.3,h-3-len*.6,x+tilt*len,h-3-len);c.stroke();
        }
      });
    };
    return {
      palm:[palm(301),palm(302),palm(303),palm(304),palm(305)],
      seaRock:[seaRock(311),seaRock(312),seaRock(313),seaRock(314)],
      coral:[coral(320),coral(321),coral(322),coral(323),coral(324),coral(325)],
      wreck:[wreck(331),wreck(332),wreck(333)],
      driftwood:[driftwood(341),driftwood(342),driftwood(343)],
      shell:[shell(350),shell(351),shell(352),shell(353),shell(354),shell(355)],
      starfish:[starfish(360),starfish(361),starfish(362),starfish(363)],
      buoy:[buoy(371),buoy(372)],
      seagrass:[seagrass(381),seagrass(382),seagrass(383)],
    };
  },

  /* ---------- Terreno y colocación de objetos ---------- */
  build(k){
    const W=k.world.w, H=k.world.h;

    // Orilla ondulada del mar (sur): y = f(x)
    const shore=x=>1480+Math.sin(x*.0045+1)*55+Math.sin(x*.011)*22;
    const deepShore=x=>shore(x)+150+Math.sin(x*.007+2)*32;
    const xs=[];for(let x=-120;x<=2020;x+=120)xs.push(x);

    // Arena: zonas secas claras, arena mojada junto a la orilla y motas
    const prng=k.mulberry32(7371);
    k.addPatches(prng,{n:26,rMin:80,rVar:130,shades:['#efe2b8','#f3e8c4'],opMin:.30,opVar:.20,pts:10,irr:.55});
    k.addPatches(prng,{n:30,rMin:60,rVar:100,shades:['#cdb98a','#d6c295'],opMin:.22,opVar:.16,pts:10,irr:.55});
    k.addPatches(prng,{n:60,rMin:12,rVar:26,shades:['#f8efd0','#bfa870'],opMin:.25,opVar:.18,pts:7,irr:.6});
    k.addPatches(prng,{n:40,rMin:5,rVar:9,shades:['#a48c58'],opMin:.25,opVar:.2,pts:6,irr:.7});
    const wet=k.mulberry32(7372);
    for(const x of xs){
      if(x<0||x>W) continue;
      k.patches.push({x,y:shore(x)-28,r:70+wet()*35,shade:'#b9a06c',op:.38+wet()*.12,pts:k.makeBlobPoints(wet,1,9,.45)});
    }

    // Mar sur: orilla poco profunda + fondo más oscuro (gana el más lento)
    const seaShallow=xs.map(x=>({x,y:shore(x)})).concat([{x:2120,y:1700},{x:2120,y:2200},{x:950,y:2200},{x:-220,y:2200},{x:-220,y:1700}]);
    k.addWater({pts:seaShallow,cx:950,cy:1850,slow:.78,fill:'#43aebc',
      ripple:{rx:220,ry:60,dx:250,dy:70,n:4,color:'rgba(255,255,255,.16)'}});
    const seaDeep=xs.map(x=>({x,y:deepShore(x)})).concat([{x:2120,y:1900},{x:2120,y:2200},{x:950,y:2200},{x:-220,y:2200},{x:-220,y:1900}]);
    k.addWater({pts:seaDeep,cx:950,cy:2000,slow:.5,fill:'#1d6f93',
      ripple:{rx:200,ry:50,dx:230,dy:60,n:4,color:'rgba(255,255,255,.12)'}});

    // Laguna (noreste) con fondo, y pozas de marea
    const blob=(cx,cy,rx,ry,seed,n)=>{
      const r=k.mulberry32(seed),no=[];for(let i=0;i<n;i++)no.push(r());
      const pts=[];
      for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2,m=1+Math.sin(a*3+.9)*.13+(no[i]-.5)*.18;pts.push({x:cx+Math.cos(a)*rx*m,y:cy+Math.sin(a)*ry*m});}
      return pts;
    };
    const LG={x:1460,y:430,rx:270,ry:150};
    k.addWater({pts:blob(LG.x,LG.y,LG.rx,LG.ry,7373,20),cx:LG.x,cy:LG.y,slow:.78,fill:'#43aebc',
      ripple:{rx:70,ry:40,dx:55,dy:32,n:3,color:'rgba(255,255,255,.18)'}});
    k.addWater({pts:blob(LG.x,LG.y,LG.rx*.55,LG.ry*.5,7374,16),cx:LG.x,cy:LG.y,slow:.55,fill:'#1d6f93',
      ripple:{rx:40,ry:24,dx:34,dy:20,n:2,color:'rgba(255,255,255,.14)'}});
    for(const [x,y,r,sd] of [[380,620,95,7375],[560,1180,80,7376],[1620,1100,70,7377]]){
      k.addWater({pts:blob(x,y,r,r*.7,sd,14),cx:x,cy:y,slow:.85,fill:'#56bcc6',
        ripple:{rx:26,ry:16,dx:22,dy:13,n:2,color:'rgba(255,255,255,.2)'}});
    }

    // Espuma en la orilla (dos líneas onduladas)
    k.paths.push({pts:xs.map(x=>[x,shore(x)+4]),w:5,c1:'rgba(255,255,255,.6)',c2:false});
    k.paths.push({pts:xs.map(x=>[x,shore(x)+20+Math.sin(x*.02)*6]),w:3,c1:'rgba(255,255,255,.35)',c2:false});

    // Muelle de madera (despejado, sin frenado de agua)
    k.paths.push({pts:[[930,1220],[930,1690]],w:46,w2:34,c1:'#4a3220',c2:'#8a6a40',despejar:true,puente:true});
    // Senda de arena pisada hacia el muelle
    k.paths.push({pts:[[420,960],[700,1040],[930,1220]],w:70,w2:46,c1:'#c9b47f',c2:'#d8c592',despejar:true});
    k.paths.push({pts:[[930,1220],[1250,1010],[1600,900],[1790,760]],w:60,w2:38,c1:'#c9b47f',c2:'#d8c592',despejar:true});

    // Decoración
    const beachZones=[{x:400,y:1300,r:230},{x:1500,y:1330,r:230},{x:250,y:250,r:220},{x:900,y:300,r:200},{x:1700,y:900,r:180}];
    const palmZones=[{x:LG.x,y:LG.y,r:340},{x:400,y:1350,r:250},{x:1550,y:1380,r:250},{x:300,y:300,r:200}];
    const clear=(x,y)=>!k.nearPath(x,y,32);

    k.scatter('palm',30,{clusters:palmZones,clusterChance:.85,minSpawn:160,gap:56,waterMargin:28,filter:clear});
    k.scatter('seaRock',26,{clusters:beachZones,clusterChance:.5,minSpawn:130,gap:38,filter:clear});
    k.scatter('seaRock',26,{onWater:true,minSpawn:0,gap:40,filter:clear});
    k.scatter('coral',34,{onWater:true,minSpawn:0,gap:36,filter:clear});
    k.scatter('buoy',12,{onWater:true,minSpawn:0,gap:110,filter:clear});
    k.scatter('wreck',3,{onWater:true,clusters:[{x:950,y:1660,r:800}],clusterChance:1,minSpawn:0,gap:260,filter:(x,y)=>y>1500&&y<1800&&clear(x,y)});
    k.scatter('driftwood',24,{minSpawn:90,gap:60,waterMargin:6});
    k.scatter('shell',60,{minSpawn:70,gap:30,waterMargin:6});
    k.scatter('starfish',30,{minSpawn:70,gap:36,waterMargin:6});
    k.scatter('seagrass',70,{clusters:beachZones,clusterChance:.55,minSpawn:70,gap:28});
    k.scatter('pebble',120,{minSpawn:55,gap:11});

    // Matas de hierba de duna, escasas
    k.addGrass({seed:613,step:70,threshold:.86});
  }
});
