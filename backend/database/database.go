package db

import (
	"fmt"
	"log"
	"os"

	"backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	var err error

	// Get database connection parameters from environment variables
	dbHost := getEnv("DB_HOST", "localhost")
	dbPort := getEnv("DB_PORT", "5432")
	dbUser := getEnv("DB_USER", "gamedev")
	dbPassword := getEnv("DB_PASSWORD", "gamedev123")
	dbName := getEnv("DB_NAME", "gamedev")
	dbSSLMode := getEnv("DB_SSLMODE", "disable")

	// Construct PostgreSQL connection string
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		dbHost, dbPort, dbUser, dbPassword, dbName, dbSSLMode)

	// Connect to PostgreSQL
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// AutoMigrate will create tables if they don't exist
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

	log.Println("Database initialized successfully")
}

// Helper function to get environment variables with fallback
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
