module.exports = 
{
	data: {},

	init:  	function ()
			{
				var self = this;
				var fs = require('fs');

				fs.readFile('settings.json', function (err, buffer)
				{
					if (!err)
					{	
						var sContents = buffer.toString();
						var oContents = JSON.parse(sContents);
						self.data.settings = oContents;
					}	
				});
			},

	logon:  function (fCallBack)
			{
				var self = this;
				var http = require('http');
				var sData = 'logon=' + self.data.settings.logon + 
							'&password=' + self.data.settings.password;

				var options =
				{
					hostname: 'app.coding.lab.ibcom.biz',
					port: 80,
					path: '/rpc/logon/?method=LOGON',
					method: 'POST',
					headers:
					{
						'Content-Type': 'application/x-www-form-urlencoded',
						'Content-Length': sData.length
					}
				};

				var req = http.request(options, function(res)
				{
					res.setEncoding('utf8');
					res.on('data', function (data)
					{
				    	self.data.user = JSON.parse(data)
				    	fCallBack(false, data);
					});
				});

				req.on('error', function(e)
				{
				  fCallBack(true, e.message);
				});

				req.write(sData);

				req.end()
			}		
}