package db

import (
	"embed"
	"fmt"
	"log/slog"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
)

//go:embed files
var fs embed.FS

func migrate(pool *pgxpool.Pool, logger *slog.Logger) error {
	db := stdlib.OpenDBFromPool(pool)
	goose.SetLogger(newLogger(logger))
	err := goose.SetDialect("pgx")
	if err != nil {
		return fmt.Errorf("failed to set goose dialect: %w", err)
	}
	goose.SetBaseFS(fs)
	err = goose.Up(db, "files")
	if err != nil {
		return fmt.Errorf("failed to apply up-migrations: %w", err)
	}
	return nil
}
