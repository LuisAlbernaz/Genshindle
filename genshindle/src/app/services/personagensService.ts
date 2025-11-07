// src/services/personagensService.ts
import { apiGet } from './api';
import type { Personagem, Elemento, Regiao, Arma } from './jogoService';

export const personagensApi = {
  listar: (params?: { elemento?: Elemento; regiao?: Regiao; arma?: Arma }) => {
    const q = new URLSearchParams();
    if (params?.elemento) q.set('elemento', params.elemento);
    if (params?.regiao) q.set('regiao', params.regiao);
    if (params?.arma) q.set('arma', params.arma);
    const suffix = q.toString() ? `?${q.toString()}` : '';
    return apiGet<Personagem[]>(`/personagens${suffix}`);
  },
};
