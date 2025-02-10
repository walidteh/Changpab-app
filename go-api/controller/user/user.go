package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func UpdateUser(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	fullname := c.DefaultPostForm("fullname", "")
	lastname := c.DefaultPostForm("lastname", "")

	if fullname == "" || lastname == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Fullname and Lastname are required"})
		return
	}

	var user orm.User
	if err := orm.Db.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "User not found"})
		return
	}

	user.Fullname = fullname
	user.Lastname = lastname
	if err := orm.Db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok", "name": user})
}

func GetAllUser(c *gin.Context) {
	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/user_profile/"
	var users []orm.User
	orm.Db.Find(&users, "Role = ?", "PG")
	for i := range users {
		users[i].Img_profile = imageHost + users[i].Img_profile
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

func GetUserInfo_Visitors(c *gin.Context) {
	userId := c.DefaultQuery("userId", "")
	if userId == "" {
		c.JSON(400, gin.H{"error": "Missing or invalid userId"})
		return
	}

	device_host := os.Getenv("DEVICE_HOST")
	imageHostProfile := fmt.Sprintf("http://%s:8080/get_image/user_profile/", device_host)
	imageHostPost := fmt.Sprintf("http://%s:8080/get_image/image_post/", device_host)

	var user orm.User
	if err := orm.Db.First(&user, userId).Error; err != nil {
		c.JSON(404, gin.H{"error": "User not found"})
		return
	}

	user.Img_profile = fmt.Sprintf("%s%s", imageHostProfile, user.Img_profile)

	var contact []orm.Contact
	orm.Db.Where("user_id = ?", userId).Find(&contact)

	var rate []orm.Rate
	orm.Db.Where("user_id = ?", userId).Find(&rate)

	var rows_get_user_post []struct {
		PostID     uint    `json:"post_id"`
		PostDetail string  `json:"post_detail"`
		PostDate   string  `json:"post_date"`
		ImageID    *uint   `json:"image_id"`
		ImageURL   *string `json:"image_url"`
	}

	if err := orm.Db.Raw(`
		SELECT 
			posts.id AS post_id,
			posts.detail AS post_detail,
			posts.created_at AS post_date,
			images.id AS image_id,
			images.img_url AS image_url
		FROM 
			posts
		LEFT JOIN 
			images 
		ON 
			posts.id = images.post_id
		WHERE 
			posts.user_id = ?
		ORDER BY post_id DESC;
	`, userId).Scan(&rows_get_user_post).Error; err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	result := make([]map[string]interface{}, 0)
	postMap := make(map[uint]map[string]interface{})

	for _, row := range rows_get_user_post {
		if _, exists := postMap[row.PostID]; !exists {
			post := map[string]interface{}{
				"post_id":     row.PostID,
				"post_detail": row.PostDetail,
				"post_date":   row.PostDate,
				"images":      []map[string]interface{}{},
			}
			postMap[row.PostID] = post
			result = append(result, post)
		}
		if row.ImageID != nil && row.ImageURL != nil {
			image := map[string]interface{}{
				"image_id": *row.ImageID,
				"url":      imageHostPost + *row.ImageURL,
			}
			postMap[row.PostID]["images"] = append(postMap[row.PostID]["images"].([]map[string]interface{}), image)
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"status": "OK",
		"user": map[string]interface{}{
			"user_id":     user.ID,
			"fullname":    user.Fullname,
			"img_profile": user.Img_profile,
			"email":       user.Email,
			"detail":      user.Detail,
		},
		"userContact": contact,
		"userRate":    rate,
		"posts":       result,
	})
}

func UpdateDetail(c *gin.Context) {
	userId := c.MustGet("userId").(float64)
	detail := c.DefaultPostForm("Detail", "")

	if detail == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Detail is required"})
		return
	}

	var user orm.User
	if err := orm.Db.First(&user, userId).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "User not found"})
		return
	}

	user.Detail = detail
	if err := orm.Db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "ok", "user": user})
}
