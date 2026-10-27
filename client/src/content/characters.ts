/** Expressive story characters. Portraits are emoji inside a themed bubble. */
export interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string; // speech-bubble accent
}

export const CHARACTERS: Record<string, Character> = {
  milo: { id: 'milo', name: 'Milo', emoji: '🧑‍🔧', color: '#4bb8f0' },
  grandpa: { id: 'grandpa', name: 'Grandpa', emoji: '👴', color: '#c98a52' },
  reyes: { id: 'reyes', name: 'Mrs. Reyes', emoji: '👩', color: '#ff7aa0' },
  elena: { id: 'elena', name: 'Elena', emoji: '👩‍🌾', color: '#7dc242' },
  tomas: { id: 'tomas', name: 'Tomas', emoji: '🧑‍🎨', color: '#b07a3a' },
  leo: { id: 'leo', name: 'Leo', emoji: '🧑‍🔧', color: '#8a94a0' },
  hana: { id: 'hana', name: 'Hana', emoji: '👒', color: '#d98cff' },
  nadia: { id: 'nadia', name: 'Nadia', emoji: '👩‍🌾', color: '#ffcb5b' },
  narrator: { id: 'narrator', name: '', emoji: '✨', color: '#7c4dff' },
};

export function character(id: string): Character {
  return CHARACTERS[id] ?? CHARACTERS.narrator;
}
