@echo off
echo Starting Modern E-commerce Backend Server...
set DATABASE_URL=mysql://root:@localhost:3306/ecomerce_database
set JWT_SECRET=4b4a47938ced680af33bd8b9568b03f7
set PORT=4000
set ADMIN_PASSWORD=admin123

cd /d "C:\Users\pc\Downloads\modern-ecommerce"
npm run backend

pause
