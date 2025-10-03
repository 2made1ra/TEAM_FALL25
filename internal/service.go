package internal

import (
	"context"
	"log/slog"
	"os/signal"
	"sync"
	"syscall"

	"github.com/2made1ra/TEAM_FALL25/internal/api"
	"github.com/2made1ra/TEAM_FALL25/internal/config"
	"github.com/2made1ra/TEAM_FALL25/internal/db"
	"github.com/2made1ra/TEAM_FALL25/internal/logger"
	"github.com/2made1ra/TEAM_FALL25/internal/store"
	"github.com/2made1ra/TEAM_FALL25/internal/tg"
)

type App struct {
	log *slog.Logger
	cfg *config.Config
}

func NewApp() *App {
	return &App{
		log: logger.New(),
		cfg: config.New(),
	}
}

func (a *App) Run() {
	a.log.Info("Application is starting")

	ctx, cancel := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	pool, err := db.NewPool(ctx, a.log, a.cfg)
	if err != nil {
		a.log.Error("Failed to create db pool", "error", err)
		return
	}
	storage := store.New(pool)

	wg := &sync.WaitGroup{}

	srv := api.New(ctx, storage, a.log)
	wg.Go(srv.Start)

	bot := tg.NewBot(ctx, a.log, a.cfg, storage)
	wg.Go(bot.Start)

	wg.Wait()
	a.log.Info("Application stopped")
}
