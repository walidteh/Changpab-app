package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

func UpdateName(c *gin.Context) {
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
		},
		"userContact": contact,
		"userRate":    rate,
		"posts":       result,
	})
}

func CreateContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	Contact_name := c.DefaultPostForm("Name", "")
	Contact_link := c.DefaultPostForm("Link", "")

	var host_found string = "default"
	if isValidPhoneNumber(Contact_name) {
		host_found = "phone"
	}
	if isValidEmail(Contact_name) {
		host_found = "email"
	}
	if host_found == "default" {
		hosts := [...]string{"facebook", "tiktok", "instagram"}
		for _, host := range hosts {
			if strings.Contains(Contact_link, host) {
				fmt.Println("Found:", host)
				host_found = host
				break
			}
		}
	}

	contact := orm.Contact{
		User_ID:      uint(userId),
		Contact_name: Contact_name,
		Contact_link: Contact_link,
		Contact_host: host_found,
	}
	if err := orm.Db.Create(&contact).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(200, gin.H{"status": "OK"})
}

func GetContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	var contact []orm.Contact
	orm.Db.Where("user_id = ?", userId).Find(&contact)
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Read Success", "userContact": contact})
}

func UpdateContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)
	contactID := c.DefaultQuery("contactID", "")

	var contact orm.Contact
	if err := orm.Db.Where("id = ? AND user_id = ?", contactID, uint(userId)).First(&contact).Error; err != nil {
		c.JSON(404, gin.H{"error": "Contact not found"})
		return
	}

	Contact_name := c.DefaultPostForm("Name", "")
	Contact_link := c.DefaultPostForm("Link", "")

	var host_found = contact.Contact_host
	if Contact_name != contact.Contact_name || Contact_link != contact.Contact_link {
		if isValidPhoneNumber(Contact_name) {
			host_found = "phone"
		} else if isValidEmail(Contact_name) {
			host_found = "email"
		} else {
			hosts := [...]string{"facebook", "tiktok", "instagram"}
			for _, host := range hosts {
				if strings.Contains(Contact_link, host) {
					host_found = host
					break
				}
			}
		}
	}

	contact.Contact_name = Contact_name
	contact.Contact_link = Contact_link
	contact.Contact_host = host_found

	if err := orm.Db.Save(&contact).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update contact"})
		return
	}

	c.JSON(200, gin.H{"status": "OK", "contact": contact})
}

func DeleteContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	contactId := c.DefaultQuery("contactId", "")
	if contactId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Missing contactId"})
		return
	}

	var contact orm.Contact
	result := orm.Db.Where("id = ? AND user_id = ?", contactId, userId).First(&contact)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Contact not found"})
		return
	}

	if err := orm.Db.Unscoped().Delete(&contact).Error; err != nil {
		fmt.Println("Error deleting contact:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact"})
		return
	}

	orm.Db.Delete(&contact)

	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Contact deleted successfully"})
}

func CreateRate(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	Type_name := c.DefaultPostForm("Type", "")
	Rate_price := c.DefaultPostForm("Price", "")

	rate := orm.Rate{
		User_ID: uint(userId),
		Type:    Type_name,
		Price:   Rate_price,
	}

	if err := orm.Db.Create(&rate).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create Rate"})
		return
	}

	c.JSON(200, gin.H{"status": "OK"})
}

func GetRate(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	var rate []orm.Rate
	orm.Db.Where("user_id = ?", userId).Find(&rate)
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Read Success", "userRate": rate})
}
