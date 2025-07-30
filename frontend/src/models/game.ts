import { Phase } from './phase'
import { v4 as uuidv4 } from 'uuid';

export enum Genre {
  RTS = 'RTS',
  MMORPG = 'MMORPG',
  Action = 'Action',
  Adventure = 'Adventure',
  RPG = 'RPG',
  Strategy = 'Strategy',
  Simulation = 'Simulation',
  Sports = 'Sports',
  Puzzle = 'Puzzle',
  Racing = 'Racing',
  Fighting = 'Fighting',
  Shooter = 'Shooter',
}

export class Game {
  public id: string;

  constructor(
    public name: string,
    public genre: Genre,
    public phases: Phase[] = [],
    id?: string
  ) {
    this.id = id ?? uuidv4();
  }
}
