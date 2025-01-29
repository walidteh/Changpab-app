package orm

import (
	"gorm.io/gorm"
)

type Contact struct {
	gorm.Model
	User_ID      uint
	Contact_name string
	Contact_link string
	Contact_host string
}
