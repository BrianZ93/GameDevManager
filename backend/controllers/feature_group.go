package controllers

import (
	"net/http"

	db "backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateFeatureGroup creates a new feature group for a specific phase
func CreateFeatureGroup(c *gin.Context) {
	phaseID := c.Param("phaseId")

	// Check if phase exists
	var phase models.Phase
	if err := db.DB.First(&phase, "id = ?", phaseID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Phase not found"})
		return
	}

	// Parse request body
	var featureGroupData struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&featureGroupData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feature group data: " + err.Error()})
		return
	}

	// Create new feature group
	status := models.StatusNotStarted
	featureGroup := models.FeatureGroup{
		ID:          uuid.New(),
		Name:        featureGroupData.Name,
		Description: featureGroupData.Description,
		Progress:    0.0,
		Status:      &status,
		PhaseID:     phase.ID,
	}

	// Save to database
	if err := db.DB.Create(&featureGroup).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create feature group: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, featureGroup)
}
