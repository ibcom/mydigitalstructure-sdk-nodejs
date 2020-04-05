/*
	This is an example app to use as starting point for building a mydigitalstucture.cloud based nodejs app ... 
	Once nodejs has been installed; run 'node learn.js' using the OS terminal/console command prompt

	If you plan to host the app using AWS lambda then check out index.js

	Help @ https://learn-next.mydigitalstructure.cloud/learn-function-automation
*/

var mydigitalstructure = require('mydigitalstructure')
var _ = require('lodash')
var moment = require('moment');

/*
	mydigitalstructure. functions impact local data.
	mydigitalstructure.cloud. functions impact data managed by the mydigitalstructure.cloud service (remote).

	All functions invoked on mydigitalstructure.cloud (remote) are asynchronous, 
	in that the local code will keep running after the invoke and you need to
	use a callcack: controller to handle the response from mydigitalstructure.cloud, as in examples 5 & 5 below.	

	To get the current logged on user using mydigitalstructure.cloud.invoke({method: 'core_get_user_details'}),
*/

mydigitalstructure.init(main)

function main(err, data)
{
	if (mydigitalstructure.data.settings.testing.status != 'true')
	{
		mydigitalstructure._util.message(
		[
			'-',
			'learn-tip #1:',
			' To see the mydigitalstructure module requests to and received responses from mydigitalstructure.cloud;',
			' set mydigitalstructure.data.settings.testing.status: \"true\"',
			' and/or mydigitalstructure.data.settings.testing.showData: \"true\" in settings.json',
		]);

		/*
			You can use mydigitalstructure._util.message to write a message to the terminal command line.
			You can pass a string or an array of strings.  If it is an array each string will be displayed on a new line.
		*/ 
	}

	/*
		[LEARN EXAMPLE #1]
		Use mydigitalstructure.add to add your controller functions to your app and mydigitalstructure.invoke to run them,
		as per example app-show-session.
	*/

	mydigitalstructure.add(
	{
		name: 'learn-example-1-show-session',
		code: function ()
		{
			mydigitalstructure._util.message(
			[
				'-',
				'Using mydigitalstructure module version ' + mydigitalstructure.VERSION,
				'-',
				'learn-example #1; mydigitalstructure.cloud session object:',
				mydigitalstructure.data.session
			]);
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
				mydigitalstructure._util.message(
				[
					'-',
					param.hello,
					data
				])
			}
		}
	});

	mydigitalstructure.invoke(
	'learn-example-2-show-session',
	{
		hello: 'learn-example #2; mydigitalstructure.cloud session object:'
	},
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

			mydigitalstructure._util.message(
			[
				'-',
				'learn-example #3; Local Data:',
				data,
			]);
		}
	});

	mydigitalstructure.invoke('learn-example-3-local-data');

	/*
		[LEARN EXAMPLE #4]
		Retrieve some data from mydigitalstructure.cloud

		!! Call to mydigitalstructure.cloud is asynchronous so a callback controller needs to be used.
			It then invokes the next example, else it will be invoked before this example is complete.
	*/

	mydigitalstructure.add(
	[
		{
			name: 'learn-example-4-mydigitalstructure.cloud-retrieve-contacts',
			code: function (param)
			{
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
			code: function (param, response)
			{
				mydigitalstructure._util.message(
				[
					'-',
					'learn-example #4; Returned JSON Data:',
					response
				]);

				/*
					Invoked here so is called after data is returned from mydigitalstucture.cloud
				*/

				mydigitalstructure.invoke('learn-example-5-mydigitalstructure.cloud-save-contact');
			}
		}
	]);

	mydigitalstructure.invoke('learn-example-4-mydigitalstructure.cloud-retrieve-contacts');

	/*
		[LEARN EXAMPLE #5]
		Save some data to mydigitalstructure.cloud.

		!! Call to mydigitalstructure.cloud is asynchronous so a callback controller needs to be used.
			It then invokes the next example, else it will be invoked before this example is complete.

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
			code: function (param, response)
			{
				mydigitalstructure._util.message(
				[
					'-',
					'learn-example #5; Returned JSON Data:',
					response
				]);

				mydigitalstructure.invoke('learn-example-6-mydigitalstructure.cloud-retrieve-contacts');
			}
		}
	]);

	/*
		[LEARN EXAMPLE #6]
		Retrieve some data from mydigitalstructure.cloud
		And loop through the return rows and write them to the console.

		It also checks that the response as OK and if not shows the error.

		List of fields and filters @
		https://learn-next.mydigitalstructure.cloud/schema

		To add a filter to search by say firstname add following to code below:
		{
			field: 'firstname',
			comparison: 'EQUAL_TO',
			value: 'John'
		}

		The following example uses the lodash.com _.each() method.

		!! Call to mydigitalstructure.cloud is asynchronous so a callback controller needs to be used.
	*/

	mydigitalstructure.add(
	[
		{
			name: 'learn-example-6-mydigitalstructure.cloud-retrieve-contacts',
			code: function (param)
			{
				mydigitalstructure.cloud.retrieve(
				{
					object: 'contact_person',
					fields:
					[
						{name: 'firstname'},
						{name: 'surname'},
						{name: 'guid'}
					],
					filters:
					[],
					callback: 'learn-example-6-mydigitalstructure.cloud-retrieve-contacts-show'
				});
			}
		},
		{
			name: 'learn-example-6-mydigitalstructure.cloud-retrieve-contacts-show',
			note: 'Handles the response from mydigitalstructure.cloud and shows the contacts or error.',
			code: function (param, response)
			{
				if (response.status == 'ER')
				{
					mydigitalstructure._util.message(
					[
						'-',
						'learn-example #6:',
						'Error Code; ' + response.error.errorcode,
						'Error Notes; ' + response.error.errornotes,
						'Help @ ' + response.error.methodhelp
					]);
				}
				else
				{
					mydigitalstructure._util.message(
					[
						'-',
						'learn-example #6 Data:',
						'-'
					]);

					_.each(response.data.rows, function (row)
					{
						mydigitalstructure._util.message(
						[
							'First name; ' + row.firstname,
							'Surname; ' + row.surname,
							'Unique ID; ' + row.guid,
							'-'
						]);
					});
				}				
			}
		}
	]);
}