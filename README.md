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


## Error expo
```
npx expo-doctor
npx expo install --check
```

## Deploy
##### 1. Build Go
```
go-api>go build -o <file build name>
```

##### 2. Reload file
```
sudo systemctl daemon-reload
```

##### 3. Restart Service
```
sudo systemctl restart <file service name>
```

##### 4. View Service Logs
```
sudo journalctl -u <file service name> -f
```

## Ubuntu Command Recommended

##### Status Service
```
sudo systemctl status <file service name>
```

##### Edit File Service
```
sudo nano /etc/systemd/system/<file service name>
```

## File Service Detail
```
[Unit]
Description=Go API Service
After=network.target

[Service]
ExecStart=/path/to/your/go/api/binary
Restart=always
User=your-username
Group=your-groupname
WorkingDirectory=/path/to/your/api

[Install]
WantedBy=multi-user.target
```

## API
|Description|Api Path|Method|
|-----------|--------|------|
|สมัครสมาชิก|api_host/register|POST|
|เข้าสู่ระบบ|api_host/login|POST|
|รับผู้ใช้ทั้งหมด(ช่าง)|api_host/auth/get_all_user|GET|
|รับข้อมูลผู้ใช้|api_host/auth/get_user_info|GET|
|อัพโหลดรูปโพสต์|api_host/auth/upload_image_post|POST|
|อัพโหลดรูปโปรไฟล์|api_host/auth/upload_image_profile|POST|


