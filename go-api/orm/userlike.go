package orm

import (
	"gorm.io/gorm"
)

type Likes struct {
	gorm.Model
	UserID      uint `gorm:"index" json:"user_id"`
	LikedUserID uint `gorm:"index" json:"liked_user_id"`
}
