package api

import (
	"main/models"
	"net/http"

	"github.com/gorilla/mux"
)

type Server struct {
	articles models.ArticleStore
	mux      *mux.Router
}

func (m *Server) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	if req.Method == "OPTIONS" {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		return
	}
	m.mux.ServeHTTP(w, req)
}

func NewServer(articles models.ArticleStore) *Server {
	myRouter := mux.NewRouter().StrictSlash(true)

	myRouter.HandleFunc("/api/articles", returnAllArticles(articles))
	myRouter.HandleFunc("/api/article", createNewArticle(articles)).Methods("POST")
	myRouter.HandleFunc("/api/article/{id}", returnSingleArticles(articles))
	myRouter.HandleFunc("/api/checkguess", checkGuess)

	fileServer := http.FileServer(http.Dir("./static"))
	myRouter.PathPrefix("/").Handler(fileServer)

	return &Server{mux: myRouter, articles: articles}
}

type apiError struct {
	Error string `json:"error"`
}
