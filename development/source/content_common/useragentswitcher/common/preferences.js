// User Agent Switcher preferences
var UserAgentSwitcherPreferences =
{
	// Deletes a preference
	deletePreference: function(preference)
	{
		// If the preference is set
		if(preference)
		{
			// If a user preference is set
			if(this.isPreferenceSet(preference))
			{
				this.getPreferencesService().clearUserPref(preference);
			}
		}
	},
	
	// Deletes a preference branch
	deletePreferenceBranch: function(branch)
	{
		// If the branch is set
		if(branch)
		{
			this.getPreferencesService().deleteBranch(branch);
		}
	},
	
	// Gets a boolean preference, returning false if the preference is not set
	getBooleanPreference: function(preference, userPreference)
	{
		// If the preference is set
		if(preference)
		{
			// If not a user preference or a user preference is set
			if(!userPreference || this.isPreferenceSet(preference))
			{
				try
				{
					return this.getPreferencesService().getBoolPref(preference);
				}
				catch(exception)
				{
					// Do nothing
				}
			}
		}
	
		return false;
	},
	
	// Gets an integer preference, returning 0 if the preference is not set
	getIntegerPreference: function(preference, userPreference)
	{
		// If the preference is set
		if(preference)
		{
			// If not a user preference or a user preference is set
			if(!userPreference || this.isPreferenceSet(preference))
			{
				try
				{
					return this.getPreferencesService().getIntPref(preference);
				}
				catch(exception)
				{
					// Do nothing
				}
			}
		}
	
		return 0;
	},
	
	// Gets the preferences service
	getPreferencesService: function()
	{
		return Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService).getBranch("");
	},
	
	// Gets a string preference, returning null if the preference is not set
	getStringPreference: function(preference, userPreference)
	{
		// If the preference is set
		if(preference)
		{
			// If not a user preference or a user preference is set
			if(!userPreference || this.isPreferenceSet(preference))
			{
				try
				{
					return UserAgentSwitcherString.trim(this.getPreferencesService().getComplexValue(preference, Components.interfaces.nsISupportsString).data);
				}
				catch(exception)
				{
					// Do nothing
				}
			}
		}
	
		return null;
	},
	
	// Is a preference set
	isPreferenceSet: function(preference)
	{
		// If the preference is set
		if(preference)
		{
			return this.getPreferencesService().prefHasUserValue(preference);
		}
	
		return false;
	},
	
	// Sets a boolean preference
	setBooleanPreference: function(preference, value)
	{
		// If the preference is set
		if(preference)
		{
			this.getPreferencesService().setBoolPref(preference, value);
		}
	},
	
	// Sets a boolean preference if it is not already set
	setBooleanPreferenceIfNotSet: function(preference, value)
	{
		// If the preference is not set
		if(!this.isPreferenceSet(preference))
		{
			this.getPreferencesService().setBoolPref(preference, value);
		}
	},
	
	// Sets an integer preference
	setIntegerPreference: function(preference, value)
	{
		// If the preference is set
		if(preference)
		{
			this.getPreferencesService().setIntPref(preference, value);
		}
	},
	
	// Sets an integer preference if it is not already set
	setIntegerPreferenceIfNotSet: function(preference, value)
	{
		// If the preference is not set
		if(!this.isPreferenceSet(preference))
		{
			this.setIntegerPreference(preference, value);
		}
	},
	
	// Sets a string preference
	setStringPreference: function(preference, value)
	{
		// If the preference is set
		if(preference)
		{
			var supportsStringInterface = Components.interfaces.nsISupportsString;
			var string                  = Components.classes["@mozilla.org/supports-string;1"].createInstance(supportsStringInterface);
	
			string.data = value;
	
			this.getPreferencesService().setComplexValue(preference, supportsStringInterface, string);
		}
	},
	
	// Sets a string preference if it is not already set
	setStringPreferenceIfNotSet: function(preference, value)
	{
		// If the preference is not set
		if(!this.isPreferenceSet(preference))
		{
			this.setStringPreference(preference, value);
		}
	}
};