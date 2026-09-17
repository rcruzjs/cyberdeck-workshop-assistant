// LocalStorage Persistence Service for Cyberdeck Workshop Assistant

const KEYS = {
  PROCEDURE_ID: 'cyberdeck_active_procedure_id',
  STEP_INDEX: 'cyberdeck_active_step_index',
  PHOTOS: 'cyberdeck_captured_photos',
  SOUND_ENABLED: 'cyberdeck_sound_enabled',
  BIKE_PROFILES: 'cyberdeck_bike_psi_profiles'
};

export const storageService = {
  getActiveProcedureId: () => {
    return localStorage.getItem(KEYS.PROCEDURE_ID) || 'bike_tire_inflation';
  },
  setActiveProcedureId: (id) => {
    localStorage.setItem(KEYS.PROCEDURE_ID, id);
  },

  getActiveStepIndex: () => {
    const val = localStorage.getItem(KEYS.STEP_INDEX);
    return val ? parseInt(val, 10) : 0;
  },
  setActiveStepIndex: (idx) => {
    localStorage.setItem(KEYS.STEP_INDEX, idx.toString());
  },

  getPhotos: () => {
    try {
      const data = localStorage.getItem(KEYS.PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },
  savePhotos: (photosArray) => {
    try {
      localStorage.setItem(KEYS.PHOTOS, JSON.stringify(photosArray));
    } catch (e) {
      console.warn("Estouro de quota de localStorage para imagens PNG.", e);
    }
  },

  getSoundEnabled: () => {
    const val = localStorage.getItem(KEYS.SOUND_ENABLED);
    return val !== null ? val === 'true' : true;
  },
  setSoundEnabled: (enabled) => {
    localStorage.setItem(KEYS.SOUND_ENABLED, enabled.toString());
  }
};
