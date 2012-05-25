// User Agent Switcher importer
var UserAgentSwitcherImporter =
{
	importType:        0,
	importTypeMenu:    1,
	importTypeOptions: 2,
	
	folderCount:    0,
	separatorCount: 0,
	userAgentCount: 0,
	
	menuParentFolder:    null,
	optionsParentFolder: null,
	toolbarParentFolder: null,

	importDocument: null,

	// Adds a menu folder
	addMenuFolder: function(menu, suffix, parentFolder)
	{
		var newMenu = menu.cloneNode(true);

		newMenu.setAttribute("id", "useragentswitcher-folder-" + this.folderCount + "-" + suffix);

		// If the parent folder is set
		if(parentFolder)
		{
			parentFolder.firstChild.appendChild(newMenu);
		}
		else
		{
			var menu             = this.importDocument.getElementById("useragentswitcher-popup-" + suffix);
			var optionsSeparator = this.importDocument.getElementById("useragentswitcher-separator-2-" + suffix);
		
			// If the menu and options separator exist
			if(menu && optionsSeparator)
			{		
				menu.insertBefore(newMenu, optionsSeparator);
			}		
		}
		
		return newMenu;
	},

	// Adds a menu separator
	addMenuSeparator: function(menuSeparator, suffix, parentFolder)
	{
		var newMenuSeparator = menuSeparator.cloneNode(false);

		newMenuSeparator.setAttribute("id", "useragentswitcher-generated-separator-" + this.separatorCount + "-" + suffix);

		// If the parent folder is set
		if(parentFolder)
		{
			parentFolder.firstChild.appendChild(newMenuSeparator);
		}
		else
		{
			var menu             = this.importDocument.getElementById("useragentswitcher-popup-" + suffix);
			var optionsSeparator = this.importDocument.getElementById("useragentswitcher-separator-2-" + suffix);
		
			// If the menu and options separator exist
			if(menu && optionsSeparator)
			{		
				menu.insertBefore(newMenuSeparator, optionsSeparator);
			}		
		}
	},

	// Adds a menu user agent
	addMenuUserAgent: function(menuItem, suffix, parentFolder)
	{
		var newMenuItem = menuItem.cloneNode(false);

		newMenuItem.setAttribute("id", "useragentswitcher-user-agent-" + this.userAgentCount + "-" + suffix);
		newMenuItem.setAttribute("name", "useragentswitcher-group-" + suffix);		

		// If the parent folder is set
		if(parentFolder)
		{
			parentFolder.firstChild.appendChild(newMenuItem);
		}
		else
		{
			var menu             = this.importDocument.getElementById("useragentswitcher-popup-" + suffix);
			var optionsSeparator = this.importDocument.getElementById("useragentswitcher-separator-2-" + suffix);
		
			// If the menu and options separator exist
			if(menu && optionsSeparator)
			{		
				menu.insertBefore(newMenuItem, optionsSeparator);
			}		
		}
	},

	// Adds an option folder
	addOptionsFolder: function(treeItem)
	{
		// If the parent folder is set
		if(this.optionsParentFolder)
		{
			this.optionsParentFolder.appendChild(treeItem);
		}
		else
		{
			this.importDocument.getElementById("useragentswitcher-options-user-agents").appendChild(treeItem);
		}
	},

	// Adds an options separator
	addOptionsSeparator: function(treeSeparator)
	{
		// If the parent folder is set
		if(this.optionsParentFolder)
		{
			this.optionsParentFolder.appendChild(treeSeparator);
		}
		else
		{
			this.importDocument.getElementById("useragentswitcher-options-user-agents").appendChild(treeSeparator);
		}
	},

	// Adds an option user agent
	addOptionsUserAgent: function(treeItem)
	{
		// If the parent folder is set
		if(this.optionsParentFolder)
		{
			this.optionsParentFolder.appendChild(treeItem);
		}
		else
		{
			this.importDocument.getElementById("useragentswitcher-options-user-agents").appendChild(treeItem);
		}
	},

	// Creates the user agent directory
	createUserAgentDirectory: function()
	{
		var userAgentDirectory = this.getUserAgentDirectoryLocation();
		
	  userAgentDirectory.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0755);
	},

	// Creates the user agent file
	createUserAgentFile: function()
	{
		var userAgentFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

		userAgentFile.initWithPath(this.getUserAgentFileLocation().path);
		userAgentFile.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 00644);
		
		return userAgentFile;
	},

	// Evaluates the specified xpath on the specified element returning an array of the matching elements
	evaluateXPath: function(expression, element)
	{
		var evaluationResults = null;
		var matchingElement   = null;
		var matchingElements  = [];
		var ownerDocument     = element.ownerDocument;
		var xPathEvaluator    = new XPathEvaluator();
		var resolver          = xPathEvaluator.createNSResolver(element.ownerDocument == null ? element.documentElement : element.ownerDocument.documentElement);
	
		evaluationResults = xPathEvaluator.evaluate(expression, element, resolver, 0, null);
	
		// While there are more matching elements
		while((matchingElement = evaluationResults.iterateNext()) != null)
		{
			matchingElements.push(matchingElement);
		}
	
		return matchingElements;
	},

	// Returns the counts for existing user agents
	getExistingCounts: function()
	{
		var existingCounts = {};
		var userAgentTree  = this.importDocument.getElementById("useragentswitcher-options-user-agents");
	
		existingCounts.folderCount    = UserAgentSwitcherDOM.findElementsByXPath(userAgentTree, "//treeitem[@container='true']").length;
		existingCounts.separatorCount = UserAgentSwitcherDOM.findElementsByXPath(userAgentTree, "//treeseparator").length;
		existingCounts.userAgentCount = UserAgentSwitcherDOM.findElementsByXPath(userAgentTree, "//treeitem[not(@container)]").length;
	
		return existingCounts;
	},

	// Returns the user agent directory location
	getUserAgentDirectoryLocation: function()
	{
		var directory = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("ProfD", Components.interfaces.nsILocalFile);

		directory.append("useragentswitcher");
		
		return directory;
	},

	// Returns the user agent file location
	getUserAgentFileLocation: function()
	{
		var file = this.getUserAgentDirectoryLocation();
		
		file.append("useragents.xml");
		
		return file;
	},

	// Imports the user agents from a file
	import: function(type, file, ignoreParentWindow)
	{
		// Try to import from a file
		try
		{
			// If the file exists, is a file and is readable
			if(file.exists() && file.isFile() && file.isReadable())
			{
				var request     = new XMLHttpRequest();
				var xmlDocument = null;
	
				request.open("get", "file://" + file.path, false);
				request.send(null);
	
				xmlDocument = request.responseXML;
				
				// If the file could not be parsed correctly
				if(xmlDocument.documentElement.nodeName == "parsererror")
				{
					return UserAgentSwitcherStringBundle.getFormattedString("importParserError", [file.path]);
				}
				else
				{
					this.folderCount    = 0;
   				this.importType     = type;
   				this.parentFolder   = null;
					this.separatorCount = 0;
					this.userAgentCount = 0;

					// If we are importing from the options
					if(type == this.importTypeOptions)
					{
						this.importDocument = document;
					
						// If the overwrite preference is set
						if(this.importDocument.getElementById("useragentswitcher-import-overwrite").checked)
						{
							UserAgentSwitcherDOM.removeAllChildElements(this.importDocument.getElementById("useragentswitcher-options-user-agents"));	
						}
						else
						{
							var existingCounts = this.getExistingCounts();
						
							this.folderCount    = existingCounts.folderCount;
							this.separatorCount = existingCounts.separatorCount;
							this.userAgentCount = existingCounts.userAgentCount;
						}
					}
					else
					{
						this.setImportDocument(ignoreParentWindow);
						this.removeUserAgents();	
					}
	
					this.importFile(xmlDocument.documentElement);
					
					// If nothing was imported
					if(this.separatorCount == 0 && this.folderCount == 0 && this.userAgentCount == 0)
					{
						return UserAgentSwitcherStringBundle.getFormattedString("importParserError", [file.path]);
					}
				}
			}
			else
			{
				return UserAgentSwitcherStringBundle.getFormattedString("importFileFailed", [file.path]);
			}
		}
		catch(exception)
		{
			UserAgentSwitcherLog.log("UserAgentSwitcherImporter.import", exception);
		}

		return null;
	},
	
	// Imports the user agents
	importFile: function(rootNode)
	{
		var element        = null;
		var elements       = this.evaluateXPath("*", rootNode);
		var elementsLength = elements.length;

		// Loop through the user agents
		for(var i = 0; i < elementsLength; i++)
		{
			element = elements[i];

			// If this is a user agent
			if(element.nodeName == "useragent")
			{
				this.userAgentCount++;

				this.importUserAgent(element);				
			}
			else if(element.nodeName == "folder")
			{
				this.folderCount++;				

				this.importFolder(element);				
			}
			else if(element.nodeName == "separator")
			{
				this.separatorCount++;

				this.importSeparator();				
			}
		}
	},
	
	// Imports a folder
	importFolder: function(folderElement)
	{
		// If this is a menu import type
		if(this.importType == this.importTypeMenu)
		{
			var menu                        = this.importDocument.createElement("menu");
			var previousMenuParentFolder    = this.menuParentFolder;
			var previousToolbarParentFolder = this.toolbarParentFolder;
	
			// If the folder element has a description attribute
			if(folderElement.hasAttribute("description"))
			{
				menu.setAttribute("label", folderElement.getAttribute("description"));
			}
	
			menu.appendChild(this.importDocument.createElement("menupopup"));
			
			this.menuParentFolder    = this.addMenuFolder(menu, "menu", this.menuParentFolder);	
			this.toolbarParentFolder = this.addMenuFolder(menu, "toolbar", this.toolbarParentFolder);	
				
			this.importFile(folderElement);
			
			this.menuParentFolder    = previousMenuParentFolder;	
			this.toolbarParentFolder = previousToolbarParentFolder;	
		}
		else if(this.importType == this.importTypeOptions)
		{
			var previousParentFolder = this.optionsParentFolder;
			var treeCell             = this.importDocument.createElement("treecell");
			var treeChildren         = this.importDocument.createElement("treechildren");
			var treeItem             = this.importDocument.createElement("treeitem");
			var treeRow              = this.importDocument.createElement("treerow");
	
			// If the folder element has a description attribute
			if(folderElement.hasAttribute("description"))
			{
				treeCell.setAttribute("label", folderElement.getAttribute("description"));
			}

			treeChildren.setAttribute("id", "useragentswitcher-options-folder-" + this.folderCount);
			treeItem.setAttribute("container", true);
			treeRow.appendChild(treeCell);
			treeItem.appendChild(treeRow);
			treeItem.appendChild(treeChildren);
			
			this.addOptionsFolder(treeItem);	
			
			this.optionsParentFolder = treeChildren;
				
			this.importFile(folderElement);
			
			this.optionsParentFolder = previousParentFolder
		}
	},
	
	// Imports a separator
	importSeparator: function()
	{
		// If this is a menu import type
		if(this.importType == this.importTypeMenu)
		{
			var menuSeparator = this.importDocument.createElement("menuseparator");
	
			this.addMenuSeparator(menuSeparator, "menu", this.menuParentFolder);	
			this.addMenuSeparator(menuSeparator, "toolbar", this.toolbarParentFolder);	
		}
		else if(this.importType == this.importTypeOptions)
		{
			this.addOptionsSeparator(this.importDocument.createElement("treeseparator"));	
		}
	},
	
	// Imports a user agent
	importUserAgent: function(userAgentElement)
	{
		// If the user agent element has a description attribute
		if(userAgentElement.hasAttribute("description"))
		{
			// If this is a menu import type
			if(this.importType == this.importTypeMenu)
			{
				var menuItem = this.importDocument.createElement("menuitem");
	
				this.populateUserAgent(menuItem, userAgentElement);
	
				menuItem.setAttribute("oncommand", "UserAgentSwitcher.switchUserAgent(this)");
				menuItem.setAttribute("type", "radio");
				menuItem.setAttribute("useragentswitcherposition", this.userAgentCount);
		
				this.addMenuUserAgent(menuItem, "menu", this.menuParentFolder);	
				this.addMenuUserAgent(menuItem, "toolbar", this.toolbarParentFolder);	
			}
			else if(this.importType == this.importTypeOptions)
			{
				var treeCell = this.importDocument.createElement("treecell");
				var treeItem = this.importDocument.createElement("treeitem");
				var treeRow  = this.importDocument.createElement("treerow");
	
				this.populateUserAgent(treeCell, userAgentElement);
	
				treeRow.appendChild(treeCell);
				treeItem.appendChild(treeRow);

				this.addOptionsUserAgent(treeItem);	
			}
		}
	},
	
	// Populates a user agent
	populateUserAgent: function(userAgent, userAgentElement)
	{
		userAgent.setAttribute("label", userAgentElement.getAttribute("description"));

		// If the user agent element has an app code name attribute
		if(userAgentElement.hasAttribute("appcodename"))
		{
			userAgent.setAttribute("useragentswitcherappcodename", userAgentElement.getAttribute("appcodename"));
		}
		else
		{
			userAgent.setAttribute("useragentswitcherappcodename", "");
		}

		// If the user agent element has an app name attribute
		if(userAgentElement.hasAttribute("appname"))
		{
			userAgent.setAttribute("useragentswitcherappname", userAgentElement.getAttribute("appname"));
		}
		else
		{
			userAgent.setAttribute("useragentswitcherappname", "");
		}

		// If the user agent element has an app version attribute
		if(userAgentElement.hasAttribute("appversion"))
		{
			userAgent.setAttribute("useragentswitcherappversion", userAgentElement.getAttribute("appversion"));
		}
		else
		{
			userAgent.setAttribute("useragentswitcherappversion", "");
		}

		// If the user agent element has a platform attribute
		if(userAgentElement.hasAttribute("platform"))
		{
			userAgent.setAttribute("useragentswitcherplatform", userAgentElement.getAttribute("platform"));
		}
		else
		{
			userAgent.setAttribute("useragentswitcherplatform", "");
		}

		// If the user agent element has a useragent attribute
		if(userAgentElement.hasAttribute("useragent"))
		{
			userAgent.setAttribute("useragentswitcheruseragent", userAgentElement.getAttribute("useragent"));
		}
		else
		{
			userAgent.setAttribute("useragentswitcheruseragent", "");
		}

		// If the user agent element has a vendor attribute
		if(userAgentElement.hasAttribute("vendor"))
		{
			userAgent.setAttribute("useragentswitchervendor", userAgentElement.getAttribute("vendor"));
		}
		else
		{
			userAgent.setAttribute("useragentswitchervendor", "");
		}

		// If the user agent element has a vendor sub attribute
		if(userAgentElement.hasAttribute("vendorsub"))
		{
			userAgent.setAttribute("useragentswitchervendorsub", userAgentElement.getAttribute("vendorsub"));
		}
		else
		{
			userAgent.setAttribute("useragentswitchervendorsub", "");
		}
	},
	
	// Removes the user agents from the menu
	removeMenuUserAgents: function(suffix)
	{
		var optionsSeparator = this.importDocument.getElementById("useragentswitcher-separator-1-" + suffix);

		// If the options separator exists
		if(optionsSeparator)
		{		
			// Remove the next sibling to the top separator if it exists and is not the bottom separator
			while(optionsSeparator.nextSibling && optionsSeparator.nextSibling.getAttribute("id") != "useragentswitcher-separator-2-" + suffix)
			{
				UserAgentSwitcherDOM.removeElement(optionsSeparator.nextSibling);
			}
		}
	},
	
	// Removes the user agents
	removeUserAgents: function()
	{
		this.removeMenuUserAgents("menu");
		this.removeMenuUserAgents("toolbar");
	},
	
	// Resets the user agent file
	reset: function()
	{
		var outputStream  = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
		var request       = new XMLHttpRequest();
		var userAgentFile = Components.classes["@mozilla.org/file/local;1"].createInstance(Components.interfaces.nsILocalFile);

		userAgentFile.initWithPath(this.getUserAgentFileLocation().path);

		request.open("get", "chrome://useragentswitcher/content/xml/useragents.xml", false);
		request.send(null);

		outputStream.init(userAgentFile, 0x04 | 0x08 | 0x20, 00644, null);
		outputStream.write(request.responseText, request.responseText.length);
		outputStream.close();	
	},

	// Sets the import document
	setImportDocument: function(ignoreParentWindow)
	{
		this.importDocument = document;
	
		// If not ignoring the parent window and there is a parent window
		if(!ignoreParentWindow && window.opener)
		{
			// If there is a grand parent window and it has the extension menu
			if(window.opener.opener && window.opener.opener.document.getElementById("useragentswitcher-menu"))
			{
				this.importDocument = window.opener.opener.document;
			}
			else
			{
				this.importDocument = window.opener.document;
			}
		}
	}
};
