package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
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

	// เช็กว่ามีการกดสนใจไปแล้วหรือยัง
	var existing orm.Notification
	err = orm.Db.Where("user_id = ? AND action_user_id = ? AND type = ?", interestedUserId, userId, "interest").First(&existing).Error

	if err == nil {
		// ถ้ามีแล้ว → ลบออก (Uninterest)
		orm.Db.Unscoped().Where("user_id = ? AND action_user_id = ? AND type = ?", interestedUserId, userId, "interest").Delete(&orm.Notification{})
		c.JSON(http.StatusOK, gin.H{"message": "Uninterested successfully"})
		return
	}

	// เพิ่มการกดสนใจเป็น Notification
	notification := orm.Notification{
		UserID:       uint(interestedUserId), // คนที่ถูกกดสนใจ
		ActionUserID: uint(userId),           // คนที่กดสนใจ
		Message:      fmt.Sprintf("User %d is interested in you!", userId),
		Type:         "interest",
	}
	orm.Db.Create(&notification)

	c.JSON(http.StatusOK, gin.H{"message": "Interested successfully"})
}

func GetNotifications(c *gin.Context) {
	userIdStr := c.DefaultQuery("userId", "")

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	var notifications []orm.Notification
	orm.Db.Where("user_id = ?", userId).Order("created_at DESC").Find(&notifications)

	c.JSON(http.StatusOK, notifications)
}
