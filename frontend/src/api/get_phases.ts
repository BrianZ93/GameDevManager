import { Phase, FeatureGroup, Feature, Task, Step, Status } from 'src/models/phase';
import { Game, Genre } from 'src/models/game';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const phasesData: Phase[] = [
  new Phase(
    "Algorithmic Base",
    "Core algorithmic functionalities for the game",
    undefined,
    0.3,
    [
      new FeatureGroup("Unit Pathfinding", "Pathfinding algorithms for unit movement", undefined, 0.5, [
        new Feature("A* Implementation", "A* pathfinding algorithm", undefined, 0.6, [
          new Task("Grid Setup", "Prepare grid for pathfinding", undefined, 1, [
            new Step("Define grid", "Create X/Y grid boundaries", undefined, 1, new Date(), new Date(), Status.Completed),
            new Step("Place nodes", "Place walkable and non-walkable nodes", undefined, 1),
          ], new Date(), new Date(), Status.Completed),
          new Task("Movement Cost", "Calculate path costs", undefined, 0.5, [
            new Step("Heuristic setup", "Implement Manhattan/Euclidean", undefined, 0.5),
          ])
        ]),
        new Feature("NavMesh Support", "Unreal native navigation mesh integration")
      ]),
      new FeatureGroup("Resource Mechanics", "Resource management and allocation logic", undefined, 0.35, [
        new Feature("Gathering Logic", "Unit gather behavior", undefined, 0.4, [
          new Task("Resource Nodes", "Place nodes on map"),
          new Task("Carrying Capacity", "Max load for units"),
        ]),
      ]),
    ],
    new Date('2025-01-01'),
    new Date('2025-12-31')
  ),

  new Phase(
    "Art",
    "Visual and audio assets for the game",
    undefined,
    0.1,
    [
      new FeatureGroup("Unit Models", "3D models for game units", undefined, 0.2, [
        new Feature("Caveman Model", "RTS worker for human race", undefined, 0.3, [
          new Task("Rigging", "Add bones and weights", undefined, 0.2),
          new Task("Animations", "Idle and walk cycles"),
        ])
      ]),
      new FeatureGroup("Sound Effects", "Sound effects for game actions", undefined, 0.1, [
        new Feature("UI Clicks", "Feedback for clicking buttons"),
        new Feature("Unit Voice", "Unit responses and chatter"),
      ])
    ],
    new Date('2025-03-01'),
    new Date('2025-12-31')
  ),

  new Phase(
    "Delivery",
    "Final delivery and release features",
    undefined,
    0.05,
    [
      new FeatureGroup("Campaign", "Single-player campaign mode", undefined, 0.05, [
        new Feature("Story", "Campaign storyline", undefined, 0.5, [
          new Task("Write Lore", "Create story arcs"),
          new Task("Dialogue", "Write in-game dialogue"),
        ]),
        new Feature("Nibiru", "Nibiru campaign content"),
        new Feature("Cinematics", "Campaign cinematics"),
      ]),
      new FeatureGroup("Multiplayer", "Multiplayer game mode", undefined, 0.0, [
        new Feature("Enemy AI", "AI for multiplayer opponents", undefined, 0.0, [
          new Task("Basic Behavior Tree", "Initial attack/move"),
        ]),
        new Feature("Balancing", "Multiplayer game balancing"),
      ])
    ],
    new Date('2025-06-01'),
    new Date('2025-12-31')
  ),
];

export const gameData = new Game(
  uuidv4(),
  'The Adamu Project',       // game name
  Genre.RTS,                // genre enum
  phasesData                // nested phases, features, tasks, steps
);

export async function createGame() {
  try {
    const response = await axios.post('http://localhost:8080/api/games', gameData);
    console.log('Game created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to create game:', error);
    throw error;
  }
}