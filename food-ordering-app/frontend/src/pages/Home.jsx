import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        .splash{font-family:'Outfit',sans-serif;background:#080400;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;overflow:hidden}
        .bg-circle1{position:absolute;width:600px;height:600px;border-radius:50%;border:1px solid rgba(255,200,80,0.04);top:50%;left:50%;transform:translate(-50%,-50%)}
        .bg-circle2{position:absolute;width:450px;height:450px;border-radius:50%;border:1px solid rgba(255,200,80,0.06);top:50%;left:50%;transform:translate(-50%,-50%)}
        .bg-circle3{position:absolute;width:300px;height:300px;border-radius:50%;border:1px solid rgba(255,200,80,0.08);top:50%;left:50%;transform:translate(-50%,-50%)}
        .glow{position:absolute;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,200,80,0.08) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
        .content{display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;z-index:2;text-align:center}
        .logo-ring{width:130px;height:130px;border-radius:50%;border:1px solid rgba(255,200,80,0.25);display:flex;align-items:center;justify-content:center;margin-bottom:2.5rem;position:relative;animation:logoBreath 4s ease-in-out infinite}
        .logo-ring::before{content:'';position:absolute;width:110px;height:110px;border-radius:50%;border:1px dashed rgba(255,200,80,0.12);animation:spinRing 20s linear infinite}
        .logo-ring::after{content:'';position:absolute;width:150px;height:150px;border-radius:50%;border:1px solid rgba(255,200,80,0.06)}
        .logo-icon{width:80px;height:80px;border-radius:50%;background:#110800;border:1px solid rgba(255,200,80,0.3);display:flex;align-items:center;justify-content:center;font-size:34px;position:relative;z-index:1}
        .dot-top{position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:7px;height:7px;border-radius:50%;background:#FFC850;box-shadow:0 0 8px rgba(255,200,80,0.6)}
        .dot-right{position:absolute;right:-4px;top:50%;transform:translateY(-50%);width:5px;height:5px;border-radius:50%;background:rgba(255,200,80,0.4)}
        .dot-left{position:absolute;left:-4px;top:50%;transform:translateY(-50%);width:5px;height:5px;border-radius:50%;background:rgba(255,200,80,0.4)}
        .app-name{font-family:'Cormorant Garamond',serif;font-size:72px;font-weight:700;color:#fff;letter-spacing:-2px;line-height:1;margin-bottom:0.3rem;animation:fadeUp 0.8s ease both 0.2s}
        .app-name span{color:#FFC850}
        .tagline{font-size:12px;font-weight:300;letter-spacing:5px;text-transform:uppercase;color:rgba(255,200,80,0.5);margin-bottom:3.5rem;animation:fadeUp 0.8s ease both 0.4s}
        .get-started{background:#FFC850;color:#080400;border:none;padding:1.1rem 3.5rem;font-size:12px;font-weight:600;letter-spacing:3px;text-transform:uppercase;cursor:pointer;font-family:'Outfit',sans-serif;border-radius:2px;position:relative;overflow:hidden;animation:fadeUp 0.8s ease both 0.6s;transition:transform 0.2s}
        .get-started::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:rgba(255,255,255,0.2);transform:skewX(-20deg);transition:left 0.4s}
        .get-started:hover{transform:translateY(-2px)}
        .get-started:hover::before{left:150%}
        .bottom-line{position:absolute;bottom:2.5rem;font-size:10px;color:rgba(255,255,255,0.15);letter-spacing:2px;text-transform:uppercase}
        .corner-tl,.corner-tr,.corner-bl,.corner-br{position:absolute;width:30px;height:30px}
        .corner-tl{top:20px;left:20px;border-top:1px solid rgba(255,200,80,0.2);border-left:1px solid rgba(255,200,80,0.2)}
        .corner-tr{top:20px;right:20px;border-top:1px solid rgba(255,200,80,0.2);border-right:1px solid rgba(255,200,80,0.2)}
        .corner-bl{bottom:20px;left:20px;border-bottom:1px solid rgba(255,200,80,0.2);border-left:1px solid rgba(255,200,80,0.2)}
        .corner-br{bottom:20px;right:20px;border-bottom:1px solid rgba(255,200,80,0.2);border-right:1px solid rgba(255,200,80,0.2)}
        @keyframes spinRing{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @keyframes logoBreath{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      <div className="splash">
        <div className="corner-tl"></div>
        <div className="corner-tr"></div>
        <div className="corner-bl"></div>
        <div className="corner-br"></div>
        <div className="bg-circle1"></div>
        <div className="bg-circle2"></div>
        <div className="bg-circle3"></div>
        <div className="glow"></div>
        <div className="content">
          <div className="logo-ring">
            <div className="dot-top"></div>
            <div className="dot-right"></div>
            <div className="dot-left"></div>
            <div className="logo-icon">🥄</div>
          </div>
          <div className="app-name">Speedy<span>Spoon</span></div>
          <div className="tagline">Every bite, right on time.</div>
          <button className="get-started" onClick={() => navigate('/menu')}>
            Get Started
          </button>
        </div>
        <div className="bottom-line">Chennai &bull; Est. 2024</div>
      </div>
    </>
  );
}