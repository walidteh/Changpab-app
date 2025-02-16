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
	authorized.POST("/upload_image_profile", UserController.UploadImageProfile)
	authorized.POST("/create_post", UserController.CreatePost)
	authorized.GET("/get_post_info", UserController.GetUserPost)
	authorized.DELETE("/delete_post", UserController.DeletePost)
	authorized.GET("/get_post_random", UserController.GetPostRandom)
	authorized.PUT("/edit_post", UserController.EditPost)
	authorized.GET("/get_post_visitors", UserController.GetUserInfo_Visitors)
	authorized.POST("/create_contact", UserController.CreateContact)
	authorized.GET("/get_contact", UserController.GetContact)
	authorized.PUT("/edit_contact", UserController.UpdateContact)
	authorized.DELETE("/delete_contact", UserController.DeleteContact)
	authorized.POST("/edit_user", UserController.UpdateUser)
	authorized.POST("/create_rate", UserController.CreateRate)
	authorized.GET("/get_rate", UserController.GetRate)
	authorized.PUT("/edit_rate", UserController.UpdateRate)
	authorized.DELETE("/delete_rate", UserController.DeleteRate)
	authorized.POST("/update_detail", UserController.UpdateDetail)
	authorized.GET("/post_visitor", UserController.GetPostVisitor)
	authorized.GET("/get_user_visitors", UserController.UserVisitors)

	device_host := os.Getenv("DEVICE_HOST")

	r.Run(device_host + ":8080")
}
