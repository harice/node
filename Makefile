.PHONY: build up sync kill setup

build:
	docker-compose build

up:
	docker-compose up

sync:
	docker-rsync -dst /projects/ default

kill:
	docker-compose kill

setup:
	./bin/setup.sh
