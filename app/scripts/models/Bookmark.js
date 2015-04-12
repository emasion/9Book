/**
 * Created by 쩐율 on 2014-06-07.
 */
define([
	'backbone',
	'bootstrap-dialog'
], function(Backbone, BootstrapDialog) {
	'use strict';

	var Bookmark = Backbone.Model.extend({
		isSupportIndexedDB: false,
		reConnectionCount: 0,
		db: {},
		bookmarkObjectStore: null,
		dbName: 'softbook',
		bookId: 'softbook',
		bookmarkId: null,
		bookmarkItems: null,
		isChange: false,
		roomList: [],
		mode: 'last',
		changeBookmark: function(args) {
			var self = this,
				deferred = new $.Deferred();

			try{
				// 이미 있는지 확인
				self.getItem(args.page).then(function(data, status) {
					if(status === 'success' && !_.isUndefined(status)) {
						// 있다 - 삭제
						deferred.resolve(data, status);
						self.deleteItem(args.page);
					} else {
						// 없다. - 추가
						if(self.mode === 'last') {
							self.emptyDB();
						}
						deferred.resolve(self.addItem(args), status);
					}
				});
			}catch (error) {
				BootstrapDialog.show({
					message: error
				});
			}

			return deferred;
		},

		addItem: function(args) {
			var self = this,
				today = moment().toJSON(),
				addData = {
					"addDate": today,
					"view": args.view,
					"page": args.page
				};

			if(self.isSupportIndexedDB) {
				$.indexedDB(self.dbName).objectStore(self.bookmarkId).add(addData, args.page).then(function() {
					console.log("Data added");
					self.bookmarkItems = null;
				}, function(e) {

				});
			}else {
				// set cookie
				var item = $.cookie(self.bookmarkId + ':' + args.page, JSON.stringify(addData), { expires: 7 });
				console.log("Data added");
				self.bookmarkItems = null;
			}

			return addData;
		},

		getItem: function(index) {
			var self = this,
				deferred = new $.Deferred();

			if(self.isSupportIndexedDB) {
				$.indexedDB(self.dbName).objectStore(self.bookmarkId).get(index).then(function(item) {
					deferred.resolve(item, (item)? 'success' : 'fall');
				}, function(err) {
					console.log(err);
					deferred.resolve({}, 'fall');
				});
			}else {
				// get cookie
				var item = $.cookie(self.bookmarkId + ':' + index);
				if(item) {
					deferred.resolve($.parseJSON(item), 'success');
				}else {
					deferred.resolve({}, 'fall');
				}
			}

			return deferred;
		},

		load: function() {
			var self = this,
				bookmarkItems = [],
				deferred = new $.Deferred();

			if(self.bookmarkItems) {
				deferred.resolve(self.bookmarkItems);
			}else {
				$.indexedDB(self.dbName).objectStore(self.bookmarkId).each(function(data) {
					bookmarkItems.push(data);
				}).then(function() {
					deferred.resolve(bookmarkItems);
					self.bookmarkItems = bookmarkItems;
				});
			}

			return deferred;
		},

		deleteItem: function(index) {
			var self = this;

			if(self.isSupportIndexedDB) {
				$.indexedDB(self.dbName).objectStore(self.bookmarkId)["delete"](index).then(function() {
					console.log("Data remove");
					self.bookmarkItems = null;
				}, function() {
					console.log("Error removing data");
				});
			}else {
				$.removeCookie(self.bookmarkId + ':' + index);
			}
		},
		// bookmark store clear
		emptyDB: function emptyDB() {
			var self = this;
			$.indexedDB(self.dbName).objectStore(self.bookmarkId).clear();
			self.isChange = true;
		},
		// bookmark data load
		loadFromDB: function() {
			var self = this,
				findLastItem = null,
				deferred = new $.Deferred(),
				bookmarkItems = [];

			if(self.isSupportIndexedDB) {
				_($.indexedDB(self.dbName).objectStore(self.bookmarkId).each(function(data) {
					if(self.mode === 'last') {
						// 가장 늦은 시간을 찾는다.
						var currentDate = new Date(data.value.addDate);
						if(findLastItem) {
							var lastItem = findLastItem.value.addDate;
							bookmarkItems[0] = (moment(currentDate).isBefore(lastItem)) ? findLastItem : data;
						}else {
							bookmarkItems[0] = data;
						}
					}else {
						bookmarkItems.push(data);
					}
				}).then(function() {
					deferred.resolve(bookmarkItems);
					self.bookmarkItems = bookmarkItems;
				}));
			}else {
				var jqueryCookie = $.cookie();
				console.log(jqueryCookie);
			}

			return deferred;
		},
		// 사용할일 없음..
		deleteDB: function() {
			var self = this;
			$.indexedDB(self.dbName).deleteDatabase();
		},

		init: function(options) {
			var self = this;
			if(options.bookId) { self.bookId = options.bookId; }
			self.mode = options.mode;
			self.bookmarkId = "bookmark-" + self.bookId;
			//self.deleteDB();

			if(!self.isSupportIndexedDB) {
				// cookie 이용
				return;
			}

			/*
			var request = indexedDB.open(self.dbName);
			request.onerror = function(event) {
				$.BootstrapDialog.show({
					message: "Why didn't you allow my web app to use IndexedDB?!"
				});
			};

			request.onupgradeneeded = function(event) {
				var db = event.target.result;
				db.onerror = function(event) {
					// Generic error handler for all errors targeted at this database's
					// requests!
					$.BootstrapDialog.show({
						message: "Database error: " + event.target.errorCode
					});
				};

				// Create an objectStore to hold information about our customers. We're
				// going to use "ssn" as our key path because it's guaranteed to be
				// unique.
				var objectStore = db.createObjectStore(self.bookmarkId);
				objectStore.createIndex("page", "page", { unique: true });

				var transaction = db.transaction([self.bookmarkId], "readwrite");
				transaction.oncomplete = function(event) {
					$.BootstrapDialog.show({
						message: "All done!"
					});
					self.trigger('TRANSACTION_COMPLETED');
				};

				transaction.onerror = function(event) {
					// Don't forget to handle errors!
					$.BootstrapDialog.show({
						message: "transaction errors!"
					});
				};

				// Create an index to search customers by email. We want to ensure that
				// no two customers have the same email, so use a unique index.
				//objectStore.createIndex("email", "email", { unique: true });

				// Store values in the newly created objectStore.
				//for (var i in customerData) {
				//	objectStore.add(customerData[i]);
				//}
			};
			*/

			$.indexedDB(self.dbName, {
				"schema": {
					"1": function(versionTransaction) {
						var bookmark = versionTransaction.createObjectStore(self.bookmarkId);
						bookmark.createIndex("page");
					}
				}
			}).transaction([self.bookmarkId]).then(function() {
				console.log("Transaction completed");
				self.trigger('TRANSACTION_COMPLETED');
			}, function() {
				console.log("Transaction fail");
				if(self.reConnectionCount > 3) {
					return;
				}
				setTimeout(function() {
					self.reConnectionCount = self.reConnectionCount + 1;
					self.deleteDB();    // db초기화
					self.init(options);
				}, 100);
			});
		},

		initialize: function() {
			var self = this;
/*
			// In the following line, you should include the prefixes of implementations you want to test.
			window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			// DON'T use "var indexedDB = ..." if you're not in a function.
			// Moreover, you may need references to some window.IDB* objects:
			window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
			// (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
*/
			if (!window.indexedDB) {
//				$.BootstrapDialog.show({
//					message: "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
//				});
				return;
			}else {
				self.isSupportIndexedDB = true;
//				$.BootstrapDialog.show({
//					message: "indexedDB OK!"
//				});
			}
		}
	});

	var instance;
	return function() {
		if(!instance) {
			instance = new Bookmark();
			return instance;
		}
		return instance;
	};
});
