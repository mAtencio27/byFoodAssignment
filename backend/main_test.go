package main

import (
	"encoding/json"
	"gocrudapi/models"
	"net/http"
	"net/http/httptest"
	"reflect"
	"testing"

	"github.com/gin-gonic/gin"
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

// func TestGetBookByIDEndpoint(t *testing.T) {
// 	// Create a mock Gin router
// 	router := gin.Default()
// 	router.GET("/books/:id", GetBookByIDHandlerMock)

// 	// Create a mock HTTP request to get a book by ID
// 	req, err := http.NewRequest("GET", "/books/1", nil)
// 	assert.NoError(t, err)

// 	// Create a mock HTTP response recorder
// 	res := httptest.NewRecorder()

// 	// Serve the HTTP request to the mock router
// 	router.ServeHTTP(res, req)

// 	// Assert the HTTP status code
// 	assert.Equal(t, http.StatusOK, res.Code)

// 	// Define expected book structure
// 	expected := struct {
// 		SSID   string `json:"id"`
// 		Title  string `json:"title"`
// 		Author string `json:"Author"`
// 		Year   string `json:"Year"`
// 	}{
// 		SSID:   "1",
// 		Title:  "Sample Book 1",
// 		Author: "Sample Author 1",
// 		Year:   "2022",
// 	}

// 	// Create a variable to store the actual response body
// 	var actual struct {
// 		ID    string `json:"id"`
// 		Title string `json:"title"`
// 	}

// 	// Parse the JSON response body
// 	err = json.NewDecoder(res.Body).Decode(&actual)
// 	assert.NoError(t, err)

// 	// Assert the response body content
// 	assert.Equal(t, expected, actual)
// }

// // Mock handler function for GetBookByID
// func GetBookByIDHandlerMock(c *gin.Context) {
// 	c.JSON(http.StatusOK, gin.H{
// 		"id":    c.Param("id"),
// 		"title": "Sample Book 1",
// 		// Add other fields as needed
// 	})
// }
