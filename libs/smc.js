const SMC = {
  detectStructure(candles){
    let swings=[];
    for(let i=2;i<candles.length-2;i++){
      let c=candles;
      if(c[i].high>c[i-1].high && c[i].high>c[i-2].high && c[i].high>c[i+1].high && c[i].high>c[i+2].high){
        swings.push({type:"SH", price:c[i].high, index:i});
      }
      if(c[i].low<c[i-1].low && c[i].low<c[i-2].low && c[i].low<c[i+1].low && c[i].low<c[i+2].low){
        swings.push({type:"SL", price:c[i].low, index:i});
      }
    }
    return swings;
  },

  detectBOS(swings){
    if(swings.length<3) return "No BOS";
    let last=swings[swings.length-1];
    let prev=swings[swings.length-2];
    if(last.type==="SH" && last.price>prev.price) return "BOS UP";
    if(last.type==="SL" && last.price<prev.price) return "BOS DOWN";
    return "Ranging";
  },

  detectFVG(candles){
    let fvg=[];
    for(let i=2;i<candles.length;i++){
      let c0=candles[i], c1=candles[i-1], c2=candles[i-2];
      if(c2.low>c0.high) fvg.push({type:"BULL", gap:[c0.high,c2.low], index:i});
      if(c2.high<c0.low) fvg.push({type:"BEAR", gap:[c2.high,c0.low], index:i});
    }
    return fvg;
  },

  detectOTE(high, low){
    let range=high-low;
    return {
      buy:{zone:[low+range*0.618, low+range*0.79]},
      sell:{zone:[high-range*0.79, high-range*0.618]}
    };
  }
};