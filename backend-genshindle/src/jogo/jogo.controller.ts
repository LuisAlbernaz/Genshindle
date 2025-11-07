import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { JogoService } from './jogo.service';
import { PalpiteDto } from './dto/palpite.dto';

@Controller('jogo')
export class JogoController {
  constructor(private readonly jogo: JogoService) {}

  /** GET /jogo/aleatorio */
  @Get('aleatorio')
  getAleatorio() {
    const p = this.jogo.getAleatorio();
    if (!p) throw new BadRequestException('Lista de personagens vazia.');
    return p;
  }

  /** GET /jogo/alvo?seed=YYYY-MM-DD */
  @Get('alvo')
  getAlvo(@Query('seed') seed?: string) {
    if (!seed) throw new BadRequestException('Informe o seed (ex.: 2025-08-21).');
    const alvo = this.jogo.getAlvoDoDia(seed);
    if (!alvo) throw new BadRequestException('Não foi possível obter o alvo.');
    return alvo;
  }

  /** GET /jogo/palpite?seed=YYYY-MM-DD&nome=Venti  (legado) */
  @Get('palpite')
  palpite(@Query('seed') seed?: string, @Query('nome') nome?: string) {
    if (!seed || !nome) {
      throw new BadRequestException('Informe seed e nome (ex.: ?seed=2025-08-21&nome=Venti).');
    }
    const r = this.jogo.palpite(seed, nome);
    if (!r) throw new BadRequestException('Não foi possível processar o palpite.');
    return r;
  }

  /** POST /jogo/palpite  { "seed": "2025-08-21", "nome": "Diluc" } */
  @Post('palpite')
  palpitePost(@Body() body: PalpiteDto) {
    if (!body?.seed || !body?.nome) {
      throw new BadRequestException('Body inválido. Envie {"seed":"YYYY-MM-DD","nome":"<personagem>"}');
    }
    const r = this.jogo.palpitePost(body.seed, body.nome);
    if (!r) throw new BadRequestException('Não foi possível processar o palpite.');
    return r;
  }
}
