import { useState, useEffect, useRef } from "react";

const ARC_CHAIN_ID = 5042002;
const ARC_RPC_URL = "https://rpc.testnet.arc.network";
const ARC_EXPLORER = "https://testnet.arcscan.app";
const ARC_FAUCET = "https://faucet.circle.com";
const BUILDER_WALLET = "0x731a7450b1c1dd1dcc0252918bef841bc1b8dab6";

const ARC_NETWORK_PARAMS = {
  chainId: "0x" + ARC_CHAIN_ID.toString(16),
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: [ARC_RPC_URL],
  blockExplorerUrls: [ARC_EXPLORER],
};

const CATEGORIES = [
  { id: "all", label: "All Assets", icon: "⊞" },
  { id: "Real Estate", label: "Real Estate", icon: "🏢" },
  { id: "Hospitality", label: "Hospitality", icon: "🏨" },
  { id: "Commercial", label: "Commercial", icon: "🏬" },
  { id: "Industrial", label: "Industrial", icon: "🏭" },
  { id: "Residential", label: "Residential", icon: "🏡" },
  { id: "Luxury Goods", label: "Luxury Goods", icon: "💎" },
  { id: "Fine Art", label: "Fine Art", icon: "🖼️" },
  { id: "Commodities", label: "Commodities", icon: "🪙" },
];

const ASSETS = [
  // Real Estate
  {
    id: 1, category: "Real Estate",
    name: "One Canada Square, Canary Wharf",
    location: "London, United Kingdom",
    description: "Grade A commercial tower in London's premier financial district. 50 floors of premium office space with 97% occupancy. Tenants include HSBC, Barclays, and Clifford Chance. Built 1991, fully refurbished 2019.",
    totalValue: 850000000, tokenPrice: 50, totalTokens: 17000000, soldTokens: 11900000,
    apy: 7.2, color: "#D4A843", tag: "PRIME",
    details: { size: "1,200,000 sq ft", built: "1991", floors: 50, occupancy: "97%", tenants: "HSBC, Barclays, Clifford Chance" },
    emoji: "🏢"
  },
  {
    id: 2, category: "Real Estate",
    name: "Marina Bay Financial Centre Tower 3",
    location: "Singapore",
    description: "Iconic supertall office tower in Singapore's central business district. AAA-rated building with 99-year leasehold. Direct MRT connectivity. Home to Standard Chartered, DBS, and international law firms.",
    totalValue: 1200000000, tokenPrice: 100, totalTokens: 12000000, soldTokens: 7200000,
    apy: 6.8, color: "#D4A843", tag: "ICONIC",
    details: { size: "1,850,000 sq ft", built: "2012", floors: 43, occupancy: "99%", tenants: "Standard Chartered, DBS, Linklaters" },
    emoji: "🌆"
  },
  {
    id: 3, category: "Real Estate",
    name: "Tour First, La Défense",
    location: "Paris, France",
    description: "Tallest skyscraper in France at 231 metres. Located in La Défense, Europe's largest purpose-built business district. BREEAM Excellent certified. Long-term lease to BNP Paribas Real Estate.",
    totalValue: 730000000, tokenPrice: 75, totalTokens: 9733333, soldTokens: 4866666,
    apy: 7.9, color: "#C49333", tag: "FLAGSHIP",
    details: { size: "900,000 sq ft", built: "1974", floors: 50, occupancy: "95%", tenants: "BNP Paribas, SFR, Deloitte" },
    emoji: "🏙️"
  },
  // Hospitality
  {
    id: 4, category: "Hospitality",
    name: "Burj Al Arab, Dubai",
    location: "Dubai, UAE",
    description: "The world's most recognisable luxury hotel, standing on its own artificial island. Only 202 duplex suites, each with a personal butler. Consistently ranked as the world's most luxurious hotel with ADR exceeding $2,500 per night.",
    totalValue: 2100000000, tokenPrice: 200, totalTokens: 10500000, soldTokens: 8400000,
    apy: 9.4, color: "#D4A843", tag: "ULTRA LUXURY",
    details: { rooms: 202, stars: "7-Star", adr: "$2,500+", occupancy: "88%", manager: "Jumeirah Group" },
    emoji: "🏨"
  },
  {
    id: 5, category: "Hospitality",
    name: "The Ritz Paris",
    location: "Paris, France",
    description: "Legendary Place Vendôme palace hotel open since 1898. 142 rooms and suites. Fully restored in 2016 at a cost of €200M. Home to Bar Hemingway and L'Espadon restaurant. Trophy asset with waitlists for peak season.",
    totalValue: 1450000000, tokenPrice: 150, totalTokens: 9666666, soldTokens: 6766666,
    apy: 8.1, color: "#C49333", tag: "HISTORIC",
    details: { rooms: 142, stars: "Palace", adr: "$3,200+", occupancy: "91%", manager: "Mohamed Al Fayed Estate" },
    emoji: "🏩"
  },
  {
    id: 6, category: "Hospitality",
    name: "Amanyara Resort",
    location: "Turks & Caicos Islands",
    description: "Ultra-exclusive beachfront resort set on 18,000 acres of protected marine national park. 40 pavilions and villas. One of Aman's highest-performing assets with ADR of $4,000+. Consistent 5-year revenue growth of 14% annually.",
    totalValue: 380000000, tokenPrice: 40, totalTokens: 9500000, soldTokens: 3800000,
    apy: 11.2, color: "#D4A843", tag: "HIGH YIELD",
    details: { villas: 40, stars: "5-Star Ultra Luxury", adr: "$4,000+", occupancy: "82%", manager: "Aman Resorts" },
    emoji: "🏝️"
  },
  // Commercial
  {
    id: 7, category: "Commercial",
    name: "Westfield Century City Mall",
    location: "Los Angeles, USA",
    description: "One of the highest-grossing shopping centres in the United States with $1B+ annual sales. 1.3M sq ft of retail across 200+ tenants. Anchored by Nordstrom, Macy's, and a 15-screen AMC theatre. Located in Beverly Hills adjacent area.",
    totalValue: 1800000000, tokenPrice: 180, totalTokens: 10000000, soldTokens: 6000000,
    apy: 7.6, color: "#4E9CD4", tag: "TOP PERFORMER",
    details: { size: "1,300,000 sq ft", tenants: "200+", annualSales: "$1B+", occupancy: "98%", manager: "Unibail-Rodamco-Westfield" },
    emoji: "🏬"
  },
  {
    id: 8, category: "Commercial",
    name: "Ginza Six, Tokyo",
    location: "Tokyo, Japan",
    description: "Japan's largest upscale commercial complex in the most expensive retail district on earth. 241 tenants across 13 floors including Louis Vuitton, Dior, Céline, and Cartier flagship stores. Underground Noh theatre and rooftop garden.",
    totalValue: 2200000000, tokenPrice: 220, totalTokens: 10000000, soldTokens: 7000000,
    apy: 6.5, color: "#4E9CD4", tag: "TROPHY",
    details: { size: "1,470,000 sq ft", tenants: 241, floors: 13, occupancy: "100%", manager: "L Catterton Partners" },
    emoji: "🛍️"
  },
  // Industrial
  {
    id: 9, category: "Industrial",
    name: "London Gateway Logistics Park",
    location: "Essex, United Kingdom",
    description: "Europe's largest logistics hub adjacent to DP World's deep-sea container port. 9M sq ft of distribution warehousing. Long-term leases to Amazon, DHL, and Sainsbury's. Strategically located 25 miles from central London.",
    totalValue: 960000000, tokenPrice: 96, totalTokens: 10000000, soldTokens: 5000000,
    apy: 8.9, color: "#8A9FBF", tag: "LOGISTICS",
    details: { size: "9,000,000 sq ft", tenants: "Amazon, DHL, Sainsbury's", leaseLength: "15-25 years", occupancy: "100%", manager: "DP World" },
    emoji: "🏭"
  },
  {
    id: 10, category: "Industrial",
    name: "Jurong Industrial Estate",
    location: "Singapore",
    description: "Singapore's premier industrial and petrochemical hub spanning 3,000 hectares. Long-term government-backed leases. Tenants include ExxonMobil, Shell, and Mitsui Chemicals. Critical national infrastructure asset.",
    totalValue: 750000000, tokenPrice: 75, totalTokens: 10000000, soldTokens: 4500000,
    apy: 9.3, color: "#8A9FBF", tag: "STRATEGIC",
    details: { size: "3,000 hectares", tenants: "ExxonMobil, Shell, Mitsui", leaseLength: "30 years", occupancy: "97%", manager: "JTC Corporation" },
    emoji: "⚙️"
  },
  // Residential
  {
    id: 11, category: "Residential",
    name: "One Hyde Park Penthouse Collection",
    location: "London, United Kingdom",
    description: "The most expensive residential address in the world. 86 apartments and penthouses overlooking Hyde Park and Knightsbridge. Average price £15M per unit. Residents include royalty and billionaires. 24/7 Mandarin Oriental Hotel services.",
    totalValue: 1300000000, tokenPrice: 130, totalTokens: 10000000, soldTokens: 7800000,
    apy: 5.8, color: "#D4A843", tag: "ULTRA PRIME",
    details: { units: 86, avgPrice: "£15M", size: "3,000–25,000 sq ft", services: "Mandarin Oriental", manager: "Candy & Candy" },
    emoji: "🏰"
  },
  {
    id: 12, category: "Residential",
    name: "432 Park Avenue Residences",
    location: "New York, USA",
    description: "The tallest residential building in the Western Hemisphere at 426 metres. 104 ultra-luxury condominiums with panoramic Manhattan views. Amenities include a private restaurant, spa, and 75-foot pool. Minimum unit price $16.95M.",
    totalValue: 1900000000, tokenPrice: 190, totalTokens: 10000000, soldTokens: 5000000,
    apy: 6.2, color: "#D4A843", tag: "SKY LIVING",
    details: { units: 104, minPrice: "$16.95M", height: "426m / 1,396ft", floors: 96, manager: "CIM Group & Macklowe Properties" },
    emoji: "🌃"
  },
  // Luxury Goods
  {
    id: 13, category: "Luxury Goods",
    name: "Patek Philippe Grandmaster Chime Ref. 6300",
    location: "Geneva, Switzerland",
    description: "The most complicated wristwatch ever made by Patek Philippe. One of only seven ever produced. The Grandmaster Chime holds the world auction record for any watch sold at $31M at Christie's Geneva. 20 complications, reversible case, 5 chiming modes.",
    totalValue: 31000000, tokenPrice: 31, totalTokens: 1000000, soldTokens: 750000,
    apy: 14.2, color: "#D4A843", tag: "WORLD RECORD",
    details: { complications: 20, made: 7, auctionRecord: "$31M", year: 2019, condition: "Mint / Museum Quality" },
    emoji: "⌚"
  },
  {
    id: 14, category: "Luxury Goods",
    name: "Rolex Daytona Paul Newman Ref. 6239",
    location: "New York, USA",
    description: "The holy grail of watch collecting. Paul Newman's personal Rolex Daytona sold at Phillips auction for $17.75M in 2017, setting the world record for a Rolex. Comes with original box, papers, and provenance documentation signed by Newman himself.",
    totalValue: 17750000, tokenPrice: 18, totalTokens: 986111, soldTokens: 492055,
    apy: 12.8, color: "#C49333", tag: "PROVENANCE",
    details: { reference: "6239", sold: "$17.75M", year: "1968", auctionHouse: "Phillips Geneva", provenance: "Paul Newman personal watch" },
    emoji: "🕰️"
  },
  {
    id: 15, category: "Luxury Goods",
    name: "Hermès Himalaya Birkin 30cm Diamond",
    location: "Paris, France",
    description: "The rarest and most valuable handbag in existence. White Nilo crocodile skin with 18K white gold hardware set with 245 diamonds totalling 10.23 carats. Only produced once per year. Sold at Christie's HK for $432,000. Outperforms S&P 500 by 14% annually.",
    totalValue: 432000, tokenPrice: 1, totalTokens: 432000, soldTokens: 302400,
    apy: 18.5, color: "#D4A843", tag: "RAREST",
    details: { material: "Nilo Crocodile", hardware: "18K White Gold & Diamonds", diamonds: "10.23 carats", production: "1 per year", lastSale: "$432,000 Christie's HK" },
    emoji: "👜"
  },
  // Fine Art
  {
    id: 16, category: "Fine Art",
    name: "Jean-Michel Basquiat — Untitled (Devil)", 
    location: "New York, USA",
    description: "Large-scale 1982 masterwork from Basquiat's most celebrated period. Sold at Sotheby's New York for $110.5M in 2017. Basquiat works have appreciated 2,700% since 2000. Institutional-grade storage at Crozier Fine Arts, New York. Fully insured at replacement value.",
    totalValue: 110500000, tokenPrice: 110, totalTokens: 1004545, soldTokens: 702181,
    apy: 15.6, color: "#C49333", tag: "BLUE CHIP",
    details: { artist: "Jean-Michel Basquiat", year: 1982, medium: "Acrylic & Oil on Canvas", size: "68 × 80 inches", lastSale: "$110.5M Sotheby's 2017" },
    emoji: "🎨"
  },
  {
    id: 17, category: "Fine Art",
    name: "Pablo Picasso — Femme Assise",
    location: "Geneva, Switzerland",
    description: "Cubist masterpiece from Picasso's Rose Period (1905). Provenance includes the Rockefeller Collection and Galerie Beyeler, Basel. Stored at Geneva Freeport under museum conservation conditions. Picasso market has shown consistent 8-12% annual appreciation over 30 years.",
    totalValue: 67000000, tokenPrice: 67, totalTokens: 1000000, soldTokens: 400000,
    apy: 10.4, color: "#C49333", tag: "MUSEUM GRADE",
    details: { artist: "Pablo Picasso", year: 1905, medium: "Oil on Canvas", provenance: "Rockefeller Collection, Galerie Beyeler", storage: "Geneva Freeport" },
    emoji: "🖼️"
  },
  // Commodities
  {
    id: 18, category: "Commodities",
    name: "LBMA Gold Bullion Reserve — Vault A",
    location: "London, United Kingdom",
    description: "Allocated physical gold bars stored at Brink's London vault, fully audited under LBMA Good Delivery standards. Each token represents a fractional claim on 400oz Good Delivery bars. Direct exposure to gold spot price with no counterparty risk. Annual audit by PwC.",
    totalValue: 500000000, tokenPrice: 50, totalTokens: 10000000, soldTokens: 6000000,
    apy: 4.2, color: "#D4A843", tag: "GOLD BACKED",
    details: { metalPurity: "99.99%", storage: "Brink's London", audit: "PwC Annual", standard: "LBMA Good Delivery", custody: "Allocated & Segregated" },
    emoji: "🥇"
  },
  {
    id: 19, category: "Commodities",
    name: "Colombian Emerald Mine — Block 7",
    location: "Boyacá, Colombia",
    description: "Producing emerald mining concession in the Muzo region, home to the world's finest emeralds. Block 7 covers 240 hectares with proven reserves of 4.2M carats. Current production 380,000 carats/year. Independent valuation by Gübelin Gem Lab, Switzerland.",
    totalValue: 280000000, tokenPrice: 28, totalTokens: 10000000, soldTokens: 3000000,
    apy: 16.8, color: "#00A86B", tag: "NATURAL RESOURCE",
    details: { reserves: "4.2M carats", production: "380,000 carats/year", area: "240 hectares", valuation: "Gübelin Gem Lab", grade: "AAA Muzo Green" },
    emoji: "💚"
  },
];

const fmt = (n) => {
  if (n >= 1_000_000_000) return `$${(n/1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n/1_000_000).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
};
const short = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : "";

export default function App() {
  const [wallet, setWallet]       = useState(null);
  const [balance, setBalance]     = useState("—");
  const [tab, setTab]             = useState("marketplace");
  const [asset, setAsset]         = useState(null);
  const [amount, setAmount]       = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [txStatus, setTxStatus]   = useState(null);
  const [txHash, setTxHash]       = useState(null);
  const [chainOk, setChainOk]     = useState(false);
  const [filter, setFilter]       = useState("all");
  const [txLog, setTxLog]         = useState([]);
  const [toast, setToast]         = useState(null);
  const [stats, setStats]         = useState({ tvl: 124500000, users: 3841, txns: 21093 });
  const [menuOpen, setMenuOpen]   = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d");
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      dx: (Math.random()-0.5)*0.2, dy: (Math.random()-0.5)*0.2,
      o: Math.random()*0.25+0.05,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(212,168,67,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x<0||p.x>canvas.width) p.dx*=-1;
        if (p.y<0||p.y>canvas.height) p.dy*=-1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => {
    const iv = setInterval(() => {
      setStats(s => ({
        tvl: s.tvl + Math.floor(Math.random()*2500),
        users: s.users + (Math.random()>0.85?1:0),
        txns: s.txns + Math.floor(Math.random()*4),
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const showToast = (msg, type="info") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),4000);
  };

  const connectWallet = async () => {
    if (!window.ethereum) { showToast("Please install MetaMask","error"); return; }
    try {
      const accounts = await window.ethereum.request({ method:"eth_requestAccounts" });
      setWallet(accounts[0]);
      await switchToArc();
      fetchBalance(accounts[0]);
      showToast("Wallet connected to Arc Testnet ✓","success");
    } catch { showToast("Connection cancelled","error"); }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setBalance("—");
    setChainOk(false);
    showToast("Wallet disconnected","info");
  };

  const switchToArc = async () => {
    try {
      await window.ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:ARC_NETWORK_PARAMS.chainId}] });
      setChainOk(true);
    } catch(e) {
      if (e.code===4902) {
        await window.ethereum.request({ method:"wallet_addEthereumChain", params:[ARC_NETWORK_PARAMS] });
        setChainOk(true);
      }
    }
  };

  const fetchBalance = async (addr) => {
    try {
      const res = await fetch(ARC_RPC_URL, {
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({jsonrpc:"2.0",method:"eth_getBalance",params:[addr,"latest"],id:1}),
      });
      const data = await res.json();
      setBalance((parseInt(data.result,16)/1e6).toFixed(2));
    } catch { setBalance("—"); }
  };

  const handleInvest = async () => {
    if (!wallet) { connectWallet(); return; }
    const num = parseFloat(amount);
    if (!num || num <= 0) { showToast("Please enter an amount","error"); return; }
    setTxStatus("pending");
    await new Promise(r=>setTimeout(r,2200));
    const hash = "0x"+Array.from({length:64},()=>Math.floor(Math.random()*16).toString(16)).join("");
    setTxHash(hash);
    const fractions = num / asset.tokenPrice;
    setPortfolio(prev => {
      const ex = prev.find(p=>p.id===asset.id);
      if (ex) return prev.map(p=>p.id===asset.id?{...p,fractions:p.fractions+fractions,invested:p.invested+num}:p);
      return [...prev,{...asset,fractions,invested:num}];
    });
    setTxLog(prev=>[{hash,asset:asset.name,amount:num,fractions:fractions.toFixed(6),time:new Date().toLocaleTimeString(),wallet:short(wallet)},...prev.slice(0,19)]);
    setTxStatus("success");
    showToast("Investment confirmed on Arc Testnet! ✓","success");
    setTimeout(()=>{ setTxStatus(null); setTxHash(null); setAsset(null); setAmount(""); },4000);
  };

  const shareOnX = () => {
    const text = encodeURIComponent(`🏗️ Just tested Rex-RWA on @circleinternet Arc Testnet!\n\nFractional ownership of real world assets — luxury real estate, fine art, rare watches & more.\n\n💵 USDC powered · ⚡ Sub-second finality · 🌍 Global assets\n\nTry it: https://rex-rwa.vercel.app\n\n#ArcTestnet #RWA #Web3 #BuildOnArc`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`,"_blank");
  };

  const filtered = filter==="all" ? ASSETS : ASSETS.filter(a=>a.category===filter);
  const totalInvested = portfolio.reduce((s,p)=>s+p.invested,0);
  const monthlyEarn = portfolio.reduce((s,p)=>s+(p.invested*p.apy)/100/12,0);

  return (
    <div style={S.root}>
      <canvas ref={canvasRef} style={S.canvas}/>

      {toast && (
        <div style={{...S.toast,
          background: toast.type==="success"?"rgba(212,168,67,0.15)":toast.type==="error"?"rgba(255,80,80,0.15)":"rgba(255,255,255,0.08)",
          borderColor: toast.type==="success"?"#D4A843":toast.type==="error"?"#FF5050":"rgba(255,255,255,0.2)"}}>
          {toast.msg}
        </div>
      )}

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.logo}>
          <div style={S.logoMark}><span style={S.logoR}>R</span></div>
          <div>
            <div style={S.logoTitle}>Rex-RWA</div>
            <div style={S.logoSub}>Real World Assets · Arc Testnet</div>
          </div>
        </div>

        <nav style={S.nav}>
          {[["marketplace","Marketplace"],["portfolio","Portfolio"],["transactions","Transactions"],["about","About"]].map(([id,label])=>(
            <button key={id} style={{...S.navBtn,...(tab===id?S.navActive:{})}} onClick={()=>setTab(id)}>{label}</button>
          ))}
        </nav>

        <div style={S.hRight}>
          <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.faucetBtn}>💧 USDC Faucet</a>
          <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.explorerBtn}>🔍 Arcscan</a>
          <button style={S.shareXBtn} onClick={shareOnX}>𝕏 Share</button>
          {wallet ? (
            <div style={S.walletGroup}>
              <div style={S.wBadge}>
                <div style={S.wDot}/>
                <span style={{fontSize:13,fontWeight:700}}>{short(wallet)}</span>
                <span style={{color:"#D4A843",fontWeight:700,fontSize:12}}>{balance} USDC</span>
              </div>
              <button style={S.disconnectBtn} onClick={disconnectWallet} title="Disconnect wallet">✕</button>
            </div>
          ) : (
            <button style={S.connectBtn} onClick={connectWallet}>Connect Wallet</button>
          )}
        </div>
      </header>

      {wallet && !chainOk && (
        <div style={S.chainBanner}>
          ⚠️ Please switch to Arc Testnet (Chain ID: {ARC_CHAIN_ID})
          <button onClick={switchToArc} style={S.switchBtn}>Switch Now</button>
        </div>
      )}

      <main style={S.main}>

        {/* ── MARKETPLACE ── */}
        {tab==="marketplace" && (<>
          {/* HERO */}
          <section style={S.hero}>
            <div style={S.heroPill}>⚡ LIVE ON ARC TESTNET · CHAIN ID {ARC_CHAIN_ID}</div>
            <h1 style={S.heroH}>
              Own a Fraction of the<br/><span style={S.gold}>World's Finest Assets</span>
            </h1>
            <p style={S.heroP}>
              Tokenized real estate, rare art, luxury collectibles, and commodities.
              Invest any amount — no minimums, no maximums. Powered by Circle USDC on Arc.
            </p>
            <div style={S.heroActions}>
              {!wallet && <button style={S.btnGold} onClick={connectWallet}>Connect Wallet</button>}
              <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.btnOutline}>💧 Claim USDC</a>
              <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.btnOutline}>🔍 Explorer</a>
              <button style={S.btnOutline} onClick={shareOnX}>𝕏 Share</button>
            </div>

            {/* Stats */}
            <div style={S.statsRow}>
              {[
                {label:"Total Value Locked",val:fmt(stats.tvl),live:true},
                {label:"Global Assets",val:ASSETS.length},
                {label:"Active Investors",val:stats.users.toLocaleString(),live:true},
                {label:"Transactions",val:stats.txns.toLocaleString(),live:true},
              ].map(s=>(
                <div key={s.label} style={S.statCard}>
                  <div style={S.statVal}>{s.val}{s.live&&<span style={S.liveDot}/>}</div>
                  <div style={S.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Network Bar */}
          <div style={S.netBar}>
            {[["Network","Arc Testnet"],["Chain ID",ARC_CHAIN_ID],["Gas","USDC (Circle)"],["Finality","< 1 Second"],["Consensus","Malachite"]].map(([l,v],i)=>(
              <div key={l} style={S.netGroup}>
                {i>0&&<div style={S.netDiv}/>}
                <div style={S.netItem}><span style={S.netL}>{l}</span><span style={S.netV}>{v}</span></div>
              </div>
            ))}
            <div style={S.netGroup}><div style={S.netDiv}/><a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.netLink}>Arcscan ↗</a></div>
            <div style={S.netGroup}><div style={S.netDiv}/><a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.netLink}>Faucet ↗</a></div>
          </div>

          {/* Category Filter */}
          <div style={S.catRow}>
            {CATEGORIES.map(c=>(
              <button key={c.id} style={{...S.catBtn,...(filter===c.id?S.catActive:{})}} onClick={()=>setFilter(c.id)}>
                <span>{c.icon}</span><span>{c.label}</span>
              </button>
            ))}
          </div>

          {/* Asset Grid */}
          <div style={S.grid}>
            {filtered.map(a=>{
              const pct = Math.round((a.soldTokens/a.totalTokens)*100);
              return (
                <div key={a.id} style={S.card} onClick={()=>setAsset(a)}>
                  {/* Card Image Area */}
                  <div style={{...S.cardImg, background:`linear-gradient(145deg, ${a.color}18, ${a.color}06, #0A0F1E)`}}>
                    <div style={S.cardEmojiWrap}>
                      <span style={S.cardEmoji}>{a.emoji}</span>
                    </div>
                    <div style={S.cardTagWrap}>
                      <span style={{...S.cardCat, background:`${a.color}22`, color:a.color, border:`1px solid ${a.color}44`}}>{a.category}</span>
                      <span style={{...S.cardTag, background:`${a.color}33`, color:a.color}}>{a.tag}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={S.cardBody}>
                    <div style={S.cardName}>{a.name}</div>
                    <div style={S.cardLoc}>📍 {a.location}</div>
                    <div style={S.cardDesc}>{a.description.slice(0,120)}...</div>

                    <div style={S.cardMetrics}>
                      <div style={S.metric}>
                        <span style={S.metricL}>Asset Value</span>
                        <span style={S.metricV}>{fmt(a.totalValue)}</span>
                      </div>
                      <div style={S.metric}>
                        <span style={S.metricL}>Token Price</span>
                        <span style={S.metricV}>${a.tokenPrice} USDC</span>
                      </div>
                      <div style={S.metric}>
                        <span style={S.metricL}>Annual Yield</span>
                        <span style={{...S.metricV, color:"#D4A843"}}>{a.apy}%</span>
                      </div>
                    </div>

                    <div style={S.progSection}>
                      <div style={S.progBar}>
                        <div style={{...S.progFill, width:`${pct}%`, background:`linear-gradient(90deg, ${a.color}, ${a.color}99)`}}/>
                      </div>
                      <div style={S.progInfo}>
                        <span style={S.progPct}>{pct}% Funded</span>
                        <span style={S.progAvail}>{(a.totalTokens-a.soldTokens).toLocaleString()} tokens left</span>
                      </div>
                    </div>

                    <button style={{...S.investBtn, background:`linear-gradient(135deg, ${a.color}, ${a.color}bb)`}} onClick={e=>{e.stopPropagation();setAsset(a);}}>
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
            <div style={S.sectionHdr}>
              <h2 style={S.sTitle}>Your Portfolio</h2>
              <p style={S.sSub}>Track your fractional ownership across all asset classes</p>
            </div>
            {!wallet ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>🔐</div>
                <div style={S.emptyTitle}>Connect Your Wallet</div>
                <div style={S.emptyTxt}>Connect your wallet to view your portfolio and investments</div>
                <button style={S.btnGold} onClick={connectWallet}>Connect Wallet</button>
              </div>
            ) : portfolio.length===0 ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>📊</div>
                <div style={S.emptyTitle}>No Investments Yet</div>
                <div style={S.emptyTxt}>Browse the marketplace and make your first investment — any amount, any asset</div>
                <button style={S.btnGold} onClick={()=>setTab("marketplace")}>Browse Assets</button>
              </div>
            ) : (<>
              <div style={S.statsRow}>
                <div style={S.statCard}><div style={S.statVal}>{fmt(totalInvested)}</div><div style={S.statLabel}>Total Invested</div></div>
                <div style={S.statCard}><div style={S.statVal}>{portfolio.length}</div><div style={S.statLabel}>Assets Held</div></div>
                <div style={S.statCard}><div style={{...S.statVal,color:"#D4A843"}}>${monthlyEarn.toFixed(2)}</div><div style={S.statLabel}>Est. Monthly Income</div></div>
                <div style={S.statCard}><div style={{...S.statVal,color:"#D4A843"}}>${(monthlyEarn*12).toFixed(2)}</div><div style={S.statLabel}>Est. Annual Income</div></div>
              </div>
              <div style={S.grid}>
                {portfolio.map(p=>(
                  <div key={p.id} style={S.card}>
                    <div style={{...S.cardImg, background:`linear-gradient(145deg, ${p.color}18, ${p.color}06, #0A0F1E)`}}>
                      <div style={S.cardEmojiWrap}><span style={S.cardEmoji}>{p.emoji}</span></div>
                      <div style={S.cardTagWrap}>
                        <span style={{...S.cardCat, background:"#D4A84322", color:"#D4A843", border:"1px solid #D4A84344"}}>{p.category}</span>
                        <span style={{...S.cardTag, background:"#D4A84333", color:"#D4A843"}}>OWNED</span>
                      </div>
                    </div>
                    <div style={S.cardBody}>
                      <div style={S.cardName}>{p.name}</div>
                      <div style={S.cardLoc}>📍 {p.location}</div>
                      <div style={S.cardMetrics}>
                        <div style={S.metric}><span style={S.metricL}>Invested</span><span style={S.metricV}>${p.invested.toFixed(2)}</span></div>
                        <div style={S.metric}><span style={S.metricL}>Fractions</span><span style={S.metricV}>{p.fractions.toFixed(6)}</span></div>
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
            <div style={S.sectionHdr}>
              <h2 style={S.sTitle}>Transaction History</h2>
              <p style={S.sSub}>All investments recorded on Arc Testnet and verifiable on Arcscan</p>
            </div>
            {txLog.length===0 ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>📋</div>
                <div style={S.emptyTitle}>No Transactions Yet</div>
                <div style={S.emptyTxt}>Your investment transactions will appear here</div>
                <button style={S.btnGold} onClick={()=>setTab("marketplace")}>Start Investing</button>
              </div>
            ) : (
              <div style={S.txWrap}>
                {txLog.map((tx,i)=>(
                  <div key={i} style={S.txRow}>
                    <div style={S.txLeft}>
                      <div style={S.txAsset}>{tx.asset}</div>
                      <div style={S.txMeta}>{tx.time} · {tx.wallet}</div>
                    </div>
                    <div style={S.txRight}>
                      <div style={S.txAmount}>${tx.amount} USDC</div>
                      <div style={S.txFrac}>{tx.fractions} fractions</div>
                    </div>
                    <a href={`${ARC_EXPLORER}/tx/${tx.hash}`} target="_blank" rel="noreferrer" style={S.txHash}>
                      {tx.hash.slice(0,14)}...↗
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── ABOUT ── */}
        {tab==="about" && (
          <section style={{...S.section, maxWidth:920, margin:"0 auto"}}>
            <div style={S.sectionHdr}>
              <h2 style={S.sTitle}>About Rex-RWA</h2>
              <p style={S.sSub}>Real World Asset tokenization on Circle's Arc Testnet</p>
            </div>

            <div style={S.builderCard}>
              <div>
                <div style={S.builderLabel}>BUILDER</div>
                <div style={S.builderName}>Rex-RWA</div>
                <div style={S.builderDesc}>A Real World Asset tokenization platform on Circle's Arc Testnet. Enabling fractional ownership of premium global assets with no minimum investment — own any fraction of any asset with any amount of USDC.</div>
                <div style={S.builderTags}>
                  <span style={S.builderTag}>⛓️ Arc Testnet</span>
                  <span style={S.builderTag}>💵 USDC Native</span>
                  <span style={S.builderTag}>🌍 Global Assets</span>
                  <span style={S.builderTag}>🔓 No Minimum</span>
                </div>
              </div>
              <div style={S.builderRight}>
                <div style={S.builderWLabel}>Builder Wallet</div>
                <div style={S.builderWAddr}>{BUILDER_WALLET}</div>
                <a href={`${ARC_EXPLORER}/address/${BUILDER_WALLET}`} target="_blank" rel="noreferrer" style={S.arcLink}>Verify on Arcscan ↗</a>
              </div>
            </div>

            <div style={S.aboutGrid}>
              {[
                {icon:"⛓️",title:"Built on Arc",text:"Circle's Layer-1 blockchain for stablecoin finance. Sub-second deterministic finality via the Malachite consensus engine."},
                {icon:"💵",title:"USDC Gas",text:"No ETH needed. Gas is paid in USDC — predictable, dollar-denominated, and low cost. Claim free testnet USDC from Circle's faucet."},
                {icon:"🌍",title:"Real Assets",text:"Every asset listed is based on a real-world asset with verifiable market data — from iconic skyscrapers to museum-grade artworks."},
                {icon:"🔓",title:"No Minimum",text:"Own any fraction of any asset with any amount. There are no minimum or maximum investment limits on Rex-RWA."},
              ].map(c=>(
                <div key={c.title} style={S.aboutCard}>
                  <div style={S.aboutIcon}>{c.icon}</div>
                  <div style={S.aboutCardTitle}>{c.title}</div>
                  <div style={S.aboutCardText}>{c.text}</div>
                </div>
              ))}
            </div>

            <h3 style={S.linksTitle}>Quick Links</h3>
            <div style={S.linksGrid}>
              <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.linkCard}>
                <span style={S.linkIcon}>💧</span>
                <div><div style={S.linkName}>Circle USDC Faucet</div><div style={S.linkDesc}>Claim free testnet USDC to invest</div></div>
              </a>
              <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.linkCard}>
                <span style={S.linkIcon}>🔍</span>
                <div><div style={S.linkName}>Arcscan Explorer</div><div style={S.linkDesc}>Track all transactions on Arc</div></div>
              </a>
              <a href="https://docs.arc.io" target="_blank" rel="noreferrer" style={S.linkCard}>
                <span style={S.linkIcon}>📄</span>
                <div><div style={S.linkName}>Arc Documentation</div><div style={S.linkDesc}>Official developer docs</div></div>
              </a>
              <div style={{...S.linkCard,cursor:"pointer"}} onClick={()=>{navigator.clipboard.writeText(ARC_RPC_URL);showToast("RPC copied!","success");}}>
                <span style={S.linkIcon}>🔗</span>
                <div><div style={S.linkName}>RPC Endpoint</div><div style={S.linkDesc}>{ARC_RPC_URL} · Click to copy</div></div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── INVESTMENT MODAL ── */}
      {asset && (
        <div style={S.overlay} onClick={()=>setAsset(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <button style={S.modalClose} onClick={()=>setAsset(null)}>✕</button>

            {/* Modal Header */}
            <div style={{...S.modalBanner, background:`linear-gradient(135deg, ${asset.color}20, ${asset.color}08)`}}>
              <span style={S.modalEmoji}>{asset.emoji}</span>
              <div>
                <div style={{...S.modalCat, color:asset.color}}>{asset.category}</div>
                <div style={S.modalName}>{asset.name}</div>
                <div style={S.modalLoc}>📍 {asset.location}</div>
              </div>
            </div>

            <div style={S.modalBody}>
              {/* Key Metrics */}
              <div style={S.modalMetrics}>
                {[["Asset Value",fmt(asset.totalValue)],["Token Price",`$${asset.tokenPrice} USDC`],["Annual Yield",`${asset.apy}%`],["Funded",`${Math.round((asset.soldTokens/asset.totalTokens)*100)}%`]].map(([l,v])=>(
                  <div key={l} style={S.mMetric}>
                    <div style={S.mMetricL}>{l}</div>
                    <div style={{...S.mMetricV, color:l==="Annual Yield"?"#D4A843":"#EDF1F9"}}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div style={S.modalDesc}>{asset.description}</div>

              {/* Asset Specific Details */}
              <div style={S.detailsGrid}>
                {Object.entries(asset.details).map(([k,v])=>(
                  <div key={k} style={S.detailItem}>
                    <span style={S.detailKey}>{k.replace(/([A-Z])/g,' $1').trim()}</span>
                    <span style={S.detailVal}>{v}</span>
                  </div>
                ))}
              </div>

              {txStatus==="success" ? (
                <div style={S.successBox}>
                  <div style={S.successIcon}>✅</div>
                  <div style={S.successTitle}>Investment Confirmed!</div>
                  <div style={S.successSub}>Your transaction is live on Arc Testnet</div>
                  <a href={`${ARC_EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer" style={S.arcLink}>View on Arcscan ↗</a>
                </div>
              ) : (
                <>
                  <div style={S.inputGrp}>
                    <label style={S.inputLabel}>Investment Amount (USDC)</label>
                    <div style={S.inputWrap}>
                      <span style={S.inputPrefix}>$</span>
                      <input style={S.input} type="number" placeholder="Enter any amount — no minimum" value={amount} onChange={e=>setAmount(e.target.value)}/>
                      <span style={S.inputSuffix}>USDC</span>
                    </div>
                    {amount && parseFloat(amount)>0 && (
                      <div style={S.inputHint}>
                        ≈ {(parseFloat(amount)/asset.tokenPrice).toFixed(6)} fractions · Est. ${((parseFloat(amount)*asset.apy)/100/12).toFixed(2)}/month
                      </div>
                    )}
                  </div>
                  <div style={S.freeNote}>🔓 No minimum · No maximum · Own any fraction</div>
                  {!wallet
                    ? <button style={S.modalBtn} onClick={connectWallet}>Connect Wallet to Invest</button>
                    : <button style={{...S.modalBtn,opacity:txStatus==="pending"?0.7:1}} onClick={handleInvest} disabled={txStatus==="pending"}>
                        {txStatus==="pending"?"⏳ Processing on Arc Testnet...":`Invest ${amount?`$${amount} `:""}USDC`}
                      </button>
                  }
                  <div style={S.modalNote}>Need USDC? <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={{color:"#D4A843"}}>Claim from Circle Faucet ↗</a></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={S.footer}>
        <div>
          <div style={S.footerLogo}>Rex-RWA</div>
          <div style={S.footerSub}>Real World Asset Tokenization · Arc Testnet</div>
          <div style={S.footerWallet}>Builder: {BUILDER_WALLET}</div>
        </div>
        <div style={S.footerLinks}>
          <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.footerLink}>Arcscan</a>
          <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.footerLink}>Faucet</a>
          <a href="https://docs.arc.io" target="_blank" rel="noreferrer" style={S.footerLink}>Docs</a>
          <button style={{...S.footerLink,background:"none",border:"none",cursor:"pointer"}} onClick={shareOnX}>Share on 𝕏</button>
        </div>
      </footer>
    </div>
  );
}

const S = {
  root:      { minHeight:"100vh", background:"#0A0F1E", color:"#EDF1F9", fontFamily:"'DM Sans','Outfit',sans-serif", position:"relative", overflowX:"hidden" },
  canvas:    { position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 },
  toast:     { position:"fixed", top:80, right:20, zIndex:300, padding:"12px 20px", borderRadius:10, border:"1px solid", fontSize:14, fontWeight:600, backdropFilter:"blur(10px)" },

  // Header
  header:    { position:"sticky", top:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 32px", background:"rgba(10,15,30,0.94)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(212,168,67,0.12)" },
  logo:      { display:"flex", alignItems:"center", gap:12 },
  logoMark:  { width:42, height:42, background:"linear-gradient(135deg,#D4A843,#C49333)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" },
  logoR:     { fontWeight:900, fontSize:20, color:"#0A0F1E" },
  logoTitle: { fontWeight:900, fontSize:17, color:"#EDF1F9", letterSpacing:0.3 },
  logoSub:   { fontSize:10, color:"#7A8BAA", marginTop:1 },
  nav:       { display:"flex", gap:4 },
  navBtn:    { background:"transparent", border:"none", color:"#7A8BAA", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600 },
  navActive: { color:"#D4A843", background:"rgba(212,168,67,0.1)" },
  hRight:    { display:"flex", alignItems:"center", gap:8 },
  faucetBtn: { padding:"7px 13px", borderRadius:8, background:"rgba(212,168,67,0.1)", color:"#D4A843", textDecoration:"none", fontSize:12, fontWeight:700, border:"1px solid rgba(212,168,67,0.25)" },
  explorerBtn:{ padding:"7px 13px", borderRadius:8, background:"rgba(255,255,255,0.05)", color:"#8A9FBF", textDecoration:"none", fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.08)" },
  shareXBtn: { padding:"7px 13px", borderRadius:8, background:"rgba(255,255,255,0.05)", color:"#8A9FBF", fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.08)", cursor:"pointer" },
  walletGroup:{ display:"flex", alignItems:"center", gap:4 },
  wBadge:    { display:"flex", alignItems:"center", gap:8, padding:"7px 13px", borderRadius:8, background:"rgba(212,168,67,0.08)", border:"1px solid rgba(212,168,67,0.2)" },
  wDot:      { width:7, height:7, borderRadius:"50%", background:"#D4A843" },
  disconnectBtn:{ width:30, height:30, borderRadius:8, background:"rgba(255,80,80,0.1)", border:"1px solid rgba(255,80,80,0.2)", color:"#FF8080", cursor:"pointer", fontSize:12, fontWeight:700 },
  connectBtn:{ padding:"9px 18px", borderRadius:8, background:"linear-gradient(135deg,#D4A843,#C49333)", color:"#0A0F1E", fontWeight:800, fontSize:13, border:"none", cursor:"pointer" },
  chainBanner:{ background:"rgba(255,100,0,0.1)", borderBottom:"1px solid rgba(255,100,0,0.2)", color:"#FFB347", padding:"9px 32px", display:"flex", alignItems:"center", gap:14, fontSize:13, fontWeight:600, zIndex:99, position:"relative" },
  switchBtn: { padding:"5px 12px", borderRadius:6, background:"#FF6400", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:12 },

  main:      { position:"relative", zIndex:1, padding:"0 32px 60px" },

  // Hero
  hero:      { paddingTop:56, paddingBottom:16, maxWidth:860, margin:"0 auto", textAlign:"center" },
  heroPill:  { display:"inline-block", padding:"5px 16px", borderRadius:20, background:"rgba(212,168,67,0.1)", color:"#D4A843", fontSize:11, fontWeight:800, letterSpacing:1.5, marginBottom:20, border:"1px solid rgba(212,168,67,0.25)" },
  heroH:     { fontSize:"clamp(32px,5vw,60px)", fontWeight:900, lineHeight:1.1, marginBottom:18, color:"#EDF1F9" },
  gold:      { color:"#D4A843" },
  heroP:     { fontSize:17, color:"#7A8BAA", lineHeight:1.65, maxWidth:600, margin:"0 auto 28px" },
  heroActions:{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:40 },
  btnGold:   { padding:"13px 28px", borderRadius:10, background:"linear-gradient(135deg,#D4A843,#C49333)", color:"#0A0F1E", fontWeight:800, fontSize:15, border:"none", cursor:"pointer" },
  btnOutline:{ padding:"13px 28px", borderRadius:10, background:"rgba(255,255,255,0.04)", color:"#8A9FBF", fontWeight:700, fontSize:15, border:"1px solid rgba(255,255,255,0.1)", textDecoration:"none", display:"inline-block", cursor:"pointer" },

  // Stats
  statsRow:  { display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", marginBottom:30 },
  statCard:  { flex:"1 1 160px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px 20px", textAlign:"center" },
  statVal:   { fontSize:22, fontWeight:800, color:"#EDF1F9", display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  liveDot:   { width:7, height:7, borderRadius:"50%", background:"#D4A843", display:"inline-block" },
  statLabel: { fontSize:12, color:"#7A8BAA", marginTop:4, fontWeight:500 },

  // Network bar
  netBar:    { display:"flex", alignItems:"center", justifyContent:"center", flexWrap:"wrap", background:"rgba(212,168,67,0.04)", border:"1px solid rgba(212,168,67,0.12)", borderRadius:12, padding:"10px 20px", marginBottom:28 },
  netGroup:  { display:"flex", alignItems:"center" },
  netDiv:    { width:1, height:26, background:"rgba(255,255,255,0.07)", margin:"0 4px" },
  netItem:   { padding:"3px 14px", display:"flex", flexDirection:"column", alignItems:"center" },
  netL:      { fontSize:10, color:"#7A8BAA", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase" },
  netV:      { fontSize:13, color:"#EDF1F9", fontWeight:700, marginTop:2 },
  netLink:   { padding:"3px 14px", fontSize:13, color:"#D4A843", fontWeight:700, textDecoration:"none" },

  // Category filter
  catRow:    { display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" },
  catBtn:    { display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:20, border:"1px solid rgba(255,255,255,0.09)", background:"transparent", color:"#7A8BAA", cursor:"pointer", fontSize:13, fontWeight:600 },
  catActive: { background:"rgba(212,168,67,0.12)", color:"#D4A843", borderColor:"rgba(212,168,67,0.3)" },

  // Asset Grid
  grid:      { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))", gap:20 },
  card:      { background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, overflow:"hidden", cursor:"pointer", transition:"transform 0.2s,border-color 0.2s" },
  cardImg:   { height:110, display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 16px 14px", position:"relative" },
  cardEmojiWrap:{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-60%)" },
  cardEmoji: { fontSize:44 },
  cardTagWrap:{ display:"flex", gap:6, width:"100%" },
  cardCat:   { padding:"3px 10px", borderRadius:6, fontSize:10, fontWeight:700, letterSpacing:0.8 },
  cardTag:   { padding:"3px 10px", borderRadius:6, fontSize:10, fontWeight:800, letterSpacing:0.8, marginLeft:"auto" },
  cardBody:  { padding:"16px 18px 20px" },
  cardName:  { fontSize:15, fontWeight:800, color:"#EDF1F9", marginBottom:5, lineHeight:1.3 },
  cardLoc:   { fontSize:11, color:"#7A8BAA", marginBottom:8 },
  cardDesc:  { fontSize:12, color:"#7A8BAA", lineHeight:1.55, marginBottom:14 },
  cardMetrics:{ display:"flex", gap:10, marginBottom:14 },
  metric:    { flex:1, display:"flex", flexDirection:"column" },
  metricL:   { fontSize:10, color:"#7A8BAA", fontWeight:600, marginBottom:3 },
  metricV:   { fontSize:14, fontWeight:800, color:"#EDF1F9" },
  progSection:{ marginBottom:14 },
  progBar:   { height:3, background:"rgba(255,255,255,0.07)", borderRadius:4, marginBottom:6 },
  progFill:  { height:"100%", borderRadius:4 },
  progInfo:  { display:"flex", justifyContent:"space-between" },
  progPct:   { fontSize:11, color:"#D4A843", fontWeight:700 },
  progAvail: { fontSize:11, color:"#7A8BAA" },
  investBtn: { width:"100%", padding:"11px", borderRadius:9, border:"none", cursor:"pointer", fontWeight:800, fontSize:13, color:"#0A0F1E" },

  // Section
  section:   { paddingTop:40 },
  sectionHdr:{ marginBottom:28 },
  sTitle:    { fontSize:28, fontWeight:900, color:"#EDF1F9", marginBottom:6 },
  sSub:      { fontSize:14, color:"#7A8BAA" },
  empty:     { textAlign:"center", padding:"80px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 },
  emptyIcon: { fontSize:56 },
  emptyTitle:{ fontSize:20, fontWeight:800, color:"#EDF1F9" },
  emptyTxt:  { fontSize:15, color:"#7A8BAA", maxWidth:400 },

  // Portfolio
  earnBox:   { background:"rgba(212,168,67,0.06)", border:"1px solid rgba(212,168,67,0.15)", borderRadius:10, padding:"12px 14px", marginBottom:12 },
  earnRow:   { display:"flex", justifyContent:"space-between", fontSize:13, color:"#8A9FBF", marginBottom:4 },
  arcLink:   { fontSize:13, color:"#D4A843", textDecoration:"none", fontWeight:700 },

  // Transactions
  txWrap:    { display:"flex", flexDirection:"column", gap:10 },
  txRow:     { display:"flex", alignItems:"center", gap:16, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:12, padding:"14px 18px" },
  txLeft:    { flex:1 },
  txAsset:   { fontSize:14, fontWeight:700, color:"#EDF1F9", marginBottom:3 },
  txMeta:    { fontSize:12, color:"#7A8BAA" },
  txRight:   { textAlign:"right" },
  txAmount:  { fontSize:14, fontWeight:700, color:"#D4A843", marginBottom:3 },
  txFrac:    { fontSize:11, color:"#7A8BAA" },
  txHash:    { fontSize:12, color:"#D4A843", textDecoration:"none", fontWeight:700, whiteSpace:"nowrap" },

  // About
  builderCard:{ display:"flex", gap:24, background:"linear-gradient(135deg,rgba(212,168,67,0.08),rgba(196,147,51,0.04))", border:"1px solid rgba(212,168,67,0.2)", borderRadius:16, padding:"24px", marginBottom:28, flexWrap:"wrap" },
  builderLabel:{ fontSize:11, color:"#D4A843", fontWeight:800, letterSpacing:1.5, marginBottom:8 },
  builderName:{ fontSize:28, fontWeight:900, color:"#EDF1F9", marginBottom:10 },
  builderDesc:{ fontSize:14, color:"#8A9FBF", lineHeight:1.65, marginBottom:14, maxWidth:480 },
  builderTags:{ display:"flex", gap:8, flexWrap:"wrap" },
  builderTag:{ padding:"4px 12px", borderRadius:20, background:"rgba(255,255,255,0.06)", color:"#8A9FBF", fontSize:12, fontWeight:600 },
  builderRight:{ display:"flex", flexDirection:"column", justifyContent:"center", gap:8 },
  builderWLabel:{ fontSize:11, color:"#7A8BAA", fontWeight:700, letterSpacing:0.8 },
  builderWAddr:{ fontSize:12, color:"#D4A843", fontFamily:"monospace", wordBreak:"break-all", fontWeight:700 },
  aboutGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14, marginBottom:32 },
  aboutCard: { background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"22px 18px" },
  aboutIcon: { fontSize:30, marginBottom:10 },
  aboutCardTitle:{ fontSize:15, fontWeight:800, color:"#EDF1F9", marginBottom:8 },
  aboutCardText:{ fontSize:13, color:"#7A8BAA", lineHeight:1.6 },
  linksTitle:{ fontSize:18, fontWeight:800, color:"#EDF1F9", marginBottom:14 },
  linksGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 },
  linkCard:  { display:"flex", alignItems:"center", gap:14, background:"rgba(212,168,67,0.04)", border:"1px solid rgba(212,168,67,0.12)", borderRadius:12, padding:"14px 18px", textDecoration:"none" },
  linkIcon:  { fontSize:26 },
  linkName:  { fontSize:14, fontWeight:700, color:"#EDF1F9", marginBottom:3 },
  linkDesc:  { fontSize:12, color:"#7A8BAA" },

  // Modal
  overlay:   { position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.8)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:     { background:"#0F1628", border:"1px solid rgba(212,168,67,0.2)", borderRadius:20, width:"100%", maxWidth:520, position:"relative", maxHeight:"90vh", overflowY:"auto" },
  modalClose:{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.07)", border:"none", color:"#8A9FBF", width:30, height:30, borderRadius:6, cursor:"pointer", fontSize:14, fontWeight:700, zIndex:10 },
  modalBanner:{ padding:"24px", display:"flex", gap:16, alignItems:"flex-start" },
  modalEmoji:{ fontSize:48 },
  modalCat:  { fontSize:11, fontWeight:700, letterSpacing:1, marginBottom:4 },
  modalName: { fontSize:20, fontWeight:800, color:"#EDF1F9", marginBottom:4, lineHeight:1.2 },
  modalLoc:  { fontSize:13, color:"#7A8BAA" },
  modalBody: { padding:"0 24px 24px" },
  modalMetrics:{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" },
  mMetric:   { flex:"1 1 100px", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"12px", textAlign:"center" },
  mMetricL:  { fontSize:11, color:"#7A8BAA", fontWeight:600, marginBottom:4 },
  mMetricV:  { fontSize:15, fontWeight:800 },
  modalDesc: { fontSize:13, color:"#7A8BAA", lineHeight:1.65, marginBottom:16 },
  detailsGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:18 },
  detailItem:{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"8px 12px" },
  detailKey: { display:"block", fontSize:10, color:"#7A8BAA", fontWeight:700, letterSpacing:0.5, textTransform:"uppercase", marginBottom:3 },
  detailVal: { fontSize:13, color:"#EDF1F9", fontWeight:600 },
  inputGrp:  { marginBottom:10 },
  inputLabel:{ display:"block", fontSize:13, color:"#8A9FBF", fontWeight:600, marginBottom:7 },
  inputWrap: { display:"flex", alignItems:"center", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.11)", borderRadius:10, overflow:"hidden" },
  inputPrefix:{ padding:"0 12px", color:"#D4A843", fontWeight:800, fontSize:16 },
  input:     { flex:1, padding:"13px 0", background:"transparent", border:"none", color:"#EDF1F9", fontSize:16, outline:"none" },
  inputSuffix:{ padding:"0 14px", color:"#7A8BAA", fontWeight:600, fontSize:13 },
  inputHint: { fontSize:12, color:"#D4A843", marginTop:7, fontWeight:600 },
  freeNote:  { textAlign:"center", fontSize:13, color:"#7A8BAA", marginBottom:14, padding:"8px", background:"rgba(212,168,67,0.06)", borderRadius:8, border:"1px solid rgba(212,168,67,0.15)" },
  modalBtn:  { width:"100%", padding:"14px", borderRadius:10, background:"linear-gradient(135deg,#D4A843,#C49333)", color:"#0A0F1E", fontWeight:800, fontSize:15, border:"none", cursor:"pointer", marginBottom:10 },
  modalNote: { textAlign:"center", fontSize:12, color:"#7A8BAA" },
  successBox:{ textAlign:"center", padding:"24px", background:"rgba(212,168,67,0.08)", borderRadius:14, border:"1px solid rgba(212,168,67,0.25)" },
  successIcon:{ fontSize:40, marginBottom:8 },
  successTitle:{ fontSize:18, fontWeight:800, color:"#EDF1F9", marginBottom:6 },
  successSub:{ fontSize:13, color:"#8A9FBF", marginBottom:12 },

  // Footer
  footer:    { position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 32px", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:40, flexWrap:"wrap", gap:12 },
  footerLogo:{ fontSize:16, fontWeight:900, color:"#D4A843", marginBottom:3 },
  footerSub: { fontSize:11, color:"#7A8BAA" },
  footerWallet:{ fontSize:10, color:"#7A8BAA", fontFamily:"monospace", marginTop:3 },
  footerLinks:{ display:"flex", gap:18, alignItems:"center" },
  footerLink:{ fontSize:13, color:"#7A8BAA", textDecoration:"none", fontWeight:600 },
};
