// User Agent Switcher string bundle
var UserAgentSwitcherStringBundle =
{
	// Returns a formatted string from a string bundle
	getFormattedString: function(key, token)
	{
		var stringBundle = document.getElementById("useragentswitcher-string-bundle");
		
		// If the string bundle, key and token are set
		if(stringBundle && key && token)
		{
			// Try to get the string from the bundle
			try
			{
				return stringBundle.getFormattedString("useragentswitcher_" + key, token);
			}
			catch(exception)
			{
				// Do nothing
			}
		}
		
		return "";
	},

	// Returns a string from a string bundle
	getString: function(key)
	{
		var stringBundle = document.getElementById("useragentswitcher-string-bundle");
		
		// If the string bundle and key are set
		if(stringBundle && key)
		{
			// Try to get the string from the bundle
			try
			{
				return stringBundle.getString("useragentswitcher_" + key);
			}
			catch(exception)
			{
				// Do nothing
			}
		}
		
		return "";
	}
}
