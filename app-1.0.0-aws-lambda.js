/*
	An example app to use as starting point for mydigitalstucture.cloud based nodejs app ... 
	Once nodejs has been installed; run 'node app-1.0.0.js' using the OS terminal/console command prompt

	To run this within AWS lambda you need to wrap all the code with:
	exports.handler = function (event, context) {}
*/

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
	if (mydigitalstructure.data.settings.testing.status != 'true')
	{
		console.log('-');
		console.log('learn-tip #1:')
		console.log(' To see the mydigitalstructure module requests to and received responses from mydigitalstructure.cloud;');
		console.log(' set mydigitalstructure.data.settings.testing.status: \"true\"');
		console.log(' and/or mydigitalstructure.data.settings.testing.showData: \"true\" in settings.json');
		console.log('-');
	}

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
			console.log('-');
			console.log('learn-example #1; mydigitalstructure.cloud session object:');
			console.log(mydigitalstructure.data.session);
			console.log('-');
		}
	});
	
	mydigitalstructure.invoke('learn-example-1-show-session');

	/*
		[LEARN EXAMPLE #2]
		Now with some parameters and data.
		
		In example using mydigitalstructure._util.message instead of console.log,
		so as to format message before showing in terminal/console.
	*/

	mydigitalstructure.add(
	{
		name: 'learn-example-2-show-session',
		code: function (param, data)
		{
			if (!_.isUndefined(param))
			{
				mydigitalstructure._util.message(param.hello)
				mydigitalstructure._util.message(data)
				mydigitalstructure._util.message('-')
			}
		}
	});

	mydigitalstructure.invoke('learn-example-2-show-session',
			{hello: 'learn-example #2; mydigitalstructure.cloud session object:'},
			mydigitalstructure.data.session);

	/*
		[LEARN EXAMPLE #3]
		Get and set data locally.
		
		This example uses mydigitalstructure.set/.get - you can store at any level
		ie just scope, scope/context or scope/context/name.
		The value can be any Javascript data type ie string, number, object, array.
	*/

	mydigitalstructure.add(
	{
		name: 'learn-example-3-local-data',
		code: function (param, data)
		{
			mydigitalstructure.set(
			{
				scope: 'learn-example-3-local-data',
				context: 'example-context',
				name: 'example-name',
				value: 'example-value'
			});

			var data = mydigitalstructure.get(
			{
				scope: 'learn-example-3-local-data',
				context: 'example-context',
				name: 'example-name'
			});

			mydigitalstructure._util.message('learn-example #3; Local Data:');
			mydigitalstructure._util.message(data);
		}
	});

	mydigitalstructure.invoke('learn-example-3-local-data');

	/*
		[LEARN EXAMPLE #4]
		Retrieve some data from mydigitalstructure.cloud
	*/

	mydigitalstructure.add(
	[
		{
			name: 'learn-example-4-mydigitalstructure.cloud-retrieve-contacts',
			code: function (param)
			{
				var querystring = require('querystring');

				mydigitalstructure.cloud.retrieve(
				{
					object: 'contact_person',
					fields:
					[
						{name: 'firstname'},
						{name: 'surname'}
					],
					callback: 'learn-example-4-mydigitalstructure.cloud-show-contacts'
				});
			}
		},
		{
			name: 'learn-example-4-mydigitalstructure.cloud-show-contacts',
			note: 'Handles the response from mydigitalstructure.cloud',
			code: function (param, data)
			{
				mydigitalstructure._util.message('learn-example #3; Returned JSON Data:');
				mydigitalstructure._util.message(data);

				/*
					Invoked here so is called after data is returned from mydigitalstucture.cloud
				*/

				mydigitalstructure.invoke('learn-example-4-mydigitalstructure.cloud-save-contact');
			}
		}
	]);

	mydigitalstructure.invoke('learn-example-4-mydigitalstructure.cloud-retrieve-contacts');

	/*
		[LEARN EXAMPLE #5]
		Save some data to mydigitalstructure.cloud.

		!!! mydigitalstructure.cloud will return with error message ""No rights (No Access to method)",
		to make it work update the settings.json logon & password to be your own,
		ie. as you use to log on to https://console.mydigitalstructure.cloud.
	*/

	mydigitalstructure.add(
	[
		{
			name: 'learn-example-5-mydigitalstructure.cloud-save-contact',
			code: function (param)
			{
				var querystring = require('querystring');

				mydigitalstructure.cloud.save(
				{
					object: 'contact_person',
					fields:
					{
						firstname: 'A',
						surname: 'B'
					},
					callback: 'learn-example-5-mydigitalstructure.cloud-save-contact-confirm'
				});
			}
		},
		{
			name: 'learn-example-5-mydigitalstructure.cloud-save-contact-confirm',
			note: 'Handles the response from mydigitalstructure.cloud',
			code: function (param, data)
			{
				mydigitalstructure._util.message('learn-example #4; Returned JSON Data:');
				mydigitalstructure._util.message(data);
			}
		}
	]);
}