package api

import (
	"encoding/json"
	"fmt"
	"main/models"
	"net/http"

	"github.com/gorilla/mux"
)

func encodeJSON(w http.ResponseWriter, thing interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(thing)
}

func returnAllArticles(articles models.ArticleStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Endpoint Hit: returnAllArticles")
		encodeJSON(w, articles.GetArticles(), http.StatusOK)
	}
}

func returnSingleArticles(articles models.ArticleStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		vars := mux.Vars(r)
		key := vars["id"]

		a := articles.GetArticle(key)
		if a == nil {
			encodeJSON(w, apiError{"article not found"}, http.StatusBadRequest)
			return
		}

		encodeJSON(w, a, http.StatusOK)
	}
}

func createNewArticle(articles models.ArticleStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var newArticle models.Article
		if err := json.NewDecoder(r.Body).Decode(&newArticle); err != nil {
			encodeJSON(w, apiError{"unable to parse JSON"}, http.StatusBadRequest)
			return
		}
		articles.CreateArticle(&newArticle)
		encodeJSON(w, newArticle, http.StatusCreated)
	}
}
