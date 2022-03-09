package models

type Article struct {
	Id      string `json:"Id"`
	Title   string `json:"Title"`
	Desc    string `json:"desc"`
	Content string `json:"content"`
}

type ArticleStore interface {
	CreateArticle(newArticle *Article)
	GetArticle(id string) *Article
	GetArticles() []Article
}
