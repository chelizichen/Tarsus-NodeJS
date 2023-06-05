module.exports = {
  database: [
    {
      default: true,
      type: "mysql",
      host: "localhost",
      username: "root",
      password: "123456",
      database: "fundsus", //所用数据库
      port: 3306,
      connectionLimit: 10,
    },
  ],
  servant: {
  
    project: [
      "@TarsusDemoProject/NodeProxyDemo -l node -t @tarsus/http -h 127.0.0.1 -p 7091",
      "@TarsusDemoProject/NodeProxyDemo -l node -t @tarsus/http -h 127.0.0.1 -p 7092",
    ],
    // project: [
    //   "@TarsusDemoProject/NodeDemo -l node -t @tarsus/ms -h 127.0.0.1 -p 7098 -w 7",
    //   "@TarsusDemoProject/NodeDemo -l node -t @tarsus/ms -h 127.0.0.1 -p 7099 -w 3",
    // ],
    taro:"test/microservice/taro",
    register: "test/microservice/register",
    struct:"test/microservice/struct",
    proxy: "TarsusProxyServant",
  },
};
