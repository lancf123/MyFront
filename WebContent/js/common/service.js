/**
 * Service服务调用模块
 * 
 * @version 1.0
 */
var _service = new function() {

	/**
	 * 设置Token
	 * 
	 * @private
	 * @param {String}
	 *            token Token值
	 */
	function _setToken(token) {
		_globalParam.set(_config.TOKEN_KEY, token);
	}

	/**
	 * 取得Token
	 * 
	 * @private
	 * @return {String} Token值
	 */
	function _getToken() {
		return _globalParam.get(_config.TOKEN_KEY);
	}

	/**
	 * 设定ajax参数
	 * 
	 * @private
	 * @param {string}
	 *            serviceId service ID
	 * @param {object}
	 *            params 送给服务器的值
	 * @param {[type]}
	 *            handler ajax通信成功执行的回调函数
	 * @return {HTTPContext} ajax参数设定对象
	 */
	function _getDefaultContext(serviceId, params, handler) {
		var httpConext = new HTTPContext();
		httpConext.beforeSend = function(xhr) {
			var token = _getToken();
			// 显示Mask
			 $.blockUI({ message: '<h3><img src="../image/loading.gif" />Please wait</h3>' });	 
			// 设置access_token
			if (!_util.isEmpty(token)) {
				xhr.setRequestHeader(
						_config.WALLET_SPI_SERVICE_ACCESS_TOKEN_KEY, token);
			}
		};
		// 设置请求的url
		httpConext.url = _config.ARMADA_EYE_BACK_URL + serviceId;
		// 发送信息至服务器时使用的内容编码类型
		httpConext.contentType = "application/json; charset=UTF-8";
		// 预期服务器返回的数据类型
		httpConext.dataType = "json";
		// 使用POST方式调用ajax
		httpConext.method = "POST";
		// 向服务器请求所用的值
		httpConext.data = JSON.stringify(params);
		// ajax通信成功的回调函数
		httpConext.success = handler;
		// ajax通信完成的回调函数
		httpConext.complete = function() {
			// 隐藏显示的mask
			$.unblockUI();
		};
		return httpConext;
	}

	/**
	 * 判断服务器是否返回session过期状态信息
	 * 
	 * @private
	 * @param {Array}
	 *            exceptions Service返回的异常信息数组
	 * @return {boolean} 如果session过期，返回true，否则返回false
	 */
	function _isSessionTimeout(exceptions) {
		// 在服务器端定义的Session过期异常信息ID
		var SESSION_TIMEOUT_MESSAGE_ID = "SEMSG-TIMEOUT";
		var ret = false;
		// 如果存在异常信息
		if (_util.isArray(exceptions) && !_util.isEmpty(exceptions)) {
			// 判断返回的异常信息中是否包含Session过期异常信息
			for (var i = 0; i < exceptions.length; i++) {
				if (exceptions[i].id === SESSION_TIMEOUT_MESSAGE_ID) {
					ret = true;
					break;
				}
			}
		}
		return ret;
	}

	/**
	 * 处理Service返回的异常信息数组
	 * 
	 * @private
	 * @param {Array}
	 *            exceptions Service返回的异常信息数组
	 * @return {Array} 异常信息数组
	 */
	function _mergeMessageList(exceptions) {
		var ret = null;
		if (!_util.isEmpty(exceptions)) {
			ret = [];
			for (var i = 0; i < exceptions.length; i++) {
				var item = exceptions[i];
				ret.push({
					"messageId" : item.id,
					"message" : item.message
				});
			}
		}
		return ret;
	}

	/**
	 * 根据Service的返回值判断是否是系统异常
	 * 
	 * @param {int}
	 *            resultCode Service的返回值
	 * @return {Boolean} 系统异常:true
	 */
	function _isSystemError(resultCode) {
		return resultCode === 0;
	}

	/**
	 * Service执行回调函数的简单封装，对于返回的异常信息进行默认处理
	 * 
	 * @private
	 * @param {Function}
	 *            succHandler 无异常信息返回时此函数会被调用
	 * @param {Function}
	 *            errorHandler 有异常信息返回时此函数会被调用
	 */
	function _coverErrorHandler(succHandler, errorHandler,callbackErrFlg) {
		return function(data, textStatus, jqXHR) {
			// 存储回传的Token
			// TODO The token does not response in response header
			// _setToken(jqXHR.getResponseHeader(_config.WALLET_SPI_SERVICE_ACCESS_TOKEN_KEY));
			// 如果返回异常信息
			if (data.code !== "0000") {

				if(callbackErrFlg || callbackErrFlg == null || callbackErrFlg == undefined ){
					_ui.alert("OK", data.msg);
				}else{		
					errorHandler.call(null, data, jqXHR);
				}
				// var messageList = [];
				// var callbackFunc = null;
				// var exceptions = null;
				// var isShowMessageList = true;
				//
				// // 判断是否为系统异常
				// if (_isSystemError(data.resultCode)){
				// var message = null;
				//
				// // 如果服务端有exception信息返回
				// if (!_util.isEmpty(data.exceptions)){
				// // 如果当前Session过期
				// if (_isSessionTimeout(data.exceptions)){
				// message = new SystemMessage("SESYSM004E");
				// }else {
				// messageList = _mergeMessageList(data.exceptions);
				// }
				// // 默认显示系统异常信息
				// }else{
				// messageList.push({
				// "message": new SystemMessage("SESYSM002E")
				// });
				// }
				// callbackFunc = function(){
				// // 跳转至登录画面
				// // _ui.forwardTo(_config.WELCOME_PAGE);
				// };
				// }else{
				// // 组装错误信息
				// messageList = _mergeMessageList(data.exceptions);
				// }
				//
				// // 执行自定义错误回调函数
				// if (errorHandler &&
				// _util.isFunction(errorHandler)){
				// isShowMessageList = errorHandler.call(null, data, jqXHR);
				// }
				//
				// if (isShowMessageList !== false){
				// // 在画面显示异常信息
				// _ui.showMessage(messageList, "error", callbackFunc);
				// }
				// 如果Service正常执行且没有返回异常信息
			} else if (succHandler) {
				// 执行传入的回调函数
				succHandler.call(null, data.data, jqXHR);
			}
		};
	}

	/**
	 * 以异步请求的方式调用Service，对Service返回的异常信息会进行默认处理
	 * 
	 * @public
	 * @param {string}
	 *            serviceId Service ID
	 * @param {Object}
	 *            params 向服务器请求的值
	 * @param {Function}
	 *            succHandler 如果Service正常执行且没有返回异常信息时执行
	 * @param {Function}
	 *            errorHandler 如果Service返回异常信息时执行
	 */
	function invoke(serviceId, params, succHandler, errorHandler,callbackErrFlg) {
		invokeCoverError(serviceId, params, _coverErrorHandler(succHandler,
				errorHandler,callbackErrFlg));
	}
	this.invoke = invoke;

	/**
	 * 以异步请求的方式调用Service
	 * 
	 * @public
	 * @param {string}
	 *            serviceId Service ID
	 * @param {Object}
	 *            params 向服务器请求的值
	 * @param {Function}
	 *            handler Service正常执行时的回调函数
	 */
	function invokeCoverError(serviceId, params, handler) {
		_http.doAsync(_getDefaultContext(serviceId, params, handler));
	}
	this.invokeCoverError = invokeCoverError;

	/**
	 * 以同步的方式调用Service，对Service返回的异常信息会进行默认处理
	 * 
	 * @public
	 * @param {string}
	 *            serviceId Service ID
	 * @param {Object...}
	 *            params 向服务器请求的值
	 * @return {Object} 返回result对象 （只在没有异常信息返回时返回）
	 */
	function invokeSync(serviceId) {
		var ret = {};
		var handler = function(data) {
			ret = data;
		};
		var params = Array.prototype.slice.call(arguments).slice(1);
		_http.doSync(_getDefaultContext(serviceId, params, _coverErrorHandler(
				handler, handler)));
		return ret;
	}
	this.invokeSync = invokeSync;

	/**
	 * 以同步的方式调用Service
	 * 
	 * @public
	 * @param {string}
	 *            serviceId Service ID
	 * @param {Object...}
	 *            params 向服务器请求的值
	 * @return {Object} 返回result对象
	 */
	function invokeSyncCoverError(serviceId) {
		var ret = {};
		var handler = function(data, jqXHR) {
			ret.data = data;
			ret.jqXHR = jqXHR;
		};
		var params = Array.prototype.slice.call(arguments).slice(1);
		_http.doSync(_getDefaultContext(serviceId, params, handler));
		return ret;
	}
	this.invokeSyncCoverError = invokeSyncCoverError;
};
