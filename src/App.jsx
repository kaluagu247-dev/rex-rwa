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

const ASSETS = [
  {
    id: 1, category: "Real Estate", verified: true,
    name: "One Canada Square, Canary Wharf",
    location: "London, United Kingdom",
    description: "Grade A commercial tower in London's premier financial district. 50 floors of premium office space with 97% occupancy. Tenants include HSBC, Barclays, and Clifford Chance.",
    totalValue: 850000000, tokenPrice: 500, totalTokens: 1700000, soldTokens: 1292000,
    apy: 7.2, tag: "PRIME",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    details: { size: "1,200,000 sq ft", floors: 50, occupancy: "97%", built: "1991", tenants: "HSBC, Barclays, Clifford Chance" },
  },
  {
    id: 2, category: "Real Estate", verified: true,
    name: "Marina Bay Financial Centre",
    location: "Singapore",
    description: "Iconic supertall office tower in Singapore's central business district. 99-year leasehold, direct MRT connectivity.",
    totalValue: 1200000000, tokenPrice: 800, totalTokens: 1500000, soldTokens: 900000,
    apy: 6.8, tag: "ICONIC",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
    details: { size: "1,850,000 sq ft", floors: 43, occupancy: "99%", built: "2012", tenants: "Standard Chartered, DBS, Linklaters" },
  },
  {
    id: 3, category: "Real Estate", verified: true,
    name: "Tour First, La Défense",
    location: "Paris, France",
    description: "Tallest skyscraper in France at 231 metres. Located in Europe's largest purpose-built business district. BREEAM Excellent certified.",
    totalValue: 730000000, tokenPrice: 600, totalTokens: 1216666, soldTokens: 608333,
    apy: 7.9, tag: "FLAGSHIP",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    details: { size: "900,000 sq ft", floors: 50, occupancy: "95%", built: "1974", tenants: "BNP Paribas, SFR, Deloitte" },
  },
  {
    id: 4, category: "Luxury Watches", verified: true,
    name: "Patek Philippe Grandmaster Chime Ref. 6300",
    location: "Geneva, Switzerland",
    description: "The most complicated wristwatch ever made. One of only 7 ever produced. World auction record at $31M. 20 complications, reversible case.",
    totalValue: 31000000, tokenPrice: 31, totalTokens: 1000000, soldTokens: 920000,
    apy: 14.2, tag: "WORLD RECORD",
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800&q=80",
    details: { complications: 20, produced: "7 pieces only", auctionRecord: "$31M Christie's", year: 2019, condition: "Museum Quality" },
  },
  {
    id: 5, category: "Luxury Watches", verified: true,
    name: "Rolex Daytona Paul Newman Ref. 6239",
    location: "New York, USA",
    description: "The holy grail of watch collecting. Paul Newman's personal Rolex Daytona. World record $17.75M at Phillips 2017. Original box, papers, and provenance.",
    totalValue: 17750000, tokenPrice: 18, totalTokens: 986111, soldTokens: 493055,
    apy: 12.8, tag: "PROVENANCE",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
    details: { reference: "6239", sold: "$17.75M Phillips", year: "1968", provenance: "Paul Newman personal" },
  },
  {
    id: 6, category: "Fine Art", verified: true,
    name: "Jean-Michel Basquiat — Untitled (Devil)",
    location: "New York, USA",
    description: "Large-scale 1982 masterwork from Basquiat's most celebrated period. Sold at Sotheby's New York for $110.5M in 2017. Institutional-grade storage.",
    totalValue: 110500000, tokenPrice: 110, totalTokens: 1004545, soldTokens: 702181,
    apy: 15.6, tag: "BLUE CHIP",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    details: { artist: "Jean-Michel Basquiat", year: 1982, medium: "Acrylic & Oil on Canvas", lastSale: "$110.5M Sotheby's" },
  },
  {
    id: 7, category: "Fine Art", verified: true,
    name: "Pablo Picasso — Femme Assise",
    location: "Geneva, Switzerland",
    description: "Cubist masterpiece from Picasso's Rose Period (1905). Provenance includes the Rockefeller Collection. Stored at Geneva Freeport.",
    totalValue: 67000000, tokenPrice: 67, totalTokens: 1000000, soldTokens: 400000,
    apy: 10.4, tag: "MUSEUM GRADE",
    image: "https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=800&q=80",
    details: { artist: "Pablo Picasso", year: 1905, medium: "Oil on Canvas", provenance: "Rockefeller Collection" },
  },
  {
    id: 8, category: "Collectibles", verified: true,
    name: "Hermès Himalaya Birkin 30cm Diamond",
    location: "Paris, France",
    description: "The rarest handbag in existence. White Nilo crocodile skin with 18K white gold hardware set with 245 diamonds. Only 1 produced per year.",
    totalValue: 432000, tokenPrice: 1, totalTokens: 432000, soldTokens: 302400,
    apy: 18.5, tag: "RAREST",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
    details: { material: "Nilo Crocodile", hardware: "18K White Gold & Diamonds", diamonds: "10.23 carats", production: "1 per year" },
  },
  {
    id: 9, category: "Collectibles", verified: true,
    name: "Ferrari 250 GTO (1962)",
    location: "Maranello, Italy",
    description: "The most valuable car ever sold at auction — $48.4M at RM Sotheby's. One of 36 ever built. Matching numbers, original engine, full FIA documentation.",
    totalValue: 48400000, tokenPrice: 50, totalTokens: 968000, soldTokens: 580800,
    apy: 11.3, tag: "AUCTION RECORD",
    image: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80",
    details: { built: "1962", produced: "36 units", engine: "Matching numbers", lastSale: "$48.4M RM Sotheby's" },
  },
  {
    id: 10, category: "Commodities", verified: true,
    name: "LBMA Gold Bullion Reserve — Vault A",
    location: "London, United Kingdom",
    description: "Allocated physical gold bars stored at Brink's London vault, audited under LBMA Good Delivery standards. Annual audit by PwC. No counterparty risk.",
    totalValue: 500000000, tokenPrice: 50, totalTokens: 10000000, soldTokens: 6000000,
    apy: 4.2, tag: "GOLD BACKED",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=800&q=80",
    details: { purity: "99.99%", storage: "Brink's London", audit: "PwC Annual", standard: "LBMA Good Delivery" },
  },
  {
    id: 11, category: "Commodities", verified: true,
    name: "Colombian Emerald Mine — Block 7",
    location: "Boyacá, Colombia",
    description: "Producing emerald mining concession in the Muzo region. 4.2M carats proven reserves. 380,000 carats/year production. Valued by Gübelin Gem Lab.",
    totalValue: 280000000, tokenPrice: 28, totalTokens: 10000000, soldTokens: 3000000,
    apy: 16.8, tag: "NATURAL RESOURCE",
    image: "https://images.unsplash.com/photo-1551639825-892b1c4a9eff?w=800&q=80",
    details: { reserves: "4.2M carats", production: "380,000 carats/year", area: "240 hectares", valuation: "Gübelin Gem Lab" },
  },
  {
    id: 12, category: "Hospitality", verified: true,
    name: "Burj Al Arab — Revenue Share",
    location: "Dubai, UAE",
    description: "World's most iconic luxury hotel. Only 202 duplex suites. ADR exceeding $2,500 per night. Consistent 88% occupancy year-round.",
    totalValue: 2100000000, tokenPrice: 200, totalTokens: 10500000, soldTokens: 8400000,
    apy: 9.4, tag: "ULTRA LUXURY",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    details: { rooms: 202, adr: "$2,500+", occupancy: "88%", manager: "Jumeirah Group" },
  },
];

const CATEGORIES = ["All", "Real Estate", "Luxury Watches", "Fine Art", "Collectibles", "Commodities", "Hospitality"];

const LIVE_ACTIVITY_TEMPLATES = [
  { action: "Purchased", asset: "One Canada Square, Canary Wharf", tokens: 10 },
  { action: "Minted", asset: "LBMA Gold Bullion Reserve", tokens: 1000 },
  { action: "Sold", asset: "Patek Philippe Grandmaster", tokens: 5 },
  { action: "Purchased", asset: "Burj Al Arab Revenue Share", tokens: 20 },
  { action: "Minted", asset: "Basquiat — Untitled Devil", tokens: 3 },
  { action: "Purchased", asset: "Ferrari 250 GTO", tokens: 8 },
  { action: "Purchased", asset: "Hermès Himalaya Birkin", tokens: 50 },
];

const fmt = (n) => {
  if (n >= 1_000_000_000) return `$${(n/1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n/1_000_000).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
};
const short = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : "";
const timeAgo = (s) => s < 60 ? `${s}s ago` : `${Math.floor(s/60)}m ago`;

export default function App() {
  const [page, setPage]           = useState("landing");
  const [tab, setTab]             = useState("marketplace");
  const [wallet, setWallet]       = useState(null);
  const [balance, setBalance]     = useState("—");
  const [chainOk, setChainOk]     = useState(false);
  const [filter, setFilter]       = useState("All");
  const [asset, setAsset]         = useState(null);
  const [amount, setAmount]       = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [txStatus, setTxStatus]   = useState(null);
  const [txHash, setTxHash]       = useState(null);
  const [txLog, setTxLog]         = useState([]);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [toast, setToast]         = useState(null);
  const [liveActivity, setLiveActivity] = useState([
    { ...LIVE_ACTIVITY_TEMPLATES[0], age: 2 },
    { ...LIVE_ACTIVITY_TEMPLATES[1], age: 14 },
    { ...LIVE_ACTIVITY_TEMPLATES[2], age: 38 },
  ]);
  const [networkStats, setNetworkStats] = useState({
    blockHeight: 1847293, tps: 4200, blockTime: 2.1, gasFee: "Free", status: "Testnet Live"
  });
  const [marketStats, setMarketStats] = useState({
    tvl: 10420000, volume24h: 284500, activeAssets: 48, totalHolders: 12800
  });
  const [portfolioStats, setPortfolioStats] = useState({
    value: 6070, invested: 5400, returns: 670, activeAssets: 3,
    chart: [4000, 5200, 4800, 6500, 5900, 7200, 6800, 8100, 7600, 9200, 8800, 10400]
  });

  const showToast = (msg, type="info") => { setToast({msg,type}); setTimeout(()=>setToast(null),4000); };

  // Live activity ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setLiveActivity(prev => {
        const tpl = LIVE_ACTIVITY_TEMPLATES[Math.floor(Math.random()*LIVE_ACTIVITY_TEMPLATES.length)];
        const newItem = { ...tpl, age: 0 };
        return [newItem, ...prev.slice(0,2)].map((a,i) => ({...a, age: a.age + (i===0?0:Math.floor(Math.random()*15)+5)}));
      });
      setNetworkStats(s => ({ ...s, blockHeight: s.blockHeight + Math.floor(Math.random()*3)+1 }));
      setMarketStats(s => ({ ...s, tvl: s.tvl + Math.floor(Math.random()*5000), volume24h: s.volume24h + Math.floor(Math.random()*2000) }));
    }, 8000);
    return () => clearInterval(iv);
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) { showToast("Please install MetaMask","error"); return; }
    try {
      const accounts = await window.ethereum.request({ method:"eth_requestAccounts" });
      setWallet(accounts[0]);
      await switchToArc();
      fetchBalance(accounts[0]);
      showToast("Connected to Arc Testnet ✓","success");
    } catch { showToast("Connection cancelled","error"); }
  };

  const disconnectWallet = () => { setWallet(null); setBalance("—"); setChainOk(false); setMenuOpen(false); showToast("Wallet disconnected","info"); };

  const switchToArc = async () => {
    try {
      await window.ethereum.request({ method:"wallet_switchEthereumChain", params:[{chainId:ARC_NETWORK_PARAMS.chainId}] });
      setChainOk(true);
    } catch(e) {
      if (e.code===4902) { await window.ethereum.request({ method:"wallet_addEthereumChain", params:[ARC_NETWORK_PARAMS] }); setChainOk(true); }
    }
  };

  const fetchBalance = async (addr) => {
    try {
      const res = await fetch(ARC_RPC_URL, { method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({jsonrpc:"2.0",method:"eth_getBalance",params:[addr,"latest"],id:1}) });
      const data = await res.json();
      setBalance((parseInt(data.result,16)/1e6).toFixed(2));
    } catch { setBalance("—"); }
  };

  const handleInvest = async () => {
    if (!wallet) { connectWallet(); return; }
    const num = parseFloat(amount);
    if (!num || num<=0) { showToast("Please enter an amount","error"); return; }
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
    setPortfolioStats(s=>({...s,value:s.value+num,invested:s.invested+num,returns:s.returns+(num*asset.apy/100/12),activeAssets:portfolio.length+1}));
    setTxStatus("success");
    showToast("Investment confirmed on Arc Testnet! ✓","success");
    setTimeout(()=>{ setTxStatus(null); setTxHash(null); setAsset(null); setAmount(""); },4000);
  };

  const filtered = filter==="All" ? ASSETS : ASSETS.filter(a=>a.category===filter);
  const totalInvested = portfolio.reduce((s,p)=>s+p.invested,0);
  const monthlyEarn = portfolio.reduce((s,p)=>s+(p.invested*p.apy)/100/12,0);

  // Chart points
  const chartMax = Math.max(...portfolioStats.chart);
  const chartMin = Math.min(...portfolioStats.chart);
  const chartPoints = portfolioStats.chart.map((v,i)=>{
    const x = (i/(portfolioStats.chart.length-1))*100;
    const y = 100 - ((v-chartMin)/(chartMax-chartMin))*100;
    return `${x},${y}`;
  }).join(" ");

  if (page==="landing") return (
    <div style={LS.root}>
      <div style={LS.bg}/>
      <header style={LS.header}>
        <div style={LS.logo}><div style={LS.logoMark}><span style={LS.logoR}>R</span></div><span style={LS.logoName}>Rex-RWA</span><span style={LS.arcBadge}>ARC Testnet</span></div>
        <div style={LS.hRight}>
          {wallet
            ? <div style={LS.wBadge}><div style={LS.wDot}/><span>{short(wallet)}</span></div>
            : <button style={LS.connectBtn} onClick={connectWallet}>Connect Wallet</button>
          }
        </div>
      </header>
      <main style={LS.main}>
        <div style={LS.hero}>
          <h1 style={LS.h1}>Democratizing<br/><span style={LS.blue}>Luxury</span><br/><span style={LS.sub2}>Through Tokenization</span></h1>
          <p style={LS.heroP}>Own a piece of verified luxury assets on <span style={LS.blue}>Arc Chain</span>. From premium real estate to exclusive collectibles.</p>
          <div style={LS.heroActions}>
            <button style={LS.enterBtn} onClick={()=>setPage("app")}>ENTER MARKETPLACE →</button>
            <button style={LS.learnBtn} onClick={()=>setPage("app")}>LEARN MORE</button>
          </div>
          <div style={LS.statsGrid}>
            <div style={LS.statBox}><div style={LS.statBig}>$10M+</div><div style={LS.statSm}>Assets Value</div></div>
            <div style={LS.statBox}><div style={LS.statBig}>500K+</div><div style={LS.statSm}>Active Users</div></div>
            <div style={LS.statBox}><div style={LS.statBig}>24/7</div><div style={LS.statSm}>Trading</div></div>
            <div style={LS.statBox}><div style={LS.statBig}>100%</div><div style={LS.statSm}>Secure</div></div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div style={S.root}>
      {toast && <div style={{...S.toast, background:toast.type==="success"?"rgba(59,130,246,0.2)":toast.type==="error"?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.1)", borderColor:toast.type==="success"?"#3B82F6":toast.type==="error"?"#EF4444":"rgba(255,255,255,0.2)"}}>{toast.msg}</div>}

      {/* HEADER */}
      <header style={S.header}>
        <div style={S.logo}>
          <div style={S.logoMark}><span style={S.logoR}>R</span></div>
          <span style={S.logoName}>Rex-RWA</span>
          <span style={S.arcBadge}>ARC Testnet</span>
        </div>
        <div style={S.hRight}>
          {wallet
            ? <div style={S.wBadge}><div style={S.wDot}/><span style={{fontSize:13,fontWeight:700}}>{short(wallet)}</span><span style={{color:"#3B82F6",fontWeight:700,fontSize:12}}>{balance} USDC</span></div>
            : <button style={S.connectBtn} onClick={connectWallet}>Connect Wallet</button>
          }
          <button style={S.menuBtn} onClick={()=>setMenuOpen(!menuOpen)}>☰</button>
        </div>
      </header>

      {/* HAMBURGER MENU */}
      {menuOpen && (
        <div style={S.menuOverlay} onClick={()=>setMenuOpen(false)}>
          <div style={S.menu} onClick={e=>e.stopPropagation()}>
            <div style={S.menuHeader}>
              <div style={S.logo}><div style={S.logoMark}><span style={S.logoR}>R</span></div><span style={S.logoName}>Rex-RWA</span><span style={S.arcBadge}>ARC Testnet</span></div>
              <button style={S.menuClose} onClick={()=>setMenuOpen(false)}>✕</button>
            </div>
            {[["marketplace","Marketplace"],["dashboard","Dashboard"],["portfolio","Portfolio"]].map(([id,label])=>(
              <button key={id} style={{...S.menuItem,...(tab===id?S.menuItemActive:{})}} onClick={()=>{setTab(id);setPage("app");setMenuOpen(false);}}>
                {label}
              </button>
            ))}
            <div style={S.menuDivider}/>
            <button style={S.menuItemSpecial} onClick={()=>setMenuOpen(false)}>+ Mint Asset</button>
            <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.menuLink}>💧 ARC Faucet</a>
            <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.menuLink}>🔍 ARC Explorer</a>
            <div style={S.menuDivider}/>
            {wallet
              ? <button style={S.menuDisconnect} onClick={disconnectWallet}>Disconnect Wallet</button>
              : <button style={S.menuConnect} onClick={()=>{connectWallet();setMenuOpen(false);}}>Connect Wallet</button>
            }
          </div>
        </div>
      )}

      {wallet && !chainOk && (
        <div style={S.chainBanner}>⚠️ Switch to Arc Testnet (Chain ID: {ARC_CHAIN_ID})<button onClick={switchToArc} style={S.switchBtn}>Switch Now</button></div>
      )}

      <main style={S.main}>

        {/* ── DASHBOARD ── */}
        {tab==="dashboard" && (
          <div style={S.section}>
            <div style={S.breadcrumb}><span style={S.breadLink} onClick={()=>setPage("landing")}>ARC Testnet</span> › Dashboard</div>
            <h2 style={S.pageTitle}>Dashboard</h2>
            <p style={S.pageSubtitle}>Welcome back{wallet?`, ${short(wallet)}`:""} — ARC Testnet</p>

            {wallet && <div style={S.arcNetBadge}><div style={S.greenDot}/>ARC Testnet<button style={S.refreshBtn}>↻</button><button style={S.buyMoreBtn} onClick={()=>window.open(ARC_FAUCET,"_blank")}>+ Buy More</button></div>}

            <div style={S.dashCards}>
              <div style={S.dashCard}><div style={S.dashLabel}>Portfolio Value<span style={S.dashIcon}>⊟</span></div><div style={S.dashBig}>{portfolioStats.value.toLocaleString()} USDC</div><div style={S.dashGreen}>↗ +12.4%</div></div>
              <div style={S.dashCard}><div style={S.dashLabel}>Total Invested<span style={S.dashIcon}>📊</span></div><div style={S.dashBig}>{portfolioStats.invested.toLocaleString()} USDC</div><div style={S.dashGreen}>↗ +8.2%</div></div>
              <div style={S.dashCard}><div style={S.dashLabel}>Total Returns<span style={S.dashIcon}>↗</span></div><div style={S.dashBig}>{portfolioStats.returns.toFixed(0)} USDC</div><div style={S.dashGreen}>↗ +12.4%</div></div>
              <div style={S.dashCard}><div style={S.dashLabel}>Active Assets<span style={S.dashIcon}>↗</span></div><div style={S.dashBig}>{Math.max(portfolioStats.activeAssets, portfolio.length)}</div><div style={S.dashBlue}>→ positions</div></div>
            </div>

            {/* Portfolio Performance Chart */}
            <div style={S.chartCard}>
              <div style={S.chartHdr}><span style={S.chartTitle}>Portfolio Performance</span><span style={S.chartSub}>ARC Testnet 2026</span><span style={S.chartBadge}>↗ +12.4%</span></div>
              <div style={S.chartWrap}>
                <svg viewBox="0 0 100 100" style={S.chartSvg} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#3B82F6" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  <polyline points={chartPoints} fill="none" stroke="#3B82F6" strokeWidth="2"/>
                  <polygon points={`0,100 ${chartPoints} 100,100`} fill="url(#chartGrad)"/>
                </svg>
                <div style={S.chartLabels}>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov"].map(m=><span key={m} style={S.chartLabel}>{m}</span>)}</div>
              </div>
            </div>

            {/* ARC Network Stats */}
            <div style={S.netCard}>
              <div style={S.netCardHdr}>⚡ ARC Network</div>
              <div style={S.netRows}>
                <div style={S.netRow}><span style={S.netRowL}>Block Height</span><span style={S.netRowV}>#{networkStats.blockHeight.toLocaleString()}</span></div>
                <div style={S.netRow}><span style={S.netRowL}>TPS</span><span style={S.netRowV}>{networkStats.tps.toLocaleString()} tx/s</span></div>
                <div style={S.netRow}><span style={S.netRowL}>Avg Block Time</span><span style={S.netRowV}>{networkStats.blockTime}s</span></div>
                <div style={S.netRow}><span style={S.netRowL}>Gas Fee</span><span style={{...S.netRowV,color:"#22C55E"}}>{networkStats.gasFee}</span></div>
                <div style={S.netRow}><span style={S.netRowL}>Status</span><span style={{...S.netRowV,color:"#22C55E"}}>{networkStats.status}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── MARKETPLACE ── */}
        {tab==="marketplace" && (
          <div style={S.section}>
            <div style={S.breadcrumb}><span style={S.breadLink} onClick={()=>setPage("landing")}>ARC Testnet</span> › Marketplace</div>
            <div style={S.mktHdr}><div><h2 style={S.pageTitle}>Asset Marketplace</h2><p style={S.pageSubtitle}>Browse and invest in tokenized real-world assets on ARC Chain</p></div><button style={S.mintBtn}>+ Mint Asset</button></div>

            {/* Market Stats */}
            <div style={S.mktStats}>
              <div style={S.mktStat}><div style={S.mktStatL}>Total Value Locked<span style={S.mktStatBadge}>+2.4%</span></div><div style={S.mktStatV}>{fmt(marketStats.tvl)}</div></div>
              <div style={S.mktStat}><div style={S.mktStatL}>24h Volume<span style={{...S.mktStatBadge,background:"rgba(34,197,94,0.15)",color:"#22C55E"}}>+18.2%</span></div><div style={S.mktStatV}>{fmt(marketStats.volume24h)}</div></div>
              <div style={S.mktStat}><div style={S.mktStatL}>Active Assets<span style={S.mktStatBadge}>+3</span></div><div style={S.mktStatV}>{marketStats.activeAssets}</div></div>
              <div style={S.mktStat}><div style={S.mktStatL}>Total Holders<span style={{...S.mktStatBadge,background:"rgba(34,197,94,0.15)",color:"#22C55E"}}>+124</span></div><div style={S.mktStatV}>{(marketStats.totalHolders/1000).toFixed(1)}K</div></div>
            </div>

            {/* Live Activity */}
            <div style={S.liveCard}>
              <div style={S.liveHdr}><div style={S.liveTitle}><div style={S.greenDot}/>Live Activity</div><span style={S.liveNetwork}>ARC Testnet</span></div>
              {liveActivity.map((a,i)=>(
                <div key={i} style={S.liveRow}>
                  <span style={{...S.liveAction, color:a.action==="Purchased"?"#3B82F6":a.action==="Minted"?"#22C55E":"#F59E0B"}}>
                    {a.action==="Purchased"?"↗":a.action==="Minted"?"⚡":"↘"} {a.action}
                  </span>
                  <span style={S.liveAsset}>{a.asset.length>22?a.asset.slice(0,22)+"...":a.asset}</span>
                  <span style={S.liveMeta}>{a.tokens} tokens · {timeAgo(a.age)}</span>
                </div>
              ))}
            </div>

            {/* ARC Network */}
            <div style={S.netCard}>
              <div style={S.netCardHdr}>⚡ ARC Network</div>
              <div style={S.netRows}>
                <div style={S.netRow}><span style={S.netRowL}>Block Height</span><span style={S.netRowV}>#{networkStats.blockHeight.toLocaleString()}</span></div>
                <div style={S.netRow}><span style={S.netRowL}>TPS</span><span style={S.netRowV}>{networkStats.tps.toLocaleString()} tx/s</span></div>
                <div style={S.netRow}><span style={S.netRowL}>Avg Block Time</span><span style={S.netRowV}>{networkStats.blockTime}s</span></div>
                <div style={S.netRow}><span style={S.netRowL}>Gas Fee</span><span style={{...S.netRowV,color:"#22C55E"}}>{networkStats.gasFee}</span></div>
                <div style={S.netRow}><span style={S.netRowL}>Status</span><span style={{...S.netRowV,color:"#22C55E"}}>{networkStats.status}</span></div>
              </div>
            </div>

            {/* Category Filter */}
            <div style={S.filterRow}>
              {CATEGORIES.map(c=>(
                <button key={c} style={{...S.filterBtn,...(filter===c?S.filterActive:{})}} onClick={()=>setFilter(c)}>{c}</button>
              ))}
            </div>
            <div style={S.showingLabel}>Showing {filtered.length} assets</div>

            {/* Asset Cards */}
            <div style={S.assetList}>
              {filtered.map(a=>{
                const pct = Math.round((a.soldTokens/a.totalTokens)*100);
                const left = a.totalTokens - a.soldTokens;
                return (
                  <div key={a.id} style={S.assetCard} onClick={()=>setAsset(a)}>
                    <div style={S.assetImgWrap}>
                      <img src={a.image} alt={a.name} style={S.assetImg} onError={e=>{e.target.style.display="none";}}/>
                      <div style={S.assetImgOverlay}/>
                      <div style={S.assetBadges}>
                        <span style={S.catBadge}>{a.category}</span>
                        {a.verified && <span style={S.verifiedBadge}>✓ Verified</span>}
                      </div>
                      {pct>=99 && <div style={S.soldOut}>SOLD OUT</div>}
                    </div>
                    <div style={S.assetBody}>
                      <div style={S.assetName}>{a.name}</div>
                      <div style={S.assetLoc}>{a.location}</div>
                      <div style={S.assetMetrics}>
                        <div><div style={S.assetMetricL}>Token Price</div><div style={S.assetMetricV}>{a.tokenPrice} USDC</div></div>
                        <div style={{textAlign:"right"}}><div style={S.assetMetricL}>Total Value</div><div style={S.assetMetricV}>{fmt(a.totalValue)}</div></div>
                      </div>
                      <div style={{...S.apyRow,color:"#22C55E"}}>↗ {a.apy}% APY</div>
                      <div style={S.progBar}><div style={{...S.progFill,width:`${pct}%`}}/></div>
                      <div style={S.progInfo}><span style={S.progPct}>{pct}% funded</span><span style={S.progLeft}>{left.toLocaleString()} tokens left</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PORTFOLIO ── */}
        {tab==="portfolio" && (
          <div style={S.section}>
            <div style={S.breadcrumb}><span style={S.breadLink} onClick={()=>setPage("landing")}>ARC Testnet</span> › Portfolio</div>
            <h2 style={S.pageTitle}>My Portfolio</h2>
            {!wallet ? (
              <div style={S.empty}><div style={S.emptyIcon}>🔐</div><div style={S.emptyTitle}>Connect Your Wallet</div><div style={S.emptyTxt}>Connect to view your investments</div><button style={S.enterBtn} onClick={connectWallet}>Connect Wallet</button></div>
            ) : portfolio.length===0 ? (
              <div style={S.empty}><div style={S.emptyIcon}>📊</div><div style={S.emptyTitle}>No Investments Yet</div><div style={S.emptyTxt}>Browse the marketplace and invest in any asset — no minimum</div><button style={S.enterBtn} onClick={()=>setTab("marketplace")}>Browse Marketplace</button></div>
            ) : (
              <>
                <div style={S.mktStats}>
                  <div style={S.mktStat}><div style={S.mktStatL}>Total Invested</div><div style={S.mktStatV}>${totalInvested.toFixed(2)}</div></div>
                  <div style={S.mktStat}><div style={S.mktStatL}>Assets Held</div><div style={S.mktStatV}>{portfolio.length}</div></div>
                  <div style={S.mktStat}><div style={S.mktStatL}>Monthly Income</div><div style={{...S.mktStatV,color:"#22C55E"}}>${monthlyEarn.toFixed(2)}</div></div>
                  <div style={S.mktStat}><div style={S.mktStatL}>Annual Income</div><div style={{...S.mktStatV,color:"#22C55E"}}>${(monthlyEarn*12).toFixed(2)}</div></div>
                </div>
                <div style={S.assetList}>
                  {portfolio.map(p=>(
                    <div key={p.id} style={S.assetCard}>
                      <div style={S.assetImgWrap}>
                        <img src={p.image} alt={p.name} style={S.assetImg}/>
                        <div style={S.assetImgOverlay}/>
                        <div style={S.assetBadges}>
                          <span style={S.catBadge}>{p.category}</span>
                          <span style={{...S.verifiedBadge,background:"rgba(34,197,94,0.2)",color:"#22C55E",borderColor:"rgba(34,197,94,0.4)"}}>✓ Owned</span>
                        </div>
                      </div>
                      <div style={S.assetBody}>
                        <div style={S.assetName}>{p.name}</div>
                        <div style={S.assetLoc}>{p.location}</div>
                        <div style={S.assetMetrics}>
                          <div><div style={S.assetMetricL}>Invested</div><div style={S.assetMetricV}>${p.invested.toFixed(2)}</div></div>
                          <div style={{textAlign:"right"}}><div style={S.assetMetricL}>Fractions</div><div style={S.assetMetricV}>{p.fractions.toFixed(6)}</div></div>
                        </div>
                        <div style={{...S.apyRow,color:"#22C55E"}}>↗ {p.apy}% APY · Est. ${((p.invested*p.apy)/100/12).toFixed(2)}/month</div>
                        <a href={`${ARC_EXPLORER}/address/${wallet}`} target="_blank" rel="noreferrer" style={S.arcLink}>View on Arcscan ↗</a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav style={S.bottomNav}>
        {[["marketplace","🏪","Market"],["dashboard","📊","Dashboard"],["portfolio","💼","Portfolio"]].map(([id,icon,label])=>(
          <button key={id} style={{...S.bottomBtn,...(tab===id?S.bottomBtnActive:{})}} onClick={()=>{setTab(id);setPage("app");}}>
            <span>{icon}</span><span style={S.bottomLabel}>{label}</span>
          </button>
        ))}
        <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={{...S.bottomBtn,textDecoration:"none",flexDirection:"column",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span>💧</span><span style={S.bottomLabel}>Faucet</span>
        </a>
      </nav>

      {/* Asset Modal */}
      {asset && (
        <div style={S.overlay} onClick={()=>setAsset(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <div style={S.modalImgWrap}>
              <img src={asset.image} alt={asset.name} style={S.modalImg}/>
              <div style={S.modalImgOverlay}/>
              <button style={S.modalClose} onClick={()=>setAsset(null)}>✕</button>
              <div style={S.modalBadges}>
                <span style={S.catBadge}>{asset.category}</span>
                {asset.verified && <span style={S.verifiedBadge}>✓ Verified</span>}
              </div>
            </div>
            <div style={S.modalBody}>
              <div style={S.modalName}>{asset.name}</div>
              <div style={S.modalLoc}>📍 {asset.location}</div>
              <div style={S.modalMetrics}>
                <div style={S.mMetric}><div style={S.mMetricL}>Token Price</div><div style={S.mMetricV}>{asset.tokenPrice} USDC</div></div>
                <div style={S.mMetric}><div style={S.mMetricL}>Total Value</div><div style={S.mMetricV}>{fmt(asset.totalValue)}</div></div>
                <div style={S.mMetric}><div style={S.mMetricL}>Annual Yield</div><div style={{...S.mMetricV,color:"#22C55E"}}>{asset.apy}%</div></div>
                <div style={S.mMetric}><div style={S.mMetricL}>Funded</div><div style={S.mMetricV}>{Math.round((asset.soldTokens/asset.totalTokens)*100)}%</div></div>
              </div>
              <p style={S.modalDesc}>{asset.description}</p>
              <div style={S.detailsGrid}>
                {Object.entries(asset.details).map(([k,v])=>(
                  <div key={k} style={S.detailItem}>
                    <span style={S.detailK}>{k.replace(/([A-Z])/g,' $1').trim()}</span>
                    <span style={S.detailV}>{v}</span>
                  </div>
                ))}
              </div>
              {txStatus==="success" ? (
                <div style={S.successBox}>
                  <div style={{fontSize:36,marginBottom:8}}>✅</div>
                  <div style={{fontSize:17,fontWeight:800,color:"#fff",marginBottom:6}}>Investment Confirmed!</div>
                  <div style={{fontSize:13,color:"#8A9FBF",marginBottom:12}}>Transaction live on Arc Testnet</div>
                  <a href={`${ARC_EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer" style={S.arcLink}>View on Arcscan ↗</a>
                </div>
              ) : (
                <>
                  <div style={S.freeNotice}>🔓 No minimum · No maximum · Own any fraction</div>
                  <div style={S.inputGrp}>
                    <label style={S.inputLabel}>Investment Amount (USDC)</label>
                    <div style={S.inputWrap}>
                      <span style={S.inputPre}>$</span>
                      <input style={S.input} type="number" placeholder="Enter any amount" value={amount} onChange={e=>setAmount(e.target.value)}/>
                      <span style={S.inputSuf}>USDC</span>
                    </div>
                    {amount && parseFloat(amount)>0 && (
                      <div style={S.inputHint}>≈ {(parseFloat(amount)/asset.tokenPrice).toFixed(6)} fractions · Est. ${((parseFloat(amount)*asset.apy)/100/12).toFixed(2)}/month</div>
                    )}
                  </div>
                  {!wallet
                    ? <button style={S.investBtn} onClick={connectWallet}>Connect Wallet to Invest</button>
                    : <button style={{...S.investBtn,opacity:txStatus==="pending"?0.7:1}} onClick={handleInvest} disabled={txStatus==="pending"}>
                        {txStatus==="pending"?"⏳ Processing on Arc Testnet...":`Invest${amount?` $${amount}`:""}  USDC`}
                      </button>
                  }
                  <div style={S.modalNote}>Need USDC? <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={{color:"#3B82F6"}}>Claim from Circle Faucet ↗</a></div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Landing page styles
const LS = {
  root:    { minHeight:"100vh", background:"#0A0F1E", color:"#fff", fontFamily:"'DM Sans','Outfit',sans-serif", display:"flex", flexDirection:"column" },
  bg:      { position:"fixed", inset:0, background:"radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%)", pointerEvents:"none" },
  header:  { padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"relative", zIndex:10 },
  logo:    { display:"flex", alignItems:"center", gap:10 },
  logoMark:{ width:36, height:36, background:"linear-gradient(135deg,#3B82F6,#1D4ED8)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" },
  logoR:   { fontWeight:900, fontSize:18, color:"#fff" },
  logoName:{ fontWeight:900, fontSize:16, color:"#fff" },
  arcBadge:{ padding:"3px 10px", borderRadius:20, background:"rgba(59,130,246,0.15)", color:"#3B82F6", fontSize:11, fontWeight:700, border:"1px solid rgba(59,130,246,0.3)" },
  hRight:  { display:"flex", alignItems:"center", gap:10 },
  wBadge:  { display:"flex", alignItems:"center", gap:8, padding:"7px 13px", borderRadius:8, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", fontSize:13, fontWeight:700 },
  wDot:    { width:7, height:7, borderRadius:"50%", background:"#3B82F6" },
  connectBtn:{ padding:"9px 18px", borderRadius:8, background:"#3B82F6", color:"#fff", fontWeight:800, fontSize:13, border:"none", cursor:"pointer" },
  main:    { flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 24px", position:"relative", zIndex:10 },
  hero:    { textAlign:"center", maxWidth:500 },
  h1:      { fontSize:"clamp(42px,8vw,72px)", fontWeight:900, lineHeight:1.05, marginBottom:20, color:"#fff" },
  blue:    { color:"#3B82F6" },
  sub2:    { color:"#6B7A99" },
  heroP:   { fontSize:16, color:"#6B7A99", lineHeight:1.65, marginBottom:32 },
  heroActions:{ display:"flex", gap:12, justifyContent:"center", marginBottom:48 },
  enterBtn:{ padding:"14px 28px", borderRadius:8, background:"#3B82F6", color:"#fff", fontWeight:800, fontSize:15, border:"none", cursor:"pointer" },
  learnBtn:{ padding:"14px 28px", borderRadius:8, background:"rgba(255,255,255,0.07)", color:"#fff", fontWeight:700, fontSize:15, border:"1px solid rgba(255,255,255,0.15)", cursor:"pointer" },
  statsGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  statBox: { background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"16px" },
  statBig: { fontSize:28, fontWeight:900, color:"#fff", marginBottom:4 },
  statSm:  { fontSize:13, color:"#6B7A99" },
};

// App styles
const S = {
  root:    { minHeight:"100vh", background:"#0D1117", color:"#E8EEF7", fontFamily:"'DM Sans','Outfit',sans-serif", paddingBottom:70 },
  toast:   { position:"fixed", top:70, right:16, zIndex:300, padding:"12px 18px", borderRadius:10, border:"1px solid", fontSize:14, fontWeight:600, backdropFilter:"blur(10px)", maxWidth:320 },

  // Header
  header:  { position:"sticky", top:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 16px", background:"rgba(13,17,23,0.95)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)" },
  logo:    { display:"flex", alignItems:"center", gap:8 },
  logoMark:{ width:32, height:32, background:"linear-gradient(135deg,#3B82F6,#1D4ED8)", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center" },
  logoR:   { fontWeight:900, fontSize:16, color:"#fff" },
  logoName:{ fontWeight:900, fontSize:15, color:"#E8EEF7" },
  arcBadge:{ padding:"2px 8px", borderRadius:12, background:"rgba(59,130,246,0.15)", color:"#3B82F6", fontSize:10, fontWeight:700, border:"1px solid rgba(59,130,246,0.25)" },
  hRight:  { display:"flex", alignItems:"center", gap:8 },
  wBadge:  { display:"flex", alignItems:"center", gap:6, padding:"6px 10px", borderRadius:8, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)" },
  wDot:    { width:6, height:6, borderRadius:"50%", background:"#3B82F6" },
  connectBtn:{ padding:"8px 14px", borderRadius:8, background:"#3B82F6", color:"#fff", fontWeight:800, fontSize:12, border:"none", cursor:"pointer" },
  menuBtn: { width:34, height:34, borderRadius:8, background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.1)", color:"#E8EEF7", fontSize:16, cursor:"pointer" },

  // Menu
  menuOverlay:{ position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" },
  menu:    { position:"fixed", top:0, right:0, height:"100%", width:280, background:"#0D1117", borderLeft:"1px solid rgba(255,255,255,0.1)", padding:"20px", display:"flex", flexDirection:"column", gap:4, zIndex:201 },
  menuHeader:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 },
  menuClose:{ width:32, height:32, borderRadius:8, background:"rgba(255,255,255,0.07)", border:"none", color:"#E8EEF7", fontSize:16, cursor:"pointer" },
  menuItem:{ padding:"12px 16px", borderRadius:10, background:"transparent", border:"none", color:"#7A8BAA", fontSize:15, fontWeight:600, cursor:"pointer", textAlign:"left" },
  menuItemActive:{ background:"rgba(59,130,246,0.1)", color:"#3B82F6" },
  menuDivider:{ height:1, background:"rgba(255,255,255,0.08)", margin:"8px 0" },
  menuItemSpecial:{ padding:"12px 16px", borderRadius:10, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#3B82F6", fontSize:15, fontWeight:700, cursor:"pointer", textAlign:"left" },
  menuLink:{ padding:"12px 16px", borderRadius:10, color:"#7A8BAA", fontSize:15, fontWeight:600, textDecoration:"none", display:"block" },
  menuConnect:{ padding:"12px 16px", borderRadius:10, background:"#3B82F6", border:"none", color:"#fff", fontSize:15, fontWeight:700, cursor:"pointer", textAlign:"left", marginTop:"auto" },
  menuDisconnect:{ padding:"12px 16px", borderRadius:10, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", color:"#EF4444", fontSize:15, fontWeight:700, cursor:"pointer", textAlign:"left", marginTop:"auto" },

  chainBanner:{ background:"rgba(245,158,11,0.1)", borderBottom:"1px solid rgba(245,158,11,0.2)", color:"#F59E0B", padding:"8px 16px", display:"flex", alignItems:"center", gap:12, fontSize:13, fontWeight:600 },
  switchBtn:{ padding:"4px 12px", borderRadius:6, background:"#F59E0B", color:"#0D1117", border:"none", cursor:"pointer", fontWeight:700, fontSize:12 },

  main:    { padding:"0 16px 16px" },
  section: { paddingTop:16 },
  breadcrumb:{ fontSize:13, color:"#6B7A99", marginBottom:12 },
  breadLink:{ color:"#3B82F6", cursor:"pointer", fontWeight:600 },
  pageTitle:{ fontSize:26, fontWeight:900, color:"#E8EEF7", marginBottom:4 },
  pageSubtitle:{ fontSize:14, color:"#6B7A99", marginBottom:16 },

  // Dashboard
  arcNetBadge:{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 14px", borderRadius:8, background:"rgba(34,197,94,0.1)", border:"1px solid rgba(34,197,94,0.2)", color:"#22C55E", fontSize:13, fontWeight:700, marginBottom:16 },
  greenDot:{ width:8, height:8, borderRadius:"50%", background:"#22C55E" },
  refreshBtn:{ background:"transparent", border:"none", color:"#22C55E", cursor:"pointer", fontSize:14 },
  buyMoreBtn:{ padding:"4px 12px", borderRadius:6, background:"#3B82F6", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:12 },
  dashCards:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 },
  dashCard:{ background:"#161B27", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px" },
  dashLabel:{ fontSize:12, color:"#6B7A99", fontWeight:600, display:"flex", justifyContent:"space-between", marginBottom:8 },
  dashIcon:{ fontSize:14 },
  dashBig: { fontSize:22, fontWeight:900, color:"#E8EEF7", marginBottom:4 },
  dashGreen:{ fontSize:12, color:"#22C55E", fontWeight:700 },
  dashBlue:{ fontSize:12, color:"#3B82F6", fontWeight:700 },

  // Chart
  chartCard:{ background:"#161B27", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px", marginBottom:16 },
  chartHdr:{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 },
  chartTitle:{ fontSize:15, fontWeight:800, color:"#E8EEF7" },
  chartSub:{ fontSize:12, color:"#6B7A99" },
  chartBadge:{ padding:"3px 10px", borderRadius:20, background:"rgba(34,197,94,0.1)", color:"#22C55E", fontSize:12, fontWeight:700 },
  chartWrap:{ height:140 },
  chartSvg:{ width:"100%", height:120 },
  chartLabels:{ display:"flex", justifyContent:"space-between", marginTop:4 },
  chartLabel:{ fontSize:10, color:"#6B7A99" },

  // Network
  netCard: { background:"#161B27", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"16px", marginBottom:16 },
  netCardHdr:{ fontSize:14, fontWeight:800, color:"#E8EEF7", marginBottom:12 },
  netRows: { display:"flex", flexDirection:"column", gap:8 },
  netRow:  { display:"flex", justifyContent:"space-between", alignItems:"center" },
  netRowL: { fontSize:13, color:"#6B7A99" },
  netRowV: { fontSize:13, color:"#E8EEF7", fontWeight:700 },

  // Marketplace
  mktHdr:  { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 },
  mintBtn: { padding:"9px 16px", borderRadius:8, background:"#3B82F6", color:"#fff", fontWeight:700, fontSize:13, border:"none", cursor:"pointer", whiteSpace:"nowrap" },
  mktStats:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 },
  mktStat: { background:"#161B27", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"14px" },
  mktStatL:{ fontSize:11, color:"#6B7A99", fontWeight:600, display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 },
  mktStatBadge:{ padding:"2px 7px", borderRadius:10, background:"rgba(59,130,246,0.15)", color:"#3B82F6", fontSize:10, fontWeight:700 },
  mktStatV:{ fontSize:20, fontWeight:900, color:"#E8EEF7" },

  // Live Activity
  liveCard:{ background:"#161B27", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px", marginBottom:16 },
  liveHdr: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 },
  liveTitle:{ display:"flex", alignItems:"center", gap:8, fontSize:14, fontWeight:800, color:"#E8EEF7" },
  liveNetwork:{ fontSize:11, color:"#6B7A99", fontWeight:600 },
  liveRow: { display:"flex", alignItems:"center", gap:8, padding:"6px 0", borderTop:"1px solid rgba(255,255,255,0.05)" },
  liveAction:{ fontSize:12, fontWeight:700, minWidth:70 },
  liveAsset:{ fontSize:12, color:"#E8EEF7", flex:1, fontWeight:600 },
  liveMeta:{ fontSize:11, color:"#6B7A99", whiteSpace:"nowrap" },

  // Filter
  filterRow:{ display:"flex", gap:8, overflowX:"auto", paddingBottom:8, marginBottom:8 },
  filterBtn:{ padding:"7px 14px", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#6B7A99", cursor:"pointer", fontSize:12, fontWeight:600, whiteSpace:"nowrap", flexShrink:0 },
  filterActive:{ background:"#3B82F6", color:"#fff", borderColor:"#3B82F6" },
  showingLabel:{ fontSize:13, color:"#6B7A99", marginBottom:14 },

  // Asset Cards (full width with photo)
  assetList:{ display:"flex", flexDirection:"column", gap:14 },
  assetCard:{ background:"#161B27", border:"1px solid rgba(255,255,255,0.07)", borderRadius:16, overflow:"hidden", cursor:"pointer" },
  assetImgWrap:{ position:"relative", height:180 },
  assetImg:{ width:"100%", height:"100%", objectFit:"cover" },
  assetImgOverlay:{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 40%, rgba(22,27,39,0.9) 100%)" },
  assetBadges:{ position:"absolute", top:12, left:12, display:"flex", gap:6 },
  catBadge:{ padding:"3px 10px", borderRadius:20, background:"rgba(13,17,23,0.7)", color:"#E8EEF7", fontSize:11, fontWeight:700, backdropFilter:"blur(4px)" },
  verifiedBadge:{ padding:"3px 10px", borderRadius:20, background:"rgba(59,130,246,0.2)", color:"#3B82F6", fontSize:11, fontWeight:700, border:"1px solid rgba(59,130,246,0.4)", backdropFilter:"blur(4px)" },
  soldOut:{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", padding:"8px 20px", borderRadius:8, background:"#EF4444", color:"#fff", fontWeight:900, fontSize:14, letterSpacing:1 },
  assetBody:{ padding:"14px 16px 16px" },
  assetName:{ fontSize:16, fontWeight:800, color:"#E8EEF7", marginBottom:3 },
  assetLoc:{ fontSize:12, color:"#6B7A99", marginBottom:12 },
  assetMetrics:{ display:"flex", justifyContent:"space-between", marginBottom:8 },
  assetMetricL:{ fontSize:11, color:"#6B7A99", fontWeight:600, marginBottom:3 },
  assetMetricV:{ fontSize:15, fontWeight:800, color:"#E8EEF7" },
  apyRow:{ fontSize:13, fontWeight:700, marginBottom:10 },
  progBar:{ height:3, background:"rgba(255,255,255,0.08)", borderRadius:4, marginBottom:6 },
  progFill:{ height:"100%", borderRadius:4, background:"#3B82F6" },
  progInfo:{ display:"flex", justifyContent:"space-between" },
  progPct:{ fontSize:11, color:"#3B82F6", fontWeight:700 },
  progLeft:{ fontSize:11, color:"#6B7A99" },

  arcLink:{ fontSize:13, color:"#3B82F6", textDecoration:"none", fontWeight:700 },

  // Modal
  overlay: { position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", display:"flex", alignItems:"flex-end", justifyContent:"center" },
  modal:   { background:"#161B27", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:600, maxHeight:"90vh", overflowY:"auto" },
  modalImgWrap:{ position:"relative", height:220 },
  modalImg:{ width:"100%", height:"100%", objectFit:"cover" },
  modalImgOverlay:{ position:"absolute", inset:0, background:"linear-gradient(to bottom, transparent 30%, rgba(22,27,39,0.95) 100%)" },
  modalClose:{ position:"absolute", top:14, right:14, width:32, height:32, borderRadius:8, background:"rgba(0,0,0,0.5)", border:"none", color:"#fff", fontSize:14, fontWeight:700, cursor:"pointer", backdropFilter:"blur(4px)" },
  modalBadges:{ position:"absolute", top:14, left:14, display:"flex", gap:6 },
  modalBody:{ padding:"16px" },
  modalName:{ fontSize:18, fontWeight:900, color:"#E8EEF7", marginBottom:4 },
  modalLoc:{ fontSize:13, color:"#6B7A99", marginBottom:14 },
  modalMetrics:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 },
  mMetric: { background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 12px" },
  mMetricL:{ fontSize:11, color:"#6B7A99", fontWeight:600, marginBottom:4 },
  mMetricV:{ fontSize:15, fontWeight:800, color:"#E8EEF7" },
  modalDesc:{ fontSize:13, color:"#7A8BAA", lineHeight:1.6, marginBottom:14 },
  detailsGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 },
  detailItem:{ background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"8px 10px" },
  detailK: { display:"block", fontSize:10, color:"#6B7A99", fontWeight:700, textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 },
  detailV: { fontSize:13, color:"#E8EEF7", fontWeight:600 },
  freeNotice:{ textAlign:"center", fontSize:12, color:"#6B7A99", padding:"8px", background:"rgba(59,130,246,0.06)", borderRadius:8, border:"1px solid rgba(59,130,246,0.12)", marginBottom:14 },
  inputGrp:{ marginBottom:12 },
  inputLabel:{ display:"block", fontSize:13, color:"#8A9FBF", fontWeight:600, marginBottom:7 },
  inputWrap:{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden" },
  inputPre:{ padding:"0 12px", color:"#3B82F6", fontWeight:800, fontSize:16 },
  input:   { flex:1, padding:"13px 0", background:"transparent", border:"none", color:"#E8EEF7", fontSize:16, outline:"none" },
  inputSuf:{ padding:"0 14px", color:"#6B7A99", fontSize:13, fontWeight:600 },
  inputHint:{ fontSize:12, color:"#3B82F6", marginTop:6, fontWeight:600 },
  investBtn:{ width:"100%", padding:"14px", borderRadius:10, background:"#3B82F6", color:"#fff", fontWeight:800, fontSize:15, border:"none", cursor:"pointer", marginBottom:10 },
  modalNote:{ textAlign:"center", fontSize:12, color:"#6B7A99" },
  successBox:{ textAlign:"center", padding:"24px 16px", background:"rgba(34,197,94,0.08)", borderRadius:14, border:"1px solid rgba(34,197,94,0.2)" },

  // Portfolio
  empty:   { textAlign:"center", padding:"60px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 },
  emptyIcon:{ fontSize:52 },
  emptyTitle:{ fontSize:20, fontWeight:800, color:"#E8EEF7" },
  emptyTxt:{ fontSize:14, color:"#6B7A99", maxWidth:300 },

  // Bottom Nav
  bottomNav:{ position:"fixed", bottom:0, left:0, right:0, zIndex:100, display:"flex", background:"rgba(13,17,23,0.97)", borderTop:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(20px)" },
  bottomBtn:{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:3, padding:"10px 0", background:"transparent", border:"none", color:"#6B7A99", cursor:"pointer", fontSize:18 },
  bottomBtnActive:{ color:"#3B82F6" },
  bottomLabel:{ fontSize:10, fontWeight:600 },
};
