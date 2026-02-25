let tvWidget = new TradingView.widget({
  autosize:true,
  symbol:"OANDA:XAUUSD",
  interval:"15",
  container_id:"chart",
  theme:"dark",
  locale:"en"
});

async function fetchCandles(tf){
  const res = await fetch(`/api/candles?symbol=XAU/USD&tf=${tf}`);
  const data = await res.json();
  return data;
}

async function runEngine(){
  const tf = document.getElementById("tfSelect").value;
  const candles = await fetchCandles(tf);

  const swings = SMC.detectStructure(candles);
  const bos = SMC.detectBOS(swings);
  const fvg = SMC.detectFVG(candles);

  const hi = candles[candles.length-1].high;
  const lo = candles[candles.length-1].low;
  const price = candles[candles.length-1].close;
  const ote = SMC.detectOTE(hi, lo);

  document.getElementById("sh").innerText = swings.filter(s=>s.type==="SH").slice(-1)[0]?.price || "-";
  document.getElementById("slv").innerText = swings.filter(s=>s.type==="SL").slice(-1)[0]?.price || "-";
  document.getElementById("price").innerText = price.toFixed(2);

  const badge = document.getElementById("signalBadge");
  if(price>=ote.buy.zone[0] && price<=ote.buy.zone[1]){
    badge.innerText="BUY AREA";
    badge.className="signal buy";
    document.getElementById("entry").innerText = `${ote.buy.zone[0].toFixed(2)} - ${ote.buy.zone[1].toFixed(2)}`;
    document.getElementById("slZone").innerText = lo.toFixed(2);
    document.getElementById("tpZone").innerText = hi.toFixed(2);
    document.getElementById("bias").innerText = "Bullish";
    document.getElementById("rr").innerText = ((hi-price)/(price-lo)).toFixed(2);
  } else if(price>=ote.sell.zone[0] && price<=ote.sell.zone[1]){
    badge.innerText="SELL AREA";
    badge.className="signal sell";
    document.getElementById("entry").innerText = `${ote.sell.zone[0].toFixed(2)} - ${ote.sell.zone[1].toFixed(2)}`;
    document.getElementById("slZone").innerText = hi.toFixed(2);
    document.getElementById("tpZone").innerText = lo.toFixed(2);
    document.getElementById("bias").innerText = "Bearish";
    document.getElementById("rr").innerText = ((price-lo)/(hi-price)).toFixed(2);
  } else {
    badge.innerText="WAITING";
    badge.className="signal";
  }

  setTimeout(runEngine,5000);
}