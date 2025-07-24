package controllers

import (
	"net/http"

	db "backend/database"
	"backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

// CREATE
func CreateGame(c *gin.Context) {
	var game models.Game
	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	game.ID = uuid.New()
	for i := range game.Phases {
		game.Phases[i].ID = uuid.New()
		for j := range game.Phases[i].FeatureGroups {
			game.Phases[i].FeatureGroups[j].ID = uuid.New()
			for k := range game.Phases[i].FeatureGroups[j].Features {
				game.Phases[i].FeatureGroups[j].Features[k].ID = uuid.New()
				for l := range game.Phases[i].FeatureGroups[j].Features[k].Tasks {
					game.Phases[i].FeatureGroups[j].Features[k].Tasks[l].ID = uuid.New()
					for m := range game.Phases[i].FeatureGroups[j].Features[k].Tasks[l].Steps {
						game.Phases[i].FeatureGroups[j].Features[k].Tasks[l].Steps[m].ID = uuid.New()
					}
				}
			}
		}
	}
	if err := db.DB.Create(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create game"})
		return
	}
	c.JSON(http.StatusCreated, game)
}

// READ all games
func GetGames(c *gin.Context) {
	var games []models.Game
	if err := db.DB.Preload("Phases.FeatureGroups.Features.Tasks.Steps").Find(&games).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch games"})
		return
	}
	c.JSON(http.StatusOK, games)
}

// READ single game
func GetGameByID(c *gin.Context) {
	id := c.Param("id")
	var game models.Game
	if err := db.DB.Preload("Phases.FeatureGroups.Features.Tasks.Steps").First(&game, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}
	c.JSON(http.StatusOK, game)
}

// UPDATE
func UpdateGame(c *gin.Context) {
	id := c.Param("id")
	var game models.Game
	if err := db.DB.Preload("Phases.FeatureGroups.Features.Tasks.Steps").First(&game, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Game not found"})
		return
	}

	var update models.Game
	if err := c.ShouldBindJSON(&update); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	update.ID = game.ID
	if err := db.DB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&update).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update game"})
		return
	}
	c.JSON(http.StatusOK, update)
}

// DELETE
func DeleteGame(c *gin.Context) {
	id := c.Param("id")
	if err := db.DB.Delete(&models.Game{}, "id = ?", id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete game"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"deleted": id})
}
