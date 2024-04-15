.PHONY: build run

build:
	docker build -t sparesti_frontend .

run:
	docker run -p 5173:5173 sparesti_frontend