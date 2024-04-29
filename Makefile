.PHONY: build run

build-docker:
	docker build -t sparesti_frontend .

run-docker:
	docker run -p 5173:5173 sparesti_frontend

run:
	make build-docker
	make run-docker

run-dev:
	npm run dev

unit:
	npm run test:unit

e2e:
	npm run test:e2e