// api/candles.js
export default async function handler(req,res){
  const symbol = req.query.symbol || "XAU/USD";
  const interval = req.query.tf || "15min";

  const apiKey = process.env.TWELVE_DATA_KEY; // ambil dari Vercel env

  if(!apiKey){
    res.status(500).json({error:"Twelve Data API key not set"});
    return;
  }

  try{
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=500&apikey=${apiKey}`);
    const data = await response.json();

    if(data.values){
      const candles = data.values.map(d=>({
        time:new Date(d.datetime).getTime(),
        open:parseFloat(d.open),
        high:parseFloat(d.high),
        low:parseFloat(d.low),
        close:parseFloat(d.close)
      })).reverse();
      res.status(200).json(candles);
    } else {
      res.status(400).json({error:"No data", details:data});
    }
  } catch(err){
    res.status(500).json({error:err.toString()});
  }
}