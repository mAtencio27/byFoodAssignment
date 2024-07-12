package models

type Books struct {
	SSID   uint   `gorm:"primaryKey"`
	Title  string `gorm:"size:255;not null"`
	Author string `gorm:"size:255;not null"`
	Year   int    `gorm:"not null"`
}
