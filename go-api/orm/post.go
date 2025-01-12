package orm

import (
	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	User_ID uint
	Detail  string
	Image   Image `gorm:"foreignKey:Post_ID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}
