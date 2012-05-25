// User Agent Switcher folder dialog
var UserAgentSwitcherFolderDialog =
{
	// Clears the user agent
	clearFolder: function()
	{
		window.opener.UserAgentSwitcherOptions.folder = null;
	},
	
	// Initializes the folder dialog box
	initialize: function()
	{
		var type = window.arguments[0];
	
		// If the type is new
		if(type == "new")
		{
			document.documentElement.getButton("accept").disabled = true;
			document.title                                        = UserAgentSwitcherStringBundle.getString("newFolder");
		}
		else if(type == "edit")
		{	
			document.getElementById("useragentswitcher-name").value = window.arguments[1];
			document.title                                          = UserAgentSwitcherStringBundle.getString("editFolder");
		}
	},

	// Saves a folder
	saveFolder: function()
	{
		window.opener.UserAgentSwitcherOptions.folder = UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-name").value);
	},
	
	// Disable the OK button if the name is not set
	updateName: function()
	{
		document.documentElement.getButton("accept").disabled = (UserAgentSwitcherString.trim(document.getElementById("useragentswitcher-name").value).length == 0);
	}
};