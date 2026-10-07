/* ======================================================================
   MAPA 2 · ZONA ROCOSA
   ----------------------------------------------------------------------
   Terreno árido de piedra gris y óxido, con un cauce seco cruzando el mapa,
   grietas en el suelo, crestas de rocas, agujas de piedra, árboles muertos
   y vetas de cristales.
   Colisiones: SÍ (peñascos, rocas, agujas, árboles muertos, cristales y
   ruinas bloquean el paso). El cauce seco se mantiene despejado.

   Este archivo sirve de PLANTILLA para los mapas siguientes (desierto,
   marino, bosque): copia el archivo, cambia el id/nombre y reescribe
   estampas() y build(). Todo lo que el juego ofrece a un mapa está en `k`:

     k.world                       {w,h} tamaño del mundo
     k.rng()                       aleatorio determinista del mapa (semilla)
     k.mulberry32(seed)            crea otro aleatorio determinista
     k.makeStamp(w,h,fn(c,w,h))    sprite pre-dibujado (ancla: centro-abajo)
     k.addPatches(rng,{n,rMin,rVar,shades:[a,b],opMin,opVar,pts,irr})
     k.paths.push({x1,y1,x2,y2,w} | {pts:[[x,y],…],w, c1,c2,w2,despejar,puente})
                                   // puente:true = muelle: sin frenado de agua debajo
     k.addWater({pts:[{x,y}…],cx,cy,slow,fill,ripple})
     k.makeClusters(n,rMin,rMax)   centros de manchas de decoración
     k.scatter(tipo,cantidad,{clusters,clusterChance,minSpawn,gap,filter,…})
                                   // onWater:true = colocar SOLO dentro del agua
     k.addGrass({seed,step,threshold})
     k.nearPath(x,y,margen)        ¿cerca de un camino con despejar:true?
   ====================================================================== */
registerMap({
  id:'rocosa',
  nombre:'Rocosa',
  icono:'⛰️',
  descripcion:'Cañón de piedra con peñascos y cristales. Con obstáculos.',
  semilla:5150,
  mundo:{w:1900,h:1900},
  colisiones:true,
  suelo:{color:'#38342f',tile:false},
  pastoColor:'#6a6252',
  limiteColor:'#d24a35',

  // radio de colisión (px, antes de escalar) de cada decoración nueva
  solidR:{boulder:24,crag:14,spire:11,deadtree:7,crystal:9,rubble:0,drybrush:0},

  /* ---------- Sprites propios de este mapa ---------- */
  estampas(k){
    const shadow=(c,w,h,rx)=>{
      c.fillStyle='rgba(0,0,0,.3)';
      c.beginPath();c.ellipse(w/2,h-4,rx,rx*.24,0,0,Math.PI*2);c.fill();
    };
    // Roca poligonal irregular con luz arriba-izquierda y sombra abajo-derecha.
    const body=(c,rng,cx,cy,rx,ry,n,top,bot)=>{
      const pts=[];
      for(let i=0;i<n;i++){
        const a=(i/n)*Math.PI*2+rng()*.25, r=.8+rng()*.36;
        pts.push({x:cx+Math.cos(a)*rx*r,y:cy+Math.sin(a)*ry*r});
      }
      const g=c.createLinearGradient(cx,cy-ry,cx,cy+ry);
      g.addColorStop(0,top);g.addColorStop(1,bot);
      c.fillStyle=g;c.beginPath();
      pts.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));
      c.closePath();c.fill();
      c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=1.2;c.stroke();
      const facet=(i0,i1,col)=>{
        c.fillStyle=col;c.beginPath();c.moveTo(cx,cy);
        for(let i=i0;i<=i1;i++){const p=pts[i%n];c.lineTo(p.x,p.y);}
        c.closePath();c.fill();
      };
      facet(Math.floor(n*.5),Math.ceil(n*.8),'rgba(255,255,255,.13)');
      facet(0,Math.ceil(n*.22),'rgba(0,0,0,.2)');
      c.strokeStyle='rgba(0,0,0,.28)';c.lineWidth=1;
      for(let i=0;i<2;i++){
        c.beginPath();
        let x=cx+(rng()-.5)*rx*.7,y=cy-ry*.5;
        c.moveTo(x,y);
        for(let j=0;j<3;j++){x+=(rng()-.5)*rx*.5;y+=ry*.4;c.lineTo(x,y);}
        c.stroke();
      }
    };
    const PAL=[['#a8a196','#4d473f'],['#9b8f84','#463d36'],['#b0a08c','#5a4a3a'],['#8f95a0','#3f434b']];

    const boulder=seed=>{
      const rng=k.mulberry32(seed), p=PAL[(rng()*PAL.length)|0];
      return k.makeStamp(72,58,(c,w,h)=>{
        shadow(c,w,h,29);
        body(c,rng,w/2+10,h-15,15,11,8,p[0],p[1]);
        body(c,rng,w/2-3,h-27,26,22,10,p[0],p[1]);
        c.fillStyle='rgba(150,80,45,.16)';
        c.beginPath();c.ellipse(w/2+4,h-14,14,5,0,0,Math.PI*2);c.fill();
      });
    };
    const crag=seed=>{
      const rng=k.mulberry32(seed), p=PAL[(rng()*PAL.length)|0];
      return k.makeStamp(48,36,(c,w,h)=>{
        shadow(c,w,h,17);
        body(c,rng,w/2,h-17,17,13,8+((rng()*3)|0),p[0],p[1]);
      });
    };
    const spire=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(40,94,(c,w,h)=>{
        shadow(c,w,h,15);
        const cx=w/2,by=h-6,lean=(rng()-.5)*9,tx=cx+lean,ty=5+rng()*8;
        const L=[[cx-14,by],[cx-11+rng()*3,by-28],[cx-8+rng()*3,by-56],[tx,ty]];
        const R=[[tx,ty],[cx+7+rng()*3,by-58],[cx+10+rng()*3,by-32],[cx+14,by]];
        const ridgeB=[cx+lean*.3,by];
        const poly=(pts,col)=>{
          c.fillStyle=col;c.beginPath();
          pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));
          c.closePath();c.fill();
        };
        poly([...L,ridgeB],'#8d867b');
        poly([...R,ridgeB],'#4f4a43');
        c.strokeStyle='rgba(0,0,0,.4)';c.lineWidth=1.2;
        c.beginPath();L.concat(R.slice(1)).forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();c.stroke();
        c.strokeStyle='rgba(0,0,0,.2)';c.lineWidth=1;
        for(let i=1;i<=3;i++){
          const y=by-i*19-rng()*4;
          c.beginPath();c.moveTo(cx-11+i*1.5,y);c.lineTo(cx+10-i*1.5,y+(rng()-.5)*4);c.stroke();
        }
        c.fillStyle='rgba(255,255,255,.10)';
        c.beginPath();c.moveTo(tx,ty);c.lineTo(cx-7,by-52);c.lineTo(cx-4,by-20);c.closePath();c.fill();
      });
    };
    const deadtree=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(58,88,(c,w,h)=>{
        shadow(c,w,h,16);
        c.lineCap='round';
        const branch=(x,y,ang,len,wd,d)=>{
          const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;
          c.strokeStyle=d<2?'#382c23':'#4b3b2d';c.lineWidth=wd;
          c.beginPath();c.moveTo(x,y);
          c.quadraticCurveTo((x+x2)/2+(rng()-.5)*7,(y+y2)/2,x2,y2);c.stroke();
          if(d<4){
            branch(x2,y2,ang-.45+(rng()-.5)*.7,len*.7,wd*.66,d+1);
            branch(x2,y2,ang+.45+(rng()-.5)*.7,len*.7,wd*.66,d+1);
          }
        };
        c.fillStyle='#2b2019';c.beginPath();c.ellipse(w/2,h-6,8,3.5,0,0,Math.PI*2);c.fill();
        branch(w/2,h-7,-Math.PI/2+(rng()-.5)*.3,27,7,0);
      });
    };
    const CRY=[
      ['#8fefff','#2aa6d6','#116089','143,239,255'],
      ['#e6b0ff','#9a4fe0','#54238f','200,140,255'],
      ['#ffe09a','#e8952a','#8a4a10','255,200,110'],
    ];
    const crystal=seed=>{
      const rng=k.mulberry32(seed), p=CRY[seed%CRY.length];
      return k.makeStamp(46,52,(c,w,h)=>{
        const g=c.createRadialGradient(w/2,h-12,2,w/2,h-12,26);
        g.addColorStop(0,'rgba('+p[3]+',.38)');g.addColorStop(1,'rgba('+p[3]+',0)');
        c.fillStyle=g;c.beginPath();c.arc(w/2,h-12,26,0,Math.PI*2);c.fill();
        shadow(c,w,h,14);
        const n=3+((rng()*3)|0);
        for(let i=0;i<n;i++){
          const bx=w/2+(rng()-.5)*18,by=h-7-rng()*4,ht=18+rng()*22,wd=5+rng()*4,ln=(rng()-.5)*.45;
          const tip=[bx+ln*ht,by-ht],sh=[bx+ln*ht*.8,by-ht*.78];
          const gr=c.createLinearGradient(bx-wd,0,bx+wd,0);
          gr.addColorStop(0,p[0]);gr.addColorStop(.55,p[1]);gr.addColorStop(1,p[2]);
          c.fillStyle=gr;c.beginPath();
          c.moveTo(bx-wd,by);c.lineTo(sh[0]-wd*.8,sh[1]);c.lineTo(tip[0],tip[1]);
          c.lineTo(sh[0]+wd*.8,sh[1]);c.lineTo(bx+wd,by);c.closePath();c.fill();
          c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.stroke();
          c.fillStyle='rgba(255,255,255,.4)';c.beginPath();
          c.moveTo(bx-wd*.6,by-2);c.lineTo(sh[0]-wd*.5,sh[1]);c.lineTo(tip[0],tip[1]);
          c.lineTo(bx-wd*.1,by-ht*.5);c.closePath();c.fill();
        }
      });
    };
    const drybrush=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(38,26,(c,w,h)=>{
        c.lineCap='round';
        const n=6+((rng()*4)|0);
        for(let i=0;i<n;i++){
          const a=-Math.PI/2+(rng()-.5)*1.8,len=10+rng()*11;
          const x2=w/2+Math.cos(a)*len,y2=h-3+Math.sin(a)*len;
          c.strokeStyle=rng()<.5?'#6d5f4a':'#8a7758';c.lineWidth=1.3;
          c.beginPath();c.moveTo(w/2+(rng()-.5)*6,h-3);
          c.quadraticCurveTo(w/2+Math.cos(a)*len*.4+(rng()-.5)*5,h-3+Math.sin(a)*len*.6,x2,y2);c.stroke();
        }
      });
    };
    const rubble=seed=>{
      const rng=k.mulberry32(seed);
      return k.makeStamp(40,18,(c,w,h)=>{
        const n=4+((rng()*3)|0);
        for(let i=0;i<n;i++){
          body(c,rng,5+i*(w-10)/n+rng()*4,h-6-rng()*3,3+rng()*3.5,2.2+rng()*2,6,'#8a8378','#4d473f');
        }
      });
    };
    return {
      boulder:[boulder(101),boulder(102),boulder(103),boulder(104)],
      crag:[crag(111),crag(112),crag(113),crag(114),crag(115)],
      spire:[spire(121),spire(122),spire(123)],
      deadtree:[deadtree(131),deadtree(132),deadtree(133)],
      crystal:[crystal(141),crystal(142),crystal(143),crystal(144),crystal(145),crystal(146)],
      drybrush:[drybrush(151),drybrush(152),drybrush(153)],
      rubble:[rubble(161),rubble(162),rubble(163)],
    };
  },

  /* ---------- Terreno y colocación de objetos ---------- */
  build(k){
    const W=k.world.w, H=k.world.h;

    // Parches de suelo: óxido, roca oscura, grava clara, motas
    const prng=k.mulberry32(5151);
    k.addPatches(prng,{n:14,rMin:70,rVar:90,shades:['#5a3d2e','#4b3326'],opMin:.14,opVar:.10,pts:9,irr:.5});
    k.addPatches(prng,{n:40,rMin:60,rVar:100,shades:['#2b2825','#48423b'],opMin:.25,opVar:.18,pts:9,irr:.5});
    k.addPatches(prng,{n:45,rMin:20,rVar:35,shades:['#5d574c','#6b6457'],opMin:.15,opVar:.14,pts:8,irr:.6});
    k.addPatches(prng,{n:80,rMin:12,rVar:24,shades:['#3d3934','#544e46'],opMin:.28,opVar:.18,pts:7,irr:.6});
    k.addPatches(prng,{n:60,rMin:5,rVar:9,shades:['#1c1a18'],opMin:.3,opVar:.2,pts:6,irr:.7});

    // Cauce seco (despejado de obstáculos) y un ramal
    k.paths.push(
      {pts:[[110,260],[420,330],[640,560],[760,820],[930,980],[1180,1130],[1330,1400],[1620,1560],[1790,1780]],
       w:88,w2:62,c1:'#4a4238',c2:'#5b5245',despejar:true},
      {pts:[[930,980],[1000,700],[1240,520],[1500,430],[1780,300]],
       w:58,w2:36,c1:'#4a4238',c2:'#5b5245',despejar:true}
    );
    // Grietas finas en el suelo
    const crng=k.mulberry32(5152);
    for(let i=0;i<14;i++){
      let x=crng()*W,y=crng()*H,a=crng()*Math.PI*2;
      const pts=[[x,y]], segs=4+((crng()*3)|0);
      for(let s=0;s<segs;s++){a+=(crng()-.5)*1.1;x+=Math.cos(a)*(50+crng()*50);y+=Math.sin(a)*(50+crng()*50);pts.push([x,y]);}
      k.paths.push({pts,w:4+crng()*3,c1:'#141210',c2:false});
    }

    // Decoración
    const ridges=[
      {x:300,y:1500,r:260},{x:1550,y:350,r:250},{x:1600,y:1250,r:230},{x:420,y:520,r:220},
      {x:1150,y:1650,r:220},{x:1050,y:300,r:200},{x:200,y:1000,r:180},{x:1450,y:800,r:170}
    ];
    const spireZones=[{x:1500,y:1600,r:170},{x:350,y:250,r:150},{x:900,y:1350,r:140}];
    const crystalZones=[{x:250,y:1700,r:100},{x:1700,y:200,r:100},{x:1750,y:1000,r:90},{x:700,y:150,r:90}];
    const clear=(x,y)=>!k.nearPath(x,y,34);

    k.scatter('boulder',34,{clusters:ridges,clusterChance:.75,minSpawn:150,gap:54,filter:clear});
    k.scatter('crag',64,{clusters:ridges,clusterChance:.6,minSpawn:110,gap:34,filter:clear});
    k.scatter('spire',26,{clusters:spireZones,clusterChance:.7,minSpawn:170,gap:42,filter:clear});
    k.scatter('deadtree',22,{minSpawn:150,gap:60,filter:clear});
    k.scatter('crystal',16,{clusters:crystalZones,clusterChance:.85,minSpawn:250,gap:38,filter:clear});
    k.scatter('ruin',6,{minSpawn:260,gap:80,filter:clear});
    k.scatter('drybrush',46,{minSpawn:70,gap:28});
    k.scatter('rubble',80,{clusters:ridges,clusterChance:.5,minSpawn:70,gap:20});
    k.scatter('pebble',180,{minSpawn:55,gap:11});

    // Matas secas, muy escasas
    k.addGrass({seed:611,step:70,threshold:.9});
  }
});
