module.exports = 
{
	data: {},

	init:  	function (oSettings, fCallBack, fOnComplete)
			{
				var self = this;

				if (oSettings == undefined)
				{	
					var fs = require('fs');

					fs.readFile('settings.json', function (err, buffer)
					{
						if (!err)
						{	
							var sSettings = buffer.toString();
							console.log('#myds.init.settings:' + sSettings);
							var oSettings = JSON.parse(sSettings);
							self.data.settings = oSettings;
							if (fCallBack) {fCallBack(oSettings, fOnComplete)}
						}	
					});
				}
				else
				{
					self.data.settings = oSettings;
					if (fCallBack) {fCallBack(oSettings, fOnComplete)}
				}	
			},

	logon:  function (oSettings, fCallBack, fCallBackError)
			{
				var self = this;
				var https = require('https');
				var sData = 'logon=' + oSettings.logon + 
							'&password=' + oSettings.password;

				var options =
				{
					hostname: oSettings.hostname,
					port: 443,
					path: '/rpc/logon/?method=LOGON',
					method: 'POST',
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': sData.length
					}
				};

				var req = https.request(options, function(res)
				{
					res.setEncoding('utf8');

					var data = '';
					
					res.on('data', function(chunk)
					{
					  	data += chunk;
					});
					
					res.on('end', function ()
					{	
						console.log('#myds.logon.res.end.response:' + data)
				    	oSettings.session = JSON.parse(data);
				    	self.data.session = oSettings.session;
				    	if (fCallBack) {fCallBack(oSettings)};
					});
				});

				req.on('error', function(error)
				{
					console.log('#myds.logon.req.error.response:' + error.message)
				  	if (fCallBackError) {fCallBackError({error: error});
				});

				req.write(sData);
				req.end()
			},

	send:  	function (oOptions, sData, fCallBack)
			{
				var self = this;
				var https = require('https');
				var oSettings = self.data.settings;

				var sData = sData + '&sid=' + self.data.session.sid +
									'&logonkey=' + self.data.session.logonkey;
					
				var options =
				{
					hostname: oSettings.hostname,
					port: 443,
					path: oOptions.url,
					method: oOptions.type,
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': sData.length
					}
				};

				var req = https.request(options, function(res)
				{
					res.setEncoding('utf8');

					var data = '';
					
					res.on('data', function(chunk)
					{
					  	data += chunk;
					});
					
					res.on('end', function ()
					{	
						console.log('#myds.send.res.end.response:' + data)
				    	if (fCallBack) {fCallBack(data)};
					});
				});

				req.on('error', function(error)
				{
					console.log('#myds.logon.req.error.response:' + error.message)
				  	if (fCallBackError) {fCallBackError({error: error});
				});

				req.write(sData);
				req.end()
			}		
}