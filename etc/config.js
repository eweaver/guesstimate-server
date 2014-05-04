module.exports = {
    server: {
        port: 5000
    },
    redis: {
        url: "redis://pub-redis-19367.us-east-1-2.1.ec2.garantiadata.com",
        port: 19367,
        user: "rediscloud",
        password: "aVU4jqsupgo0M9WA"
    },
    app: {
        devMode: true
    },
    push: {
        types: {
            "iphone": "ApplePushNotifications"
        },
        apple: {
            mode: "dev",
            appName: "app24573965",
            dev: {
                token: "v2BqeYcNd6h1CJwqoqay",
                cert: "dev-cert.pem",
                key: "dev-key.pem"
            },
            production: {
                token: "NszW7ry1zjrR7BSiosWf",
                cert: "prod-cert.pem",
                key: "prod-key.pem"
            }
        }
    }
};
