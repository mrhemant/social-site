var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var PostSchema = mongoose.Schema({
	username: {
		type: String,
	},
	post: {
		type: String,
	},
	title: {
		type: String,
	},
	date: { type: Date, default: Date.now },

	flag: {
		type: Boolean, default: false
	}

});

var Post = module.exports = mongoose.model('Post', PostSchema);

module.exports.createPost = function(newPost, callback){
			bcrypt.genSalt(10, function(err, salt) {
	        newPost.save(callback);
	});
}

//module.export.deletepost = function(Id){
	//Posts.deleteone({_id : id});
//}
