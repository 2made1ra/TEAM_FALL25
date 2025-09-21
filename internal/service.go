package internal

import (
	"context"
	"errors"
	"log/slog"
	"os"
	"os/signal"
	"time"

	"github.com/2made1ra/TEAM_FALL25/internal/config"
	"github.com/2made1ra/TEAM_FALL25/internal/db"
	"github.com/2made1ra/TEAM_FALL25/internal/db/null"
	"github.com/2made1ra/TEAM_FALL25/internal/logger"
	"github.com/2made1ra/TEAM_FALL25/internal/store"
	"github.com/go-telegram/bot"
	"github.com/go-telegram/bot/models"
	"github.com/google/uuid"
)

type App struct {
	log   *slog.Logger
	cfg   *config.Config
	bot   *bot.Bot
	store store.Storage
}

func NewApp() *App {
	return &App{
		log: logger.New(),
		cfg: config.New(),
	}
}

func (a *App) Run() {
	a.log.Info("Application is starting")

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	pool, err := db.NewPool(ctx, a.log, a.cfg)
	if err != nil {
		a.log.Error("Failed to create db pool", "error", err)
		return
	}
	a.store = store.New(pool)

	a.bot, err = bot.New(a.cfg.TelegramBotToken, bot.WithDebug(), bot.WithDefaultHandler(a.handler))
	if err != nil {
		a.log.Error("Failed to create bot", "error", err)
	}

	a.bot.RegisterHandler(bot.HandlerTypeMessageText, "start", bot.MatchTypeCommand, a.startHandler)

	a.bot.Start(ctx)
}

func (a *App) handler(ctx context.Context, b *bot.Bot, update *models.Update) {
	if update.Message != nil {
		b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID: update.Message.Chat.ID,
			Text:   update.Message.Text,
		})
	}
}

func (a *App) startHandler(ctx context.Context, b *bot.Bot, update *models.Update) {
	if update.Message != nil {
		u, err := a.store.GetUserByTID(ctx, update.Message.From.ID)
		if err != nil {
			if errors.Is(err, store.ErrUserNotFound) {
				var uid uuid.UUID
				uid, err = uuid.NewV7()
				if err != nil {
					a.log.Error("Failed to generate UUID", "error", err)
				}
				u = &store.User{
					TID:       update.Message.From.ID,
					UUID:      uid.String(),
					FirstName: update.Message.From.FirstName,
					LastName:  null.WrapString(update.Message.From.LastName),
					Username:  null.WrapString(update.Message.From.Username),
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}
				err = a.store.CreateUser(ctx, u)
				if err != nil {
					a.log.Error("Failed to create user", "error", err)
					return
				}
				_, err = b.SendMessage(ctx, &bot.SendMessageParams{
					ChatID: update.Message.Chat.ID,
					Text:   "Пользователь успешно создан!",
				})
				if err != nil {
					a.log.Error("Failed to send message", "error", err)
					return
				}
				return
			}
			a.log.Error("Failed to get user by TID", "error", err)
			return
		}
		_, err = b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID: update.Message.Chat.ID,
			Text:   "У вас уже есть аккаунт!",
		})
		if err != nil {
			a.log.Error("Failed to send message", "error", err)
			return
		}
	}
}
