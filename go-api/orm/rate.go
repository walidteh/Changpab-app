package orm

import (
	"gorm.io/gorm"
)

type Rate struct {
	gorm.Model
	User_ID uint
	Type    string
	Price   string
}
