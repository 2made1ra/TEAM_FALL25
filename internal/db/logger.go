package db

import (
	"fmt"
	"log/slog"
	"strings"

	"github.com/pressly/goose/v3"
)

var _ goose.Logger = (*logger)(nil)

type logger struct {
	log *slog.Logger
}

func newLogger(log *slog.Logger) *logger {
	return &logger{log: log}
}

func (l *logger) Fatalf(format string, v ...any) {
	format = strings.TrimSuffix(format, "\n")
	msg := fmt.Sprintf(format, v...)
	l.log.Error(msg)
}

func (l *logger) Printf(format string, v ...any) {
	format = strings.TrimSuffix(format, "\n")
	msg := fmt.Sprintf(format, v...)
	l.log.Info(msg)
}
