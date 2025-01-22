package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

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

func GetUserPost(c *gin.Context) {
	rows_get_user_post = nil
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
	`, int(userId)).Scan(&rows_get_user_post).Error

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/image_post/"
	for i := range rows_get_user_post {
		*rows_get_user_post[i].ImageURL = imageHost + *rows_get_user_post[i].ImageURL
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

	imagePath := fmt.Sprintf("./uploads/image_post/%d_*", post.ID)
	matches, _ := filepath.Glob(imagePath)
	for _, match := range matches {
		os.Remove(match)
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

func GetPostRandom(c *gin.Context) {
	rows_get_post_random = nil

	limit := c.DefaultQuery("limit", "")

	err := orm.Db.Raw(`
		SELECT 
			posts.id AS post_id,
			posts.detail AS post_detail,
			posts.created_at AS post_date,
			images.id AS image_id,
			images.img_url AS image_url,
			users.id AS user_id,
			users.fullname AS fullname,
			users.img_profile AS profile
		FROM 
			posts
		LEFT JOIN 
			users ON users.id = posts.user_id
		LEFT JOIN 
			images ON posts.id = images.post_id
			GROUP BY 
			posts.id
			ORDER BY RAND()
			LIMIT ?;
	`, limit).Scan(&rows_get_post_random).Error

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	device_host := os.Getenv("DEVICE_HOST")
	var ImagePostHost = "http://" + device_host + ":8080/get_image/image_post/"
	var ProfileHost = "http://" + device_host + ":8080/get_image/user_profile/"
	for i := range rows_get_post_random {
		*rows_get_post_random[i].ImageURL = ImagePostHost + *rows_get_post_random[i].ImageURL
		*rows_get_post_random[i].Profile = ProfileHost + *rows_get_post_random[i].Profile
	}
	c.JSON(http.StatusOK, gin.H{"status": "OK", "post": rows_get_post_random})
}
