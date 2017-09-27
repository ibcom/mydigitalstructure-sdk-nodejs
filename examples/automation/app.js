/* https://www.npmjs.org/package/node-schedule
 * 0 = Sunday
 * rule.dayOfWeek = [0, new schedule.Range(4, 6)];
 * hour is 24 hour format

 * mydigitalstructure.send(options, data, callback)
 */

var mydigitalstructure = require('./mydigitalstructure');

var app = 
{
	settings: {},

	start: function (err, data, settings)
	{
		oSettings = settings;

		if (data.status === "OK")
		{
			var schedule = require('node-schedule');

			if (oSettings.automations)
			{
				for (var i = 0; i < oSettings.automations.length; i++)
				{
					(function(e)
					{
						var oAutomation = oSettings.automations[e];
						mydigitalstructure.data['rule' + oAutomation.id] = new schedule.RecurrenceRule();
						mydigitalstructure.data['rule' + oAutomation.id].dayOfWeek =
						[
							new schedule.Range(parseInt(oAutomation.schedule.dayOfWeekRange.start), 
									parseInt(oAutomation.schedule.dayOfWeekRange.end))
						];		
						mydigitalstructure.data['rule' + oAutomation.id].hour = parseInt(oAutomation.schedule.hour); 
						mydigitalstructure.data['rule' + oAutomation.id].minute = parseInt(oAutomation.schedule.minute);

						mydigitalstructure.data['schedule' + oAutomation.id] = schedule.scheduleJob(mydigitalstructure.data['rule' + oAutomation.id], 
							function() {app[oAutomation.functionName].start()}
							);
					})(i);

				}
			}
		}	
	}
}

app.custom = require('./custom');

mydigitalstructure.init(app.settings, mydigitalstructure.logon, app.start);