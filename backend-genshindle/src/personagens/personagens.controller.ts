import { Controller, Get, Query } from '@nestjs/common';
import type { Arma, Elemento, Regiao } from './personagens.types';
import { PersonagensService } from './personagens.service';

@Controller('personagens')
export class PersonagensController {
  constructor(private readonly service: PersonagensService) {}

  @Get()
  getAll(
    @Query('elemento') elemento?: Elemento | 'Viajante',
    @Query('regiao') regiao?: Regiao,
    @Query('arma') arma?: Arma
  ) {
    return this.service.listarTodos({ elemento, regiao, arma });
  }

  @Get('do-dia')
  getDoDia(
    @Query('seed') seed?: string,
    @Query('elemento') elemento?: Elemento | 'Viajante',
    @Query('regiao') regiao?: Regiao,
    @Query('arma') arma?: Arma
  ) {
    if (seed) {
      const lista = this.service.listarTodos({ elemento, regiao, arma });
      if (!lista.length) return null;
      let hash = 0;
      for (const ch of seed) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
      const idx = hash % lista.length;
      return lista[idx]; // já vem com imagem pelo service
    }
    return this.service.sortear({ elemento, regiao, arma });
  }
}
