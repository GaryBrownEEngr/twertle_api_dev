package articlestore

import (
	"main/models"
)

type store []models.Article

func NewStore(articles []models.Article) *store {
	s := store(articles)
	return &s
}

func (a *store) CreateArticle(newArticle *models.Article) {
	*a = append(*a, *newArticle)
}

func (a *store) GetArticle(id string) *models.Article {

	for _, article := range *a {
		if article.Id == id {
			return &article
		}
	}
	return nil
}

func (a *store) GetArticles() []models.Article {
	return (*a)[:]
}
