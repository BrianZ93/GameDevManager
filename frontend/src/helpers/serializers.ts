import { Game, Genre } from 'src/models/game';
import { Phase, FeatureGroup, Feature, Task, Step, Status } from 'src/models/phase';

// Serialize a Game object to JSON-compatible format
export function serializeGame(game: Game): Record<string, unknown> {
  return {
    name: game.name,
    genre: game.genre,
    phases: game.phases.map(serializePhase),
  };
}

// Serialize a Phase object
function serializePhase(phase: Phase): Record<string, unknown> {
  return {
    id: phase.id,
    name: phase.name,
    description: phase.description,
    progress: phase.progress,
    status: phase.status,
    startDate: phase.startDate ? phase.startDate.toISOString() : undefined,
    dueDate: phase.dueDate ? phase.dueDate.toISOString() : undefined,
    featureGroups: phase.featureGroups?.map(serializeFeatureGroup) || [],
  };
}

// Serialize a FeatureGroup object
function serializeFeatureGroup(featureGroup: FeatureGroup): Record<string, unknown> {
  return {
    id: featureGroup.id,
    name: featureGroup.name,
    description: featureGroup.description,
    progress: featureGroup.progress,
    status: featureGroup.status,
    startDate: featureGroup.startDate ? featureGroup.startDate.toISOString() : undefined,
    dueDate: featureGroup.dueDate ? featureGroup.dueDate.toISOString() : undefined,
    features: featureGroup.features?.map(serializeFeature) || [],
  };
}

// Serialize a Feature object
function serializeFeature(feature: Feature): Record<string, unknown> {
  return {
    id: feature.id,
    name: feature.name,
    description: feature.description,
    progress: feature.progress,
    status: feature.status,
    startDate: feature.startDate ? feature.startDate.toISOString() : undefined,
    dueDate: feature.dueDate ? feature.dueDate.toISOString() : undefined,
    tasks: feature.tasks?.map(serializeTask) || [],
  };
}

// Serialize a Task object
function serializeTask(task: Task): Record<string, unknown> {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    progress: task.progress,
    status: task.status,
    startDate: task.startDate ? task.startDate.toISOString() : undefined,
    dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
    steps: task.steps?.map(serializeStep) || [],
  };
}

// Serialize a Step object
function serializeStep(step: Step): Record<string, unknown> {
  return {
    id: step.id,
    name: step.name,
    description: step.description,
    progress: step.progress,
    status: step.status,
    startDate: step.startDate ? step.startDate.toISOString() : undefined,
    dueDate: step.dueDate ? step.dueDate.toISOString() : undefined,
  };
}

// Deserialize JSON data to a Game object
export function deserializeGame(data: Game): Game {
  return new Game(
    data.name,
    data.genre as Genre,
    data.phases.map(deserializePhase),
    data.id,
  );
}

// Deserialize a Phase object
function deserializePhase(data: Phase): Phase {
  return new Phase(
    data.name,
    data.description,
    data.id,
    data.progress,
    data.featureGroups?.map(deserializeFeatureGroup),
    data.startDate ? new Date(data.startDate) : undefined,
    data.dueDate ? new Date(data.dueDate) : undefined,
    data.status as Status
  );
}

// Deserialize a FeatureGroup object
function deserializeFeatureGroup(data: FeatureGroup): FeatureGroup {
  return new FeatureGroup(
    data.name,
    data.description,
    data.id,
    data.progress,
    data.features?.map(deserializeFeature),
    data.startDate ? new Date(data.startDate) : undefined,
    data.dueDate ? new Date(data.dueDate) : undefined,
    data.status as Status
  );
}

// Deserialize a Feature object
function deserializeFeature(data: Feature): Feature {
  return new Feature(
    data.name,
    data.description,
    data.id,
    data.progress,
    data.tasks?.map(deserializeTask),
    data.startDate ? new Date(data.startDate) : undefined,
    data.dueDate ? new Date(data.dueDate) : undefined,
    data.status as Status
  );
}

// Deserialize a Task object
function deserializeTask(data: Task): Task {
  return new Task(
    data.name,
    data.description,
    data.id,
    data.progress,
    data.steps?.map(deserializeStep),
    data.startDate ? new Date(data.startDate) : undefined,
    data.dueDate ? new Date(data.dueDate) : undefined,
    data.status as Status
  );
}

// Deserialize a Step object
function deserializeStep(data: Step): Step {
  return new Step(
    data.name,
    data.description,
    data.id,
    data.progress,
    data.startDate ? new Date(data.startDate) : undefined,
    data.dueDate ? new Date(data.dueDate) : undefined,
    data.status as Status
  );
}