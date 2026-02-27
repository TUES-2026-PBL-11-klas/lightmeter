import { api } from '@/src/utils/api';

export interface Note {
  id: string;
  iso: string;
  aperture: string;
  shutter_speed: string;
  date: string;
  place: string;
  user_id: string;
}

export const notesApi = {
  getAll: async (): Promise<Note[]> => {
    return api.get('/notes', true);
  },

  create: async (note: { iso: string; aperture: string; shutter_speed: string; date: string; place: string }): Promise<Note> => {
    return api.post('/notes', note, true);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/notes/${id}`, true);
  },
};