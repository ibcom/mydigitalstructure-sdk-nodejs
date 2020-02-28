/*
	This is an example app to use as starting point for building a mydigitalstucture.cloud based nodejs app
	that you plan to host using AWS Lambda.

	To run it on your local computer your need to install https://www.npmjs.com/package/aws-lambda-local

	And then run as:

	$ lambda-local -f app-1.0.0-aws-lambda.js -t 9000 -e event.json -c settings.json

	- where the data in event.json will be passed to the handler as event and the settings.json data will passed as context.

	Also see learn.js for more example code using the mydigitalstructure node module.
*/

exports.handler = function (event, context)
{
	var mydigitalstructure = require('mydigitalstructure')
	var _ = require('lodash')
	var moment = require('moment');

	/*
		mydigitalstructure. methods impact local data.
		mydigitalstructure.cloud. methods impact data managed by the mydigitalstructure.cloud service (remote).
	*/

	mydigitalstructure.init(main)

	function main(err, data)
	{
		/*
			[LEARN EXAMPLE #1]
			Use mydigitalstructure.add to add your controller methods to your app and mydigitalstructure.invoke to run them,
			as per example app-show-session.
		*/

		mydigitalstructure.add(
		{
			name: 'learn-example-1-show-session',
			code: function ()
			{
				console.log('Using mydigitalstructure module version ' + mydigitalstructure.VERSION);
				console.log('learn-example #1; mydigitalstructure.cloud session object:');
				console.log(mydigitalstructure.data.session);
			}
		});
		
		mydigitalstructure.invoke('learn-example-1-show-session');
	}
}