// PWA Configuration para PAPOI Survives

(function initPWA() {
  // Detectar si está en modo standalone (app instalada)
  const isStandalone = window.navigator.standalone === true ||
                       window.matchMedia('(display-mode: standalone)').matches ||
                       window.matchMedia('(display-mode: fullscreen)').matches;

  if (isStandalone) {
    document.documentElement.classList.add('pwa-standalone');
    console.log('[PWA] Ejecutándose como app instalada');
  }

  // Registrar Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registrado:', registration.scope);

          // Escuchar actualizaciones
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                console.log('[PWA] Nueva versión disponible');
                // Opcionalmente mostrar notificación al usuario
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('PAPOI Survives', {
                    body: 'Una nueva versión del juego está disponible. Recarga para actualizarla.',
                    icon: './icons/icon-192.png',
                    badge: './icons/icon-96.png'
                  });
                }
              }
            });
          });
        })
        .catch((error) => {
          console.error('[PWA] Service Worker error:', error);
        });
    });
  }

  // Manejar el evento de instalación
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    console.log('[PWA] beforeinstallprompt disparado');
    // Aquí podrías mostrar un botón personalizado de instalación
  });

  window.addEventListener('appinstalled', () => {
    console.log('[PWA] Aplicación instalada');
    deferredPrompt = null;
  });

  // Permitir acceso a deferredPrompt globalmente
  window.papaiPWA = {
    install: () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('[PWA] Usuario aceptó instalar');
          } else {
            console.log('[PWA] Usuario rechazó instalar');
          }
          deferredPrompt = null;
        });
      }
    },
    isStandalone: () => isStandalone
  };

  // Solicitar permisos de notificación (opcional)
  if ('Notification' in window && Notification.permission === 'default') {
    // No pedir automáticamente, dejar que el usuario lo haga
  }

  // Detectar modo offline
  window.addEventListener('offline', () => {
    console.log('[PWA] Modo offline activado');
  });

  window.addEventListener('online', () => {
    console.log('[PWA] Conexión restaurada');
  });
})();
