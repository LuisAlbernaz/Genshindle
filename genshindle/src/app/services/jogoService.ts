// src/services/jogoService.ts
import { apiGet, apiPost } from './api';

export type Elemento = 'Anemo'|'Cryo'|'Dendro'|'Electro'|'Geo'|'Hydro'|'Pyro'|'Viajante';
export type Arma = 'Espada'|'Espadão'|'Lança'|'Catalisador'|'Arco';
export type Regiao = 'Mondstadt'|'Liyue'|'Inazuma'|'Sumeru'|'Fontaine'|'Snezhnaya'|'Vários'|'Desconhecida';

export interface Personagem {
  nome: string;
  elemento: Elemento;
  regiao: Regiao;
  arma: Arma;
  imagem?: string; // URL da imagem do personagem
}

export interface PalpitePostResponse {
  seed: string;
  acertou: boolean;
  alvo: Partial<Personagem> | Personagem; // nome só vem quando acerta
  palpite: Personagem;
  comparacao: { elemento: 'igual'|'diferente'; regiao: 'igual'|'diferente'; arma: 'igual'|'diferente' };
  mensagens: string[];
  mensagemResumo: string;
  erro?: string;
}

export const jogoApi = {
  postPalpite: (seed: string, nome: string) =>
    apiPost<PalpitePostResponse>('/jogo/palpite', { seed, nome }),
  getAlvo: (seed: string) =>
    apiGet<{ seed: string; pistas: Pick<Personagem,'elemento'|'regiao'|'arma'> }>(`/jogo/alvo?seed=${encodeURIComponent(seed)}`),
};
