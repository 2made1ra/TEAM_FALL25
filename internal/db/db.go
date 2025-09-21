package db

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/2made1ra/TEAM_FALL25/internal/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

func NewPool(ctx context.Context, log *slog.Logger, cfg *config.Config) (*pgxpool.Pool, error) {
	pool, err := pgxpool.New(ctx, cfg.DBAddr)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to PostgreSQL: %w", err)
	}
	err = pool.Ping(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to ping PostgreSQL: %w", err)
	}
	err = migrate(pool, log)
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database: %w", err)
	}
	return pool, nil
}
