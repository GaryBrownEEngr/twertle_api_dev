phony: setup_node build

setup_node:
	cd frontend && npm install

build:
	docker build -t twertle .

