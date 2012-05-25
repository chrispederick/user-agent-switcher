// User Agent Switcher about
var UserAgentSwitcherAbout = 
{
	// Opens the URL in a new tab
	openURL: function(urlElement)
	{
		var parentWindow = null;
		var url          = urlElement.firstChild.nodeValue;
	
		// If there is a parent window
		if(window.opener)
		{
			// If there is a grand parent window and it has the extension menu
			if(window.opener.opener && window.opener.opener.document.getElementById("useragentswitcher-menu"))
			{
				parentWindow = window.opener.opener;
			}
			else
			{
				parentWindow = window.opener;
			}
		}
	
		// If a parent window was found
		if(parentWindow)
		{
			parentWindow.getBrowser().selectedTab = parentWindow.getBrowser().addTab(url);
	
			window.close();
		}
	}
};