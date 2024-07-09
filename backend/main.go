package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func init() {
	//Setting up out ENV variables//
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading Enviroment Variables:", err)
	}
}

func main() {
	r := gin.Default()

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "library is open"})
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}
