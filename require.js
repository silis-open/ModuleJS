(function (win) {
	//获取上级目录
	var path_up = function(path){
		if(path[path.length-1] == "/") path = path.substring(0, path.length-1);
		var indexOf = path.lastIndexOf("/");
		return path.substring(0, indexOf);
	}

	//简化目录，去掉重复的“//”，或简化“..”
	var path_simple = function(path){
		path = path.replace(/\/\/+/g, "/");
		var arr = path.split("/");
		var arr2 = [];
		for(var i = 0; i < arr.length; i++){
			var item = arr[i];
			if(item == ".."){
				arr2.pop();
			} else {
				arr2.push(item);
			}
		}
		return arr2.join("/");
	}

	//用于创建一个具有基本路径上下文的require（需要模块）
	var createRequireContext = function(basePath){
		basePath = basePath || "/";

		//需要模块
		var require = function (p, cb) {
			var resultArr = [], //得到的模块Exports的列表
				asyncArr = [], //以下程序用到的异步处理的列表
				async = cb != null; //是否异步处理

			if (async) {
				if (typeof (p) == "string") throw "The asynchronous module uses multiple string array parameters";
			} else {
				if (typeof (p) != "string") throw "The synchronization module uses a single string parameter";
				p = [p];
			}

			var commonPathValues = {};
			commonPathValues.require = require;
			commonPathValues.exports = {};
			commonPathValues.module = { exports:commonPathValues.exports };

			p.forEach(function (path, pathIndex) {

				var commonPathValue = commonPathValues[path];
				if(commonPathValue){
					resultArr.push(commonPathValue);
					return;
				}

				var fullPath = path_simple(basePath + "/" + path);

				//每一个地址可能会做异步处理
				var promise = new Promise(function (resolve, reject) {

					var module = win.modules[fullPath];
					//判断模块是否存在本地
					if (module) { //模块已存在于本地
						//判断已存在的模块是否在加载中
						if(!module.promise){ //已加载
							moduleService_require_define_exports(fullPath, win, require, module, async, function(result){
								resultArr[pathIndex] = result;
								resolve(result);
							});
						} else { //加载中
							module.promise.then(function (result){
								resultArr[pathIndex] = result;
								resolve(result);
							})
						}
					} else { //模块不存在于本地
						//发送ajax请求获取远程模块代码
						win.$.ajax({
							async: async, //如果没有传递回调函数，则需要同步返回模块Exports，就需要同步加载模块。如果有回调函数，则可以异步加载模块。
							type: "GET",
							url: fullPath,
							dataType: "text",
							success: function (remoteModuleCode) {
								if(async) win.define.amd = {}; //表示支持amd
								win.eval.call(win, remoteModuleCode); //执行define
								if(async) win.define.amd = null; //取消amd

								//如果执行的代码没有执行define模块，则定义一个空的模块
								if(require.justModule == null)
									require.justModule = define(function(){});

								win.modules[fullPath] = require.justModule;
								require.justModule.promise = null;
								require.justModule = null;

								moduleService_require_define_exports(fullPath, win, require, win.modules[fullPath], async, function(result){
									resultArr[pathIndex] = result;
									resolve(result);
								});
							}, error: function (e) {
								win.modules[fullPath] = null;
								reject(e);
							}
						});
					};
				});

				//如果还未加载进来，则赋予一个带promise属性的模块对象，表示加载中的模块
				if(!win.modules[fullPath]) win.modules[fullPath] = { promise:promise };

				asyncArr.push(promise);
			});

			if (async) {
				var time = new Date().getTime();
				return Promise.all(asyncArr).then(function (results) {
					return cb.apply(win, resultArr);
				});
			} else {
				if (p.length <= 1) return resultArr[0]; else return resultArr;
            }
			
		};

//		require.path = function(path){
//			path = basePath + "/" + path;
//			path = path.replace("//", "/").replace(/(\/[^\/]+)?\/\.\./g,"");
//			return createRequireContext(path);
//		};

		return require;
	};

	//需要模块
	win.require = createRequireContext();

	//定义模块
	//返回：模块对象
	win.define = function (a0,a1,a2) {
		var module = { window:win };

		//判断调用参数数量
		if (arguments.length == 1) {
			module.requires = []; //模块内部需要的模块名称的列表
			module.define = a0; //模块Exports的定义脚本
		} else if (arguments.length == 2) {
			module.requires = a0; //模块内部需要的模块名称的列表
			module.define = a1; //模块Exports的定义脚本
        } else if (arguments.length == 3) {
			module.name = a0;
			win.modules[module.name] = module;
			module.requires = a1; //模块内部需要的模块名称的列表
			module.define = a2; //模块Exports的定义脚本
		}
		else throw "202012262004";

		win.require.justModule = module;
		setTimeout(function(){
			if(win.require.justModule == module) win.require.justModule = null;
		}, 1000);

		return module;
	};

	//所有模块对象
	win.modules = {
	};

	//用于处理模块的服务
	var moduleService_require_define_exports = function (name, win2, require, module, async, resolve) {
		if(module == null) throw "Module not found:" + name;

		//判断模块是否未完成定义
		if (!module.defined) {
			//如果没有传递回调函数，则用同步编码方式处理。如果有回调函数，则用异步编码方式处理。
			if (async) { //有回调函数，将使用异步编码方式处理。
				//处理依赖模块需要
				win.require(module.requires, function () {
					//var justModule = win.require.justModule;
					win.require.justModule = null;

					//returnExports用于实现AMD的return exports
					var returnExports = module.define.apply(win2, arguments);

					//从return exports或者module.exports得到模块的exports
					module.exports = returnExports;

					//从参数module或exports获取结果
					for(var i = 0; i < arguments.length; i++){
						var path = module.requires[i];
						if(path == "module") module.exports = arguments[i].exports;
						else if(path == "exports") module.exports = arguments[i];
					}
							
					//设置模块为已定义完成状态
					module.defined = true;
					resolve(module.exports);
				});
			} else { //没有回调函数，将使用同步编码方式处理。
				//处理依赖模块需要
				for (var i = 0; i < module.requires.length; i++) win.require(module.requires[i]);

				//paramModule用于实现CMD的module.exports
				var paramModule = {};
				//returnExports用于实现AMD的return exports
				var returnExports = module.define.call(win2, createRequireContext(path_up(name)), paramModule);
				//不允许同时存在module.exports和return exports两种实现方式，只能选择一种实现方式。即不能同时实现amd和cmd。
				if (returnExports != null) throw "Synchronization module export by module.exports";
				//从return exports或者module.exports得到模块的exports
				module.exports = paramModule.exports;
				//设置模块为已定义完成状态
				module.defined = true;
				resolve(module.exports);
			}
		} else resolve(module.exports);
	}
})(window);