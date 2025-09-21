package store

import (
	"context"
	"errors"
	"time"

	"github.com/2made1ra/TEAM_FALL25/internal/db/null"
	"github.com/jackc/pgx/v5"
)

var ErrUserNotFound = errors.New("user not found")

type User struct {
	ID        int
	TID       int64
	UUID      string
	FirstName string
	LastName  null.String
	Username  null.String
	CreatedAt time.Time
	UpdatedAt time.Time
}

func (s *Store) GetUserByTID(ctx context.Context, tid int64) (*User, error) {
	user := &User{}
	err := s.pool.QueryRow(
		ctx,
		"SELECT id, tid, uuid, first_name, last_name, username, created_at, updated_at FROM users WHERE tid = $1",
		tid,
	).Scan(
		&user.ID,
		&user.TID,
		&user.UUID,
		&user.FirstName,
		&user.LastName,
		&user.Username,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return user, nil
}

func (s *Store) CreateUser(ctx context.Context, user *User) (err error) {
	err = s.pool.QueryRow(
		ctx,
		"INSERT INTO users (tid, uuid, first_name, last_name, username, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
		user.TID,
		user.UUID,
		user.FirstName,
		user.LastName,
		user.Username,
		user.CreatedAt,
		user.UpdatedAt,
	).Scan(&user.ID)
	return err
}
