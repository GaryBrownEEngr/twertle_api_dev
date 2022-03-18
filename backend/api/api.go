package api

import (
	"bytes"
	"log"
	"main/models"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type LogResponseWriter struct {
	http.ResponseWriter
	statusCode int
	buf        bytes.Buffer
}

func NewLogResponseWriter(w http.ResponseWriter) *LogResponseWriter {
	return &LogResponseWriter{ResponseWriter: w}
}

func (w *LogResponseWriter) WriteHeader(code int) {
	w.statusCode = code
	w.ResponseWriter.WriteHeader(code)
}

func (w *LogResponseWriter) Write(body []byte) (int, error) {
	w.buf.Write(body)
	return w.ResponseWriter.Write(body)
}

type Server struct {
	articles models.ArticleStore
	mux      *mux.Router
}

func (m *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	startTime := time.Now()
	logRespWriter := NewLogResponseWriter(w)

	//	... operation that takes 20 milliseconds ...
	//	t := time.Now()
	//	elapsed := t.Sub(start)

	if r.Method == "OPTIONS" {
		logRespWriter.Header().Set("Access-Control-Allow-Origin", "*")
		logRespWriter.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		return
	}
	m.mux.ServeHTTP(logRespWriter, r)

	endTime := time.Now()
	elapsed := endTime.Sub(startTime)
	log.Printf(
		"duration=%dns status=%d path=%s",
		elapsed,
		logRespWriter.statusCode,
		r.URL.Path)
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
