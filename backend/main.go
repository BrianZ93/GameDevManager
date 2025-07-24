package main

import (
	db "backend/database"
	"backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize database
	db.Init()

	// Create Gin router
	router := gin.Default()

	// Configure CORS middleware
	config := cors.Config{
		AllowOrigins:     []string{"http://localhost:9000"}, // Allow your frontend origin
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * 3600, // Cache preflight requests for 12 hours
	}
	router.Use(cors.New(config))

	// Setup routes
	routes.SetupRoutes(router)

	// Start server
	router.Run(":8000")
}
