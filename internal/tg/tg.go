package tg

import (
	"context"
	"errors"
	"log/slog"
	"time"

	"github.com/2made1ra/TEAM_FALL25/internal/config"
	"github.com/2made1ra/TEAM_FALL25/internal/db/null"
	"github.com/2made1ra/TEAM_FALL25/internal/store"
	"github.com/go-telegram/bot"
	"github.com/go-telegram/bot/models"
	"github.com/google/uuid"
)

type Bot struct {
	ctx   context.Context
	log   *slog.Logger
	cfg   *config.Config
	bot   *bot.Bot
	store store.Storage
}

func NewBot(ctx context.Context, logger *slog.Logger, cfg *config.Config, store store.Storage) *Bot {
	return &Bot{
		ctx:   ctx,
		log:   logger,
		cfg:   cfg,
		store: store,
	}
}

func (b *Bot) Start() {
	var err error
	b.bot, err = bot.New(
		b.cfg.TelegramBotToken,
		bot.WithDebug(),
		bot.WithDefaultHandler(b.handler),
		bot.WithCallbackQueryDataHandler("button", bot.MatchTypePrefix, b.callbackHandler),
	)
	if err != nil {
		b.log.Error("Failed to create bot", "error", err)
	}

	b.bot.RegisterHandler(bot.HandlerTypeMessageText, "start", bot.MatchTypeCommand, b.startHandler)

	b.bot.Start(b.ctx)

	b.log.Info("Bot stopped")
}

func (a *Bot) handler(ctx context.Context, b *bot.Bot, update *models.Update) {
	if update.Message != nil {
		b.SendMessage(ctx, &bot.SendMessageParams{
			ChatID: update.Message.Chat.ID,
			Text:   update.Message.Text,
		})
	}
}

func (a *Bot) startHandler(ctx context.Context, b *bot.Bot, update *models.Update) {
	if update.Message != nil {
		if update.Message.Chat.Type != models.ChatTypePrivate {
			a.log.Info("Ignoring non-private chat", "chat_id", update.Message.Chat.ID)
			return
		}
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
			ReplyMarkup: &models.InlineKeyboardMarkup{
				InlineKeyboard: [][]models.InlineKeyboardButton{
					{
						{Text: "Button 1", CallbackData: "button_1"},
						{Text: "Button 2", CallbackData: "button_2"},
					}, {
						{Text: "Button 3", CallbackData: "button_3"},
					},
				},
			},
		})
		if err != nil {
			a.log.Error("Failed to send message", "error", err)
			return
		}
	}
}

func (a *Bot) callbackHandler(ctx context.Context, b *bot.Bot, update *models.Update) {
	// answering callback query first to let Telegram know that we received the callback query,
	// and we're handling it. Otherwise, Telegram might retry sending the update repetitively
	// as it thinks the callback query doesn't reach to our application. learn more by
	// reading the footnote of the https://core.telegram.org/bots/api#callbackquery type.
	b.AnswerCallbackQuery(ctx, &bot.AnswerCallbackQueryParams{
		CallbackQueryID: update.CallbackQuery.ID,
		ShowAlert:       false,
	})
	b.SendMessage(ctx, &bot.SendMessageParams{
		ChatID: update.CallbackQuery.Message.Message.Chat.ID,
		Text:   "You selected the button: " + update.CallbackQuery.Data,
	})
}
