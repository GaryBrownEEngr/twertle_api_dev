package main

// https://tutorialedge.net/golang/creating-restful-api-with-golang/
// https://tutorialedge.net/golang/creating-simple-web-server-with-golang/

import (
	"fmt"
	"log"
	"main/api"
	"main/models"
	"net/http"
)

func main() {
	fmt.Println("Rest API v2.0 - Mux Routers")
	Articles := []models.Article{
		{Id: "1", Title: "Hello", Desc: "Article Description for Hello", Content: "Article Content for Hello"},
		{Id: "2", Title: "Hello2", Desc: "Article Description for Hello2", Content: "Article Content for Hello2"},
	}

	server := api.NewServer(&Articles)
	log.Fatal(http.ListenAndServe("localhost:10000", server))

	// go to http://localhost:10000/
	// go to http://localhost:10000/post.html
	// go to http://localhost:10000/guess.html
	// go to http://localhost:10000/test2.html
	// go to http://localhost:10000/api/articles
}
