package user

import (
	"math/rand"
	"path/filepath"
	"strings"
	"time"
)

func RandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))

	randomString := make([]byte, length)
	for i := range randomString {
		randomString[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(randomString)
}

func GetFileType(fileName string) string {
	ext := filepath.Ext(fileName)
	if len(ext) > 0 {
		return strings.TrimPrefix(ext, ".")
	}
	return ""
}
