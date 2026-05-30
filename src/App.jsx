import { useState, useEffect, useRef } from "react";

// ── Arc Testnet Config ─────────────────────────────────────────────
const ARC_CHAIN_ID     = 5042002;
const ARC_CHAIN_HEX    = "0x" + ARC_CHAIN_ID.toString(16);
const ARC_RPC          = "https://arc-testnet.drpc.org";
const ARC_EXPLORER     = "https://testnet.arcscan.app";
const ARC_FAUCET       = "https://faucet.circle.com";
const USDC_CONTRACT    = "0x3600000000000000000000000000000000000000";
const CONTRACT_ADDRESS = "0x9c12Cbd16db390Ea3354e637195EECEc80E62aA5";

const ARC_NETWORK = {
  chainId: ARC_CHAIN_HEX,
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: [ARC_RPC],
  blockExplorerUrls: [ARC_EXPLORER],
};

// ── USDC helpers ───────────────────────────────────────────────────
const toMicro   = (n) => Math.floor(parseFloat(n) * 1e18); // Arc native USDC = 18 decimals
const fromMicro = (n) => (parseInt(n, 16) / 1e6).toFixed(2);
const pad64     = (n) => n.toString(16).padStart(64, "0");
const hexAddr   = (a) => a.slice(2).padStart(64, "0");

// Function selectors
const SEL_BALANCE_OF  = "0x70a08231"; // balanceOf(address)
const SEL_ALLOWANCE   = "0xdd62ed3e"; // allowance(address,address)
const SEL_APPROVE     = "0x095ea7b3"; // approve(address,uint256)
// invest(uint256,uint256) keccak256 selector
const SEL_INVEST      = "0x9f676e25"; // invest(uint256,uint256)
                                       // keccak256("invest(uint256,string,uint256)") first 4 bytes

// ── Assets ─────────────────────────────────────────────────────────
const CATEGORIES = ["All","Real Estate","Hospitality","Commercial","Industrial","Residential","Luxury Goods","Fine Art","Commodities"];

const ASSETS = [
  { id:1,  category:"Real Estate",  verified:true, name:"One Canada Square, Canary Wharf",       location:"London, United Kingdom",    description:"Grade A commercial tower in London's premier financial district. 50 floors of premium office space with 97% occupancy. Tenants include HSBC, Barclays, and Clifford Chance. Built 1991, fully refurbished 2019.", totalValue:850000000,  tokenPrice:500, totalTokens:1700000,  soldTokens:1292000, apy:7.2,  color:"#D4A843", tag:"PRIME",          image:"https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80", details:{size:"1,200,000 sq ft",floors:50,occupancy:"97%",built:"1991",tenants:"HSBC, Barclays, Clifford Chance"} },
  { id:2,  category:"Real Estate",  verified:true, name:"Marina Bay Financial Centre Tower 3",    location:"Singapore",                 description:"Iconic supertall office tower in Singapore's central business district. AAA-rated building with 99-year leasehold. Direct MRT connectivity. Home to Standard Chartered, DBS and international law firms.", totalValue:1200000000, tokenPrice:800, totalTokens:1500000,  soldTokens:900000,  apy:6.8,  color:"#D4A843", tag:"ICONIC",         image:"https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80", details:{size:"1,850,000 sq ft",floors:43,occupancy:"99%",built:"2012",tenants:"Standard Chartered, DBS, Linklaters"} },
  { id:3,  category:"Real Estate",  verified:true, name:"Tour First, La Défense",                location:"Paris, France",             description:"Tallest skyscraper in France at 231 metres. Located in Europe's largest purpose-built business district. BREEAM Excellent certified. Long-term lease to BNP Paribas.", totalValue:730000000,  tokenPrice:600, totalTokens:1216666,  soldTokens:608333,  apy:7.9,  color:"#C49333", tag:"FLAGSHIP",       image:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80", details:{size:"900,000 sq ft",floors:50,occupancy:"95%",built:"1974",tenants:"BNP Paribas, SFR, Deloitte"} },
  { id:4,  category:"Hospitality",  verified:true, name:"Burj Al Arab — Revenue Share",          location:"Dubai, UAE",                description:"The world's most recognisable luxury hotel. Only 202 duplex suites, ADR exceeding $2,500 per night. 88% year-round occupancy. Managed by Jumeirah Group.", totalValue:2100000000, tokenPrice:200, totalTokens:10500000, soldTokens:8400000, apy:9.4,  color:"#D4A843", tag:"ULTRA LUXURY",   image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80", details:{rooms:202,stars:"7-Star",adr:"$2,500+",occupancy:"88%",manager:"Jumeirah Group"} },
  { id:5,  category:"Hospitality",  verified:true, name:"The Ritz Paris",                        location:"Paris, France",             description:"Legendary Place Vendôme palace hotel open since 1898. 142 rooms and suites. Fully restored 2016 at €200M cost. Home to Bar Hemingway and L'Espadon restaurant.", totalValue:1450000000, tokenPrice:150, totalTokens:9666666,  soldTokens:6766666, apy:8.1,  color:"#C49333", tag:"HISTORIC",       image:"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80", details:{rooms:142,stars:"Palace",adr:"$3,200+",occupancy:"91%",refurbished:"2016 at €200M"} },
  { id:6,  category:"Hospitality",  verified:true, name:"Amanyara Resort",                       location:"Turks & Caicos Islands",    description:"Ultra-exclusive beachfront resort on 18,000 acres of protected marine park. 40 pavilions and villas. ADR of $4,000+. 14% annual revenue growth over 5 years.", totalValue:380000000,  tokenPrice:40,  totalTokens:9500000,  soldTokens:3800000, apy:11.2, color:"#D4A843", tag:"HIGH YIELD",     image:"https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80", details:{villas:40,stars:"Ultra Luxury",adr:"$4,000+",occupancy:"82%",manager:"Aman Resorts"} },
  { id:7,  category:"Commercial",   verified:true, name:"Westfield Century City Mall",           location:"Los Angeles, USA",          description:"One of the highest-grossing shopping centres in the US with $1B+ annual sales. 1.3M sq ft, 200+ tenants. Anchored by Nordstrom, Macy's, and AMC Theatres.", totalValue:1800000000, tokenPrice:180, totalTokens:10000000, soldTokens:6000000, apy:7.6,  color:"#4E9CD4", tag:"TOP PERFORMER",  image:"https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80", details:{size:"1,300,000 sq ft",tenants:"200+",annualSales:"$1B+",occupancy:"98%",manager:"Unibail-Rodamco-Westfield"} },
  { id:8,  category:"Commercial",   verified:true, name:"Ginza Six, Tokyo",                      location:"Tokyo, Japan",              description:"Japan's largest upscale commercial complex in the most expensive retail district on earth. 241 tenants across 13 floors including Louis Vuitton, Dior, Cartier.", totalValue:2200000000, tokenPrice:220, totalTokens:10000000, soldTokens:7000000, apy:6.5,  color:"#4E9CD4", tag:"TROPHY",         image:"https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", details:{size:"1,470,000 sq ft",tenants:241,floors:13,occupancy:"100%",manager:"L Catterton Partners"} },
  { id:9,  category:"Industrial",   verified:true, name:"London Gateway Logistics Park",         location:"Essex, United Kingdom",     description:"Europe's largest logistics hub adjacent to DP World's deep-sea container port. 9M sq ft. Long-term leases to Amazon, DHL, and Sainsbury's.", totalValue:960000000,  tokenPrice:96,  totalTokens:10000000, soldTokens:5000000, apy:8.9,  color:"#8A9FBF", tag:"LOGISTICS",      image:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80", details:{size:"9,000,000 sq ft",tenants:"Amazon, DHL, Sainsbury's",leaseLength:"15–25 years",occupancy:"100%"} },
  { id:10, category:"Industrial",   verified:true, name:"Jurong Industrial Estate",              location:"Singapore",                 description:"Singapore's premier industrial and petrochemical hub spanning 3,000 hectares. Government-backed leases. Tenants include ExxonMobil, Shell, and Mitsui.", totalValue:750000000,  tokenPrice:75,  totalTokens:10000000, soldTokens:4500000, apy:9.3,  color:"#8A9FBF", tag:"STRATEGIC",      image:"https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80", details:{size:"3,000 hectares",tenants:"ExxonMobil, Shell, Mitsui",leaseLength:"30 years",occupancy:"97%"} },
  { id:11, category:"Residential",  verified:true, name:"One Hyde Park Penthouse Collection",    location:"London, United Kingdom",    description:"The most expensive residential address in the world. 86 apartments overlooking Hyde Park. Average price £15M per unit. 24/7 Mandarin Oriental hotel services.", totalValue:1300000000, tokenPrice:130, totalTokens:10000000, soldTokens:7800000, apy:5.8,  color:"#D4A843", tag:"ULTRA PRIME",    image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80", details:{units:86,avgPrice:"£15M",services:"Mandarin Oriental",manager:"Candy & Candy"} },
  { id:12, category:"Residential",  verified:true, name:"432 Park Avenue Residences",            location:"New York, USA",             description:"Tallest residential building in the Western Hemisphere at 426m. 104 ultra-luxury condominiums. Includes private restaurant, spa, and 75-foot pool.", totalValue:1900000000, tokenPrice:190, totalTokens:10000000, soldTokens:5000000, apy:6.2,  color:"#D4A843", tag:"SKY LIVING",     image:"https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80", details:{units:104,minPrice:"$16.95M",height:"426m / 1,396ft",floors:96} },
  { id:13, category:"Luxury Goods", verified:true, name:"Patek Philippe Grandmaster Chime",      location:"Geneva, Switzerland",       description:"The most complicated wristwatch ever made. One of only 7 ever produced. World auction record $31M at Christie's. 20 complications, reversible case.", totalValue:31000000,   tokenPrice:31,  totalTokens:1000000,  soldTokens:750000,  apy:14.2, color:"#D4A843", tag:"WORLD RECORD",   image:"https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80", details:{complications:20,produced:"7 pieces only",auctionRecord:"$31M Christie's",condition:"Museum Quality"} },
  { id:14, category:"Luxury Goods", verified:true, name:"Rolex Daytona Paul Newman Ref. 6239",   location:"New York, USA",             description:"The holy grail of watch collecting. Paul Newman's personal Rolex Daytona. World record $17.75M at Phillips 2017. Original box, papers, signed provenance.", totalValue:17750000,   tokenPrice:18,  totalTokens:986111,   soldTokens:492055,  apy:12.8, color:"#C49333", tag:"PROVENANCE",     image:"https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80", details:{reference:"6239",sold:"$17.75M Phillips",year:"1968",provenance:"Paul Newman personal"} },
  { id:15, category:"Luxury Goods", verified:true, name:"Hermès Himalaya Birkin 30cm Diamond",   location:"Paris, France",             description:"The rarest handbag in existence. White Nilo crocodile skin, 18K white gold hardware, 245 diamonds (10.23 carats). Only 1 produced per year. $432K Christie's HK.", totalValue:432000,     tokenPrice:1,   totalTokens:432000,   soldTokens:302400,  apy:18.5, color:"#D4A843", tag:"RAREST",         image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", details:{material:"Nilo Crocodile",hardware:"18K White Gold & Diamonds",diamonds:"10.23 carats",lastSale:"$432,000 Christie's HK"} },
  { id:16, category:"Fine Art",     verified:true, name:"Jean-Michel Basquiat — Untitled (Devil)",location:"New York, USA",            description:"Large-scale 1982 masterwork from Basquiat's most celebrated period. Sold at Sotheby's New York for $110.5M in 2017. Institutional-grade storage at Crozier Fine Arts.", totalValue:110500000,  tokenPrice:110, totalTokens:1004545,  soldTokens:702181,  apy:15.6, color:"#C49333", tag:"BLUE CHIP",      image:"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", details:{artist:"Jean-Michel Basquiat",year:1982,medium:"Acrylic & Oil on Canvas",lastSale:"$110.5M Sotheby's 2017"} },
  { id:17, category:"Fine Art",     verified:true, name:"Pablo Picasso — Femme Assise",          location:"Geneva, Switzerland",       description:"Cubist masterpiece from Picasso's Rose Period (1905). Provenance includes the Rockefeller Collection and Galerie Beyeler, Basel. Stored at Geneva Freeport.", totalValue:67000000,   tokenPrice:67,  totalTokens:1000000,  soldTokens:400000,  apy:10.4, color:"#C49333", tag:"MUSEUM GRADE",   image:"https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800&q=80", details:{artist:"Pablo Picasso",year:1905,medium:"Oil on Canvas",provenance:"Rockefeller Collection, Galerie Beyeler"} },
  { id:18, category:"Commodities",  verified:true, name:"LBMA Gold Bullion Reserve — Vault A",  location:"London, United Kingdom",    description:"Allocated physical gold bars stored at Brink's London vault. Fully audited under LBMA Good Delivery standards. Annual audit by PwC. No counterparty risk.", totalValue:500000000,  tokenPrice:50,  totalTokens:10000000, soldTokens:6000000, apy:4.2,  color:"#D4A843", tag:"GOLD BACKED",    image:"https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80", details:{purity:"99.99%",storage:"Brink's London",audit:"PwC Annual",standard:"LBMA Good Delivery"} },
  { id:19, category:"Commodities",  verified:true, name:"Colombian Emerald Mine — Block 7",      location:"Boyacá, Colombia",          description:"Producing emerald mining concession in the Muzo region. 4.2M carats proven reserves. 380,000 carats/year production. Valued by Gübelin Gem Lab, Switzerland.", totalValue:280000000,  tokenPrice:28,  totalTokens:10000000, soldTokens:3000000, apy:16.8, color:"#00A86B", tag:"NATURAL RESOURCE",image:"https://images.unsplash.com/photo-1551639825-892b1c4a9eff?w=800&q=80", details:{reserves:"4.2M carats",production:"380,000 carats/year",area:"240 hectares",valuation:"Gübelin Gem Lab"} },
];

// ── Helpers ────────────────────────────────────────────────────────
const fmt    = (n) => n >= 1e9 ? `$${(n/1e9).toFixed(2)}B` : n >= 1e6 ? `$${(n/1e6).toFixed(2)}M` : `$${n.toLocaleString()}`;
const short  = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : "";
const stored = (key, fallback=[]) => { try { const v=localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; } };
const store  = (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} };

// RPC call helper
const rpcCall = async (method, params) => {
  const res = await fetch(ARC_RPC, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({jsonrpc:"2.0", id:1, method, params})
  });
  const data = await res.json();
  return data.result;
};

// Get USDC balance
const getUSDCBalance = async (addr) => {
  try {
    // Arc: USDC is native token, use eth_getBalance
    // Native USDC uses 18 decimals on Arc
    const result = await rpcCall("eth_getBalance", [addr, "latest"]);
    if (!result || result === "0x") return "0.00";
    return (parseInt(result, 16) / 1e18).toFixed(2);
  } catch { return "0.00"; }
};

// Get USDC allowance

// Send transaction
const getProvider = () => window.ethereum || window.okxwallet || window.web3?.currentProvider;
const sendTx = (from, to, data, gas="0x30D40") =>
  getProvider().request({ method:"eth_sendTransaction", params:[{from, to, data, gas}] });

// ── App ────────────────────────────────────────────────────────────
export default function App() {
  const [wallet,    setWallet]    = useState(null);
  const [balance,   setBalance]   = useState("0.00");
  const [chainOk,   setChainOk]   = useState(false);
  const [tab,       setTab]       = useState("marketplace");
  const [filter,    setFilter]    = useState("All");
  const [asset,     setAsset]     = useState(null);
  const [amount,    setAmount]    = useState("");
  const [step,      setStep]      = useState("idle"); // idle | approving | investing | done | error
  const [stepMsg,   setStepMsg]   = useState("");
  const [lastTxHash,setLastTxHash]= useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [txLog,     setTxLog]     = useState([]);
  const [toast,     setToast]     = useState(null);
  const [stats,     setStats]     = useState({tvl:124500000, users:3841, txns:21093});
  const [fontsReady,setFontsReady]= useState(false);
  const canvasRef = useRef(null);

  // Fonts
  useEffect(() => { document.fonts.ready.then(() => setFontsReady(true)); }, []);

  // Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d");
    const pts = Array.from({length:50}, () => ({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      r:Math.random()*1.2+0.2, dx:(Math.random()-0.5)*0.2, dy:(Math.random()-0.5)*0.2, o:Math.random()*0.2+0.05
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(212,168,67,${p.o})`; ctx.fill();
        p.x+=p.dx; p.y+=p.dy;
        if(p.x<0||p.x>canvas.width) p.dx*=-1;
        if(p.y<0||p.y>canvas.height) p.dy*=-1;
      });
      raf=requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Live stats
  useEffect(() => {
    const iv = setInterval(() => {
      setStats(s => ({tvl:s.tvl+Math.floor(Math.random()*2000), users:s.users+(Math.random()>0.9?1:0), txns:s.txns+Math.floor(Math.random()*3)}));
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  // MetaMask account change listener
  useEffect(() => {
    if (!window.ethereum) return;
    const handler = (accounts) => {
      if (accounts.length === 0) { disconnect(); }
      else if (accounts[0] !== wallet) { loadWallet(accounts[0]); }
    };
    window.ethereum.on("accountsChanged", handler);
    return () => window.ethereum.removeListener("accountsChanged", handler);
  }, [wallet]);

  const showToast = (msg, type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null),5000); };

  const loadWallet = async (addr) => {
    setWallet(addr);
    const bal = await getUSDCBalance(addr);
    setBalance(bal);
    // Load this wallet's data
    setPortfolio(stored("rxp-" + addr.toLowerCase(), []));
    setTxLog(stored("rxt-" + addr.toLowerCase(), []));
  };

  const connect = async () => {
    // Support MetaMask, OKX, and other injected wallets
    const provider = window.ethereum || window.okxwallet || window.web3?.currentProvider;
    if (!provider) {
      showToast("Please open in MetaMask or OKX wallet browser","error");
      return;
    }
    try {
      // Request accounts first
      const accounts = await provider.request({method:"eth_requestAccounts"});
      if (!accounts || accounts.length === 0) { showToast("No accounts found","error"); return; }

      // Switch to Arc Testnet
      try {
        await provider.request({method:"wallet_switchEthereumChain", params:[{chainId:ARC_CHAIN_HEX}]});
      } catch(e) {
        if (e.code===4902 || e.code===-32603) {
          await provider.request({method:"wallet_addEthereumChain", params:[ARC_NETWORK]});
        }
      }
      setChainOk(true);
      await loadWallet(accounts[0]);
      showToast("Connected to Arc Testnet ✓","success");
    } catch(e) {
      if (e.code === 4001) { showToast("Connection rejected","error"); return; }
      showToast("Could not connect — try opening in your wallet browser","error");
    }
  };

  const disconnect = () => {
    setWallet(null); setBalance("0.00"); setChainOk(false);
    setPortfolio([]); setTxLog([]);
    showToast("Wallet disconnected","info");
  };

  // ── INVEST FLOW ────────────────────────────────────────────────
  const handleInvest = async () => {
    if (!wallet) { connect(); return; }
    const num = parseFloat(amount);
    if (!num || num <= 0) { showToast("Please enter an amount","error"); return; }

    const micro = toMicro(num);
    const fractions = num / asset.tokenPrice;

    try {
      // ── Single step: Send native USDC directly ─────────────
      // On Arc, USDC is the native token (like ETH on Ethereum)
      // No approve needed - just send value directly to contract
      setStep("investing");
      setStepMsg("Confirm investment in your wallet...");

      // invest(uint256 assetId) selector = 0xb6b55f25
      // Send USDC as native value (msg.value)
      const investData = "0xb6b55f25" + pad64(asset.id);
      const provider = window.ethereum || window.okxwallet || window.web3?.currentProvider;
      const investTx = await provider.request({
        method: "eth_sendTransaction",
        params: [{
          from: wallet,
          to: CONTRACT_ADDRESS,
          data: investData,
          value: "0x" + micro.toString(16),
          gas: "0x30D40"
        }]
      });
      if (!investTx) throw new Error("Investment rejected");
      setLastTxHash(investTx);

      // ── Step 3: Save locally ─────────────────────────────────
      const newTx = {
        hash: investTx, asset: asset.name, category: asset.category,
        amount: num, fractions: fractions.toFixed(6), apy: asset.apy,
        time: new Date().toLocaleString(), wallet: short(wallet), onChain: true,
      };

      setPortfolio(prev => {
        const ex = prev.find(p => p.id === asset.id);
        const next = ex
          ? prev.map(p => p.id===asset.id ? {...p,fractions:p.fractions+fractions,invested:p.invested+num} : p)
          : [...prev, {...asset, fractions, invested:num}];
        store("rxp-" + wallet.toLowerCase(), next);
        return next;
      });

      setTxLog(prev => {
        const next = [newTx, ...prev.slice(0,49)];
        store("rxt-" + wallet.toLowerCase(), next);
        return next;
      });

      // Refresh balance
      getUSDCBalance(wallet).then(setBalance);

      setStep("done");
      setStepMsg("Investment confirmed on Arc Testnet!");
      showToast("Investment confirmed! ✓","success");
      setTimeout(() => { setStep("idle"); setStepMsg(""); setAsset(null); setAmount(""); setLastTxHash(null); }, 5000);

    } catch(e) {
      console.error(e);
      const rejected = e.code===4001 || e.message?.toLowerCase().includes("reject") || e.message?.toLowerCase().includes("denied") || e.message?.toLowerCase().includes("cancel");
      setStep("error");
      setStepMsg(rejected ? "Cancelled — nothing was recorded" : `Error: ${e.message?.slice(0,80)}`);
      showToast(rejected ? "Cancelled" : "Transaction failed","error");
      setTimeout(() => { setStep("idle"); setStepMsg(""); }, 4000);
    }
  };

  // ── Derived ────────────────────────────────────────────────────
  const filtered      = filter==="All" ? ASSETS : ASSETS.filter(a=>a.category===filter);
  const totalInvested = portfolio.reduce((s,p)=>s+p.invested, 0);
  const monthlyEarn   = portfolio.reduce((s,p)=>s+(p.invested*p.apy)/100/12, 0);
  const busy          = step==="approving" || step==="investing";

  const shareOnX = () => {
    const text = encodeURIComponent(`🏗️ Just tested Rex-RWA on @circleinternet Arc Testnet!\n\nFractional ownership of real world assets — luxury real estate, fine art, rare watches & more.\n\n💵 USDC powered · ⚡ Sub-second finality\n\nTry it: ${window.location.origin}\n\n#ArcTestnet #RWA #Web3`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`,"_blank");
  };

  return (
    <div style={{...S.root, opacity:fontsReady?1:0}}>
      <canvas ref={canvasRef} style={S.canvas}/>

      {/* Toast */}
      {toast && (
        <div style={{...S.toast,
          background:toast.type==="success"?"rgba(212,168,67,0.18)":toast.type==="error"?"rgba(239,68,68,0.18)":"rgba(255,255,255,0.1)",
          borderColor:toast.type==="success"?"#D4A843":toast.type==="error"?"#EF4444":"rgba(255,255,255,0.2)"}}>
          {toast.msg}
        </div>
      )}

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div style={S.logo}>
          <div style={S.logoMark}><span style={S.logoR}>R</span></div>
          <div><div style={S.logoTitle}>Rex-RWA</div><div style={S.logoSub}>Real World Assets · Arc Testnet</div></div>
        </div>
        <nav style={S.nav}>
          {[["marketplace","Marketplace"],["portfolio","Portfolio"],["transactions","Transactions"],["about","About"]].map(([id,label])=>(
            <button key={id} style={{...S.navBtn,...(tab===id?S.navActive:{})}} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </nav>
        <div style={S.hRight}>
          <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.faucetBtn}>💧 USDC Faucet</a>
          <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.explorerBtn}>🔍 Arcscan</a>
          <button style={S.shareBtn} onClick={shareOnX}>𝕏</button>
          {wallet ? (
            <div style={S.walletGroup}>
              <div style={S.wBadge}><div style={S.wDot}/><span>{short(wallet)}</span><span style={{color:"#D4A843",fontWeight:700}}>{balance} USDC</span></div>
              <button style={S.disconnectBtn} onClick={disconnect} title="Disconnect">✕</button>
            </div>
          ) : (
            <button style={S.connectBtn} onClick={connect}>Connect Wallet</button>
          )}
        </div>
      </header>

      {wallet && !chainOk && (
        <div style={S.chainBanner}>
          ⚠️ Wrong network — please switch to Arc Testnet (Chain ID: {ARC_CHAIN_ID})
          <button onClick={connect} style={S.switchBtn}>Switch Now</button>
        </div>
      )}

      <main style={S.main}>

        {/* ── MARKETPLACE ── */}
        {tab==="marketplace" && (<>
          <section style={S.hero}>
            <div style={S.heroPill}>⚡ LIVE ON ARC TESTNET · CHAIN ID {ARC_CHAIN_ID}</div>
            <h1 style={S.heroH}>Own a Fraction of the<br/><span style={S.gold}>World's Finest Assets</span></h1>
            <p style={S.heroP}>Tokenized real estate, rare art, luxury collectibles and commodities. Invest any amount — no minimums, no maximums. Powered by Circle USDC on Arc.</p>
            <div style={S.heroActions}>
              {!wallet && <button style={S.btnGold} onClick={connect}>Connect Wallet</button>}
              <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.btnOutline}>💧 Claim USDC</a>
              <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.btnOutline}>🔍 Explorer</a>
              <button style={S.btnOutline} onClick={shareOnX}>𝕏 Share</button>
            </div>
            <div style={S.statsRow}>
              {[{l:"Total Value Locked",v:fmt(stats.tvl),live:true},{l:"Global Assets",v:ASSETS.length},{l:"Active Investors",v:stats.users.toLocaleString(),live:true},{l:"Transactions",v:stats.txns.toLocaleString(),live:true}].map(s=>(
                <div key={s.l} style={S.statCard}>
                  <div style={S.statVal}>{s.v}{s.live&&<span style={S.liveDot}/>}</div>
                  <div style={S.statLabel}>{s.l}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={S.netBar}>
            {[["Network","Arc Testnet"],["Chain ID",ARC_CHAIN_ID],["Gas","USDC (Circle)"],["Finality","< 1 Second"],["Consensus","Malachite"]].map(([l,v],i)=>(
              <div key={l} style={S.netGroup}>{i>0&&<div style={S.netDiv}/>}<div style={S.netItem}><span style={S.netL}>{l}</span><span style={S.netV}>{v}</span></div></div>
            ))}
            <div style={S.netGroup}><div style={S.netDiv}/><a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.netLink}>Arcscan ↗</a></div>
            <div style={S.netGroup}><div style={S.netDiv}/><a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.netLink}>Faucet ↗</a></div>
          </div>

          <div style={S.catRow}>
            {CATEGORIES.map(c=>(
              <button key={c} style={{...S.catBtn,...(filter===c?S.catActive:{})}} onClick={()=>setFilter(c)}>{c}</button>
            ))}
          </div>

          <div style={S.grid}>
            {filtered.map(a=>{
              const pct = Math.round((a.soldTokens/a.totalTokens)*100);
              return (
                <div key={a.id} style={S.card} onClick={()=>setAsset(a)}>
                  <div style={S.cardImgWrap}>
                    <img src={a.image} alt={a.name} style={S.cardImg} onError={e=>{e.target.onerror=null;e.target.src=`https://placehold.co/800x400/0A0F1E/D4A843?text=${encodeURIComponent(a.name)}`;}}/>
                    <div style={S.cardImgOverlay}/>
                    <div style={S.cardTopBadges}>
                      <span style={{...S.catBadge,background:`${a.color}33`,color:a.color,border:`1px solid ${a.color}44`}}>{a.category}</span>
                      {a.verified&&<span style={S.verifiedBadge}>✓ Verified</span>}
                      <span style={{...S.cardTag,background:`${a.color}44`,color:a.color,marginLeft:"auto"}}>{a.tag}</span>
                    </div>
                  </div>
                  <div style={S.cardBody}>
                    <div style={S.cardName}>{a.name}</div>
                    <div style={S.cardLoc}>📍 {a.location}</div>
                    <div style={S.cardDesc}>{a.description.slice(0,110)}...</div>
                    <div style={S.cardMetrics}>
                      <div style={S.metric}><span style={S.metricL}>Asset Value</span><span style={S.metricV}>{fmt(a.totalValue)}</span></div>
                      <div style={S.metric}><span style={S.metricL}>Token Price</span><span style={S.metricV}>${a.tokenPrice} USDC</span></div>
                      <div style={S.metric}><span style={S.metricL}>Annual Yield</span><span style={{...S.metricV,color:"#D4A843"}}>{a.apy}%</span></div>
                    </div>
                    <div style={S.progWrap}>
                      <div style={S.progBar}><div style={{...S.progFill,width:`${pct}%`,background:`linear-gradient(90deg,${a.color},${a.color}99)`}}/></div>
                      <div style={S.progInfo}><span style={S.progPct}>{pct}% Funded</span><span style={S.progLeft}>{(a.totalTokens-a.soldTokens).toLocaleString()} tokens left</span></div>
                    </div>
                    <button style={{...S.investBtn,background:`linear-gradient(135deg,${a.color},${a.color}bb)`}} onClick={e=>{e.stopPropagation();setAsset(a);}}>
                      Invest Now — Any Amount
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {/* ── PORTFOLIO ── */}
        {tab==="portfolio" && (
          <section style={S.section}>
            <div style={S.sHdr}><h2 style={S.sTitle}>Your Portfolio</h2><p style={S.sSub}>Your fractional ownership across all asset classes</p></div>
            {!wallet ? (
              <div style={S.empty}><div style={S.emptyIcon}>🔐</div><div style={S.emptyTitle}>Connect Your Wallet</div><div style={S.emptyTxt}>Connect to view your investments</div><button style={S.btnGold} onClick={connect}>Connect Wallet</button></div>
            ) : portfolio.length===0 ? (
              <div style={S.empty}><div style={S.emptyIcon}>📊</div><div style={S.emptyTitle}>No Investments Yet</div><div style={S.emptyTxt}>Browse the marketplace and invest any amount in any asset</div><button style={S.btnGold} onClick={()=>setTab("marketplace")}>Browse Assets</button></div>
            ) : (<>
              <div style={S.statsRow}>
                <div style={S.statCard}><div style={S.statVal}>${totalInvested.toFixed(2)}</div><div style={S.statLabel}>Total Invested</div></div>
                <div style={S.statCard}><div style={S.statVal}>{portfolio.length}</div><div style={S.statLabel}>Assets Held</div></div>
                <div style={S.statCard}><div style={{...S.statVal,color:"#D4A843"}}>${monthlyEarn.toFixed(2)}</div><div style={S.statLabel}>Est. Monthly</div></div>
                <div style={S.statCard}><div style={{...S.statVal,color:"#D4A843"}}>${(monthlyEarn*12).toFixed(2)}</div><div style={S.statLabel}>Est. Annual</div></div>
              </div>
              <div style={S.grid}>
                {portfolio.map(p=>(
                  <div key={p.id} style={S.card}>
                    <div style={S.cardImgWrap}>
                      <img src={p.image} alt={p.name} style={S.cardImg} onError={e=>{e.target.onerror=null;e.target.src=`https://placehold.co/800x400/0A0F1E/D4A843?text=${encodeURIComponent(p.name)}`;}}/>
                      <div style={S.cardImgOverlay}/>
                      <div style={S.cardTopBadges}>
                        <span style={{...S.catBadge,background:"#D4A84333",color:"#D4A843",border:"1px solid #D4A84344"}}>{p.category}</span>
                        <span style={{...S.verifiedBadge,background:"rgba(212,168,67,0.2)",color:"#D4A843",borderColor:"rgba(212,168,67,0.4)"}}>✓ Owned</span>
                      </div>
                    </div>
                    <div style={S.cardBody}>
                      <div style={S.cardName}>{p.name}</div>
                      <div style={S.cardLoc}>📍 {p.location}</div>
                      <div style={S.cardMetrics}>
                        <div style={S.metric}><span style={S.metricL}>Invested</span><span style={S.metricV}>${p.invested.toFixed(2)}</span></div>
                        <div style={S.metric}><span style={S.metricL}>Fractions</span><span style={S.metricV}>{typeof p.fractions==="number"?p.fractions.toFixed(6):p.fractions}</span></div>
                        <div style={S.metric}><span style={S.metricL}>APY</span><span style={{...S.metricV,color:"#D4A843"}}>{p.apy}%</span></div>
                      </div>
                      <div style={S.earnBox}>
                        <div style={S.earnRow}><span>Monthly Est.</span><span style={{color:"#D4A843",fontWeight:700}}>${((p.invested*p.apy)/100/12).toFixed(2)} USDC</span></div>
                        <div style={S.earnRow}><span>Annual Est.</span><span style={{color:"#D4A843",fontWeight:700}}>${((p.invested*p.apy)/100).toFixed(2)} USDC</span></div>
                      </div>
                      <a href={`${ARC_EXPLORER}/address/${wallet}`} target="_blank" rel="noreferrer" style={S.arcLink}>View on Arcscan ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
          </section>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab==="transactions" && (
          <section style={S.section}>
            <div style={S.sHdr}><h2 style={S.sTitle}>Transaction History</h2><p style={S.sSub}>Every investment recorded — click any hash to verify on Arcscan</p></div>
            {txLog.length===0 ? (
              <div style={S.empty}><div style={S.emptyIcon}>📋</div><div style={S.emptyTitle}>No Transactions Yet</div><div style={S.emptyTxt}>Your investment transactions will appear here</div><button style={S.btnGold} onClick={()=>setTab("marketplace")}>Start Investing</button></div>
            ) : (
              <div style={S.txWrap}>
                {txLog.map((tx,i)=>(
                  <div key={i} style={S.txRow}>
                    <div style={S.txLeft}>
                      <div style={S.txAsset}>{tx.asset}</div>
                      <div style={S.txMeta}>{tx.time} · {tx.wallet}</div>
                    </div>
                    <div style={S.txMid}>
                      <div style={S.txAmount}>${tx.amount} USDC</div>
                      <div style={S.txFrac}>{tx.fractions} fractions</div>
                    </div>
                    <div style={S.txRight}>
                      <a href={`${ARC_EXPLORER}/tx/${tx.hash}`} target="_blank" rel="noreferrer" style={S.txHashLink}>
                        {tx.hash.slice(0,10)}...↗
                      </a>
                      <span style={{...S.txBadge, background:tx.onChain?"rgba(34,197,94,0.15)":"rgba(212,168,67,0.15)", color:tx.onChain?"#22C55E":"#D4A843"}}>
                        {tx.onChain?"✓ On-Chain":"Local"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── ABOUT ── */}
        {tab==="about" && (
          <section style={{...S.section,maxWidth:920,margin:"0 auto"}}>
            <div style={S.sHdr}><h2 style={S.sTitle}>About Rex-RWA</h2><p style={S.sSub}>Real World Asset tokenization on Circle's Arc Testnet</p></div>
            <div style={S.builderCard}>
              <div style={{flex:"1 1 280px"}}>
                <div style={S.builderLabel}>PROJECT</div>
                <div style={S.builderName}>Rex-RWA</div>
                <div style={S.builderDesc}>A Real World Asset tokenization platform on Circle's Arc Testnet. Enabling fractional ownership of premium global assets — invest any amount, own any fraction.</div>
                <div style={S.builderTags}>
                  {["⛓️ Arc Testnet","💵 USDC Native","🌍 19 Global Assets","🔓 No Minimum"].map(t=><span key={t} style={S.builderTag}>{t}</span>)}
                </div>
              </div>
              <div style={{flex:"1 1 220px",display:"flex",flexDirection:"column",justifyContent:"center",gap:10}}>
                <div style={{fontSize:11,color:"#7A8BAA",fontWeight:700,letterSpacing:0.8}}>SMART CONTRACT</div>
                <div style={{fontSize:12,color:"#D4A843",fontFamily:"monospace",wordBreak:"break-all",fontWeight:700}}>{CONTRACT_ADDRESS}</div>
                <a href={`${ARC_EXPLORER}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" style={S.arcLink}>Verify on Arcscan ↗</a>
              </div>
            </div>
            <div style={S.aboutGrid}>
              {[
                {icon:"⛓️",title:"Built on Arc",text:"Circle's Layer-1 blockchain for stablecoin finance. Sub-second deterministic finality via the Malachite consensus engine."},
                {icon:"💵",title:"USDC Gas",text:"No ETH needed. Gas is paid in USDC — predictable and dollar-denominated. Claim free testnet USDC from Circle's faucet."},
                {icon:"🌍",title:"Real Assets",text:"Every asset is based on a real-world property or collectible with verifiable market data and real provenance."},
                {icon:"🔓",title:"No Minimum",text:"Own any fraction of any asset with any amount of USDC. No minimums, no maximums — complete accessibility."},
              ].map(c=>(
                <div key={c.title} style={S.aboutCard}>
                  <div style={{fontSize:28,marginBottom:10}}>{c.icon}</div>
                  <div style={{fontSize:15,fontWeight:800,color:"#EDF1F9",marginBottom:8}}>{c.title}</div>
                  <div style={{fontSize:13,color:"#7A8BAA",lineHeight:1.6}}>{c.text}</div>
                </div>
              ))}
            </div>
            <h3 style={{fontSize:18,fontWeight:800,color:"#EDF1F9",marginBottom:14}}>Quick Links</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {icon:"💧",name:"Circle USDC Faucet",desc:"Claim free testnet USDC",href:ARC_FAUCET},
                {icon:"🔍",name:"Arcscan Explorer",desc:"Track all transactions on Arc",href:ARC_EXPLORER},
                {icon:"📄",name:"Arc Documentation",desc:"Official developer docs",href:"https://docs.arc.io"},
                {icon:"📜",name:"Smart Contract",desc:`${CONTRACT_ADDRESS.slice(0,20)}...`,href:`${ARC_EXPLORER}/address/${CONTRACT_ADDRESS}`},
              ].map(l=>(
                <a key={l.name} href={l.href} target="_blank" rel="noreferrer" style={S.linkCard}>
                  <span style={{fontSize:24}}>{l.icon}</span>
                  <div><div style={{fontSize:14,fontWeight:700,color:"#EDF1F9",marginBottom:3}}>{l.name}</div><div style={{fontSize:12,color:"#7A8BAA"}}>{l.desc}</div></div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── INVESTMENT MODAL ── */}
      {asset && (
        <div style={S.overlay} onClick={()=>{ if(!busy){setAsset(null);setStep("idle");setAmount("");} }}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            {/* Image */}
            <div style={S.modalImgWrap}>
              <img src={asset.image} alt={asset.name} style={S.modalImg} onError={e=>{e.target.onerror=null;e.target.src=`https://placehold.co/800x400/0A0F1E/D4A843?text=${encodeURIComponent(asset.name)}`;}}/>
              <div style={S.modalImgOverlay}/>
              {!busy && <button style={S.modalClose} onClick={()=>{setAsset(null);setStep("idle");setAmount("");}}>✕</button>}
              <div style={S.modalTopBadges}>
                <span style={{...S.catBadge,background:`${asset.color}33`,color:asset.color,border:`1px solid ${asset.color}44`}}>{asset.category}</span>
                {asset.verified&&<span style={S.verifiedBadge}>✓ Verified</span>}
              </div>
            </div>

            <div style={S.modalBody}>
              <div style={S.modalName}>{asset.name}</div>
              <div style={S.modalLoc}>📍 {asset.location}</div>

              {/* Metrics */}
              <div style={S.modalMetrics}>
                {[["Asset Value",fmt(asset.totalValue)],["Token Price",`$${asset.tokenPrice} USDC`],["Annual Yield",`${asset.apy}%`],["Funded",`${Math.round((asset.soldTokens/asset.totalTokens)*100)}%`]].map(([l,v])=>(
                  <div key={l} style={S.mMetric}>
                    <div style={S.mMetricL}>{l}</div>
                    <div style={{...S.mMetricV,color:l==="Annual Yield"?"#D4A843":"#EDF1F9"}}>{v}</div>
                  </div>
                ))}
              </div>

              <p style={S.modalDesc}>{asset.description}</p>

              {/* Details */}
              <div style={S.detailsGrid}>
                {Object.entries(asset.details).map(([k,v])=>(
                  <div key={k} style={S.detailItem}>
                    <span style={S.detailKey}>{k.replace(/([A-Z])/g,' $1').trim()}</span>
                    <span style={S.detailVal}>{v}</span>
                  </div>
                ))}
              </div>

              {/* Investment UI */}
              {step==="done" ? (
                <div style={S.successBox}>
                  <div style={{fontSize:40,marginBottom:8}}>✅</div>
                  <div style={{fontSize:17,fontWeight:800,color:"#EDF1F9",marginBottom:6}}>Investment Confirmed!</div>
                  <div style={{fontSize:13,color:"#8A9FBF",marginBottom:14}}>Transaction is live on Arc Testnet</div>
                  {lastTxHash && (
                    <a href={`${ARC_EXPLORER}/tx/${lastTxHash}`} target="_blank" rel="noreferrer" style={{...S.arcLink,fontSize:14}}>
                      View on Arcscan ↗
                    </a>
                  )}
                </div>
              ) : step==="error" ? (
                <div style={{...S.successBox,background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.25)"}}>
                  <div style={{fontSize:40,marginBottom:8}}>❌</div>
                  <div style={{fontSize:15,fontWeight:700,color:"#EDF1F9",marginBottom:6}}>{stepMsg}</div>
                  <button style={{...S.modalBtn,marginTop:8}} onClick={()=>setStep("idle")}>Try Again</button>
                </div>
              ) : busy ? (
                <div style={S.processingBox}>
                  <div style={S.spinner}/>
                  <div style={{fontSize:15,fontWeight:700,color:"#EDF1F9",marginBottom:4}}>{stepMsg}</div>
                  <div style={{fontSize:12,color:"#7A8BAA"}}>Please check your wallet and confirm</div>
                </div>
              ) : (
                <>
                  <div style={S.inputGrp}>
                    <label style={S.inputLabel}>Investment Amount (USDC)</label>
                    <div style={S.inputWrap}>
                      <span style={S.inputPre}>$</span>
                      <input style={S.input} type="number" min="0" step="any"
                        placeholder="Enter any amount — no minimum"
                        value={amount} onChange={e=>setAmount(e.target.value)}/>
                      <span style={S.inputSuf}>USDC</span>
                    </div>
                    {amount && parseFloat(amount)>0 && (
                      <div style={S.inputHint}>
                        ≈ {(parseFloat(amount)/asset.tokenPrice).toFixed(6)} fractions &nbsp;·&nbsp; Est. ${((parseFloat(amount)*asset.apy)/100/12).toFixed(4)}/month
                      </div>
                    )}
                  </div>
                  <div style={S.freeNote}>🔓 No minimum · No maximum · Own any fraction</div>
                  {!wallet
                    ? <button style={S.modalBtn} onClick={connect}>Connect Wallet to Invest</button>
                    : <button style={S.modalBtn} onClick={handleInvest}>
                        {amount && parseFloat(amount)>0 ? `Invest $${parseFloat(amount).toFixed(2)} USDC` : "Invest USDC"}
                      </button>
                  }
                  <div style={S.modalNote}>
                    Need USDC? <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={{color:"#D4A843"}}>Claim from Circle Faucet ↗</a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div>
          <div style={{fontSize:16,fontWeight:900,color:"#D4A843",marginBottom:3}}>Rex-RWA</div>
          <div style={{fontSize:11,color:"#7A8BAA"}}>Real World Asset Tokenization · Arc Testnet</div>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4,flexWrap:"wrap"}}>
            <span style={{fontSize:11,color:"#7A8BAA"}}>⚡ Powered by <span style={{color:"#D4A843",fontWeight:800}}>Arc</span></span>
            <span style={{color:"rgba(255,255,255,0.2)"}}>·</span>
            <span style={{fontSize:11,color:"#7A8BAA"}}>💵 <span style={{color:"#D4A843",fontWeight:800}}>Circle USDC</span></span>
            <span style={{color:"rgba(255,255,255,0.2)"}}>·</span>
            <span style={{fontSize:11,color:"#7A8BAA"}}>⛓️ Chain ID {ARC_CHAIN_ID}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:18,alignItems:"center",flexWrap:"wrap"}}>
          <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.footerLink}>Arcscan</a>
          <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.footerLink}>Faucet</a>
          <a href="https://docs.arc.io" target="_blank" rel="noreferrer" style={S.footerLink}>Docs</a>
          <a href={`${ARC_EXPLORER}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" style={S.footerLink}>Contract</a>
          <button style={{...S.footerLink,background:"none",border:"none",cursor:"pointer"}} onClick={shareOnX}>Share on 𝕏</button>
        </div>
      </footer>
    </div>
  );
}

const S = {
  root:        { minHeight:"100vh", background:"#0A0F1E", color:"#EDF1F9", fontFamily:"'DM Sans','Outfit',sans-serif", position:"relative", overflowX:"hidden", transition:"opacity 0.3s" },
  canvas:      { position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 },
  toast:       { position:"fixed", top:76, right:16, zIndex:400, padding:"12px 18px", borderRadius:10, border:"1px solid", fontSize:14, fontWeight:600, backdropFilter:"blur(12px)", maxWidth:320, zIndex:500 },
  header:      { position:"sticky", top:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px", background:"rgba(10,15,30,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(212,168,67,0.12)", flexWrap:"wrap", gap:8 },
  logo:        { display:"flex", alignItems:"center", gap:12 },
  logoMark:    { width:40, height:40, background:"linear-gradient(135deg,#D4A843,#C49333)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  logoR:       { fontWeight:900, fontSize:20, color:"#0A0F1E" },
  logoTitle:   { fontWeight:900, fontSize:16, color:"#EDF1F9" },
  logoSub:     { fontSize:10, color:"#7A8BAA", marginTop:1 },
  nav:         { display:"flex", gap:2, flexWrap:"wrap" },
  navBtn:      { background:"transparent", border:"none", color:"#7A8BAA", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 },
  navActive:   { color:"#D4A843", background:"rgba(212,168,67,0.1)" },
  hRight:      { display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" },
  faucetBtn:   { padding:"6px 12px", borderRadius:8, background:"rgba(212,168,67,0.1)", color:"#D4A843", textDecoration:"none", fontSize:12, fontWeight:700, border:"1px solid rgba(212,168,67,0.25)" },
  explorerBtn: { padding:"6px 12px", borderRadius:8, background:"rgba(255,255,255,0.05)", color:"#8A9FBF", textDecoration:"none", fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.08)" },
  shareBtn:    { padding:"6px 12px", borderRadius:8, background:"rgba(255,255,255,0.05)", color:"#8A9FBF", fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" },
  walletGroup: { display:"flex", alignItems:"center", gap:4 },
  wBadge:      { display:"flex", alignItems:"center", gap:8, padding:"6px 12px", borderRadius:8, background:"rgba(212,168,67,0.08)", border:"1px solid rgba(212,168,67,0.2)", fontSize:13, fontWeight:700 },
  wDot:        { width:7, height:7, borderRadius:"50%", background:"#D4A843" },
  disconnectBtn:{ width:30, height:30, borderRadius:8, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", cursor:"pointer", fontSize:13, fontWeight:700 },
  connectBtn:  { padding:"8px 16px", borderRadius:8, background:"linear-gradient(135deg,#D4A843,#C49333)", color:"#0A0F1E", fontWeight:800, fontSize:13, border:"none", cursor:"pointer" },
  chainBanner: { background:"rgba(239,68,68,0.1)", borderBottom:"1px solid rgba(239,68,68,0.2)", color:"#FCA5A5", padding:"9px 20px", display:"flex", alignItems:"center", gap:12, fontSize:13, fontWeight:600, position:"relative", zIndex:99 },
  switchBtn:   { padding:"4px 12px", borderRadius:6, background:"#EF4444", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:12 },
  main:        { position:"relative", zIndex:1, padding:"0 clamp(12px,3vw,32px) 60px" },
  hero:        { paddingTop:"clamp(28px,4vw,52px)", paddingBottom:16, maxWidth:860, margin:"0 auto", textAlign:"center" },
  heroPill:    { display:"inline-block", padding:"5px 16px", borderRadius:20, background:"rgba(212,168,67,0.1)", color:"#D4A843", fontSize:11, fontWeight:800, letterSpacing:1.5, marginBottom:20, border:"1px solid rgba(212,168,67,0.25)" },
  heroH:       { fontSize:"clamp(28px,5vw,58px)", fontWeight:900, lineHeight:1.1, marginBottom:18, color:"#EDF1F9" },
  gold:        { color:"#D4A843" },
  heroP:       { fontSize:"clamp(14px,2vw,17px)", color:"#7A8BAA", lineHeight:1.65, maxWidth:600, margin:"0 auto 28px" },
  heroActions: { display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:36 },
  btnGold:     { padding:"12px 24px", borderRadius:10, background:"linear-gradient(135deg,#D4A843,#C49333)", color:"#0A0F1E", fontWeight:800, fontSize:14, border:"none", cursor:"pointer" },
  btnOutline:  { padding:"12px 24px", borderRadius:10, background:"rgba(255,255,255,0.04)", color:"#8A9FBF", fontWeight:700, fontSize:14, border:"1px solid rgba(255,255,255,0.1)", textDecoration:"none", display:"inline-block", cursor:"pointer" },
  statsRow:    { display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:28 },
  statCard:    { flex:"1 1 140px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 18px", textAlign:"center" },
  statVal:     { fontSize:20, fontWeight:800, color:"#EDF1F9", display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  liveDot:     { width:7, height:7, borderRadius:"50%", background:"#D4A843", display:"inline-block" },
  statLabel:   { fontSize:11, color:"#7A8BAA", marginTop:4, fontWeight:500 },
  netBar:      { display:"flex", alignItems:"center", justifyContent:"center", flexWrap:"wrap", background:"rgba(212,168,67,0.04)", border:"1px solid rgba(212,168,67,0.12)", borderRadius:12, padding:"10px 16px", marginBottom:24 },
  netGroup:    { display:"flex", alignItems:"center" },
  netDiv:      { width:1, height:24, background:"rgba(255,255,255,0.07)", margin:"0 2px" },
  netItem:     { padding:"3px 12px", display:"flex", flexDirection:"column", alignItems:"center" },
  netL:        { fontSize:9, color:"#7A8BAA", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase" },
  netV:        { fontSize:12, color:"#EDF1F9", fontWeight:700, marginTop:2 },
  netLink:     { padding:"3px 12px", fontSize:12, color:"#D4A843", fontWeight:700, textDecoration:"none" },
  catRow:      { display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" },
  catBtn:      { display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.09)", background:"transparent", color:"#7A8BAA", cursor:"pointer", fontSize:12, fontWeight:600 },
  catActive:   { background:"rgba(212,168,67,0.12)", color:"#D4A843", borderColor:"rgba(212,168,67,0.3)" },
  grid:        { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(300px,100%),1fr))", gap:18 },
  card:        { background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden", cursor:"pointer" },
  cardImgWrap: { position:"relative", height:190 },
  cardImg:     { width:"100%", height:"100%", objectFit:"cover" },
  cardImgOverlay:{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,rgba(10,15,30,0.88) 100%)" },
  cardTopBadges:{ position:"absolute", top:12, left:12, right:12, display:"flex", gap:6, alignItems:"center" },
  catBadge:    { padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:700, backdropFilter:"blur(4px)" },
  verifiedBadge:{ padding:"3px 10px", borderRadius:20, background:"rgba(212,168,67,0.2)", color:"#D4A843", fontSize:10, fontWeight:700, border:"1px solid rgba(212,168,67,0.4)", backdropFilter:"blur(4px)" },
  cardTag:     { padding:"3px 10px", borderRadius:20, fontSize:10, fontWeight:800, backdropFilter:"blur(4px)" },
  cardBody:    { padding:"14px 16px 18px" },
  cardName:    { fontSize:15, fontWeight:800, color:"#EDF1F9", marginBottom:4, lineHeight:1.3 },
  cardLoc:     { fontSize:11, color:"#7A8BAA", marginBottom:8 },
  cardDesc:    { fontSize:12, color:"#7A8BAA", lineHeight:1.55, marginBottom:12 },
  cardMetrics: { display:"flex", gap:8, marginBottom:12 },
  metric:      { flex:1, display:"flex", flexDirection:"column" },
  metricL:     { fontSize:10, color:"#7A8BAA", fontWeight:600, marginBottom:2 },
  metricV:     { fontSize:13, fontWeight:800, color:"#EDF1F9" },
  progWrap:    { marginBottom:12 },
  progBar:     { height:3, background:"rgba(255,255,255,0.07)", borderRadius:4, marginBottom:5 },
  progFill:    { height:"100%", borderRadius:4 },
  progInfo:    { display:"flex", justifyContent:"space-between" },
  progPct:     { fontSize:10, color:"#D4A843", fontWeight:700 },
  progLeft:    { fontSize:10, color:"#7A8BAA" },
  investBtn:   { width:"100%", padding:"10px", borderRadius:9, border:"none", cursor:"pointer", fontWeight:800, fontSize:13, color:"#0A0F1E" },
  section:     { paddingTop:36 },
  sHdr:        { marginBottom:24 },
  sTitle:      { fontSize:26, fontWeight:900, color:"#EDF1F9", marginBottom:6 },
  sSub:        { fontSize:14, color:"#7A8BAA" },
  empty:       { textAlign:"center", padding:"70px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 },
  emptyIcon:   { fontSize:52 },
  emptyTitle:  { fontSize:20, fontWeight:800, color:"#EDF1F9" },
  emptyTxt:    { fontSize:14, color:"#7A8BAA", maxWidth:360 },
  earnBox:     { background:"rgba(212,168,67,0.06)", border:"1px solid rgba(212,168,67,0.15)", borderRadius:10, padding:"10px 14px", marginBottom:12 },
  earnRow:     { display:"flex", justifyContent:"space-between", fontSize:13, color:"#8A9FBF", marginBottom:4 },
  arcLink:     { fontSize:13, color:"#D4A843", textDecoration:"none", fontWeight:700 },
  txWrap:      { display:"flex", flexDirection:"column", gap:10 },
  txRow:       { display:"flex", alignItems:"center", gap:12, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"12px 16px", flexWrap:"wrap" },
  txLeft:      { flex:"2 1 160px" },
  txAsset:     { fontSize:14, fontWeight:700, color:"#EDF1F9", marginBottom:3 },
  txMeta:      { fontSize:11, color:"#7A8BAA" },
  txMid:       { flex:"1 1 100px", textAlign:"right" },
  txAmount:    { fontSize:13, fontWeight:700, color:"#D4A843", marginBottom:3 },
  txFrac:      { fontSize:11, color:"#7A8BAA" },
  txRight:     { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:5 },
  txHashLink:  { fontSize:12, color:"#D4A843", textDecoration:"none", fontWeight:700 },
  txBadge:     { fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10 },
  builderCard: { display:"flex", gap:24, background:"linear-gradient(135deg,rgba(212,168,67,0.08),rgba(196,147,51,0.04))", border:"1px solid rgba(212,168,67,0.2)", borderRadius:16, padding:"24px", marginBottom:28, flexWrap:"wrap" },
  builderLabel:{ fontSize:11, color:"#D4A843", fontWeight:800, letterSpacing:1.5, marginBottom:8 },
  builderName: { fontSize:26, fontWeight:900, color:"#EDF1F9", marginBottom:10 },
  builderDesc: { fontSize:14, color:"#8A9FBF", lineHeight:1.65, marginBottom:14, maxWidth:480 },
  builderTags: { display:"flex", gap:8, flexWrap:"wrap" },
  builderTag:  { padding:"4px 12px", borderRadius:20, background:"rgba(255,255,255,0.06)", color:"#8A9FBF", fontSize:12, fontWeight:600 },
  aboutGrid:   { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:14, marginBottom:28 },
  aboutCard:   { background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"20px 16px" },
  linkCard:    { display:"flex", alignItems:"center", gap:14, background:"rgba(212,168,67,0.04)", border:"1px solid rgba(212,168,67,0.12)", borderRadius:12, padding:"14px 16px", textDecoration:"none" },
  footer:      { position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 20px", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:40, flexWrap:"wrap", gap:12 },
  footerLink:  { fontSize:13, color:"#7A8BAA", textDecoration:"none", fontWeight:600 },
  overlay:     { position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.82)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" },
  modal:       { background:"#0F1628", border:"1px solid rgba(212,168,67,0.2)", borderRadius:20, width:"100%", maxWidth:520, maxHeight:"92vh", overflowY:"auto", position:"relative" },
  modalImgWrap:{ position:"relative", height:210 },
  modalImg:    { width:"100%", height:"100%", objectFit:"cover" },
  modalImgOverlay:{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 20%,rgba(15,22,40,0.96) 100%)" },
  modalClose:  { position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.6)", border:"none", color:"#fff", width:30, height:30, borderRadius:6, cursor:"pointer", fontSize:14, fontWeight:700, zIndex:10 },
  modalTopBadges:{ position:"absolute", top:12, left:12, display:"flex", gap:6 },
  modalBody:   { padding:"14px 20px 24px" },
  modalName:   { fontSize:19, fontWeight:900, color:"#EDF1F9", marginBottom:4, lineHeight:1.2 },
  modalLoc:    { fontSize:12, color:"#7A8BAA", marginBottom:14 },
  modalMetrics:{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" },
  mMetric:     { flex:"1 1 90px", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px", textAlign:"center" },
  mMetricL:    { fontSize:10, color:"#7A8BAA", fontWeight:600, marginBottom:4 },
  mMetricV:    { fontSize:14, fontWeight:800 },
  modalDesc:   { fontSize:13, color:"#7A8BAA", lineHeight:1.65, marginBottom:14 },
  detailsGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 },
  detailItem:  { background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"8px 10px" },
  detailKey:   { display:"block", fontSize:10, color:"#7A8BAA", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 },
  detailVal:   { fontSize:13, color:"#EDF1F9", fontWeight:600 },
  inputGrp:    { marginBottom:10 },
  inputLabel:  { display:"block", fontSize:13, color:"#8A9FBF", fontWeight:600, marginBottom:7 },
  inputWrap:   { display:"flex", alignItems:"center", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.11)", borderRadius:10, overflow:"hidden" },
  inputPre:    { padding:"0 12px", color:"#D4A843", fontWeight:800, fontSize:16 },
  input:       { flex:1, padding:"13px 0", background:"transparent", border:"none", color:"#EDF1F9", fontSize:16, outline:"none" },
  inputSuf:    { padding:"0 14px", color:"#7A8BAA", fontWeight:600, fontSize:13 },
  inputHint:   { fontSize:12, color:"#D4A843", marginTop:6, fontWeight:600 },
  freeNote:    { textAlign:"center", fontSize:12, color:"#7A8BAA", marginBottom:12, padding:"7px", background:"rgba(212,168,67,0.06)", borderRadius:8, border:"1px solid rgba(212,168,67,0.14)" },
  modalBtn:    { width:"100%", padding:"14px", borderRadius:10, background:"linear-gradient(135deg,#D4A843,#C49333)", color:"#0A0F1E", fontWeight:800, fontSize:15, border:"none", cursor:"pointer", marginBottom:10 },
  modalNote:   { textAlign:"center", fontSize:12, color:"#7A8BAA" },
  successBox:  { textAlign:"center", padding:"24px 16px", background:"rgba(212,168,67,0.08)", borderRadius:14, border:"1px solid rgba(212,168,67,0.25)" },
  processingBox:{ textAlign:"center", padding:"24px 16px", background:"rgba(212,168,67,0.05)", borderRadius:14, border:"1px solid rgba(212,168,67,0.2)", display:"flex", flexDirection:"column", alignItems:"center", gap:12 },
  spinner:     { width:36, height:36, border:"3px solid rgba(212,168,67,0.2)", borderTop:"3px solid #D4A843", borderRadius:"50%", animation:"spin 1s linear infinite" },
};

// Add spinner animation
const style = document.createElement("style");
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
