package orm

import (
	"gorm.io/gorm"
)

type Image struct {
	gorm.Model
	Post_ID int
	Img_url string
}
