
//This is the "Offline page" service worker
if (navigator.serviceWorker.controller) {
  console.log('[Manifoldjs] active service worker found, no need to register')
} else {
  //Register the ServiceWorker
  navigator.serviceWorker.register('https://digital.tonbridge.net/manifoldjs-sw.js', {
    scope: './'
  }).then(function (reg) {
    console.log('Service worker has been registered for scope:' + reg.scope);
  });
}

//This is the "Offline page" service worker

//Install stage sets up the offline page in the cache and opens a new cache
self.addEventListener('install', function (event) {
  var offlinePage = new Request('offline');
  event.waitUntil(
    fetch(offlinePage).then(function (response) {
      return caches.open('manifoldjs-offline').then(function (cache) {
        console.log('[Manifoldjs] Cached offline page during Install' + response.url);
        return cache.put(offlinePage, response);
      });
    }));
});

//If any fetch fails, it will show the offline page.
//Maybe this should be limited to HTML documents?
self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).catch(function (error) {
      console.error('[Manifoldjs] Network request Failed. Serving offline page ' + error);
      return caches.open('manifoldjs-offline').then(function (cache) {
        return cache.match('offline.html');
      });
    }));
});

//This is a event that can be fired from your page to tell the SW to update the offline page
self.addEventListener('refreshOffline', function (response) {
  return caches.open('manifoldjs-offline').then(function (cache) {
    console.log('[Manifoldjs] Offline page updated from refreshOffline event: ' + response.url);
    return cache.put(offlinePage, response);
  });
});
