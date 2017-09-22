var AuthModel = function(){
    /**
     * 鉴权成功后返回跳转信息
     *
     * @param  {string} code    鉴权码
     * @return {Object} 用户信息
     */
    var auth = function(code){
        // 用户信息
        var userObject = null;
        if (!_util.isEmpty(code)){
            // 调取登陆服务
            userObject = _service.invokeSync("CMWS10001", code);
        }

        return userObject;
    };
    this.auth = auth;
};
