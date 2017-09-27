var myJquery = require('./myJquery');

module.exports =
{
	data: {},

	formatXHTML: function(sValue, bDirection)
	{
		var aFind = [
			String.fromCharCode(8220), //“
			String.fromCharCode(8221), //”
			String.fromCharCode(8216), //‘
			String.fromCharCode(8217), //‘
			String.fromCharCode(8211), //–
			String.fromCharCode(8212), //—
			String.fromCharCode(189), //½
			String.fromCharCode(188), //¼
			String.fromCharCode(190), //¾
			String.fromCharCode(169), //©
			String.fromCharCode(174), //®
			String.fromCharCode(8230) //…  
		];	

		var aReplace = [
			'"',
			'"',
			"'",
			"'",
			"-",
			"--",
			"1/2",
			"1/4",
			"3/4",
			"(C)",
			"(R)",
			"..."
		];

		if(bDirection)
		{
			sValue= sValue.replace(/\&/g,'&amp;');
			sValue= sValue.replace(/</g,'&lt;');
			sValue= sValue.replace(/>/g,'&gt;');
		}
		else
		{
			sValue = sValue.replace(/\&amp;/g,'&');
			sValue = sValue.replace(/\&lt;/g,'<');
			sValue = sValue.replace(/\&gt;/g,'>');
			sValue = sValue.replace(/\&#45;/g, '-');
			sValue = sValue.replace(/\&#64;/g, '@');
			sValue = sValue.replace(/\&#47;/g, '/');
			sValue = sValue.replace(/\&quot;/g, '"');
			sValue = sValue.replace(/\&#39;/g, '\'');
			sValue = sValue.replace(/\&#239;‚&#167;,&#226;/g, '-');
			for ( var i = 0; i < aFind.length; i++ ) 
			{
				var regex = new RegExp(aFind[i], "gi");
				sValue = sValue.replace(regex, aReplace[i]);
			}
		}
		
		return sValue;	
	},

	sendLogFile: function(oParam)
	{
		var sciqual = module.exports;
		var bLocal = (oParam.settings.local != undefined) ? oParam.settings.local == "true" : false;
		var sHTML = '<p>' + oParam.logHTML.join('<br />') + '</p>';
		var sEmailData = 'to=' + encodeURIComponent(oParam.settings.email) +
					 '&subject=' + encodeURIComponent((oParam.errorOccurred == true || oParam.errorMinor === true ? 'ERROR ': '') + 
					 				(oParam.errorMinor === true ? (oParam.errorOccurred === true ? ':Minor ' : 'Minor Error ') : '') + 
					 				'Log File for ' + sciqual.data.automation.title) +
					 '&fromemail=' + encodeURIComponent(sciqual.data.automation.responseactionfrom) +
					 '&message=' + encodeURIComponent(sHTML) +
					 '&send=Y';

		oParam.ajax.type = 'POST';
		oParam.ajax.url = '/rpc/messaging/?method=MESSAGING_EMAIL_SEND&rf=JSON&logonkey=' + oParam.settings.user.logonkey + '&sid=' + oParam.settings.user.sid;
		oParam.ajax.data = sEmailData; 					
		oParam.ajax.rf = 'JSON';
		oParam.ajax.dataType = 'JSON';
		oParam.ajax.success = function(bErr, oResponse, oParam)
		{
			if (bErr || oResponse.status != 'OK')
			{
				if (bLocal) {console.log("Email sending failed: " + ((oResponse && oResponse.status === 'ER') ? oResponse.error.errornotes : ''));}
			}
			else 
			{
				if (bLocal) {console.log('Log file Email sent to ' + oParam.settings.email);}
			}
		};
		myJquery.ajax(oParam);
	},

	automation: 
	{
		preProcess: function(oParam, fCallBack, fCallBackAudits, fCallBackSend, fCallBackSendLog)
		{
		},
			
		process: function(oParam, fCallBack, fCallBackAudits, fCallBackSend, fCallBackSendLog)
		{
		}
	}
}


