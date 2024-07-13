package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"gocrudapi/models"
	"log"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func TestGetBooksEndpoint(t *testing.T) {
	// Create a request to pass to your handler
	req, err := http.NewRequest("GET", "/books", nil)
	if err != nil {
		t.Fatalf("failed to create request: %v", err)
	}

	// Create a ResponseRecorder to record the response
	rr := httptest.NewRecorder()

	// Create a mock Gin engine instance
	r := gin.Default()
	r.GET("/books", GetBooksHandler)

	// Serve the HTTP request to the ResponseRecorder
	r.ServeHTTP(rr, req)

	// Check the status code
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	// Check the response body
	var books []models.Books
	err = json.Unmarshal(rr.Body.Bytes(), &books)
	if err != nil {
		t.Errorf("error parsing response body: %v", err)
	}

	expected := []models.Books{
		{SSID: 1, Title: "Sample Book 1", Author: "Sample Author 1", Year: "2022"},
		{SSID: 2, Title: "Sample Book 2", Author: "Sample Author 2", Year: "2023"},
	}

	if !reflect.DeepEqual(books, expected) {
		t.Errorf("handler returned unexpected body: got %v want %v",
			books, expected)
	}

}

func TestGetBookByIDEndpoint(t *testing.T) {
	// Create a mock Gin router
	router := gin.Default()
	router.GET("/books/:id", GetBookByIDHandlerMock)

	// Create a mock HTTP request to get a book by ID
	req, err := http.NewRequest("GET", "/books/1", nil)
	assert.NoError(t, err)

	// Create a mock HTTP response recorder
	res := httptest.NewRecorder()

	// Serve the HTTP request to the mock router
	router.ServeHTTP(res, req)

	// Assert the HTTP status code
	assert.Equal(t, http.StatusOK, res.Code)

	// Define expected book structure
	expected := struct {
		ID     string `json:"id"`
		Title  string `json:"title"`
		Author string `json:"Author"`
		Year   string `json:"Year"`
	}{
		ID:     "1",
		Title:  "Sample Book 1",
		Author: "Sample Author 1",
		Year:   "2022",
	}

	// Create a variable to store the actual response body
	var actual struct {
		ID     string `json:"id"`
		Title  string `json:"title"`
		Author string `json:"Author"`
		Year   string `json:"Year"`
	}

	// Parse the JSON response body
	err = json.NewDecoder(res.Body).Decode(&actual)
	assert.NoError(t, err)

	// Assert the response body content
	assert.Equal(t, expected, actual)
}

// Mock handler function for GetBookByID
func GetBookByIDHandlerMock(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"id":     c.Param("id"),
		"title":  "Sample Book 1",
		"Author": "Sample Author 1",
		"Year":   "2022",
	})
}

func TestUpdateBookByIDEndpoint(t *testing.T) {
	// Create a mock Gin router
	router := gin.Default()
	router.PUT("/books/:id", UpdateBookByIDHandlerMock)

	// Define the update payload
	updatePayload := map[string]interface{}{
		"title":  "Updated Book Title",
		"author": "Updated Author",
		"year":   "2024",
	}

	// Marshal the update payload to JSON
	payload, err := json.Marshal(updatePayload)
	assert.NoError(t, err)

	// Create a mock HTTP request to update a book by ID
	req, err := http.NewRequest("PUT", "/books/1", bytes.NewReader(payload))
	assert.NoError(t, err)

	// Create a mock HTTP response recorder
	res := httptest.NewRecorder()

	// Serve the HTTP request to the mock router
	router.ServeHTTP(res, req)

	// Assert the HTTP status code
	assert.Equal(t, http.StatusOK, res.Code)

	// Define expected response
	expectedResponse := gin.H{"message": "Book updated successfully"}

	// Create a variable to store the actual response body
	var actualResponse gin.H

	// Parse the JSON response body
	err = json.NewDecoder(res.Body).Decode(&actualResponse)
	assert.NoError(t, err)

	// Assert the response body content
	assert.Equal(t, expectedResponse, actualResponse)
}

// Mock handler function for UpdateBookByID
func UpdateBookByIDHandlerMock(c *gin.Context) {
	// Simulate updating the book in the database
	bookID := c.Param("id")

	// Define a struct that matches your book model
	type Book struct {
		ID     string `json:"id"`
		Title  string `json:"title"`
		Author string `json:"author"`
		Year   string `json:"year"`
	}

	// Retrieve the update payload from the request body
	var updatedBook Book
	if err := c.ShouldBindJSON(&updatedBook); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
		return
	}

	// Simulate updating book logic (replace with actual update logic)
	// For demonstration, we will just log the update details
	log.Printf("Updating book ID %s with data: %+v\n", bookID, updatedBook)

	// Return mock response
	c.JSON(http.StatusOK, gin.H{
		"message": "Book updated successfully",
	})
}

func TestDeleteBookEndpoint(t *testing.T) {
	// Create a mock Gin router
	router := gin.Default()
	router.DELETE("/books/:id", DeleteBookByIDHandlerMock)

	// Create a mock HTTP request to delete a book by ID
	req, err := http.NewRequest("DELETE", "/books/1", nil)
	assert.NoError(t, err)

	// Create a mock HTTP response recorder
	res := httptest.NewRecorder()

	// Serve the HTTP request to the mock router
	router.ServeHTTP(res, req)

	// Assert the HTTP status code
	assert.Equal(t, http.StatusOK, res.Code)

	// Define expected response body
	expected := map[string]interface{}{
		"message": "Book deleted successfully",
	}

	// Create a variable to store the actual response body
	var actual map[string]interface{}

	// Parse the JSON response body
	err = json.NewDecoder(res.Body).Decode(&actual)
	assert.NoError(t, err)

	// Assert the response body content
	assert.Equal(t, expected, actual)
}

// Mock handler function for DeleteBookByID
func DeleteBookByIDHandlerMock(c *gin.Context) {
	// Simulate deleting the book from the database
	bookID := c.Param("id")
	// Perform delete logic (e.g., delete book from database)
	// In a real application, you would delete the book from your database based on the bookID.

	// For demonstration, you can log or print the deleted book ID
	fmt.Printf("Deleting book ID %s\n", bookID)

	// Return mock response
	c.JSON(http.StatusOK, gin.H{
		"message": "Book deleted successfully",
	})
}
