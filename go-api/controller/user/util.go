package user

import (
	"math/rand"
	"path/filepath"
	"regexp"
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

func isValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}
func isValidPhoneNumber(phone string) bool {
	re := regexp.MustCompile(`^(\+66|0)[689]\d{8}$`)
	return re.MatchString(phone)
}
