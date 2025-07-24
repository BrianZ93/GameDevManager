import { Phase } from './phase'
import { v4 as uuidv4 } from 'uuid';

export enum Genre {
  RTS = 'RTS',
}

export class Game {
  constructor(
      public id:string ,
      public name: string,
      public genre: Genre,
      public phases: Phase[]
    )
    {
      this.id = id ?? uuidv4();
      this.name = name
      this.genre = genre
      this.phases = phases
    }
}