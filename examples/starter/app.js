/* a starting point ... */

var mydigitalstructure = require('mydigitalstructure')

mydigitalstructure.init(main)

function main(data)
{
	if (mydigitalstructure.data.session.status = "OK")
	{
		console.log('#myds.session:' + mydigitalstructure.data.session);
	}	
}