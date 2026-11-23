const V = "mx-print-v1", CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== V).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request; if (r.method !== "GET" || !r.url.startsWith("http")) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(res => { const k = res.clone(); caches.open(V).then(c => c.put("index.html", k)); return res; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(r).then(hit => {
    const net = fetch(r).then(res => { if (res && (res.ok || res.type === "opaque")) { const k = res.clone(); caches.open(V).then(c => c.put(r, k)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
