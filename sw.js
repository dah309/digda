const CACHE='dig-inspect-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
/* 저장본을 바로 보여 주고, 연결되어 있으면 뒤에서 새 버전을 받아 둔다 */
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const key=e.request.mode==='navigate'?'./index.html':e.request;
    const hit=await c.match(key);
    const net=fetch(e.request).then(r=>{if(r.ok)c.put(key,r.clone());return r});
    if(hit){net.catch(()=>{});return hit}
    return net;
  }));
});
