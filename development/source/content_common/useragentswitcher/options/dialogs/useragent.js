// User Agent Switcher user agent dialog
var UserAgentSwitcherUserAgentDialog =
{
	// Clears the user agent
	clearUserAgent: function()
	{
		window.opener.UserAgentSwitcherOptions.appCodeName = null;
		window.opener.UserAgentSwitcherOptions.appName     = null;
		window.opener.UserAgentSwitcherOptions.appVersion  = null;
		window.opener.UserAgentSwitcherOptions.description = null;
		window.opener.UserAgentSwitcherOptions.platform    = null;
		window.opener.UserAgentSwitcherOptions.userAgent   = null;
	},
	
	// Initializes the user agent dialog box
	initialize: function()
	{
		var type = window.arguments[0];
	
		// If the type is new
		if(type == "new")
		{
			document.documentElement.getButton("accept").disabled = true;
			document.title                                        = UserAgentSwitcherStringBundle.getString("newUserAgent");
	
			this.retrieveDefault();
		}
		else if(type == "edit")
		{
			document.getElementById("useragentswitcher-new-user-agent").hidden       = true;
			document.getElementById("useragentswitcher-user-agent-separator").hidden = true;
			document.getElementById("useragentswitcher-app-code-name").value         = window.arguments[1];
			document.getElementById("useragentswitcher-app-name").value              = window.arguments[2];
			document.getElementById("useragentswitcher-app-version").value           = window.arguments[3];
			document.getElementById("useragentswitcher-description").value           = window.arguments[4];
			document.getElementById("useragentswitcher-platform").value              = window.arguments[5];
			document.getElementById("useragentswitcher-user-agent").value            = window.arguments[6];
			document.getElementById("useragentswitcher-vendor").value                = window.arguments[7];
			document.getElementById("useragentswitcher-vendor-sub").value            = window.arguments[8];
			document.title                                                           = UserAgentSwitcherStringBundle.getString("editUserAgent");
		}
	},
	
	// Retrieves the default user agent
	retrieveDefault: function()
	{
		var appCodeName = null;
		var appName     = null;
		var appVersion  = null;
		var description = null;
		var platform    = null;
		var userAgent   = null;
		var vendor      = null;
		var vendorSub   = null;
	
		// If the app code name is being overridden
		if(UserAgentSwitcherPreferences.isPreferenceSet("general.useragent.appName"))
		{
			appCodeName = UserAgentSwitcherPreferences.getStringPreference("general.useragent.appName", true);
	
			UserAgentSwitcherPreferences.deletePreference("general.useragent.appName");
		}
	
		// If the app name is being overridden
		if(UserAgentSwitcherPreferences.isPreferenceSet("general.appname.override"))
		{
			appName = UserAgentSwitcherPreferences.getStringPreference("general.appname.override", true);
	
			UserAgentSwitcherPreferences.deletePreference("general.appname.override");
		}
	
		// If the app version is being overridden
		if(UserAgentSwitcherPreferences.isPreferenceSet("general.appversion.override"))
		{
			appVersion = UserAgentSwitcherPreferences.getStringPreference("general.appversion.override", true);
	
			UserAgentSwitcherPreferences.deletePreference("general.appversion.override");
		}
	
		// If the platform is being overridden
		if(UserAgentSwitcherPreferences.isPreferenceSet("general.platform.override"))
		{
			platform = UserAgentSwitcherPreferences.getStringPreference("general.platform.override", true);
	
			UserAgentSwitcherPreferences.deletePreference("general.platform.override");
		}
	
		// If the user agent is being overridden
		if(UserAgentSwitcherPreferences.isPreferenceSet("general.useragent.override"))
		{
			userAgent = UserAgentSwitcherPreferences.getStringPreference("general.useragent.override", true);
	
			UserAgentSwitcherPreferences.deletePreference("general.useragent.override");
		}
	
		// If the vendor is being overridden
		if(UserAgentSwitcherPreferences.isPreferenceSet("general.useragent.vendor"))
		{
			vendor = UserAgentSwitcherPreferences.getStringPreference("general.useragent.vendor", true);
	
			UserAgentSwitcherPreferences.deletePreference("general.useragent.vendor");
		}
	
		// If the vendor sub is being overridden
		if(UserAgentSwitcherPreferences.isPreferenceSet("general.useragent.vendorSub"))
		{
			vendorSub = UserAgentSwitcherPreferences.getStringPreference("general.useragent.vendorSub", true);
	
			UserAgentSwitcherPreferences.deletePreference("general.useragent.vendorSub");
		}
	
		document.getElementById("useragentswitcher-app-code-name").value = navigator.appCodeName;
		document.getElementById("useragentswitcher-app-name").value      = navigator.appName;
		document.getElementById("useragentswitcher-app-version").value   = navigator.appVersion;
		document.getElementById("useragentswitcher-platform").value      = navigator.platform;
		document.getElementById("useragentswitcher-user-agent").value    = navigator.userAgent;
		document.getElementById("useragentswitcher-vendor").value        = navigator.vendor;
		document.getElementById("useragentswitcher-vendor-sub").value    = navigator.vendorSub;
	
		// If the app code name was being overridden
		if(appCodeName)
		{
			UserAgentSwitcherPreferences.setStringPreference("general.useragent.appName", appCodeName);
		}
	
		// If the app name was being overridden
		if(appName)
		{
			UserAgentSwitcherPreferences.setStringPreference("general.appname.override", appName);
		}
	
		// If the app version was being overridden
		if(appVersion)
		{
			UserAgentSwitcherPreferences.setStringPreference("general.appversion.override", appVersion);
		}
	
		// If the platform was being overridden
		if(platform)
		{
			UserAgentSwitcherPreferences.setStringPreference("general.platform.override", platform);
		}
	
		// If the user agent was being overridden
		if(userAgent)
		{
			UserAgentSwitcherPreferences.setStringPreference("general.useragent.override", userAgent);
		}
	
		// If the vendor was being overridden
		if(vendor)
		{
			UserAgentSwitcherPreferences.setStringPreference("general.useragent.vendor", vendor);
		}
	
		// If the vendor sub was being overridden
		if(vendorSub)
		{
			UserAgentSwitcherPreferences.setStringPreference("general.useragent.vendorSub", vendorSub);
		}
	},
	
	// Saves a user agent
	saveUserAgent: function()
	{
		window.opener.UserAgentSwitcherOptions.appCodeName = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-app-code-name").value);
		window.opener.UserAgentSwitcherOptions.appName     = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-app-name").value);
		window.opener.UserAgentSwitcherOptions.appVersion  = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-app-version").value);
		window.opener.UserAgentSwitcherOptions.description = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-description").value);
		window.opener.UserAgentSwitcherOptions.platform    = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-platform").value);
		window.opener.UserAgentSwitcherOptions.userAgent   = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-user-agent").value);
		window.opener.UserAgentSwitcherOptions.vendor      = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-vendor").value);
		window.opener.UserAgentSwitcherOptions.vendorSub   = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-vendor-sub").value);
	},
	
	// Disable the OK button if the description is not set
	updateDescription: function()
	{
		document.documentElement.getButton("accept").disabled = (UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-description").value).length == 0);
	}
};