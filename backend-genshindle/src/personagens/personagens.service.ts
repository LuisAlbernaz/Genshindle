import { Injectable } from '@nestjs/common';
import { PERSONAGENS } from './personagens.mock';
import type { Arma, Elemento, Regiao, Personagem } from './personagens.types';

function slugifyNome(nome: string) {
  return nome
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()']/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const IMG_BASE = 'https://images.genshin-builds.com/genshin/characters';

export function computeImagem(p: Personagem): string | undefined {
  return p.imagem?.trim() || undefined; // NADA de fallback por slug
}

@Injectable()
export class PersonagensService {
  listarTodos(filtros?: { elemento?: Elemento | 'Viajante'; regiao?: Regiao; arma?: Arma }): Personagem[] {
    const { elemento, regiao, arma } = filtros ?? {};
    return PERSONAGENS
      .filter((p) =>
        (elemento ? p.elemento === elemento : true) &&
        (regiao ? p.regiao === regiao : true) &&
        (arma ? p.arma === arma : true)
      )
      .map((p) => ({ ...p, imagem: computeImagem(p) })); // <- garante imagem sempre
  }

  sortear(filtros?: { elemento?: Elemento | 'Viajante'; regiao?: Regiao; arma?: Arma }): Personagem | null {
    const lista = this.listarTodos(filtros);
    if (!lista.length) return null;
    const idx = Math.floor(Math.random() * lista.length);
    return lista[idx];
  }
}
