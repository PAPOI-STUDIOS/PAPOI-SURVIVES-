/* ======================================================================
   MAPA PRINCIPAL  (el mapa original de PAPOI, movido a su propio archivo)
   ----------------------------------------------------------------------
   Mismo terreno de siempre (mismas semillas → mismo diseño), pero:
     · colisiones: false  → Papoi atraviesa árboles, rocas, cajas y ruinas.
       Ponlo en true para volver a tener obstáculos sólidos.
   El lago sigue frenando a Papoi (no es una colisión, es agua). Para quitar
   ese frenado pon  slow: 1  en addWater().

   FORMATO DE UN MAPA (para crear los siguientes, mira mapa_rocoso.js):
     registerMap({
       id, nombre, icono, descripcion,
       semilla, mundo:{w,h},
       colisiones,                      // true/false
       suelo:{color, tile},             // tile:true usa la textura de pasto
       pastoColor, limiteColor,         // opcionales
       solidR:{tipo:radio}, sway:[tipos], // opcionales (decoración nueva)
       estampas(k){ return {tipo:[stamp,…]} }, // opcional: sprites propios
       build(k){ … }                    // rellena parches/caminos/agua/decoración
     });
   ====================================================================== */
registerMap({
  id:'principal',
  nombre:'Principal',
  icono:'🌲',
  descripcion:'El claro del bosque con su lago. Sin obstáculos.',
  semilla:4242,
  mundo:{w:1900,h:1900},
  colisiones:false,
  suelo:{color:'#294128',tile:true},
  pastoColor:'#3f5f38',
  limiteColor:'#e0483f',

  build(k){
    const W=k.world.w, H=k.world.h;

    // ---- Parches de color sobre el pasto (3 capas) ----
    const prng=k.mulberry32(777);
    k.addPatches(prng,{n:38,rMin:55,rVar:90,shades:['#2f4a2a','#3f5c37'],opMin:.22,opVar:.16,pts:9,irr:.5});
    k.addPatches(prng,{n:70,rMin:14,rVar:26,shades:['#375c33','#4a6b3f'],opMin:.28,opVar:.18,pts:7,irr:.6});
    k.addPatches(prng,{n:55,rMin:5,rVar:9,shades:['#22371f'],opMin:.3,opVar:.2,pts:6,irr:.7});

    // ---- Caminos de tierra ----
    k.paths.push(
      {x1:120,y1:H*.5,x2:W-120,y2:H*.5,w:70},
      {x1:W*.5,y1:120,x2:W*.5,y2:H-120,w:60}
    );

    // ---- Lago de contorno irregular (nunca invade el camino vertical) ----
    const LAKE={x:700,y:650,rx:330,ry:190};
    const LAKE_PATH_X=W*.5, LAKE_PATH_HALFW=30+34;
    const lrng=k.mulberry32(909);
    const N=26, noiseOff=[];
    for(let i=0;i<N;i++)noiseOff.push(lrng());
    const pts=[];
    for(let i=0;i<N;i++){
      const a=(i/N)*Math.PI*2;
      const mult=1+Math.sin(a*3+1.3)*0.16+Math.sin(a*5+3.1)*0.09+(noiseOff[i]-0.5)*0.16;
      let px=LAKE.x+Math.cos(a)*LAKE.rx*mult;
      const py=LAKE.y+Math.sin(a)*LAKE.ry*mult;
      if(px>LAKE_PATH_X-LAKE_PATH_HALFW) px=LAKE_PATH_X-LAKE_PATH_HALFW;
      pts.push({x:px,y:py});
    }
    k.addWater({pts,cx:LAKE.x,cy:LAKE.y,slow:.45,fill:'#173c55',
      ripple:{rx:120,ry:70,dx:70,dy:40,n:3,color:'rgba(255,255,255,.10)'}});

    // ---- Decoración (árboles, arbustos, rocas, cajas, ruinas…) ----
    const forest=k.makeClusters(9,150,270);
    const bushes=k.makeClusters(12,90,180);
    k.scatter('tree',96,{clusters:forest,clusterChance:.82,minSpawn:130,gap:29});
    k.scatter('bush',80,{clusters:bushes,clusterChance:.7,minSpawn:80,gap:24});
    k.scatter('rock',52,{minSpawn:90,gap:26});
    k.scatter('crate',14,{minSpawn:150,gap:30});
    k.scatter('ruin',10,{minSpawn:180,gap:32});
    k.scatter('stump',20,{clusters:forest,clusterChance:.55,minSpawn:110,gap:22});
    k.scatter('log',9,{minSpawn:120,gap:36});
    k.scatter('flower',130,{clusters:bushes,clusterChance:.4,minSpawn:60,gap:13});
    k.scatter('pebble',150,{minSpawn:55,gap:11});

    // ---- Matas de césped ----
    k.addGrass({seed:303,step:70,threshold:.72});
  }
});
