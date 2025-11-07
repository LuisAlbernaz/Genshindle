import { Injectable } from '@nestjs/common';
import { PersonagensService } from '../personagens/personagens.service';
import type { Personagem } from '../personagens/personagens.types';

/** Hash determinístico simples baseado em seed */
function hashSeed(seed: string): number {
  let h = 0 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

/** Comparador com retorno tipado */
function cmp<T>(a: T, b: T): 'igual' | 'diferente' {
  return a === b ? 'igual' : 'diferente';
}

function normalizar(s: string) {
  return s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

@Injectable()
export class JogoService {
  constructor(private readonly personagens: PersonagensService) {}

  /** Aleatório puro (sem seed) */
  getAleatorio(): Personagem | null {
    const lista = this.personagens.listarTodos();
    if (!lista.length) return null;
    const idx = Math.floor(Math.random() * lista.length);
    return lista[idx]; // já vem com imagem
  }

  /** Alvo do dia (determinístico via seed) – retorna apenas pistas */
  getAlvoDoDia(seed: string): { seed: string; pistas: Pick<Personagem, 'elemento' | 'regiao' | 'arma'> } | null {
    const alvo = this.getDeterministicoPorSeed(seed);
    if (!alvo) return null;
    const { elemento, regiao, arma } = alvo;
    return { seed, pistas: { elemento, regiao, arma } };
  }

  /** Busca personagem pelo nome (normalizado) */
  encontrarPorNome(nome: string): Personagem | undefined {
    return this.personagens
      .listarTodos()  // <- já resolve imagem
      .find((p) => normalizar(p.nome) === normalizar(nome));
  }

  /** Palpite por GET (legado) */
  palpite(seed: string, nomePalpite: string) {
    const alvo = this.getDeterministicoPorSeed(seed);
    if (!alvo) return null;

    const candidato = this.encontrarPorNome(nomePalpite);
    const acertou = !!candidato && normalizar(alvo.nome) === normalizar(candidato.nome);

    const dicas =
      !candidato
        ? { elemento: 'diferente', regiao: 'diferente', arma: 'diferente' as const }
        : {
            elemento: cmp(candidato.elemento, alvo.elemento),
            regiao: cmp(candidato.regiao, alvo.regiao),
            arma: cmp(candidato.arma, alvo.arma),
          };

    return {
      seed,
      acertou,
      palpite: candidato ?? { nome: nomePalpite }, // compat
      dicas,
      ...(acertou ? { alvo } : {}),
    };
  }

  /** Palpite por POST com mensagens amigáveis */
  palpitePost(seed: string, nomePalpite: string) {
    const alvo = this.getDeterministicoPorSeed(seed);
    if (!alvo) return null;

    const candidato = this.encontrarPorNome(nomePalpite);
    if (!candidato) {
      return {
        seed,
        acertou: false,
        erro: 'Personagem não encontrado no mock.',
      };
    }

    const acertou = normalizar(alvo.nome) === normalizar(candidato.nome);

    const comparacao = {
      elemento: cmp(candidato.elemento, alvo.elemento),
      regiao: cmp(candidato.regiao, alvo.regiao),
      arma: cmp(candidato.arma, alvo.arma),
    };

    const mensagens: string[] = [];

    // Elemento
    if (comparacao.elemento === 'igual') {
      mensagens.push(`Ele(a) é **${alvo.elemento}** também.`);
    } else {
      mensagens.push(`O elemento não bate: seu palpite é **${candidato.elemento}**, mas o alvo não é.`);
    }

    // Região
    if (comparacao.regiao === 'igual') {
      mensagens.push(`Ele(a) é de **${alvo.regiao}** também.`);
    } else {
      mensagens.push(`A região não bate: seu palpite é de **${candidato.regiao}**, mas o alvo não é.`);
    }

    // Arma
    if (comparacao.arma === 'igual') {
      mensagens.push(`Ele(a) usa **${alvo.arma}** também.`);
    } else {
      mensagens.push(`A arma não bate: seu palpite usa **${candidato.arma}**, mas o alvo não usa.`);
    }

    const resumoPartes: string[] = [];
    resumoPartes.push(
      comparacao.elemento === 'igual'
        ? `é **${alvo.elemento}** também`
        : `não é **${candidato.elemento}**`
    );
    resumoPartes.push(
      comparacao.regiao === 'igual'
        ? `é de **${alvo.regiao}** também`
        : `não é de **${candidato.regiao}**`
    );
    resumoPartes.push(
      comparacao.arma === 'igual'
        ? `usa **${alvo.arma}** também`
        : `não usa **${candidato.arma}**`
    );
    const mensagemResumo =
      `${candidato.nome}: ` +
      `${resumoPartes[0]}, ${resumoPartes[1]}, ` +
      (comparacao.arma === 'igual' ? `${resumoPartes[2]}.` : `mas ${resumoPartes[2]}.`);

    return {
      seed,
      acertou,
      // não revela nome antes de acertar; porém inclui imagem somente quando acertar
      alvo: acertou ? alvo : { elemento: alvo.elemento, regiao: alvo.regiao, arma: alvo.arma },
      palpite: candidato, // <- SEMPRE com imagem
      comparacao,
      mensagens,
      mensagemResumo,
    };
  }

  private getDeterministicoPorSeed(seed: string): Personagem | null {
    const lista = this.personagens.listarTodos(); // <- já com imagem
    if (!lista.length) return null;
    const idx = hashSeed(seed) % lista.length;
    return lista[idx];
  }
}
