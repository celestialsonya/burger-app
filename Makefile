run:
	migrate -path server/migrations -database postgres://postgres:admin@localhost:5432/shop?sslmode=disable up