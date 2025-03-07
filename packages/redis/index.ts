import  Redis from "ioredis"
const redis = new Redis({
    host:"tender-mosquito-42163.upstash.io",
    port:6379,
    password:"AaSzAAIjcDE4YjQ3YzI2ZWMzMTc0NzY5YmY0ODRkY2U4OGUxMWNiZHAxMA",
    tls:{}
})