package user

import (
	"changpab/jwt-api/orm"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func InterestUser(c *gin.Context) {
	userIdStr := c.DefaultPostForm("userId", "")
	interestedUserIdStr := c.DefaultPostForm("interestedUserId", "")

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	interestedUserId, err := strconv.ParseUint(interestedUserIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interested user ID"})
		return
	}

	if uint(userId) == uint(interestedUserId) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot be interested in yourself"})
		return
	}

	// // เช็กว่ามีการกดสนใจไปแล้วหรือยัง
	// var existing orm.Notification
	// err = orm.Db.Where("user_id = ? AND action_user_id = ? AND type = ?", interestedUserId, userId, "interest").First(&existing).Error

	// if err == nil {
	// 	// ถ้ามีแล้ว → ลบออก (Uninterest)
	// 	orm.Db.Unscoped().Where("user_id = ? AND action_user_id = ? AND type = ?", interestedUserId, userId, "interest").Delete(&orm.Notification{})
	// 	c.JSON(http.StatusOK, gin.H{"message": "Uninterested successfully"})
	// 	return
	// }

	name := c.DefaultPostForm("name", "")
	message := c.DefaultPostForm("message", "")

	// เพิ่มการกดสนใจเป็น Notification
	notification := orm.Notification{
		UserID:       uint(interestedUserId), // คนที่ถูกกดสนใจ
		ActionUserID: uint(userId),           // คนที่กดสนใจ
		Message:      message,
		Name:         name,
		Type:         "interest",
	}
	orm.Db.Create(&notification)

	c.JSON(http.StatusOK, gin.H{"message": "Interested successfully"})
}

func GetNotifications(c *gin.Context) {
	var userInterests []struct {
		ID          uint   `json:"id"`
		Fullname    string `json:"fullname"`
		Img_profile string `json:"img_profile"`
		Message     string `json:"message"`
		Name        string `json:"name"`
	}

	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/user_profile/"

	userIdStr := c.DefaultQuery("userId", "")

	userId, erre := strconv.ParseUint(userIdStr, 10, 32)
	if erre != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	err := orm.Db.Table("notifications").
		Select("users.id, users.fullname, users.img_profile, notifications.message").
		Joins("JOIN users ON notifications.action_user_id = users.id").
		Where("notifications.user_id = ?", uint(userId)).
		Order("notifications.created_at DESC").
		Find(&userInterests).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch interests users"})
		return
	}

	for i := range userInterests {
		userInterests[i].Img_profile = imageHost + userInterests[i].Img_profile
	}

	c.JSON(http.StatusOK, userInterests)
}
func GetSendUser(c *gin.Context) {
	var userInterests []struct {
		ID          uint   `json:"id"`
		Fullname    string `json:"fullname"`
		Img_profile string `json:"img_profile"`
		Message     string `json:"message"`
		Name        string `json:"name"`
	}

	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/user_profile/"

	userIdStr := c.DefaultQuery("userId", "")

	userId, erre := strconv.ParseUint(userIdStr, 10, 32)
	if erre != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	err := orm.Db.Table("notifications").
		Select("users.id, users.fullname, users.img_profile, notifications.message").
		Joins("JOIN users ON notifications.user_id = users.id").
		Where("notifications.action_user_id = ?", uint(userId)).
		Order("notifications.created_at DESC").
		Find(&userInterests).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch interests users"})
		return
	}

	for i := range userInterests {
		userInterests[i].Img_profile = imageHost + userInterests[i].Img_profile
	}

	c.JSON(http.StatusOK, userInterests)
}

func CheckInterests(c *gin.Context) {

	userIdStr := c.DefaultPostForm("userId", "")
	interestedUserIdStr := c.DefaultPostForm("interestedUserId", "")

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interests ID"})
		return
	}

	interestsUserId, err := strconv.ParseUint(interestedUserIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interests user ID"})
		return
	}

	// fmt.Println("Checking like for user:", userId, " -> liked user:", likedUserId)

	// ค้นหาไลก์ในฐานข้อมูล
	var existing orm.Notification
	err = orm.Db.Where("action_user_id = ? AND user_id = ?", userId, interestsUserId).First(&existing).Error

	if err == nil {
		// ถ้าพบไลก์
		c.JSON(http.StatusOK, gin.H{"interests": true})
	} else {
		// ถ้าไม่พบไลก์
		c.JSON(http.StatusOK, gin.H{"interests": false})
	}
}
