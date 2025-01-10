package orm

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username    string
	Password    string
	Fullname    string
	Lastname    string
	Email       string
	Img_profile string
	Role        string
	Detail      string
	Posts       []Post `gorm:"foreignKey:User_ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
