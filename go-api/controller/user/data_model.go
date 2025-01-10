package user

type ImageBody struct {
	User_ID int    `json:"user_id" binding:"required"`
	Img_url string `json:"img_url" binding:"required"`
}
