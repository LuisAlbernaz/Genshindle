import { Module } from '@nestjs/common';
import { JogoService } from './jogo.service';
import { JogoController } from './jogo.controller';
import { PersonagensModule } from '../personagens/personagens.module';

@Module({
  imports: [PersonagensModule],
  providers: [JogoService],
  controllers: [JogoController],
})
export class JogoModule {}
