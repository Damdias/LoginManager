module.exports = {
    name: 'API',
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    base_url: process.env.BASE_URL || 'http://localhost:3000',
    db: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017' ,//'mongodb://127.0.0.1:27017/library',
        options:{
            dbName:process.env.MONGODB_DB || 'BNFM',
            user:process.env.MONGODB_USER || '',
            pass:process.env.MONGODB_PASSWORD || ''
        }
    },
    "email":{
        "port":587,
        "host":"smtp.gmail.com",
        "user":"damdias84@gmail.com",
        "pass":"#dam12345678$"
    }
}