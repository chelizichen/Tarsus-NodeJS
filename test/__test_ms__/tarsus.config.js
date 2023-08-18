module.exports = {
    server: {
        project: "@TarsusDemoProject/NodeServer -l node -t @tarsus/ms -h 127.0.0.1 -p 12012",
        database: {
            default: true,
            type: "mysql",
            host: "localhost",
            username: "root",
            password: "123456",
            database: "test_db", //所用数据库
            port: 3306,
            connectionLimit: 10,
        },
    },
};
