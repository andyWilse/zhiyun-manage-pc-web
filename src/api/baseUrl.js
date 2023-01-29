let baseUrl = "";
//process.env.NODE_ENV
switch ('serve') { //注意变量名是自定义的
    case 'dev':
        baseUrl = "http://192.168.43.120:8092/"  //开发环境url
        break
    case 'serve':
        baseUrl = "http://192.168.43.139:8092/"    //生产环境url
        break
}

export default baseUrl;