package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func GetAllUser(c *gin.Context) {
	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/user_profile/"
	var users []orm.User
	// orm.Db.Where("Role = ?", "PG").Find(&users)
	orm.Db.Find(&users, "Role = ?", "PG")
	for i := range users {
		users[i].Img_profile = imageHost + users[i].Img_profile
		// fmt.Println("%s", users[i].Img_profile)
	}
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Read Success", "userId": users})
}

func GetUserInfo(c *gin.Context) {
	userId := c.MustGet("userId").(float64)
	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/user_profile/"
	var user orm.User
	orm.Db.First(&user, userId)
	user.Img_profile = fmt.Sprintf(imageHost+"%s", user.Img_profile)
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Read Success", "userId": user})
}

func UploadImageProfile(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	// รับไฟล์จาก form-data
	file, _ := c.FormFile("file") // 'file' คือ key ที่ส่งมาจาก client
	FileUrlOld := c.DefaultPostForm("FileOld", "")
	fileOld := filepath.Base(FileUrlOld)
	fmt.Println(fileOld)
	if fileOld != "default.png" {
		err := os.Remove("./uploads/user_profile/" + fileOld)
		if err != nil {
			fmt.Printf("ไม่สามารถลบไฟล์ได้: %v\n", err)
		} else {
			fmt.Println("ลบไฟล์สำเร็จ!")
		}
	}

	if file == nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "No file found"})
		return
	}

	// ตั้งชื่อไฟล์ใหม่ หรือจัดการชื่อไฟล์ตามที่ต้องการ
	fileName := fmt.Sprintf("%d_%s.%s", int(userId), RandomString(8), GetFileType(file.Filename))
	filePath := fmt.Sprintf("./uploads/user_profile/%s", fileName)

	fmt.Println(fileName)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to save file"})
		return
	}

	var user orm.User
	user.ID = uint(userId)
	user.Img_profile = fileName
	if err := orm.Db.Model(&user).Select("Img_profile").Updates(user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to update user profile"})
		return
	}

	// ส่ง response
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"message": "Profile image uploaded successfully",
		"file":    fileName,
	})
}

func Search(c *gin.Context) {
	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/user_profile/"
	keyword := c.DefaultQuery("keyword", "")

	var users []orm.User
	if err := orm.Db.Where("fullname LIKE ? AND role = ?", keyword+"%", "PG").Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to retrieve users"})
		return
	}

	for i := range users {
		users[i].Img_profile = imageHost + users[i].Img_profile
	}

	c.JSON(200, gin.H{
		"status": "OK",
		"users":  users,
	})
}
