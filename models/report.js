var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');


var reportSchema = mongoose.Schema({
	id: {
		type: String,
	}
});

var Report = module.exports = mongoose.model('report', reportSchema);

module.exports.createReport = function(newReport, callback){
			bcrypt.genSalt(10, function(err, salt) {
	        newReport.save(callback);
	});

}
