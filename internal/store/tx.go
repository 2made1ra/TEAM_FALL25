package store

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

func (s *Store) TxFunc(ctx context.Context, fn func(ctx context.Context) error) error {
	tx, err := s.pool.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			rErr := tx.Rollback(ctx)
			if rErr != nil {
				err = fmt.Errorf("%w: %w", err, rErr)
			}
		} else {
			err = tx.Commit(ctx)
		}
	}()
	ctx = context.WithValue(ctx, "tx", tx)
	err = fn(ctx)
	return err
}

type Querier interface {
	Exec(ctx context.Context, sql string, args ...any) (commandTag pgconn.CommandTag, err error)
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
}

func (s *Store) getQuerier(ctx context.Context) Querier {
	tx, ok := ctx.Value("tx").(pgx.Tx)
	if ok {
		return tx
	}
	return s.pool
}
