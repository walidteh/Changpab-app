package user

import "time"

type ImageBody struct {
	User_ID int    `json:"user_id" binding:"required"`
	Img_url string `json:"img_url" binding:"required"`
}

var rows_get_user_post []struct {
	PostID     uint      `json:"post_id"`
	PostDetail string    `json:"post_detail"`
	PostDate   time.Time `json:"post_date"`
	ImageID    *uint     `json:"image_id"` // Pointer to handle NULL values
	ImageURL   *string   `json:"image_url"`
}

var rows_get_post_random []struct {
	PostID     uint      `json:"post_id"`
	PostDetail string    `json:"post_detail"`
	PostDate   time.Time `json:"post_date"`
	ImageID    *uint     `json:"image_id"` // Pointer to handle NULL values
	ImageURL   *string   `json:"image_url"`
	User_ID    *uint     `json:"user_id"`
	Fullname   *string   `json:"fullname"`
	Profile    *string   `json:"profile"`
}
