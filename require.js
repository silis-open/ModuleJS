(function (win) {
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

			p.forEach(function (path, pathIndex) {
				var fullPath = basePath + "/" + path;
				fullPath = fullPath.replace("//", "/");

				var module = win.modules[fullPath];
				//判断模块是否存在本地
				if (module) { //模块已存在于本地
					resultArr[pathIndex] = moduleService.require_define_exports(module, async, asyncArr);
				} else { //模块不存在于本地
					//由于模块不存在于本地，因此需要使用Promise做异步加载模块
					var promise = new Promise(function (resolve, reject) {
						//发送ajax请求获取远程模块代码
						win.$.ajax({
							async: async, //如果没有传递回调函数，则需要同步返回模块Exports，就需要同步加载模块。如果有回调函数，则可以异步加载模块。
							type: "GET",
							url: fullPath,
							dataType: "text",
							success: function (remoteModuleCode) {
								win.define.name = fullPath;
								win.eval.call(win, remoteModuleCode); //执行define
								win.define.name = null;
								resultArr[pathIndex] = moduleService.require_define_exports(win.modules[fullPath], async, asyncArr); 
								//defer.call(requiredArr[pathIndex2]);
								resolve(resultArr[pathIndex]);
							}, error: function (e) {
								//defer.fail(e);
								reject(e);
							}
						});
					});

					asyncArr.push(promise);
				};
			});

			if (async) {
				return Promise.all(asyncArr).then(function (results) {
					return cb.apply(win, resultArr);
				})
			} else {
				if (p.length <= 1) return resultArr[0]; else return resultArr;
            }
			
		};

		require.path = function(path){
			path = basePath + "/" + path;
			path = path.replace("//", "/").replace(/(\/[^\/]+)?\/\.\./g,"");
			return createRequireContext(path);
		};

		return require;
	};

	//需要模块
	win.require = createRequireContext();

	//定义模块
	//返回：模块对象
	win.define = function () {
		var module = { window:win };

		//判断调用参数数量
		if (arguments.length == 1) {
			module.requires = []; //模块内部需要的模块名称的列表
			module.define = arguments[0]; //模块Exports的定义脚本
		} else if (arguments.length == 2) {
			module.requires = arguments[0]; //模块内部需要的模块名称的列表
			module.define = arguments[1]; //模块Exports的定义脚本
        }

		if (win.define.name != null) win.modules[win.define.name];
		return module;
	};

	//所有模块对象
	win.modules = {};

	//用于处理模块的服务
	var moduleService = {
		//处理模块依赖，然后执行模块定义，最后返回模块Exports
		require_define_exports: function (win2, require, module, async, asyncArr) {
			//判断模块是否未完成定义
			if (!module.defined) {
				//如果没有传递回调函数，则用同步编码方式处理。如果有回调函数，则用异步编码方式处理。
				if (async) { //有回调函数，将使用异步编码方式处理。
					asyncArr.push(new Promise(function (resolve) {
						//处理依赖模块需要
						win.require(module.requires, function () {
							//处理依赖模块需要
							for (var i = 0; i < module.requires.length; i++) win.require(module.requires[i]);

							//returnExports用于实现AMD的return exports
							var returnExports = module.define.apply(win2, arguments);
							//不允许同时存在module.exports和return exports两种实现方式，只能选择一种实现方式。即不能同时实现amd和cmd。
							if (returnExports != null) throw "Asynchronous module export with return exports";
							//从return exports或者module.exports得到模块的exports
							module.exports = returnExports;
							//设置模块为已定义完成状态
							module.defined = true;
							resolve(); 
						});
					}));
				} else { //没有回调函数，将使用同步编码方式处理。
					//处理依赖模块需要
					for (var i = 0; i < module.requires.length; i++) win.require(module.requires[i]);

					//paramModule用于实现CMD的module.exports
					var paramModule = {};
					//returnExports用于实现AMD的return exports
					var returnExports = module.define.call(win2, require, paramModule);
					//不允许同时存在module.exports和return exports两种实现方式，只能选择一种实现方式。即不能同时实现amd和cmd。
					if (returnExports != null) throw "Synchronization module export by module.exports";
					//从return exports或者module.exports得到模块的exports
					module.exports = paramModule.exports;
					//设置模块为已定义完成状态
					module.defined = true;
				}
			}
			return module.exports;
		}
	};
})(window);