package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

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

func UploadImagePost(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	// รับไฟล์จาก form-data
	file, _ := c.FormFile("file") // 'file' คือ key ที่ส่งมาจาก client

	if file == nil {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "No file found"})
		return
	}

	// ตั้งชื่อไฟล์ใหม่ หรือจัดการชื่อไฟล์ตามที่ต้องการ
	fileName := fmt.Sprintf("%d_%s", int(userId), file.Filename)
	filePath := fmt.Sprintf("./uploads/%s", fileName)

	fmt.Println(fileName)

	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "error", "message": "Failed to save file"})
		return
	}

	image := orm.Image{
		Post_ID: int(userId),
		Img_url: fileName,
	}
	orm.Db.Create(&image)
	if image.ID > 0 {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Upload Success", "userId": image.ID})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "error", "message": "Upload Failed"})
	}

	// ส่ง response
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"message": "Profile image uploaded successfully",
		"file":    fileName,
	})
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
	fileName := fmt.Sprintf("%d_%s", int(userId), file.Filename)
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

func CreatePost(c *gin.Context) {
	userId := c.MustGet("userId").(float64)
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(400, gin.H{"error": "Failed to parse form-data"})
		return
	}

	files := form.File["files"]
	PostDetail := c.DefaultPostForm("postdetail", "")

	post := orm.Post{
		User_ID: uint(userId),
		Detail:  PostDetail,
	}
	if err := orm.Db.Create(&post).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create post"})
		return
	}

	for _, file := range files {
		fmt.Println(file.Filename)
	}

	var img_post []orm.Image

	for _, file := range files {
		fileName := fmt.Sprintf("%d_%s", int(post.ID), file.Filename)
		filePath := "./uploads/image_post/" + fileName
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(500, gin.H{"error": "Failed to save file"})
			return
		}

		image := orm.Image{
			Img_url: fileName,
			Post_ID: int(post.ID),
		}
		img_post = append(img_post, image)
	}

	if err := orm.Db.Create(&img_post).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create images"})
		return
	}

	c.JSON(200, gin.H{"status": "OK"})
}

func GetPostsWithImages(c *gin.Context) {
	var rows []struct {
		PostID     uint      `json:"post_id"`
		PostDetail string    `json:"post_detail"`
		PostDate   time.Time `json:"post_date"`
		ImageID    *uint     `json:"image_id"` // Pointer to handle NULL values
		ImageURL   *string   `json:"image_url"`
	}

	userId, ok := c.MustGet("userId").(float64)
	if !ok {
		c.JSON(400, gin.H{"error": "Invalid user ID"})
		return
	}

	err := orm.Db.Raw(`
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
			posts.user_id = ? ORDER BY post_id DESC;
	`, int(userId)).Scan(&rows).Error

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/image_post/"
	for i := range rows {
		*rows[i].ImageURL = imageHost + *rows[i].ImageURL
		// fmt.Println("%s", users[i].Img_profile)
	}

	// Group posts and their images
	result := make([]map[string]interface{}, 0)
	postMap := make(map[uint]map[string]interface{})

	for _, row := range rows {
		// If the post is not already in the result, add it
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

		// If there is an image, append it to the post's images
		if row.ImageID != nil && row.ImageURL != nil {
			image := map[string]interface{}{
				"image_id": *row.ImageID,
				"url":      *row.ImageURL,
			}
			postMap[row.PostID]["images"] = append(postMap[row.PostID]["images"].([]map[string]interface{}), image)
		}
	}
	c.JSON(http.StatusOK, gin.H{"status": "OK", "post": result})
}

func DeletePost(c *gin.Context) {

	postId := c.DefaultQuery("postId", "")
	if _, err := strconv.Atoi(postId); err != nil {
		c.JSON(400, gin.H{"error": "Invalid postId"})
		return
	}

	var post orm.Post
	if err := orm.Db.First(&post, postId).Error; err != nil {
		c.JSON(404, gin.H{"error": "Post not found"})
		return
	}

	if err := orm.Db.Unscoped().Delete(&post).Error; err != nil {
		fmt.Println("Error deleting post:", err)
		c.JSON(500, gin.H{"error": "Failed to delete post"})
		return
	}

	c.JSON(200, gin.H{
		"status": "Post deleted successfully",
		"postId": postId,
	})
}
