// User Agent Switcher string
var UserAgentSwitcherString =
{	
	// Tests if a string ends with the given string
	endsWith: function(string, endsWithString)
	{
		return (string.substr(string.length - endsWithString.length) == endsWithString);
	},

	// Removes a substring from a string
	removeSubstring: function(string, substring)
	{
		// If the strings are not empty
		if(string && substring)
		{
			var substringStart = string.indexOf(substring);
	
			// If the substring is found in the string
			if(substring && substringStart != -1)
			{
				return string.substring(0, substringStart) + string.substring(substringStart + substring.length, string.length);
			}
	
			return string;
		}
	
		return "";
	},
	
	// Trims leading and trailing spaces from a string
	trim: function(string)
	{
		return string.replace(/^\s+|\s+$/g, "");
	}
};