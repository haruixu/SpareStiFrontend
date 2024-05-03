.PHONY: build run run-dev unit e2e clean-docker

build-docker:
	docker build -t sparesti_frontend .

run-docker:
	docker run --rm --name sparesti_frontend_container -p 5173:5173 sparesti_frontend

clean-docker:
	-docker stop sparesti_frontend_container
	-docker rm sparesti_frontend_container

run:
	make build-docker
	make clean-docker
	make run-docker

run-dev:
	npm run dev

unit:
	npm run test:unit

format:
	npm run format-test

e2e:
	npm run test:e2e
test:
	make unit
	make e2e
	make format
