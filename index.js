(function() {

"use strict";

var winston = module.parent.require("winston"),
    user = module.parent.require("./user");

var conf;

try {
	conf = require(__dirname + "/./config.json");
} catch(e) {
	winston.error("Could not load config.json, you need to copy config.json.sample to config.json: " + e);
	conf = { banned: [] };
}

exports.init = function init(params, callback) {
	winston.info("[Dark Shadow] Init");
	callback();
};

exports.getUsersTopics = function(data, callback) {
	var topics = data.topics;
	var dataUid = parseInt(data.uid, 10);
	var filtered = [];

	winston.info("[Dark Shadow] Get user topics, uid = " + dataUid);
	user.isAdminOrGlobalMod(dataUid, function(err, isAdminOrGlobalMod) {
		if(err) {
			return callback(err);
		}
		if(isAdminOrGlobalMod) {
			winston.info("[Dark Shadow] " + dataUid + " is admin or global mod");
			return callback(undefined, data);
		}
		winston.info("[Dark Shadow] Filtering, previous count = " + topics.length);
		topics.forEach(function(topic) {
			var topicUid = parseInt(topic.uid, 10);
			winston.info("[Dark Shadow] looking topic for uid = " + topicUid);
			if(conf.banned.indexOf(topicUid) >= 0) {
				winston.info("[Dark Shadow] Found banned uid = " + topicUid);
				if(dataUid === topicUid) {
					winston.info("[Dark Shadow] Showing shadow to user");
					filtered.push(topic);
				} else {
					winston.info("[Dark Shadow] dark shadow");
				}
			} else {
				filtered.push(topic);
			}
		});
		winston.info("[Dark Shadow] Filtering, now count = " + filtered.length);

		data.topics = filtered;
		callback(undefined, data);
	});
};

exports.getUsersPosts = function(data, callback) {
	var posts = data.posts;
	var dataUid = parseInt(data.uid, 10);
	var filtered = [];

	winston.info("[Dark Shadow] Get user posts, uid = " + dataUid);
	user.isAdminOrGlobalMod(dataUid, function(err, isAdminOrGlobalMod) {
		if(err) {
			return callback(err);
		}
		if(isAdminOrGlobalMod) {
			winston.info("[Dark Shadow] " + dataUid + " is admin or global mod");
			return callback(undefined, data);
		}

		winston.info("[Dark Shadow] Filtering, previous count = " + posts.length);
		console.log(conf.banned);
		posts.forEach(function(post) {
			var postUid = parseInt(post.uid, 10);
			winston.info("[Dark Shadow] looking post for uid = " + postUid);
			if(conf.banned.indexOf(postUid) >= 0) {
				winston.info("[Dark Shadow] Found banned uid = " + postUid);
				if(dataUid === postUid) {
					winston.info("[Dark Shadow] Showing shadow to user");
					filtered.push(post);
				} else {
					winston.info("[Dark Shadow] dark shadow");
				}
			} else {
				filtered.push(post);
			}
		});
		winston.info("[Dark Shadow] Filtering, now count = " + filtered.length);

		data.posts = filtered;
		callback(undefined, data);
	});
};
	
})();
