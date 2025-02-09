package user

import (
	"changpab/jwt-api/orm"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func CreateContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	Contact_name := c.DefaultPostForm("Name", "")
	Contact_link := c.DefaultPostForm("Link", "")

	var host_found string = "default"
	if isValidPhoneNumber(Contact_name) {
		host_found = "phone"
	}
	if isValidEmail(Contact_name) {
		host_found = "email"
	}
	if host_found == "default" {
		hosts := [...]string{"facebook", "tiktok", "instagram"}
		for _, host := range hosts {
			if strings.Contains(Contact_link, host) {
				fmt.Println("Found:", host)
				host_found = host
				break
			}
		}
	}

	contact := orm.Contact{
		User_ID:      uint(userId),
		Contact_name: Contact_name,
		Contact_link: Contact_link,
		Contact_host: host_found,
	}
	if err := orm.Db.Create(&contact).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create post"})
		return
	}

	c.JSON(200, gin.H{"status": "OK"})
}

func GetContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	var contact []orm.Contact
	orm.Db.Where("user_id = ?", userId).Find(&contact)
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Read Success", "userContact": contact})
}

func UpdateContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)
	contactID := c.DefaultQuery("contactID", "")

	var contact orm.Contact
	if err := orm.Db.Where("id = ? AND user_id = ?", contactID, uint(userId)).First(&contact).Error; err != nil {
		c.JSON(404, gin.H{"error": "Contact not found"})
		return
	}

	Contact_name := c.DefaultPostForm("Name", "")
	Contact_link := c.DefaultPostForm("Link", "")

	var host_found = contact.Contact_host
	if Contact_name != contact.Contact_name || Contact_link != contact.Contact_link {
		if isValidPhoneNumber(Contact_name) {
			host_found = "phone"
		} else if isValidEmail(Contact_name) {
			host_found = "email"
		} else {
			hosts := [...]string{"facebook", "tiktok", "instagram"}
			for _, host := range hosts {
				if strings.Contains(Contact_link, host) {
					host_found = host
					break
				}
			}
		}
	}

	contact.Contact_name = Contact_name
	contact.Contact_link = Contact_link
	contact.Contact_host = host_found

	if err := orm.Db.Save(&contact).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update contact"})
		return
	}

	c.JSON(200, gin.H{"status": "OK", "contact": contact})
}

func DeleteContact(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	contactId := c.DefaultQuery("contactId", "")
	if contactId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Missing contactId"})
		return
	}

	var contact orm.Contact
	result := orm.Db.Where("id = ? AND user_id = ?", contactId, userId).First(&contact)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Contact not found"})
		return
	}

	if err := orm.Db.Unscoped().Delete(&contact).Error; err != nil {
		fmt.Println("Error deleting contact:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact"})
		return
	}

	orm.Db.Delete(&contact)

	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Contact deleted successfully"})
}

func CreateRate(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	Type_name := c.DefaultPostForm("Type", "")
	Rate_price := c.DefaultPostForm("Price", "")

	rate := orm.Rate{
		User_ID: uint(userId),
		Type:    Type_name,
		Price:   Rate_price,
	}

	if err := orm.Db.Create(&rate).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to create Rate"})
		return
	}

	c.JSON(200, gin.H{"status": "OK"})
}

func GetRate(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	var rate []orm.Rate
	orm.Db.Where("user_id = ?", userId).Find(&rate)
	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "User Read Success", "userRate": rate})
}

func UpdateRate(c *gin.Context) {
	userId := c.MustGet("userId").(float64)
	RateID := c.DefaultQuery("RateID", "")

	if RateID == "" {
		c.JSON(400, gin.H{"error": "RateID is required"})
		return
	}

	var rate orm.Rate
	if err := orm.Db.Where("id = ? AND user_id = ?", RateID, uint(userId)).First(&rate).Error; err != nil {
		c.JSON(404, gin.H{"error": "Contact not found"})
		return
	}

	Type_name := c.DefaultPostForm("Type", "")
	Rate_price := c.DefaultPostForm("Price", "")

	rate.Type = Type_name
	rate.Price = Rate_price

	if err := orm.Db.Save(&rate).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to update contact"})
		return
	}

	c.JSON(200, gin.H{"status": "OK", "rate": rate})
}

func DeleteRate(c *gin.Context) {
	userId := c.MustGet("userId").(float64)

	RateID := c.DefaultQuery("RateID", "")
	if RateID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"status": "error", "message": "Missing RateID"})
		return
	}

	var rate orm.Rate
	result := orm.Db.Where("id = ? AND user_id = ?", RateID, userId).First(&rate)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"status": "error", "message": "Contact not found"})
		return
	}

	if err := orm.Db.Unscoped().Delete(&rate).Error; err != nil {
		fmt.Println("Error deleting rate:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete contact"})
		return
	}

	orm.Db.Delete(&rate)

	c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Contact deleted successfully"})
}
