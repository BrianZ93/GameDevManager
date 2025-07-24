package db

import (
	"log"

	"backend/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	var err error
	DB, err = gorm.Open(sqlite.Open("app.db"), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	err = DB.AutoMigrate(
		&models.Game{},
		&models.Phase{},
		&models.FeatureGroup{},
		&models.Feature{},
		&models.Task{},
		&models.Step{},
	)
	if err != nil {
		log.Fatal("Migration failed:", err)
	}
}
