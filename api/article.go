package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"main/models"
	"net/http"

	"github.com/gorilla/mux"
)

func returnAllArticles(articles *[]models.Article) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		fmt.Println("Endpoint Hit: returnAllArticles")
		json.NewEncoder(w).Encode(articles)
	}
}

func returnSingleArticles(articles []models.Article) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		key := vars["id"]

		for _, article := range articles {
			if article.Id == key {
				json.NewEncoder(w).Encode(article)
			}
		}
	}
}

func createNewArticle(articles *[]models.Article) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		reqBody, _ := ioutil.ReadAll(r.Body)
		fmt.Fprintf(w, "%+v", string(reqBody))

		var newArticle models.Article
		json.Unmarshal(reqBody, &newArticle)
		newArticles := append(*articles, newArticle)
		*articles = newArticles
		json.NewEncoder(w).Encode(newArticle)
	}
}
