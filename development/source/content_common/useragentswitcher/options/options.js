// User Agent Switcher options
var UserAgentSwitcherOptions =
{
	appCodeName: null,
	appName:     null,
	appVersion:  null,
	clipboard:   [],
	description: null,
	folder:      null,
	platform:    null,
	userAgent:   null,
	vendor:      null,
	vendorSub:   null,
	
	// Adds a tree item to the selection
	addTreeItemToSelection: function(treeItem)
	{
		var endIndex   = {};
		var startIndex = {};
		var treeView   = document.getElementById("useragentswitcher-options-tree").view;
		var selections = treeView.selection.getRangeCount();
		var selectedItem = null;
				
		// If there are no selections
		if(selections == 0)
		{
			document.getElementById("useragentswitcher-options-user-agents").appendChild(treeItem);
		}
		else
		{
			// If there is one selection
			if(selections == 1)
			{
				treeView.selection.getRangeAt(0, startIndex, endIndex);
			}
			else
			{
				treeView.selection.getRangeAt(selections - 1, startIndex, endIndex);
			}
				
			selectedItem = treeView.getItemAtIndex(endIndex.value);

			// If the selected item is set
			if(selectedItem)
			{
				// If the selected item is a folder
				if(selectedItem.hasAttribute("container"))
				{
					selectedItem.firstChild.nextSibling.appendChild(treeItem);
				}
				else
				{
					selectedItem.parentNode.insertBefore(treeItem, selectedItem);
				}
			}
		}
	},
	
	// Copies user agents
	copy: function()
	{
		var endIndex   = {};
		var startIndex = {};
		var treeView   = document.getElementById("useragentswitcher-options-tree").view;
		var selections = treeView.selection.getRangeCount();
		
		this.clipboard = [];

		// If there is 1 selection
		if(selections == 1)
		{		
			treeView.selection.getRangeAt(0, startIndex, endIndex);
			
			// If more than one item is selected
			if(endIndex.value - startIndex.value > 0)
			{
				this.copySelections(treeView, startIndex, endIndex);
			}
			else
			{
				var selectedItem = treeView.getItemAtIndex(startIndex.value);
			
				// If an item is selected
				if(selectedItem)
				{
					this.clipboard.push(selectedItem.cloneNode(true));
				}
			}	
		}
		else
		{
			// Loop through the selections
			for(var i = 0; i < selections; i++)
			{
				treeView.selection.getRangeAt(i, startIndex, endIndex);

				this.copySelections(treeView, startIndex, endIndex);
			}
		}
	},
	
	// Copies selections
	copySelections: function(treeView, startIndex, endIndex)
	{
		var endValue   = endIndex.value;
		var startValue = startIndex.value;
		
		// Loop through the items in reverse order to delete without changing the index
		for(var index = startValue; index <= endValue; index++)
		{
			this.clipboard.push(treeView.getItemAtIndex(index).cloneNode(true));
		}
	},
	
	// Cuts user agents
	cut: function()
	{
		var endIndex   = {};
		var startIndex = {};
		var treeView   = document.getElementById("useragentswitcher-options-tree").view;
		var selections = treeView.selection.getRangeCount();
		
		this.copy();

		// If there is 1 selection
		if(selections == 1)
		{		
			treeView.selection.getRangeAt(0, startIndex, endIndex);
			
			// If more than one item is selected
			if(endIndex.value - startIndex.value > 0)
			{
				this.deleteSelections(treeView, startIndex, endIndex);
			}
			else
			{
				var selectedItem = treeView.getItemAtIndex(startIndex.value);
			
				// If an item is selected
				if(selectedItem)
				{
					UserAgentSwitcherDOM.removeElement(selectedItem);
				}
			}	
		}
		else
		{
			// Loop through the selections in reverse order to delete without changing the index
			for(var i = selections - 1; i >= 0; i--)
			{
				treeView.selection.getRangeAt(i, startIndex, endIndex);

				this.deleteSelections(treeView, startIndex, endIndex);
			}
		}
	},
	
	// Deletes user agents
	deleteUserAgents: function()
	{
		var endIndex   = {};
		var startIndex = {};
		var treeView   = document.getElementById("useragentswitcher-options-tree").view;
		var selections = treeView.selection.getRangeCount();
		
		// If there is 1 selection
		if(selections == 1)
		{		
			treeView.selection.getRangeAt(0, startIndex, endIndex);
			
			// If more than one item is selected
			if(endIndex.value - startIndex.value > 0)
			{
				// If the multiple deletion is confirmed
				if(confirm(UserAgentSwitcherStringBundle.getString("deleteMultipleConfirmation")))
				{
					this.deleteSelections(treeView, startIndex, endIndex);
				}
			}
			else
			{
				var selectedItem = treeView.getItemAtIndex(startIndex.value);
			
				// If an item is selected and is either a separator, or a folder or user agent and the deletion is confirmed
				if(selectedItem && (this.isSeparatorSelected(selectedItem) || (selectedItem.hasAttribute("container") && confirm(UserAgentSwitcherStringBundle.getString("deleteFolderConfirmation"))) || (!selectedItem.hasAttribute("container") && confirm(UserAgentSwitcherStringBundle.getString("deleteUserAgentConfirmation")))))
				{
					UserAgentSwitcherDOM.removeElement(selectedItem);
				}		
			}	
		}
		else
		{
			// If the multiple deletion is confirmed
			if(confirm(UserAgentSwitcherStringBundle.getString("deleteMultipleConfirmation")))
			{
				// Loop through the selections in reverse order to delete without changing the index
				for(var i = selections - 1; i >= 0; i--)
				{
					treeView.selection.getRangeAt(i, startIndex, endIndex);
	
					this.deleteSelections(treeView, startIndex, endIndex);
				}
			}
		}
	},
	
	// Deletes selections
	deleteSelections: function(treeView, startIndex, endIndex)
	{
		var endValue   = endIndex.value;
		var startValue = startIndex.value;
		
		// Loop through the items in reverse order to delete without changing the index
		for(var index = endValue; index >= startValue; index--)
		{
			UserAgentSwitcherDOM.removeElement(treeView.getItemAtIndex(index));
		}
	},
	
	// Edit user agents
	edit: function()
	{
		var endIndex     = {};
		var selectedItem = null;
		var startIndex   = {};
		var treeView     = document.getElementById("useragentswitcher-options-tree").view;
		
		treeView.selection.getRangeAt(0, startIndex, endIndex);

		selectedItem = treeView.getItemAtIndex(startIndex.value);
		
		// If the selected item is set
		if(selectedItem)
		{
			// If the selected item is a folder
			if(selectedItem.hasAttribute("container"))
			{
				this.editFolder(selectedItem.firstChild.firstChild);
			}
			else
			{
				this.editUserAgent(selectedItem.firstChild.firstChild);
			}
		}
	},
	
	// Edits a folder
	editFolder: function(selectedItem)
	{
		// If an item is selected
		if(selectedItem)
		{
			window.openDialog("chrome://useragentswitcher/content/options/dialogs/folder.xul", "useragentswitcher-folder-dialog", "centerscreen,chrome,modal,resizable", "edit", selectedItem.getAttribute("label"));
	
			// If the folder is set
			if(this.folder)
			{
				selectedItem.setAttribute("label", this.folder);
			}
		}
	},
	
	// Edits a user agent
	editUserAgent: function(selectedItem)
	{
		// If an item is selected
		if(selectedItem)
		{
			window.openDialog("chrome://useragentswitcher/content/options/dialogs/useragent.xul", "useragentswitcher-user-agent-dialog", "centerscreen,chrome,modal,resizable", "edit", selectedItem.getAttribute("useragentswitcherappcodename"), selectedItem.getAttribute("useragentswitcherappname"), selectedItem.getAttribute("useragentswitcherappversion"), selectedItem.getAttribute("label"), selectedItem.getAttribute("useragentswitcherplatform"), selectedItem.getAttribute("useragentswitcheruseragent"), selectedItem.getAttribute("useragentswitchervendor"), selectedItem.getAttribute("useragentswitchervendorsub"));
	
			// If the description is set
			if(this.description)
			{
				selectedItem.setAttribute("label", this.description);
				selectedItem.setAttribute("useragentswitcherappcodename", this.appCodeName);
				selectedItem.setAttribute("useragentswitcherappname", this.appName);
				selectedItem.setAttribute("useragentswitcherappversion", this.appVersion);
				selectedItem.setAttribute("useragentswitcherplatform", this.platform);
				selectedItem.setAttribute("useragentswitcheruseragent", this.userAgent);
				selectedItem.setAttribute("useragentswitchervendor", this.vendor);
				selectedItem.setAttribute("useragentswitchervendorsub", this.vendorSub);
			}
		}
	},
	
	// Exports user agents to a file
	exportUserAgents: function()
	{
		var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
		var result     = null;
	
		filePicker.defaultExtension = "xml";
		filePicker.defaultString    = "useragentswitcher.xml";
	
		filePicker.appendFilter(UserAgentSwitcherStringBundle.getString("xmlFileDescription"), "*.xml");
		filePicker.init(window, UserAgentSwitcherStringBundle.getString("exportUserAgents"), filePicker.modeSave);
	
		result = filePicker.show();
	
		// If the user selected a file
		if(result == filePicker.returnOK || result == filePicker.returnReplace)
		{
			var errorMessage = UserAgentSwitcherExporter.export(filePicker.file);
			
			// If there is an error message
			if(errorMessage)
			{
				alert(errorMessage);
			}
		}
	},
	
	// Imports user agents from a file
	importUserAgents: function()
	{
		var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
	
		filePicker.appendFilter(UserAgentSwitcherStringBundle.getString("xmlFileDescription"), "*.xml");
		filePicker.init(window, UserAgentSwitcherStringBundle.getString("importUserAgents"), filePicker.modeOpen);
	
		// If the user selected an XML file
		if(filePicker.show() == filePicker.returnOK)
		{
			var errorMessage = UserAgentSwitcherImporter.import(UserAgentSwitcherImporter.importTypeOptions, filePicker.file, false);
			
			// If there is an error message
			if(errorMessage)
			{
				alert(errorMessage);
			}
		}
	},
	
	// Initializes the options
	initialize: function()
	{
		UserAgentSwitcherImporter.import(UserAgentSwitcherImporter.importTypeOptions, UserAgentSwitcherImporter.getUserAgentFileLocation(), false);
	
		// If the hide menu preference is set
		if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher.menu.hide"))
		{
			document.getElementById("useragentswitcher-menu-hide").checked = UserAgentSwitcherPreferences.getBooleanPreference("useragentswitcher.menu.hide", true);
		}
		else
		{
			document.getElementById("useragentswitcher-menu-hide").checked = false;
		}

		// If the import overwrite preference is set
		if(UserAgentSwitcherPreferences.isPreferenceSet("useragentswitcher.import.overwrite"))
		{
			document.getElementById("useragentswitcher-import-overwrite").checked = UserAgentSwitcherPreferences.getBooleanPreference("useragentswitcher.import.overwrite", true);
		}
		else
		{
			document.getElementById("useragentswitcher-import-overwrite").checked = false;
		}
		
		document.getElementById("useragentswitcher-options-user-agents").addEventListener("dblclick", UserAgentSwitcherOptions.treeDoubleClick, false);
	},
	
	// Returns true if a separator is selected
	isSeparatorSelected: function(selectedItem)
	{
		// If the selected item is set and is a separator
		if(selectedItem && selectedItem.nodeName == "treeseparator")
		{
			return true;
		}	
		
		return false;
	},
	
	// Moves the selected item down
	moveDown: function()
	{
		var endIndex      = {};
		var selectedItem  = null;
		var startIndex    = {};
		var treeView      = document.getElementById("useragentswitcher-options-tree").view;
		var treeSelection = treeView.selection;
		
		treeSelection.getRangeAt(0, startIndex, endIndex);

		selectedItem = treeView.getItemAtIndex(startIndex.value);
		
		// If the selected item is set
		if(selectedItem)
		{
			UserAgentSwitcherDOM.insertAfter(selectedItem, selectedItem.nextSibling);
			treeSelection.select(startIndex.value + 1);
		}
	},
	
	// Moves the selected item up
	moveUp: function()
	{
		var endIndex      = {};
		var selectedItem  = null;
		var startIndex    = {};
		var treeView      = document.getElementById("useragentswitcher-options-tree").view;
		var treeSelection = treeView.selection;
		
		treeSelection.getRangeAt(0, startIndex, endIndex);

		selectedItem = treeView.getItemAtIndex(startIndex.value);
		
		// If the selected item is set
		if(selectedItem)
		{
			selectedItem.parentNode.insertBefore(selectedItem, selectedItem.previousSibling);
			treeSelection.select(startIndex.value - 1);
		}
	},
	
	// Adds a new folder
	newFolder: function()
	{
		window.openDialog("chrome://useragentswitcher/content/options/dialogs/folder.xul", "useragentswitcher-folder-dialog", "centerscreen,chrome,modal,resizable", "new");
	
		// If the folder is set
		if(this.folder)
		{
			var userAgents   = document.getElementById("useragentswitcher-options-user-agents");
			var folderCount  = userAgents.getElementsByTagName("treechildren").length + 1;
			var treeCell     = document.createElement("treecell");
			var treeChildren = document.createElement("treechildren");
			var treeItem     = document.createElement("treeitem");
			var treeRow      = document.createElement("treerow");

			treeCell.setAttribute("label", this.folder);
			treeChildren.setAttribute("id", "useragentswitcher-options-folder-" + folderCount);
			treeItem.setAttribute("container", true);
			treeRow.appendChild(treeCell);
			treeItem.appendChild(treeRow);
			treeItem.appendChild(treeChildren);
			
			this.addTreeItemToSelection(treeItem);	
		}
	},
	
	// Adds a new separator
	newSeparator: function()
	{
		this.addTreeItemToSelection(document.createElement("treeseparator"));	
	},
	
	// Adds a new user agent
	newUserAgent: function()
	{
		window.openDialog("chrome://useragentswitcher/content/options/dialogs/useragent.xul", "useragentswitcher-user-agent-dialog", "centerscreen,chrome,modal,resizable", "new");
	
		// If the description is set
		if(this.description)
		{
			var treeCell = document.createElement("treecell");
			var treeItem = document.createElement("treeitem");
			var treeRow  = document.createElement("treerow");
	
			treeCell.setAttribute("label", this.description);
			treeRow.appendChild(treeCell);
			treeItem.appendChild(treeRow);

			treeCell.setAttribute("useragentswitcherappcodename", this.appCodeName);
			treeCell.setAttribute("useragentswitcherappname", this.appName);
			treeCell.setAttribute("useragentswitcherappversion", this.appVersion);
			treeCell.setAttribute("useragentswitcherplatform", this.platform);
			treeCell.setAttribute("useragentswitcheruseragent", this.userAgent);
			treeCell.setAttribute("useragentswitchervendor", this.vendor);
			treeCell.setAttribute("useragentswitchervendorsub", this.vendorSub);
			
			this.addTreeItemToSelection(treeItem);	
		}
	},
	
	// Opens the user agents page
	openUserAgentsPage: function()
	{
		var parentWindow = null;
	
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
			parentWindow.getBrowser().selectedTab = parentWindow.getBrowser().addTab("@user.agents.page@");
	
			window.close();
		}
	},
	
	// Pastes user agents
	paste: function()
	{
		var clipboardLength = this.clipboard.length;
		var endIndex     = {};
		var selectedItem = null;
		var startIndex   = {};
		var treeView     = document.getElementById("useragentswitcher-options-tree").view;
		var selections   = treeView.selection.getRangeCount();
		
		// If there are no selections
		if(selections == 0)
		{
			var userAgents = document.getElementById("useragentswitcher-options-user-agents");
		
			// Loop through the clipboard
			for(var i = 0; i < clipboardLength; i++)
			{
				userAgents.appendChild(this.clipboard[i]);
			}
		}
		else
		{
			treeView.selection.getRangeAt(0, startIndex, endIndex);
	
			selectedItem = treeView.getItemAtIndex(startIndex.value);
			
			// If the selected item is set
			if(selectedItem)
			{
				// If the selected item is a folder
				if(selectedItem.hasAttribute("container"))
				{
					// Loop through the clipboard
					for(var i = 0; i < clipboardLength; i++)
					{
						selectedItem.firstChild.nextSibling.appendChild(this.clipboard[i]);
					}
				}
				else
				{
					// Loop through the clipboard
					for(var i = 0; i < clipboardLength; i++)
					{
						selectedItem.parentNode.insertBefore(this.clipboard[i], selectedItem);
					}
				}
			}
		}
	},
	
	// Resets the user's options
	resetOptions: function()
	{
		var promptServiceInterface = Components.interfaces.nsIPromptService;
	
		// If the reset is confirmed
		if(Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(promptServiceInterface).confirmEx(null, UserAgentSwitcherStringBundle.getString("resetConfirmationMessage"), UserAgentSwitcherStringBundle.getString("resetConfirmation"), promptServiceInterface.BUTTON_TITLE_IS_STRING * promptServiceInterface.BUTTON_POS_0 + promptServiceInterface.BUTTON_TITLE_CANCEL * promptServiceInterface.BUTTON_POS_1, UserAgentSwitcherStringBundle.getString("reset"), null, null, null, {}) == 0)
		{
			UserAgentSwitcherPreferences.deletePreferenceBranch("useragentswitcher.");
			UserAgentSwitcherUpgrade.setVersion();
			UserAgentSwitcherDOM.removeAllChildElements(document.getElementById("useragentswitcher-options-user-agents"));	
			UserAgentSwitcherImporter.reset();
	
			this.initialize();
		}
	},
	
	// Saves the user's options
	saveOptions: function()
	{
		UserAgentSwitcherPreferences.setBooleanPreference("useragentswitcher.menu.hide", document.getElementById("useragentswitcher-menu-hide").checked);
		UserAgentSwitcherPreferences.setBooleanPreference("useragentswitcher.import.overwrite", document.getElementById("useragentswitcher-import-overwrite").checked);

		UserAgentSwitcherExporter.export(UserAgentSwitcherExporter.getUserAgentFileLocation());
		UserAgentSwitcherImporter.import(UserAgentSwitcherImporter.importTypeMenu, UserAgentSwitcherImporter.getUserAgentFileLocation(), false);
	},
	
	// Handles a user agent being selected
	selectUserAgent: function(tree)
	{
		var treeView   = tree.view;
		var selections = treeView.selection.getRangeCount();
		
		// If there are no selections
		if(selections == 0)
		{
			document.getElementById("useragentswitcher-delete-button").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-edit-button").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-down-button").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-up-button").setAttribute("disabled", true);
		}
		else if(selections == 1)
		{
			var endIndex   = {};
			var startIndex = {};
			
			treeView.selection.getRangeAt(0, startIndex, endIndex);
			
			// If more than one item is selected
			if(endIndex.value - startIndex.value > 0)
			{
				// If the delete button is disabled
				if(document.getElementById("useragentswitcher-delete-button").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-delete-button").removeAttribute("disabled");
				}		
				
				document.getElementById("useragentswitcher-edit-button").setAttribute("disabled", true);
				document.getElementById("useragentswitcher-move-down-button").setAttribute("disabled", true);
				document.getElementById("useragentswitcher-move-up-button").setAttribute("disabled", true);
			}
			else
			{
				var selectedItem = treeView.getItemAtIndex(startIndex.value);
			
				// If the delete button is disabled
				if(document.getElementById("useragentswitcher-delete-button").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-delete-button").removeAttribute("disabled");
				}		
				
				// If a separator is selected
				if(this.isSeparatorSelected(treeView.getItemAtIndex(startIndex.value)))
				{
					document.getElementById("useragentswitcher-edit-button").setAttribute("disabled", true);
				}		
				else if(document.getElementById("useragentswitcher-edit-button").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-edit-button").removeAttribute("disabled");
				}		
				
				// If the selected item is set and has a previous sibling
				if(selectedItem && selectedItem.previousSibling)
				{
					// If the move up menu is disabled
					if(document.getElementById("useragentswitcher-move-up-button").hasAttribute("disabled"))
					{
						document.getElementById("useragentswitcher-move-up-button").removeAttribute("disabled");
					}		
				}
				else
				{
					document.getElementById("useragentswitcher-move-up-button").setAttribute("disabled", true);
				}
				
				// If the selected item is set and has a next sibling
				if(selectedItem && selectedItem.nextSibling)
				{
					// If the move down menu is disabled
					if(document.getElementById("useragentswitcher-move-down-button").hasAttribute("disabled"))
					{
						document.getElementById("useragentswitcher-move-down-button").removeAttribute("disabled");
					}		
				}
				else
				{
					document.getElementById("useragentswitcher-move-down-button").setAttribute("disabled", true);
				}
			}	
		}
		else
		{
			// If the delete button is disabled
			if(document.getElementById("useragentswitcher-delete-button").hasAttribute("disabled"))
			{
				document.getElementById("useragentswitcher-delete-button").removeAttribute("disabled");
			}		
			
			document.getElementById("useragentswitcher-edit-button").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-down-button").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-up-button").setAttribute("disabled", true);
		}
	},
	
	// Handles double clicking on the tree
	treeDoubleClick: function(event)
	{
		var tree        = document.getElementById("useragentswitcher-options-tree");
		var rowPosition = tree.treeBoxObject.getRowAt(event.clientX, event.clientY);
		var treeItem    = tree.view.getItemAtIndex(rowPosition);
		
		// If the tree item is set
		if(treeItem)
		{
			// If the tree item is not a folder
			if(!treeItem.hasAttribute("container"))
			{
				UserAgentSwitcherOptions.editUserAgent(treeItem.firstChild.firstChild);
			}
		}
	},
	
	// Uninitializes the options
	uninitialize: function()
	{
		document.getElementById("useragentswitcher-options-user-agents").removeEventListener("dblclick", UserAgentSwitcherOptions.treeDoubleClick, false);
	},
	
	// Updates the context menu
	updateContextMenu: function()
	{
		var treeView   = document.getElementById("useragentswitcher-options-tree").view;
		var selections = treeView.selection.getRangeCount();

		// If the clipboard is empty
		if(this.clipboard.length == 0)
		{
			document.getElementById("useragentswitcher-paste").setAttribute("disabled", true);	
		}

		// If there are no selections
		if(selections == 0)
		{
			document.getElementById("useragentswitcher-copy").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-cut").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-delete-menu").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-edit-menu").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-up").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-down").setAttribute("disabled", true);
			
			// If the clipboard is not empty and the paste menu is disabled
			if(this.clipboard.length > 0 && document.getElementById("useragentswitcher-paste").hasAttribute("disabled"))
			{
				document.getElementById("useragentswitcher-paste").removeAttribute("disabled");
			}		
		}
		else if(selections == 1)
		{
			var endIndex   = {};
			var startIndex = {};
			
			treeView.selection.getRangeAt(0, startIndex, endIndex);
			
			// If more than one item is selected
			if(endIndex.value - startIndex.value > 0)
			{
				// If the copy menu is disabled
				if(document.getElementById("useragentswitcher-copy").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-copy").removeAttribute("disabled");
				}		
				
				// If the cut menu is disabled
				if(document.getElementById("useragentswitcher-cut").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-cut").removeAttribute("disabled");
				}		
				
				// If the delete menu is disabled
				if(document.getElementById("useragentswitcher-delete-menu").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-delete-menu").removeAttribute("disabled");
				}		
				
				document.getElementById("useragentswitcher-edit-menu").setAttribute("disabled", true);
				document.getElementById("useragentswitcher-move-up").setAttribute("disabled", true);
				document.getElementById("useragentswitcher-move-down").setAttribute("disabled", true);
				document.getElementById("useragentswitcher-paste").setAttribute("disabled", true);
			}
			else
			{
				var selectedItem = treeView.getItemAtIndex(startIndex.value);
			
				// If the copy menu is disabled
				if(document.getElementById("useragentswitcher-copy").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-copy").removeAttribute("disabled");
				}		
				
				// If the cut menu is disabled
				if(document.getElementById("useragentswitcher-cut").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-cut").removeAttribute("disabled");
				}		
				
				// If the delete menu is disabled
				if(document.getElementById("useragentswitcher-delete-menu").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-delete-menu").removeAttribute("disabled");
				}		
				
				// If a separator is selected
				if(this.isSeparatorSelected(selectedItem))
				{
					document.getElementById("useragentswitcher-edit-menu").setAttribute("disabled", true);
				}		
				else if(document.getElementById("useragentswitcher-edit-menu").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-edit-menu").removeAttribute("disabled");
				}		
			
				// If the clipboard is not empty and the paste menu is disabled
				if(this.clipboard.length > 0 && document.getElementById("useragentswitcher-paste").hasAttribute("disabled"))
				{
					document.getElementById("useragentswitcher-paste").removeAttribute("disabled");
				}		
				
				// If the selected item is set and has a previous sibling
				if(selectedItem && selectedItem.previousSibling)
				{
					// If the move up menu is disabled
					if(document.getElementById("useragentswitcher-move-up").hasAttribute("disabled"))
					{
						document.getElementById("useragentswitcher-move-up").removeAttribute("disabled");
					}		
				}
				else
				{
					document.getElementById("useragentswitcher-move-up").setAttribute("disabled", true);
				}
				
				// If the selected item is set and has a next sibling
				if(selectedItem && selectedItem.nextSibling)
				{
					// If the move down menu is disabled
					if(document.getElementById("useragentswitcher-move-down").hasAttribute("disabled"))
					{
						document.getElementById("useragentswitcher-move-down").removeAttribute("disabled");
					}		
				}
				else
				{
					document.getElementById("useragentswitcher-move-down").setAttribute("disabled", true);
				}
			}	
		}
		else
		{
			// If the copy menu is disabled
			if(document.getElementById("useragentswitcher-copy").hasAttribute("disabled"))
			{
				document.getElementById("useragentswitcher-copy").removeAttribute("disabled");
			}		
			
			// If the cut menu is disabled
			if(document.getElementById("useragentswitcher-cut").hasAttribute("disabled"))
			{
				document.getElementById("useragentswitcher-cut").removeAttribute("disabled");
			}		
			
			// If the delete menu is disabled
			if(document.getElementById("useragentswitcher-delete-menu").hasAttribute("disabled"))
			{
				document.getElementById("useragentswitcher-delete-menu").removeAttribute("disabled");
			}		
			
			document.getElementById("useragentswitcher-edit-menu").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-up").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-move-down").setAttribute("disabled", true);
			document.getElementById("useragentswitcher-paste").setAttribute("disabled", true);
		}
	}
};
