package api

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"main/models"
	"net/http"

	"github.com/gorilla/mux"
)

func returnAllArticles(articles models.ArticleStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		fmt.Println("Endpoint Hit: returnAllArticles")
		json.NewEncoder(w).Encode(articles.GetArticles())
	}
}

func returnSingleArticles(articles models.ArticleStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		vars := mux.Vars(r)
		key := vars["id"]

		a := articles.GetArticle(key)
		if a == nil {
			json.NewEncoder(w).Encode(apiError{"article not found"})
			return
		}

		json.NewEncoder(w).Encode(a)
	}
}

func createNewArticle(articles models.ArticleStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		reqBody, _ := ioutil.ReadAll(r.Body)
		fmt.Fprintf(w, "%+v", string(reqBody))

		var newArticle models.Article
		json.Unmarshal(reqBody, &newArticle)
		articles.CreateArticle(&newArticle)
		json.NewEncoder(w).Encode(newArticle)
	}
}
