package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func LikeUser(c *gin.Context) {

	userIdStr := c.DefaultPostForm("userId", "")
	likedUserIdStr := c.DefaultPostForm("likedUserId", "")

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	likedUserId, err := strconv.ParseUint(likedUserIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid liked user ID"})
		return
	}

	// fmt.Println("user id : ", userId)
	// fmt.Println("liked user id : ", likedUserId)

	if uint(userId) == uint(likedUserId) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot like yourself"})
		return
	}

	// ลบไลก์ออกจากฐานข้อมูลแบบ Hard Delete
	result := orm.Db.Unscoped().Where("user_id = ? AND liked_user_id = ?", userId, likedUserId).Delete(&orm.Likes{})

	// ถ้าพบไลก์และถูกลบจริง ๆ
	if result.RowsAffected > 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Unlike successful"})
		return
	}

	// ถ้ายังไม่มีไลก์ → เพิ่มไลก์ใหม่
	like := orm.Likes{
		UserID:      uint(userId),
		LikedUserID: uint(likedUserId),
	}
	orm.Db.Create(&like)

	c.JSON(http.StatusOK, gin.H{"message": "Liked successfully"})
}

func CheckLike(c *gin.Context) {

	userIdStr := c.DefaultQuery("userId", "")
	likedUserIdStr := c.DefaultQuery("likedUserId", "")

	userId, err := strconv.ParseUint(userIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	likedUserId, err := strconv.ParseUint(likedUserIdStr, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid liked user ID"})
		return
	}

	// fmt.Println("Checking like for user:", userId, " -> liked user:", likedUserId)

	// ค้นหาไลก์ในฐานข้อมูล
	var existing orm.Likes
	err = orm.Db.Where("user_id = ? AND liked_user_id = ?", userId, likedUserId).First(&existing).Error

	if err == nil {
		// ถ้าพบไลก์
		c.JSON(http.StatusOK, gin.H{"liked": true})
	} else {
		// ถ้าไม่พบไลก์
		c.JSON(http.StatusOK, gin.H{"liked": false})
	}
}

func GetLikedUsers(c *gin.Context) {
	var likedUsers []struct {
		ID          uint   `json:"id"`
		Fullname    string `json:"fullname"`
		Img_profile string `json:"img_profile"`
	}

	device_host := os.Getenv("DEVICE_HOST")
	var imageHost = "http://" + device_host + ":8080/get_image/user_profile/"

	userIdStr := c.DefaultQuery("userId", "")

	fmt.Println("userIdStr : ", userIdStr)

	userId, userIdErr := strconv.ParseUint(userIdStr, 10, 32)
	if userIdErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// ใช้ JOIN เพื่อดึงข้อมูลผู้ใช้ที่ไลก์เรา
	err := orm.Db.Table("likes").
		Select("users.id, users.fullname, users.img_profile").
		Joins("JOIN users ON likes.user_id = users.id").
		Where("likes.liked_user_id = ?", uint(userId)).
		Find(&likedUsers).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch liked users"})
		return
	}

	for i := range likedUsers {
		likedUsers[i].Img_profile = imageHost + likedUsers[i].Img_profile
	}

	c.JSON(http.StatusOK, likedUsers)
}
