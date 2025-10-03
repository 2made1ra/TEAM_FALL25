package api

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"sync"
	"time"

	"github.com/2made1ra/TEAM_FALL25/internal/store"
)

type API struct {
	ctx   context.Context
	store store.Storage
	log   *slog.Logger
}

func New(ctx context.Context, store store.Storage, logger *slog.Logger) *API {
	return &API{
		ctx:   ctx,
		store: store,
		log:   logger,
	}
}

func (a *API) Start() {
	mux := http.NewServeMux()

	s := &http.Server{
		Addr:     ":8080",
		Handler:  mux,
		ErrorLog: slog.NewLogLogger(a.log.Handler(), slog.LevelDebug),
	}

	wg := &sync.WaitGroup{}
	wg.Go(func() {
		a.log.Info("Server started on http://127.0.0.1:8080")
		<-a.ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), time.Second*5)
		defer cancel()
		err := s.Shutdown(shutdownCtx)
		if err != nil {
			a.log.Error("Failed to shutdown server", "error", err)
		} else {
			a.log.Info("Server stopped")
		}
	})

	err := s.ListenAndServe()
	if err != nil && !errors.Is(err, http.ErrServerClosed) {
		a.log.Error("Failed to start server", "error", err)
	}
	wg.Wait()
}
