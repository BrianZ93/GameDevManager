export class Step {
    constructor(
        public name: string,
        public description: string,
        public progress: number,
        public startDate: Date,
        public endDate: Date,
    )
    {
        this.name = name
        this.description = description
        this.progress = progress
        this.startDate = startDate
        this.endDate = endDate
    }
}

export class Task {
    constructor(
        public name: string,
        public description: string,
        public progress: number,
        public steps: Step[],
        public startDate: Date,
        public endDate: Date,
    )
    {
        this.name = name
        this.description = description
        this.progress = progress
        this.steps = steps
        this.startDate = startDate
        this.endDate = endDate
    }
}

export class Feature {
    constructor(
        public name: string,
        public description: string,
        public progress: number,
        public tasks: Task[],
        public startDate: Date,
        public endDate: Date,
    )
    {
        this.name = name
        this.description = description
        this.progress = progress
        this.tasks = tasks
        this.startDate = startDate
        this.endDate = endDate
    }
}

export class FeatureGroup {
    constructor(
        public name: string,
        public description: string,
        public progress: number,
        public tasks: Feature[],
        public startDate: Date,
        public endDate: Date,
    )
    {
        this.name = name
        this.description = description
        this.progress = progress
        this.tasks = tasks
        this.startDate = startDate
        this.endDate = endDate
    }
}

export class Phase {
  constructor(
        public name: string,
        public description: string,
        public progress: number,
        public features: FeatureGroup[],
        public startDate: Date,
        public endDate: Date,
    )
    {
        this.name = name
        this.description = description
        this.progress = progress
        this.features = features
        this.startDate = startDate
        this.endDate = endDate
    }
}