package controllers

import (
	"net/http"

	db "backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreatePhase creates a new phase for a specific game
func CreatePhase(c *gin.Context) {
	gameID := c.Param("gameId")

	// Check if game exists
	var game models.Game
	if err := db.DB.First(&game, "id = ?", gameID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}

	// Parse request body
	var phaseData struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&phaseData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid phase data: " + err.Error()})
		return
	}

	// Create new phase
	status := models.StatusNotStarted
	phase := models.Phase{
		ID:          uuid.New(),
		Name:        phaseData.Name,
		Description: phaseData.Description,
		Progress:    0.0,
		Status:      &status,
		GameID:      game.ID,
	}

	// Save to database
	if err := db.DB.Create(&phase).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create phase: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, phase)
}
