var fs = require('fs');

var mode = process.argv[2].toLowerCase() || "all";

if (mode != "all" && mode != "desktop" && mode != "mobile") {
	console.log("didnt understand mode "+mode);
	process.exit();
}

var JPGMAGIC0 = new Buffer(4);
JPGMAGIC0[0] =0xFF;
JPGMAGIC0[1] =0xD8;
JPGMAGIC0[2] =0xFF;
JPGMAGIC0[3] =0xE0;

var JPGMAGIC1 = new Buffer(4);
JPGMAGIC1[0] =0xFF;
JPGMAGIC1[1] =0xD8;
JPGMAGIC1[2] =0xFF;
JPGMAGIC1[3] =0xE1;


var DATASTART = new Buffer(5);
DATASTART[0] =0xFF;
DATASTART[1] =0xC0;
DATASTART[2] =0x00;
DATASTART[3] =0x11;
DATASTART[4] =0x08;

var spotlightPath = process.env.HOMEPATH+"\\AppData\\Local\\Packages\\Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy\\LocalState\\Assets\\";
var picturesPath = process.env.HOMEPATH+"\\Pictures\\";

var dir = fs.readdirSync(spotlightPath);

dir.forEach(function(filename, id){
	var file = fs.readFileSync(spotlightPath+filename);
	if (file.indexOf(JPGMAGIC0) == 0 || file.indexOf(JPGMAGIC1) == 0) {
		var offset = file.lastIndexOf(DATASTART);
		var height = file.readUInt16BE(offset+5);
		var width = file.readUInt16BE(offset+7);
		var newName = picturesPath+filename+".jpg";
		if (
			!fs.existsSync(newName)
			&& (width/height != 1)
			&& (
				mode == "all"
				|| (mode == "desktop" && width >= 1920)
				|| (mode == "mobile" && width <= 1080)
			)
		) {
			fs.writeFileSync(newName, file);
			console.log("wrote jpg "+filename);
		}
	}
});

var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }
exec("explorer "+picturesPath, puts);