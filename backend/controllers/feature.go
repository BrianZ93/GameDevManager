package controllers

import (
	"net/http"

	db "backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

// CreateFeature creates a new feature for a specific feature group
func CreateFeature(c *gin.Context) {
	featureGroupID := c.Param("featureGroupId")

	// Check if feature group exists
	var featureGroup models.FeatureGroup
	if err := db.DB.First(&featureGroup, "id = ?", featureGroupID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Feature group not found"})
		return
	}

	// Parse request body
	var featureData struct {
		Name        string `json:"name" binding:"required"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&featureData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid feature data: " + err.Error()})
		return
	}

	// Create new feature
	status := models.StatusNotStarted
	feature := models.Feature{
		ID:             uuid.New(),
		Name:           featureData.Name,
		Description:    featureData.Description,
		Progress:       0.0,
		Status:         &status,
		FeatureGroupID: featureGroup.ID,
	}

	// Save to database
	if err := db.DB.Create(&feature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create feature: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, feature)
}
