package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

var _ = (*Store)(nil)

type Storage interface {
	TxFunc(ctx context.Context, fn func(ctx context.Context) error) error

	GetUserByTID(ctx context.Context, tid int64) (*User, error)
	CreateUser(ctx context.Context, user *User) error
}

type Store struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Store {
	return &Store{
		pool: pool,
	}
}
