# CHANGPAB 

## How to install ```./app``` (App) module

##### 1. go to app path
```
cd app
```

##### 2. install modul
```
app>npm install --force
```
<b>wait install successfully</b>


##### 3. run recheck module
```
app> npm audit --force
```
<b>successfully



## API
|Description|Api Path|Method|
|-----------|--------|------|
|สมัครสมาชิก|api_host/register|POST|
|เข้าสู่ระบบ|api_host/login|POST|
|รับผู้ใช้ทั้งหมด(ช่าง)|api_host/auth/get_all_user|GET|
|รับข้อมูลผู้ใช้|api_host/auth/get_user_info|GET|
|อัพโหลดรูปโพสต์|api_host/auth/upload_image_post|GET|
|อัพโหลดรูปโปรไฟล์|api_host/auth/upload_image_profile|GET|


