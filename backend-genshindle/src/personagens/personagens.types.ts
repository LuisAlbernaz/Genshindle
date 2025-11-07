export type Elemento = 'Anemo' | 'Cryo' | 'Dendro' | 'Electro' | 'Geo' | 'Hydro' | 'Pyro';
export type Arma =
  | 'Espada'
  | 'Espadão'
  | 'Lança'
  | 'Catalisador'
  | 'Arco';

export type Regiao =
  | 'Mondstadt'
  | 'Liyue'
  | 'Inazuma'
  | 'Sumeru'
  | 'Fontaine'
  | 'Natlan'
  | 'Nod-Krai'
  | 'Snezhnaya'
  | 'Vários'
  | 'Desconhecida';

export interface Personagem {
  nome: string;
  elemento: Elemento | 'Viajante';
  regiao: Regiao;
  arma: Arma;
  imagem?: string; // URL direta da imagem
}
