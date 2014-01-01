var orm = require('orm');


// Will be set on init, null == not set.
module.exports.User = null;
module.exports.TempReading = null;

// Callback will be called when done.
module.exports.init = function(done) {
    orm.connect("sqlite:roost.db3", function (err, db) {
	
	if(err){
		console.log("orm.connect error " + err);
		done(err);
	} else{
		console.log("orm connect success");
	}
	
    var User = db.define("user", {
        username: String,
        password: String,
    });
	
	var TempReading = db.define("tempReading",{
		timeStamp : Date,
		label : String,
		value : Number,
		});
    // Make the database.
    User.sync(function(err) { 
		if(err){
			console.log("failed to make user db " + err);
		}
	});
	TempReading.sync(function(err) {
				if(err){
			console.log("failed to make tempReading db " + err);
		}
	
	});
    if (err) {
		done("Error: could not create the database: " + err);
	}
	else {
		// Export our object for basic interactions.
		module.exports.User = User;
		module.exports.TempReading =TempReading;
		// We're done.
		done(null);
	}
    });
};