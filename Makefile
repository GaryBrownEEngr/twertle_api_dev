phony: build

build:
	cd frontend && npm run build
	docker build -t twertle .