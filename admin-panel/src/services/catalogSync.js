// Cross-tab and Cross-window real-time synchronization bridge for Shree Pratham

const CHANNEL_NAME = 'sp_catalog_sync_channel';

class CatalogSyncBridge {
  constructor() {
    this.listeners = new Set();
    this.channel = null;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported in this environment', err);
      }
    }

    if (typeof window !== 'undefined') {
      // Listen to storage events across tabs on same origin
      window.addEventListener('storage', (e) => {
        if (['sp_gift_products', 'sp_water_products', 'sp_appliances', 'sp_orders'].includes(e.key)) {
          let parsed = null;
          try {
            parsed = e.newValue ? JSON.parse(e.newValue) : null;
          } catch {}
          this.notifyListeners({
            type: 'STORAGE_CHANGE',
            key: e.key,
            newValue: parsed
          });
        }
      });

      // Listen to postMessage across windows/ports (e.g., localhost:5173 <-> localhost:5174)
      window.addEventListener('message', (e) => {
        if (e.data && e.data.source === 'SP_ADMIN_BRIDGE') {
          this.notifyListeners(e.data);
        }
      });
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(data) {
    this.listeners.forEach((fn) => {
      try {
        fn(data);
      } catch (err) {
        console.error('Error in catalog sync listener:', err);
      }
    });
  }

  broadcast(type, payload) {
    const message = {
      source: 'SP_ADMIN_BRIDGE',
      type,
      payload,
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('Broadcast postMessage error', e);
      }
    }

    // Try posting to parent/opener if running in iframe or opened window
    if (typeof window !== 'undefined') {
      try {
        if (window.opener && !window.opener.closed) {
          window.opener.postMessage(message, '*');
        }
      } catch {}
    }
  }
}

export const catalogSync = new CatalogSyncBridge();
