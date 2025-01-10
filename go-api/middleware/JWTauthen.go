package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func JWTAuthen() gin.HandlerFunc {
	return func(c *gin.Context) {
		hmacSampleSecret := []byte(os.Getenv("JWT_SECRET_KEY"))
		header := c.Request.Header.Get("Authorization")

		// เอา Bearer ออกถ้ามี
		tokenString := strings.TrimSpace(header)
		if strings.HasPrefix(tokenString, "Bearer ") {
			tokenString = tokenString[len("Bearer "):]
		}

		// แปลง tokenString ไปเป็น jwt token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// ตรวจสอบว่าใช้ signing method ที่ถูกต้อง
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			// คืนค่า secret key สำหรับการตรวจสอบ
			return hmacSampleSecret, nil
		})

		// ตรวจสอบความถูกต้องของ token
		if Claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// ถ้า token ถูกต้อง ทำการดึงข้อมูล users
			c.Set("userId", Claims["userId"])
		} else {
			// ถ้า token ไม่ถูกต้อง ส่งข้อความ error
			c.AbortWithStatusJSON(http.StatusOK, gin.H{"status": "forbidden", "message": err.Error()})
		}

		c.Next()
	}
}
