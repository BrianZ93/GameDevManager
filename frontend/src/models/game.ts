import { Phase } from './phase'


export enum Genre {
  RTS = 'RTS',
}

export class Game {
  constructor(
        public name: string,
        public genre: Genre,
        public phases: Phase[]
    )
    {
        this.name = name
        this.genre = genre
        this.phases = phases
    }
}