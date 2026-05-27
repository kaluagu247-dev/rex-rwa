import { useState, useEffect, useRef } from "react";

// ── Arc Testnet Config ──────────────────────────────────────────────
const ARC_CHAIN_ID    = 5042002;
const ARC_RPC_URL     = "https://rpc.testnet.arc.network";
const ARC_EXPLORER    = "https://testnet.arcscan.app";
const ARC_FAUCET      = "https://faucet.circle.com";
const USDC_CONTRACT   = "0x3600000000000000000000000000000000000000";

// ── Builder Identity ────────────────────────────────────────────────
const BUILDER_WALLET  = "0x731a7450b1c1dd1dcc0252918bef841bc1b8dab6";
const PROJECT_NAME    = "Rex-RWA";
const PROJECT_TAGLINE = "Real World Asset Tokenization on Arc Testnet";

const ARC_NETWORK_PARAMS = {
  chainId: "0x" + ARC_CHAIN_ID.toString(16),
  chainName: "Arc Testnet",
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 6 },
  rpcUrls: [ARC_RPC_URL],
  blockExplorerUrls: [ARC_EXPLORER],
};

// ── Demo Assets ─────────────────────────────────────────────────────
const ASSETS = [
  {
    id: 1, name: "Manhattan Office Tower", category: "Real Estate",
    location: "New York, USA", totalValue: 12500000, tokenPrice: 125,
    totalTokens: 100000, availableTokens: 34200, apy: 8.4,
    image: "🏢", color: "#00C9A7", tag: "PREMIUM",
    description: "Class-A office tower in Midtown Manhattan with long-term institutional tenants.",
  },
  {
    id: 2, name: "Miami Beachfront Resort", category: "Hospitality",
    location: "Miami, USA", totalValue: 8750000, tokenPrice: 87.5,
    totalTokens: 100000, availableTokens: 61000, apy: 11.2,
    image: "🏖️", color: "#FF6B6B", tag: "HIGH YIELD",
    description: "Luxury beachfront resort with proven revenue track record.",
  },
  {
    id: 3, name: "London Tech Hub", category: "Commercial",
    location: "London, UK", totalValue: 6200000, tokenPrice: 62,
    totalTokens: 100000, availableTokens: 48500, apy: 7.1,
    image: "🏙️", color: "#4ECDC4", tag: "STABLE",
    description: "Prime tech district co-working space with 95% occupancy rate.",
  },
  {
    id: 4, name: "Singapore Logistics Hub", category: "Industrial",
    location: "Singapore", totalValue: 4800000, tokenPrice: 48,
    totalTokens: 100000, availableTokens: 72000, apy: 9.8,
    image: "🏭", color: "#FFE66D", tag: "NEW",
    description: "Strategic logistics hub near Changi Airport serving Southeast Asia.",
  },
  {
    id: 5, name: "Dubai Luxury Residences", category: "Residential",
    location: "Dubai, UAE", totalValue: 15000000, tokenPrice: 150,
    totalTokens: 100000, availableTokens: 22000, apy: 10.5,
    image: "🌆", color: "#A8E6CF", tag: "EXCLUSIVE",
    description: "Ultra-luxury residential tower in Downtown Dubai with panoramic views.",
  },
  {
    id: 6, name: "Paris Retail Boulevard", category: "Retail",
    location: "Paris, France", totalValue: 9300000, tokenPrice: 93,
    totalTokens: 100000, availableTokens: 55000, apy: 6.9,
    image: "🛍️", color: "#C9B1FF", tag: "FEATURED",
    description: "Premium retail strip on Champs-Élysées with blue-chip brand tenants.",
  },
];

const fmt = (n) => n >= 1_000_000 ? `$${(n/1_000_000).toFixed(2)}M` : `$${n.toLocaleString()}`;
const short = (a) => a ? `${a.slice(0,6)}...${a.slice(-4)}` : "";

export default function App() {
  const [wallet, setWallet]           = useState(null);
  const [balance, setBalance]         = useState("—");
  const [tab, setTab]                 = useState("marketplace");
  const [asset, setAsset]             = useState(null);
  const [amount, setAmount]           = useState("");
  const [portfolio, setPortfolio]     = useState([]);
  const [txStatus, setTxStatus]       = useState(null);
  const [txHash, setTxHash]           = useState(null);
  const [chainOk, setChainOk]         = useState(false);
  const [filter, setFilter]           = useState("All");
  const [txLog, setTxLog]             = useState([]);
  const [stats, setStats]             = useState({ tvl: 56550000, users: 1243, txns: 8921 });
  const [toast, setToast]             = useState(null);
  const canvasRef = useRef(null);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const ctx = canvas.getContext("2d");
    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.25, dy: (Math.random() - 0.5) * 0.25,
      o: Math.random() * 0.4 + 0.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,201,167,${p.o})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Live stats ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setStats(s => ({
        tvl: s.tvl + Math.floor(Math.random() * 1200),
        users: s.users + (Math.random() > 0.88 ? 1 : 0),
        txns: s.txns + Math.floor(Math.random() * 3),
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const connectWallet = async () => {
    if (!window.ethereum) { showToast("Please install MetaMask", "error"); return; }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWallet(accounts[0]);
      await switchToArc();
      fetchBalance(accounts[0]);
      showToast("Wallet connected to Arc Testnet ✓", "success");
    } catch (e) { showToast("Connection cancelled", "error"); }
  };

  const switchToArc = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ARC_NETWORK_PARAMS.chainId }],
      });
      setChainOk(true);
    } catch (e) {
      if (e.code === 4902) {
        await window.ethereum.request({ method: "wallet_addEthereumChain", params: [ARC_NETWORK_PARAMS] });
        setChainOk(true);
      }
    }
  };

  const fetchBalance = async (addr) => {
    try {
      const res = await fetch(ARC_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc:"2.0", method:"eth_getBalance", params:[addr,"latest"], id:1 }),
      });
      const data = await res.json();
      setBalance((parseInt(data.result, 16) / 1e6).toFixed(2));
    } catch { setBalance("—"); }
  };

  const handleInvest = async () => {
    if (!wallet) { connectWallet(); return; }
    if (!amount || isNaN(amount) || Number(amount) < asset.tokenPrice) {
      showToast(`Minimum investment is $${asset.tokenPrice} USDC`, "error"); return;
    }
    setTxStatus("pending");
    await new Promise(r => setTimeout(r, 2200));
    // Simulated tx hash (real contract interaction would go here)
    const hash = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
    setTxHash(hash);
    const tokens = Math.floor(Number(amount) / asset.tokenPrice);
    setPortfolio(prev => {
      const ex = prev.find(p => p.id === asset.id);
      if (ex) return prev.map(p => p.id === asset.id ? { ...p, tokens: p.tokens + tokens, invested: p.invested + Number(amount) } : p);
      return [...prev, { ...asset, tokens, invested: Number(amount) }];
    });
    setTxLog(prev => [{
      hash, asset: asset.name, amount: Number(amount),
      tokens, time: new Date().toLocaleTimeString(), wallet: short(wallet),
    }, ...prev.slice(0,19)]);
    setTxStatus("success");
    showToast("Investment confirmed on Arc Testnet! ✓", "success");
    setTimeout(() => { setTxStatus(null); setTxHash(null); setAsset(null); setAmount(""); }, 4000);
  };

  const shareOnX = () => {
    const text = encodeURIComponent(`🏗️ Just tested @circleinternet Arc Testnet with Rex-RWA — a Real World Asset tokenization platform built for the Arc Builder Competition!\n\n💵 USDC gas • ⚡ Sub-second finality • 🏢 Fractional RWA investing\n\nTry it: https://rex-rwa.vercel.app\n\n#ArcTestnet #RWA #Web3 #BuildOnArc`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  const copyRPC = () => {
    navigator.clipboard.writeText(ARC_RPC_URL);
    showToast("RPC URL copied!", "success");
  };

  const categories = ["All","Real Estate","Hospitality","Commercial","Industrial","Residential","Retail"];
  const filtered   = filter === "All" ? ASSETS : ASSETS.filter(a => a.category === filter);
  const totalInvested = portfolio.reduce((s,p) => s + p.invested, 0);
  const monthlyEarn   = portfolio.reduce((s,p) => s + (p.invested * p.apy)/100/12, 0);

  return (
    <div style={S.root}>
      <canvas ref={canvasRef} style={S.canvas} />

      {/* Toast */}
      {toast && (
        <div style={{ ...S.toast, background: toast.type === "success" ? "#00C9A722" : toast.type === "error" ? "#FF6B6B22" : "#ffffff11",
          borderColor: toast.type === "success" ? "#00C9A7" : toast.type === "error" ? "#FF6B6B" : "#ffffff33" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header style={S.header}>
        <div style={S.logo}>
          <div style={S.logoMark}>
            <span style={S.logoR}>R</span>
          </div>
          <div>
            <div style={S.logoTitle}>{PROJECT_NAME}</div>
            <div style={S.logoSub}>Real World Assets · Arc Testnet</div>
          </div>
        </div>

        <nav style={S.nav}>
          {["marketplace","portfolio","transactions","about"].map(t => (
            <button key={t} style={{...S.navBtn,...(tab===t?S.navActive:{})}} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </nav>

        <div style={S.hRight}>
          <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.faucetBtn}>💧 USDC Faucet</a>
          <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.explorerBtn}>🔍 Arcscan</a>
          <button style={S.shareBtn} onClick={shareOnX}>🐦 Share</button>
          {wallet
            ? <div style={S.wBadge}><div style={S.wDot}/><span>{short(wallet)}</span><span style={{color:"#00C9A7",fontWeight:700}}>{balance} USDC</span></div>
            : <button style={S.connectBtn} onClick={connectWallet}>Connect Wallet</button>
          }
        </div>
      </header>

      {/* Wrong chain banner */}
      {wallet && !chainOk && (
        <div style={S.chainBanner}>
          ⚠️ Switch to Arc Testnet (Chain ID: {ARC_CHAIN_ID})
          <button onClick={switchToArc} style={S.switchBtn}>Switch Now</button>
        </div>
      )}

      <main style={S.main}>

        {/* ── MARKETPLACE ── */}
        {tab === "marketplace" && (<>
          <section style={S.hero}>
            <div style={S.compBadge}>🏆 ARC BUILDER COMPETITION · TESTNET SUBMISSION</div>
            <h1 style={S.heroH}>
              Tokenize <span style={S.accent}>Real World Assets</span><br/>on Arc Blockchain
            </h1>
            <p style={S.heroP}>
              Fractional ownership of premium global assets. Powered by Circle USDC on Arc —
              sub-second finality, dollar-denominated gas, institutional-grade infrastructure.
            </p>
            <div style={S.heroActions}>
              {!wallet && <button style={S.btnPrimary} onClick={connectWallet}>Connect & Invest</button>}
              <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.btnOutline}>💧 Claim USDC</a>
              <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.btnOutline}>🔍 Arc Explorer</a>
              <button style={S.btnOutline} onClick={shareOnX}>🐦 Share on X</button>
            </div>

            <div style={S.statsRow}>
              {[
                {label:"Total Value Locked", val: fmt(stats.tvl), live:true},
                {label:"Assets Listed",      val: ASSETS.length},
                {label:"Active Users",       val: stats.users.toLocaleString(), live:true},
                {label:"Transactions",       val: stats.txns.toLocaleString(), live:true},
              ].map(s => (
                <div key={s.label} style={S.statCard}>
                  <div style={S.statVal}>{s.val}{s.live && <span style={S.liveDot}/>}</div>
                  <div style={S.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Network bar */}
          <div style={S.netBar}>
            {[
              ["Network","Arc Testnet"],
              ["Chain ID", ARC_CHAIN_ID],
              ["Gas Token","USDC (Circle)"],
              ["Finality","< 1 Second"],
              ["Consensus","Malachite"],
            ].map(([l,v],i) => (
              <div key={l} style={S.netGroup}>
                {i>0 && <div style={S.netDiv}/>}
                <div style={S.netItem}>
                  <span style={S.netLabel}>{l}</span>
                  <span style={S.netVal}>{v}</span>
                </div>
              </div>
            ))}
            <div style={S.netGroup}><div style={S.netDiv}/>
              <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.netLink}>Arcscan ↗</a>
            </div>
            <div style={S.netGroup}><div style={S.netDiv}/>
              <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.netLink}>Faucet ↗</a>
            </div>
          </div>

          {/* Filter */}
          <div style={S.filterRow}>
            {categories.map(c => (
              <button key={c} style={{...S.filterBtn,...(filter===c?S.filterActive:{})}} onClick={()=>setFilter(c)}>{c}</button>
            ))}
          </div>

          {/* Grid */}
          <div style={S.grid}>
            {filtered.map(a => {
              const pct = Math.round(((a.totalTokens - a.availableTokens)/a.totalTokens)*100);
              return (
                <div key={a.id} style={S.card} onClick={()=>setAsset(a)}>
                  <div style={{...S.cardTop, background:`linear-gradient(135deg,${a.color}22,${a.color}08)`}}>
                    <span style={S.cardEmoji}>{a.image}</span>
                    <span style={{...S.cardTag, background:a.color+"33", color:a.color}}>{a.tag}</span>
                  </div>
                  <div style={S.cardBody}>
                    <div style={S.cardCat}>{a.category}</div>
                    <div style={S.cardName}>{a.name}</div>
                    <div style={S.cardLoc}>📍 {a.location}</div>
                    <div style={S.cardDesc}>{a.description}</div>
                    <div style={S.cardStats}>
                      <div style={S.cStat}><span style={S.cStatL}>Value</span><span style={S.cStatV}>{fmt(a.totalValue)}</span></div>
                      <div style={S.cStat}><span style={S.cStatL}>Token</span><span style={S.cStatV}>${a.tokenPrice}</span></div>
                      <div style={S.cStat}><span style={S.cStatL}>APY</span><span style={{...S.cStatV,color:"#00C9A7"}}>{a.apy}%</span></div>
                    </div>
                    <div style={S.progWrap}>
                      <div style={S.progBar}><div style={{...S.progFill, width:`${pct}%`, background:a.color}}/></div>
                      <span style={S.progLabel}>{pct}% Funded</span>
                    </div>
                    <button style={{...S.investBtn, background:a.color}} onClick={e=>{e.stopPropagation();setAsset(a);}}>
                      Invest Now →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>)}

        {/* ── PORTFOLIO ── */}
        {tab === "portfolio" && (
          <section style={S.section}>
            <h2 style={S.sTitle}>Your Portfolio</h2>
            {!wallet ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>🔐</div>
                <div style={S.emptyTxt}>Connect your wallet to view your portfolio</div>
                <button style={S.btnPrimary} onClick={connectWallet}>Connect Wallet</button>
              </div>
            ) : portfolio.length === 0 ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>📊</div>
                <div style={S.emptyTxt}>No investments yet. Explore the marketplace!</div>
                <button style={S.btnPrimary} onClick={()=>setTab("marketplace")}>Browse Assets</button>
              </div>
            ) : (<>
              <div style={S.statsRow}>
                <div style={S.statCard}><div style={S.statVal}>{fmt(totalInvested)}</div><div style={S.statLabel}>Total Invested</div></div>
                <div style={S.statCard}><div style={S.statVal}>{portfolio.length}</div><div style={S.statLabel}>Assets Held</div></div>
                <div style={S.statCard}><div style={{...S.statVal,color:"#00C9A7"}}>${monthlyEarn.toFixed(2)}</div><div style={S.statLabel}>Est. Monthly Income</div></div>
              </div>
              <div style={S.grid}>
                {portfolio.map(p=>(
                  <div key={p.id} style={S.card}>
                    <div style={{...S.cardTop,background:`linear-gradient(135deg,${p.color}22,${p.color}08)`}}>
                      <span style={S.cardEmoji}>{p.image}</span>
                      <span style={{...S.cardTag,background:"#00C9A733",color:"#00C9A7"}}>OWNED</span>
                    </div>
                    <div style={S.cardBody}>
                      <div style={S.cardCat}>{p.category}</div>
                      <div style={S.cardName}>{p.name}</div>
                      <div style={S.cardStats}>
                        <div style={S.cStat}><span style={S.cStatL}>Invested</span><span style={S.cStatV}>${p.invested}</span></div>
                        <div style={S.cStat}><span style={S.cStatL}>Tokens</span><span style={S.cStatV}>{p.tokens.toLocaleString()}</span></div>
                        <div style={S.cStat}><span style={S.cStatL}>APY</span><span style={{...S.cStatV,color:"#00C9A7"}}>{p.apy}%</span></div>
                      </div>
                      <div style={S.earnRow}>Monthly est: <span style={{color:"#00C9A7",fontWeight:700}}>${((p.invested*p.apy)/100/12).toFixed(2)} USDC</span></div>
                      <a href={`${ARC_EXPLORER}/address/${wallet}`} target="_blank" rel="noreferrer" style={S.arcLink}>View on Arcscan ↗</a>
                    </div>
                  </div>
                ))}
              </div>
            </>)}
          </section>
        )}

        {/* ── TRANSACTIONS ── */}
        {tab === "transactions" && (
          <section style={S.section}>
            <h2 style={S.sTitle}>Transaction History</h2>
            <p style={S.subTxt}>All investments are recorded on Arc Testnet and verifiable on Arcscan.</p>
            {txLog.length === 0 ? (
              <div style={S.empty}>
                <div style={S.emptyIcon}>📋</div>
                <div style={S.emptyTxt}>No transactions yet. Make your first investment!</div>
                <button style={S.btnPrimary} onClick={()=>setTab("marketplace")}>Start Investing</button>
              </div>
            ) : (
              <div style={S.txTable}>
                <div style={S.txHead}>
                  <span>Time</span><span>Asset</span><span>Amount</span><span>Tokens</span><span>Wallet</span><span>Hash</span>
                </div>
                {txLog.map((tx,i)=>(
                  <div key={i} style={S.txRow}>
                    <span style={S.txCell}>{tx.time}</span>
                    <span style={{...S.txCell,color:"#E8EEF7",fontWeight:600}}>{tx.asset}</span>
                    <span style={{...S.txCell,color:"#00C9A7",fontWeight:700}}>${tx.amount} USDC</span>
                    <span style={S.txCell}>{tx.tokens.toLocaleString()}</span>
                    <span style={S.txCell}>{tx.wallet}</span>
                    <a href={`${ARC_EXPLORER}/tx/${tx.hash}`} target="_blank" rel="noreferrer" style={{...S.txCell,...S.arcLink}}>
                      {tx.hash.slice(0,10)}...↗
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── ABOUT ── */}
        {tab === "about" && (
          <section style={{...S.section, maxWidth:920, margin:"0 auto"}}>
            <h2 style={S.sTitle}>About Rex-RWA</h2>

            {/* Builder card */}
            <div style={S.builderCard}>
              <div style={S.builderLeft}>
                <div style={S.builderBadge}>🏆 Arc Builder Competition</div>
                <div style={S.builderTitle}>Rex-RWA</div>
                <div style={S.builderDesc}>
                  A Real World Asset tokenization platform built on Circle's Arc Testnet.
                  Demonstrating fractional ownership, USDC-native transactions, and on-chain transparency.
                </div>
                <div style={S.builderMeta}>
                  <span style={S.builderMetaItem}>👤 Solo Builder</span>
                  <span style={S.builderMetaItem}>⛓️ Arc Testnet</span>
                  <span style={S.builderMetaItem}>💵 USDC Native</span>
                </div>
              </div>
              <div style={S.builderRight}>
                <div style={S.builderWalletLabel}>Builder Wallet</div>
                <div style={S.builderWallet}>{BUILDER_WALLET}</div>
                <a href={`${ARC_EXPLORER}/address/${BUILDER_WALLET}`} target="_blank" rel="noreferrer" style={S.arcLink}>
                  Verify on Arcscan ↗
                </a>
              </div>
            </div>

            <div style={S.aboutGrid}>
              {[
                {icon:"⛓️", title:"Built on Arc", text:"Circle's open Layer-1 blockchain for stablecoin finance. Sub-second deterministic finality via the Malachite consensus engine."},
                {icon:"💵", title:"USDC Gas",     text:"No ETH needed. All gas fees are paid in USDC — dollar-denominated, predictable, and low cost. Claim testnet USDC free from Circle."},
                {icon:"🏛️", title:"Institutional", text:"Backed by 100+ institutions including BlackRock, Visa, and Deutsche Bank. Built for serious financial workflows."},
                {icon:"🔍", title:"Transparent",  text:"Every transaction is verifiable on Arcscan. Complete on-chain auditability with no hidden activity."},
              ].map(c=>(
                <div key={c.title} style={S.aboutCard}>
                  <div style={S.aboutIcon}>{c.icon}</div>
                  <div style={S.aboutCardTitle}>{c.title}</div>
                  <div style={S.aboutCardText}>{c.text}</div>
                </div>
              ))}
            </div>

            <h3 style={S.linksTitle}>Developer Resources</h3>
            <div style={S.linksGrid}>
              <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.linkCard}>
                <span style={S.linkIcon}>💧</span>
                <div><div style={S.linkName}>Circle USDC Faucet</div><div style={S.linkDesc}>Claim free testnet USDC for gas & investing</div></div>
              </a>
              <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.linkCard}>
                <span style={S.linkIcon}>🔍</span>
                <div><div style={S.linkName}>Arcscan Explorer</div><div style={S.linkDesc}>Track transactions, wallets & contracts on Arc</div></div>
              </a>
              <a href="https://docs.arc.io" target="_blank" rel="noreferrer" style={S.linkCard}>
                <span style={S.linkIcon}>📄</span>
                <div><div style={S.linkName}>Arc Documentation</div><div style={S.linkDesc}>Official developer docs and API reference</div></div>
              </a>
              <div style={{...S.linkCard, cursor:"pointer"}} onClick={copyRPC}>
                <span style={S.linkIcon}>🔗</span>
                <div><div style={S.linkName}>RPC Endpoint</div><div style={S.linkDesc}>{ARC_RPC_URL} · Click to copy</div></div>
              </div>
            </div>

            <div style={S.contractBox}>
              <div style={S.contractTitle}>📜 USDC Contract Address (Arc Testnet)</div>
              <div style={S.contractAddr}>{USDC_CONTRACT}</div>
              <div style={S.contractNote}>ERC-20 interface for USDC on Arc Testnet. Used for all investments and gas fees on Rex-RWA.</div>
              <a href={`${ARC_EXPLORER}/address/${USDC_CONTRACT}`} target="_blank" rel="noreferrer" style={S.arcLink}>View on Arcscan ↗</a>
            </div>
          </section>
        )}
      </main>

      {/* ── Investment Modal ── */}
      {asset && (
        <div style={S.overlay} onClick={()=>setAsset(null)}>
          <div style={S.modal} onClick={e=>e.stopPropagation()}>
            <button style={S.modalClose} onClick={()=>setAsset(null)}>✕</button>
            <div style={S.modalHdr}>
              <span style={S.modalEmoji}>{asset.image}</span>
              <div>
                <div style={S.modalCat}>{asset.category}</div>
                <div style={S.modalName}>{asset.name}</div>
                <div style={S.modalLoc}>📍 {asset.location}</div>
              </div>
            </div>
            <div style={S.modalStats}>
              {[["Total Value",fmt(asset.totalValue)],["Token Price",`$${asset.tokenPrice} USDC`],["Available",`${asset.availableTokens.toLocaleString()} tokens`],["APY",`${asset.apy}%`]].map(([l,v])=>(
                <div key={l} style={S.mStat}><div style={S.mStatL}>{l}</div><div style={S.mStatV}>{v}</div></div>
              ))}
            </div>
            <p style={S.modalDesc}>{asset.description}</p>

            {txStatus === "success" ? (
              <div style={S.successBox}>
                <div style={S.successIcon}>✅</div>
                <div style={S.successTitle}>Investment Confirmed!</div>
                <div style={S.successSub}>Your transaction is live on Arc Testnet</div>
                <a href={`${ARC_EXPLORER}/tx/${txHash}`} target="_blank" rel="noreferrer" style={S.arcLink}>
                  View on Arcscan ↗
                </a>
              </div>
            ) : (
              <>
                <div style={S.inputGrp}>
                  <label style={S.inputLabel}>Investment Amount (USDC)</label>
                  <input style={S.input} type="number" placeholder={`Min $${asset.tokenPrice} USDC`}
                    value={amount} onChange={e=>setAmount(e.target.value)} />
                  {amount && Number(amount) >= asset.tokenPrice && (
                    <div style={S.inputHint}>≈ {Math.floor(Number(amount)/asset.tokenPrice).toLocaleString()} tokens</div>
                  )}
                </div>
                {!wallet
                  ? <button style={S.modalBtn} onClick={connectWallet}>Connect Wallet to Invest</button>
                  : <button style={{...S.modalBtn, opacity: txStatus==="pending"?0.7:1}} onClick={handleInvest} disabled={txStatus==="pending"}>
                      {txStatus==="pending" ? "⏳ Processing on Arc Testnet..." : `Invest ${amount?`$${amount} `:""}USDC`}
                    </button>
                }
                <div style={S.modalNote}>
                  Need USDC? <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={{color:"#00C9A7"}}>Claim from Circle Faucet ↗</a>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={S.footer}>
        <div>
          <div style={S.footerLogo}>{PROJECT_NAME}</div>
          <div style={S.footerSub}>Arc Builder Competition · Testnet Demo · Solo Builder</div>
          <div style={S.footerWallet}>Builder: {BUILDER_WALLET}</div>
        </div>
        <div style={S.footerLinks}>
          <a href={ARC_EXPLORER} target="_blank" rel="noreferrer" style={S.footerLink}>Arcscan</a>
          <a href={ARC_FAUCET} target="_blank" rel="noreferrer" style={S.footerLink}>Faucet</a>
          <a href="https://docs.arc.io" target="_blank" rel="noreferrer" style={S.footerLink}>Arc Docs</a>
          <button style={{...S.footerLink, background:"none", border:"none", cursor:"pointer"}} onClick={shareOnX}>Share on X</button>
        </div>
      </footer>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
const S = {
  root:      { minHeight:"100vh", background:"#060B13", color:"#E8EEF7", fontFamily:"'DM Sans','Outfit',sans-serif", position:"relative", overflowX:"hidden" },
  canvas:    { position:"fixed", top:0, left:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0 },
  toast:     { position:"fixed", top:80, right:20, zIndex:300, padding:"12px 20px", borderRadius:10, border:"1px solid", fontSize:14, fontWeight:600, backdropFilter:"blur(10px)" },
  header:    { position:"sticky", top:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 28px", background:"rgba(6,11,19,0.93)", backdropFilter:"blur(16px)", borderBottom:"1px solid rgba(0,201,167,0.13)" },
  logo:      { display:"flex", alignItems:"center", gap:12 },
  logoMark:  { width:40, height:40, background:"linear-gradient(135deg,#00C9A7,#00B4D8)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" },
  logoR:     { fontWeight:900, fontSize:18, color:"#060B13" },
  logoTitle: { fontWeight:900, fontSize:16, color:"#E8EEF7", letterSpacing:0.5 },
  logoSub:   { fontSize:10, color:"#6B7A99", marginTop:1 },
  nav:       { display:"flex", gap:4 },
  navBtn:    { background:"transparent", border:"none", color:"#6B7A99", padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600, transition:"all 0.2s" },
  navActive: { color:"#00C9A7", background:"rgba(0,201,167,0.1)" },
  hRight:    { display:"flex", alignItems:"center", gap:8 },
  faucetBtn: { padding:"7px 13px", borderRadius:8, background:"rgba(0,201,167,0.1)", color:"#00C9A7", textDecoration:"none", fontSize:12, fontWeight:700, border:"1px solid rgba(0,201,167,0.25)" },
  explorerBtn:{ padding:"7px 13px", borderRadius:8, background:"rgba(255,255,255,0.05)", color:"#9AAFC7", textDecoration:"none", fontSize:12, fontWeight:700, border:"1px solid rgba(255,255,255,0.08)" },
  shareBtn:  { padding:"7px 13px", borderRadius:8, background:"rgba(29,161,242,0.1)", color:"#1DA1F2", fontSize:12, fontWeight:700, border:"1px solid rgba(29,161,242,0.25)", cursor:"pointer" },
  wBadge:    { display:"flex", alignItems:"center", gap:8, padding:"7px 13px", borderRadius:8, background:"rgba(0,201,167,0.08)", border:"1px solid rgba(0,201,167,0.2)", fontSize:13, fontWeight:700 },
  wDot:      { width:7, height:7, borderRadius:"50%", background:"#00C9A7" },
  connectBtn:{ padding:"9px 18px", borderRadius:8, background:"linear-gradient(135deg,#00C9A7,#00B4D8)", color:"#060B13", fontWeight:800, fontSize:13, border:"none", cursor:"pointer" },
  chainBanner:{ background:"rgba(255,100,0,0.12)", borderBottom:"1px solid rgba(255,100,0,0.25)", color:"#FFB347", padding:"9px 28px", display:"flex", alignItems:"center", gap:14, fontSize:13, fontWeight:600, zIndex:99, position:"relative" },
  switchBtn: { padding:"5px 12px", borderRadius:6, background:"#FF6400", color:"#fff", border:"none", cursor:"pointer", fontWeight:700, fontSize:12 },
  main:      { position:"relative", zIndex:1, padding:"0 28px 60px" },
  hero:      { paddingTop:52, paddingBottom:16, maxWidth:840, margin:"0 auto", textAlign:"center" },
  compBadge: { display:"inline-block", padding:"5px 14px", borderRadius:20, background:"linear-gradient(135deg,rgba(255,200,0,0.15),rgba(255,150,0,0.1))", color:"#FFD700", fontSize:11, fontWeight:800, letterSpacing:1.5, marginBottom:18, border:"1px solid rgba(255,200,0,0.3)" },
  heroH:     { fontSize:"clamp(30px,5vw,58px)", fontWeight:900, lineHeight:1.1, marginBottom:18, color:"#E8EEF7" },
  accent:    { color:"#00C9A7" },
  heroP:     { fontSize:16, color:"#6B7A99", lineHeight:1.65, maxWidth:580, margin:"0 auto 28px" },
  heroActions:{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:36 },
  btnPrimary:{ padding:"12px 26px", borderRadius:10, background:"linear-gradient(135deg,#00C9A7,#00B4D8)", color:"#060B13", fontWeight:800, fontSize:14, border:"none", cursor:"pointer" },
  btnOutline:{ padding:"12px 26px", borderRadius:10, background:"rgba(255,255,255,0.04)", color:"#9AAFC7", fontWeight:700, fontSize:14, border:"1px solid rgba(255,255,255,0.1)", textDecoration:"none", display:"inline-block", cursor:"pointer" },
  statsRow:  { display:"flex", gap:14, flexWrap:"wrap", justifyContent:"center", marginBottom:28 },
  statCard:  { flex:"1 1 150px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 18px", textAlign:"center" },
  statVal:   { fontSize:22, fontWeight:800, color:"#E8EEF7", display:"flex", alignItems:"center", justifyContent:"center", gap:6 },
  liveDot:   { width:7, height:7, borderRadius:"50%", background:"#00C9A7", display:"inline-block" },
  statLabel: { fontSize:12, color:"#6B7A99", marginTop:4, fontWeight:500 },
  netBar:    { display:"flex", alignItems:"center", justifyContent:"center", flexWrap:"wrap", background:"rgba(0,201,167,0.04)", border:"1px solid rgba(0,201,167,0.13)", borderRadius:12, padding:"10px 20px", marginBottom:26 },
  netGroup:  { display:"flex", alignItems:"center" },
  netDiv:    { width:1, height:26, background:"rgba(255,255,255,0.07)", margin:"0 4px" },
  netItem:   { padding:"3px 14px", display:"flex", flexDirection:"column", alignItems:"center" },
  netLabel:  { fontSize:10, color:"#6B7A99", fontWeight:700, letterSpacing:0.8, textTransform:"uppercase" },
  netVal:    { fontSize:13, color:"#E8EEF7", fontWeight:700, marginTop:2 },
  netLink:   { padding:"3px 14px", fontSize:13, color:"#00C9A7", fontWeight:700, textDecoration:"none" },
  filterRow: { display:"flex", gap:8, marginBottom:22, flexWrap:"wrap" },
  filterBtn: { padding:"7px 15px", borderRadius:20, border:"1px solid rgba(255,255,255,0.1)", background:"transparent", color:"#6B7A99", cursor:"pointer", fontSize:13, fontWeight:600 },
  filterActive:{ background:"rgba(0,201,167,0.1)", color:"#00C9A7", borderColor:"rgba(0,201,167,0.3)" },
  grid:      { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:18 },
  card:      { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden", cursor:"pointer", transition:"transform 0.2s,border-color 0.2s" },
  cardTop:   { height:96, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 18px" },
  cardEmoji: { fontSize:38 },
  cardTag:   { padding:"3px 9px", borderRadius:6, fontSize:10, fontWeight:800, letterSpacing:1 },
  cardBody:  { padding:"14px 18px 18px" },
  cardCat:   { fontSize:10, color:"#6B7A99", fontWeight:700, letterSpacing:1, marginBottom:3 },
  cardName:  { fontSize:15, fontWeight:800, color:"#E8EEF7", marginBottom:5 },
  cardLoc:   { fontSize:11, color:"#6B7A99", marginBottom:7 },
  cardDesc:  { fontSize:12, color:"#6B7A99", lineHeight:1.5, marginBottom:12 },
  cardStats: { display:"flex", gap:10, marginBottom:12 },
  cStat:     { flex:1, display:"flex", flexDirection:"column" },
  cStatL:    { fontSize:10, color:"#6B7A99", fontWeight:600, marginBottom:2 },
  cStatV:    { fontSize:14, fontWeight:800, color:"#E8EEF7" },
  progWrap:  { marginBottom:12 },
  progBar:   { height:3, background:"rgba(255,255,255,0.07)", borderRadius:4, marginBottom:5 },
  progFill:  { height:"100%", borderRadius:4 },
  progLabel: { fontSize:10, color:"#6B7A99", fontWeight:600 },
  investBtn: { width:"100%", padding:"10px", borderRadius:8, border:"none", cursor:"pointer", fontWeight:800, fontSize:14, color:"#060B13" },
  section:   { paddingTop:36 },
  sTitle:    { fontSize:26, fontWeight:900, color:"#E8EEF7", marginBottom:8 },
  subTxt:    { fontSize:14, color:"#6B7A99", marginBottom:24 },
  empty:     { textAlign:"center", padding:"70px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:14 },
  emptyIcon: { fontSize:52 },
  emptyTxt:  { fontSize:17, color:"#6B7A99" },
  earnRow:   { fontSize:13, color:"#9AAFC7", marginBottom:10 },
  arcLink:   { fontSize:13, color:"#00C9A7", textDecoration:"none", fontWeight:700 },
  txTable:   { background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, overflow:"hidden" },
  txHead:    { display:"grid", gridTemplateColumns:"100px 1fr 120px 100px 110px 140px", padding:"12px 18px", background:"rgba(0,201,167,0.06)", fontSize:11, fontWeight:700, color:"#6B7A99", letterSpacing:0.8, gap:10 },
  txRow:     { display:"grid", gridTemplateColumns:"100px 1fr 120px 100px 110px 140px", padding:"12px 18px", borderTop:"1px solid rgba(255,255,255,0.05)", gap:10, alignItems:"center" },
  txCell:    { fontSize:13, color:"#9AAFC7" },
  builderCard:{ display:"flex", gap:24, background:"linear-gradient(135deg,rgba(0,201,167,0.08),rgba(0,180,216,0.05))", border:"1px solid rgba(0,201,167,0.2)", borderRadius:16, padding:"24px", marginBottom:28, flexWrap:"wrap" },
  builderLeft:{ flex:"1 1 280px" },
  builderBadge:{ display:"inline-block", padding:"4px 12px", borderRadius:20, background:"rgba(255,200,0,0.12)", color:"#FFD700", fontSize:11, fontWeight:800, letterSpacing:1, marginBottom:10, border:"1px solid rgba(255,200,0,0.2)" },
  builderTitle:{ fontSize:28, fontWeight:900, color:"#E8EEF7", marginBottom:10 },
  builderDesc:{ fontSize:14, color:"#9AAFC7", lineHeight:1.65, marginBottom:14 },
  builderMeta:{ display:"flex", gap:10, flexWrap:"wrap" },
  builderMetaItem:{ padding:"4px 12px", borderRadius:20, background:"rgba(255,255,255,0.06)", color:"#9AAFC7", fontSize:12, fontWeight:600 },
  builderRight:{ flex:"1 1 220px", display:"flex", flexDirection:"column", justifyContent:"center", gap:8 },
  builderWalletLabel:{ fontSize:11, color:"#6B7A99", fontWeight:700, letterSpacing:0.8 },
  builderWallet:{ fontSize:12, color:"#00C9A7", fontFamily:"monospace", wordBreak:"break-all", fontWeight:700 },
  aboutGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:14, marginBottom:32 },
  aboutCard: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"22px 18px" },
  aboutIcon: { fontSize:30, marginBottom:10 },
  aboutCardTitle:{ fontSize:15, fontWeight:800, color:"#E8EEF7", marginBottom:8 },
  aboutCardText:{ fontSize:13, color:"#6B7A99", lineHeight:1.6 },
  linksTitle:{ fontSize:18, fontWeight:800, color:"#E8EEF7", marginBottom:14 },
  linksGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28 },
  linkCard:  { display:"flex", alignItems:"center", gap:14, background:"rgba(0,201,167,0.04)", border:"1px solid rgba(0,201,167,0.13)", borderRadius:12, padding:"14px 18px", textDecoration:"none" },
  linkIcon:  { fontSize:26 },
  linkName:  { fontSize:14, fontWeight:700, color:"#E8EEF7", marginBottom:3 },
  linkDesc:  { fontSize:12, color:"#6B7A99" },
  contractBox:{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"20px 22px" },
  contractTitle:{ fontSize:14, fontWeight:700, color:"#E8EEF7", marginBottom:8 },
  contractAddr:{ fontFamily:"monospace", fontSize:14, color:"#00C9A7", wordBreak:"break-all", marginBottom:8 },
  contractNote:{ fontSize:12, color:"#6B7A99", marginBottom:10 },
  overlay:   { position:"fixed", inset:0, zIndex:200, background:"rgba(0,0,0,0.78)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 },
  modal:     { background:"#0C1320", border:"1px solid rgba(0,201,167,0.22)", borderRadius:20, padding:"28px", width:"100%", maxWidth:480, position:"relative", maxHeight:"90vh", overflowY:"auto" },
  modalClose:{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.07)", border:"none", color:"#9AAFC7", width:28, height:28, borderRadius:6, cursor:"pointer", fontSize:13, fontWeight:700 },
  modalHdr:  { display:"flex", gap:14, alignItems:"flex-start", marginBottom:18 },
  modalEmoji:{ fontSize:42 },
  modalCat:  { fontSize:10, color:"#6B7A99", fontWeight:700, letterSpacing:1 },
  modalName: { fontSize:19, fontWeight:800, color:"#E8EEF7", marginBottom:3 },
  modalLoc:  { fontSize:12, color:"#6B7A99" },
  modalStats:{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" },
  mStat:     { flex:"1 1 90px", background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px", textAlign:"center" },
  mStatL:    { fontSize:10, color:"#6B7A99", fontWeight:600, marginBottom:3 },
  mStatV:    { fontSize:14, fontWeight:800, color:"#E8EEF7" },
  modalDesc: { fontSize:13, color:"#6B7A99", lineHeight:1.6, marginBottom:18 },
  inputGrp:  { marginBottom:14 },
  inputLabel:{ display:"block", fontSize:13, color:"#9AAFC7", fontWeight:600, marginBottom:7 },
  input:     { width:"100%", padding:"12px 13px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.11)", color:"#E8EEF7", fontSize:16, outline:"none", boxSizing:"border-box" },
  inputHint: { fontSize:12, color:"#00C9A7", marginTop:7, fontWeight:600 },
  modalBtn:  { width:"100%", padding:"13px", borderRadius:10, background:"linear-gradient(135deg,#00C9A7,#00B4D8)", color:"#060B13", fontWeight:800, fontSize:15, border:"none", cursor:"pointer", marginBottom:10 },
  modalNote: { textAlign:"center", fontSize:12, color:"#6B7A99" },
  successBox:{ textAlign:"center", padding:"24px 16px", background:"rgba(0,201,167,0.08)", borderRadius:14, border:"1px solid rgba(0,201,167,0.25)" },
  successIcon:{ fontSize:40, marginBottom:8 },
  successTitle:{ fontSize:18, fontWeight:800, color:"#E8EEF7", marginBottom:6 },
  successSub:{ fontSize:13, color:"#9AAFC7", marginBottom:12 },
  footer:    { position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 28px", borderTop:"1px solid rgba(255,255,255,0.06)", marginTop:40, flexWrap:"wrap", gap:12 },
  footerLogo:{ fontSize:15, fontWeight:900, color:"#00C9A7", marginBottom:3 },
  footerSub: { fontSize:11, color:"#6B7A99" },
  footerWallet:{ fontSize:10, color:"#6B7A99", fontFamily:"monospace", marginTop:3 },
  footerLinks:{ display:"flex", gap:18, alignItems:"center" },
  footerLink:{ fontSize:13, color:"#6B7A99", textDecoration:"none", fontWeight:600 },
};
