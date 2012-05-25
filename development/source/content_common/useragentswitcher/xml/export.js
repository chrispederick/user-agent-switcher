// User Agent Switcher exporter
var UserAgentSwitcherExporter =
{
	// Exports the user agents to a file
	export: function(file)
	{
		// Try to export to a file
		try
		{
			// If the file does not exist
			if(!file.exists())
			{
				file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 00644);
			}
	
			// If the file exists, is a file and is writable
			if(file.exists() && file.isFile() && file.isWritable())
			{
				var element       = null;
				var outputStream  = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				var xmlDocument   = document.implementation.createDocument("", "", null);
        		var rootElement   = xmlDocument.createElement("useragentswitcher");
				var xmlSerializer = new XMLSerializer();
	
				this.exportFile(document.getElementById("useragentswitcher-options-user-agents").childNodes, rootElement, xmlDocument);
	
				xmlDocument.appendChild(rootElement);

				outputStream.init(file, 0x04 | 0x08 | 0x20, 00644, null);
				xmlSerializer.serializeToStream(xmlDocument, outputStream, "utf-8");
				outputStream.close();
			}
			else
			{
				return UserAgentSwitcherStringBundle.getFormattedString("exportFileFailed", [file.path]);
			}
		}
		catch(exception)
		{
			UserAgentSwitcherLog.log("UserAgentSwitcherExporter.export", exception);
		}
		
		return null;
	},

	// Exports the user agents
	exportFile: function(elements, parentElement, xmlDocument)
	{
		var elementsLength = elements.length;

		// Loop through the elements
		for(var i = 0; i < elementsLength; i++)
		{
			var element = elements[i];
			
			// If the element is a separator
			if(element.nodeName == "treeseparator")
			{
				this.exportSeparator(parentElement, xmlDocument);
			}
			else if(element.hasAttribute("container"))
			{
				this.exportFolder(element, parentElement, xmlDocument);
			}
			else
			{
				this.exportUserAgent(element, parentElement, xmlDocument);
			}
		}
	},
	
	// Exports a folder
	exportFolder: function(element, parentElement, xmlDocument)
	{
		var folder        = xmlDocument.createElement("folder");
		var folderElement = element.getElementsByTagName("treerow")[0].getElementsByTagName("treecell")[0];

		// If the folder has a label
		if(folderElement.hasAttribute("label"))
		{
			folder.setAttribute("description", folderElement.getAttribute("label"));
		}

		this.exportFile(element.getElementsByTagName("treechildren")[0].childNodes, folder, xmlDocument);
	
		parentElement.appendChild(folder);
	},

	// Exports a separator
	exportSeparator: function(parentElement, xmlDocument)
	{
		parentElement.appendChild(xmlDocument.createElement("separator"));
	},
	
	// Exports a user agent
	exportUserAgent: function(element, parentElement, xmlDocument)
	{
		var userAgentElement = element.getElementsByTagName("treerow")[0].getElementsByTagName("treecell")[0];
		
		// If the user agent has a label
		if(userAgentElement.hasAttribute("label"))
		{
			var userAgent = xmlDocument.createElement("useragent");

			userAgent.setAttribute("description", userAgentElement.getAttribute("label"));

			// If the user agent is set
			if(userAgentElement.hasAttribute("useragentswitcheruseragent"))
			{
				userAgent.setAttribute("useragent", userAgentElement.getAttribute("useragentswitcheruseragent"));
			}
			else
			{
				userAgent.setAttribute("useragent", "");
			}
	
			// If the app code name is set
			if(userAgentElement.hasAttribute("useragentswitcherappcodename"))
			{
				userAgent.setAttribute("appcodename", userAgentElement.getAttribute("useragentswitcherappcodename"));
			}
			else
			{
				userAgent.setAttribute("appcodename", "");
			}
	
			// If the app name is set
			if(userAgentElement.hasAttribute("useragentswitcherappname"))
			{
				userAgent.setAttribute("appname", userAgentElement.getAttribute("useragentswitcherappname"));
			}
			else
			{
				userAgent.setAttribute("appname", "");
			}
	
			// If the app version is set
			if(userAgentElement.hasAttribute("useragentswitcherappversion"))
			{
				userAgent.setAttribute("appversion", userAgentElement.getAttribute("useragentswitcherappversion"));
			}
			else
			{
				userAgent.setAttribute("appversion", "");
			}
	
			// If the platform is set
			if(userAgentElement.hasAttribute("useragentswitcherplatform"))
			{
				userAgent.setAttribute("platform", userAgentElement.getAttribute("useragentswitcherplatform"));
			}
			else
			{
				userAgent.setAttribute("platform", "");
			}
	
			// If the vendor is set
			if(userAgentElement.hasAttribute("useragentswitchervendor"))
			{
				userAgent.setAttribute("vendor", userAgentElement.getAttribute("useragentswitchervendor"));
			}
			else
			{
				userAgent.setAttribute("vendor", "");
			}
	
			// If the vendor sub is set
			if(userAgentElement.hasAttribute("useragentswitchervendorsub"))
			{
				userAgent.setAttribute("vendorsub", userAgentElement.getAttribute("useragentswitchervendorsub"));
			}
			else
			{
				userAgent.setAttribute("vendorsub", "");
			}
	
			parentElement.appendChild(userAgent);
		}
	},

	// Returns the user agent file location
	getUserAgentFileLocation: function()
	{
		return UserAgentSwitcherImporter.getUserAgentFileLocation();
	}
};
