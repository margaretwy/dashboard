import { NextResponse } from 'next/server';

const PASSWORD = '1801';

export function middleware(request) {
  const cookie = request.cookies.get('auth');
  const { pathname } = request.nextUrl;
  
  if (pathname === '/api/login') return NextResponse.next();
  if (cookie?.value === PASSWORD) return NextResponse.next();
  
  if (pathname.startsWith('/api/')) return NextResponse.next();
  
  return new Response(
    `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>请输入密码</title>
    <style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:-apple-system,sans-serif;background:#F7F8FA;display:flex;align-items:center;justify-content:center;height:100vh}.box{background:#fff;border-radius:12px;padding:40px;width:340px;box-shadow:0 4px 24px rgba(0,0,0,.08);text-align:center}h2{font-size:18px;margin-bottom:8px}.sub{font-size:13px;color:#6B7280;margin-bottom:24px}input{width:100%;padding:10px 14px;border:1px solid #E8EAF0;border-radius:8px;font-size:14px;margin-bottom:12px;outline:none}input:focus{border-color:#2563EB}button{width:100%;padding:10px;background:#2563EB;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}.err{color:#DC2626;font-size:12px;margin-top:8px;display:none}</style></head>
    <body><div class="box"><h2>🔐 家庭资产仪表台</h2><p class="sub">请输入访问密码</p>
    <input type="password" id="pw" placeholder="密码" onkeydown="if(event.key==='Enter')login()"/>
    <button onclick="login()">进入</button>
    <p class="err" id="err">密码错误，请重试</p></div>
    <script>async function login(){const pw=document.getElementById('pw').value;const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});if(r.ok){location.reload()}else{document.getElementById('err').style.display='block'}}</script>
    </body></html>`,
    { status: 401, headers: { 'Content-Type': 'text/html' } }
  );
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
