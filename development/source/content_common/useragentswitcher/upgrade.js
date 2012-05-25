// User Agent Switcher upgrade
var UserAgentSwitcherUpgrade =
{
	// Gets the version
	getVersion: function()
	{
		return "@version@";
	},

	// Installs the user agents
	installUserAgents: function()
	{
		// If the user agent directory does not exist
		if(!UserAgentSwitcherImporter.getUserAgentDirectoryLocation().exists())
		{
			UserAgentSwitcherImporter.createUserAgentDirectory();
		}

		// If the user agent file does not exist
		if(!UserAgentSwitcherImporter.getUserAgentFileLocation().exists())
		{
			UserAgentSwitcherImporter.createUserAgentFile();
    		UserAgentSwitcherImporter.reset();
		}
	},

	// Migrate to version 0.7
	migrateTo07: function()
	{
		var description    = null;
		var userAgent      = null;
		var userAgentCount = UserAgentSwitcherPreferences.getIntegerPreference("useragentswitcher.user.agents.count");
		var userAgentFile  = null;
		var xmlDocument    = document.implementation.createDocument("", "", null);
		var rootElement    = xmlDocument.createElement("useragentswitcher");
	
		// If the user agent directory does not exist
		if(!UserAgentSwitcherImporter.getUserAgentDirectoryLocation().exists())
		{
			UserAgentSwitcherImporter.createUserAgentDirectory();
		}
		
		// If the user agent file exists
		if(UserAgentSwitcherImporter.getUserAgentFileLocation().exists())
		{
			userAgentFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

			userAgentFile.initWithPath(UserAgentSwitcherImporter.getUserAgentFileLocation().path);
		}
		else
		{
			userAgentFile = UserAgentSwitcherImporter.createUserAgentFile();
		}
		
		// Loop through the user agents
		for(var i = 1; i <= userAgentCount; i++)
		{
			description = UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".description");
			
			// If the description is set
    	if(description)
    	{
				userAgent = xmlDocument.createElement("useragent");

				userAgent.setAttribute("description", description);

				// If the user agent is set
				if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher." + i + ".useragent"))
				{
					userAgent.setAttribute("useragent", UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".useragent"));
				}
				else
				{
					userAgent.setAttribute("useragent", "");
				}
		
				// If the app code name is set
				if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher." + i + ".appcodename"))
				{
					userAgent.setAttribute("appcodename", UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".appcodename"));
				}
				else
				{
					userAgent.setAttribute("appcodename", "");
				}
		
				// If the app name is set
				if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher." + i + ".appname"))
				{
					userAgent.setAttribute("appname", UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".appname"));
				}
				else
				{
					userAgent.setAttribute("appname", "");
				}
		
				// If the app version is set
				if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher." + i + ".appversion"))
				{
					userAgent.setAttribute("appversion", UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".appversion"));
				}
				else
				{
					userAgent.setAttribute("appversion", "");
				}
		
				// If the platform is set
				if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher." + i + ".platform"))
				{
					userAgent.setAttribute("platform", UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".platform"));
				}
				else
				{
					userAgent.setAttribute("platform", "");
				}
		
				// If the vendor is set
				if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher." + i + ".vendor"))
				{
					userAgent.setAttribute("vendor", UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".vendor"));
				}
				else
				{
					userAgent.setAttribute("vendor", "");
				}
		
				// If the vendor sub is set
				if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher." + i + ".vendorsub"))
				{
					userAgent.setAttribute("vendorsub", UserAgentSwitcherPreferences.getStringPreference("useragentswitcher." + i + ".vendorsub"));
				}
				else
				{
					userAgent.setAttribute("vendorsub", "");
				}
			}		

			rootElement.appendChild(userAgent);
			UserAgentSwitcherPreferences.deletePreferenceBranch("useragentswitcher." + i + ".");
		}
	
		UserAgentSwitcherPreferences.deletePreference("useragentswitcher.user.agents.count");

		// If old user agents could be migrated
		if(rootElement.childNodes.length > 0)
		{
			var outputStream  = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			var xmlSerializer = new XMLSerializer();

			xmlDocument.appendChild(rootElement);
	
			outputStream.init(userAgentFile, 0x04 | 0x08 | 0x20, 00644, null);
			xmlSerializer.serializeToStream(xmlDocument, outputStream, "utf-8");
			outputStream.close();
		} 
		else
		{
			UserAgentSwitcherImporter.reset();
		}
	},

	// Opens the upgrade page
	openUpgradePage: function()
	{
		var windowContent = window.getBrowser();
	
		windowContent.removeEventListener("load", UserAgentSwitcherUpgrade.openUpgradePage, false);

		window.setTimeout(function() { windowContent.selectedTab = windowContent.addTab("@home.page@installed/" + UserAgentSwitcherUpgrade.getVersion().replace(/\./g, "") + "/"); }, 0);	
	},

	// Parses the version number
	parseVersion: function(version)
	{
		// If the version is set
		if(version)
		{
			var splitVersion       = version.split(".");
			var parsedVersion      = splitVersion[0] + ".";
			var splitVersionLength = splitVersion.length;
	
			// Loop through the remaining parts of the version
			for(var i = 1; i < splitVersionLength; i++)
			{
				parsedVersion += splitVersion[i];
			}
	
			return parseFloat(parsedVersion);
		}
		else
		{
			return 0;
		}
	},
	
	// Sets the version
	setVersion: function()
	{
		UserAgentSwitcherPreferences.setStringPreference("useragentswitcher.version", UserAgentSwitcherUpgrade.getVersion());
	},
	
	// Upgrades the extension
	upgrade: function()
	{
		var previousVersion = this.parseVersion(UserAgentSwitcherPreferences.getStringPreference("useragentswitcher.version", true));
		var version         = this.parseVersion(this.getVersion());

		// If the versions do not match
		if(previousVersion != version)
		{
			// If the previous version is less than 0.7
			if(previousVersion < this.parseVersion("0.7"))
			{
				this.migrateTo07();
			}

			this.installUserAgents();

			window.getBrowser().addEventListener("load", UserAgentSwitcherUpgrade.openUpgradePage, false);
	
			UserAgentSwitcherPreferences.setStringPreference("useragentswitcher.version", version);
		}
	}
};
