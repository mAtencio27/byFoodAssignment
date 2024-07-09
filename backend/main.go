package main

import (
	"fmt"
	"gocrudapi/models"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// creating the db variable with a type of gorm.DB with a pointer //
var db *gorm.DB

func init() {
	//Setting up out ENV variables//
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading Enviroment Variables:", err)
	}
	initDB()
}

// Instance of our database and envs
func initDB() {
	//getting data from envs
	dbHost := os.Getenv("DB_HOST")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	dbPort := os.Getenv("DB_PORT")
	dbSSLMode := os.Getenv("DB_SSLMODE")

	//Construct the Data Source Name using the VARS (DSN)
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=%s",
		dbHost, dbUser, dbPassword, dbName, dbPort, dbSSLMode)

	// Connect to the Postgres database
	var err error

	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect to database:", err)
	}
	// Auto migrate the models into db tables
	err = db.AutoMigrate(&models.Books{})
	if err != nil {
		log.Fatalf("Failed to migrate table: %v", err)
	}
}

func main() {
	r := gin.Default()

	//INITAL SETUP
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "The library is open",
		})
	})

	//BING DB FOR TESTING
	r.GET("/pingdb", func(c *gin.Context) {
		var result string
		err := db.Raw("SELECT 'Database connected successfully' as result").Scan(&result).Error
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to ping database"})
			return
		}
		c.JSON(200, gin.H{"message": result})
	})

	//GET ALL BOOKS
	r.GET("/books", func(c *gin.Context) {
		var books []models.Books
		if err := db.Find(&books).Error; err != nil {
			c.JSON(500, gin.H{"error": "Failed to fetch books"})
			return
		}

		// 👾👾👾👾 Log the contents of the books variable
		fmt.Printf("Books: %+v\n", books) // Using fmt.Printf
		// 👾👾👾👾log.Printf("Books: %+v\n", books) // Using log.Printf

		c.JSON(200, books)
	})

	//GET BOOKS BY ID
	r.GET("/books/:id", func(c *gin.Context) {
		// Extract book ID from URL paramerter
		id := c.Param("id")

		// if err != nil {
		// 	c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Book ID"})
		// 	return
		// }

		// Query the DB for the book
		var book models.Books
		result := db.First(&book, id)
		if result.Error != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
			return
		}

		//return book details
		//Query example http://localhost:3000/books/3
		c.JSON(http.StatusOK, book)
	})

	r.Run() // listen and serve on .env PORT
}
