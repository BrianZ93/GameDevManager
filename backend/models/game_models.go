package models

import (
	"time"

	"github.com/google/uuid"
)

type Status string

const (
	StatusNotStarted Status = "Not Started"
	StatusInProgress Status = "In Progress"
	StatusCompleted  Status = "Completed"
	StatusBlocked    Status = "Blocked"
)

// Step is the lowest-level unit of work
type Step struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name        string
	Description string
	Progress    float64
	Status      *Status `gorm:"type:varchar(20)"`
	StartDate   *time.Time
	DueDate     *time.Time

	TaskID uuid.UUID `gorm:"type:uuid"` // FK to Task
}

// Task is composed of multiple Steps
type Task struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name        string
	Description string
	Progress    float64
	Status      *Status `gorm:"type:varchar(20)"`
	StartDate   *time.Time
	DueDate     *time.Time

	FeatureID uuid.UUID `gorm:"type:uuid"` // FK to Feature
	Steps     []Step    `gorm:"foreignKey:TaskID;constraint:OnDelete:CASCADE"`
}

// Feature is composed of multiple Tasks
type Feature struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name        string
	Description string
	Progress    float32
	Status      *Status `gorm:"type:varchar(20)"`
	StartDate   *time.Time
	DueDate     *time.Time

	FeatureGroupID uuid.UUID `gorm:"type:uuid"` // FK to FeatureGroup
	Tasks          []Task    `gorm:"foreignKey:FeatureID;constraint:OnDelete:CASCADE"`
}

// FeatureGroup contains multiple Features
type FeatureGroup struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name        string
	Description string
	Progress    float32
	Status      *Status `gorm:"type:varchar(20)"`
	StartDate   *time.Time
	DueDate     *time.Time

	PhaseID  uuid.UUID `gorm:"type:uuid"` // FK to Phase
	Features []Feature `gorm:"foreignKey:FeatureGroupID;constraint:OnDelete:CASCADE"`
}

// Phase contains multiple FeatureGroups
type Phase struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name        string
	Description string
	Progress    float32
	Status      *Status `gorm:"type:varchar(20)"`
	StartDate   *time.Time
	DueDate     *time.Time

	GameID        uuid.UUID      `gorm:"type:uuid"` // FK to Game
	FeatureGroups []FeatureGroup `gorm:"foreignKey:PhaseID;constraint:OnDelete:CASCADE"`
}

// GameGenre type
type GameGenre string

const (
	GenreRTS GameGenre = "RTS"
)

// Game contains multiple Phases
type Game struct {
	ID     uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name   string
	Genre  GameGenre `gorm:"type:varchar(10)"`
	Phases []Phase   `gorm:"foreignKey:GameID;constraint:OnDelete:CASCADE"`
}
