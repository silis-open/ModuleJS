(function (win) {
	var createRequire = function(basePath){
		basePath = basePath || "/";
		
		var require = function(paths, cb){
			var requiredArr = [], /*requiredCount = 0, */promiseArr = [];
			for(var i = 0; i < paths.length; i++){
				var pathIndex = i;
				var path = basePath + "/" + paths[pathIndex] + ".js";
				path = path.replace("//", "/");
				
				var module = win.modules[path];
				if (module){
					requiredArr[pathIndex] = moduleService.getExports(module); /*requiredCount++;*/
				} else {
					var promise = new Promise(function (resolve, reject) {
						//var defer = new Defer();
						win.$.ajax({
							async: cb != null,
							type: "GET", url: path, dataType: "text", success: function (data) {
								//data = "function(module){}";
								win.define.name = path;
								win.eval.call(win, data); //执行define
								win.define.name = null;
								//var def = win.modules[path];
								//if (def == undefined) { win.define(path); def = win.modules[path] };
								requiredArr[pathIndex] = moduleService.getExports(win.modules[path]); /*requiredCount++;*/
								//defer.call(requiredArr[pathIndex2]);
								resolve(requiredArr[pathIndex]);
							}, error: function (e) {
								//defer.fail(e);
								reject(e);
							}
						});
					});
					
					promiseArr.push(promise);
				};
			};

			//return parallel(parallelArr).next(function(results){
			//	return cb.apply(win, requiredArr);
			//});
			if (cb != null) {
				return Promise.all(promiseArr).then(function (results) {
					return cb.apply(win, requiredArr);
				})
			} else {
				if (paths.length <= 1) return requiredArr[0]; else return requiredArr;
            }
			
		};

		require.path = function(path){
			path = basePath + "/" + path;
			path = path.replace("//", "/").replace(/(\/[^\/]+)?\/\.\./g,"");
			return createRequire(path);
		};

		return require;
	};

	win.require = createRequire();

	win.define = function (o) {
		var module;
		if (typeof (o) == "function") {
			module = {
				exportScript: o
			};
		} else {
			module = {
				exports: o
			};
		};

		if (win.define.name != null) win.modules[win.define.name];
		return module;
	};

	win.modules = {};

	var moduleService = {
		getExports: function (module) {
			if (module.exportScript) {
				var paramModule = {};
				var returnExports = module.exportScript(win, paramModule);
				if (returnExports != null && module.exports != null) throw "module.exports cannot be used with return exports";
				module.exports = returnExports || paramModule.exports;
				delete module.exportScript;
			}
			return module.exports;
        }
	};
})(window);