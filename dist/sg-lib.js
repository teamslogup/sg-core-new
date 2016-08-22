/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	var parentJsonpFunction = window["webpackJsonp"];
/******/ 	window["webpackJsonp"] = function webpackJsonpCallback(chunkIds, moreModules) {
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId])
/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			modules[moduleId] = moreModules[moduleId];
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
/******/ 		while(callbacks.length)
/******/ 			callbacks.shift().call(null, __webpack_require__);
/******/ 		if(moreModules[0]) {
/******/ 			installedModules[0] = 0;
/******/ 			return __webpack_require__(0);
/******/ 		}
/******/ 	};
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	// Copied from https://github.com/facebook/react/blob/bef45b0/src/shared/utils/canDefineProperty.js
/******/ 	var canDefineProperty = false;
/******/ 	try {
/******/ 		Object.defineProperty({}, "x", {
/******/ 			get: function() {}
/******/ 		});
/******/ 		canDefineProperty = true;
/******/ 	} catch(x) {
/******/ 		// IE will fail on defineProperty
/******/ 	}
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ed2cab9df4408fb99438"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				if(canDefineProperty) {
/******/ 					Object.defineProperty(fn, name, (function(name) {
/******/ 						return {
/******/ 							configurable: true,
/******/ 							enumerable: true,
/******/ 							get: function() {
/******/ 								return __webpack_require__[name];
/******/ 							},
/******/ 							set: function(value) {
/******/ 								__webpack_require__[name] = value;
/******/ 							}
/******/ 						};
/******/ 					}(name)));
/******/ 				} else {
/******/ 					fn[name] = __webpack_require__[name];
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		function ensure(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		}
/******/ 		if(canDefineProperty) {
/******/ 			Object.defineProperty(fn, "e", {
/******/ 				enumerable: true,
/******/ 				value: ensure
/******/ 			});
/******/ 		} else {
/******/ 			fn.e = ensure;
/******/ 		}
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// "0" means "already loaded"
/******/ 	// Array means "loading", array contains callbacks
/******/ 	var installedChunks = {
/******/ 		3:0
/******/ 	};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0)
/******/ 			return callback.call(null, __webpack_require__);
/******/
/******/ 		// an array means "currently loading".
/******/ 		if(installedChunks[chunkId] !== undefined) {
/******/ 			installedChunks[chunkId].push(callback);
/******/ 		} else {
/******/ 			// start chunk loading
/******/ 			installedChunks[chunkId] = [callback];
/******/ 			var head = document.getElementsByTagName('head')[0];
/******/ 			var script = document.createElement('script');
/******/ 			script.type = 'text/javascript';
/******/ 			script.charset = 'utf-8';
/******/ 			script.async = true;
/******/
/******/ 			script.src = __webpack_require__.p + "" + ({"0":"sg-admin","1":"sg-main","2":"sg-sample"}[chunkId]||chunkId) + ".js";
/******/ 			head.appendChild(script);
/******/ 		}
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/leehwarang/Documents/sgdevelopments/sg-core-new";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _coreCommon = __webpack_require__(2);
	
	var _coreCommon2 = _interopRequireDefault(_coreCommon);
	
	var _angularUiRouter = __webpack_require__(6);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	var _angularTranslate = __webpack_require__(7);
	
	var _angularTranslate2 = _interopRequireDefault(_angularTranslate);
	
	var _angularCookies = __webpack_require__(8);
	
	var _angularCookies2 = _interopRequireDefault(_angularCookies);
	
	var _angularResource = __webpack_require__(10);
	
	var _angularResource2 = _interopRequireDefault(_angularResource);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = angular.module("core.base", [_coreCommon2.default, _angularUiRouter2.default, _angularTranslate2.default, _angularCookies2.default, _angularResource2.default]).name;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _coreCommon = __webpack_require__(3);
	
	var _coreCommon2 = _interopRequireDefault(_coreCommon);
	
	var _coreCommon3 = __webpack_require__(4);
	
	var _coreCommon4 = _interopRequireDefault(_coreCommon3);
	
	var _coreCommon5 = __webpack_require__(5);
	
	var _coreCommon6 = _interopRequireDefault(_coreCommon5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = angular.module('core.common', []).directive(_coreCommon2.default).directive(_coreCommon6.default).provider('staticLoader', _coreCommon4.default).name;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = svgImage;
	
	svgImage.$inject = ['$http'];
	function svgImage($http) {
	    return {
	        restrict: 'E',
	        link: function link(scope, element) {
	            var imgURL = element.attr('src');
	            // if you want to use ng-include, then
	            // instead of the above line write the bellow:
	            // var imgURL = element.attr('ng-include');
	            var request = $http.get(imgURL, { 'Content-Type': 'application/xml' });
	
	            scope.manipulateImgNode = function (data, elem) {
	                var $svg = angular.element(data)[4];
	                var imgClass = elem.attr('class');
	                if (typeof imgClass !== 'undefined') {
	                    var classes = imgClass.split(' ');
	                    for (var i = 0; i < classes.length; ++i) {
	                        $svg.classList.add(classes[i]);
	                    }
	                }
	                $svg.removeAttribute('xmlns:a');
	                return $svg;
	            };
	
	            request.success(function (data) {
	                element.replaceWith(scope.manipulateImgNode(data, element));
	            });
	        }
	    };
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var StaticLoader = function () {
	    function StaticLoader() {
	        _classCallCheck(this, StaticLoader);
	
	        this.rootPath = "";
	        this.cacheMap = {};
	    }
	
	    _createClass(StaticLoader, [{
	        key: "setRootPath",
	        value: function setRootPath(path) {
	            this.rootPath = path;
	        }
	    }, {
	        key: "$get",
	        value: function $get($http) {
	            var factory = {};
	            var self = this;
	            factory.get = function (path, callback) {
	                if (rootPath) {
	                    path = self.rootPath + path;
	                }
	                if (self.cacheMap[self.cacheMap]) {
	                    return callback(200, self.cacheMap[self.cacheMap]);
	                }
	                $http.get(path).then(function (res) {
	                    if (res.status == 200) {
	                        self.cacheMap[path] = res.data;
	                    }
	                    callback(res.status, res.data);
	                });
	            };
	            return factory;
	        }
	    }]);
	
	    return StaticLoader;
	}();
	
	exports.default = StaticLoader;

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = errSrc;
	function errSrc() {
	    return {
	        link: function link(scope, element, attrs) {
	            element.bind('error', function () {
	                if (attrs.isHide == true) {
	                    element.css('display', 'block');
	                }
	                if (attrs.src != attrs.errSrc) {
	                    attrs.$set('src', attrs.errSrc);
	                }
	            });
	        }
	    };
	}

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * State-based routing for AngularJS
	 * @version v0.3.1
	 * @link http://angular-ui.github.com/
	 * @license MIT License, http://www.opensource.org/licenses/MIT
	 */
	
	/* commonjs package manager support (eg componentjs) */
	if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
	  module.exports = 'ui.router';
	}
	
	(function (window, angular, undefined) {
	/*jshint globalstrict:true*/
	/*global angular:false*/
	'use strict';
	
	var isDefined = angular.isDefined,
	    isFunction = angular.isFunction,
	    isString = angular.isString,
	    isObject = angular.isObject,
	    isArray = angular.isArray,
	    forEach = angular.forEach,
	    extend = angular.extend,
	    copy = angular.copy,
	    toJson = angular.toJson;
	
	function inherit(parent, extra) {
	  return extend(new (extend(function() {}, { prototype: parent }))(), extra);
	}
	
	function merge(dst) {
	  forEach(arguments, function(obj) {
	    if (obj !== dst) {
	      forEach(obj, function(value, key) {
	        if (!dst.hasOwnProperty(key)) dst[key] = value;
	      });
	    }
	  });
	  return dst;
	}
	
	/**
	 * Finds the common ancestor path between two states.
	 *
	 * @param {Object} first The first state.
	 * @param {Object} second The second state.
	 * @return {Array} Returns an array of state names in descending order, not including the root.
	 */
	function ancestors(first, second) {
	  var path = [];
	
	  for (var n in first.path) {
	    if (first.path[n] !== second.path[n]) break;
	    path.push(first.path[n]);
	  }
	  return path;
	}
	
	/**
	 * IE8-safe wrapper for `Object.keys()`.
	 *
	 * @param {Object} object A JavaScript object.
	 * @return {Array} Returns the keys of the object as an array.
	 */
	function objectKeys(object) {
	  if (Object.keys) {
	    return Object.keys(object);
	  }
	  var result = [];
	
	  forEach(object, function(val, key) {
	    result.push(key);
	  });
	  return result;
	}
	
	/**
	 * IE8-safe wrapper for `Array.prototype.indexOf()`.
	 *
	 * @param {Array} array A JavaScript array.
	 * @param {*} value A value to search the array for.
	 * @return {Number} Returns the array index value of `value`, or `-1` if not present.
	 */
	function indexOf(array, value) {
	  if (Array.prototype.indexOf) {
	    return array.indexOf(value, Number(arguments[2]) || 0);
	  }
	  var len = array.length >>> 0, from = Number(arguments[2]) || 0;
	  from = (from < 0) ? Math.ceil(from) : Math.floor(from);
	
	  if (from < 0) from += len;
	
	  for (; from < len; from++) {
	    if (from in array && array[from] === value) return from;
	  }
	  return -1;
	}
	
	/**
	 * Merges a set of parameters with all parameters inherited between the common parents of the
	 * current state and a given destination state.
	 *
	 * @param {Object} currentParams The value of the current state parameters ($stateParams).
	 * @param {Object} newParams The set of parameters which will be composited with inherited params.
	 * @param {Object} $current Internal definition of object representing the current state.
	 * @param {Object} $to Internal definition of object representing state to transition to.
	 */
	function inheritParams(currentParams, newParams, $current, $to) {
	  var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];
	
	  for (var i in parents) {
	    if (!parents[i] || !parents[i].params) continue;
	    parentParams = objectKeys(parents[i].params);
	    if (!parentParams.length) continue;
	
	    for (var j in parentParams) {
	      if (indexOf(inheritList, parentParams[j]) >= 0) continue;
	      inheritList.push(parentParams[j]);
	      inherited[parentParams[j]] = currentParams[parentParams[j]];
	    }
	  }
	  return extend({}, inherited, newParams);
	}
	
	/**
	 * Performs a non-strict comparison of the subset of two objects, defined by a list of keys.
	 *
	 * @param {Object} a The first object.
	 * @param {Object} b The second object.
	 * @param {Array} keys The list of keys within each object to compare. If the list is empty or not specified,
	 *                     it defaults to the list of keys in `a`.
	 * @return {Boolean} Returns `true` if the keys match, otherwise `false`.
	 */
	function equalForKeys(a, b, keys) {
	  if (!keys) {
	    keys = [];
	    for (var n in a) keys.push(n); // Used instead of Object.keys() for IE8 compatibility
	  }
	
	  for (var i=0; i<keys.length; i++) {
	    var k = keys[i];
	    if (a[k] != b[k]) return false; // Not '===', values aren't necessarily normalized
	  }
	  return true;
	}
	
	/**
	 * Returns the subset of an object, based on a list of keys.
	 *
	 * @param {Array} keys
	 * @param {Object} values
	 * @return {Boolean} Returns a subset of `values`.
	 */
	function filterByKeys(keys, values) {
	  var filtered = {};
	
	  forEach(keys, function (name) {
	    filtered[name] = values[name];
	  });
	  return filtered;
	}
	
	// like _.indexBy
	// when you know that your index values will be unique, or you want last-one-in to win
	function indexBy(array, propName) {
	  var result = {};
	  forEach(array, function(item) {
	    result[item[propName]] = item;
	  });
	  return result;
	}
	
	// extracted from underscore.js
	// Return a copy of the object only containing the whitelisted properties.
	function pick(obj) {
	  var copy = {};
	  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
	  forEach(keys, function(key) {
	    if (key in obj) copy[key] = obj[key];
	  });
	  return copy;
	}
	
	// extracted from underscore.js
	// Return a copy of the object omitting the blacklisted properties.
	function omit(obj) {
	  var copy = {};
	  var keys = Array.prototype.concat.apply(Array.prototype, Array.prototype.slice.call(arguments, 1));
	  for (var key in obj) {
	    if (indexOf(keys, key) == -1) copy[key] = obj[key];
	  }
	  return copy;
	}
	
	function pluck(collection, key) {
	  var result = isArray(collection) ? [] : {};
	
	  forEach(collection, function(val, i) {
	    result[i] = isFunction(key) ? key(val) : val[key];
	  });
	  return result;
	}
	
	function filter(collection, callback) {
	  var array = isArray(collection);
	  var result = array ? [] : {};
	  forEach(collection, function(val, i) {
	    if (callback(val, i)) {
	      result[array ? result.length : i] = val;
	    }
	  });
	  return result;
	}
	
	function map(collection, callback) {
	  var result = isArray(collection) ? [] : {};
	
	  forEach(collection, function(val, i) {
	    result[i] = callback(val, i);
	  });
	  return result;
	}
	
	/**
	 * @ngdoc overview
	 * @name ui.router.util
	 *
	 * @description
	 * # ui.router.util sub-module
	 *
	 * This module is a dependency of other sub-modules. Do not include this module as a dependency
	 * in your angular app (use {@link ui.router} module instead).
	 *
	 */
	angular.module('ui.router.util', ['ng']);
	
	/**
	 * @ngdoc overview
	 * @name ui.router.router
	 * 
	 * @requires ui.router.util
	 *
	 * @description
	 * # ui.router.router sub-module
	 *
	 * This module is a dependency of other sub-modules. Do not include this module as a dependency
	 * in your angular app (use {@link ui.router} module instead).
	 */
	angular.module('ui.router.router', ['ui.router.util']);
	
	/**
	 * @ngdoc overview
	 * @name ui.router.state
	 * 
	 * @requires ui.router.router
	 * @requires ui.router.util
	 *
	 * @description
	 * # ui.router.state sub-module
	 *
	 * This module is a dependency of the main ui.router module. Do not include this module as a dependency
	 * in your angular app (use {@link ui.router} module instead).
	 * 
	 */
	angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);
	
	/**
	 * @ngdoc overview
	 * @name ui.router
	 *
	 * @requires ui.router.state
	 *
	 * @description
	 * # ui.router
	 * 
	 * ## The main module for ui.router 
	 * There are several sub-modules included with the ui.router module, however only this module is needed
	 * as a dependency within your angular app. The other modules are for organization purposes. 
	 *
	 * The modules are:
	 * * ui.router - the main "umbrella" module
	 * * ui.router.router - 
	 * 
	 * *You'll need to include **only** this module as the dependency within your angular app.*
	 * 
	 * <pre>
	 * <!doctype html>
	 * <html ng-app="myApp">
	 * <head>
	 *   <script src="js/angular.js"></script>
	 *   <!-- Include the ui-router script -->
	 *   <script src="js/angular-ui-router.min.js"></script>
	 *   <script>
	 *     // ...and add 'ui.router' as a dependency
	 *     var myApp = angular.module('myApp', ['ui.router']);
	 *   </script>
	 * </head>
	 * <body>
	 * </body>
	 * </html>
	 * </pre>
	 */
	angular.module('ui.router', ['ui.router.state']);
	
	angular.module('ui.router.compat', ['ui.router']);
	
	/**
	 * @ngdoc object
	 * @name ui.router.util.$resolve
	 *
	 * @requires $q
	 * @requires $injector
	 *
	 * @description
	 * Manages resolution of (acyclic) graphs of promises.
	 */
	$Resolve.$inject = ['$q', '$injector'];
	function $Resolve(  $q,    $injector) {
	  
	  var VISIT_IN_PROGRESS = 1,
	      VISIT_DONE = 2,
	      NOTHING = {},
	      NO_DEPENDENCIES = [],
	      NO_LOCALS = NOTHING,
	      NO_PARENT = extend($q.when(NOTHING), { $$promises: NOTHING, $$values: NOTHING });
	  
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$resolve#study
	   * @methodOf ui.router.util.$resolve
	   *
	   * @description
	   * Studies a set of invocables that are likely to be used multiple times.
	   * <pre>
	   * $resolve.study(invocables)(locals, parent, self)
	   * </pre>
	   * is equivalent to
	   * <pre>
	   * $resolve.resolve(invocables, locals, parent, self)
	   * </pre>
	   * but the former is more efficient (in fact `resolve` just calls `study` 
	   * internally).
	   *
	   * @param {object} invocables Invocable objects
	   * @return {function} a function to pass in locals, parent and self
	   */
	  this.study = function (invocables) {
	    if (!isObject(invocables)) throw new Error("'invocables' must be an object");
	    var invocableKeys = objectKeys(invocables || {});
	    
	    // Perform a topological sort of invocables to build an ordered plan
	    var plan = [], cycle = [], visited = {};
	    function visit(value, key) {
	      if (visited[key] === VISIT_DONE) return;
	      
	      cycle.push(key);
	      if (visited[key] === VISIT_IN_PROGRESS) {
	        cycle.splice(0, indexOf(cycle, key));
	        throw new Error("Cyclic dependency: " + cycle.join(" -> "));
	      }
	      visited[key] = VISIT_IN_PROGRESS;
	      
	      if (isString(value)) {
	        plan.push(key, [ function() { return $injector.get(value); }], NO_DEPENDENCIES);
	      } else {
	        var params = $injector.annotate(value);
	        forEach(params, function (param) {
	          if (param !== key && invocables.hasOwnProperty(param)) visit(invocables[param], param);
	        });
	        plan.push(key, value, params);
	      }
	      
	      cycle.pop();
	      visited[key] = VISIT_DONE;
	    }
	    forEach(invocables, visit);
	    invocables = cycle = visited = null; // plan is all that's required
	    
	    function isResolve(value) {
	      return isObject(value) && value.then && value.$$promises;
	    }
	    
	    return function (locals, parent, self) {
	      if (isResolve(locals) && self === undefined) {
	        self = parent; parent = locals; locals = null;
	      }
	      if (!locals) locals = NO_LOCALS;
	      else if (!isObject(locals)) {
	        throw new Error("'locals' must be an object");
	      }       
	      if (!parent) parent = NO_PARENT;
	      else if (!isResolve(parent)) {
	        throw new Error("'parent' must be a promise returned by $resolve.resolve()");
	      }
	      
	      // To complete the overall resolution, we have to wait for the parent
	      // promise and for the promise for each invokable in our plan.
	      var resolution = $q.defer(),
	          result = resolution.promise,
	          promises = result.$$promises = {},
	          values = extend({}, locals),
	          wait = 1 + plan.length/3,
	          merged = false;
	          
	      function done() {
	        // Merge parent values we haven't got yet and publish our own $$values
	        if (!--wait) {
	          if (!merged) merge(values, parent.$$values); 
	          result.$$values = values;
	          result.$$promises = result.$$promises || true; // keep for isResolve()
	          delete result.$$inheritedValues;
	          resolution.resolve(values);
	        }
	      }
	      
	      function fail(reason) {
	        result.$$failure = reason;
	        resolution.reject(reason);
	      }
	
	      // Short-circuit if parent has already failed
	      if (isDefined(parent.$$failure)) {
	        fail(parent.$$failure);
	        return result;
	      }
	      
	      if (parent.$$inheritedValues) {
	        merge(values, omit(parent.$$inheritedValues, invocableKeys));
	      }
	
	      // Merge parent values if the parent has already resolved, or merge
	      // parent promises and wait if the parent resolve is still in progress.
	      extend(promises, parent.$$promises);
	      if (parent.$$values) {
	        merged = merge(values, omit(parent.$$values, invocableKeys));
	        result.$$inheritedValues = omit(parent.$$values, invocableKeys);
	        done();
	      } else {
	        if (parent.$$inheritedValues) {
	          result.$$inheritedValues = omit(parent.$$inheritedValues, invocableKeys);
	        }        
	        parent.then(done, fail);
	      }
	      
	      // Process each invocable in the plan, but ignore any where a local of the same name exists.
	      for (var i=0, ii=plan.length; i<ii; i+=3) {
	        if (locals.hasOwnProperty(plan[i])) done();
	        else invoke(plan[i], plan[i+1], plan[i+2]);
	      }
	      
	      function invoke(key, invocable, params) {
	        // Create a deferred for this invocation. Failures will propagate to the resolution as well.
	        var invocation = $q.defer(), waitParams = 0;
	        function onfailure(reason) {
	          invocation.reject(reason);
	          fail(reason);
	        }
	        // Wait for any parameter that we have a promise for (either from parent or from this
	        // resolve; in that case study() will have made sure it's ordered before us in the plan).
	        forEach(params, function (dep) {
	          if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
	            waitParams++;
	            promises[dep].then(function (result) {
	              values[dep] = result;
	              if (!(--waitParams)) proceed();
	            }, onfailure);
	          }
	        });
	        if (!waitParams) proceed();
	        function proceed() {
	          if (isDefined(result.$$failure)) return;
	          try {
	            invocation.resolve($injector.invoke(invocable, self, values));
	            invocation.promise.then(function (result) {
	              values[key] = result;
	              done();
	            }, onfailure);
	          } catch (e) {
	            onfailure(e);
	          }
	        }
	        // Publish promise synchronously; invocations further down in the plan may depend on it.
	        promises[key] = invocation.promise;
	      }
	      
	      return result;
	    };
	  };
	  
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$resolve#resolve
	   * @methodOf ui.router.util.$resolve
	   *
	   * @description
	   * Resolves a set of invocables. An invocable is a function to be invoked via 
	   * `$injector.invoke()`, and can have an arbitrary number of dependencies. 
	   * An invocable can either return a value directly,
	   * or a `$q` promise. If a promise is returned it will be resolved and the 
	   * resulting value will be used instead. Dependencies of invocables are resolved 
	   * (in this order of precedence)
	   *
	   * - from the specified `locals`
	   * - from another invocable that is part of this `$resolve` call
	   * - from an invocable that is inherited from a `parent` call to `$resolve` 
	   *   (or recursively
	   * - from any ancestor `$resolve` of that parent).
	   *
	   * The return value of `$resolve` is a promise for an object that contains 
	   * (in this order of precedence)
	   *
	   * - any `locals` (if specified)
	   * - the resolved return values of all injectables
	   * - any values inherited from a `parent` call to `$resolve` (if specified)
	   *
	   * The promise will resolve after the `parent` promise (if any) and all promises 
	   * returned by injectables have been resolved. If any invocable 
	   * (or `$injector.invoke`) throws an exception, or if a promise returned by an 
	   * invocable is rejected, the `$resolve` promise is immediately rejected with the 
	   * same error. A rejection of a `parent` promise (if specified) will likewise be 
	   * propagated immediately. Once the `$resolve` promise has been rejected, no 
	   * further invocables will be called.
	   * 
	   * Cyclic dependencies between invocables are not permitted and will cause `$resolve`
	   * to throw an error. As a special case, an injectable can depend on a parameter 
	   * with the same name as the injectable, which will be fulfilled from the `parent` 
	   * injectable of the same name. This allows inherited values to be decorated. 
	   * Note that in this case any other injectable in the same `$resolve` with the same
	   * dependency would see the decorated value, not the inherited value.
	   *
	   * Note that missing dependencies -- unlike cyclic dependencies -- will cause an 
	   * (asynchronous) rejection of the `$resolve` promise rather than a (synchronous) 
	   * exception.
	   *
	   * Invocables are invoked eagerly as soon as all dependencies are available. 
	   * This is true even for dependencies inherited from a `parent` call to `$resolve`.
	   *
	   * As a special case, an invocable can be a string, in which case it is taken to 
	   * be a service name to be passed to `$injector.get()`. This is supported primarily 
	   * for backwards-compatibility with the `resolve` property of `$routeProvider` 
	   * routes.
	   *
	   * @param {object} invocables functions to invoke or 
	   * `$injector` services to fetch.
	   * @param {object} locals  values to make available to the injectables
	   * @param {object} parent  a promise returned by another call to `$resolve`.
	   * @param {object} self  the `this` for the invoked methods
	   * @return {object} Promise for an object that contains the resolved return value
	   * of all invocables, as well as any inherited and local values.
	   */
	  this.resolve = function (invocables, locals, parent, self) {
	    return this.study(invocables)(locals, parent, self);
	  };
	}
	
	angular.module('ui.router.util').service('$resolve', $Resolve);
	
	
	/**
	 * @ngdoc object
	 * @name ui.router.util.$templateFactory
	 *
	 * @requires $http
	 * @requires $templateCache
	 * @requires $injector
	 *
	 * @description
	 * Service. Manages loading of templates.
	 */
	$TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
	function $TemplateFactory(  $http,   $templateCache,   $injector) {
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromConfig
	   * @methodOf ui.router.util.$templateFactory
	   *
	   * @description
	   * Creates a template from a configuration object. 
	   *
	   * @param {object} config Configuration object for which to load a template. 
	   * The following properties are search in the specified order, and the first one 
	   * that is defined is used to create the template:
	   *
	   * @param {string|object} config.template html string template or function to 
	   * load via {@link ui.router.util.$templateFactory#fromString fromString}.
	   * @param {string|object} config.templateUrl url to load or a function returning 
	   * the url to load via {@link ui.router.util.$templateFactory#fromUrl fromUrl}.
	   * @param {Function} config.templateProvider function to invoke via 
	   * {@link ui.router.util.$templateFactory#fromProvider fromProvider}.
	   * @param {object} params  Parameters to pass to the template function.
	   * @param {object} locals Locals to pass to `invoke` if the template is loaded 
	   * via a `templateProvider`. Defaults to `{ params: params }`.
	   *
	   * @return {string|object}  The template html as a string, or a promise for 
	   * that string,or `null` if no template is configured.
	   */
	  this.fromConfig = function (config, params, locals) {
	    return (
	      isDefined(config.template) ? this.fromString(config.template, params) :
	      isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
	      isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
	      null
	    );
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromString
	   * @methodOf ui.router.util.$templateFactory
	   *
	   * @description
	   * Creates a template from a string or a function returning a string.
	   *
	   * @param {string|object} template html template as a string or function that 
	   * returns an html template as a string.
	   * @param {object} params Parameters to pass to the template function.
	   *
	   * @return {string|object} The template html as a string, or a promise for that 
	   * string.
	   */
	  this.fromString = function (template, params) {
	    return isFunction(template) ? template(params) : template;
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromUrl
	   * @methodOf ui.router.util.$templateFactory
	   * 
	   * @description
	   * Loads a template from the a URL via `$http` and `$templateCache`.
	   *
	   * @param {string|Function} url url of the template to load, or a function 
	   * that returns a url.
	   * @param {Object} params Parameters to pass to the url function.
	   * @return {string|Promise.<string>} The template html as a string, or a promise 
	   * for that string.
	   */
	  this.fromUrl = function (url, params) {
	    if (isFunction(url)) url = url(params);
	    if (url == null) return null;
	    else return $http
	        .get(url, { cache: $templateCache, headers: { Accept: 'text/html' }})
	        .then(function(response) { return response.data; });
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$templateFactory#fromProvider
	   * @methodOf ui.router.util.$templateFactory
	   *
	   * @description
	   * Creates a template by invoking an injectable provider function.
	   *
	   * @param {Function} provider Function to invoke via `$injector.invoke`
	   * @param {Object} params Parameters for the template.
	   * @param {Object} locals Locals to pass to `invoke`. Defaults to 
	   * `{ params: params }`.
	   * @return {string|Promise.<string>} The template html as a string, or a promise 
	   * for that string.
	   */
	  this.fromProvider = function (provider, params, locals) {
	    return $injector.invoke(provider, null, locals || { params: params });
	  };
	}
	
	angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);
	
	var $$UMFP; // reference to $UrlMatcherFactoryProvider
	
	/**
	 * @ngdoc object
	 * @name ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Matches URLs against patterns and extracts named parameters from the path or the search
	 * part of the URL. A URL pattern consists of a path pattern, optionally followed by '?' and a list
	 * of search parameters. Multiple search parameter names are separated by '&'. Search parameters
	 * do not influence whether or not a URL is matched, but their values are passed through into
	 * the matched parameters returned by {@link ui.router.util.type:UrlMatcher#methods_exec exec}.
	 *
	 * Path parameter placeholders can be specified using simple colon/catch-all syntax or curly brace
	 * syntax, which optionally allows a regular expression for the parameter to be specified:
	 *
	 * * `':'` name - colon placeholder
	 * * `'*'` name - catch-all placeholder
	 * * `'{' name '}'` - curly placeholder
	 * * `'{' name ':' regexp|type '}'` - curly placeholder with regexp or type name. Should the
	 *   regexp itself contain curly braces, they must be in matched pairs or escaped with a backslash.
	 *
	 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
	 * must be unique within the pattern (across both path and search parameters). For colon
	 * placeholders or curly placeholders without an explicit regexp, a path parameter matches any
	 * number of characters other than '/'. For catch-all placeholders the path parameter matches
	 * any number of characters.
	 *
	 * Examples:
	 *
	 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
	 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
	 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
	 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
	 * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
	 * * `'/user/{id:[^/]*}'` - Same as the previous example.
	 * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
	 *   parameter consists of 1 to 8 hex digits.
	 * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
	 *   path into the parameter 'path'.
	 * * `'/files/*path'` - ditto.
	 * * `'/calendar/{start:date}'` - Matches "/calendar/2014-11-12" (because the pattern defined
	 *   in the built-in  `date` Type matches `2014-11-12`) and provides a Date object in $stateParams.start
	 *
	 * @param {string} pattern  The pattern to compile into a matcher.
	 * @param {Object} config  A configuration object hash:
	 * @param {Object=} parentMatcher Used to concatenate the pattern/config onto
	 *   an existing UrlMatcher
	 *
	 * * `caseInsensitive` - `true` if URL matching should be case insensitive, otherwise `false`, the default value (for backward compatibility) is `false`.
	 * * `strict` - `false` if matching against a URL with a trailing slash should be treated as equivalent to a URL without a trailing slash, the default value is `true`.
	 *
	 * @property {string} prefix  A static prefix of this pattern. The matcher guarantees that any
	 *   URL matching this matcher (i.e. any string for which {@link ui.router.util.type:UrlMatcher#methods_exec exec()} returns
	 *   non-null) will start with this prefix.
	 *
	 * @property {string} source  The pattern that was passed into the constructor
	 *
	 * @property {string} sourcePath  The path portion of the source property
	 *
	 * @property {string} sourceSearch  The search portion of the source property
	 *
	 * @property {string} regex  The constructed regex that will be used to match against the url when
	 *   it is time to determine which url will match.
	 *
	 * @returns {Object}  New `UrlMatcher` object
	 */
	function UrlMatcher(pattern, config, parentMatcher) {
	  config = extend({ params: {} }, isObject(config) ? config : {});
	
	  // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
	  //   '*' name
	  //   ':' name
	  //   '{' name '}'
	  //   '{' name ':' regexp '}'
	  // The regular expression is somewhat complicated due to the need to allow curly braces
	  // inside the regular expression. The placeholder regexp breaks down as follows:
	  //    ([:*])([\w\[\]]+)              - classic placeholder ($1 / $2) (search version has - for snake-case)
	  //    \{([\w\[\]]+)(?:\:\s*( ... ))?\}  - curly brace placeholder ($3) with optional regexp/type ... ($4) (search version has - for snake-case
	  //    (?: ... | ... | ... )+         - the regexp consists of any number of atoms, an atom being either
	  //    [^{}\\]+                       - anything other than curly braces or backslash
	  //    \\.                            - a backslash escape
	  //    \{(?:[^{}\\]+|\\.)*\}          - a matched set of curly braces containing other atoms
	  var placeholder       = /([:*])([\w\[\]]+)|\{([\w\[\]]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
	      searchPlaceholder = /([:]?)([\w\[\].-]+)|\{([\w\[\].-]+)(?:\:\s*((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
	      compiled = '^', last = 0, m,
	      segments = this.segments = [],
	      parentParams = parentMatcher ? parentMatcher.params : {},
	      params = this.params = parentMatcher ? parentMatcher.params.$$new() : new $$UMFP.ParamSet(),
	      paramNames = [];
	
	  function addParameter(id, type, config, location) {
	    paramNames.push(id);
	    if (parentParams[id]) return parentParams[id];
	    if (!/^\w+([-.]+\w+)*(?:\[\])?$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
	    if (params[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
	    params[id] = new $$UMFP.Param(id, type, config, location);
	    return params[id];
	  }
	
	  function quoteRegExp(string, pattern, squash, optional) {
	    var surroundPattern = ['',''], result = string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
	    if (!pattern) return result;
	    switch(squash) {
	      case false: surroundPattern = ['(', ')' + (optional ? "?" : "")]; break;
	      case true:
	        result = result.replace(/\/$/, '');
	        surroundPattern = ['(?:\/(', ')|\/)?'];
	      break;
	      default:    surroundPattern = ['(' + squash + "|", ')?']; break;
	    }
	    return result + surroundPattern[0] + pattern + surroundPattern[1];
	  }
	
	  this.source = pattern;
	
	  // Split into static segments separated by path parameter placeholders.
	  // The number of segments is always 1 more than the number of parameters.
	  function matchDetails(m, isSearch) {
	    var id, regexp, segment, type, cfg, arrayMode;
	    id          = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
	    cfg         = config.params[id];
	    segment     = pattern.substring(last, m.index);
	    regexp      = isSearch ? m[4] : m[4] || (m[1] == '*' ? '.*' : null);
	
	    if (regexp) {
	      type      = $$UMFP.type(regexp) || inherit($$UMFP.type("string"), { pattern: new RegExp(regexp, config.caseInsensitive ? 'i' : undefined) });
	    }
	
	    return {
	      id: id, regexp: regexp, segment: segment, type: type, cfg: cfg
	    };
	  }
	
	  var p, param, segment;
	  while ((m = placeholder.exec(pattern))) {
	    p = matchDetails(m, false);
	    if (p.segment.indexOf('?') >= 0) break; // we're into the search part
	
	    param = addParameter(p.id, p.type, p.cfg, "path");
	    compiled += quoteRegExp(p.segment, param.type.pattern.source, param.squash, param.isOptional);
	    segments.push(p.segment);
	    last = placeholder.lastIndex;
	  }
	  segment = pattern.substring(last);
	
	  // Find any search parameter names and remove them from the last segment
	  var i = segment.indexOf('?');
	
	  if (i >= 0) {
	    var search = this.sourceSearch = segment.substring(i);
	    segment = segment.substring(0, i);
	    this.sourcePath = pattern.substring(0, last + i);
	
	    if (search.length > 0) {
	      last = 0;
	      while ((m = searchPlaceholder.exec(search))) {
	        p = matchDetails(m, true);
	        param = addParameter(p.id, p.type, p.cfg, "search");
	        last = placeholder.lastIndex;
	        // check if ?&
	      }
	    }
	  } else {
	    this.sourcePath = pattern;
	    this.sourceSearch = '';
	  }
	
	  compiled += quoteRegExp(segment) + (config.strict === false ? '\/?' : '') + '$';
	  segments.push(segment);
	
	  this.regexp = new RegExp(compiled, config.caseInsensitive ? 'i' : undefined);
	  this.prefix = segments[0];
	  this.$$paramNames = paramNames;
	}
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#concat
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Returns a new matcher for a pattern constructed by appending the path part and adding the
	 * search parameters of the specified pattern to this pattern. The current pattern is not
	 * modified. This can be understood as creating a pattern for URLs that are relative to (or
	 * suffixes of) the current pattern.
	 *
	 * @example
	 * The following two matchers are equivalent:
	 * <pre>
	 * new UrlMatcher('/user/{id}?q').concat('/details?date');
	 * new UrlMatcher('/user/{id}/details?q&date');
	 * </pre>
	 *
	 * @param {string} pattern  The pattern to append.
	 * @param {Object} config  An object hash of the configuration for the matcher.
	 * @returns {UrlMatcher}  A matcher for the concatenated pattern.
	 */
	UrlMatcher.prototype.concat = function (pattern, config) {
	  // Because order of search parameters is irrelevant, we can add our own search
	  // parameters to the end of the new pattern. Parse the new pattern by itself
	  // and then join the bits together, but it's much easier to do this on a string level.
	  var defaultConfig = {
	    caseInsensitive: $$UMFP.caseInsensitive(),
	    strict: $$UMFP.strictMode(),
	    squash: $$UMFP.defaultSquashPolicy()
	  };
	  return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch, extend(defaultConfig, config), this);
	};
	
	UrlMatcher.prototype.toString = function () {
	  return this.source;
	};
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#exec
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Tests the specified path against this matcher, and returns an object containing the captured
	 * parameter values, or null if the path does not match. The returned object contains the values
	 * of any search parameters that are mentioned in the pattern, but their value may be null if
	 * they are not present in `searchParams`. This means that search parameters are always treated
	 * as optional.
	 *
	 * @example
	 * <pre>
	 * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', {
	 *   x: '1', q: 'hello'
	 * });
	 * // returns { id: 'bob', q: 'hello', r: null }
	 * </pre>
	 *
	 * @param {string} path  The URL path to match, e.g. `$location.path()`.
	 * @param {Object} searchParams  URL search parameters, e.g. `$location.search()`.
	 * @returns {Object}  The captured parameter values.
	 */
	UrlMatcher.prototype.exec = function (path, searchParams) {
	  var m = this.regexp.exec(path);
	  if (!m) return null;
	  searchParams = searchParams || {};
	
	  var paramNames = this.parameters(), nTotal = paramNames.length,
	    nPath = this.segments.length - 1,
	    values = {}, i, j, cfg, paramName;
	
	  if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");
	
	  function decodePathArray(string) {
	    function reverseString(str) { return str.split("").reverse().join(""); }
	    function unquoteDashes(str) { return str.replace(/\\-/g, "-"); }
	
	    var split = reverseString(string).split(/-(?!\\)/);
	    var allReversed = map(split, reverseString);
	    return map(allReversed, unquoteDashes).reverse();
	  }
	
	  var param, paramVal;
	  for (i = 0; i < nPath; i++) {
	    paramName = paramNames[i];
	    param = this.params[paramName];
	    paramVal = m[i+1];
	    // if the param value matches a pre-replace pair, replace the value before decoding.
	    for (j = 0; j < param.replace.length; j++) {
	      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
	    }
	    if (paramVal && param.array === true) paramVal = decodePathArray(paramVal);
	    if (isDefined(paramVal)) paramVal = param.type.decode(paramVal);
	    values[paramName] = param.value(paramVal);
	  }
	  for (/**/; i < nTotal; i++) {
	    paramName = paramNames[i];
	    values[paramName] = this.params[paramName].value(searchParams[paramName]);
	    param = this.params[paramName];
	    paramVal = searchParams[paramName];
	    for (j = 0; j < param.replace.length; j++) {
	      if (param.replace[j].from === paramVal) paramVal = param.replace[j].to;
	    }
	    if (isDefined(paramVal)) paramVal = param.type.decode(paramVal);
	    values[paramName] = param.value(paramVal);
	  }
	
	  return values;
	};
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#parameters
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Returns the names of all path and search parameters of this pattern in an unspecified order.
	 *
	 * @returns {Array.<string>}  An array of parameter names. Must be treated as read-only. If the
	 *    pattern has no parameters, an empty array is returned.
	 */
	UrlMatcher.prototype.parameters = function (param) {
	  if (!isDefined(param)) return this.$$paramNames;
	  return this.params[param] || null;
	};
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#validates
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Checks an object hash of parameters to validate their correctness according to the parameter
	 * types of this `UrlMatcher`.
	 *
	 * @param {Object} params The object hash of parameters to validate.
	 * @returns {boolean} Returns `true` if `params` validates, otherwise `false`.
	 */
	UrlMatcher.prototype.validates = function (params) {
	  return this.params.$$validates(params);
	};
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:UrlMatcher#format
	 * @methodOf ui.router.util.type:UrlMatcher
	 *
	 * @description
	 * Creates a URL that matches this pattern by substituting the specified values
	 * for the path and search parameters. Null values for path parameters are
	 * treated as empty strings.
	 *
	 * @example
	 * <pre>
	 * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
	 * // returns '/user/bob?q=yes'
	 * </pre>
	 *
	 * @param {Object} values  the values to substitute for the parameters in this pattern.
	 * @returns {string}  the formatted URL (path and optionally search part).
	 */
	UrlMatcher.prototype.format = function (values) {
	  values = values || {};
	  var segments = this.segments, params = this.parameters(), paramset = this.params;
	  if (!this.validates(values)) return null;
	
	  var i, search = false, nPath = segments.length - 1, nTotal = params.length, result = segments[0];
	
	  function encodeDashes(str) { // Replace dashes with encoded "\-"
	    return encodeURIComponent(str).replace(/-/g, function(c) { return '%5C%' + c.charCodeAt(0).toString(16).toUpperCase(); });
	  }
	
	  for (i = 0; i < nTotal; i++) {
	    var isPathParam = i < nPath;
	    var name = params[i], param = paramset[name], value = param.value(values[name]);
	    var isDefaultValue = param.isOptional && param.type.equals(param.value(), value);
	    var squash = isDefaultValue ? param.squash : false;
	    var encoded = param.type.encode(value);
	
	    if (isPathParam) {
	      var nextSegment = segments[i + 1];
	      var isFinalPathParam = i + 1 === nPath;
	
	      if (squash === false) {
	        if (encoded != null) {
	          if (isArray(encoded)) {
	            result += map(encoded, encodeDashes).join("-");
	          } else {
	            result += encodeURIComponent(encoded);
	          }
	        }
	        result += nextSegment;
	      } else if (squash === true) {
	        var capture = result.match(/\/$/) ? /\/?(.*)/ : /(.*)/;
	        result += nextSegment.match(capture)[1];
	      } else if (isString(squash)) {
	        result += squash + nextSegment;
	      }
	
	      if (isFinalPathParam && param.squash === true && result.slice(-1) === '/') result = result.slice(0, -1);
	    } else {
	      if (encoded == null || (isDefaultValue && squash !== false)) continue;
	      if (!isArray(encoded)) encoded = [ encoded ];
	      if (encoded.length === 0) continue;
	      encoded = map(encoded, encodeURIComponent).join('&' + name + '=');
	      result += (search ? '&' : '?') + (name + '=' + encoded);
	      search = true;
	    }
	  }
	
	  return result;
	};
	
	/**
	 * @ngdoc object
	 * @name ui.router.util.type:Type
	 *
	 * @description
	 * Implements an interface to define custom parameter types that can be decoded from and encoded to
	 * string parameters matched in a URL. Used by {@link ui.router.util.type:UrlMatcher `UrlMatcher`}
	 * objects when matching or formatting URLs, or comparing or validating parameter values.
	 *
	 * See {@link ui.router.util.$urlMatcherFactory#methods_type `$urlMatcherFactory#type()`} for more
	 * information on registering custom types.
	 *
	 * @param {Object} config  A configuration object which contains the custom type definition.  The object's
	 *        properties will override the default methods and/or pattern in `Type`'s public interface.
	 * @example
	 * <pre>
	 * {
	 *   decode: function(val) { return parseInt(val, 10); },
	 *   encode: function(val) { return val && val.toString(); },
	 *   equals: function(a, b) { return this.is(a) && a === b; },
	 *   is: function(val) { return angular.isNumber(val) isFinite(val) && val % 1 === 0; },
	 *   pattern: /\d+/
	 * }
	 * </pre>
	 *
	 * @property {RegExp} pattern The regular expression pattern used to match values of this type when
	 *           coming from a substring of a URL.
	 *
	 * @returns {Object}  Returns a new `Type` object.
	 */
	function Type(config) {
	  extend(this, config);
	}
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#is
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Detects whether a value is of a particular type. Accepts a native (decoded) value
	 * and determines whether it matches the current `Type` object.
	 *
	 * @param {*} val  The value to check.
	 * @param {string} key  Optional. If the type check is happening in the context of a specific
	 *        {@link ui.router.util.type:UrlMatcher `UrlMatcher`} object, this is the name of the
	 *        parameter in which `val` is stored. Can be used for meta-programming of `Type` objects.
	 * @returns {Boolean}  Returns `true` if the value matches the type, otherwise `false`.
	 */
	Type.prototype.is = function(val, key) {
	  return true;
	};
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#encode
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Encodes a custom/native type value to a string that can be embedded in a URL. Note that the
	 * return value does *not* need to be URL-safe (i.e. passed through `encodeURIComponent()`), it
	 * only needs to be a representation of `val` that has been coerced to a string.
	 *
	 * @param {*} val  The value to encode.
	 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
	 *        meta-programming of `Type` objects.
	 * @returns {string}  Returns a string representation of `val` that can be encoded in a URL.
	 */
	Type.prototype.encode = function(val, key) {
	  return val;
	};
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#decode
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Converts a parameter value (from URL string or transition param) to a custom/native value.
	 *
	 * @param {string} val  The URL parameter value to decode.
	 * @param {string} key  The name of the parameter in which `val` is stored. Can be used for
	 *        meta-programming of `Type` objects.
	 * @returns {*}  Returns a custom representation of the URL parameter value.
	 */
	Type.prototype.decode = function(val, key) {
	  return val;
	};
	
	/**
	 * @ngdoc function
	 * @name ui.router.util.type:Type#equals
	 * @methodOf ui.router.util.type:Type
	 *
	 * @description
	 * Determines whether two decoded values are equivalent.
	 *
	 * @param {*} a  A value to compare against.
	 * @param {*} b  A value to compare against.
	 * @returns {Boolean}  Returns `true` if the values are equivalent/equal, otherwise `false`.
	 */
	Type.prototype.equals = function(a, b) {
	  return a == b;
	};
	
	Type.prototype.$subPattern = function() {
	  var sub = this.pattern.toString();
	  return sub.substr(1, sub.length - 2);
	};
	
	Type.prototype.pattern = /.*/;
	
	Type.prototype.toString = function() { return "{Type:" + this.name + "}"; };
	
	/** Given an encoded string, or a decoded object, returns a decoded object */
	Type.prototype.$normalize = function(val) {
	  return this.is(val) ? val : this.decode(val);
	};
	
	/*
	 * Wraps an existing custom Type as an array of Type, depending on 'mode'.
	 * e.g.:
	 * - urlmatcher pattern "/path?{queryParam[]:int}"
	 * - url: "/path?queryParam=1&queryParam=2
	 * - $stateParams.queryParam will be [1, 2]
	 * if `mode` is "auto", then
	 * - url: "/path?queryParam=1 will create $stateParams.queryParam: 1
	 * - url: "/path?queryParam=1&queryParam=2 will create $stateParams.queryParam: [1, 2]
	 */
	Type.prototype.$asArray = function(mode, isSearch) {
	  if (!mode) return this;
	  if (mode === "auto" && !isSearch) throw new Error("'auto' array mode is for query parameters only");
	
	  function ArrayType(type, mode) {
	    function bindTo(type, callbackName) {
	      return function() {
	        return type[callbackName].apply(type, arguments);
	      };
	    }
	
	    // Wrap non-array value as array
	    function arrayWrap(val) { return isArray(val) ? val : (isDefined(val) ? [ val ] : []); }
	    // Unwrap array value for "auto" mode. Return undefined for empty array.
	    function arrayUnwrap(val) {
	      switch(val.length) {
	        case 0: return undefined;
	        case 1: return mode === "auto" ? val[0] : val;
	        default: return val;
	      }
	    }
	    function falsey(val) { return !val; }
	
	    // Wraps type (.is/.encode/.decode) functions to operate on each value of an array
	    function arrayHandler(callback, allTruthyMode) {
	      return function handleArray(val) {
	        if (isArray(val) && val.length === 0) return val;
	        val = arrayWrap(val);
	        var result = map(val, callback);
	        if (allTruthyMode === true)
	          return filter(result, falsey).length === 0;
	        return arrayUnwrap(result);
	      };
	    }
	
	    // Wraps type (.equals) functions to operate on each value of an array
	    function arrayEqualsHandler(callback) {
	      return function handleArray(val1, val2) {
	        var left = arrayWrap(val1), right = arrayWrap(val2);
	        if (left.length !== right.length) return false;
	        for (var i = 0; i < left.length; i++) {
	          if (!callback(left[i], right[i])) return false;
	        }
	        return true;
	      };
	    }
	
	    this.encode = arrayHandler(bindTo(type, 'encode'));
	    this.decode = arrayHandler(bindTo(type, 'decode'));
	    this.is     = arrayHandler(bindTo(type, 'is'), true);
	    this.equals = arrayEqualsHandler(bindTo(type, 'equals'));
	    this.pattern = type.pattern;
	    this.$normalize = arrayHandler(bindTo(type, '$normalize'));
	    this.name = type.name;
	    this.$arrayMode = mode;
	  }
	
	  return new ArrayType(this, mode);
	};
	
	
	
	/**
	 * @ngdoc object
	 * @name ui.router.util.$urlMatcherFactory
	 *
	 * @description
	 * Factory for {@link ui.router.util.type:UrlMatcher `UrlMatcher`} instances. The factory
	 * is also available to providers under the name `$urlMatcherFactoryProvider`.
	 */
	function $UrlMatcherFactory() {
	  $$UMFP = this;
	
	  var isCaseInsensitive = false, isStrictMode = true, defaultSquashPolicy = false;
	
	  // Use tildes to pre-encode slashes.
	  // If the slashes are simply URLEncoded, the browser can choose to pre-decode them,
	  // and bidirectional encoding/decoding fails.
	  // Tilde was chosen because it's not a RFC 3986 section 2.2 Reserved Character
	  function valToString(val) { return val != null ? val.toString().replace(/~/g, "~~").replace(/\//g, "~2F") : val; }
	  function valFromString(val) { return val != null ? val.toString().replace(/~2F/g, "/").replace(/~~/g, "~") : val; }
	
	  var $types = {}, enqueue = true, typeQueue = [], injector, defaultTypes = {
	    "string": {
	      encode: valToString,
	      decode: valFromString,
	      // TODO: in 1.0, make string .is() return false if value is undefined/null by default.
	      // In 0.2.x, string params are optional by default for backwards compat
	      is: function(val) { return val == null || !isDefined(val) || typeof val === "string"; },
	      pattern: /[^/]*/
	    },
	    "int": {
	      encode: valToString,
	      decode: function(val) { return parseInt(val, 10); },
	      is: function(val) { return isDefined(val) && this.decode(val.toString()) === val; },
	      pattern: /\d+/
	    },
	    "bool": {
	      encode: function(val) { return val ? 1 : 0; },
	      decode: function(val) { return parseInt(val, 10) !== 0; },
	      is: function(val) { return val === true || val === false; },
	      pattern: /0|1/
	    },
	    "date": {
	      encode: function (val) {
	        if (!this.is(val))
	          return undefined;
	        return [ val.getFullYear(),
	          ('0' + (val.getMonth() + 1)).slice(-2),
	          ('0' + val.getDate()).slice(-2)
	        ].join("-");
	      },
	      decode: function (val) {
	        if (this.is(val)) return val;
	        var match = this.capture.exec(val);
	        return match ? new Date(match[1], match[2] - 1, match[3]) : undefined;
	      },
	      is: function(val) { return val instanceof Date && !isNaN(val.valueOf()); },
	      equals: function (a, b) { return this.is(a) && this.is(b) && a.toISOString() === b.toISOString(); },
	      pattern: /[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2][0-9]|3[0-1])/,
	      capture: /([0-9]{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/
	    },
	    "json": {
	      encode: angular.toJson,
	      decode: angular.fromJson,
	      is: angular.isObject,
	      equals: angular.equals,
	      pattern: /[^/]*/
	    },
	    "any": { // does not encode/decode
	      encode: angular.identity,
	      decode: angular.identity,
	      equals: angular.equals,
	      pattern: /.*/
	    }
	  };
	
	  function getDefaultConfig() {
	    return {
	      strict: isStrictMode,
	      caseInsensitive: isCaseInsensitive
	    };
	  }
	
	  function isInjectable(value) {
	    return (isFunction(value) || (isArray(value) && isFunction(value[value.length - 1])));
	  }
	
	  /**
	   * [Internal] Get the default value of a parameter, which may be an injectable function.
	   */
	  $UrlMatcherFactory.$$getDefaultValue = function(config) {
	    if (!isInjectable(config.value)) return config.value;
	    if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
	    return injector.invoke(config.value);
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#caseInsensitive
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Defines whether URL matching should be case sensitive (the default behavior), or not.
	   *
	   * @param {boolean} value `false` to match URL in a case sensitive manner; otherwise `true`;
	   * @returns {boolean} the current value of caseInsensitive
	   */
	  this.caseInsensitive = function(value) {
	    if (isDefined(value))
	      isCaseInsensitive = value;
	    return isCaseInsensitive;
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#strictMode
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Defines whether URLs should match trailing slashes, or not (the default behavior).
	   *
	   * @param {boolean=} value `false` to match trailing slashes in URLs, otherwise `true`.
	   * @returns {boolean} the current value of strictMode
	   */
	  this.strictMode = function(value) {
	    if (isDefined(value))
	      isStrictMode = value;
	    return isStrictMode;
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#defaultSquashPolicy
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Sets the default behavior when generating or matching URLs with default parameter values.
	   *
	   * @param {string} value A string that defines the default parameter URL squashing behavior.
	   *    `nosquash`: When generating an href with a default parameter value, do not squash the parameter value from the URL
	   *    `slash`: When generating an href with a default parameter value, squash (remove) the parameter value, and, if the
	   *             parameter is surrounded by slashes, squash (remove) one slash from the URL
	   *    any other string, e.g. "~": When generating an href with a default parameter value, squash (remove)
	   *             the parameter value from the URL and replace it with this string.
	   */
	  this.defaultSquashPolicy = function(value) {
	    if (!isDefined(value)) return defaultSquashPolicy;
	    if (value !== true && value !== false && !isString(value))
	      throw new Error("Invalid squash policy: " + value + ". Valid policies: false, true, arbitrary-string");
	    defaultSquashPolicy = value;
	    return value;
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#compile
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Creates a {@link ui.router.util.type:UrlMatcher `UrlMatcher`} for the specified pattern.
	   *
	   * @param {string} pattern  The URL pattern.
	   * @param {Object} config  The config object hash.
	   * @returns {UrlMatcher}  The UrlMatcher.
	   */
	  this.compile = function (pattern, config) {
	    return new UrlMatcher(pattern, extend(getDefaultConfig(), config));
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#isMatcher
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Returns true if the specified object is a `UrlMatcher`, or false otherwise.
	   *
	   * @param {Object} object  The object to perform the type check against.
	   * @returns {Boolean}  Returns `true` if the object matches the `UrlMatcher` interface, by
	   *          implementing all the same methods.
	   */
	  this.isMatcher = function (o) {
	    if (!isObject(o)) return false;
	    var result = true;
	
	    forEach(UrlMatcher.prototype, function(val, name) {
	      if (isFunction(val)) {
	        result = result && (isDefined(o[name]) && isFunction(o[name]));
	      }
	    });
	    return result;
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.util.$urlMatcherFactory#type
	   * @methodOf ui.router.util.$urlMatcherFactory
	   *
	   * @description
	   * Registers a custom {@link ui.router.util.type:Type `Type`} object that can be used to
	   * generate URLs with typed parameters.
	   *
	   * @param {string} name  The type name.
	   * @param {Object|Function} definition   The type definition. See
	   *        {@link ui.router.util.type:Type `Type`} for information on the values accepted.
	   * @param {Object|Function} definitionFn (optional) A function that is injected before the app
	   *        runtime starts.  The result of this function is merged into the existing `definition`.
	   *        See {@link ui.router.util.type:Type `Type`} for information on the values accepted.
	   *
	   * @returns {Object}  Returns `$urlMatcherFactoryProvider`.
	   *
	   * @example
	   * This is a simple example of a custom type that encodes and decodes items from an
	   * array, using the array index as the URL-encoded value:
	   *
	   * <pre>
	   * var list = ['John', 'Paul', 'George', 'Ringo'];
	   *
	   * $urlMatcherFactoryProvider.type('listItem', {
	   *   encode: function(item) {
	   *     // Represent the list item in the URL using its corresponding index
	   *     return list.indexOf(item);
	   *   },
	   *   decode: function(item) {
	   *     // Look up the list item by index
	   *     return list[parseInt(item, 10)];
	   *   },
	   *   is: function(item) {
	   *     // Ensure the item is valid by checking to see that it appears
	   *     // in the list
	   *     return list.indexOf(item) > -1;
	   *   }
	   * });
	   *
	   * $stateProvider.state('list', {
	   *   url: "/list/{item:listItem}",
	   *   controller: function($scope, $stateParams) {
	   *     console.log($stateParams.item);
	   *   }
	   * });
	   *
	   * // ...
	   *
	   * // Changes URL to '/list/3', logs "Ringo" to the console
	   * $state.go('list', { item: "Ringo" });
	   * </pre>
	   *
	   * This is a more complex example of a type that relies on dependency injection to
	   * interact with services, and uses the parameter name from the URL to infer how to
	   * handle encoding and decoding parameter values:
	   *
	   * <pre>
	   * // Defines a custom type that gets a value from a service,
	   * // where each service gets different types of values from
	   * // a backend API:
	   * $urlMatcherFactoryProvider.type('dbObject', {}, function(Users, Posts) {
	   *
	   *   // Matches up services to URL parameter names
	   *   var services = {
	   *     user: Users,
	   *     post: Posts
	   *   };
	   *
	   *   return {
	   *     encode: function(object) {
	   *       // Represent the object in the URL using its unique ID
	   *       return object.id;
	   *     },
	   *     decode: function(value, key) {
	   *       // Look up the object by ID, using the parameter
	   *       // name (key) to call the correct service
	   *       return services[key].findById(value);
	   *     },
	   *     is: function(object, key) {
	   *       // Check that object is a valid dbObject
	   *       return angular.isObject(object) && object.id && services[key];
	   *     }
	   *     equals: function(a, b) {
	   *       // Check the equality of decoded objects by comparing
	   *       // their unique IDs
	   *       return a.id === b.id;
	   *     }
	   *   };
	   * });
	   *
	   * // In a config() block, you can then attach URLs with
	   * // type-annotated parameters:
	   * $stateProvider.state('users', {
	   *   url: "/users",
	   *   // ...
	   * }).state('users.item', {
	   *   url: "/{user:dbObject}",
	   *   controller: function($scope, $stateParams) {
	   *     // $stateParams.user will now be an object returned from
	   *     // the Users service
	   *   },
	   *   // ...
	   * });
	   * </pre>
	   */
	  this.type = function (name, definition, definitionFn) {
	    if (!isDefined(definition)) return $types[name];
	    if ($types.hasOwnProperty(name)) throw new Error("A type named '" + name + "' has already been defined.");
	
	    $types[name] = new Type(extend({ name: name }, definition));
	    if (definitionFn) {
	      typeQueue.push({ name: name, def: definitionFn });
	      if (!enqueue) flushTypeQueue();
	    }
	    return this;
	  };
	
	  // `flushTypeQueue()` waits until `$urlMatcherFactory` is injected before invoking the queued `definitionFn`s
	  function flushTypeQueue() {
	    while(typeQueue.length) {
	      var type = typeQueue.shift();
	      if (type.pattern) throw new Error("You cannot override a type's .pattern at runtime.");
	      angular.extend($types[type.name], injector.invoke(type.def));
	    }
	  }
	
	  // Register default types. Store them in the prototype of $types.
	  forEach(defaultTypes, function(type, name) { $types[name] = new Type(extend({name: name}, type)); });
	  $types = inherit($types, {});
	
	  /* No need to document $get, since it returns this */
	  this.$get = ['$injector', function ($injector) {
	    injector = $injector;
	    enqueue = false;
	    flushTypeQueue();
	
	    forEach(defaultTypes, function(type, name) {
	      if (!$types[name]) $types[name] = new Type(type);
	    });
	    return this;
	  }];
	
	  this.Param = function Param(id, type, config, location) {
	    var self = this;
	    config = unwrapShorthand(config);
	    type = getType(config, type, location);
	    var arrayMode = getArrayMode();
	    type = arrayMode ? type.$asArray(arrayMode, location === "search") : type;
	    if (type.name === "string" && !arrayMode && location === "path" && config.value === undefined)
	      config.value = ""; // for 0.2.x; in 0.3.0+ do not automatically default to ""
	    var isOptional = config.value !== undefined;
	    var squash = getSquashPolicy(config, isOptional);
	    var replace = getReplace(config, arrayMode, isOptional, squash);
	
	    function unwrapShorthand(config) {
	      var keys = isObject(config) ? objectKeys(config) : [];
	      var isShorthand = indexOf(keys, "value") === -1 && indexOf(keys, "type") === -1 &&
	                        indexOf(keys, "squash") === -1 && indexOf(keys, "array") === -1;
	      if (isShorthand) config = { value: config };
	      config.$$fn = isInjectable(config.value) ? config.value : function () { return config.value; };
	      return config;
	    }
	
	    function getType(config, urlType, location) {
	      if (config.type && urlType) throw new Error("Param '"+id+"' has two type configurations.");
	      if (urlType) return urlType;
	      if (!config.type) return (location === "config" ? $types.any : $types.string);
	
	      if (angular.isString(config.type))
	        return $types[config.type];
	      if (config.type instanceof Type)
	        return config.type;
	      return new Type(config.type);
	    }
	
	    // array config: param name (param[]) overrides default settings.  explicit config overrides param name.
	    function getArrayMode() {
	      var arrayDefaults = { array: (location === "search" ? "auto" : false) };
	      var arrayParamNomenclature = id.match(/\[\]$/) ? { array: true } : {};
	      return extend(arrayDefaults, arrayParamNomenclature, config).array;
	    }
	
	    /**
	     * returns false, true, or the squash value to indicate the "default parameter url squash policy".
	     */
	    function getSquashPolicy(config, isOptional) {
	      var squash = config.squash;
	      if (!isOptional || squash === false) return false;
	      if (!isDefined(squash) || squash == null) return defaultSquashPolicy;
	      if (squash === true || isString(squash)) return squash;
	      throw new Error("Invalid squash policy: '" + squash + "'. Valid policies: false, true, or arbitrary string");
	    }
	
	    function getReplace(config, arrayMode, isOptional, squash) {
	      var replace, configuredKeys, defaultPolicy = [
	        { from: "",   to: (isOptional || arrayMode ? undefined : "") },
	        { from: null, to: (isOptional || arrayMode ? undefined : "") }
	      ];
	      replace = isArray(config.replace) ? config.replace : [];
	      if (isString(squash))
	        replace.push({ from: squash, to: undefined });
	      configuredKeys = map(replace, function(item) { return item.from; } );
	      return filter(defaultPolicy, function(item) { return indexOf(configuredKeys, item.from) === -1; }).concat(replace);
	    }
	
	    /**
	     * [Internal] Get the default value of a parameter, which may be an injectable function.
	     */
	    function $$getDefaultValue() {
	      if (!injector) throw new Error("Injectable functions cannot be called at configuration time");
	      var defaultValue = injector.invoke(config.$$fn);
	      if (defaultValue !== null && defaultValue !== undefined && !self.type.is(defaultValue))
	        throw new Error("Default value (" + defaultValue + ") for parameter '" + self.id + "' is not an instance of Type (" + self.type.name + ")");
	      return defaultValue;
	    }
	
	    /**
	     * [Internal] Gets the decoded representation of a value if the value is defined, otherwise, returns the
	     * default value, which may be the result of an injectable function.
	     */
	    function $value(value) {
	      function hasReplaceVal(val) { return function(obj) { return obj.from === val; }; }
	      function $replace(value) {
	        var replacement = map(filter(self.replace, hasReplaceVal(value)), function(obj) { return obj.to; });
	        return replacement.length ? replacement[0] : value;
	      }
	      value = $replace(value);
	      return !isDefined(value) ? $$getDefaultValue() : self.type.$normalize(value);
	    }
	
	    function toString() { return "{Param:" + id + " " + type + " squash: '" + squash + "' optional: " + isOptional + "}"; }
	
	    extend(this, {
	      id: id,
	      type: type,
	      location: location,
	      array: arrayMode,
	      squash: squash,
	      replace: replace,
	      isOptional: isOptional,
	      value: $value,
	      dynamic: undefined,
	      config: config,
	      toString: toString
	    });
	  };
	
	  function ParamSet(params) {
	    extend(this, params || {});
	  }
	
	  ParamSet.prototype = {
	    $$new: function() {
	      return inherit(this, extend(new ParamSet(), { $$parent: this}));
	    },
	    $$keys: function () {
	      var keys = [], chain = [], parent = this,
	        ignore = objectKeys(ParamSet.prototype);
	      while (parent) { chain.push(parent); parent = parent.$$parent; }
	      chain.reverse();
	      forEach(chain, function(paramset) {
	        forEach(objectKeys(paramset), function(key) {
	            if (indexOf(keys, key) === -1 && indexOf(ignore, key) === -1) keys.push(key);
	        });
	      });
	      return keys;
	    },
	    $$values: function(paramValues) {
	      var values = {}, self = this;
	      forEach(self.$$keys(), function(key) {
	        values[key] = self[key].value(paramValues && paramValues[key]);
	      });
	      return values;
	    },
	    $$equals: function(paramValues1, paramValues2) {
	      var equal = true, self = this;
	      forEach(self.$$keys(), function(key) {
	        var left = paramValues1 && paramValues1[key], right = paramValues2 && paramValues2[key];
	        if (!self[key].type.equals(left, right)) equal = false;
	      });
	      return equal;
	    },
	    $$validates: function $$validate(paramValues) {
	      var keys = this.$$keys(), i, param, rawVal, normalized, encoded;
	      for (i = 0; i < keys.length; i++) {
	        param = this[keys[i]];
	        rawVal = paramValues[keys[i]];
	        if ((rawVal === undefined || rawVal === null) && param.isOptional)
	          break; // There was no parameter value, but the param is optional
	        normalized = param.type.$normalize(rawVal);
	        if (!param.type.is(normalized))
	          return false; // The value was not of the correct Type, and could not be decoded to the correct Type
	        encoded = param.type.encode(normalized);
	        if (angular.isString(encoded) && !param.type.pattern.exec(encoded))
	          return false; // The value was of the correct type, but when encoded, did not match the Type's regexp
	      }
	      return true;
	    },
	    $$parent: undefined
	  };
	
	  this.ParamSet = ParamSet;
	}
	
	// Register as a provider so it's available to other providers
	angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);
	angular.module('ui.router.util').run(['$urlMatcherFactory', function($urlMatcherFactory) { }]);
	
	/**
	 * @ngdoc object
	 * @name ui.router.router.$urlRouterProvider
	 *
	 * @requires ui.router.util.$urlMatcherFactoryProvider
	 * @requires $locationProvider
	 *
	 * @description
	 * `$urlRouterProvider` has the responsibility of watching `$location`. 
	 * When `$location` changes it runs through a list of rules one by one until a 
	 * match is found. `$urlRouterProvider` is used behind the scenes anytime you specify 
	 * a url in a state configuration. All urls are compiled into a UrlMatcher object.
	 *
	 * There are several methods on `$urlRouterProvider` that make it useful to use directly
	 * in your module config.
	 */
	$UrlRouterProvider.$inject = ['$locationProvider', '$urlMatcherFactoryProvider'];
	function $UrlRouterProvider(   $locationProvider,   $urlMatcherFactory) {
	  var rules = [], otherwise = null, interceptDeferred = false, listener;
	
	  // Returns a string that is a prefix of all strings matching the RegExp
	  function regExpPrefix(re) {
	    var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
	    return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
	  }
	
	  // Interpolates matched values into a String.replace()-style pattern
	  function interpolate(pattern, match) {
	    return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
	      return match[what === '$' ? 0 : Number(what)];
	    });
	  }
	
	  /**
	   * @ngdoc function
	   * @name ui.router.router.$urlRouterProvider#rule
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Defines rules that are used by `$urlRouterProvider` to find matches for
	   * specific URLs.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *   // Here's an example of how you might allow case insensitive urls
	   *   $urlRouterProvider.rule(function ($injector, $location) {
	   *     var path = $location.path(),
	   *         normalized = path.toLowerCase();
	   *
	   *     if (path !== normalized) {
	   *       return normalized;
	   *     }
	   *   });
	   * });
	   * </pre>
	   *
	   * @param {function} rule Handler function that takes `$injector` and `$location`
	   * services as arguments. You can use them to return a valid path as a string.
	   *
	   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
	   */
	  this.rule = function (rule) {
	    if (!isFunction(rule)) throw new Error("'rule' must be a function");
	    rules.push(rule);
	    return this;
	  };
	
	  /**
	   * @ngdoc object
	   * @name ui.router.router.$urlRouterProvider#otherwise
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Defines a path that is used when an invalid route is requested.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *   // if the path doesn't match any of the urls you configured
	   *   // otherwise will take care of routing the user to the
	   *   // specified url
	   *   $urlRouterProvider.otherwise('/index');
	   *
	   *   // Example of using function rule as param
	   *   $urlRouterProvider.otherwise(function ($injector, $location) {
	   *     return '/a/valid/url';
	   *   });
	   * });
	   * </pre>
	   *
	   * @param {string|function} rule The url path you want to redirect to or a function 
	   * rule that returns the url path. The function version is passed two params: 
	   * `$injector` and `$location` services, and must return a url string.
	   *
	   * @return {object} `$urlRouterProvider` - `$urlRouterProvider` instance
	   */
	  this.otherwise = function (rule) {
	    if (isString(rule)) {
	      var redirect = rule;
	      rule = function () { return redirect; };
	    }
	    else if (!isFunction(rule)) throw new Error("'rule' must be a function");
	    otherwise = rule;
	    return this;
	  };
	
	
	  function handleIfMatch($injector, handler, match) {
	    if (!match) return false;
	    var result = $injector.invoke(handler, handler, { $match: match });
	    return isDefined(result) ? result : true;
	  }
	
	  /**
	   * @ngdoc function
	   * @name ui.router.router.$urlRouterProvider#when
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Registers a handler for a given url matching. 
	   * 
	   * If the handler is a string, it is
	   * treated as a redirect, and is interpolated according to the syntax of match
	   * (i.e. like `String.replace()` for `RegExp`, or like a `UrlMatcher` pattern otherwise).
	   *
	   * If the handler is a function, it is injectable. It gets invoked if `$location`
	   * matches. You have the option of inject the match object as `$match`.
	   *
	   * The handler can return
	   *
	   * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
	   *   will continue trying to find another one that matches.
	   * - **string** which is treated as a redirect and passed to `$location.url()`
	   * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
	   *     if ($state.$current.navigable !== state ||
	   *         !equalForKeys($match, $stateParams) {
	   *      $state.transitionTo(state, $match, false);
	   *     }
	   *   });
	   * });
	   * </pre>
	   *
	   * @param {string|object} what The incoming path that you want to redirect.
	   * @param {string|function} handler The path you want to redirect your user to.
	   */
	  this.when = function (what, handler) {
	    var redirect, handlerIsString = isString(handler);
	    if (isString(what)) what = $urlMatcherFactory.compile(what);
	
	    if (!handlerIsString && !isFunction(handler) && !isArray(handler))
	      throw new Error("invalid 'handler' in when()");
	
	    var strategies = {
	      matcher: function (what, handler) {
	        if (handlerIsString) {
	          redirect = $urlMatcherFactory.compile(handler);
	          handler = ['$match', function ($match) { return redirect.format($match); }];
	        }
	        return extend(function ($injector, $location) {
	          return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
	        }, {
	          prefix: isString(what.prefix) ? what.prefix : ''
	        });
	      },
	      regex: function (what, handler) {
	        if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");
	
	        if (handlerIsString) {
	          redirect = handler;
	          handler = ['$match', function ($match) { return interpolate(redirect, $match); }];
	        }
	        return extend(function ($injector, $location) {
	          return handleIfMatch($injector, handler, what.exec($location.path()));
	        }, {
	          prefix: regExpPrefix(what)
	        });
	      }
	    };
	
	    var check = { matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp };
	
	    for (var n in check) {
	      if (check[n]) return this.rule(strategies[n](what, handler));
	    }
	
	    throw new Error("invalid 'what' in when()");
	  };
	
	  /**
	   * @ngdoc function
	   * @name ui.router.router.$urlRouterProvider#deferIntercept
	   * @methodOf ui.router.router.$urlRouterProvider
	   *
	   * @description
	   * Disables (or enables) deferring location change interception.
	   *
	   * If you wish to customize the behavior of syncing the URL (for example, if you wish to
	   * defer a transition but maintain the current URL), call this method at configuration time.
	   * Then, at run time, call `$urlRouter.listen()` after you have configured your own
	   * `$locationChangeSuccess` event handler.
	   *
	   * @example
	   * <pre>
	   * var app = angular.module('app', ['ui.router.router']);
	   *
	   * app.config(function ($urlRouterProvider) {
	   *
	   *   // Prevent $urlRouter from automatically intercepting URL changes;
	   *   // this allows you to configure custom behavior in between
	   *   // location changes and route synchronization:
	   *   $urlRouterProvider.deferIntercept();
	   *
	   * }).run(function ($rootScope, $urlRouter, UserService) {
	   *
	   *   $rootScope.$on('$locationChangeSuccess', function(e) {
	   *     // UserService is an example service for managing user state
	   *     if (UserService.isLoggedIn()) return;
	   *
	   *     // Prevent $urlRouter's default handler from firing
	   *     e.preventDefault();
	   *
	   *     UserService.handleLogin().then(function() {
	   *       // Once the user has logged in, sync the current URL
	   *       // to the router:
	   *       $urlRouter.sync();
	   *     });
	   *   });
	   *
	   *   // Configures $urlRouter's listener *after* your custom listener
	   *   $urlRouter.listen();
	   * });
	   * </pre>
	   *
	   * @param {boolean} defer Indicates whether to defer location change interception. Passing
	            no parameter is equivalent to `true`.
	   */
	  this.deferIntercept = function (defer) {
	    if (defer === undefined) defer = true;
	    interceptDeferred = defer;
	  };
	
	  /**
	   * @ngdoc object
	   * @name ui.router.router.$urlRouter
	   *
	   * @requires $location
	   * @requires $rootScope
	   * @requires $injector
	   * @requires $browser
	   *
	   * @description
	   *
	   */
	  this.$get = $get;
	  $get.$inject = ['$location', '$rootScope', '$injector', '$browser', '$sniffer'];
	  function $get(   $location,   $rootScope,   $injector,   $browser,   $sniffer) {
	
	    var baseHref = $browser.baseHref(), location = $location.url(), lastPushedUrl;
	
	    function appendBasePath(url, isHtml5, absolute) {
	      if (baseHref === '/') return url;
	      if (isHtml5) return baseHref.slice(0, -1) + url;
	      if (absolute) return baseHref.slice(1) + url;
	      return url;
	    }
	
	    // TODO: Optimize groups of rules with non-empty prefix into some sort of decision tree
	    function update(evt) {
	      if (evt && evt.defaultPrevented) return;
	      var ignoreUpdate = lastPushedUrl && $location.url() === lastPushedUrl;
	      lastPushedUrl = undefined;
	      // TODO: Re-implement this in 1.0 for https://github.com/angular-ui/ui-router/issues/1573
	      //if (ignoreUpdate) return true;
	
	      function check(rule) {
	        var handled = rule($injector, $location);
	
	        if (!handled) return false;
	        if (isString(handled)) $location.replace().url(handled);
	        return true;
	      }
	      var n = rules.length, i;
	
	      for (i = 0; i < n; i++) {
	        if (check(rules[i])) return;
	      }
	      // always check otherwise last to allow dynamic updates to the set of rules
	      if (otherwise) check(otherwise);
	    }
	
	    function listen() {
	      listener = listener || $rootScope.$on('$locationChangeSuccess', update);
	      return listener;
	    }
	
	    if (!interceptDeferred) listen();
	
	    return {
	      /**
	       * @ngdoc function
	       * @name ui.router.router.$urlRouter#sync
	       * @methodOf ui.router.router.$urlRouter
	       *
	       * @description
	       * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
	       * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event,
	       * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed
	       * with the transition by calling `$urlRouter.sync()`.
	       *
	       * @example
	       * <pre>
	       * angular.module('app', ['ui.router'])
	       *   .run(function($rootScope, $urlRouter) {
	       *     $rootScope.$on('$locationChangeSuccess', function(evt) {
	       *       // Halt state change from even starting
	       *       evt.preventDefault();
	       *       // Perform custom logic
	       *       var meetsRequirement = ...
	       *       // Continue with the update and state transition if logic allows
	       *       if (meetsRequirement) $urlRouter.sync();
	       *     });
	       * });
	       * </pre>
	       */
	      sync: function() {
	        update();
	      },
	
	      listen: function() {
	        return listen();
	      },
	
	      update: function(read) {
	        if (read) {
	          location = $location.url();
	          return;
	        }
	        if ($location.url() === location) return;
	
	        $location.url(location);
	        $location.replace();
	      },
	
	      push: function(urlMatcher, params, options) {
	         var url = urlMatcher.format(params || {});
	
	        // Handle the special hash param, if needed
	        if (url !== null && params && params['#']) {
	            url += '#' + params['#'];
	        }
	
	        $location.url(url);
	        lastPushedUrl = options && options.$$avoidResync ? $location.url() : undefined;
	        if (options && options.replace) $location.replace();
	      },
	
	      /**
	       * @ngdoc function
	       * @name ui.router.router.$urlRouter#href
	       * @methodOf ui.router.router.$urlRouter
	       *
	       * @description
	       * A URL generation method that returns the compiled URL for a given
	       * {@link ui.router.util.type:UrlMatcher `UrlMatcher`}, populated with the provided parameters.
	       *
	       * @example
	       * <pre>
	       * $bob = $urlRouter.href(new UrlMatcher("/about/:person"), {
	       *   person: "bob"
	       * });
	       * // $bob == "/about/bob";
	       * </pre>
	       *
	       * @param {UrlMatcher} urlMatcher The `UrlMatcher` object which is used as the template of the URL to generate.
	       * @param {object=} params An object of parameter values to fill the matcher's required parameters.
	       * @param {object=} options Options object. The options are:
	       *
	       * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
	       *
	       * @returns {string} Returns the fully compiled URL, or `null` if `params` fail validation against `urlMatcher`
	       */
	      href: function(urlMatcher, params, options) {
	        if (!urlMatcher.validates(params)) return null;
	
	        var isHtml5 = $locationProvider.html5Mode();
	        if (angular.isObject(isHtml5)) {
	          isHtml5 = isHtml5.enabled;
	        }
	
	        isHtml5 = isHtml5 && $sniffer.history;
	        
	        var url = urlMatcher.format(params);
	        options = options || {};
	
	        if (!isHtml5 && url !== null) {
	          url = "#" + $locationProvider.hashPrefix() + url;
	        }
	
	        // Handle special hash param, if needed
	        if (url !== null && params && params['#']) {
	          url += '#' + params['#'];
	        }
	
	        url = appendBasePath(url, isHtml5, options.absolute);
	
	        if (!options.absolute || !url) {
	          return url;
	        }
	
	        var slash = (!isHtml5 && url ? '/' : ''), port = $location.port();
	        port = (port === 80 || port === 443 ? '' : ':' + port);
	
	        return [$location.protocol(), '://', $location.host(), port, slash, url].join('');
	      }
	    };
	  }
	}
	
	angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);
	
	/**
	 * @ngdoc object
	 * @name ui.router.state.$stateProvider
	 *
	 * @requires ui.router.router.$urlRouterProvider
	 * @requires ui.router.util.$urlMatcherFactoryProvider
	 *
	 * @description
	 * The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely
	 * on state.
	 *
	 * A state corresponds to a "place" in the application in terms of the overall UI and
	 * navigation. A state describes (via the controller / template / view properties) what
	 * the UI looks like and does at that place.
	 *
	 * States often have things in common, and the primary way of factoring out these
	 * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
	 * nested states.
	 *
	 * The `$stateProvider` provides interfaces to declare these states for your app.
	 */
	$StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider'];
	function $StateProvider(   $urlRouterProvider,   $urlMatcherFactory) {
	
	  var root, states = {}, $state, queue = {}, abstractKey = 'abstract';
	
	  // Builds state properties from definition passed to registerState()
	  var stateBuilder = {
	
	    // Derive parent state from a hierarchical name only if 'parent' is not explicitly defined.
	    // state.children = [];
	    // if (parent) parent.children.push(state);
	    parent: function(state) {
	      if (isDefined(state.parent) && state.parent) return findState(state.parent);
	      // regex matches any valid composite state name
	      // would match "contact.list" but not "contacts"
	      var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
	      return compositeName ? findState(compositeName[1]) : root;
	    },
	
	    // inherit 'data' from parent and override by own values (if any)
	    data: function(state) {
	      if (state.parent && state.parent.data) {
	        state.data = state.self.data = inherit(state.parent.data, state.data);
	      }
	      return state.data;
	    },
	
	    // Build a URLMatcher if necessary, either via a relative or absolute URL
	    url: function(state) {
	      var url = state.url, config = { params: state.params || {} };
	
	      if (isString(url)) {
	        if (url.charAt(0) == '^') return $urlMatcherFactory.compile(url.substring(1), config);
	        return (state.parent.navigable || root).url.concat(url, config);
	      }
	
	      if (!url || $urlMatcherFactory.isMatcher(url)) return url;
	      throw new Error("Invalid url '" + url + "' in state '" + state + "'");
	    },
	
	    // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
	    navigable: function(state) {
	      return state.url ? state : (state.parent ? state.parent.navigable : null);
	    },
	
	    // Own parameters for this state. state.url.params is already built at this point. Create and add non-url params
	    ownParams: function(state) {
	      var params = state.url && state.url.params || new $$UMFP.ParamSet();
	      forEach(state.params || {}, function(config, id) {
	        if (!params[id]) params[id] = new $$UMFP.Param(id, null, config, "config");
	      });
	      return params;
	    },
	
	    // Derive parameters for this state and ensure they're a super-set of parent's parameters
	    params: function(state) {
	      var ownParams = pick(state.ownParams, state.ownParams.$$keys());
	      return state.parent && state.parent.params ? extend(state.parent.params.$$new(), ownParams) : new $$UMFP.ParamSet();
	    },
	
	    // If there is no explicit multi-view configuration, make one up so we don't have
	    // to handle both cases in the view directive later. Note that having an explicit
	    // 'views' property will mean the default unnamed view properties are ignored. This
	    // is also a good time to resolve view names to absolute names, so everything is a
	    // straight lookup at link time.
	    views: function(state) {
	      var views = {};
	
	      forEach(isDefined(state.views) ? state.views : { '': state }, function (view, name) {
	        if (name.indexOf('@') < 0) name += '@' + state.parent.name;
	        view.resolveAs = view.resolveAs || state.resolveAs || '$resolve';
	        views[name] = view;
	      });
	      return views;
	    },
	
	    // Keep a full path from the root down to this state as this is needed for state activation.
	    path: function(state) {
	      return state.parent ? state.parent.path.concat(state) : []; // exclude root from path
	    },
	
	    // Speed up $state.contains() as it's used a lot
	    includes: function(state) {
	      var includes = state.parent ? extend({}, state.parent.includes) : {};
	      includes[state.name] = true;
	      return includes;
	    },
	
	    $delegates: {}
	  };
	
	  function isRelative(stateName) {
	    return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
	  }
	
	  function findState(stateOrName, base) {
	    if (!stateOrName) return undefined;
	
	    var isStr = isString(stateOrName),
	        name  = isStr ? stateOrName : stateOrName.name,
	        path  = isRelative(name);
	
	    if (path) {
	      if (!base) throw new Error("No reference point given for path '"  + name + "'");
	      base = findState(base);
	      
	      var rel = name.split("."), i = 0, pathLength = rel.length, current = base;
	
	      for (; i < pathLength; i++) {
	        if (rel[i] === "" && i === 0) {
	          current = base;
	          continue;
	        }
	        if (rel[i] === "^") {
	          if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
	          current = current.parent;
	          continue;
	        }
	        break;
	      }
	      rel = rel.slice(i).join(".");
	      name = current.name + (current.name && rel ? "." : "") + rel;
	    }
	    var state = states[name];
	
	    if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
	      return state;
	    }
	    return undefined;
	  }
	
	  function queueState(parentName, state) {
	    if (!queue[parentName]) {
	      queue[parentName] = [];
	    }
	    queue[parentName].push(state);
	  }
	
	  function flushQueuedChildren(parentName) {
	    var queued = queue[parentName] || [];
	    while(queued.length) {
	      registerState(queued.shift());
	    }
	  }
	
	  function registerState(state) {
	    // Wrap a new object around the state so we can store our private details easily.
	    state = inherit(state, {
	      self: state,
	      resolve: state.resolve || {},
	      toString: function() { return this.name; }
	    });
	
	    var name = state.name;
	    if (!isString(name) || name.indexOf('@') >= 0) throw new Error("State must have a valid name");
	    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "' is already defined");
	
	    // Get parent name
	    var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.'))
	        : (isString(state.parent)) ? state.parent
	        : (isObject(state.parent) && isString(state.parent.name)) ? state.parent.name
	        : '';
	
	    // If parent is not registered yet, add state to queue and register later
	    if (parentName && !states[parentName]) {
	      return queueState(parentName, state.self);
	    }
	
	    for (var key in stateBuilder) {
	      if (isFunction(stateBuilder[key])) state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
	    }
	    states[name] = state;
	
	    // Register the state in the global state list and with $urlRouter if necessary.
	    if (!state[abstractKey] && state.url) {
	      $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
	        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
	          $state.transitionTo(state, $match, { inherit: true, location: false });
	        }
	      }]);
	    }
	
	    // Register any queued children
	    flushQueuedChildren(name);
	
	    return state;
	  }
	
	  // Checks text to see if it looks like a glob.
	  function isGlob (text) {
	    return text.indexOf('*') > -1;
	  }
	
	  // Returns true if glob matches current $state name.
	  function doesStateMatchGlob (glob) {
	    var globSegments = glob.split('.'),
	        segments = $state.$current.name.split('.');
	
	    //match single stars
	    for (var i = 0, l = globSegments.length; i < l; i++) {
	      if (globSegments[i] === '*') {
	        segments[i] = '*';
	      }
	    }
	
	    //match greedy starts
	    if (globSegments[0] === '**') {
	       segments = segments.slice(indexOf(segments, globSegments[1]));
	       segments.unshift('**');
	    }
	    //match greedy ends
	    if (globSegments[globSegments.length - 1] === '**') {
	       segments.splice(indexOf(segments, globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
	       segments.push('**');
	    }
	
	    if (globSegments.length != segments.length) {
	      return false;
	    }
	
	    return segments.join('') === globSegments.join('');
	  }
	
	
	  // Implicit root state that is always active
	  root = registerState({
	    name: '',
	    url: '^',
	    views: null,
	    'abstract': true
	  });
	  root.navigable = null;
	
	
	  /**
	   * @ngdoc function
	   * @name ui.router.state.$stateProvider#decorator
	   * @methodOf ui.router.state.$stateProvider
	   *
	   * @description
	   * Allows you to extend (carefully) or override (at your own peril) the 
	   * `stateBuilder` object used internally by `$stateProvider`. This can be used 
	   * to add custom functionality to ui-router, for example inferring templateUrl 
	   * based on the state name.
	   *
	   * When passing only a name, it returns the current (original or decorated) builder
	   * function that matches `name`.
	   *
	   * The builder functions that can be decorated are listed below. Though not all
	   * necessarily have a good use case for decoration, that is up to you to decide.
	   *
	   * In addition, users can attach custom decorators, which will generate new 
	   * properties within the state's internal definition. There is currently no clear 
	   * use-case for this beyond accessing internal states (i.e. $state.$current), 
	   * however, expect this to become increasingly relevant as we introduce additional 
	   * meta-programming features.
	   *
	   * **Warning**: Decorators should not be interdependent because the order of 
	   * execution of the builder functions in non-deterministic. Builder functions 
	   * should only be dependent on the state definition object and super function.
	   *
	   *
	   * Existing builder functions and current return values:
	   *
	   * - **parent** `{object}` - returns the parent state object.
	   * - **data** `{object}` - returns state data, including any inherited data that is not
	   *   overridden by own values (if any).
	   * - **url** `{object}` - returns a {@link ui.router.util.type:UrlMatcher UrlMatcher}
	   *   or `null`.
	   * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is 
	   *   navigable).
	   * - **params** `{object}` - returns an array of state params that are ensured to 
	   *   be a super-set of parent's params.
	   * - **views** `{object}` - returns a views object where each key is an absolute view 
	   *   name (i.e. "viewName@stateName") and each value is the config object 
	   *   (template, controller) for the view. Even when you don't use the views object 
	   *   explicitly on a state config, one is still created for you internally.
	   *   So by decorating this builder function you have access to decorating template 
	   *   and controller properties.
	   * - **ownParams** `{object}` - returns an array of params that belong to the state, 
	   *   not including any params defined by ancestor states.
	   * - **path** `{string}` - returns the full path from the root down to this state. 
	   *   Needed for state activation.
	   * - **includes** `{object}` - returns an object that includes every state that 
	   *   would pass a `$state.includes()` test.
	   *
	   * @example
	   * <pre>
	   * // Override the internal 'views' builder with a function that takes the state
	   * // definition, and a reference to the internal function being overridden:
	   * $stateProvider.decorator('views', function (state, parent) {
	   *   var result = {},
	   *       views = parent(state);
	   *
	   *   angular.forEach(views, function (config, name) {
	   *     var autoName = (state.name + '.' + name).replace('.', '/');
	   *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
	   *     result[name] = config;
	   *   });
	   *   return result;
	   * });
	   *
	   * $stateProvider.state('home', {
	   *   views: {
	   *     'contact.list': { controller: 'ListController' },
	   *     'contact.item': { controller: 'ItemController' }
	   *   }
	   * });
	   *
	   * // ...
	   *
	   * $state.go('home');
	   * // Auto-populates list and item views with /partials/home/contact/list.html,
	   * // and /partials/home/contact/item.html, respectively.
	   * </pre>
	   *
	   * @param {string} name The name of the builder function to decorate. 
	   * @param {object} func A function that is responsible for decorating the original 
	   * builder function. The function receives two parameters:
	   *
	   *   - `{object}` - state - The state config object.
	   *   - `{object}` - super - The original builder function.
	   *
	   * @return {object} $stateProvider - $stateProvider instance
	   */
	  this.decorator = decorator;
	  function decorator(name, func) {
	    /*jshint validthis: true */
	    if (isString(name) && !isDefined(func)) {
	      return stateBuilder[name];
	    }
	    if (!isFunction(func) || !isString(name)) {
	      return this;
	    }
	    if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
	      stateBuilder.$delegates[name] = stateBuilder[name];
	    }
	    stateBuilder[name] = func;
	    return this;
	  }
	
	  /**
	   * @ngdoc function
	   * @name ui.router.state.$stateProvider#state
	   * @methodOf ui.router.state.$stateProvider
	   *
	   * @description
	   * Registers a state configuration under a given state name. The stateConfig object
	   * has the following acceptable properties.
	   *
	   * @param {string} name A unique state name, e.g. "home", "about", "contacts".
	   * To create a parent/child state use a dot, e.g. "about.sales", "home.newest".
	   * @param {object} stateConfig State configuration object.
	   * @param {string|function=} stateConfig.template
	   * <a id='template'></a>
	   *   html template as a string or a function that returns
	   *   an html template as a string which should be used by the uiView directives. This property 
	   *   takes precedence over templateUrl.
	   *   
	   *   If `template` is a function, it will be called with the following parameters:
	   *
	   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by
	   *     applying the current state
	   *
	   * <pre>template:
	   *   "<h1>inline template definition</h1>" +
	   *   "<div ui-view></div>"</pre>
	   * <pre>template: function(params) {
	   *       return "<h1>generated template</h1>"; }</pre>
	   * </div>
	   *
	   * @param {string|function=} stateConfig.templateUrl
	   * <a id='templateUrl'></a>
	   *
	   *   path or function that returns a path to an html
	   *   template that should be used by uiView.
	   *   
	   *   If `templateUrl` is a function, it will be called with the following parameters:
	   *
	   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by 
	   *     applying the current state
	   *
	   * <pre>templateUrl: "home.html"</pre>
	   * <pre>templateUrl: function(params) {
	   *     return myTemplates[params.pageId]; }</pre>
	   *
	   * @param {function=} stateConfig.templateProvider
	   * <a id='templateProvider'></a>
	   *    Provider function that returns HTML content string.
	   * <pre> templateProvider:
	   *       function(MyTemplateService, params) {
	   *         return MyTemplateService.getTemplate(params.pageId);
	   *       }</pre>
	   *
	   * @param {string|function=} stateConfig.controller
	   * <a id='controller'></a>
	   *
	   *  Controller fn that should be associated with newly
	   *   related scope or the name of a registered controller if passed as a string.
	   *   Optionally, the ControllerAs may be declared here.
	   * <pre>controller: "MyRegisteredController"</pre>
	   * <pre>controller:
	   *     "MyRegisteredController as fooCtrl"}</pre>
	   * <pre>controller: function($scope, MyService) {
	   *     $scope.data = MyService.getData(); }</pre>
	   *
	   * @param {function=} stateConfig.controllerProvider
	   * <a id='controllerProvider'></a>
	   *
	   * Injectable provider function that returns the actual controller or string.
	   * <pre>controllerProvider:
	   *   function(MyResolveData) {
	   *     if (MyResolveData.foo)
	   *       return "FooCtrl"
	   *     else if (MyResolveData.bar)
	   *       return "BarCtrl";
	   *     else return function($scope) {
	   *       $scope.baz = "Qux";
	   *     }
	   *   }</pre>
	   *
	   * @param {string=} stateConfig.controllerAs
	   * <a id='controllerAs'></a>
	   * 
	   * A controller alias name. If present the controller will be
	   *   published to scope under the controllerAs name.
	   * <pre>controllerAs: "myCtrl"</pre>
	   *
	   * @param {string|object=} stateConfig.parent
	   * <a id='parent'></a>
	   * Optionally specifies the parent state of this state.
	   *
	   * <pre>parent: 'parentState'</pre>
	   * <pre>parent: parentState // JS variable</pre>
	   *
	   * @param {object=} stateConfig.resolve
	   * <a id='resolve'></a>
	   *
	   * An optional map&lt;string, function&gt; of dependencies which
	   *   should be injected into the controller. If any of these dependencies are promises, 
	   *   the router will wait for them all to be resolved before the controller is instantiated.
	   *   If all the promises are resolved successfully, the $stateChangeSuccess event is fired
	   *   and the values of the resolved promises are injected into any controllers that reference them.
	   *   If any  of the promises are rejected the $stateChangeError event is fired.
	   *
	   *   The map object is:
	   *   
	   *   - key - {string}: name of dependency to be injected into controller
	   *   - factory - {string|function}: If string then it is alias for service. Otherwise if function, 
	   *     it is injected and return value it treated as dependency. If result is a promise, it is 
	   *     resolved before its value is injected into controller.
	   *
	   * <pre>resolve: {
	   *     myResolve1:
	   *       function($http, $stateParams) {
	   *         return $http.get("/api/foos/"+stateParams.fooID);
	   *       }
	   *     }</pre>
	   *
	   * @param {string=} stateConfig.url
	   * <a id='url'></a>
	   *
	   *   A url fragment with optional parameters. When a state is navigated or
	   *   transitioned to, the `$stateParams` service will be populated with any 
	   *   parameters that were passed.
	   *
	   *   (See {@link ui.router.util.type:UrlMatcher UrlMatcher} `UrlMatcher`} for
	   *   more details on acceptable patterns )
	   *
	   * examples:
	   * <pre>url: "/home"
	   * url: "/users/:userid"
	   * url: "/books/{bookid:[a-zA-Z_-]}"
	   * url: "/books/{categoryid:int}"
	   * url: "/books/{publishername:string}/{categoryid:int}"
	   * url: "/messages?before&after"
	   * url: "/messages?{before:date}&{after:date}"
	   * url: "/messages/:mailboxid?{before:date}&{after:date}"
	   * </pre>
	   *
	   * @param {object=} stateConfig.views
	   * <a id='views'></a>
	   * an optional map&lt;string, object&gt; which defined multiple views, or targets views
	   * manually/explicitly.
	   *
	   * Examples:
	   *
	   * Targets three named `ui-view`s in the parent state's template
	   * <pre>views: {
	   *     header: {
	   *       controller: "headerCtrl",
	   *       templateUrl: "header.html"
	   *     }, body: {
	   *       controller: "bodyCtrl",
	   *       templateUrl: "body.html"
	   *     }, footer: {
	   *       controller: "footCtrl",
	   *       templateUrl: "footer.html"
	   *     }
	   *   }</pre>
	   *
	   * Targets named `ui-view="header"` from grandparent state 'top''s template, and named `ui-view="body" from parent state's template.
	   * <pre>views: {
	   *     'header@top': {
	   *       controller: "msgHeaderCtrl",
	   *       templateUrl: "msgHeader.html"
	   *     }, 'body': {
	   *       controller: "messagesCtrl",
	   *       templateUrl: "messages.html"
	   *     }
	   *   }</pre>
	   *
	   * @param {boolean=} [stateConfig.abstract=false]
	   * <a id='abstract'></a>
	   * An abstract state will never be directly activated,
	   *   but can provide inherited properties to its common children states.
	   * <pre>abstract: true</pre>
	   *
	   * @param {function=} stateConfig.onEnter
	   * <a id='onEnter'></a>
	   *
	   * Callback function for when a state is entered. Good way
	   *   to trigger an action or dispatch an event, such as opening a dialog.
	   * If minifying your scripts, make sure to explicitly annotate this function,
	   * because it won't be automatically annotated by your build tools.
	   *
	   * <pre>onEnter: function(MyService, $stateParams) {
	   *     MyService.foo($stateParams.myParam);
	   * }</pre>
	   *
	   * @param {function=} stateConfig.onExit
	   * <a id='onExit'></a>
	   *
	   * Callback function for when a state is exited. Good way to
	   *   trigger an action or dispatch an event, such as opening a dialog.
	   * If minifying your scripts, make sure to explicitly annotate this function,
	   * because it won't be automatically annotated by your build tools.
	   *
	   * <pre>onExit: function(MyService, $stateParams) {
	   *     MyService.cleanup($stateParams.myParam);
	   * }</pre>
	   *
	   * @param {boolean=} [stateConfig.reloadOnSearch=true]
	   * <a id='reloadOnSearch'></a>
	   *
	   * If `false`, will not retrigger the same state
	   *   just because a search/query parameter has changed (via $location.search() or $location.hash()). 
	   *   Useful for when you'd like to modify $location.search() without triggering a reload.
	   * <pre>reloadOnSearch: false</pre>
	   *
	   * @param {object=} stateConfig.data
	   * <a id='data'></a>
	   *
	   * Arbitrary data object, useful for custom configuration.  The parent state's `data` is
	   *   prototypally inherited.  In other words, adding a data property to a state adds it to
	   *   the entire subtree via prototypal inheritance.
	   *
	   * <pre>data: {
	   *     requiredRole: 'foo'
	   * } </pre>
	   *
	   * @param {object=} stateConfig.params
	   * <a id='params'></a>
	   *
	   * A map which optionally configures parameters declared in the `url`, or
	   *   defines additional non-url parameters.  For each parameter being
	   *   configured, add a configuration object keyed to the name of the parameter.
	   *
	   *   Each parameter configuration object may contain the following properties:
	   *
	   *   - ** value ** - {object|function=}: specifies the default value for this
	   *     parameter.  This implicitly sets this parameter as optional.
	   *
	   *     When UI-Router routes to a state and no value is
	   *     specified for this parameter in the URL or transition, the
	   *     default value will be used instead.  If `value` is a function,
	   *     it will be injected and invoked, and the return value used.
	   *
	   *     *Note*: `undefined` is treated as "no default value" while `null`
	   *     is treated as "the default value is `null`".
	   *
	   *     *Shorthand*: If you only need to configure the default value of the
	   *     parameter, you may use a shorthand syntax.   In the **`params`**
	   *     map, instead mapping the param name to a full parameter configuration
	   *     object, simply set map it to the default parameter value, e.g.:
	   *
	   * <pre>// define a parameter's default value
	   * params: {
	   *     param1: { value: "defaultValue" }
	   * }
	   * // shorthand default values
	   * params: {
	   *     param1: "defaultValue",
	   *     param2: "param2Default"
	   * }</pre>
	   *
	   *   - ** array ** - {boolean=}: *(default: false)* If true, the param value will be
	   *     treated as an array of values.  If you specified a Type, the value will be
	   *     treated as an array of the specified Type.  Note: query parameter values
	   *     default to a special `"auto"` mode.
	   *
	   *     For query parameters in `"auto"` mode, if multiple  values for a single parameter
	   *     are present in the URL (e.g.: `/foo?bar=1&bar=2&bar=3`) then the values
	   *     are mapped to an array (e.g.: `{ foo: [ '1', '2', '3' ] }`).  However, if
	   *     only one value is present (e.g.: `/foo?bar=1`) then the value is treated as single
	   *     value (e.g.: `{ foo: '1' }`).
	   *
	   * <pre>params: {
	   *     param1: { array: true }
	   * }</pre>
	   *
	   *   - ** squash ** - {bool|string=}: `squash` configures how a default parameter value is represented in the URL when
	   *     the current parameter value is the same as the default value. If `squash` is not set, it uses the
	   *     configured default squash policy.
	   *     (See {@link ui.router.util.$urlMatcherFactory#methods_defaultSquashPolicy `defaultSquashPolicy()`})
	   *
	   *   There are three squash settings:
	   *
	   *     - false: The parameter's default value is not squashed.  It is encoded and included in the URL
	   *     - true: The parameter's default value is omitted from the URL.  If the parameter is preceeded and followed
	   *       by slashes in the state's `url` declaration, then one of those slashes are omitted.
	   *       This can allow for cleaner looking URLs.
	   *     - `"<arbitrary string>"`: The parameter's default value is replaced with an arbitrary placeholder of  your choice.
	   *
	   * <pre>params: {
	   *     param1: {
	   *       value: "defaultId",
	   *       squash: true
	   * } }
	   * // squash "defaultValue" to "~"
	   * params: {
	   *     param1: {
	   *       value: "defaultValue",
	   *       squash: "~"
	   * } }
	   * </pre>
	   *
	   *
	   * @example
	   * <pre>
	   * // Some state name examples
	   *
	   * // stateName can be a single top-level name (must be unique).
	   * $stateProvider.state("home", {});
	   *
	   * // Or it can be a nested state name. This state is a child of the
	   * // above "home" state.
	   * $stateProvider.state("home.newest", {});
	   *
	   * // Nest states as deeply as needed.
	   * $stateProvider.state("home.newest.abc.xyz.inception", {});
	   *
	   * // state() returns $stateProvider, so you can chain state declarations.
	   * $stateProvider
	   *   .state("home", {})
	   *   .state("about", {})
	   *   .state("contacts", {});
	   * </pre>
	   *
	   */
	  this.state = state;
	  function state(name, definition) {
	    /*jshint validthis: true */
	    if (isObject(name)) definition = name;
	    else definition.name = name;
	    registerState(definition);
	    return this;
	  }
	
	  /**
	   * @ngdoc object
	   * @name ui.router.state.$state
	   *
	   * @requires $rootScope
	   * @requires $q
	   * @requires ui.router.state.$view
	   * @requires $injector
	   * @requires ui.router.util.$resolve
	   * @requires ui.router.state.$stateParams
	   * @requires ui.router.router.$urlRouter
	   *
	   * @property {object} params A param object, e.g. {sectionId: section.id)}, that 
	   * you'd like to test against the current active state.
	   * @property {object} current A reference to the state's config object. However 
	   * you passed it in. Useful for accessing custom data.
	   * @property {object} transition Currently pending transition. A promise that'll 
	   * resolve or reject.
	   *
	   * @description
	   * `$state` service is responsible for representing states as well as transitioning
	   * between them. It also provides interfaces to ask for current state or even states
	   * you're coming from.
	   */
	  this.$get = $get;
	  $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$urlRouter', '$location', '$urlMatcherFactory'];
	  function $get(   $rootScope,   $q,   $view,   $injector,   $resolve,   $stateParams,   $urlRouter,   $location,   $urlMatcherFactory) {
	
	    var TransitionSuperseded = $q.reject(new Error('transition superseded'));
	    var TransitionPrevented = $q.reject(new Error('transition prevented'));
	    var TransitionAborted = $q.reject(new Error('transition aborted'));
	    var TransitionFailed = $q.reject(new Error('transition failed'));
	
	    // Handles the case where a state which is the target of a transition is not found, and the user
	    // can optionally retry or defer the transition
	    function handleRedirect(redirect, state, params, options) {
	      /**
	       * @ngdoc event
	       * @name ui.router.state.$state#$stateNotFound
	       * @eventOf ui.router.state.$state
	       * @eventType broadcast on root scope
	       * @description
	       * Fired when a requested state **cannot be found** using the provided state name during transition.
	       * The event is broadcast allowing any handlers a single chance to deal with the error (usually by
	       * lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler,
	       * you can see its three properties in the example. You can use `event.preventDefault()` to abort the
	       * transition and the promise returned from `go` will be rejected with a `'transition aborted'` value.
	       *
	       * @param {Object} event Event object.
	       * @param {Object} unfoundState Unfound State information. Contains: `to, toParams, options` properties.
	       * @param {State} fromState Current state object.
	       * @param {Object} fromParams Current state params.
	       *
	       * @example
	       *
	       * <pre>
	       * // somewhere, assume lazy.state has not been defined
	       * $state.go("lazy.state", {a:1, b:2}, {inherit:false});
	       *
	       * // somewhere else
	       * $scope.$on('$stateNotFound',
	       * function(event, unfoundState, fromState, fromParams){
	       *     console.log(unfoundState.to); // "lazy.state"
	       *     console.log(unfoundState.toParams); // {a:1, b:2}
	       *     console.log(unfoundState.options); // {inherit:false} + default options
	       * })
	       * </pre>
	       */
	      var evt = $rootScope.$broadcast('$stateNotFound', redirect, state, params);
	
	      if (evt.defaultPrevented) {
	        $urlRouter.update();
	        return TransitionAborted;
	      }
	
	      if (!evt.retry) {
	        return null;
	      }
	
	      // Allow the handler to return a promise to defer state lookup retry
	      if (options.$retry) {
	        $urlRouter.update();
	        return TransitionFailed;
	      }
	      var retryTransition = $state.transition = $q.when(evt.retry);
	
	      retryTransition.then(function() {
	        if (retryTransition !== $state.transition) return TransitionSuperseded;
	        redirect.options.$retry = true;
	        return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
	      }, function() {
	        return TransitionAborted;
	      });
	      $urlRouter.update();
	
	      return retryTransition;
	    }
	
	    root.locals = { resolve: null, globals: { $stateParams: {} } };
	
	    $state = {
	      params: {},
	      current: root.self,
	      $current: root,
	      transition: null
	    };
	
	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#reload
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * A method that force reloads the current state. All resolves are re-resolved,
	     * controllers reinstantiated, and events re-fired.
	     *
	     * @example
	     * <pre>
	     * var app angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.reload = function(){
	     *     $state.reload();
	     *   }
	     * });
	     * </pre>
	     *
	     * `reload()` is just an alias for:
	     * <pre>
	     * $state.transitionTo($state.current, $stateParams, { 
	     *   reload: true, inherit: false, notify: true
	     * });
	     * </pre>
	     *
	     * @param {string=|object=} state - A state name or a state object, which is the root of the resolves to be re-resolved.
	     * @example
	     * <pre>
	     * //assuming app application consists of 3 states: 'contacts', 'contacts.detail', 'contacts.detail.item' 
	     * //and current state is 'contacts.detail.item'
	     * var app angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.reload = function(){
	     *     //will reload 'contact.detail' and 'contact.detail.item' states
	     *     $state.reload('contact.detail');
	     *   }
	     * });
	     * </pre>
	     *
	     * `reload()` is just an alias for:
	     * <pre>
	     * $state.transitionTo($state.current, $stateParams, { 
	     *   reload: true, inherit: false, notify: true
	     * });
	     * </pre>
	
	     * @returns {promise} A promise representing the state of the new transition. See
	     * {@link ui.router.state.$state#methods_go $state.go}.
	     */
	    $state.reload = function reload(state) {
	      return $state.transitionTo($state.current, $stateParams, { reload: state || true, inherit: false, notify: true});
	    };
	
	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#go
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Convenience method for transitioning to a new state. `$state.go` calls 
	     * `$state.transitionTo` internally but automatically sets options to 
	     * `{ location: true, inherit: true, relative: $state.$current, notify: true }`. 
	     * This allows you to easily use an absolute or relative to path and specify 
	     * only the parameters you'd like to update (while letting unspecified parameters 
	     * inherit from the currently active ancestor states).
	     *
	     * @example
	     * <pre>
	     * var app = angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.changeState = function () {
	     *     $state.go('contact.detail');
	     *   };
	     * });
	     * </pre>
	     * <img src='../ngdoc_assets/StateGoExamples.png'/>
	     *
	     * @param {string} to Absolute state name or relative state path. Some examples:
	     *
	     * - `$state.go('contact.detail')` - will go to the `contact.detail` state
	     * - `$state.go('^')` - will go to a parent state
	     * - `$state.go('^.sibling')` - will go to a sibling state
	     * - `$state.go('.child.grandchild')` - will go to grandchild state
	     *
	     * @param {object=} params A map of the parameters that will be sent to the state, 
	     * will populate $stateParams. Any parameters that are not specified will be inherited from currently 
	     * defined parameters. Only parameters specified in the state definition can be overridden, new 
	     * parameters will be ignored. This allows, for example, going to a sibling state that shares parameters
	     * specified in a parent state. Parameter inheritance only works between common ancestor states, I.e.
	     * transitioning to a sibling will get you the parameters for all parents, transitioning to a child
	     * will get you all current parameters, etc.
	     * @param {object=} options Options object. The options are:
	     *
	     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
	     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
	     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
	     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
	     *    defines which state to be relative from.
	     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
	     * - **`reload`** (v0.2.5) - {boolean=false|string|object}, If `true` will force transition even if no state or params
	     *    have changed.  It will reload the resolves and views of the current state and parent states.
	     *    If `reload` is a string (or state object), the state object is fetched (by name, or object reference); and \
	     *    the transition reloads the resolves and views for that matched state, and all its children states.
	     *
	     * @returns {promise} A promise representing the state of the new transition.
	     *
	     * Possible success values:
	     *
	     * - $state.current
	     *
	     * <br/>Possible rejection values:
	     *
	     * - 'transition superseded' - when a newer transition has been started after this one
	     * - 'transition prevented' - when `event.preventDefault()` has been called in a `$stateChangeStart` listener
	     * - 'transition aborted' - when `event.preventDefault()` has been called in a `$stateNotFound` listener or
	     *   when a `$stateNotFound` `event.retry` promise errors.
	     * - 'transition failed' - when a state has been unsuccessfully found after 2 tries.
	     * - *resolve error* - when an error has occurred with a `resolve`
	     *
	     */
	    $state.go = function go(to, params, options) {
	      return $state.transitionTo(to, params, extend({ inherit: true, relative: $state.$current }, options));
	    };
	
	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#transitionTo
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Low-level method for transitioning to a new state. {@link ui.router.state.$state#methods_go $state.go}
	     * uses `transitionTo` internally. `$state.go` is recommended in most situations.
	     *
	     * @example
	     * <pre>
	     * var app = angular.module('app', ['ui.router']);
	     *
	     * app.controller('ctrl', function ($scope, $state) {
	     *   $scope.changeState = function () {
	     *     $state.transitionTo('contact.detail');
	     *   };
	     * });
	     * </pre>
	     *
	     * @param {string} to State name.
	     * @param {object=} toParams A map of the parameters that will be sent to the state,
	     * will populate $stateParams.
	     * @param {object=} options Options object. The options are:
	     *
	     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
	     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
	     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
	     * - **`relative`** - {object=}, When transitioning with relative path (e.g '^'), 
	     *    defines which state to be relative from.
	     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
	     * - **`reload`** (v0.2.5) - {boolean=false|string=|object=}, If `true` will force transition even if the state or params 
	     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
	     *    use this when you want to force a reload when *everything* is the same, including search params.
	     *    if String, then will reload the state with the name given in reload, and any children.
	     *    if Object, then a stateObj is expected, will reload the state found in stateObj, and any children.
	     *
	     * @returns {promise} A promise representing the state of the new transition. See
	     * {@link ui.router.state.$state#methods_go $state.go}.
	     */
	    $state.transitionTo = function transitionTo(to, toParams, options) {
	      toParams = toParams || {};
	      options = extend({
	        location: true, inherit: false, relative: null, notify: true, reload: false, $retry: false
	      }, options || {});
	
	      var from = $state.$current, fromParams = $state.params, fromPath = from.path;
	      var evt, toState = findState(to, options.relative);
	
	      // Store the hash param for later (since it will be stripped out by various methods)
	      var hash = toParams['#'];
	
	      if (!isDefined(toState)) {
	        var redirect = { to: to, toParams: toParams, options: options };
	        var redirectResult = handleRedirect(redirect, from.self, fromParams, options);
	
	        if (redirectResult) {
	          return redirectResult;
	        }
	
	        // Always retry once if the $stateNotFound was not prevented
	        // (handles either redirect changed or state lazy-definition)
	        to = redirect.to;
	        toParams = redirect.toParams;
	        options = redirect.options;
	        toState = findState(to, options.relative);
	
	        if (!isDefined(toState)) {
	          if (!options.relative) throw new Error("No such state '" + to + "'");
	          throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
	        }
	      }
	      if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
	      if (options.inherit) toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
	      if (!toState.params.$$validates(toParams)) return TransitionFailed;
	
	      toParams = toState.params.$$values(toParams);
	      to = toState;
	
	      var toPath = to.path;
	
	      // Starting from the root of the path, keep all levels that haven't changed
	      var keep = 0, state = toPath[keep], locals = root.locals, toLocals = [];
	
	      if (!options.reload) {
	        while (state && state === fromPath[keep] && state.ownParams.$$equals(toParams, fromParams)) {
	          locals = toLocals[keep] = state.locals;
	          keep++;
	          state = toPath[keep];
	        }
	      } else if (isString(options.reload) || isObject(options.reload)) {
	        if (isObject(options.reload) && !options.reload.name) {
	          throw new Error('Invalid reload state object');
	        }
	        
	        var reloadState = options.reload === true ? fromPath[0] : findState(options.reload);
	        if (options.reload && !reloadState) {
	          throw new Error("No such reload state '" + (isString(options.reload) ? options.reload : options.reload.name) + "'");
	        }
	
	        while (state && state === fromPath[keep] && state !== reloadState) {
	          locals = toLocals[keep] = state.locals;
	          keep++;
	          state = toPath[keep];
	        }
	      }
	
	      // If we're going to the same state and all locals are kept, we've got nothing to do.
	      // But clear 'transition', as we still want to cancel any other pending transitions.
	      // TODO: We may not want to bump 'transition' if we're called from a location change
	      // that we've initiated ourselves, because we might accidentally abort a legitimate
	      // transition initiated from code?
	      if (shouldSkipReload(to, toParams, from, fromParams, locals, options)) {
	        if (hash) toParams['#'] = hash;
	        $state.params = toParams;
	        copy($state.params, $stateParams);
	        copy(filterByKeys(to.params.$$keys(), $stateParams), to.locals.globals.$stateParams);
	        if (options.location && to.navigable && to.navigable.url) {
	          $urlRouter.push(to.navigable.url, toParams, {
	            $$avoidResync: true, replace: options.location === 'replace'
	          });
	          $urlRouter.update(true);
	        }
	        $state.transition = null;
	        return $q.when($state.current);
	      }
	
	      // Filter parameters before we pass them to event handlers etc.
	      toParams = filterByKeys(to.params.$$keys(), toParams || {});
	      
	      // Re-add the saved hash before we start returning things or broadcasting $stateChangeStart
	      if (hash) toParams['#'] = hash;
	      
	      // Broadcast start event and cancel the transition if requested
	      if (options.notify) {
	        /**
	         * @ngdoc event
	         * @name ui.router.state.$state#$stateChangeStart
	         * @eventOf ui.router.state.$state
	         * @eventType broadcast on root scope
	         * @description
	         * Fired when the state transition **begins**. You can use `event.preventDefault()`
	         * to prevent the transition from happening and then the transition promise will be
	         * rejected with a `'transition prevented'` value.
	         *
	         * @param {Object} event Event object.
	         * @param {State} toState The state being transitioned to.
	         * @param {Object} toParams The params supplied to the `toState`.
	         * @param {State} fromState The current state, pre-transition.
	         * @param {Object} fromParams The params supplied to the `fromState`.
	         *
	         * @example
	         *
	         * <pre>
	         * $rootScope.$on('$stateChangeStart',
	         * function(event, toState, toParams, fromState, fromParams){
	         *     event.preventDefault();
	         *     // transitionTo() promise will be rejected with
	         *     // a 'transition prevented' error
	         * })
	         * </pre>
	         */
	        if ($rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams, options).defaultPrevented) {
	          $rootScope.$broadcast('$stateChangeCancel', to.self, toParams, from.self, fromParams);
	          //Don't update and resync url if there's been a new transition started. see issue #2238, #600
	          if ($state.transition == null) $urlRouter.update();
	          return TransitionPrevented;
	        }
	      }
	
	      // Resolve locals for the remaining states, but don't update any global state just
	      // yet -- if anything fails to resolve the current state needs to remain untouched.
	      // We also set up an inheritance chain for the locals here. This allows the view directive
	      // to quickly look up the correct definition for each view in the current state. Even
	      // though we create the locals object itself outside resolveState(), it is initially
	      // empty and gets filled asynchronously. We need to keep track of the promise for the
	      // (fully resolved) current locals, and pass this down the chain.
	      var resolved = $q.when(locals);
	
	      for (var l = keep; l < toPath.length; l++, state = toPath[l]) {
	        locals = toLocals[l] = inherit(locals);
	        resolved = resolveState(state, toParams, state === to, resolved, locals, options);
	      }
	
	      // Once everything is resolved, we are ready to perform the actual transition
	      // and return a promise for the new state. We also keep track of what the
	      // current promise is, so that we can detect overlapping transitions and
	      // keep only the outcome of the last transition.
	      var transition = $state.transition = resolved.then(function () {
	        var l, entering, exiting;
	
	        if ($state.transition !== transition) return TransitionSuperseded;
	
	        // Exit 'from' states not kept
	        for (l = fromPath.length - 1; l >= keep; l--) {
	          exiting = fromPath[l];
	          if (exiting.self.onExit) {
	            $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
	          }
	          exiting.locals = null;
	        }
	
	        // Enter 'to' states not kept
	        for (l = keep; l < toPath.length; l++) {
	          entering = toPath[l];
	          entering.locals = toLocals[l];
	          if (entering.self.onEnter) {
	            $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
	          }
	        }
	
	        // Run it again, to catch any transitions in callbacks
	        if ($state.transition !== transition) return TransitionSuperseded;
	
	        // Update globals in $state
	        $state.$current = to;
	        $state.current = to.self;
	        $state.params = toParams;
	        copy($state.params, $stateParams);
	        $state.transition = null;
	
	        if (options.location && to.navigable) {
	          $urlRouter.push(to.navigable.url, to.navigable.locals.globals.$stateParams, {
	            $$avoidResync: true, replace: options.location === 'replace'
	          });
	        }
	
	        if (options.notify) {
	        /**
	         * @ngdoc event
	         * @name ui.router.state.$state#$stateChangeSuccess
	         * @eventOf ui.router.state.$state
	         * @eventType broadcast on root scope
	         * @description
	         * Fired once the state transition is **complete**.
	         *
	         * @param {Object} event Event object.
	         * @param {State} toState The state being transitioned to.
	         * @param {Object} toParams The params supplied to the `toState`.
	         * @param {State} fromState The current state, pre-transition.
	         * @param {Object} fromParams The params supplied to the `fromState`.
	         */
	          $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
	        }
	        $urlRouter.update(true);
	
	        return $state.current;
	      }).then(null, function (error) {
	        if ($state.transition !== transition) return TransitionSuperseded;
	
	        $state.transition = null;
	        /**
	         * @ngdoc event
	         * @name ui.router.state.$state#$stateChangeError
	         * @eventOf ui.router.state.$state
	         * @eventType broadcast on root scope
	         * @description
	         * Fired when an **error occurs** during transition. It's important to note that if you
	         * have any errors in your resolve functions (javascript errors, non-existent services, etc)
	         * they will not throw traditionally. You must listen for this $stateChangeError event to
	         * catch **ALL** errors.
	         *
	         * @param {Object} event Event object.
	         * @param {State} toState The state being transitioned to.
	         * @param {Object} toParams The params supplied to the `toState`.
	         * @param {State} fromState The current state, pre-transition.
	         * @param {Object} fromParams The params supplied to the `fromState`.
	         * @param {Error} error The resolve error object.
	         */
	        evt = $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);
	
	        if (!evt.defaultPrevented) {
	            $urlRouter.update();
	        }
	
	        return $q.reject(error);
	      });
	
	      return transition;
	    };
	
	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#is
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Similar to {@link ui.router.state.$state#methods_includes $state.includes},
	     * but only checks for the full state name. If params is supplied then it will be
	     * tested for strict equality against the current active params object, so all params
	     * must match with none missing and no extras.
	     *
	     * @example
	     * <pre>
	     * $state.$current.name = 'contacts.details.item';
	     *
	     * // absolute name
	     * $state.is('contact.details.item'); // returns true
	     * $state.is(contactDetailItemStateObject); // returns true
	     *
	     * // relative name (. and ^), typically from a template
	     * // E.g. from the 'contacts.details' template
	     * <div ng-class="{highlighted: $state.is('.item')}">Item</div>
	     * </pre>
	     *
	     * @param {string|object} stateOrName The state name (absolute or relative) or state object you'd like to check.
	     * @param {object=} params A param object, e.g. `{sectionId: section.id}`, that you'd like
	     * to test against the current active state.
	     * @param {object=} options An options object.  The options are:
	     *
	     * - **`relative`** - {string|object} -  If `stateOrName` is a relative state name and `options.relative` is set, .is will
	     * test relative to `options.relative` state (or name).
	     *
	     * @returns {boolean} Returns true if it is the state.
	     */
	    $state.is = function is(stateOrName, params, options) {
	      options = extend({ relative: $state.$current }, options || {});
	      var state = findState(stateOrName, options.relative);
	
	      if (!isDefined(state)) { return undefined; }
	      if ($state.$current !== state) { return false; }
	      return params ? equalForKeys(state.params.$$values(params), $stateParams) : true;
	    };
	
	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#includes
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * A method to determine if the current active state is equal to or is the child of the
	     * state stateName. If any params are passed then they will be tested for a match as well.
	     * Not all the parameters need to be passed, just the ones you'd like to test for equality.
	     *
	     * @example
	     * Partial and relative names
	     * <pre>
	     * $state.$current.name = 'contacts.details.item';
	     *
	     * // Using partial names
	     * $state.includes("contacts"); // returns true
	     * $state.includes("contacts.details"); // returns true
	     * $state.includes("contacts.details.item"); // returns true
	     * $state.includes("contacts.list"); // returns false
	     * $state.includes("about"); // returns false
	     *
	     * // Using relative names (. and ^), typically from a template
	     * // E.g. from the 'contacts.details' template
	     * <div ng-class="{highlighted: $state.includes('.item')}">Item</div>
	     * </pre>
	     *
	     * Basic globbing patterns
	     * <pre>
	     * $state.$current.name = 'contacts.details.item.url';
	     *
	     * $state.includes("*.details.*.*"); // returns true
	     * $state.includes("*.details.**"); // returns true
	     * $state.includes("**.item.**"); // returns true
	     * $state.includes("*.details.item.url"); // returns true
	     * $state.includes("*.details.*.url"); // returns true
	     * $state.includes("*.details.*"); // returns false
	     * $state.includes("item.**"); // returns false
	     * </pre>
	     *
	     * @param {string} stateOrName A partial name, relative name, or glob pattern
	     * to be searched for within the current state name.
	     * @param {object=} params A param object, e.g. `{sectionId: section.id}`,
	     * that you'd like to test against the current active state.
	     * @param {object=} options An options object.  The options are:
	     *
	     * - **`relative`** - {string|object=} -  If `stateOrName` is a relative state reference and `options.relative` is set,
	     * .includes will test relative to `options.relative` state (or name).
	     *
	     * @returns {boolean} Returns true if it does include the state
	     */
	    $state.includes = function includes(stateOrName, params, options) {
	      options = extend({ relative: $state.$current }, options || {});
	      if (isString(stateOrName) && isGlob(stateOrName)) {
	        if (!doesStateMatchGlob(stateOrName)) {
	          return false;
	        }
	        stateOrName = $state.$current.name;
	      }
	
	      var state = findState(stateOrName, options.relative);
	      if (!isDefined(state)) { return undefined; }
	      if (!isDefined($state.$current.includes[state.name])) { return false; }
	      return params ? equalForKeys(state.params.$$values(params), $stateParams, objectKeys(params)) : true;
	    };
	
	
	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#href
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * A url generation method that returns the compiled url for the given state populated with the given params.
	     *
	     * @example
	     * <pre>
	     * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
	     * </pre>
	     *
	     * @param {string|object} stateOrName The state name or state object you'd like to generate a url from.
	     * @param {object=} params An object of parameter values to fill the state's required parameters.
	     * @param {object=} options Options object. The options are:
	     *
	     * - **`lossy`** - {boolean=true} -  If true, and if there is no url associated with the state provided in the
	     *    first parameter, then the constructed href url will be built from the first navigable ancestor (aka
	     *    ancestor with a valid url).
	     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
	     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
	     *    defines which state to be relative from.
	     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
	     * 
	     * @returns {string} compiled state url
	     */
	    $state.href = function href(stateOrName, params, options) {
	      options = extend({
	        lossy:    true,
	        inherit:  true,
	        absolute: false,
	        relative: $state.$current
	      }, options || {});
	
	      var state = findState(stateOrName, options.relative);
	
	      if (!isDefined(state)) return null;
	      if (options.inherit) params = inheritParams($stateParams, params || {}, $state.$current, state);
	      
	      var nav = (state && options.lossy) ? state.navigable : state;
	
	      if (!nav || nav.url === undefined || nav.url === null) {
	        return null;
	      }
	      return $urlRouter.href(nav.url, filterByKeys(state.params.$$keys().concat('#'), params || {}), {
	        absolute: options.absolute
	      });
	    };
	
	    /**
	     * @ngdoc function
	     * @name ui.router.state.$state#get
	     * @methodOf ui.router.state.$state
	     *
	     * @description
	     * Returns the state configuration object for any specific state or all states.
	     *
	     * @param {string|object=} stateOrName (absolute or relative) If provided, will only get the config for
	     * the requested state. If not provided, returns an array of ALL state configs.
	     * @param {string|object=} context When stateOrName is a relative state reference, the state will be retrieved relative to context.
	     * @returns {Object|Array} State configuration object or array of all objects.
	     */
	    $state.get = function (stateOrName, context) {
	      if (arguments.length === 0) return map(objectKeys(states), function(name) { return states[name].self; });
	      var state = findState(stateOrName, context || $state.$current);
	      return (state && state.self) ? state.self : null;
	    };
	
	    function resolveState(state, params, paramsAreFiltered, inherited, dst, options) {
	      // Make a restricted $stateParams with only the parameters that apply to this state if
	      // necessary. In addition to being available to the controller and onEnter/onExit callbacks,
	      // we also need $stateParams to be available for any $injector calls we make during the
	      // dependency resolution process.
	      var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params.$$keys(), params);
	      var locals = { $stateParams: $stateParams };
	
	      // Resolve 'global' dependencies for the state, i.e. those not specific to a view.
	      // We're also including $stateParams in this; that way the parameters are restricted
	      // to the set that should be visible to the state, and are independent of when we update
	      // the global $state and $stateParams values.
	      dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
	      var promises = [dst.resolve.then(function (globals) {
	        dst.globals = globals;
	      })];
	      if (inherited) promises.push(inherited);
	
	      function resolveViews() {
	        var viewsPromises = [];
	
	        // Resolve template and dependencies for all views.
	        forEach(state.views, function (view, name) {
	          var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
	          injectables.$template = [ function () {
	            return $view.load(name, { view: view, locals: dst.globals, params: $stateParams, notify: options.notify }) || '';
	          }];
	
	          viewsPromises.push($resolve.resolve(injectables, dst.globals, dst.resolve, state).then(function (result) {
	            // References to the controller (only instantiated at link time)
	            if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
	              var injectLocals = angular.extend({}, injectables, dst.globals);
	              result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
	            } else {
	              result.$$controller = view.controller;
	            }
	            // Provide access to the state itself for internal use
	            result.$$state = state;
	            result.$$controllerAs = view.controllerAs;
	            result.$$resolveAs = view.resolveAs;
	            dst[name] = result;
	          }));
	        });
	
	        return $q.all(viewsPromises).then(function(){
	          return dst.globals;
	        });
	      }
	
	      // Wait for all the promises and then return the activation object
	      return $q.all(promises).then(resolveViews).then(function (values) {
	        return dst;
	      });
	    }
	
	    return $state;
	  }
	
	  function shouldSkipReload(to, toParams, from, fromParams, locals, options) {
	    // Return true if there are no differences in non-search (path/object) params, false if there are differences
	    function nonSearchParamsEqual(fromAndToState, fromParams, toParams) {
	      // Identify whether all the parameters that differ between `fromParams` and `toParams` were search params.
	      function notSearchParam(key) {
	        return fromAndToState.params[key].location != "search";
	      }
	      var nonQueryParamKeys = fromAndToState.params.$$keys().filter(notSearchParam);
	      var nonQueryParams = pick.apply({}, [fromAndToState.params].concat(nonQueryParamKeys));
	      var nonQueryParamSet = new $$UMFP.ParamSet(nonQueryParams);
	      return nonQueryParamSet.$$equals(fromParams, toParams);
	    }
	
	    // If reload was not explicitly requested
	    // and we're transitioning to the same state we're already in
	    // and    the locals didn't change
	    //     or they changed in a way that doesn't merit reloading
	    //        (reloadOnParams:false, or reloadOnSearch.false and only search params changed)
	    // Then return true.
	    if (!options.reload && to === from &&
	      (locals === from.locals || (to.self.reloadOnSearch === false && nonSearchParamsEqual(from, fromParams, toParams)))) {
	      return true;
	    }
	  }
	}
	
	angular.module('ui.router.state')
	  .factory('$stateParams', function () { return {}; })
	  .constant("$state.runtime", { autoinject: true })
	  .provider('$state', $StateProvider)
	  // Inject $state to initialize when entering runtime. #2574
	  .run(['$injector', function ($injector) {
	    // Allow tests (stateSpec.js) to turn this off by defining this constant
	    if ($injector.get("$state.runtime").autoinject) {
	      $injector.get('$state');
	    }
	  }]);
	
	
	$ViewProvider.$inject = [];
	function $ViewProvider() {
	
	  this.$get = $get;
	  /**
	   * @ngdoc object
	   * @name ui.router.state.$view
	   *
	   * @requires ui.router.util.$templateFactory
	   * @requires $rootScope
	   *
	   * @description
	   *
	   */
	  $get.$inject = ['$rootScope', '$templateFactory'];
	  function $get(   $rootScope,   $templateFactory) {
	    return {
	      // $view.load('full.viewName', { template: ..., controller: ..., resolve: ..., async: false, params: ... })
	      /**
	       * @ngdoc function
	       * @name ui.router.state.$view#load
	       * @methodOf ui.router.state.$view
	       *
	       * @description
	       *
	       * @param {string} name name
	       * @param {object} options option object.
	       */
	      load: function load(name, options) {
	        var result, defaults = {
	          template: null, controller: null, view: null, locals: null, notify: true, async: true, params: {}
	        };
	        options = extend(defaults, options);
	
	        if (options.view) {
	          result = $templateFactory.fromConfig(options.view, options.params, options.locals);
	        }
	        return result;
	      }
	    };
	  }
	}
	
	angular.module('ui.router.state').provider('$view', $ViewProvider);
	
	/**
	 * @ngdoc object
	 * @name ui.router.state.$uiViewScrollProvider
	 *
	 * @description
	 * Provider that returns the {@link ui.router.state.$uiViewScroll} service function.
	 */
	function $ViewScrollProvider() {
	
	  var useAnchorScroll = false;
	
	  /**
	   * @ngdoc function
	   * @name ui.router.state.$uiViewScrollProvider#useAnchorScroll
	   * @methodOf ui.router.state.$uiViewScrollProvider
	   *
	   * @description
	   * Reverts back to using the core [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll) service for
	   * scrolling based on the url anchor.
	   */
	  this.useAnchorScroll = function () {
	    useAnchorScroll = true;
	  };
	
	  /**
	   * @ngdoc object
	   * @name ui.router.state.$uiViewScroll
	   *
	   * @requires $anchorScroll
	   * @requires $timeout
	   *
	   * @description
	   * When called with a jqLite element, it scrolls the element into view (after a
	   * `$timeout` so the DOM has time to refresh).
	   *
	   * If you prefer to rely on `$anchorScroll` to scroll the view to the anchor,
	   * this can be enabled by calling {@link ui.router.state.$uiViewScrollProvider#methods_useAnchorScroll `$uiViewScrollProvider.useAnchorScroll()`}.
	   */
	  this.$get = ['$anchorScroll', '$timeout', function ($anchorScroll, $timeout) {
	    if (useAnchorScroll) {
	      return $anchorScroll;
	    }
	
	    return function ($element) {
	      return $timeout(function () {
	        $element[0].scrollIntoView();
	      }, 0, false);
	    };
	  }];
	}
	
	angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);
	
	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-view
	 *
	 * @requires ui.router.state.$state
	 * @requires $compile
	 * @requires $controller
	 * @requires $injector
	 * @requires ui.router.state.$uiViewScroll
	 * @requires $document
	 *
	 * @restrict ECA
	 *
	 * @description
	 * The ui-view directive tells $state where to place your templates.
	 *
	 * @param {string=} name A view name. The name should be unique amongst the other views in the
	 * same state. You can have views of the same name that live in different states.
	 *
	 * @param {string=} autoscroll It allows you to set the scroll behavior of the browser window
	 * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
	 * service, {@link ui.router.state.$uiViewScroll}. This custom service let's you
	 * scroll ui-view elements into view when they are populated during a state activation.
	 *
	 * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
	 * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
	 *
	 * @param {string=} onload Expression to evaluate whenever the view updates.
	 *
	 * @example
	 * A view can be unnamed or named.
	 * <pre>
	 * <!-- Unnamed -->
	 * <div ui-view></div>
	 *
	 * <!-- Named -->
	 * <div ui-view="viewName"></div>
	 * </pre>
	 *
	 * You can only have one unnamed view within any template (or root html). If you are only using a
	 * single view and it is unnamed then you can populate it like so:
	 * <pre>
	 * <div ui-view></div>
	 * $stateProvider.state("home", {
	 *   template: "<h1>HELLO!</h1>"
	 * })
	 * </pre>
	 *
	 * The above is a convenient shortcut equivalent to specifying your view explicitly with the {@link ui.router.state.$stateProvider#methods_state `views`}
	 * config property, by name, in this case an empty name:
	 * <pre>
	 * $stateProvider.state("home", {
	 *   views: {
	 *     "": {
	 *       template: "<h1>HELLO!</h1>"
	 *     }
	 *   }    
	 * })
	 * </pre>
	 *
	 * But typically you'll only use the views property if you name your view or have more than one view
	 * in the same template. There's not really a compelling reason to name a view if its the only one,
	 * but you could if you wanted, like so:
	 * <pre>
	 * <div ui-view="main"></div>
	 * </pre>
	 * <pre>
	 * $stateProvider.state("home", {
	 *   views: {
	 *     "main": {
	 *       template: "<h1>HELLO!</h1>"
	 *     }
	 *   }    
	 * })
	 * </pre>
	 *
	 * Really though, you'll use views to set up multiple views:
	 * <pre>
	 * <div ui-view></div>
	 * <div ui-view="chart"></div>
	 * <div ui-view="data"></div>
	 * </pre>
	 *
	 * <pre>
	 * $stateProvider.state("home", {
	 *   views: {
	 *     "": {
	 *       template: "<h1>HELLO!</h1>"
	 *     },
	 *     "chart": {
	 *       template: "<chart_thing/>"
	 *     },
	 *     "data": {
	 *       template: "<data_thing/>"
	 *     }
	 *   }    
	 * })
	 * </pre>
	 *
	 * Examples for `autoscroll`:
	 *
	 * <pre>
	 * <!-- If autoscroll present with no expression,
	 *      then scroll ui-view into view -->
	 * <ui-view autoscroll/>
	 *
	 * <!-- If autoscroll present with valid expression,
	 *      then scroll ui-view into view if expression evaluates to true -->
	 * <ui-view autoscroll='true'/>
	 * <ui-view autoscroll='false'/>
	 * <ui-view autoscroll='scopeVariable'/>
	 * </pre>
	 *
	 * Resolve data:
	 *
	 * The resolved data from the state's `resolve` block is placed on the scope as `$resolve` (this
	 * can be customized using [[ViewDeclaration.resolveAs]]).  This can be then accessed from the template.
	 *
	 * Note that when `controllerAs` is being used, `$resolve` is set on the controller instance *after* the
	 * controller is instantiated.  The `$onInit()` hook can be used to perform initialization code which
	 * depends on `$resolve` data.
	 *
	 * Example usage of $resolve in a view template
	 * <pre>
	 * $stateProvider.state('home', {
	 *   template: '<my-component user="$resolve.user"></my-component>',
	 *   resolve: {
	 *     user: function(UserService) { return UserService.fetchUser(); }
	 *   }
	 * });
	 * </pre>
	 */
	$ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll', '$interpolate', '$q'];
	function $ViewDirective(   $state,   $injector,   $uiViewScroll,   $interpolate,   $q) {
	
	  function getService() {
	    return ($injector.has) ? function(service) {
	      return $injector.has(service) ? $injector.get(service) : null;
	    } : function(service) {
	      try {
	        return $injector.get(service);
	      } catch (e) {
	        return null;
	      }
	    };
	  }
	
	  var service = getService(),
	      $animator = service('$animator'),
	      $animate = service('$animate');
	
	  // Returns a set of DOM manipulation functions based on which Angular version
	  // it should use
	  function getRenderer(attrs, scope) {
	    var statics = function() {
	      return {
	        enter: function (element, target, cb) { target.after(element); cb(); },
	        leave: function (element, cb) { element.remove(); cb(); }
	      };
	    };
	
	    if ($animate) {
	      return {
	        enter: function(element, target, cb) {
	          if (angular.version.minor > 2) {
	            $animate.enter(element, null, target).then(cb);
	          } else {
	            $animate.enter(element, null, target, cb);
	          }
	        },
	        leave: function(element, cb) {
	          if (angular.version.minor > 2) {
	            $animate.leave(element).then(cb);
	          } else {
	            $animate.leave(element, cb);
	          }
	        }
	      };
	    }
	
	    if ($animator) {
	      var animate = $animator && $animator(scope, attrs);
	
	      return {
	        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
	        leave: function(element, cb) { animate.leave(element); cb(); }
	      };
	    }
	
	    return statics();
	  }
	
	  var directive = {
	    restrict: 'ECA',
	    terminal: true,
	    priority: 400,
	    transclude: 'element',
	    compile: function (tElement, tAttrs, $transclude) {
	      return function (scope, $element, attrs) {
	        var previousEl, currentEl, currentScope, latestLocals,
	            onloadExp     = attrs.onload || '',
	            autoScrollExp = attrs.autoscroll,
	            renderer      = getRenderer(attrs, scope),
	            inherited     = $element.inheritedData('$uiView');
	
	        scope.$on('$stateChangeSuccess', function() {
	          updateView(false);
	        });
	
	        updateView(true);
	
	        function cleanupLastView() {
	          if (previousEl) {
	            previousEl.remove();
	            previousEl = null;
	          }
	
	          if (currentScope) {
	            currentScope.$destroy();
	            currentScope = null;
	          }
	
	          if (currentEl) {
	            var $uiViewData = currentEl.data('$uiViewAnim');
	            renderer.leave(currentEl, function() {
	              $uiViewData.$$animLeave.resolve();
	              previousEl = null;
	            });
	
	            previousEl = currentEl;
	            currentEl = null;
	          }
	        }
	
	        function updateView(firstTime) {
	          var newScope,
	              name            = getUiViewName(scope, attrs, $element, $interpolate),
	              previousLocals  = name && $state.$current && $state.$current.locals[name];
	
	          if (!firstTime && previousLocals === latestLocals) return; // nothing to do
	          newScope = scope.$new();
	          latestLocals = $state.$current.locals[name];
	
	          /**
	           * @ngdoc event
	           * @name ui.router.state.directive:ui-view#$viewContentLoading
	           * @eventOf ui.router.state.directive:ui-view
	           * @eventType emits on ui-view directive scope
	           * @description
	           *
	           * Fired once the view **begins loading**, *before* the DOM is rendered.
	           *
	           * @param {Object} event Event object.
	           * @param {string} viewName Name of the view.
	           */
	          newScope.$emit('$viewContentLoading', name);
	
	          var clone = $transclude(newScope, function(clone) {
	            var animEnter = $q.defer(), animLeave = $q.defer();
	            var viewAnimData = {
	              $animEnter: animEnter.promise,
	              $animLeave: animLeave.promise,
	              $$animLeave: animLeave
	            };
	
	            clone.data('$uiViewAnim', viewAnimData);
	            renderer.enter(clone, $element, function onUiViewEnter() {
	              animEnter.resolve();
	              if(currentScope) {
	                currentScope.$emit('$viewContentAnimationEnded');
	              }
	
	              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
	                $uiViewScroll(clone);
	              }
	            });
	            cleanupLastView();
	          });
	
	          currentEl = clone;
	          currentScope = newScope;
	          /**
	           * @ngdoc event
	           * @name ui.router.state.directive:ui-view#$viewContentLoaded
	           * @eventOf ui.router.state.directive:ui-view
	           * @eventType emits on ui-view directive scope
	           * @description
	           * Fired once the view is **loaded**, *after* the DOM is rendered.
	           *
	           * @param {Object} event Event object.
	           * @param {string} viewName Name of the view.
	           */
	          currentScope.$emit('$viewContentLoaded', name);
	          currentScope.$eval(onloadExp);
	        }
	      };
	    }
	  };
	
	  return directive;
	}
	
	$ViewDirectiveFill.$inject = ['$compile', '$controller', '$state', '$interpolate'];
	function $ViewDirectiveFill (  $compile,   $controller,   $state,   $interpolate) {
	  return {
	    restrict: 'ECA',
	    priority: -400,
	    compile: function (tElement) {
	      var initial = tElement.html();
	      return function (scope, $element, attrs) {
	        var current = $state.$current,
	            name = getUiViewName(scope, attrs, $element, $interpolate),
	            locals  = current && current.locals[name];
	
	        if (! locals) {
	          return;
	        }
	
	        $element.data('$uiView', { name: name, state: locals.$$state });
	        $element.html(locals.$template ? locals.$template : initial);
	
	        var resolveData = angular.extend({}, locals);
	        scope[locals.$$resolveAs] = resolveData;
	
	        var link = $compile($element.contents());
	
	        if (locals.$$controller) {
	          locals.$scope = scope;
	          locals.$element = $element;
	          var controller = $controller(locals.$$controller, locals);
	          if (locals.$$controllerAs) {
	            scope[locals.$$controllerAs] = controller;
	            scope[locals.$$controllerAs][locals.$$resolveAs] = resolveData;
	          }
	          if (isFunction(controller.$onInit)) controller.$onInit();
	          $element.data('$ngControllerController', controller);
	          $element.children().data('$ngControllerController', controller);
	        }
	
	        link(scope);
	      };
	    }
	  };
	}
	
	/**
	 * Shared ui-view code for both directives:
	 * Given scope, element, and its attributes, return the view's name
	 */
	function getUiViewName(scope, attrs, element, $interpolate) {
	  var name = $interpolate(attrs.uiView || attrs.name || '')(scope);
	  var uiViewCreatedBy = element.inheritedData('$uiView');
	  return name.indexOf('@') >= 0 ?  name :  (name + '@' + (uiViewCreatedBy ? uiViewCreatedBy.state.name : ''));
	}
	
	angular.module('ui.router.state').directive('uiView', $ViewDirective);
	angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);
	
	function parseStateRef(ref, current) {
	  var preparsed = ref.match(/^\s*({[^}]*})\s*$/), parsed;
	  if (preparsed) ref = current + '(' + preparsed[1] + ')';
	  parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
	  if (!parsed || parsed.length !== 4) throw new Error("Invalid state ref '" + ref + "'");
	  return { state: parsed[1], paramExpr: parsed[3] || null };
	}
	
	function stateContext(el) {
	  var stateData = el.parent().inheritedData('$uiView');
	
	  if (stateData && stateData.state && stateData.state.name) {
	    return stateData.state;
	  }
	}
	
	function getTypeInfo(el) {
	  // SVGAElement does not use the href attribute, but rather the 'xlinkHref' attribute.
	  var isSvg = Object.prototype.toString.call(el.prop('href')) === '[object SVGAnimatedString]';
	  var isForm = el[0].nodeName === "FORM";
	
	  return {
	    attr: isForm ? "action" : (isSvg ? 'xlink:href' : 'href'),
	    isAnchor: el.prop("tagName").toUpperCase() === "A",
	    clickable: !isForm
	  };
	}
	
	function clickHook(el, $state, $timeout, type, current) {
	  return function(e) {
	    var button = e.which || e.button, target = current();
	
	    if (!(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || el.attr('target'))) {
	      // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
	      var transition = $timeout(function() {
	        $state.go(target.state, target.params, target.options);
	      });
	      e.preventDefault();
	
	      // if the state has no URL, ignore one preventDefault from the <a> directive.
	      var ignorePreventDefaultCount = type.isAnchor && !target.href ? 1: 0;
	
	      e.preventDefault = function() {
	        if (ignorePreventDefaultCount-- <= 0) $timeout.cancel(transition);
	      };
	    }
	  };
	}
	
	function defaultOpts(el, $state) {
	  return { relative: stateContext(el) || $state.$current, inherit: true };
	}
	
	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-sref
	 *
	 * @requires ui.router.state.$state
	 * @requires $timeout
	 *
	 * @restrict A
	 *
	 * @description
	 * A directive that binds a link (`<a>` tag) to a state. If the state has an associated
	 * URL, the directive will automatically generate & update the `href` attribute via
	 * the {@link ui.router.state.$state#methods_href $state.href()} method. Clicking
	 * the link will trigger a state transition with optional parameters.
	 *
	 * Also middle-clicking, right-clicking, and ctrl-clicking on the link will be
	 * handled natively by the browser.
	 *
	 * You can also use relative state paths within ui-sref, just like the relative
	 * paths passed to `$state.go()`. You just need to be aware that the path is relative
	 * to the state that the link lives in, in other words the state that loaded the
	 * template containing the link.
	 *
	 * You can specify options to pass to {@link ui.router.state.$state#methods_go $state.go()}
	 * using the `ui-sref-opts` attribute. Options are restricted to `location`, `inherit`,
	 * and `reload`.
	 *
	 * @example
	 * Here's an example of how you'd use ui-sref and how it would compile. If you have the
	 * following template:
	 * <pre>
	 * <a ui-sref="home">Home</a> | <a ui-sref="about">About</a> | <a ui-sref="{page: 2}">Next page</a>
	 *
	 * <ul>
	 *     <li ng-repeat="contact in contacts">
	 *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
	 *     </li>
	 * </ul>
	 * </pre>
	 *
	 * Then the compiled html would be (assuming Html5Mode is off and current state is contacts):
	 * <pre>
	 * <a href="#/home" ui-sref="home">Home</a> | <a href="#/about" ui-sref="about">About</a> | <a href="#/contacts?page=2" ui-sref="{page: 2}">Next page</a>
	 *
	 * <ul>
	 *     <li ng-repeat="contact in contacts">
	 *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
	 *     </li>
	 *     <li ng-repeat="contact in contacts">
	 *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
	 *     </li>
	 *     <li ng-repeat="contact in contacts">
	 *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
	 *     </li>
	 * </ul>
	 *
	 * <a ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
	 * </pre>
	 *
	 * @param {string} ui-sref 'stateName' can be any valid absolute or relative state
	 * @param {Object} ui-sref-opts options to pass to {@link ui.router.state.$state#methods_go $state.go()}
	 */
	$StateRefDirective.$inject = ['$state', '$timeout'];
	function $StateRefDirective($state, $timeout) {
	  return {
	    restrict: 'A',
	    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
	    link: function(scope, element, attrs, uiSrefActive) {
	      var ref    = parseStateRef(attrs.uiSref, $state.current.name);
	      var def    = { state: ref.state, href: null, params: null };
	      var type   = getTypeInfo(element);
	      var active = uiSrefActive[1] || uiSrefActive[0];
	      var unlinkInfoFn = null;
	      var hookFn;
	
	      def.options = extend(defaultOpts(element, $state), attrs.uiSrefOpts ? scope.$eval(attrs.uiSrefOpts) : {});
	
	      var update = function(val) {
	        if (val) def.params = angular.copy(val);
	        def.href = $state.href(ref.state, def.params, def.options);
	
	        if (unlinkInfoFn) unlinkInfoFn();
	        if (active) unlinkInfoFn = active.$$addStateInfo(ref.state, def.params);
	        if (def.href !== null) attrs.$set(type.attr, def.href);
	      };
	
	      if (ref.paramExpr) {
	        scope.$watch(ref.paramExpr, function(val) { if (val !== def.params) update(val); }, true);
	        def.params = angular.copy(scope.$eval(ref.paramExpr));
	      }
	      update();
	
	      if (!type.clickable) return;
	      hookFn = clickHook(element, $state, $timeout, type, function() { return def; });
	      element.bind("click", hookFn);
	      scope.$on('$destroy', function() {
	        element.unbind("click", hookFn);
	      });
	    }
	  };
	}
	
	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-state
	 *
	 * @requires ui.router.state.uiSref
	 *
	 * @restrict A
	 *
	 * @description
	 * Much like ui-sref, but will accept named $scope properties to evaluate for a state definition,
	 * params and override options.
	 *
	 * @param {string} ui-state 'stateName' can be any valid absolute or relative state
	 * @param {Object} ui-state-params params to pass to {@link ui.router.state.$state#methods_href $state.href()}
	 * @param {Object} ui-state-opts options to pass to {@link ui.router.state.$state#methods_go $state.go()}
	 */
	$StateRefDynamicDirective.$inject = ['$state', '$timeout'];
	function $StateRefDynamicDirective($state, $timeout) {
	  return {
	    restrict: 'A',
	    require: ['?^uiSrefActive', '?^uiSrefActiveEq'],
	    link: function(scope, element, attrs, uiSrefActive) {
	      var type   = getTypeInfo(element);
	      var active = uiSrefActive[1] || uiSrefActive[0];
	      var group  = [attrs.uiState, attrs.uiStateParams || null, attrs.uiStateOpts || null];
	      var watch  = '[' + group.map(function(val) { return val || 'null'; }).join(', ') + ']';
	      var def    = { state: null, params: null, options: null, href: null };
	      var unlinkInfoFn = null;
	      var hookFn;
	
	      function runStateRefLink (group) {
	        def.state = group[0]; def.params = group[1]; def.options = group[2];
	        def.href = $state.href(def.state, def.params, def.options);
	
	        if (unlinkInfoFn) unlinkInfoFn();
	        if (active) unlinkInfoFn = active.$$addStateInfo(def.state, def.params);
	        if (def.href) attrs.$set(type.attr, def.href);
	      }
	
	      scope.$watch(watch, runStateRefLink, true);
	      runStateRefLink(scope.$eval(watch));
	
	      if (!type.clickable) return;
	      hookFn = clickHook(element, $state, $timeout, type, function() { return def; });
	      element.bind("click", hookFn);
	      scope.$on('$destroy', function() {
	        element.unbind("click", hookFn);
	      });
	    }
	  };
	}
	
	
	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-sref-active
	 *
	 * @requires ui.router.state.$state
	 * @requires ui.router.state.$stateParams
	 * @requires $interpolate
	 *
	 * @restrict A
	 *
	 * @description
	 * A directive working alongside ui-sref to add classes to an element when the
	 * related ui-sref directive's state is active, and removing them when it is inactive.
	 * The primary use-case is to simplify the special appearance of navigation menus
	 * relying on `ui-sref`, by having the "active" state's menu button appear different,
	 * distinguishing it from the inactive menu items.
	 *
	 * ui-sref-active can live on the same element as ui-sref or on a parent element. The first
	 * ui-sref-active found at the same level or above the ui-sref will be used.
	 *
	 * Will activate when the ui-sref's target state or any child state is active. If you
	 * need to activate only when the ui-sref target state is active and *not* any of
	 * it's children, then you will use
	 * {@link ui.router.state.directive:ui-sref-active-eq ui-sref-active-eq}
	 *
	 * @example
	 * Given the following template:
	 * <pre>
	 * <ul>
	 *   <li ui-sref-active="active" class="item">
	 *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
	 *   </li>
	 * </ul>
	 * </pre>
	 *
	 *
	 * When the app state is "app.user" (or any children states), and contains the state parameter "user" with value "bilbobaggins",
	 * the resulting HTML will appear as (note the 'active' class):
	 * <pre>
	 * <ul>
	 *   <li ui-sref-active="active" class="item active">
	 *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
	 *   </li>
	 * </ul>
	 * </pre>
	 *
	 * The class name is interpolated **once** during the directives link time (any further changes to the
	 * interpolated value are ignored).
	 *
	 * Multiple classes may be specified in a space-separated format:
	 * <pre>
	 * <ul>
	 *   <li ui-sref-active='class1 class2 class3'>
	 *     <a ui-sref="app.user">link</a>
	 *   </li>
	 * </ul>
	 * </pre>
	 *
	 * It is also possible to pass ui-sref-active an expression that evaluates
	 * to an object hash, whose keys represent active class names and whose
	 * values represent the respective state names/globs.
	 * ui-sref-active will match if the current active state **includes** any of
	 * the specified state names/globs, even the abstract ones.
	 *
	 * @Example
	 * Given the following template, with "admin" being an abstract state:
	 * <pre>
	 * <div ui-sref-active="{'active': 'admin.*'}">
	 *   <a ui-sref-active="active" ui-sref="admin.roles">Roles</a>
	 * </div>
	 * </pre>
	 *
	 * When the current state is "admin.roles" the "active" class will be applied
	 * to both the <div> and <a> elements. It is important to note that the state
	 * names/globs passed to ui-sref-active shadow the state provided by ui-sref.
	 */
	
	/**
	 * @ngdoc directive
	 * @name ui.router.state.directive:ui-sref-active-eq
	 *
	 * @requires ui.router.state.$state
	 * @requires ui.router.state.$stateParams
	 * @requires $interpolate
	 *
	 * @restrict A
	 *
	 * @description
	 * The same as {@link ui.router.state.directive:ui-sref-active ui-sref-active} but will only activate
	 * when the exact target state used in the `ui-sref` is active; no child states.
	 *
	 */
	$StateRefActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
	function $StateRefActiveDirective($state, $stateParams, $interpolate) {
	  return  {
	    restrict: "A",
	    controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
	      var states = [], activeClasses = {}, activeEqClass, uiSrefActive;
	
	      // There probably isn't much point in $observing this
	      // uiSrefActive and uiSrefActiveEq share the same directive object with some
	      // slight difference in logic routing
	      activeEqClass = $interpolate($attrs.uiSrefActiveEq || '', false)($scope);
	
	      try {
	        uiSrefActive = $scope.$eval($attrs.uiSrefActive);
	      } catch (e) {
	        // Do nothing. uiSrefActive is not a valid expression.
	        // Fall back to using $interpolate below
	      }
	      uiSrefActive = uiSrefActive || $interpolate($attrs.uiSrefActive || '', false)($scope);
	      if (isObject(uiSrefActive)) {
	        forEach(uiSrefActive, function(stateOrName, activeClass) {
	          if (isString(stateOrName)) {
	            var ref = parseStateRef(stateOrName, $state.current.name);
	            addState(ref.state, $scope.$eval(ref.paramExpr), activeClass);
	          }
	        });
	      }
	
	      // Allow uiSref to communicate with uiSrefActive[Equals]
	      this.$$addStateInfo = function (newState, newParams) {
	        // we already got an explicit state provided by ui-sref-active, so we
	        // shadow the one that comes from ui-sref
	        if (isObject(uiSrefActive) && states.length > 0) {
	          return;
	        }
	        var deregister = addState(newState, newParams, uiSrefActive);
	        update();
	        return deregister;
	      };
	
	      $scope.$on('$stateChangeSuccess', update);
	
	      function addState(stateName, stateParams, activeClass) {
	        var state = $state.get(stateName, stateContext($element));
	        var stateHash = createStateHash(stateName, stateParams);
	
	        var stateInfo = {
	          state: state || { name: stateName },
	          params: stateParams,
	          hash: stateHash
	        };
	
	        states.push(stateInfo);
	        activeClasses[stateHash] = activeClass;
	
	        return function removeState() {
	          var idx = states.indexOf(stateInfo);
	          if (idx !== -1) states.splice(idx, 1);
	        };
	      }
	
	      /**
	       * @param {string} state
	       * @param {Object|string} [params]
	       * @return {string}
	       */
	      function createStateHash(state, params) {
	        if (!isString(state)) {
	          throw new Error('state should be a string');
	        }
	        if (isObject(params)) {
	          return state + toJson(params);
	        }
	        params = $scope.$eval(params);
	        if (isObject(params)) {
	          return state + toJson(params);
	        }
	        return state;
	      }
	
	      // Update route state
	      function update() {
	        for (var i = 0; i < states.length; i++) {
	          if (anyMatch(states[i].state, states[i].params)) {
	            addClass($element, activeClasses[states[i].hash]);
	          } else {
	            removeClass($element, activeClasses[states[i].hash]);
	          }
	
	          if (exactMatch(states[i].state, states[i].params)) {
	            addClass($element, activeEqClass);
	          } else {
	            removeClass($element, activeEqClass);
	          }
	        }
	      }
	
	      function addClass(el, className) { $timeout(function () { el.addClass(className); }); }
	      function removeClass(el, className) { el.removeClass(className); }
	      function anyMatch(state, params) { return $state.includes(state.name, params); }
	      function exactMatch(state, params) { return $state.is(state.name, params); }
	
	      update();
	    }]
	  };
	}
	
	angular.module('ui.router.state')
	  .directive('uiSref', $StateRefDirective)
	  .directive('uiSrefActive', $StateRefActiveDirective)
	  .directive('uiSrefActiveEq', $StateRefActiveDirective)
	  .directive('uiState', $StateRefDynamicDirective);
	
	/**
	 * @ngdoc filter
	 * @name ui.router.state.filter:isState
	 *
	 * @requires ui.router.state.$state
	 *
	 * @description
	 * Translates to {@link ui.router.state.$state#methods_is $state.is("stateName")}.
	 */
	$IsStateFilter.$inject = ['$state'];
	function $IsStateFilter($state) {
	  var isFilter = function (state, params) {
	    return $state.is(state, params);
	  };
	  isFilter.$stateful = true;
	  return isFilter;
	}
	
	/**
	 * @ngdoc filter
	 * @name ui.router.state.filter:includedByState
	 *
	 * @requires ui.router.state.$state
	 *
	 * @description
	 * Translates to {@link ui.router.state.$state#methods_includes $state.includes('fullOrPartialStateName')}.
	 */
	$IncludedByStateFilter.$inject = ['$state'];
	function $IncludedByStateFilter($state) {
	  var includesFilter = function (state, params, options) {
	    return $state.includes(state, params, options);
	  };
	  includesFilter.$stateful = true;
	  return  includesFilter;
	}
	
	angular.module('ui.router.state')
	  .filter('isState', $IsStateFilter)
	  .filter('includedByState', $IncludedByStateFilter);
	})(window, window.angular);

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	 * angular-translate - v2.11.1 - 2016-07-17
	 * 
	 * Copyright (c) 2016 The angular-translate team, Pascal Precht; Licensed MIT
	 */
	(function (root, factory) {
	  if (true) {
	    // AMD. Register as an anonymous module unless amdModuleId is set
	    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	      return (factory());
	    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    // Node. Does not work with strict CommonJS, but
	    // only CommonJS-like environments that support module.exports,
	    // like Node.
	    module.exports = factory();
	  } else {
	    factory();
	  }
	}(this, function () {
	
	/**
	 * @ngdoc overview
	 * @name pascalprecht.translate
	 *
	 * @description
	 * The main module which holds everything together.
	 */
	runTranslate.$inject = ['$translate'];
	$translate.$inject = ['$STORAGE_KEY', '$windowProvider', '$translateSanitizationProvider', 'pascalprechtTranslateOverrider'];
	$translateDefaultInterpolation.$inject = ['$interpolate', '$translateSanitization'];
	translateDirective.$inject = ['$translate', '$q', '$interpolate', '$compile', '$parse', '$rootScope'];
	translateCloakDirective.$inject = ['$translate', '$rootScope'];
	translateFilterFactory.$inject = ['$parse', '$translate'];
	$translationCache.$inject = ['$cacheFactory'];
	angular.module('pascalprecht.translate', ['ng'])
	  .run(runTranslate);
	
	function runTranslate($translate) {
	
	  'use strict';
	
	  var key = $translate.storageKey(),
	    storage = $translate.storage();
	
	  var fallbackFromIncorrectStorageValue = function () {
	    var preferred = $translate.preferredLanguage();
	    if (angular.isString(preferred)) {
	      $translate.use(preferred);
	      // $translate.use() will also remember the language.
	      // So, we don't need to call storage.put() here.
	    } else {
	      storage.put(key, $translate.use());
	    }
	  };
	
	  fallbackFromIncorrectStorageValue.displayName = 'fallbackFromIncorrectStorageValue';
	
	  if (storage) {
	    if (!storage.get(key)) {
	      fallbackFromIncorrectStorageValue();
	    } else {
	      $translate.use(storage.get(key))['catch'](fallbackFromIncorrectStorageValue);
	    }
	  } else if (angular.isString($translate.preferredLanguage())) {
	    $translate.use($translate.preferredLanguage());
	  }
	}
	
	runTranslate.displayName = 'runTranslate';
	
	/**
	 * @ngdoc object
	 * @name pascalprecht.translate.$translateSanitizationProvider
	 *
	 * @description
	 *
	 * Configurations for $translateSanitization
	 */
	angular.module('pascalprecht.translate').provider('$translateSanitization', $translateSanitizationProvider);
	
	function $translateSanitizationProvider () {
	
	  'use strict';
	
	  var $sanitize,
	      currentStrategy = null, // TODO change to either 'sanitize', 'escape' or ['sanitize', 'escapeParameters'] in 3.0.
	      hasConfiguredStrategy = false,
	      hasShownNoStrategyConfiguredWarning = false,
	      strategies;
	
	  /**
	   * Definition of a sanitization strategy function
	   * @callback StrategyFunction
	   * @param {string|object} value - value to be sanitized (either a string or an interpolated value map)
	   * @param {string} mode - either 'text' for a string (translation) or 'params' for the interpolated params
	   * @return {string|object}
	   */
	
	  /**
	   * @ngdoc property
	   * @name strategies
	   * @propertyOf pascalprecht.translate.$translateSanitizationProvider
	   *
	   * @description
	   * Following strategies are built-in:
	   * <dl>
	   *   <dt>sanitize</dt>
	   *   <dd>Sanitizes HTML in the translation text using $sanitize</dd>
	   *   <dt>escape</dt>
	   *   <dd>Escapes HTML in the translation</dd>
	   *   <dt>sanitizeParameters</dt>
	   *   <dd>Sanitizes HTML in the values of the interpolation parameters using $sanitize</dd>
	   *   <dt>escapeParameters</dt>
	   *   <dd>Escapes HTML in the values of the interpolation parameters</dd>
	   *   <dt>escaped</dt>
	   *   <dd>Support legacy strategy name 'escaped' for backwards compatibility (will be removed in 3.0)</dd>
	   * </dl>
	   *
	   */
	
	  strategies = {
	    sanitize: function (value, mode) {
	      if (mode === 'text') {
	        value = htmlSanitizeValue(value);
	      }
	      return value;
	    },
	    escape: function (value, mode) {
	      if (mode === 'text') {
	        value = htmlEscapeValue(value);
	      }
	      return value;
	    },
	    sanitizeParameters: function (value, mode) {
	      if (mode === 'params') {
	        value = mapInterpolationParameters(value, htmlSanitizeValue);
	      }
	      return value;
	    },
	    escapeParameters: function (value, mode) {
	      if (mode === 'params') {
	        value = mapInterpolationParameters(value, htmlEscapeValue);
	      }
	      return value;
	    }
	  };
	  // Support legacy strategy name 'escaped' for backwards compatibility.
	  // TODO should be removed in 3.0
	  strategies.escaped = strategies.escapeParameters;
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateSanitizationProvider#addStrategy
	   * @methodOf pascalprecht.translate.$translateSanitizationProvider
	   *
	   * @description
	   * Adds a sanitization strategy to the list of known strategies.
	   *
	   * @param {string} strategyName - unique key for a strategy
	   * @param {StrategyFunction} strategyFunction - strategy function
	   * @returns {object} this
	   */
	  this.addStrategy = function (strategyName, strategyFunction) {
	    strategies[strategyName] = strategyFunction;
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateSanitizationProvider#removeStrategy
	   * @methodOf pascalprecht.translate.$translateSanitizationProvider
	   *
	   * @description
	   * Removes a sanitization strategy from the list of known strategies.
	   *
	   * @param {string} strategyName - unique key for a strategy
	   * @returns {object} this
	   */
	  this.removeStrategy = function (strategyName) {
	    delete strategies[strategyName];
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateSanitizationProvider#useStrategy
	   * @methodOf pascalprecht.translate.$translateSanitizationProvider
	   *
	   * @description
	   * Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
	   *
	   * @param {string|StrategyFunction|array} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
	   * @returns {object} this
	   */
	  this.useStrategy = function (strategy) {
	    hasConfiguredStrategy = true;
	    currentStrategy = strategy;
	    return this;
	  };
	
	  /**
	   * @ngdoc object
	   * @name pascalprecht.translate.$translateSanitization
	   * @requires $injector
	   * @requires $log
	   *
	   * @description
	   * Sanitizes interpolation parameters and translated texts.
	   *
	   */
	  this.$get = ['$injector', '$log', function ($injector, $log) {
	
	    var cachedStrategyMap = {};
	
	    var applyStrategies = function (value, mode, selectedStrategies) {
	      angular.forEach(selectedStrategies, function (selectedStrategy) {
	        if (angular.isFunction(selectedStrategy)) {
	          value = selectedStrategy(value, mode);
	        } else if (angular.isFunction(strategies[selectedStrategy])) {
	          value = strategies[selectedStrategy](value, mode);
	        } else if (angular.isString(strategies[selectedStrategy])) {
	          if (!cachedStrategyMap[strategies[selectedStrategy]]) {
	            try {
	              cachedStrategyMap[strategies[selectedStrategy]] = $injector.get(strategies[selectedStrategy]);
	            } catch (e) {
	              cachedStrategyMap[strategies[selectedStrategy]] = function() {};
	              throw new Error('pascalprecht.translate.$translateSanitization: Unknown sanitization strategy: \'' + selectedStrategy + '\'');
	            }
	          }
	          value = cachedStrategyMap[strategies[selectedStrategy]](value, mode);
	        } else {
	          throw new Error('pascalprecht.translate.$translateSanitization: Unknown sanitization strategy: \'' + selectedStrategy + '\'');
	        }
	      });
	      return value;
	    };
	
	    // TODO: should be removed in 3.0
	    var showNoStrategyConfiguredWarning = function () {
	      if (!hasConfiguredStrategy && !hasShownNoStrategyConfiguredWarning) {
	        $log.warn('pascalprecht.translate.$translateSanitization: No sanitization strategy has been configured. This can have serious security implications. See http://angular-translate.github.io/docs/#/guide/19_security for details.');
	        hasShownNoStrategyConfiguredWarning = true;
	      }
	    };
	
	    if ($injector.has('$sanitize')) {
	      $sanitize = $injector.get('$sanitize');
	    }
	
	    return {
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translateSanitization#useStrategy
	       * @methodOf pascalprecht.translate.$translateSanitization
	       *
	       * @description
	       * Selects a sanitization strategy. When an array is provided the strategies will be executed in order.
	       *
	       * @param {string|StrategyFunction|array} strategy The sanitization strategy / strategies which should be used. Either a name of an existing strategy, a custom strategy function, or an array consisting of multiple names and / or custom functions.
	       */
	      useStrategy: (function (self) {
	        return function (strategy) {
	          self.useStrategy(strategy);
	        };
	      })(this),
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translateSanitization#sanitize
	       * @methodOf pascalprecht.translate.$translateSanitization
	       *
	       * @description
	       * Sanitizes a value.
	       *
	       * @param {string|object} value The value which should be sanitized.
	       * @param {string} mode The current sanitization mode, either 'params' or 'text'.
	       * @param {string|StrategyFunction|array} [strategy] Optional custom strategy which should be used instead of the currently selected strategy.
	       * @returns {string|object} sanitized value
	       */
	      sanitize: function (value, mode, strategy) {
	        if (!currentStrategy) {
	          showNoStrategyConfiguredWarning();
	        }
	
	        if (arguments.length < 3) {
	          strategy = currentStrategy;
	        }
	
	        if (!strategy) {
	          return value;
	        }
	
	        var selectedStrategies = angular.isArray(strategy) ? strategy : [strategy];
	        return applyStrategies(value, mode, selectedStrategies);
	      }
	    };
	  }];
	
	  var htmlEscapeValue = function (value) {
	    var element = angular.element('<div></div>');
	    element.text(value); // not chainable, see #1044
	    return element.html();
	  };
	
	  var htmlSanitizeValue = function (value) {
	    if (!$sanitize) {
	      throw new Error('pascalprecht.translate.$translateSanitization: Error cannot find $sanitize service. Either include the ngSanitize module (https://docs.angularjs.org/api/ngSanitize) or use a sanitization strategy which does not depend on $sanitize, such as \'escape\'.');
	    }
	    return $sanitize(value);
	  };
	
	  var mapInterpolationParameters = function (value, iteratee, stack) {
	    if (angular.isObject(value)) {
	      var result = angular.isArray(value) ? [] : {};
	
	      if (!stack) {
	        stack = [];
	      } else {
	        if (stack.indexOf(value) > -1) {
	          throw new Error('pascalprecht.translate.$translateSanitization: Error cannot interpolate parameter due recursive object');
	        }
	      }
	
	      stack.push(value);
	      angular.forEach(value, function (propertyValue, propertyKey) {
	
	        /* Skipping function properties. */
	        if (angular.isFunction(propertyValue)) {
	          return;
	        }
	
	        result[propertyKey] = mapInterpolationParameters(propertyValue, iteratee, stack);
	      });
	      stack.splice(-1, 1); // remove last
	
	      return result;
	    } else if (angular.isNumber(value)) {
	      return value;
	    } else {
	      return iteratee(value);
	    }
	  };
	}
	
	/**
	 * @ngdoc object
	 * @name pascalprecht.translate.$translateProvider
	 * @description
	 *
	 * $translateProvider allows developers to register translation-tables, asynchronous loaders
	 * and similar to configure translation behavior directly inside of a module.
	 *
	 */
	angular.module('pascalprecht.translate')
	.constant('pascalprechtTranslateOverrider', {})
	.provider('$translate', $translate);
	
	function $translate($STORAGE_KEY, $windowProvider, $translateSanitizationProvider, pascalprechtTranslateOverrider) {
	
	  'use strict';
	
	  var $translationTable = {},
	      $preferredLanguage,
	      $availableLanguageKeys = [],
	      $languageKeyAliases,
	      $fallbackLanguage,
	      $fallbackWasString,
	      $uses,
	      $nextLang,
	      $storageFactory,
	      $storageKey = $STORAGE_KEY,
	      $storagePrefix,
	      $missingTranslationHandlerFactory,
	      $interpolationFactory,
	      $interpolatorFactories = [],
	      $loaderFactory,
	      $cloakClassName = 'translate-cloak',
	      $loaderOptions,
	      $notFoundIndicatorLeft,
	      $notFoundIndicatorRight,
	      $postCompilingEnabled = false,
	      $forceAsyncReloadEnabled = false,
	      $nestedObjectDelimeter = '.',
	      $isReady = false,
	      $keepContent = false,
	      loaderCache,
	      directivePriority = 0,
	      statefulFilter = true,
	      postProcessFn,
	      uniformLanguageTagResolver = 'default',
	      languageTagResolver = {
	        'default': function (tag) {
	          return (tag || '').split('-').join('_');
	        },
	        java: function (tag) {
	          var temp = (tag || '').split('-').join('_');
	          var parts = temp.split('_');
	          return parts.length > 1 ? (parts[0].toLowerCase() + '_' + parts[1].toUpperCase()) : temp;
	        },
	        bcp47: function (tag) {
	          var temp = (tag || '').split('_').join('-');
	          var parts = temp.split('-');
	          return parts.length > 1 ? (parts[0].toLowerCase() + '-' + parts[1].toUpperCase()) : temp;
	        },
	        'iso639-1': function (tag) {
	          var temp = (tag || '').split('_').join('-');
	          var parts = temp.split('-');
	          return parts[0].toLowerCase();
	        }
	      };
	
	  var version = '2.11.1';
	
	  // tries to determine the browsers language
	  var getFirstBrowserLanguage = function () {
	
	    // internal purpose only
	    if (angular.isFunction(pascalprechtTranslateOverrider.getLocale)) {
	      return pascalprechtTranslateOverrider.getLocale();
	    }
	
	    var nav = $windowProvider.$get().navigator,
	        browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
	        i,
	        language;
	
	    // support for HTML 5.1 "navigator.languages"
	    if (angular.isArray(nav.languages)) {
	      for (i = 0; i < nav.languages.length; i++) {
	        language = nav.languages[i];
	        if (language && language.length) {
	          return language;
	        }
	      }
	    }
	
	    // support for other well known properties in browsers
	    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
	      language = nav[browserLanguagePropertyKeys[i]];
	      if (language && language.length) {
	        return language;
	      }
	    }
	
	    return null;
	  };
	  getFirstBrowserLanguage.displayName = 'angular-translate/service: getFirstBrowserLanguage';
	
	  // tries to determine the browsers locale
	  var getLocale = function () {
	    var locale = getFirstBrowserLanguage() || '';
	    if (languageTagResolver[uniformLanguageTagResolver]) {
	      locale = languageTagResolver[uniformLanguageTagResolver](locale);
	    }
	    return locale;
	  };
	  getLocale.displayName = 'angular-translate/service: getLocale';
	
	  /**
	   * @name indexOf
	   * @private
	   *
	   * @description
	   * indexOf polyfill. Kinda sorta.
	   *
	   * @param {array} array Array to search in.
	   * @param {string} searchElement Element to search for.
	   *
	   * @returns {int} Index of search element.
	   */
	  var indexOf = function(array, searchElement) {
	    for (var i = 0, len = array.length; i < len; i++) {
	      if (array[i] === searchElement) {
	        return i;
	      }
	    }
	    return -1;
	  };
	
	  /**
	   * @name trim
	   * @private
	   *
	   * @description
	   * trim polyfill
	   *
	   * @returns {string} The string stripped of whitespace from both ends
	   */
	  var trim = function() {
	    return this.toString().replace(/^\s+|\s+$/g, '');
	  };
	
	  var negotiateLocale = function (preferred) {
	    if(!preferred) {
	      return;
	    }
	
	    var avail = [],
	        locale = angular.lowercase(preferred),
	        i = 0,
	        n = $availableLanguageKeys.length;
	
	    for (; i < n; i++) {
	      avail.push(angular.lowercase($availableLanguageKeys[i]));
	    }
	
	    // Check for an exact match in our list of available keys
	    if (indexOf(avail, locale) > -1) {
	      return preferred;
	    }
	
	    if ($languageKeyAliases) {
	      var alias;
	      for (var langKeyAlias in $languageKeyAliases) {
	        if ($languageKeyAliases.hasOwnProperty(langKeyAlias)) {
	          var hasWildcardKey = false;
	          var hasExactKey = Object.prototype.hasOwnProperty.call($languageKeyAliases, langKeyAlias) &&
	            angular.lowercase(langKeyAlias) === angular.lowercase(preferred);
	
	          if (langKeyAlias.slice(-1) === '*') {
	            hasWildcardKey = langKeyAlias.slice(0, -1) === preferred.slice(0, langKeyAlias.length - 1);
	          }
	          if (hasExactKey || hasWildcardKey) {
	            alias = $languageKeyAliases[langKeyAlias];
	            if (indexOf(avail, angular.lowercase(alias)) > -1) {
	              return alias;
	            }
	          }
	        }
	      }
	    }
	
	    // Check for a language code without region
	    var parts = preferred.split('_');
	
	    if (parts.length > 1 && indexOf(avail, angular.lowercase(parts[0])) > -1) {
	      return parts[0];
	    }
	
	    // If everything fails, return undefined.
	    return;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#translations
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Registers a new translation table for specific language key.
	   *
	   * To register a translation table for specific language, pass a defined language
	   * key as first parameter.
	   *
	   * <pre>
	   *  // register translation table for language: 'de_DE'
	   *  $translateProvider.translations('de_DE', {
	   *    'GREETING': 'Hallo Welt!'
	   *  });
	   *
	   *  // register another one
	   *  $translateProvider.translations('en_US', {
	   *    'GREETING': 'Hello world!'
	   *  });
	   * </pre>
	   *
	   * When registering multiple translation tables for for the same language key,
	   * the actual translation table gets extended. This allows you to define module
	   * specific translation which only get added, once a specific module is loaded in
	   * your app.
	   *
	   * Invoking this method with no arguments returns the translation table which was
	   * registered with no language key. Invoking it with a language key returns the
	   * related translation table.
	   *
	   * @param {string} langKey A language key.
	   * @param {object} translationTable A plain old JavaScript object that represents a translation table.
	   *
	   */
	  var translations = function (langKey, translationTable) {
	
	    if (!langKey && !translationTable) {
	      return $translationTable;
	    }
	
	    if (langKey && !translationTable) {
	      if (angular.isString(langKey)) {
	        return $translationTable[langKey];
	      }
	    } else {
	      if (!angular.isObject($translationTable[langKey])) {
	        $translationTable[langKey] = {};
	      }
	      angular.extend($translationTable[langKey], flatObject(translationTable));
	    }
	    return this;
	  };
	
	  this.translations = translations;
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#cloakClassName
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   *
	   * Let's you change the class name for `translate-cloak` directive.
	   * Default class name is `translate-cloak`.
	   *
	   * @param {string} name translate-cloak class name
	   */
	  this.cloakClassName = function (name) {
	    if (!name) {
	      return $cloakClassName;
	    }
	    $cloakClassName = name;
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#nestedObjectDelimeter
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   *
	   * Let's you change the delimiter for namespaced translations.
	   * Default delimiter is `.`.
	   *
	   * @param {string} delimiter namespace separator
	   */
	  this.nestedObjectDelimeter = function (delimiter) {
	    if (!delimiter) {
	      return $nestedObjectDelimeter;
	    }
	    $nestedObjectDelimeter = delimiter;
	    return this;
	  };
	
	  /**
	   * @name flatObject
	   * @private
	   *
	   * @description
	   * Flats an object. This function is used to flatten given translation data with
	   * namespaces, so they are later accessible via dot notation.
	   */
	  var flatObject = function (data, path, result, prevKey) {
	    var key, keyWithPath, keyWithShortPath, val;
	
	    if (!path) {
	      path = [];
	    }
	    if (!result) {
	      result = {};
	    }
	    for (key in data) {
	      if (!Object.prototype.hasOwnProperty.call(data, key)) {
	        continue;
	      }
	      val = data[key];
	      if (angular.isObject(val)) {
	        flatObject(val, path.concat(key), result, key);
	      } else {
	        keyWithPath = path.length ? ('' + path.join($nestedObjectDelimeter) + $nestedObjectDelimeter + key) : key;
	        if(path.length && key === prevKey){
	          // Create shortcut path (foo.bar == foo.bar.bar)
	          keyWithShortPath = '' + path.join($nestedObjectDelimeter);
	          // Link it to original path
	          result[keyWithShortPath] = '@:' + keyWithPath;
	        }
	        result[keyWithPath] = val;
	      }
	    }
	    return result;
	  };
	  flatObject.displayName = 'flatObject';
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#addInterpolation
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Adds interpolation services to angular-translate, so it can manage them.
	   *
	   * @param {object} factory Interpolation service factory
	   */
	  this.addInterpolation = function (factory) {
	    $interpolatorFactories.push(factory);
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useMessageFormatInterpolation
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use interpolation functionality of messageformat.js.
	   * This is useful when having high level pluralization and gender selection.
	   */
	  this.useMessageFormatInterpolation = function () {
	    return this.useInterpolation('$translateMessageFormatInterpolation');
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useInterpolation
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate which interpolation style to use as default, application-wide.
	   * Simply pass a factory/service name. The interpolation service has to implement
	   * the correct interface.
	   *
	   * @param {string} factory Interpolation service name.
	   */
	  this.useInterpolation = function (factory) {
	    $interpolationFactory = factory;
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useSanitizeStrategy
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Simply sets a sanitation strategy type.
	   *
	   * @param {string} value Strategy type.
	   */
	  this.useSanitizeValueStrategy = function (value) {
	    $translateSanitizationProvider.useStrategy(value);
	    return this;
	  };
	
	 /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#preferredLanguage
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells the module which of the registered translation tables to use for translation
	   * at initial startup by passing a language key. Similar to `$translateProvider#use`
	   * only that it says which language to **prefer**.
	   *
	   * @param {string} langKey A language key.
	   */
	  this.preferredLanguage = function(langKey) {
	    if (langKey) {
	      setupPreferredLanguage(langKey);
	      return this;
	    }
	    return $preferredLanguage;
	  };
	  var setupPreferredLanguage = function (langKey) {
	    if (langKey) {
	      $preferredLanguage = langKey;
	    }
	    return $preferredLanguage;
	  };
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicator
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Sets an indicator which is used when a translation isn't found. E.g. when
	   * setting the indicator as 'X' and one tries to translate a translation id
	   * called `NOT_FOUND`, this will result in `X NOT_FOUND X`.
	   *
	   * Internally this methods sets a left indicator and a right indicator using
	   * `$translateProvider.translationNotFoundIndicatorLeft()` and
	   * `$translateProvider.translationNotFoundIndicatorRight()`.
	   *
	   * **Note**: These methods automatically add a whitespace between the indicators
	   * and the translation id.
	   *
	   * @param {string} indicator An indicator, could be any string.
	   */
	  this.translationNotFoundIndicator = function (indicator) {
	    this.translationNotFoundIndicatorLeft(indicator);
	    this.translationNotFoundIndicatorRight(indicator);
	    return this;
	  };
	
	  /**
	   * ngdoc function
	   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicatorLeft
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Sets an indicator which is used when a translation isn't found left to the
	   * translation id.
	   *
	   * @param {string} indicator An indicator.
	   */
	  this.translationNotFoundIndicatorLeft = function (indicator) {
	    if (!indicator) {
	      return $notFoundIndicatorLeft;
	    }
	    $notFoundIndicatorLeft = indicator;
	    return this;
	  };
	
	  /**
	   * ngdoc function
	   * @name pascalprecht.translate.$translateProvider#translationNotFoundIndicatorLeft
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Sets an indicator which is used when a translation isn't found right to the
	   * translation id.
	   *
	   * @param {string} indicator An indicator.
	   */
	  this.translationNotFoundIndicatorRight = function (indicator) {
	    if (!indicator) {
	      return $notFoundIndicatorRight;
	    }
	    $notFoundIndicatorRight = indicator;
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#fallbackLanguage
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells the module which of the registered translation tables to use when missing translations
	   * at initial startup by passing a language key. Similar to `$translateProvider#use`
	   * only that it says which language to **fallback**.
	   *
	   * @param {string||array} langKey A language key.
	   *
	   */
	  this.fallbackLanguage = function (langKey) {
	    fallbackStack(langKey);
	    return this;
	  };
	
	  var fallbackStack = function (langKey) {
	    if (langKey) {
	      if (angular.isString(langKey)) {
	        $fallbackWasString = true;
	        $fallbackLanguage = [ langKey ];
	      } else if (angular.isArray(langKey)) {
	        $fallbackWasString = false;
	        $fallbackLanguage = langKey;
	      }
	      if (angular.isString($preferredLanguage)  && indexOf($fallbackLanguage, $preferredLanguage) < 0) {
	        $fallbackLanguage.push($preferredLanguage);
	      }
	
	      return this;
	    } else {
	      if ($fallbackWasString) {
	        return $fallbackLanguage[0];
	      } else {
	        return $fallbackLanguage;
	      }
	    }
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#use
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Set which translation table to use for translation by given language key. When
	   * trying to 'use' a language which isn't provided, it'll throw an error.
	   *
	   * You actually don't have to use this method since `$translateProvider#preferredLanguage`
	   * does the job too.
	   *
	   * @param {string} langKey A language key.
	   */
	  this.use = function (langKey) {
	    if (langKey) {
	      if (!$translationTable[langKey] && (!$loaderFactory)) {
	        // only throw an error, when not loading translation data asynchronously
	        throw new Error('$translateProvider couldn\'t find translationTable for langKey: \'' + langKey + '\'');
	      }
	      $uses = langKey;
	      return this;
	    }
	    return $uses;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#resolveClientLocale
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	   *
	   * @returns {string} the current client/browser language key
	   */
	  this.resolveClientLocale = function () {
	    return getLocale();
	  };
	
	 /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#storageKey
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells the module which key must represent the choosed language by a user in the storage.
	   *
	   * @param {string} key A key for the storage.
	   */
	  var storageKey = function(key) {
	    if (!key) {
	      if ($storagePrefix) {
	        return $storagePrefix + $storageKey;
	      }
	      return $storageKey;
	    }
	    $storageKey = key;
	    return this;
	  };
	
	  this.storageKey = storageKey;
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useUrlLoader
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use `$translateUrlLoader` extension service as loader.
	   *
	   * @param {string} url Url
	   * @param {Object=} options Optional configuration object
	   */
	  this.useUrlLoader = function (url, options) {
	    return this.useLoader('$translateUrlLoader', angular.extend({ url: url }, options));
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useStaticFilesLoader
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use `$translateStaticFilesLoader` extension service as loader.
	   *
	   * @param {Object=} options Optional configuration object
	   */
	  this.useStaticFilesLoader = function (options) {
	    return this.useLoader('$translateStaticFilesLoader', options);
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useLoader
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use any other service as loader.
	   *
	   * @param {string} loaderFactory Factory name to use
	   * @param {Object=} options Optional configuration object
	   */
	  this.useLoader = function (loaderFactory, options) {
	    $loaderFactory = loaderFactory;
	    $loaderOptions = options || {};
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useLocalStorage
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use `$translateLocalStorage` service as storage layer.
	   *
	   */
	  this.useLocalStorage = function () {
	    return this.useStorage('$translateLocalStorage');
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useCookieStorage
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use `$translateCookieStorage` service as storage layer.
	   */
	  this.useCookieStorage = function () {
	    return this.useStorage('$translateCookieStorage');
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useStorage
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use custom service as storage layer.
	   */
	  this.useStorage = function (storageFactory) {
	    $storageFactory = storageFactory;
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#storagePrefix
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Sets prefix for storage key.
	   *
	   * @param {string} prefix Storage key prefix
	   */
	  this.storagePrefix = function (prefix) {
	    if (!prefix) {
	      return prefix;
	    }
	    $storagePrefix = prefix;
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandlerLog
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to use built-in log handler when trying to translate
	   * a translation Id which doesn't exist.
	   *
	   * This is actually a shortcut method for `useMissingTranslationHandler()`.
	   *
	   */
	  this.useMissingTranslationHandlerLog = function () {
	    return this.useMissingTranslationHandler('$translateMissingTranslationHandlerLog');
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useMissingTranslationHandler
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Expects a factory name which later gets instantiated with `$injector`.
	   * This method can be used to tell angular-translate to use a custom
	   * missingTranslationHandler. Just build a factory which returns a function
	   * and expects a translation id as argument.
	   *
	   * Example:
	   * <pre>
	   *  app.config(function ($translateProvider) {
	   *    $translateProvider.useMissingTranslationHandler('customHandler');
	   *  });
	   *
	   *  app.factory('customHandler', function (dep1, dep2) {
	   *    return function (translationId) {
	   *      // something with translationId and dep1 and dep2
	   *    };
	   *  });
	   * </pre>
	   *
	   * @param {string} factory Factory name
	   */
	  this.useMissingTranslationHandler = function (factory) {
	    $missingTranslationHandlerFactory = factory;
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#usePostCompiling
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * If post compiling is enabled, all translated values will be processed
	   * again with AngularJS' $compile.
	   *
	   * Example:
	   * <pre>
	   *  app.config(function ($translateProvider) {
	   *    $translateProvider.usePostCompiling(true);
	   *  });
	   * </pre>
	   *
	   * @param {string} factory Factory name
	   */
	  this.usePostCompiling = function (value) {
	    $postCompilingEnabled = !(!value);
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#forceAsyncReload
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * If force async reload is enabled, async loader will always be called
	   * even if $translationTable already contains the language key, adding
	   * possible new entries to the $translationTable.
	   *
	   * Example:
	   * <pre>
	   *  app.config(function ($translateProvider) {
	   *    $translateProvider.forceAsyncReload(true);
	   *  });
	   * </pre>
	   *
	   * @param {boolean} value - valid values are true or false
	   */
	  this.forceAsyncReload = function (value) {
	    $forceAsyncReloadEnabled = !(!value);
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#uniformLanguageTag
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate which language tag should be used as a result when determining
	   * the current browser language.
	   *
	   * This setting must be set before invoking {@link pascalprecht.translate.$translateProvider#methods_determinePreferredLanguage determinePreferredLanguage()}.
	   *
	   * <pre>
	   * $translateProvider
	   *   .uniformLanguageTag('bcp47')
	   *   .determinePreferredLanguage()
	   * </pre>
	   *
	   * The resolver currently supports:
	   * * default
	   *     (traditionally: hyphens will be converted into underscores, i.e. en-US => en_US)
	   *     en-US => en_US
	   *     en_US => en_US
	   *     en-us => en_us
	   * * java
	   *     like default, but the second part will be always in uppercase
	   *     en-US => en_US
	   *     en_US => en_US
	   *     en-us => en_US
	   * * BCP 47 (RFC 4646 & 4647)
	   *     en-US => en-US
	   *     en_US => en-US
	   *     en-us => en-US
	   *
	   * See also:
	   * * http://en.wikipedia.org/wiki/IETF_language_tag
	   * * http://www.w3.org/International/core/langtags/
	   * * http://tools.ietf.org/html/bcp47
	   *
	   * @param {string|object} options - options (or standard)
	   * @param {string} options.standard - valid values are 'default', 'bcp47', 'java'
	   */
	  this.uniformLanguageTag = function (options) {
	
	    if (!options) {
	      options = {};
	    } else if (angular.isString(options)) {
	      options = {
	        standard: options
	      };
	    }
	
	    uniformLanguageTagResolver = options.standard;
	
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#determinePreferredLanguage
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Tells angular-translate to try to determine on its own which language key
	   * to set as preferred language. When `fn` is given, angular-translate uses it
	   * to determine a language key, otherwise it uses the built-in `getLocale()`
	   * method.
	   *
	   * The `getLocale()` returns a language key in the format `[lang]_[country]` or
	   * `[lang]` depending on what the browser provides.
	   *
	   * Use this method at your own risk, since not all browsers return a valid
	   * locale (see {@link pascalprecht.translate.$translateProvider#methods_uniformLanguageTag uniformLanguageTag()}).
	   *
	   * @param {Function=} fn Function to determine a browser's locale
	   */
	  this.determinePreferredLanguage = function (fn) {
	
	    var locale = (fn && angular.isFunction(fn)) ? fn() : getLocale();
	
	    if (!$availableLanguageKeys.length) {
	      $preferredLanguage = locale;
	    } else {
	      $preferredLanguage = negotiateLocale(locale) || locale;
	    }
	
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#registerAvailableLanguageKeys
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Registers a set of language keys the app will work with. Use this method in
	   * combination with
	   * {@link pascalprecht.translate.$translateProvider#determinePreferredLanguage determinePreferredLanguage}.
	   * When available languages keys are registered, angular-translate
	   * tries to find the best fitting language key depending on the browsers locale,
	   * considering your language key convention.
	   *
	   * @param {object} languageKeys Array of language keys the your app will use
	   * @param {object=} aliases Alias map.
	   */
	  this.registerAvailableLanguageKeys = function (languageKeys, aliases) {
	    if (languageKeys) {
	      $availableLanguageKeys = languageKeys;
	      if (aliases) {
	        $languageKeyAliases = aliases;
	      }
	      return this;
	    }
	    return $availableLanguageKeys;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#useLoaderCache
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Registers a cache for internal $http based loaders.
	   * {@link pascalprecht.translate.$translationCache $translationCache}.
	   * When false the cache will be disabled (default). When true or undefined
	   * the cache will be a default (see $cacheFactory). When an object it will
	   * be treat as a cache object itself: the usage is $http({cache: cache})
	   *
	   * @param {object} cache boolean, string or cache-object
	   */
	  this.useLoaderCache = function (cache) {
	    if (cache === false) {
	      // disable cache
	      loaderCache = undefined;
	    } else if (cache === true) {
	      // enable cache using AJS defaults
	      loaderCache = true;
	    } else if (typeof(cache) === 'undefined') {
	      // enable cache using default
	      loaderCache = '$translationCache';
	    } else if (cache) {
	      // enable cache using given one (see $cacheFactory)
	      loaderCache = cache;
	    }
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#directivePriority
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Sets the default priority of the translate directive. The standard value is `0`.
	   * Calling this function without an argument will return the current value.
	   *
	   * @param {number} priority for the translate-directive
	   */
	  this.directivePriority = function (priority) {
	    if (priority === undefined) {
	      // getter
	      return directivePriority;
	    } else {
	      // setter with chaining
	      directivePriority = priority;
	      return this;
	    }
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#statefulFilter
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * Since AngularJS 1.3, filters which are not stateless (depending at the scope)
	   * have to explicit define this behavior.
	   * Sets whether the translate filter should be stateful or stateless. The standard value is `true`
	   * meaning being stateful.
	   * Calling this function without an argument will return the current value.
	   *
	   * @param {boolean} state - defines the state of the filter
	   */
	  this.statefulFilter = function (state) {
	    if (state === undefined) {
	      // getter
	      return statefulFilter;
	    } else {
	      // setter with chaining
	      statefulFilter = state;
	      return this;
	    }
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#postProcess
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * The post processor will be intercept right after the translation result. It can modify the result.
	   *
	   * @param {object} fn Function or service name (string) to be called after the translation value has been set / resolved. The function itself will enrich every value being processed and then continue the normal resolver process
	   */
	  this.postProcess = function (fn) {
	    if (fn) {
	      postProcessFn = fn;
	    } else {
	      postProcessFn = undefined;
	    }
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateProvider#keepContent
	   * @methodOf pascalprecht.translate.$translateProvider
	   *
	   * @description
	   * If keepContent is set to true than translate directive will always use innerHTML
	   * as a default translation
	   *
	   * Example:
	   * <pre>
	   *  app.config(function ($translateProvider) {
	   *    $translateProvider.keepContent(true);
	   *  });
	   * </pre>
	   *
	   * @param {boolean} value - valid values are true or false
	   */
	  this.keepContent = function (value) {
	    $keepContent = !(!value);
	    return this;
	  };
	
	  /**
	   * @ngdoc object
	   * @name pascalprecht.translate.$translate
	   * @requires $interpolate
	   * @requires $log
	   * @requires $rootScope
	   * @requires $q
	   *
	   * @description
	   * The `$translate` service is the actual core of angular-translate. It expects a translation id
	   * and optional interpolate parameters to translate contents.
	   *
	   * <pre>
	   *  $translate('HEADLINE_TEXT').then(function (translation) {
	   *    $scope.translatedText = translation;
	   *  });
	   * </pre>
	   *
	   * @param {string|array} translationId A token which represents a translation id
	   *                                     This can be optionally an array of translation ids which
	   *                                     results that the function returns an object where each key
	   *                                     is the translation id and the value the translation.
	   * @param {object=} interpolateParams An object hash for dynamic values
	   * @param {string} interpolationId The id of the interpolation to use
	   * @param {string} defaultTranslationText the optional default translation text that is written as
	   *                                        as default text in case it is not found in any configured language
	   * @param {string} forceLanguage A language to be used instead of the current language
	   * @returns {object} promise
	   */
	  this.$get = [
	    '$log',
	    '$injector',
	    '$rootScope',
	    '$q',
	    function ($log, $injector, $rootScope, $q) {
	
	      var Storage,
	          defaultInterpolator = $injector.get($interpolationFactory || '$translateDefaultInterpolation'),
	          pendingLoader = false,
	          interpolatorHashMap = {},
	          langPromises = {},
	          fallbackIndex,
	          startFallbackIteration;
	
	      var $translate = function (translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage) {
	        if (!$uses && $preferredLanguage) {
	          $uses = $preferredLanguage;
	        }
	        var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
	              (negotiateLocale(forceLanguage) || forceLanguage) : $uses;
	
	        // Check forceLanguage is present
	        if (forceLanguage) {
	          loadTranslationsIfMissing(forceLanguage);
	        }
	
	        // Duck detection: If the first argument is an array, a bunch of translations was requested.
	        // The result is an object.
	        if (angular.isArray(translationId)) {
	          // Inspired by Q.allSettled by Kris Kowal
	          // https://github.com/kriskowal/q/blob/b0fa72980717dc202ffc3cbf03b936e10ebbb9d7/q.js#L1553-1563
	          // This transforms all promises regardless resolved or rejected
	          var translateAll = function (translationIds) {
	            var results = {}; // storing the actual results
	            var promises = []; // promises to wait for
	            // Wraps the promise a) being always resolved and b) storing the link id->value
	            var translate = function (translationId) {
	              var deferred = $q.defer();
	              var regardless = function (value) {
	                results[translationId] = value;
	                deferred.resolve([translationId, value]);
	              };
	              // we don't care whether the promise was resolved or rejected; just store the values
	              $translate(translationId, interpolateParams, interpolationId, defaultTranslationText, forceLanguage).then(regardless, regardless);
	              return deferred.promise;
	            };
	            for (var i = 0, c = translationIds.length; i < c; i++) {
	              promises.push(translate(translationIds[i]));
	            }
	            // wait for all (including storing to results)
	            return $q.all(promises).then(function () {
	              // return the results
	              return results;
	            });
	          };
	          return translateAll(translationId);
	        }
	
	        var deferred = $q.defer();
	
	        // trim off any whitespace
	        if (translationId) {
	          translationId = trim.apply(translationId);
	        }
	
	        var promiseToWaitFor = (function () {
	          var promise = $preferredLanguage ?
	            langPromises[$preferredLanguage] :
	            langPromises[uses];
	
	          fallbackIndex = 0;
	
	          if ($storageFactory && !promise) {
	            // looks like there's no pending promise for $preferredLanguage or
	            // $uses. Maybe there's one pending for a language that comes from
	            // storage.
	            var langKey = Storage.get($storageKey);
	            promise = langPromises[langKey];
	
	            if ($fallbackLanguage && $fallbackLanguage.length) {
	                var index = indexOf($fallbackLanguage, langKey);
	                // maybe the language from storage is also defined as fallback language
	                // we increase the fallback language index to not search in that language
	                // as fallback, since it's probably the first used language
	                // in that case the index starts after the first element
	                fallbackIndex = (index === 0) ? 1 : 0;
	
	                // but we can make sure to ALWAYS fallback to preferred language at least
	                if (indexOf($fallbackLanguage, $preferredLanguage) < 0) {
	                  $fallbackLanguage.push($preferredLanguage);
	                }
	            }
	          }
	          return promise;
	        }());
	
	        if (!promiseToWaitFor) {
	          // no promise to wait for? okay. Then there's no loader registered
	          // nor is a one pending for language that comes from storage.
	          // We can just translate.
	          determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses).then(deferred.resolve, deferred.reject);
	        } else {
	          var promiseResolved = function () {
	            // $uses may have changed while waiting
	            if (!forceLanguage) {
	              uses = $uses;
	            }
	            determineTranslation(translationId, interpolateParams, interpolationId, defaultTranslationText, uses).then(deferred.resolve, deferred.reject);
	          };
	          promiseResolved.displayName = 'promiseResolved';
	
	          promiseToWaitFor['finally'](promiseResolved);
	        }
	        return deferred.promise;
	      };
	
	      /**
	       * @name applyNotFoundIndicators
	       * @private
	       *
	       * @description
	       * Applies not fount indicators to given translation id, if needed.
	       * This function gets only executed, if a translation id doesn't exist,
	       * which is why a translation id is expected as argument.
	       *
	       * @param {string} translationId Translation id.
	       * @returns {string} Same as given translation id but applied with not found
	       * indicators.
	       */
	      var applyNotFoundIndicators = function (translationId) {
	        // applying notFoundIndicators
	        if ($notFoundIndicatorLeft) {
	          translationId = [$notFoundIndicatorLeft, translationId].join(' ');
	        }
	        if ($notFoundIndicatorRight) {
	          translationId = [translationId, $notFoundIndicatorRight].join(' ');
	        }
	        return translationId;
	      };
	
	      /**
	       * @name useLanguage
	       * @private
	       *
	       * @description
	       * Makes actual use of a language by setting a given language key as used
	       * language and informs registered interpolators to also use the given
	       * key as locale.
	       *
	       * @param {string} key Locale key.
	       */
	      var useLanguage = function (key) {
	        $uses = key;
	
	        // make sure to store new language key before triggering success event
	        if ($storageFactory) {
	          Storage.put($translate.storageKey(), $uses);
	        }
	
	        $rootScope.$emit('$translateChangeSuccess', {language: key});
	
	        // inform default interpolator
	        defaultInterpolator.setLocale($uses);
	
	        var eachInterpolator = function (interpolator, id) {
	          interpolatorHashMap[id].setLocale($uses);
	        };
	        eachInterpolator.displayName = 'eachInterpolatorLocaleSetter';
	
	        // inform all others too!
	        angular.forEach(interpolatorHashMap, eachInterpolator);
	        $rootScope.$emit('$translateChangeEnd', {language: key});
	      };
	
	      /**
	       * @name loadAsync
	       * @private
	       *
	       * @description
	       * Kicks of registered async loader using `$injector` and applies existing
	       * loader options. When resolved, it updates translation tables accordingly
	       * or rejects with given language key.
	       *
	       * @param {string} key Language key.
	       * @return {Promise} A promise.
	       */
	      var loadAsync = function (key) {
	        if (!key) {
	          throw 'No language key specified for loading.';
	        }
	
	        var deferred = $q.defer();
	
	        $rootScope.$emit('$translateLoadingStart', {language: key});
	        pendingLoader = true;
	
	        var cache = loaderCache;
	        if (typeof(cache) === 'string') {
	          // getting on-demand instance of loader
	          cache = $injector.get(cache);
	        }
	
	        var loaderOptions = angular.extend({}, $loaderOptions, {
	          key: key,
	          $http: angular.extend({}, {
	            cache: cache
	          }, $loaderOptions.$http)
	        });
	
	        var onLoaderSuccess = function (data) {
	          var translationTable = {};
	          $rootScope.$emit('$translateLoadingSuccess', {language: key});
	
	          if (angular.isArray(data)) {
	            angular.forEach(data, function (table) {
	              angular.extend(translationTable, flatObject(table));
	            });
	          } else {
	            angular.extend(translationTable, flatObject(data));
	          }
	          pendingLoader = false;
	          deferred.resolve({
	            key: key,
	            table: translationTable
	          });
	          $rootScope.$emit('$translateLoadingEnd', {language: key});
	        };
	        onLoaderSuccess.displayName = 'onLoaderSuccess';
	
	        var onLoaderError = function (key) {
	          $rootScope.$emit('$translateLoadingError', {language: key});
	          deferred.reject(key);
	          $rootScope.$emit('$translateLoadingEnd', {language: key});
	        };
	        onLoaderError.displayName = 'onLoaderError';
	
	        $injector.get($loaderFactory)(loaderOptions)
	          .then(onLoaderSuccess, onLoaderError);
	
	        return deferred.promise;
	      };
	
	      if ($storageFactory) {
	        Storage = $injector.get($storageFactory);
	
	        if (!Storage.get || !Storage.put) {
	          throw new Error('Couldn\'t use storage \'' + $storageFactory + '\', missing get() or put() method!');
	        }
	      }
	
	      // if we have additional interpolations that were added via
	      // $translateProvider.addInterpolation(), we have to map'em
	      if ($interpolatorFactories.length) {
	        var eachInterpolationFactory = function (interpolatorFactory) {
	          var interpolator = $injector.get(interpolatorFactory);
	          // setting initial locale for each interpolation service
	          interpolator.setLocale($preferredLanguage || $uses);
	          // make'em recognizable through id
	          interpolatorHashMap[interpolator.getInterpolationIdentifier()] = interpolator;
	        };
	        eachInterpolationFactory.displayName = 'interpolationFactoryAdder';
	
	        angular.forEach($interpolatorFactories, eachInterpolationFactory);
	      }
	
	      /**
	       * @name getTranslationTable
	       * @private
	       *
	       * @description
	       * Returns a promise that resolves to the translation table
	       * or is rejected if an error occurred.
	       *
	       * @param langKey
	       * @returns {Q.promise}
	       */
	      var getTranslationTable = function (langKey) {
	        var deferred = $q.defer();
	        if (Object.prototype.hasOwnProperty.call($translationTable, langKey)) {
	          deferred.resolve($translationTable[langKey]);
	        } else if (langPromises[langKey]) {
	          var onResolve = function (data) {
	            translations(data.key, data.table);
	            deferred.resolve(data.table);
	          };
	          onResolve.displayName = 'translationTableResolver';
	          langPromises[langKey].then(onResolve, deferred.reject);
	        } else {
	          deferred.reject();
	        }
	        return deferred.promise;
	      };
	
	      /**
	       * @name getFallbackTranslation
	       * @private
	       *
	       * @description
	       * Returns a promise that will resolve to the translation
	       * or be rejected if no translation was found for the language.
	       * This function is currently only used for fallback language translation.
	       *
	       * @param langKey The language to translate to.
	       * @param translationId
	       * @param interpolateParams
	       * @param Interpolator
	       * @returns {Q.promise}
	       */
	      var getFallbackTranslation = function (langKey, translationId, interpolateParams, Interpolator) {
	        var deferred = $q.defer();
	
	        var onResolve = function (translationTable) {
	          if (Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
	            Interpolator.setLocale(langKey);
	            var translation = translationTable[translationId];
	            if (translation.substr(0, 2) === '@:') {
	              getFallbackTranslation(langKey, translation.substr(2), interpolateParams, Interpolator)
	                .then(deferred.resolve, deferred.reject);
	            } else {
	              var interpolatedValue = Interpolator.interpolate(translationTable[translationId], interpolateParams);
	              interpolatedValue = applyPostProcessing(translationId, translationTable[translationId], interpolatedValue, interpolateParams, langKey);
	
	              deferred.resolve(interpolatedValue);
	
	            }
	            Interpolator.setLocale($uses);
	          } else {
	            deferred.reject();
	          }
	        };
	        onResolve.displayName = 'fallbackTranslationResolver';
	
	        getTranslationTable(langKey).then(onResolve, deferred.reject);
	
	        return deferred.promise;
	      };
	
	      /**
	       * @name getFallbackTranslationInstant
	       * @private
	       *
	       * @description
	       * Returns a translation
	       * This function is currently only used for fallback language translation.
	       *
	       * @param langKey The language to translate to.
	       * @param translationId
	       * @param interpolateParams
	       * @param Interpolator
	       * @returns {string} translation
	       */
	      var getFallbackTranslationInstant = function (langKey, translationId, interpolateParams, Interpolator) {
	        var result, translationTable = $translationTable[langKey];
	
	        if (translationTable && Object.prototype.hasOwnProperty.call(translationTable, translationId)) {
	          Interpolator.setLocale(langKey);
	          result = Interpolator.interpolate(translationTable[translationId], interpolateParams);
	          result = applyPostProcessing(translationId, translationTable[translationId], result, interpolateParams, langKey);
	          if (result.substr(0, 2) === '@:') {
	            return getFallbackTranslationInstant(langKey, result.substr(2), interpolateParams, Interpolator);
	          }
	          Interpolator.setLocale($uses);
	        }
	
	        return result;
	      };
	
	
	      /**
	       * @name translateByHandler
	       * @private
	       *
	       * Translate by missing translation handler.
	       *
	       * @param translationId
	       * @param interpolateParams
	       * @param defaultTranslationText
	       * @returns translation created by $missingTranslationHandler or translationId is $missingTranslationHandler is
	       * absent
	       */
	      var translateByHandler = function (translationId, interpolateParams, defaultTranslationText) {
	        // If we have a handler factory - we might also call it here to determine if it provides
	        // a default text for a translationid that can't be found anywhere in our tables
	        if ($missingTranslationHandlerFactory) {
	          var resultString = $injector.get($missingTranslationHandlerFactory)(translationId, $uses, interpolateParams, defaultTranslationText);
	          if (resultString !== undefined) {
	            return resultString;
	          } else {
	            return translationId;
	          }
	        } else {
	          return translationId;
	        }
	      };
	
	      /**
	       * @name resolveForFallbackLanguage
	       * @private
	       *
	       * Recursive helper function for fallbackTranslation that will sequentially look
	       * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
	       *
	       * @param fallbackLanguageIndex
	       * @param translationId
	       * @param interpolateParams
	       * @param Interpolator
	       * @returns {Q.promise} Promise that will resolve to the translation.
	       */
	      var resolveForFallbackLanguage = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator, defaultTranslationText) {
	        var deferred = $q.defer();
	
	        if (fallbackLanguageIndex < $fallbackLanguage.length) {
	          var langKey = $fallbackLanguage[fallbackLanguageIndex];
	          getFallbackTranslation(langKey, translationId, interpolateParams, Interpolator).then(
	            function (data) {
	                deferred.resolve(data);
	            },
	            function () {
	              // Look in the next fallback language for a translation.
	              // It delays the resolving by passing another promise to resolve.
	              return resolveForFallbackLanguage(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator, defaultTranslationText).then(deferred.resolve, deferred.reject);
	            }
	          );
	        } else {
	          // No translation found in any fallback language
	          // if a default translation text is set in the directive, then return this as a result
	          if (defaultTranslationText) {
	            deferred.resolve(defaultTranslationText);
	          } else {
	            // if no default translation is set and an error handler is defined, send it to the handler
	            // and then return the result
	            if ($missingTranslationHandlerFactory) {
	              deferred.resolve(translateByHandler(translationId, interpolateParams));
	            } else {
	              deferred.reject(translateByHandler(translationId, interpolateParams));
	            }
	
	          }
	        }
	        return deferred.promise;
	      };
	
	      /**
	       * @name resolveForFallbackLanguageInstant
	       * @private
	       *
	       * Recursive helper function for fallbackTranslation that will sequentially look
	       * for a translation in the fallbackLanguages starting with fallbackLanguageIndex.
	       *
	       * @param fallbackLanguageIndex
	       * @param translationId
	       * @param interpolateParams
	       * @param Interpolator
	       * @returns {string} translation
	       */
	      var resolveForFallbackLanguageInstant = function (fallbackLanguageIndex, translationId, interpolateParams, Interpolator) {
	        var result;
	
	        if (fallbackLanguageIndex < $fallbackLanguage.length) {
	          var langKey = $fallbackLanguage[fallbackLanguageIndex];
	          result = getFallbackTranslationInstant(langKey, translationId, interpolateParams, Interpolator);
	          if (!result) {
	            result = resolveForFallbackLanguageInstant(fallbackLanguageIndex + 1, translationId, interpolateParams, Interpolator);
	          }
	        }
	        return result;
	      };
	
	      /**
	       * Translates with the usage of the fallback languages.
	       *
	       * @param translationId
	       * @param interpolateParams
	       * @param Interpolator
	       * @returns {Q.promise} Promise, that resolves to the translation.
	       */
	      var fallbackTranslation = function (translationId, interpolateParams, Interpolator, defaultTranslationText) {
	        // Start with the fallbackLanguage with index 0
	        return resolveForFallbackLanguage((startFallbackIteration>0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator, defaultTranslationText);
	      };
	
	      /**
	       * Translates with the usage of the fallback languages.
	       *
	       * @param translationId
	       * @param interpolateParams
	       * @param Interpolator
	       * @returns {String} translation
	       */
	      var fallbackTranslationInstant = function (translationId, interpolateParams, Interpolator) {
	        // Start with the fallbackLanguage with index 0
	        return resolveForFallbackLanguageInstant((startFallbackIteration>0 ? startFallbackIteration : fallbackIndex), translationId, interpolateParams, Interpolator);
	      };
	
	      var determineTranslation = function (translationId, interpolateParams, interpolationId, defaultTranslationText, uses) {
	
	        var deferred = $q.defer();
	
	        var table = uses ? $translationTable[uses] : $translationTable,
	            Interpolator = (interpolationId) ? interpolatorHashMap[interpolationId] : defaultInterpolator;
	
	        // if the translation id exists, we can just interpolate it
	        if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
	          var translation = table[translationId];
	
	          // If using link, rerun $translate with linked translationId and return it
	          if (translation.substr(0, 2) === '@:') {
	
	            $translate(translation.substr(2), interpolateParams, interpolationId, defaultTranslationText, uses)
	              .then(deferred.resolve, deferred.reject);
	          } else {
	            //
	            var resolvedTranslation = Interpolator.interpolate(translation, interpolateParams);
	            resolvedTranslation = applyPostProcessing(translationId, translation, resolvedTranslation, interpolateParams, uses);
	            deferred.resolve(resolvedTranslation);
	          }
	        } else {
	          var missingTranslationHandlerTranslation;
	          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
	          if ($missingTranslationHandlerFactory && !pendingLoader) {
	            missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams, defaultTranslationText);
	          }
	
	          // since we couldn't translate the inital requested translation id,
	          // we try it now with one or more fallback languages, if fallback language(s) is
	          // configured.
	          if (uses && $fallbackLanguage && $fallbackLanguage.length) {
	            fallbackTranslation(translationId, interpolateParams, Interpolator, defaultTranslationText)
	                .then(function (translation) {
	                  deferred.resolve(translation);
	                }, function (_translationId) {
	                  deferred.reject(applyNotFoundIndicators(_translationId));
	                });
	          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
	            // looks like the requested translation id doesn't exists.
	            // Now, if there is a registered handler for missing translations and no
	            // asyncLoader is pending, we execute the handler
	            if (defaultTranslationText) {
	              deferred.resolve(defaultTranslationText);
	              } else {
	                deferred.resolve(missingTranslationHandlerTranslation);
	              }
	          } else {
	            if (defaultTranslationText) {
	              deferred.resolve(defaultTranslationText);
	            } else {
	              deferred.reject(applyNotFoundIndicators(translationId));
	            }
	          }
	        }
	        return deferred.promise;
	      };
	
	      var determineTranslationInstant = function (translationId, interpolateParams, interpolationId, uses) {
	
	        var result, table = uses ? $translationTable[uses] : $translationTable,
	            Interpolator = defaultInterpolator;
	
	        // if the interpolation id exists use custom interpolator
	        if (interpolatorHashMap && Object.prototype.hasOwnProperty.call(interpolatorHashMap, interpolationId)) {
	          Interpolator = interpolatorHashMap[interpolationId];
	        }
	
	        // if the translation id exists, we can just interpolate it
	        if (table && Object.prototype.hasOwnProperty.call(table, translationId)) {
	          var translation = table[translationId];
	
	          // If using link, rerun $translate with linked translationId and return it
	          if (translation.substr(0, 2) === '@:') {
	            result = determineTranslationInstant(translation.substr(2), interpolateParams, interpolationId, uses);
	          } else {
	            result = Interpolator.interpolate(translation, interpolateParams);
	            result = applyPostProcessing(translationId, translation, result, interpolateParams, uses);
	          }
	        } else {
	          var missingTranslationHandlerTranslation;
	          // for logging purposes only (as in $translateMissingTranslationHandlerLog), value is not returned to promise
	          if ($missingTranslationHandlerFactory && !pendingLoader) {
	            missingTranslationHandlerTranslation = translateByHandler(translationId, interpolateParams);
	          }
	
	          // since we couldn't translate the inital requested translation id,
	          // we try it now with one or more fallback languages, if fallback language(s) is
	          // configured.
	          if (uses && $fallbackLanguage && $fallbackLanguage.length) {
	            fallbackIndex = 0;
	            result = fallbackTranslationInstant(translationId, interpolateParams, Interpolator);
	          } else if ($missingTranslationHandlerFactory && !pendingLoader && missingTranslationHandlerTranslation) {
	            // looks like the requested translation id doesn't exists.
	            // Now, if there is a registered handler for missing translations and no
	            // asyncLoader is pending, we execute the handler
	            result = missingTranslationHandlerTranslation;
	          } else {
	            result = applyNotFoundIndicators(translationId);
	          }
	        }
	
	        return result;
	      };
	
	      var clearNextLangAndPromise = function(key) {
	        if ($nextLang === key) {
	          $nextLang = undefined;
	        }
	        langPromises[key] = undefined;
	      };
	
	      var applyPostProcessing = function (translationId, translation, resolvedTranslation, interpolateParams, uses) {
	        var fn = postProcessFn;
	
	        if (fn) {
	
	          if (typeof(fn) === 'string') {
	            // getting on-demand instance
	            fn = $injector.get(fn);
	          }
	          if (fn) {
	            return fn(translationId, translation, resolvedTranslation, interpolateParams, uses);
	          }
	        }
	
	        return resolvedTranslation;
	      };
	
	      var loadTranslationsIfMissing = function (key) {
	        if (!$translationTable[key] && $loaderFactory && !langPromises[key]) {
	          langPromises[key] = loadAsync(key).then(function (translation) {
	            translations(translation.key, translation.table);
	            return translation;
	          });
	        }
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#preferredLanguage
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the language key for the preferred language.
	       *
	       * @param {string} langKey language String or Array to be used as preferredLanguage (changing at runtime)
	       *
	       * @return {string} preferred language key
	       */
	      $translate.preferredLanguage = function (langKey) {
	        if(langKey) {
	          setupPreferredLanguage(langKey);
	        }
	        return $preferredLanguage;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#cloakClassName
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the configured class name for `translate-cloak` directive.
	       *
	       * @return {string} cloakClassName
	       */
	      $translate.cloakClassName = function () {
	        return $cloakClassName;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#nestedObjectDelimeter
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the configured delimiter for nested namespaces.
	       *
	       * @return {string} nestedObjectDelimeter
	       */
	      $translate.nestedObjectDelimeter = function () {
	        return $nestedObjectDelimeter;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#fallbackLanguage
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the language key for the fallback languages or sets a new fallback stack.
	       *
	       * @param {string=} langKey language String or Array of fallback languages to be used (to change stack at runtime)
	       *
	       * @return {string||array} fallback language key
	       */
	      $translate.fallbackLanguage = function (langKey) {
	        if (langKey !== undefined && langKey !== null) {
	          fallbackStack(langKey);
	
	          // as we might have an async loader initiated and a new translation language might have been defined
	          // we need to add the promise to the stack also. So - iterate.
	          if ($loaderFactory) {
	            if ($fallbackLanguage && $fallbackLanguage.length) {
	              for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
	                if (!langPromises[$fallbackLanguage[i]]) {
	                  langPromises[$fallbackLanguage[i]] = loadAsync($fallbackLanguage[i]);
	                }
	              }
	            }
	          }
	          $translate.use($translate.use());
	        }
	        if ($fallbackWasString) {
	          return $fallbackLanguage[0];
	        } else {
	          return $fallbackLanguage;
	        }
	
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#useFallbackLanguage
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Sets the first key of the fallback language stack to be used for translation.
	       * Therefore all languages in the fallback array BEFORE this key will be skipped!
	       *
	       * @param {string=} langKey Contains the langKey the iteration shall start with. Set to false if you want to
	       * get back to the whole stack
	       */
	      $translate.useFallbackLanguage = function (langKey) {
	        if (langKey !== undefined && langKey !== null) {
	          if (!langKey) {
	            startFallbackIteration = 0;
	          } else {
	            var langKeyPosition = indexOf($fallbackLanguage, langKey);
	            if (langKeyPosition > -1) {
	              startFallbackIteration = langKeyPosition;
	            }
	          }
	
	        }
	
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#proposedLanguage
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the language key of language that is currently loaded asynchronously.
	       *
	       * @return {string} language key
	       */
	      $translate.proposedLanguage = function () {
	        return $nextLang;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#storage
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns registered storage.
	       *
	       * @return {object} Storage
	       */
	      $translate.storage = function () {
	        return Storage;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#negotiateLocale
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns a language key based on available languages and language aliases. If a
	       * language key cannot be resolved, returns undefined.
	       *
	       * If no or a falsy key is given, returns undefined.
	       *
	       * @param {string} [key] Language key
	       * @return {string|undefined} Language key or undefined if no language key is found.
	       */
	      $translate.negotiateLocale = negotiateLocale;
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#use
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Tells angular-translate which language to use by given language key. This method is
	       * used to change language at runtime. It also takes care of storing the language
	       * key in a configured store to let your app remember the choosed language.
	       *
	       * When trying to 'use' a language which isn't available it tries to load it
	       * asynchronously with registered loaders.
	       *
	       * Returns promise object with loaded language file data or string of the currently used language.
	       *
	       * If no or a falsy key is given it returns the currently used language key.
	       * The returned string will be ```undefined``` if setting up $translate hasn't finished.
	       * @example
	       * $translate.use("en_US").then(function(data){
	       *   $scope.text = $translate("HELLO");
	       * });
	       *
	       * @param {string} [key] Language key
	       * @return {object|string} Promise with loaded language data or the language key if a falsy param was given.
	       */
	      $translate.use = function (key) {
	        if (!key) {
	          return $uses;
	        }
	
	        var deferred = $q.defer();
	
	        $rootScope.$emit('$translateChangeStart', {language: key});
	
	        // Try to get the aliased language key
	        var aliasedKey = negotiateLocale(key);
	        // Ensure only registered language keys will be loaded
	        if ($availableLanguageKeys.length > 0 && !aliasedKey) {
	          return $q.reject(key);
	        }
	
	        if (aliasedKey) {
	          key = aliasedKey;
	        }
	
	        // if there isn't a translation table for the language we've requested,
	        // we load it asynchronously
	        $nextLang = key;
	        if (($forceAsyncReloadEnabled || !$translationTable[key]) && $loaderFactory && !langPromises[key]) {
	          langPromises[key] = loadAsync(key).then(function (translation) {
	            translations(translation.key, translation.table);
	            deferred.resolve(translation.key);
	            if ($nextLang === key) {
	              useLanguage(translation.key);
	            }
	            return translation;
	          }, function (key) {
	            $rootScope.$emit('$translateChangeError', {language: key});
	            deferred.reject(key);
	            $rootScope.$emit('$translateChangeEnd', {language: key});
	            return $q.reject(key);
	          });
	          langPromises[key]['finally'](function () {
	            clearNextLangAndPromise(key);
	          });
	        } else if (langPromises[key]) {
	          // we are already loading this asynchronously
	          // resolve our new deferred when the old langPromise is resolved
	          langPromises[key].then(function (translation) {
	            if ($nextLang === translation.key) {
	              useLanguage(translation.key);
	            }
	            deferred.resolve(translation.key);
	            return translation;
	          }, function (key) {
	            // find first available fallback language if that request has failed
	            if (!$uses && $fallbackLanguage && $fallbackLanguage.length > 0) {
	              return $translate.use($fallbackLanguage[0]).then(deferred.resolve, deferred.reject);
	            } else {
	              return deferred.reject(key);
	            }
	          });
	        } else {
	          deferred.resolve(key);
	          useLanguage(key);
	        }
	
	        return deferred.promise;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#resolveClientLocale
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * This returns the current browser/client's language key. The result is processed with the configured uniform tag resolver.
	       *
	       * @returns {string} the current client/browser language key
	       */
	      $translate.resolveClientLocale = function () {
	        return getLocale();
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#storageKey
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the key for the storage.
	       *
	       * @return {string} storage key
	       */
	      $translate.storageKey = function () {
	        return storageKey();
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#isPostCompilingEnabled
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns whether post compiling is enabled or not
	       *
	       * @return {bool} storage key
	       */
	      $translate.isPostCompilingEnabled = function () {
	        return $postCompilingEnabled;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#isForceAsyncReloadEnabled
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns whether force async reload is enabled or not
	       *
	       * @return {boolean} forceAsyncReload value
	       */
	      $translate.isForceAsyncReloadEnabled = function () {
	        return $forceAsyncReloadEnabled;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#isKeepContent
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns whether keepContent or not
	       *
	       * @return {boolean} keepContent value
	       */
	      $translate.isKeepContent = function () {
	        return $keepContent;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#refresh
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Refreshes a translation table pointed by the given langKey. If langKey is not specified,
	       * the module will drop all existent translation tables and load new version of those which
	       * are currently in use.
	       *
	       * Refresh means that the module will drop target translation table and try to load it again.
	       *
	       * In case there are no loaders registered the refresh() method will throw an Error.
	       *
	       * If the module is able to refresh translation tables refresh() method will broadcast
	       * $translateRefreshStart and $translateRefreshEnd events.
	       *
	       * @example
	       * // this will drop all currently existent translation tables and reload those which are
	       * // currently in use
	       * $translate.refresh();
	       * // this will refresh a translation table for the en_US language
	       * $translate.refresh('en_US');
	       *
	       * @param {string} langKey A language key of the table, which has to be refreshed
	       *
	       * @return {promise} Promise, which will be resolved in case a translation tables refreshing
	       * process is finished successfully, and reject if not.
	       */
	      $translate.refresh = function (langKey) {
	        if (!$loaderFactory) {
	          throw new Error('Couldn\'t refresh translation table, no loader registered!');
	        }
	
	        var deferred = $q.defer();
	
	        function resolve() {
	          deferred.resolve();
	          $rootScope.$emit('$translateRefreshEnd', {language: langKey});
	        }
	
	        function reject() {
	          deferred.reject();
	          $rootScope.$emit('$translateRefreshEnd', {language: langKey});
	        }
	
	        $rootScope.$emit('$translateRefreshStart', {language: langKey});
	
	        if (!langKey) {
	          // if there's no language key specified we refresh ALL THE THINGS!
	          var tables = [], loadingKeys = {};
	
	          // reload registered fallback languages
	          if ($fallbackLanguage && $fallbackLanguage.length) {
	            for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
	              tables.push(loadAsync($fallbackLanguage[i]));
	              loadingKeys[$fallbackLanguage[i]] = true;
	            }
	          }
	
	          // reload currently used language
	          if ($uses && !loadingKeys[$uses]) {
	            tables.push(loadAsync($uses));
	          }
	
	          var allTranslationsLoaded = function (tableData) {
	            $translationTable = {};
	            angular.forEach(tableData, function (data) {
	              translations(data.key, data.table);
	            });
	            if ($uses) {
	              useLanguage($uses);
	            }
	            resolve();
	          };
	          allTranslationsLoaded.displayName = 'refreshPostProcessor';
	
	          $q.all(tables).then(allTranslationsLoaded, reject);
	
	        } else if ($translationTable[langKey]) {
	
	          var oneTranslationsLoaded = function (data) {
	            translations(data.key, data.table);
	            if (langKey === $uses) {
	              useLanguage($uses);
	            }
	            resolve();
	            return data;
	          };
	          oneTranslationsLoaded.displayName = 'refreshPostProcessor';
	
	          loadAsync(langKey).then(oneTranslationsLoaded, reject);
	
	        } else {
	          reject();
	        }
	        return deferred.promise;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#instant
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns a translation instantly from the internal state of loaded translation. All rules
	       * regarding the current language, the preferred language of even fallback languages will be
	       * used except any promise handling. If a language was not found, an asynchronous loading
	       * will be invoked in the background.
	       *
	       * @param {string|array} translationId A token which represents a translation id
	       *                                     This can be optionally an array of translation ids which
	       *                                     results that the function's promise returns an object where
	       *                                     each key is the translation id and the value the translation.
	       * @param {object} interpolateParams Params
	       * @param {string} interpolationId The id of the interpolation to use
	       * @param {string} forceLanguage A language to be used instead of the current language
	       *
	       * @return {string|object} translation
	       */
	      $translate.instant = function (translationId, interpolateParams, interpolationId, forceLanguage) {
	
	        // we don't want to re-negotiate $uses
	        var uses = (forceLanguage && forceLanguage !== $uses) ? // we don't want to re-negotiate $uses
	              (negotiateLocale(forceLanguage) || forceLanguage) : $uses;
	
	        // Detect undefined and null values to shorten the execution and prevent exceptions
	        if (translationId === null || angular.isUndefined(translationId)) {
	          return translationId;
	        }
	
	        // Check forceLanguage is present
	        if (forceLanguage) {
	          loadTranslationsIfMissing(forceLanguage);
	        }
	
	        // Duck detection: If the first argument is an array, a bunch of translations was requested.
	        // The result is an object.
	        if (angular.isArray(translationId)) {
	          var results = {};
	          for (var i = 0, c = translationId.length; i < c; i++) {
	            results[translationId[i]] = $translate.instant(translationId[i], interpolateParams, interpolationId, forceLanguage);
	          }
	          return results;
	        }
	
	        // We discarded unacceptable values. So we just need to verify if translationId is empty String
	        if (angular.isString(translationId) && translationId.length < 1) {
	          return translationId;
	        }
	
	        // trim off any whitespace
	        if (translationId) {
	          translationId = trim.apply(translationId);
	        }
	
	        var result, possibleLangKeys = [];
	        if ($preferredLanguage) {
	          possibleLangKeys.push($preferredLanguage);
	        }
	        if (uses) {
	          possibleLangKeys.push(uses);
	        }
	        if ($fallbackLanguage && $fallbackLanguage.length) {
	          possibleLangKeys = possibleLangKeys.concat($fallbackLanguage);
	        }
	        for (var j = 0, d = possibleLangKeys.length; j < d; j++) {
	          var possibleLangKey = possibleLangKeys[j];
	          if ($translationTable[possibleLangKey]) {
	            if (typeof $translationTable[possibleLangKey][translationId] !== 'undefined') {
	              result = determineTranslationInstant(translationId, interpolateParams, interpolationId, uses);
	            }
	          }
	          if (typeof result !== 'undefined') {
	            break;
	          }
	        }
	
	        if (!result && result !== '') {
	          if ($notFoundIndicatorLeft || $notFoundIndicatorRight) {
	            result = applyNotFoundIndicators(translationId);
	          } else {
	            // Return translation of default interpolator if not found anything.
	            result = defaultInterpolator.interpolate(translationId, interpolateParams);
	            if ($missingTranslationHandlerFactory && !pendingLoader) {
	              result = translateByHandler(translationId, interpolateParams);
	            }
	          }
	        }
	
	        return result;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#versionInfo
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the current version information for the angular-translate library
	       *
	       * @return {string} angular-translate version
	       */
	      $translate.versionInfo = function () {
	        return version;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#loaderCache
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns the defined loaderCache.
	       *
	       * @return {boolean|string|object} current value of loaderCache
	       */
	      $translate.loaderCache = function () {
	        return loaderCache;
	      };
	
	      // internal purpose only
	      $translate.directivePriority = function () {
	        return directivePriority;
	      };
	
	      // internal purpose only
	      $translate.statefulFilter = function () {
	        return statefulFilter;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#isReady
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns whether the service is "ready" to translate (i.e. loading 1st language).
	       *
	       * See also {@link pascalprecht.translate.$translate#methods_onReady onReady()}.
	       *
	       * @return {boolean} current value of ready
	       */
	      $translate.isReady = function () {
	        return $isReady;
	      };
	
	      var $onReadyDeferred = $q.defer();
	      $onReadyDeferred.promise.then(function () {
	        $isReady = true;
	      });
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#onReady
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * Returns whether the service is "ready" to translate (i.e. loading 1st language).
	       *
	       * See also {@link pascalprecht.translate.$translate#methods_isReady isReady()}.
	       *
	       * @param {Function=} fn Function to invoke when service is ready
	       * @return {object} Promise resolved when service is ready
	       */
	      $translate.onReady = function (fn) {
	        var deferred = $q.defer();
	        if (angular.isFunction(fn)) {
	          deferred.promise.then(fn);
	        }
	        if ($isReady) {
	          deferred.resolve();
	        } else {
	          $onReadyDeferred.promise.then(deferred.resolve);
	        }
	        return deferred.promise;
	      };
	
	      /**
	       * @ngdoc function
	       * @name pascalprecht.translate.$translate#getAvailableLanguageKeys
	       * @methodOf pascalprecht.translate.$translate
	       *
	       * @description
	       * This function simply returns the registered language keys being defined before in the config phase
	       * With this, an application can use the array to provide a language selection dropdown or similar
	       * without any additional effort
	       *
	       * @returns {object} returns the list of possibly registered language keys and mapping or null if not defined
	       */
	      $translate.getAvailableLanguageKeys = function () {
	        if ($availableLanguageKeys.length > 0) {
	          return $availableLanguageKeys;
	        }
	        return null;
	      };
	
	      // Whenever $translateReady is being fired, this will ensure the state of $isReady
	      var globalOnReadyListener = $rootScope.$on('$translateReady', function () {
	        $onReadyDeferred.resolve();
	        globalOnReadyListener(); // one time only
	        globalOnReadyListener = null;
	      });
	      var globalOnChangeListener = $rootScope.$on('$translateChangeEnd', function () {
	        $onReadyDeferred.resolve();
	        globalOnChangeListener(); // one time only
	        globalOnChangeListener = null;
	      });
	
	      if ($loaderFactory) {
	
	        // If at least one async loader is defined and there are no
	        // (default) translations available we should try to load them.
	        if (angular.equals($translationTable, {})) {
	          if ($translate.use()) {
	            $translate.use($translate.use());
	          }
	        }
	
	        // Also, if there are any fallback language registered, we start
	        // loading them asynchronously as soon as we can.
	        if ($fallbackLanguage && $fallbackLanguage.length) {
	          var processAsyncResult = function (translation) {
	            translations(translation.key, translation.table);
	            $rootScope.$emit('$translateChangeEnd', { language: translation.key });
	            return translation;
	          };
	          for (var i = 0, len = $fallbackLanguage.length; i < len; i++) {
	            var fallbackLanguageId = $fallbackLanguage[i];
	            if ($forceAsyncReloadEnabled || !$translationTable[fallbackLanguageId]) {
	              langPromises[fallbackLanguageId] = loadAsync(fallbackLanguageId).then(processAsyncResult);
	            }
	          }
	        }
	      } else {
	        $rootScope.$emit('$translateReady', { language: $translate.use() });
	      }
	
	      return $translate;
	    }
	  ];
	}
	
	$translate.displayName = 'displayName';
	
	/**
	 * @ngdoc object
	 * @name pascalprecht.translate.$translateDefaultInterpolation
	 * @requires $interpolate
	 *
	 * @description
	 * Uses angular's `$interpolate` services to interpolate strings against some values.
	 *
	 * Be aware to configure a proper sanitization strategy.
	 *
	 * See also:
	 * * {@link pascalprecht.translate.$translateSanitization}
	 *
	 * @return {object} $translateDefaultInterpolation Interpolator service
	 */
	angular.module('pascalprecht.translate').factory('$translateDefaultInterpolation', $translateDefaultInterpolation);
	
	function $translateDefaultInterpolation ($interpolate, $translateSanitization) {
	
	  'use strict';
	
	  var $translateInterpolator = {},
	      $locale,
	      $identifier = 'default';
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateDefaultInterpolation#setLocale
	   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
	   *
	   * @description
	   * Sets current locale (this is currently not use in this interpolation).
	   *
	   * @param {string} locale Language key or locale.
	   */
	  $translateInterpolator.setLocale = function (locale) {
	    $locale = locale;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateDefaultInterpolation#getInterpolationIdentifier
	   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
	   *
	   * @description
	   * Returns an identifier for this interpolation service.
	   *
	   * @returns {string} $identifier
	   */
	  $translateInterpolator.getInterpolationIdentifier = function () {
	    return $identifier;
	  };
	
	  /**
	   * @deprecated will be removed in 3.0
	   * @see {@link pascalprecht.translate.$translateSanitization}
	   */
	  $translateInterpolator.useSanitizeValueStrategy = function (value) {
	    $translateSanitization.useStrategy(value);
	    return this;
	  };
	
	  /**
	   * @ngdoc function
	   * @name pascalprecht.translate.$translateDefaultInterpolation#interpolate
	   * @methodOf pascalprecht.translate.$translateDefaultInterpolation
	   *
	   * @description
	   * Interpolates given value agains given interpolate params using angulars
	   * `$interpolate` service.
	   *
	   * Since AngularJS 1.5, `value` must not be a string but can be anything input.
	   *
	   * @returns {string} interpolated string.
	   */
	  $translateInterpolator.interpolate = function (value, interpolationParams) {
	    interpolationParams = interpolationParams || {};
	    interpolationParams = $translateSanitization.sanitize(interpolationParams, 'params');
	
	    var interpolatedText;
	    if (angular.isNumber(value)) {
	      // numbers are safe
	      interpolatedText = '' + value;
	    } else if (angular.isString(value)) {
	      // strings must be interpolated (that's the job here)
	      interpolatedText = $interpolate(value)(interpolationParams);
	      interpolatedText = $translateSanitization.sanitize(interpolatedText, 'text');
	    } else {
	      // neither a number or a string, cant interpolate => empty string
	      interpolatedText = '';
	    }
	
	    return interpolatedText;
	  };
	
	  return $translateInterpolator;
	}
	
	$translateDefaultInterpolation.displayName = '$translateDefaultInterpolation';
	
	angular.module('pascalprecht.translate').constant('$STORAGE_KEY', 'NG_TRANSLATE_LANG_KEY');
	
	angular.module('pascalprecht.translate')
	/**
	 * @ngdoc directive
	 * @name pascalprecht.translate.directive:translate
	 * @requires $compile
	 * @requires $filter
	 * @requires $interpolate
	 * @restrict AE
	 *
	 * @description
	 * Translates given translation id either through attribute or DOM content.
	 * Internally it uses `translate` filter to translate translation id. It possible to
	 * pass an optional `translate-values` object literal as string into translation id.
	 *
	 * @param {string=} translate Translation id which could be either string or interpolated string.
	 * @param {string=} translate-values Values to pass into translation id. Can be passed as object literal string or interpolated object.
	 * @param {string=} translate-attr-ATTR translate Translation id and put it into ATTR attribute.
	 * @param {string=} translate-default will be used unless translation was successful
	 * @param {boolean=} translate-compile (default true if present) defines locally activation of {@link pascalprecht.translate.$translateProvider#methods_usePostCompiling}
	 * @param {boolean=} translate-keep-content (default true if present) defines that in case a KEY could not be translated, that the existing content is left in the innerHTML}
	 *
	 * @example
	   <example module="ngView">
	    <file name="index.html">
	      <div ng-controller="TranslateCtrl">
	
	        <pre translate="TRANSLATION_ID"></pre>
	        <pre translate>TRANSLATION_ID</pre>
	        <pre translate translate-attr-title="TRANSLATION_ID"></pre>
	        <pre translate="{{translationId}}"></pre>
	        <pre translate>{{translationId}}</pre>
	        <pre translate="WITH_VALUES" translate-values="{value: 5}"></pre>
	        <pre translate translate-values="{value: 5}">WITH_VALUES</pre>
	        <pre translate="WITH_VALUES" translate-values="{{values}}"></pre>
	        <pre translate translate-values="{{values}}">WITH_VALUES</pre>
	        <pre translate translate-attr-title="WITH_VALUES" translate-values="{{values}}"></pre>
	        <pre translate="WITH_CAMEL_CASE_KEY" translate-value-camel-case-key="Hi"></pre>
	
	      </div>
	    </file>
	    <file name="script.js">
	      angular.module('ngView', ['pascalprecht.translate'])
	
	      .config(function ($translateProvider) {
	
	        $translateProvider.translations('en',{
	          'TRANSLATION_ID': 'Hello there!',
	          'WITH_VALUES': 'The following value is dynamic: {{value}}',
	          'WITH_CAMEL_CASE_KEY': 'The interpolation key is camel cased: {{camelCaseKey}}'
	        }).preferredLanguage('en');
	
	      });
	
	      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
	        $scope.translationId = 'TRANSLATION_ID';
	
	        $scope.values = {
	          value: 78
	        };
	      });
	    </file>
	    <file name="scenario.js">
	      it('should translate', function () {
	        inject(function ($rootScope, $compile) {
	          $rootScope.translationId = 'TRANSLATION_ID';
	
	          element = $compile('<p translate="TRANSLATION_ID"></p>')($rootScope);
	          $rootScope.$digest();
	          expect(element.text()).toBe('Hello there!');
	
	          element = $compile('<p translate="{{translationId}}"></p>')($rootScope);
	          $rootScope.$digest();
	          expect(element.text()).toBe('Hello there!');
	
	          element = $compile('<p translate>TRANSLATION_ID</p>')($rootScope);
	          $rootScope.$digest();
	          expect(element.text()).toBe('Hello there!');
	
	          element = $compile('<p translate>{{translationId}}</p>')($rootScope);
	          $rootScope.$digest();
	          expect(element.text()).toBe('Hello there!');
	
	          element = $compile('<p translate translate-attr-title="TRANSLATION_ID"></p>')($rootScope);
	          $rootScope.$digest();
	          expect(element.attr('title')).toBe('Hello there!');
	
	          element = $compile('<p translate="WITH_CAMEL_CASE_KEY" translate-value-camel-case-key="Hello"></p>')($rootScope);
	          $rootScope.$digest();
	          expect(element.text()).toBe('The interpolation key is camel cased: Hello');
	        });
	      });
	    </file>
	   </example>
	 */
	.directive('translate', translateDirective);
	function translateDirective($translate, $q, $interpolate, $compile, $parse, $rootScope) {
	
	  'use strict';
	
	  /**
	   * @name trim
	   * @private
	   *
	   * @description
	   * trim polyfill
	   *
	   * @returns {string} The string stripped of whitespace from both ends
	   */
	  var trim = function() {
	    return this.toString().replace(/^\s+|\s+$/g, '');
	  };
	
	  return {
	    restrict: 'AE',
	    scope: true,
	    priority: $translate.directivePriority(),
	    compile: function (tElement, tAttr) {
	
	      var translateValuesExist = (tAttr.translateValues) ?
	        tAttr.translateValues : undefined;
	
	      var translateInterpolation = (tAttr.translateInterpolation) ?
	        tAttr.translateInterpolation : undefined;
	
	      var translateValueExist = tElement[0].outerHTML.match(/translate-value-+/i);
	
	      var interpolateRegExp = '^(.*)(' + $interpolate.startSymbol() + '.*' + $interpolate.endSymbol() + ')(.*)',
	          watcherRegExp = '^(.*)' + $interpolate.startSymbol() + '(.*)' + $interpolate.endSymbol() + '(.*)';
	
	      return function linkFn(scope, iElement, iAttr) {
	
	        scope.interpolateParams = {};
	        scope.preText = '';
	        scope.postText = '';
	        scope.translateNamespace = getTranslateNamespace(scope);
	        var translationIds = {};
	
	        var initInterpolationParams = function (interpolateParams, iAttr, tAttr) {
	          // initial setup
	          if (iAttr.translateValues) {
	            angular.extend(interpolateParams, $parse(iAttr.translateValues)(scope.$parent));
	          }
	          // initially fetch all attributes if existing and fill the params
	          if (translateValueExist) {
	            for (var attr in tAttr) {
	              if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
	                var attributeName = angular.lowercase(attr.substr(14, 1)) + attr.substr(15);
	                interpolateParams[attributeName] = tAttr[attr];
	              }
	            }
	          }
	        };
	
	        // Ensures any change of the attribute "translate" containing the id will
	        // be re-stored to the scope's "translationId".
	        // If the attribute has no content, the element's text value (white spaces trimmed off) will be used.
	        var observeElementTranslation = function (translationId) {
	
	          // Remove any old watcher
	          if (angular.isFunction(observeElementTranslation._unwatchOld)) {
	            observeElementTranslation._unwatchOld();
	            observeElementTranslation._unwatchOld = undefined;
	          }
	
	          if (angular.equals(translationId , '') || !angular.isDefined(translationId)) {
	            var iElementText = trim.apply(iElement.text());
	
	            // Resolve translation id by inner html if required
	            var interpolateMatches = iElementText.match(interpolateRegExp);
	            // Interpolate translation id if required
	            if (angular.isArray(interpolateMatches)) {
	              scope.preText = interpolateMatches[1];
	              scope.postText = interpolateMatches[3];
	              translationIds.translate = $interpolate(interpolateMatches[2])(scope.$parent);
	              var watcherMatches = iElementText.match(watcherRegExp);
	              if (angular.isArray(watcherMatches) && watcherMatches[2] && watcherMatches[2].length) {
	                observeElementTranslation._unwatchOld = scope.$watch(watcherMatches[2], function (newValue) {
	                  translationIds.translate = newValue;
	                  updateTranslations();
	                });
	              }
	            } else {
	              // do not assigne the translation id if it is empty.
	              translationIds.translate = !iElementText ? undefined : iElementText;
	            }
	          } else {
	            translationIds.translate = translationId;
	          }
	          updateTranslations();
	        };
	
	        var observeAttributeTranslation = function (translateAttr) {
	          iAttr.$observe(translateAttr, function (translationId) {
	            translationIds[translateAttr] = translationId;
	            updateTranslations();
	          });
	        };
	
	        // initial setup with values
	        initInterpolationParams(scope.interpolateParams, iAttr, tAttr);
	
	        var firstAttributeChangedEvent = true;
	        iAttr.$observe('translate', function (translationId) {
	          if (typeof translationId === 'undefined') {
	            // case of element "<translate>xyz</translate>"
	            observeElementTranslation('');
	          } else {
	            // case of regular attribute
	            if (translationId !== '' || !firstAttributeChangedEvent) {
	              translationIds.translate = translationId;
	              updateTranslations();
	            }
	          }
	          firstAttributeChangedEvent = false;
	        });
	
	        for (var translateAttr in iAttr) {
	          if (iAttr.hasOwnProperty(translateAttr) && translateAttr.substr(0, 13) === 'translateAttr') {
	            observeAttributeTranslation(translateAttr);
	          }
	        }
	
	        iAttr.$observe('translateDefault', function (value) {
	          scope.defaultText = value;
	          updateTranslations();
	        });
	
	        if (translateValuesExist) {
	          iAttr.$observe('translateValues', function (interpolateParams) {
	            if (interpolateParams) {
	              scope.$parent.$watch(function () {
	                angular.extend(scope.interpolateParams, $parse(interpolateParams)(scope.$parent));
	              });
	            }
	          });
	        }
	
	        if (translateValueExist) {
	          var observeValueAttribute = function (attrName) {
	            iAttr.$observe(attrName, function (value) {
	              var attributeName = angular.lowercase(attrName.substr(14, 1)) + attrName.substr(15);
	              scope.interpolateParams[attributeName] = value;
	            });
	          };
	          for (var attr in iAttr) {
	            if (Object.prototype.hasOwnProperty.call(iAttr, attr) && attr.substr(0, 14) === 'translateValue' && attr !== 'translateValues') {
	              observeValueAttribute(attr);
	            }
	          }
	        }
	
	        // Master update function
	        var updateTranslations = function () {
	          for (var key in translationIds) {
	            if (translationIds.hasOwnProperty(key) && translationIds[key] !== undefined) {
	              updateTranslation(key, translationIds[key], scope, scope.interpolateParams, scope.defaultText, scope.translateNamespace);
	            }
	          }
	        };
	
	        // Put translation processing function outside loop
	        var updateTranslation = function(translateAttr, translationId, scope, interpolateParams, defaultTranslationText, translateNamespace) {
	          if (translationId) {
	            // if translation id starts with '.' and translateNamespace given, prepend namespace
	            if (translateNamespace && translationId.charAt(0) === '.') {
	              translationId = translateNamespace + translationId;
	            }
	
	            $translate(translationId, interpolateParams, translateInterpolation, defaultTranslationText, scope.translateLanguage)
	              .then(function (translation) {
	                applyTranslation(translation, scope, true, translateAttr);
	              }, function (translationId) {
	                applyTranslation(translationId, scope, false, translateAttr);
	              });
	          } else {
	            // as an empty string cannot be translated, we can solve this using successful=false
	            applyTranslation(translationId, scope, false, translateAttr);
	          }
	        };
	
	        var applyTranslation = function (value, scope, successful, translateAttr) {
	          if (!successful) {
	            if (typeof scope.defaultText !== 'undefined') {
	              value = scope.defaultText;
	            }
	          }
	          if (translateAttr === 'translate') {
	            // default translate into innerHTML
	            if (successful || (!successful && !$translate.isKeepContent() && typeof iAttr.translateKeepContent === 'undefined')) {
	              iElement.empty().append(scope.preText + value + scope.postText);
	            }
	            var globallyEnabled = $translate.isPostCompilingEnabled();
	            var locallyDefined = typeof tAttr.translateCompile !== 'undefined';
	            var locallyEnabled = locallyDefined && tAttr.translateCompile !== 'false';
	            if ((globallyEnabled && !locallyDefined) || locallyEnabled) {
	              $compile(iElement.contents())(scope);
	            }
	          } else {
	            // translate attribute
	            var attributeName = iAttr.$attr[translateAttr];
	            if (attributeName.substr(0, 5) === 'data-') {
	              // ensure html5 data prefix is stripped
	              attributeName = attributeName.substr(5);
	            }
	            attributeName = attributeName.substr(15);
	            iElement.attr(attributeName, value);
	          }
	        };
	
	        if (translateValuesExist || translateValueExist || iAttr.translateDefault) {
	          scope.$watch('interpolateParams', updateTranslations, true);
	        }
	
	        // Replaced watcher on translateLanguage with event listener
	        var unbindTranslateLanguage = scope.$on('translateLanguageChanged', updateTranslations);
	
	        // Ensures the text will be refreshed after the current language was changed
	        // w/ $translate.use(...)
	        var unbind = $rootScope.$on('$translateChangeSuccess', updateTranslations);
	
	        // ensure translation will be looked up at least one
	        if (iElement.text().length) {
	          if (iAttr.translate) {
	            observeElementTranslation(iAttr.translate);
	          } else {
	            observeElementTranslation('');
	          }
	        } else if (iAttr.translate) {
	          // ensure attribute will be not skipped
	          observeElementTranslation(iAttr.translate);
	        }
	        updateTranslations();
	        scope.$on('$destroy', function(){
	          unbindTranslateLanguage();
	          unbind();
	        });
	      };
	    }
	  };
	}
	
	/**
	 * Returns the scope's namespace.
	 * @private
	 * @param scope
	 * @returns {string}
	 */
	function getTranslateNamespace(scope) {
	  'use strict';
	  if (scope.translateNamespace) {
	    return scope.translateNamespace;
	  }
	  if (scope.$parent) {
	    return getTranslateNamespace(scope.$parent);
	  }
	}
	
	translateDirective.displayName = 'translateDirective';
	
	angular.module('pascalprecht.translate')
	/**
	 * @ngdoc directive
	 * @name pascalprecht.translate.directive:translateCloak
	 * @requires $rootScope
	 * @requires $translate
	 * @restrict A
	 *
	 * $description
	 * Adds a `translate-cloak` class name to the given element where this directive
	 * is applied initially and removes it, once a loader has finished loading.
	 *
	 * This directive can be used to prevent initial flickering when loading translation
	 * data asynchronously.
	 *
	 * The class name is defined in
	 * {@link pascalprecht.translate.$translateProvider#cloakClassName $translate.cloakClassName()}.
	 *
	 * @param {string=} translate-cloak If a translationId is provided, it will be used for showing
	 *                                  or hiding the cloak. Basically it relies on the translation
	 *                                  resolve.
	 */
	.directive('translateCloak', translateCloakDirective);
	
	function translateCloakDirective($translate, $rootScope) {
	
	  'use strict';
	
	  return {
	    compile: function (tElement) {
	      var applyCloak = function () {
	        tElement.addClass($translate.cloakClassName());
	      },
	      removeCloak = function () {
	        tElement.removeClass($translate.cloakClassName());
	      };
	      $translate.onReady(function () {
	        removeCloak();
	      });
	      applyCloak();
	
	      return function linkFn(scope, iElement, iAttr) {
	        if (iAttr.translateCloak && iAttr.translateCloak.length) {
	          // Register a watcher for the defined translation allowing a fine tuned cloak
	          iAttr.$observe('translateCloak', function (translationId) {
	            $translate(translationId).then(removeCloak, applyCloak);
	          });
	          // Register for change events as this is being another indicicator revalidating the cloak)
	          $rootScope.$on('$translateChangeSuccess', function () {
	            $translate(iAttr.translateCloak).then(removeCloak, applyCloak);
	          });
	        }
	      };
	    }
	  };
	}
	
	translateCloakDirective.displayName = 'translateCloakDirective';
	
	angular.module('pascalprecht.translate')
	/**
	 * @ngdoc directive
	 * @name pascalprecht.translate.directive:translateNamespace
	 * @restrict A
	 *
	 * @description
	 * Translates given translation id either through attribute or DOM content.
	 * Internally it uses `translate` filter to translate translation id. It possible to
	 * pass an optional `translate-values` object literal as string into translation id.
	 *
	 * @param {string=} translate namespace name which could be either string or interpolated string.
	 *
	 * @example
	   <example module="ngView">
	    <file name="index.html">
	      <div translate-namespace="CONTENT">
	
	        <div>
	            <h1 translate>.HEADERS.TITLE</h1>
	            <h1 translate>.HEADERS.WELCOME</h1>
	        </div>
	
	        <div translate-namespace=".HEADERS">
	            <h1 translate>.TITLE</h1>
	            <h1 translate>.WELCOME</h1>
	        </div>
	
	      </div>
	    </file>
	    <file name="script.js">
	      angular.module('ngView', ['pascalprecht.translate'])
	
	      .config(function ($translateProvider) {
	
	        $translateProvider.translations('en',{
	          'TRANSLATION_ID': 'Hello there!',
	          'CONTENT': {
	            'HEADERS': {
	                TITLE: 'Title'
	            }
	          },
	          'CONTENT.HEADERS.WELCOME': 'Welcome'
	        }).preferredLanguage('en');
	
	      });
	
	    </file>
	   </example>
	 */
	.directive('translateNamespace', translateNamespaceDirective);
	
	function translateNamespaceDirective() {
	
	  'use strict';
	
	  return {
	    restrict: 'A',
	    scope: true,
	    compile: function () {
	      return {
	        pre: function (scope, iElement, iAttrs) {
	          scope.translateNamespace = getTranslateNamespace(scope);
	
	          if (scope.translateNamespace && iAttrs.translateNamespace.charAt(0) === '.') {
	            scope.translateNamespace += iAttrs.translateNamespace;
	          } else {
	            scope.translateNamespace = iAttrs.translateNamespace;
	          }
	        }
	      };
	    }
	  };
	}
	
	/**
	 * Returns the scope's namespace.
	 * @private
	 * @param scope
	 * @returns {string}
	 */
	function getTranslateNamespace(scope) {
	  'use strict';
	  if (scope.translateNamespace) {
	    return scope.translateNamespace;
	  }
	  if (scope.$parent) {
	    return getTranslateNamespace(scope.$parent);
	  }
	}
	
	translateNamespaceDirective.displayName = 'translateNamespaceDirective';
	
	angular.module('pascalprecht.translate')
	/**
	 * @ngdoc directive
	 * @name pascalprecht.translate.directive:translateLanguage
	 * @restrict A
	 *
	 * @description
	 * Forces the language to the directives in the underlying scope.
	 *
	 * @param {string=} translate language that will be negotiated.
	 *
	 * @example
	   <example module="ngView">
	    <file name="index.html">
	      <div>
	
	        <div>
	            <h1 translate>HELLO</h1>
	        </div>
	
	        <div translate-language="de">
	            <h1 translate>HELLO</h1>
	        </div>
	
	      </div>
	    </file>
	    <file name="script.js">
	      angular.module('ngView', ['pascalprecht.translate'])
	
	      .config(function ($translateProvider) {
	
	        $translateProvider
	          .translations('en',{
	            'HELLO': 'Hello world!'
	          })
	          .translations('de',{
	            'HELLO': 'Hallo Welt!'
	          })
	          .preferredLanguage('en');
	
	      });
	
	    </file>
	   </example>
	 */
	.directive('translateLanguage', translateLanguageDirective);
	
	function translateLanguageDirective() {
	
	  'use strict';
	
	  return {
	    restrict: 'A',
	    scope: true,
	    compile: function () {
	      return function linkFn(scope, iElement, iAttrs) {
	
	        iAttrs.$observe('translateLanguage', function (newTranslateLanguage) {
	          scope.translateLanguage = newTranslateLanguage;
	        });
	
	        scope.$watch('translateLanguage', function(){
	          scope.$broadcast('translateLanguageChanged');
	        });
	      };
	    }
	  };
	}
	
	translateLanguageDirective.displayName = 'translateLanguageDirective';
	
	angular.module('pascalprecht.translate')
	/**
	 * @ngdoc filter
	 * @name pascalprecht.translate.filter:translate
	 * @requires $parse
	 * @requires pascalprecht.translate.$translate
	 * @function
	 *
	 * @description
	 * Uses `$translate` service to translate contents. Accepts interpolate parameters
	 * to pass dynamized values though translation.
	 *
	 * @param {string} translationId A translation id to be translated.
	 * @param {*=} interpolateParams Optional object literal (as hash or string) to pass values into translation.
	 *
	 * @returns {string} Translated text.
	 *
	 * @example
	   <example module="ngView">
	    <file name="index.html">
	      <div ng-controller="TranslateCtrl">
	
	        <pre>{{ 'TRANSLATION_ID' | translate }}</pre>
	        <pre>{{ translationId | translate }}</pre>
	        <pre>{{ 'WITH_VALUES' | translate:'{value: 5}' }}</pre>
	        <pre>{{ 'WITH_VALUES' | translate:values }}</pre>
	
	      </div>
	    </file>
	    <file name="script.js">
	      angular.module('ngView', ['pascalprecht.translate'])
	
	      .config(function ($translateProvider) {
	
	        $translateProvider.translations('en', {
	          'TRANSLATION_ID': 'Hello there!',
	          'WITH_VALUES': 'The following value is dynamic: {{value}}'
	        });
	        $translateProvider.preferredLanguage('en');
	
	      });
	
	      angular.module('ngView').controller('TranslateCtrl', function ($scope) {
	        $scope.translationId = 'TRANSLATION_ID';
	
	        $scope.values = {
	          value: 78
	        };
	      });
	    </file>
	   </example>
	 */
	.filter('translate', translateFilterFactory);
	
	function translateFilterFactory($parse, $translate) {
	
	  'use strict';
	
	  var translateFilter = function (translationId, interpolateParams, interpolation, forceLanguage) {
	    if (!angular.isObject(interpolateParams)) {
	      interpolateParams = $parse(interpolateParams)(this);
	    }
	
	    return $translate.instant(translationId, interpolateParams, interpolation, forceLanguage);
	  };
	
	  if ($translate.statefulFilter()) {
	    translateFilter.$stateful = true;
	  }
	
	  return translateFilter;
	}
	
	translateFilterFactory.displayName = 'translateFilterFactory';
	
	angular.module('pascalprecht.translate')
	
	/**
	 * @ngdoc object
	 * @name pascalprecht.translate.$translationCache
	 * @requires $cacheFactory
	 *
	 * @description
	 * The first time a translation table is used, it is loaded in the translation cache for quick retrieval. You
	 * can load translation tables directly into the cache by consuming the
	 * `$translationCache` service directly.
	 *
	 * @return {object} $cacheFactory object.
	 */
	  .factory('$translationCache', $translationCache);
	
	function $translationCache($cacheFactory) {
	
	  'use strict';
	
	  return $cacheFactory('translations');
	}
	
	$translationCache.displayName = '$translationCache';
	return 'pascalprecht.translate';
	
	}));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(9);
	module.exports = 'ngCookies';


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * @license AngularJS v1.5.8
	 * (c) 2010-2016 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
	(function(window, angular) {'use strict';
	
	/**
	 * @ngdoc module
	 * @name ngCookies
	 * @description
	 *
	 * # ngCookies
	 *
	 * The `ngCookies` module provides a convenient wrapper for reading and writing browser cookies.
	 *
	 *
	 * <div doc-module-components="ngCookies"></div>
	 *
	 * See {@link ngCookies.$cookies `$cookies`} for usage.
	 */
	
	
	angular.module('ngCookies', ['ng']).
	  /**
	   * @ngdoc provider
	   * @name $cookiesProvider
	   * @description
	   * Use `$cookiesProvider` to change the default behavior of the {@link ngCookies.$cookies $cookies} service.
	   * */
	   provider('$cookies', [function $CookiesProvider() {
	    /**
	     * @ngdoc property
	     * @name $cookiesProvider#defaults
	     * @description
	     *
	     * Object containing default options to pass when setting cookies.
	     *
	     * The object may have following properties:
	     *
	     * - **path** - `{string}` - The cookie will be available only for this path and its
	     *   sub-paths. By default, this is the URL that appears in your `<base>` tag.
	     * - **domain** - `{string}` - The cookie will be available only for this domain and
	     *   its sub-domains. For security reasons the user agent will not accept the cookie
	     *   if the current domain is not a sub-domain of this domain or equal to it.
	     * - **expires** - `{string|Date}` - String of the form "Wdy, DD Mon YYYY HH:MM:SS GMT"
	     *   or a Date object indicating the exact date/time this cookie will expire.
	     * - **secure** - `{boolean}` - If `true`, then the cookie will only be available through a
	     *   secured connection.
	     *
	     * Note: By default, the address that appears in your `<base>` tag will be used as the path.
	     * This is important so that cookies will be visible for all routes when html5mode is enabled.
	     *
	     **/
	    var defaults = this.defaults = {};
	
	    function calcOptions(options) {
	      return options ? angular.extend({}, defaults, options) : defaults;
	    }
	
	    /**
	     * @ngdoc service
	     * @name $cookies
	     *
	     * @description
	     * Provides read/write access to browser's cookies.
	     *
	     * <div class="alert alert-info">
	     * Up until Angular 1.3, `$cookies` exposed properties that represented the
	     * current browser cookie values. In version 1.4, this behavior has changed, and
	     * `$cookies` now provides a standard api of getters, setters etc.
	     * </div>
	     *
	     * Requires the {@link ngCookies `ngCookies`} module to be installed.
	     *
	     * @example
	     *
	     * ```js
	     * angular.module('cookiesExample', ['ngCookies'])
	     *   .controller('ExampleController', ['$cookies', function($cookies) {
	     *     // Retrieving a cookie
	     *     var favoriteCookie = $cookies.get('myFavorite');
	     *     // Setting a cookie
	     *     $cookies.put('myFavorite', 'oatmeal');
	     *   }]);
	     * ```
	     */
	    this.$get = ['$$cookieReader', '$$cookieWriter', function($$cookieReader, $$cookieWriter) {
	      return {
	        /**
	         * @ngdoc method
	         * @name $cookies#get
	         *
	         * @description
	         * Returns the value of given cookie key
	         *
	         * @param {string} key Id to use for lookup.
	         * @returns {string} Raw cookie value.
	         */
	        get: function(key) {
	          return $$cookieReader()[key];
	        },
	
	        /**
	         * @ngdoc method
	         * @name $cookies#getObject
	         *
	         * @description
	         * Returns the deserialized value of given cookie key
	         *
	         * @param {string} key Id to use for lookup.
	         * @returns {Object} Deserialized cookie value.
	         */
	        getObject: function(key) {
	          var value = this.get(key);
	          return value ? angular.fromJson(value) : value;
	        },
	
	        /**
	         * @ngdoc method
	         * @name $cookies#getAll
	         *
	         * @description
	         * Returns a key value object with all the cookies
	         *
	         * @returns {Object} All cookies
	         */
	        getAll: function() {
	          return $$cookieReader();
	        },
	
	        /**
	         * @ngdoc method
	         * @name $cookies#put
	         *
	         * @description
	         * Sets a value for given cookie key
	         *
	         * @param {string} key Id for the `value`.
	         * @param {string} value Raw value to be stored.
	         * @param {Object=} options Options object.
	         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
	         */
	        put: function(key, value, options) {
	          $$cookieWriter(key, value, calcOptions(options));
	        },
	
	        /**
	         * @ngdoc method
	         * @name $cookies#putObject
	         *
	         * @description
	         * Serializes and sets a value for given cookie key
	         *
	         * @param {string} key Id for the `value`.
	         * @param {Object} value Value to be stored.
	         * @param {Object=} options Options object.
	         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
	         */
	        putObject: function(key, value, options) {
	          this.put(key, angular.toJson(value), options);
	        },
	
	        /**
	         * @ngdoc method
	         * @name $cookies#remove
	         *
	         * @description
	         * Remove given cookie
	         *
	         * @param {string} key Id of the key-value pair to delete.
	         * @param {Object=} options Options object.
	         *    See {@link ngCookies.$cookiesProvider#defaults $cookiesProvider.defaults}
	         */
	        remove: function(key, options) {
	          $$cookieWriter(key, undefined, calcOptions(options));
	        }
	      };
	    }];
	  }]);
	
	angular.module('ngCookies').
	/**
	 * @ngdoc service
	 * @name $cookieStore
	 * @deprecated
	 * @requires $cookies
	 *
	 * @description
	 * Provides a key-value (string-object) storage, that is backed by session cookies.
	 * Objects put or retrieved from this storage are automatically serialized or
	 * deserialized by angular's toJson/fromJson.
	 *
	 * Requires the {@link ngCookies `ngCookies`} module to be installed.
	 *
	 * <div class="alert alert-danger">
	 * **Note:** The $cookieStore service is **deprecated**.
	 * Please use the {@link ngCookies.$cookies `$cookies`} service instead.
	 * </div>
	 *
	 * @example
	 *
	 * ```js
	 * angular.module('cookieStoreExample', ['ngCookies'])
	 *   .controller('ExampleController', ['$cookieStore', function($cookieStore) {
	 *     // Put cookie
	 *     $cookieStore.put('myFavorite','oatmeal');
	 *     // Get cookie
	 *     var favoriteCookie = $cookieStore.get('myFavorite');
	 *     // Removing a cookie
	 *     $cookieStore.remove('myFavorite');
	 *   }]);
	 * ```
	 */
	 factory('$cookieStore', ['$cookies', function($cookies) {
	
	    return {
	      /**
	       * @ngdoc method
	       * @name $cookieStore#get
	       *
	       * @description
	       * Returns the value of given cookie key
	       *
	       * @param {string} key Id to use for lookup.
	       * @returns {Object} Deserialized cookie value, undefined if the cookie does not exist.
	       */
	      get: function(key) {
	        return $cookies.getObject(key);
	      },
	
	      /**
	       * @ngdoc method
	       * @name $cookieStore#put
	       *
	       * @description
	       * Sets a value for given cookie key
	       *
	       * @param {string} key Id for the `value`.
	       * @param {Object} value Value to be stored.
	       */
	      put: function(key, value) {
	        $cookies.putObject(key, value);
	      },
	
	      /**
	       * @ngdoc method
	       * @name $cookieStore#remove
	       *
	       * @description
	       * Remove given cookie
	       *
	       * @param {string} key Id of the key-value pair to delete.
	       */
	      remove: function(key) {
	        $cookies.remove(key);
	      }
	    };
	
	  }]);
	
	/**
	 * @name $$cookieWriter
	 * @requires $document
	 *
	 * @description
	 * This is a private service for writing cookies
	 *
	 * @param {string} name Cookie name
	 * @param {string=} value Cookie value (if undefined, cookie will be deleted)
	 * @param {Object=} options Object with options that need to be stored for the cookie.
	 */
	function $$CookieWriter($document, $log, $browser) {
	  var cookiePath = $browser.baseHref();
	  var rawDocument = $document[0];
	
	  function buildCookieString(name, value, options) {
	    var path, expires;
	    options = options || {};
	    expires = options.expires;
	    path = angular.isDefined(options.path) ? options.path : cookiePath;
	    if (angular.isUndefined(value)) {
	      expires = 'Thu, 01 Jan 1970 00:00:00 GMT';
	      value = '';
	    }
	    if (angular.isString(expires)) {
	      expires = new Date(expires);
	    }
	
	    var str = encodeURIComponent(name) + '=' + encodeURIComponent(value);
	    str += path ? ';path=' + path : '';
	    str += options.domain ? ';domain=' + options.domain : '';
	    str += expires ? ';expires=' + expires.toUTCString() : '';
	    str += options.secure ? ';secure' : '';
	
	    // per http://www.ietf.org/rfc/rfc2109.txt browser must allow at minimum:
	    // - 300 cookies
	    // - 20 cookies per unique domain
	    // - 4096 bytes per cookie
	    var cookieLength = str.length + 1;
	    if (cookieLength > 4096) {
	      $log.warn("Cookie '" + name +
	        "' possibly not set or overflowed because it was too large (" +
	        cookieLength + " > 4096 bytes)!");
	    }
	
	    return str;
	  }
	
	  return function(name, value, options) {
	    rawDocument.cookie = buildCookieString(name, value, options);
	  };
	}
	
	$$CookieWriter.$inject = ['$document', '$log', '$browser'];
	
	angular.module('ngCookies').provider('$$cookieWriter', function $$CookieWriterProvider() {
	  this.$get = $$CookieWriter;
	});
	
	
	})(window, window.angular);


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(11);
	module.exports = 'ngResource';


/***/ },
/* 11 */
/***/ function(module, exports) {

	/**
	 * @license AngularJS v1.5.8
	 * (c) 2010-2016 Google, Inc. http://angularjs.org
	 * License: MIT
	 */
	(function(window, angular) {'use strict';
	
	var $resourceMinErr = angular.$$minErr('$resource');
	
	// Helper functions and regex to lookup a dotted path on an object
	// stopping at undefined/null.  The path must be composed of ASCII
	// identifiers (just like $parse)
	var MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/;
	
	function isValidDottedPath(path) {
	  return (path != null && path !== '' && path !== 'hasOwnProperty' &&
	      MEMBER_NAME_REGEX.test('.' + path));
	}
	
	function lookupDottedPath(obj, path) {
	  if (!isValidDottedPath(path)) {
	    throw $resourceMinErr('badmember', 'Dotted member path "@{0}" is invalid.', path);
	  }
	  var keys = path.split('.');
	  for (var i = 0, ii = keys.length; i < ii && angular.isDefined(obj); i++) {
	    var key = keys[i];
	    obj = (obj !== null) ? obj[key] : undefined;
	  }
	  return obj;
	}
	
	/**
	 * Create a shallow copy of an object and clear other fields from the destination
	 */
	function shallowClearAndCopy(src, dst) {
	  dst = dst || {};
	
	  angular.forEach(dst, function(value, key) {
	    delete dst[key];
	  });
	
	  for (var key in src) {
	    if (src.hasOwnProperty(key) && !(key.charAt(0) === '$' && key.charAt(1) === '$')) {
	      dst[key] = src[key];
	    }
	  }
	
	  return dst;
	}
	
	/**
	 * @ngdoc module
	 * @name ngResource
	 * @description
	 *
	 * # ngResource
	 *
	 * The `ngResource` module provides interaction support with RESTful services
	 * via the $resource service.
	 *
	 *
	 * <div doc-module-components="ngResource"></div>
	 *
	 * See {@link ngResource.$resourceProvider} and {@link ngResource.$resource} for usage.
	 */
	
	/**
	 * @ngdoc provider
	 * @name $resourceProvider
	 *
	 * @description
	 *
	 * Use `$resourceProvider` to change the default behavior of the {@link ngResource.$resource}
	 * service.
	 *
	 * ## Dependencies
	 * Requires the {@link ngResource } module to be installed.
	 *
	 */
	
	/**
	 * @ngdoc service
	 * @name $resource
	 * @requires $http
	 * @requires ng.$log
	 * @requires $q
	 * @requires ng.$timeout
	 *
	 * @description
	 * A factory which creates a resource object that lets you interact with
	 * [RESTful](http://en.wikipedia.org/wiki/Representational_State_Transfer) server-side data sources.
	 *
	 * The returned resource object has action methods which provide high-level behaviors without
	 * the need to interact with the low level {@link ng.$http $http} service.
	 *
	 * Requires the {@link ngResource `ngResource`} module to be installed.
	 *
	 * By default, trailing slashes will be stripped from the calculated URLs,
	 * which can pose problems with server backends that do not expect that
	 * behavior.  This can be disabled by configuring the `$resourceProvider` like
	 * this:
	 *
	 * ```js
	     app.config(['$resourceProvider', function($resourceProvider) {
	       // Don't strip trailing slashes from calculated URLs
	       $resourceProvider.defaults.stripTrailingSlashes = false;
	     }]);
	 * ```
	 *
	 * @param {string} url A parameterized URL template with parameters prefixed by `:` as in
	 *   `/user/:username`. If you are using a URL with a port number (e.g.
	 *   `http://example.com:8080/api`), it will be respected.
	 *
	 *   If you are using a url with a suffix, just add the suffix, like this:
	 *   `$resource('http://example.com/resource.json')` or `$resource('http://example.com/:id.json')`
	 *   or even `$resource('http://example.com/resource/:resource_id.:format')`
	 *   If the parameter before the suffix is empty, :resource_id in this case, then the `/.` will be
	 *   collapsed down to a single `.`.  If you need this sequence to appear and not collapse then you
	 *   can escape it with `/\.`.
	 *
	 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
	 *   `actions` methods. If a parameter value is a function, it will be called every time
	 *   a param value needs to be obtained for a request (unless the param was overridden). The function
	 *   will be passed the current data value as an argument.
	 *
	 *   Each key value in the parameter object is first bound to url template if present and then any
	 *   excess keys are appended to the url search query after the `?`.
	 *
	 *   Given a template `/path/:verb` and parameter `{verb:'greet', salutation:'Hello'}` results in
	 *   URL `/path/greet?salutation=Hello`.
	 *
	 *   If the parameter value is prefixed with `@`, then the value for that parameter will be
	 *   extracted from the corresponding property on the `data` object (provided when calling a
	 *   "non-GET" action method).
	 *   For example, if the `defaultParam` object is `{someParam: '@someProp'}` then the value of
	 *   `someParam` will be `data.someProp`.
	 *   Note that the parameter will be ignored, when calling a "GET" action method (i.e. an action
	 *   method that does not accept a request body)
	 *
	 * @param {Object.<Object>=} actions Hash with declaration of custom actions that should extend
	 *   the default set of resource actions. The declaration should be created in the format of {@link
	 *   ng.$http#usage $http.config}:
	 *
	 *       {action1: {method:?, params:?, isArray:?, headers:?, ...},
	 *        action2: {method:?, params:?, isArray:?, headers:?, ...},
	 *        ...}
	 *
	 *   Where:
	 *
	 *   - **`action`** – {string} – The name of action. This name becomes the name of the method on
	 *     your resource object.
	 *   - **`method`** – {string} – Case insensitive HTTP method (e.g. `GET`, `POST`, `PUT`,
	 *     `DELETE`, `JSONP`, etc).
	 *   - **`params`** – {Object=} – Optional set of pre-bound parameters for this action. If any of
	 *     the parameter value is a function, it will be called every time when a param value needs to
	 *     be obtained for a request (unless the param was overridden). The function will be passed the
	 *     current data value as an argument.
	 *   - **`url`** – {string} – action specific `url` override. The url templating is supported just
	 *     like for the resource-level urls.
	 *   - **`isArray`** – {boolean=} – If true then the returned object for this action is an array,
	 *     see `returns` section.
	 *   - **`transformRequest`** –
	 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
	 *     transform function or an array of such functions. The transform function takes the http
	 *     request body and headers and returns its transformed (typically serialized) version.
	 *     By default, transformRequest will contain one function that checks if the request data is
	 *     an object and serializes to using `angular.toJson`. To prevent this behavior, set
	 *     `transformRequest` to an empty array: `transformRequest: []`
	 *   - **`transformResponse`** –
	 *     `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
	 *     transform function or an array of such functions. The transform function takes the http
	 *     response body and headers and returns its transformed (typically deserialized) version.
	 *     By default, transformResponse will contain one function that checks if the response looks
	 *     like a JSON string and deserializes it using `angular.fromJson`. To prevent this behavior,
	 *     set `transformResponse` to an empty array: `transformResponse: []`
	 *   - **`cache`** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
	 *     GET request, otherwise if a cache instance built with
	 *     {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
	 *     caching.
	 *   - **`timeout`** – `{number}` – timeout in milliseconds.<br />
	 *     **Note:** In contrast to {@link ng.$http#usage $http.config}, {@link ng.$q promises} are
	 *     **not** supported in $resource, because the same value would be used for multiple requests.
	 *     If you are looking for a way to cancel requests, you should use the `cancellable` option.
	 *   - **`cancellable`** – `{boolean}` – if set to true, the request made by a "non-instance" call
	 *     will be cancelled (if not already completed) by calling `$cancelRequest()` on the call's
	 *     return value. Calling `$cancelRequest()` for a non-cancellable or an already
	 *     completed/cancelled request will have no effect.<br />
	 *   - **`withCredentials`** - `{boolean}` - whether to set the `withCredentials` flag on the
	 *     XHR object. See
	 *     [requests with credentials](https://developer.mozilla.org/en/http_access_control#section_5)
	 *     for more information.
	 *   - **`responseType`** - `{string}` - see
	 *     [requestType](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType).
	 *   - **`interceptor`** - `{Object=}` - The interceptor object has two optional methods -
	 *     `response` and `responseError`. Both `response` and `responseError` interceptors get called
	 *     with `http response` object. See {@link ng.$http $http interceptors}.
	 *
	 * @param {Object} options Hash with custom settings that should extend the
	 *   default `$resourceProvider` behavior.  The supported options are:
	 *
	 *   - **`stripTrailingSlashes`** – {boolean} – If true then the trailing
	 *   slashes from any calculated URL will be stripped. (Defaults to true.)
	 *   - **`cancellable`** – {boolean} – If true, the request made by a "non-instance" call will be
	 *   cancelled (if not already completed) by calling `$cancelRequest()` on the call's return value.
	 *   This can be overwritten per action. (Defaults to false.)
	 *
	 * @returns {Object} A resource "class" object with methods for the default set of resource actions
	 *   optionally extended with custom `actions`. The default set contains these actions:
	 *   ```js
	 *   { 'get':    {method:'GET'},
	 *     'save':   {method:'POST'},
	 *     'query':  {method:'GET', isArray:true},
	 *     'remove': {method:'DELETE'},
	 *     'delete': {method:'DELETE'} };
	 *   ```
	 *
	 *   Calling these methods invoke an {@link ng.$http} with the specified http method,
	 *   destination and parameters. When the data is returned from the server then the object is an
	 *   instance of the resource class. The actions `save`, `remove` and `delete` are available on it
	 *   as  methods with the `$` prefix. This allows you to easily perform CRUD operations (create,
	 *   read, update, delete) on server-side data like this:
	 *   ```js
	 *   var User = $resource('/user/:userId', {userId:'@id'});
	 *   var user = User.get({userId:123}, function() {
	 *     user.abc = true;
	 *     user.$save();
	 *   });
	 *   ```
	 *
	 *   It is important to realize that invoking a $resource object method immediately returns an
	 *   empty reference (object or array depending on `isArray`). Once the data is returned from the
	 *   server the existing reference is populated with the actual data. This is a useful trick since
	 *   usually the resource is assigned to a model which is then rendered by the view. Having an empty
	 *   object results in no rendering, once the data arrives from the server then the object is
	 *   populated with the data and the view automatically re-renders itself showing the new data. This
	 *   means that in most cases one never has to write a callback function for the action methods.
	 *
	 *   The action methods on the class object or instance object can be invoked with the following
	 *   parameters:
	 *
	 *   - HTTP GET "class" actions: `Resource.action([parameters], [success], [error])`
	 *   - non-GET "class" actions: `Resource.action([parameters], postData, [success], [error])`
	 *   - non-GET instance actions:  `instance.$action([parameters], [success], [error])`
	 *
	 *
	 *   Success callback is called with (value, responseHeaders) arguments, where the value is
	 *   the populated resource instance or collection object. The error callback is called
	 *   with (httpResponse) argument.
	 *
	 *   Class actions return empty instance (with additional properties below).
	 *   Instance actions return promise of the action.
	 *
	 *   The Resource instances and collections have these additional properties:
	 *
	 *   - `$promise`: the {@link ng.$q promise} of the original server interaction that created this
	 *     instance or collection.
	 *
	 *     On success, the promise is resolved with the same resource instance or collection object,
	 *     updated with data from server. This makes it easy to use in
	 *     {@link ngRoute.$routeProvider resolve section of $routeProvider.when()} to defer view
	 *     rendering until the resource(s) are loaded.
	 *
	 *     On failure, the promise is rejected with the {@link ng.$http http response} object, without
	 *     the `resource` property.
	 *
	 *     If an interceptor object was provided, the promise will instead be resolved with the value
	 *     returned by the interceptor.
	 *
	 *   - `$resolved`: `true` after first server interaction is completed (either with success or
	 *      rejection), `false` before that. Knowing if the Resource has been resolved is useful in
	 *      data-binding.
	 *
	 *   The Resource instances and collections have these additional methods:
	 *
	 *   - `$cancelRequest`: If there is a cancellable, pending request related to the instance or
	 *      collection, calling this method will abort the request.
	 *
	 *   The Resource instances have these additional methods:
	 *
	 *   - `toJSON`: It returns a simple object without any of the extra properties added as part of
	 *     the Resource API. This object can be serialized through {@link angular.toJson} safely
	 *     without attaching Angular-specific fields. Notice that `JSON.stringify` (and
	 *     `angular.toJson`) automatically use this method when serializing a Resource instance
	 *     (see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior)).
	 *
	 * @example
	 *
	 * # Credit card resource
	 *
	 * ```js
	     // Define CreditCard class
	     var CreditCard = $resource('/user/:userId/card/:cardId',
	      {userId:123, cardId:'@id'}, {
	       charge: {method:'POST', params:{charge:true}}
	      });
	
	     // We can retrieve a collection from the server
	     var cards = CreditCard.query(function() {
	       // GET: /user/123/card
	       // server returns: [ {id:456, number:'1234', name:'Smith'} ];
	
	       var card = cards[0];
	       // each item is an instance of CreditCard
	       expect(card instanceof CreditCard).toEqual(true);
	       card.name = "J. Smith";
	       // non GET methods are mapped onto the instances
	       card.$save();
	       // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
	       // server returns: {id:456, number:'1234', name: 'J. Smith'};
	
	       // our custom method is mapped as well.
	       card.$charge({amount:9.99});
	       // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
	     });
	
	     // we can create an instance as well
	     var newCard = new CreditCard({number:'0123'});
	     newCard.name = "Mike Smith";
	     newCard.$save();
	     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
	     // server returns: {id:789, number:'0123', name: 'Mike Smith'};
	     expect(newCard.id).toEqual(789);
	 * ```
	 *
	 * The object returned from this function execution is a resource "class" which has "static" method
	 * for each action in the definition.
	 *
	 * Calling these methods invoke `$http` on the `url` template with the given `method`, `params` and
	 * `headers`.
	 *
	 * @example
	 *
	 * # User resource
	 *
	 * When the data is returned from the server then the object is an instance of the resource type and
	 * all of the non-GET methods are available with `$` prefix. This allows you to easily support CRUD
	 * operations (create, read, update, delete) on server-side data.
	
	   ```js
	     var User = $resource('/user/:userId', {userId:'@id'});
	     User.get({userId:123}, function(user) {
	       user.abc = true;
	       user.$save();
	     });
	   ```
	 *
	 * It's worth noting that the success callback for `get`, `query` and other methods gets passed
	 * in the response that came from the server as well as $http header getter function, so one
	 * could rewrite the above example and get access to http headers as:
	 *
	   ```js
	     var User = $resource('/user/:userId', {userId:'@id'});
	     User.get({userId:123}, function(user, getResponseHeaders){
	       user.abc = true;
	       user.$save(function(user, putResponseHeaders) {
	         //user => saved user object
	         //putResponseHeaders => $http header getter
	       });
	     });
	   ```
	 *
	 * You can also access the raw `$http` promise via the `$promise` property on the object returned
	 *
	   ```
	     var User = $resource('/user/:userId', {userId:'@id'});
	     User.get({userId:123})
	         .$promise.then(function(user) {
	           $scope.user = user;
	         });
	   ```
	 *
	 * @example
	 *
	 * # Creating a custom 'PUT' request
	 *
	 * In this example we create a custom method on our resource to make a PUT request
	 * ```js
	 *    var app = angular.module('app', ['ngResource', 'ngRoute']);
	 *
	 *    // Some APIs expect a PUT request in the format URL/object/ID
	 *    // Here we are creating an 'update' method
	 *    app.factory('Notes', ['$resource', function($resource) {
	 *    return $resource('/notes/:id', null,
	 *        {
	 *            'update': { method:'PUT' }
	 *        });
	 *    }]);
	 *
	 *    // In our controller we get the ID from the URL using ngRoute and $routeParams
	 *    // We pass in $routeParams and our Notes factory along with $scope
	 *    app.controller('NotesCtrl', ['$scope', '$routeParams', 'Notes',
	                                      function($scope, $routeParams, Notes) {
	 *    // First get a note object from the factory
	 *    var note = Notes.get({ id:$routeParams.id });
	 *    $id = note.id;
	 *
	 *    // Now call update passing in the ID first then the object you are updating
	 *    Notes.update({ id:$id }, note);
	 *
	 *    // This will PUT /notes/ID with the note object in the request payload
	 *    }]);
	 * ```
	 *
	 * @example
	 *
	 * # Cancelling requests
	 *
	 * If an action's configuration specifies that it is cancellable, you can cancel the request related
	 * to an instance or collection (as long as it is a result of a "non-instance" call):
	 *
	   ```js
	     // ...defining the `Hotel` resource...
	     var Hotel = $resource('/api/hotel/:id', {id: '@id'}, {
	       // Let's make the `query()` method cancellable
	       query: {method: 'get', isArray: true, cancellable: true}
	     });
	
	     // ...somewhere in the PlanVacationController...
	     ...
	     this.onDestinationChanged = function onDestinationChanged(destination) {
	       // We don't care about any pending request for hotels
	       // in a different destination any more
	       this.availableHotels.$cancelRequest();
	
	       // Let's query for hotels in '<destination>'
	       // (calls: /api/hotel?location=<destination>)
	       this.availableHotels = Hotel.query({location: destination});
	     };
	   ```
	 *
	 */
	angular.module('ngResource', ['ng']).
	  provider('$resource', function() {
	    var PROTOCOL_AND_DOMAIN_REGEX = /^https?:\/\/[^\/]*/;
	    var provider = this;
	
	    /**
	     * @ngdoc property
	     * @name $resourceProvider#defaults
	     * @description
	     * Object containing default options used when creating `$resource` instances.
	     *
	     * The default values satisfy a wide range of usecases, but you may choose to overwrite any of
	     * them to further customize your instances. The available properties are:
	     *
	     * - **stripTrailingSlashes** – `{boolean}` – If true, then the trailing slashes from any
	     *   calculated URL will be stripped.<br />
	     *   (Defaults to true.)
	     * - **cancellable** – `{boolean}` – If true, the request made by a "non-instance" call will be
	     *   cancelled (if not already completed) by calling `$cancelRequest()` on the call's return
	     *   value. For more details, see {@link ngResource.$resource}. This can be overwritten per
	     *   resource class or action.<br />
	     *   (Defaults to false.)
	     * - **actions** - `{Object.<Object>}` - A hash with default actions declarations. Actions are
	     *   high-level methods corresponding to RESTful actions/methods on resources. An action may
	     *   specify what HTTP method to use, what URL to hit, if the return value will be a single
	     *   object or a collection (array) of objects etc. For more details, see
	     *   {@link ngResource.$resource}. The actions can also be enhanced or overwritten per resource
	     *   class.<br />
	     *   The default actions are:
	     *   ```js
	     *   {
	     *     get: {method: 'GET'},
	     *     save: {method: 'POST'},
	     *     query: {method: 'GET', isArray: true},
	     *     remove: {method: 'DELETE'},
	     *     delete: {method: 'DELETE'}
	     *   }
	     *   ```
	     *
	     * #### Example
	     *
	     * For example, you can specify a new `update` action that uses the `PUT` HTTP verb:
	     *
	     * ```js
	     *   angular.
	     *     module('myApp').
	     *     config(['resourceProvider', function ($resourceProvider) {
	     *       $resourceProvider.defaults.actions.update = {
	     *         method: 'PUT'
	     *       };
	     *     });
	     * ```
	     *
	     * Or you can even overwrite the whole `actions` list and specify your own:
	     *
	     * ```js
	     *   angular.
	     *     module('myApp').
	     *     config(['resourceProvider', function ($resourceProvider) {
	     *       $resourceProvider.defaults.actions = {
	     *         create: {method: 'POST'}
	     *         get:    {method: 'GET'},
	     *         getAll: {method: 'GET', isArray:true},
	     *         update: {method: 'PUT'},
	     *         delete: {method: 'DELETE'}
	     *       };
	     *     });
	     * ```
	     *
	     */
	    this.defaults = {
	      // Strip slashes by default
	      stripTrailingSlashes: true,
	
	      // Make non-instance requests cancellable (via `$cancelRequest()`)
	      cancellable: false,
	
	      // Default actions configuration
	      actions: {
	        'get': {method: 'GET'},
	        'save': {method: 'POST'},
	        'query': {method: 'GET', isArray: true},
	        'remove': {method: 'DELETE'},
	        'delete': {method: 'DELETE'}
	      }
	    };
	
	    this.$get = ['$http', '$log', '$q', '$timeout', function($http, $log, $q, $timeout) {
	
	      var noop = angular.noop,
	        forEach = angular.forEach,
	        extend = angular.extend,
	        copy = angular.copy,
	        isFunction = angular.isFunction;
	
	      /**
	       * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
	       * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set
	       * (pchar) allowed in path segments:
	       *    segment       = *pchar
	       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
	       *    pct-encoded   = "%" HEXDIG HEXDIG
	       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
	       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
	       *                     / "*" / "+" / "," / ";" / "="
	       */
	      function encodeUriSegment(val) {
	        return encodeUriQuery(val, true).
	          replace(/%26/gi, '&').
	          replace(/%3D/gi, '=').
	          replace(/%2B/gi, '+');
	      }
	
	
	      /**
	       * This method is intended for encoding *key* or *value* parts of query component. We need a
	       * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
	       * have to be encoded per http://tools.ietf.org/html/rfc3986:
	       *    query       = *( pchar / "/" / "?" )
	       *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
	       *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
	       *    pct-encoded   = "%" HEXDIG HEXDIG
	       *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
	       *                     / "*" / "+" / "," / ";" / "="
	       */
	      function encodeUriQuery(val, pctEncodeSpaces) {
	        return encodeURIComponent(val).
	          replace(/%40/gi, '@').
	          replace(/%3A/gi, ':').
	          replace(/%24/g, '$').
	          replace(/%2C/gi, ',').
	          replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
	      }
	
	      function Route(template, defaults) {
	        this.template = template;
	        this.defaults = extend({}, provider.defaults, defaults);
	        this.urlParams = {};
	      }
	
	      Route.prototype = {
	        setUrlParams: function(config, params, actionUrl) {
	          var self = this,
	            url = actionUrl || self.template,
	            val,
	            encodedVal,
	            protocolAndDomain = '';
	
	          var urlParams = self.urlParams = {};
	          forEach(url.split(/\W/), function(param) {
	            if (param === 'hasOwnProperty') {
	              throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
	            }
	            if (!(new RegExp("^\\d+$").test(param)) && param &&
	              (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
	              urlParams[param] = {
	                isQueryParamValue: (new RegExp("\\?.*=:" + param + "(?:\\W|$)")).test(url)
	              };
	            }
	          });
	          url = url.replace(/\\:/g, ':');
	          url = url.replace(PROTOCOL_AND_DOMAIN_REGEX, function(match) {
	            protocolAndDomain = match;
	            return '';
	          });
	
	          params = params || {};
	          forEach(self.urlParams, function(paramInfo, urlParam) {
	            val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
	            if (angular.isDefined(val) && val !== null) {
	              if (paramInfo.isQueryParamValue) {
	                encodedVal = encodeUriQuery(val, true);
	              } else {
	                encodedVal = encodeUriSegment(val);
	              }
	              url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), function(match, p1) {
	                return encodedVal + p1;
	              });
	            } else {
	              url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
	                  leadingSlashes, tail) {
	                if (tail.charAt(0) == '/') {
	                  return tail;
	                } else {
	                  return leadingSlashes + tail;
	                }
	              });
	            }
	          });
	
	          // strip trailing slashes and set the url (unless this behavior is specifically disabled)
	          if (self.defaults.stripTrailingSlashes) {
	            url = url.replace(/\/+$/, '') || '/';
	          }
	
	          // then replace collapse `/.` if found in the last URL path segment before the query
	          // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
	          url = url.replace(/\/\.(?=\w+($|\?))/, '.');
	          // replace escaped `/\.` with `/.`
	          config.url = protocolAndDomain + url.replace(/\/\\\./, '/.');
	
	
	          // set params - delegate param encoding to $http
	          forEach(params, function(value, key) {
	            if (!self.urlParams[key]) {
	              config.params = config.params || {};
	              config.params[key] = value;
	            }
	          });
	        }
	      };
	
	
	      function resourceFactory(url, paramDefaults, actions, options) {
	        var route = new Route(url, options);
	
	        actions = extend({}, provider.defaults.actions, actions);
	
	        function extractParams(data, actionParams) {
	          var ids = {};
	          actionParams = extend({}, paramDefaults, actionParams);
	          forEach(actionParams, function(value, key) {
	            if (isFunction(value)) { value = value(data); }
	            ids[key] = value && value.charAt && value.charAt(0) == '@' ?
	              lookupDottedPath(data, value.substr(1)) : value;
	          });
	          return ids;
	        }
	
	        function defaultResponseInterceptor(response) {
	          return response.resource;
	        }
	
	        function Resource(value) {
	          shallowClearAndCopy(value || {}, this);
	        }
	
	        Resource.prototype.toJSON = function() {
	          var data = extend({}, this);
	          delete data.$promise;
	          delete data.$resolved;
	          return data;
	        };
	
	        forEach(actions, function(action, name) {
	          var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
	          var numericTimeout = action.timeout;
	          var cancellable = angular.isDefined(action.cancellable) ? action.cancellable :
	              (options && angular.isDefined(options.cancellable)) ? options.cancellable :
	              provider.defaults.cancellable;
	
	          if (numericTimeout && !angular.isNumber(numericTimeout)) {
	            $log.debug('ngResource:\n' +
	                       '  Only numeric values are allowed as `timeout`.\n' +
	                       '  Promises are not supported in $resource, because the same value would ' +
	                       'be used for multiple requests. If you are looking for a way to cancel ' +
	                       'requests, you should use the `cancellable` option.');
	            delete action.timeout;
	            numericTimeout = null;
	          }
	
	          Resource[name] = function(a1, a2, a3, a4) {
	            var params = {}, data, success, error;
	
	            /* jshint -W086 */ /* (purposefully fall through case statements) */
	            switch (arguments.length) {
	              case 4:
	                error = a4;
	                success = a3;
	              //fallthrough
	              case 3:
	              case 2:
	                if (isFunction(a2)) {
	                  if (isFunction(a1)) {
	                    success = a1;
	                    error = a2;
	                    break;
	                  }
	
	                  success = a2;
	                  error = a3;
	                  //fallthrough
	                } else {
	                  params = a1;
	                  data = a2;
	                  success = a3;
	                  break;
	                }
	              case 1:
	                if (isFunction(a1)) success = a1;
	                else if (hasBody) data = a1;
	                else params = a1;
	                break;
	              case 0: break;
	              default:
	                throw $resourceMinErr('badargs',
	                  "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
	                  arguments.length);
	            }
	            /* jshint +W086 */ /* (purposefully fall through case statements) */
	
	            var isInstanceCall = this instanceof Resource;
	            var value = isInstanceCall ? data : (action.isArray ? [] : new Resource(data));
	            var httpConfig = {};
	            var responseInterceptor = action.interceptor && action.interceptor.response ||
	              defaultResponseInterceptor;
	            var responseErrorInterceptor = action.interceptor && action.interceptor.responseError ||
	              undefined;
	            var timeoutDeferred;
	            var numericTimeoutPromise;
	
	            forEach(action, function(value, key) {
	              switch (key) {
	                default:
	                  httpConfig[key] = copy(value);
	                  break;
	                case 'params':
	                case 'isArray':
	                case 'interceptor':
	                case 'cancellable':
	                  break;
	              }
	            });
	
	            if (!isInstanceCall && cancellable) {
	              timeoutDeferred = $q.defer();
	              httpConfig.timeout = timeoutDeferred.promise;
	
	              if (numericTimeout) {
	                numericTimeoutPromise = $timeout(timeoutDeferred.resolve, numericTimeout);
	              }
	            }
	
	            if (hasBody) httpConfig.data = data;
	            route.setUrlParams(httpConfig,
	              extend({}, extractParams(data, action.params || {}), params),
	              action.url);
	
	            var promise = $http(httpConfig).then(function(response) {
	              var data = response.data;
	
	              if (data) {
	                // Need to convert action.isArray to boolean in case it is undefined
	                // jshint -W018
	                if (angular.isArray(data) !== (!!action.isArray)) {
	                  throw $resourceMinErr('badcfg',
	                      'Error in resource configuration for action `{0}`. Expected response to ' +
	                      'contain an {1} but got an {2} (Request: {3} {4})', name, action.isArray ? 'array' : 'object',
	                    angular.isArray(data) ? 'array' : 'object', httpConfig.method, httpConfig.url);
	                }
	                // jshint +W018
	                if (action.isArray) {
	                  value.length = 0;
	                  forEach(data, function(item) {
	                    if (typeof item === "object") {
	                      value.push(new Resource(item));
	                    } else {
	                      // Valid JSON values may be string literals, and these should not be converted
	                      // into objects. These items will not have access to the Resource prototype
	                      // methods, but unfortunately there
	                      value.push(item);
	                    }
	                  });
	                } else {
	                  var promise = value.$promise;     // Save the promise
	                  shallowClearAndCopy(data, value);
	                  value.$promise = promise;         // Restore the promise
	                }
	              }
	              response.resource = value;
	
	              return response;
	            }, function(response) {
	              (error || noop)(response);
	              return $q.reject(response);
	            });
	
	            promise['finally'](function() {
	              value.$resolved = true;
	              if (!isInstanceCall && cancellable) {
	                value.$cancelRequest = angular.noop;
	                $timeout.cancel(numericTimeoutPromise);
	                timeoutDeferred = numericTimeoutPromise = httpConfig.timeout = null;
	              }
	            });
	
	            promise = promise.then(
	              function(response) {
	                var value = responseInterceptor(response);
	                (success || noop)(value, response.headers);
	                return value;
	              },
	              responseErrorInterceptor);
	
	            if (!isInstanceCall) {
	              // we are creating instance / collection
	              // - set the initial promise
	              // - return the instance / collection
	              value.$promise = promise;
	              value.$resolved = false;
	              if (cancellable) value.$cancelRequest = timeoutDeferred.resolve;
	
	              return value;
	            }
	
	            // instance call
	            return promise;
	          };
	
	
	          Resource.prototype['$' + name] = function(params, success, error) {
	            if (isFunction(params)) {
	              error = success; success = params; params = {};
	            }
	            var result = Resource[name].call(this, params, this, success, error);
	            return result.$promise || result;
	          };
	        });
	
	        Resource.bind = function(additionalParamDefaults) {
	          return resourceFactory(url, extend({}, paramDefaults, additionalParamDefaults), actions);
	        };
	
	        return Resource;
	      }
	
	      return resourceFactory;
	    }];
	  });
	
	
	})(window, window.angular);


/***/ }
/******/ ]);
//# sourceMappingURL=sg-lib.js.map