import { v4 as uuidv4 } from 'uuid';

export enum Status {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Blocked = 'Blocked'
}

export class Step {
  public id: string;
  public progress: number;
  public status: Status | undefined;

  constructor(
    public name: string,
    public description: string,
    id?: string,
    progress?: number,
    public startDate?: Date,
    public dueDate?: Date,
    status?: Status
  ) {
    this.id = id ?? uuidv4();
    this.progress = progress ?? 0;
    this.status = status;
  }
}

export class Task {
  public id: string;
  public progress: number;
  public status: Status | undefined;

  constructor(
    public name: string,
    public description: string,
    id?: string,
    progress?: number,
    public steps?: Step[],
    public startDate?: Date,
    public dueDate?: Date,
    status?: Status
  ) {
    this.id = id ?? uuidv4();
    this.progress = progress ?? 0;
    this.status = status;
  }
}

export class Feature {
  public id: string;
  public progress: number;
  public status: Status | undefined;

  constructor(
    public name: string,
    public description: string,
    id?: string,
    progress?: number,
    public tasks?: Task[],
    public startDate?: Date,
    public dueDate?: Date,
    status?: Status
  ) {
    this.id = id ?? uuidv4();
    this.progress = progress ?? 0;
    this.status = status;
  }
}

export class FeatureGroup {
  public id: string;
  public progress: number;
  public status: Status | undefined;

  constructor(
    public name: string,
    public description: string,
    id?: string,
    progress?: number,
    public features?: Feature[],
    public startDate?: Date,
    public dueDate?: Date,
    status?: Status
  ) {
    this.id = id ?? uuidv4();
    this.progress = progress ?? 0;
    this.status = status;
  }
}

export class Phase {
  public id: string;
  public progress: number;
  public status: Status | undefined;

  constructor(
    public name: string,
    public description: string,
    id?: string,
    progress?: number,
    public featureGroups?: FeatureGroup[],
    public startDate?: Date,
    public dueDate?: Date,
    status?: Status
  ) {
    this.id = id ?? uuidv4();
    this.progress = progress ?? 0;
    this.status = status;
  }
}
