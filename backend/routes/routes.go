package routes

import (
	"backend/controllers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(router *gin.Engine) {
	api := router.Group("/api")
	{
		api.POST("/games/create", controllers.CreateGame)
		api.GET("/games", controllers.GetGames)
		api.GET("/games/:id", controllers.GetGameByID)
		api.PUT("/games/:id", controllers.UpdateGame)
		api.DELETE("/games/:id", controllers.DeleteGame)

		// Phase routes
		api.POST("/games/:gameId/phases", controllers.CreatePhase)

		// Feature Group routes
		api.POST("/phases/:phaseId/feature-groups", controllers.CreateFeatureGroup)

		// Feature routes
		api.POST("/feature-groups/:featureGroupId/features", controllers.CreateFeature)
	}
}
