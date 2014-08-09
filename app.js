var mydigitalstructure = require('./mydigitalstructure')

mydigitalstructure.init('', mydigitalstructure.logon(appMain))

function appMain(err, data)
{
	console.log(data)
}