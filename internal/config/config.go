package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	TelegramBotToken string
	DBAddr           string
	IsProduction     bool
}

func New() *Config {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}
	return &Config{
		TelegramBotToken: os.Getenv("TG_BOT_TOKEN"),
		DBAddr:           os.Getenv("DB_ADDR"),
		IsProduction:     os.Getenv("IS_PRODUCTION") == "true",
	}
}
