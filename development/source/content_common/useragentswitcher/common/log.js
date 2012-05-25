// User Agent Switcher log
var UserAgentSwitcherLog =
{	
	// Logs a message to the console
	log: function(identifier, message)
	{
		// Try to get the console service
		try
		{
			// If the message is not set
			if(!message)
			{
				message    = identifier;
				identifier = "User Agent Switcher";
			}
		
			Components.classes["@mozilla.org/consoleservice;1"].getService().QueryInterface(Components.interfaces.nsIConsoleService).logStringMessage(identifier + ": " + message);		
		}
		catch(exception)
		{
			// Do nothing
		}
	}
};