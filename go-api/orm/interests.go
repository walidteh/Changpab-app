package orm

import (
	"gorm.io/gorm"
)

type Notification struct {
	gorm.Model
	UserID       uint   `gorm:"index" json:"user_id"`        // ผู้ใช้ที่ได้รับแจ้งเตือน
	ActionUserID uint   `gorm:"index" json:"action_user_id"` // ผู้ใช้ที่ทำ Action (กดสนใจ)
	Name         string `json:"name"`
	Message      string `json:"message"`                      // ข้อความแจ้งเตือน
	Type         string `gorm:"type:varchar(50)" json:"type"` // ประเภท เช่น "interest"
	IsRead       bool   `gorm:"default:false" json:"is_read"` // สถานะว่าอ่านแล้วหรือยัง
}
