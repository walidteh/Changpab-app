package auth

import (
	"changpab/jwt-api/orm"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

var hmacSampleSecret []byte

func Register(c *gin.Context) {
	var json RegisterBody
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var userExist orm.User
	orm.Db.Where("username = ?", json.Username).First(&userExist)
	if userExist.ID > 0 {
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Username Already Exists"})
		return
	}

	var emailExist orm.User
	orm.Db.Where("email = ?", json.Email).First(&emailExist)
	if emailExist.ID > 0 {
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Email Already Exists"})
		return
	}

	encryptedPassword, _ := bcrypt.GenerateFromPassword([]byte(json.Password), 10)
	user := orm.User{
		Username:    json.Username,
		Password:    string(encryptedPassword),
		Fullname:    json.Fullname,
		Lastname:    json.Lastname,
		Email:       json.Email,
		Img_profile: "default.png",
		Role:        json.Role,
	}
	orm.Db.Create(&user)
	if user.ID > 0 {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Create Success", "userId": user.ID})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "User Create Failed"})
	}
}

func Login(c *gin.Context) {
	var json LoginBody
	if err := c.ShouldBindJSON(&json); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var userExist orm.User
	orm.Db.Where("username = ?", json.Username).First(&userExist)
	if userExist.ID == 0 {
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "User Does Not Exist"})
		return
	}

	// Verify password
	err := bcrypt.CompareHashAndPassword([]byte(userExist.Password), []byte(json.Password))
	if err == nil {
		hmacSampleSecret = []byte(os.Getenv("JWT_SECRET_KEY"))
		token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
			"userId": userExist.ID,
			// "exp":    time.Now().Add(time.Minute * 1).Unix(),
		})
		// Sign and get the complete encoded token as a string using the secret
		tokenString, err := token.SignedString(hmacSampleSecret)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Token Generation Failed"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Login Success", "token": tokenString, "role": userExist.Role})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Login Failed"})
	}
}
