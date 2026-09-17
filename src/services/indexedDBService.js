// IndexedDB Native Database Service for Cyberdeck Workshop Assistant
const DB_NAME = 'CyberdeckDB';
const DB_VERSION = 1;
const STORE_PROFILES = 'equipment_profiles';
const STORE_LOGS = 'maintenance_logs';

const DEFAULT_PROFILES = [
  {
    id: 'mtb-29-standard',
    name: 'MTB Enduro 29"',
    category: 'BIKE',
    targetPsi: 28,
    targetBar: 1.9,
    valveType: 'Presta',
    notes: 'Pneu Tubeless 2.4 - Uso em trilha com pedras',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'speed-road-bike',
    name: 'Speed Road Cervélo',
    category: 'BIKE',
    targetPsi: 95,
    targetBar: 6.5,
    valveType: 'Presta',
    notes: 'Pneu 700x25c - Asfalto seco',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'notebook-dell-g15',
    name: 'Notebook Dell G15',
    category: 'HARDWARE',
    targetPsi: 0,
    targetBar: 0,
    valveType: 'NVMe M.2 2280',
    notes: 'SSD Secundário PCIe 4.0 X4',
    updatedAt: new Date().toISOString()
  }
];

class IndexedDBService {
  constructor() {
    this.db = null;
  }

  async openDB() {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        if (!db.objectStoreNames.contains(STORE_PROFILES)) {
          const profileStore = db.createObjectStore(STORE_PROFILES, { keyPath: 'id' });
          profileStore.createIndex('name', 'name', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORE_LOGS)) {
          const logStore = db.createObjectStore(STORE_LOGS, { keyPath: 'id' });
          logStore.createIndex('date', 'date', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        this._initDefaultProfiles();
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('[IndexedDB] Erro ao abrir banco de dados:', event.target.error);
        reject(event.target.error);
      };
    });
  }

  async _initDefaultProfiles() {
    try {
      const existing = await this.getAllProfiles();
      if (existing.length === 0) {
        for (const profile of DEFAULT_PROFILES) {
          await this.saveProfile(profile);
        }
      }
    } catch (err) {
      console.warn('[IndexedDB] Erro ao inicializar perfis padrão:', err);
    }
  }

  async getAllProfiles() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROFILES, 'readonly');
      const store = tx.objectStore(STORE_PROFILES);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveProfile(profile) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROFILES, 'readwrite');
      const store = tx.objectStore(STORE_PROFILES);
      
      const record = {
        ...profile,
        id: profile.id || `profile-${Date.now()}`,
        updatedAt: new Date().toISOString()
      };

      const request = store.put(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteProfile(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_PROFILES, 'readwrite');
      const store = tx.objectStore(STORE_PROFILES);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async logMaintenanceSession(sessionData) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LOGS, 'readwrite');
      const store = tx.objectStore(STORE_LOGS);

      const record = {
        id: `log-${Date.now()}`,
        date: new Date().toISOString(),
        ...sessionData
      };

      const request = store.add(record);
      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  async getMaintenanceHistory() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_LOGS, 'readonly');
      const store = tx.objectStore(STORE_LOGS);
      const request = store.getAll();

      request.onsuccess = () => resolve((request.result || []).reverse());
      request.onerror = () => reject(request.error);
    });
  }
}

export const indexedDBService = new IndexedDBService();
