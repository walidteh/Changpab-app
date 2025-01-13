package main

import (
	AuthController "changpab/jwt-api/controller/auth"
	UserController "changpab/jwt-api/controller/user"
	"changpab/jwt-api/middleware"
	_ "changpab/jwt-api/middleware"
	"changpab/jwt-api/orm"
	"fmt"
	"os"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	orm.InitDB()

	r := gin.Default()

	// ให้เซิร์ฟเวอร์สามารถเข้าถึงไฟล์ในโฟลเดอร์ ./uploads ได้
	r.Static("/get_image", "./uploads/") // เพิ่มบรรทัดนี้

	r.Use(cors.Default())
	r.POST("/register", AuthController.Register)
	r.POST("/login", AuthController.Login)

	authorized := r.Group("/users", middleware.JWTAuthen())
	authorized.GET("/get_all_user", UserController.GetAllUser)
	authorized.GET("/get_user_info", UserController.GetUserInfo)
	authorized.GET("/search", UserController.Search)
	authorized.POST("/upload_image_post", UserController.UploadImagePost)
	authorized.POST("/upload_image_profile", UserController.UploadImageProfile)
	authorized.POST("/create_post", UserController.CreatePost)
	authorized.GET("/get_post_info", UserController.GetPostsWithImages)

	device_host := os.Getenv("DEVICE_HOST")

	r.Run(device_host + ":8080")
}
