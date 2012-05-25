// User Agent Switcher DOM
var UserAgentSwitcherDOM =
{
	// Returns all elements under a given node that match the given XPath
	findElementsByXPath: function(node, xPath)
	{
    var namespaceResolver = null;
    var namespaceURI      = UserAgentSwitcherDOM.getNamespaceURI(node);
    var result            = null;
    var resultList        = new Array();
    var results           = null;
    
    // If the node has a namespace URI
    if(namespaceURI)
    {
      namespaceResolver = new UserAgentSwitcherNamespaceResolver(namespaceURI);
      xPath             = xPath.replace(/\/\//gi, "//useragentswitcher:");
    }
    
    results = new XPathEvaluator().evaluate(xPath, node, namespaceResolver, XPathResult.ANY_TYPE, null);

    // Loop through the results
    while((result = results.iterateNext()) != null)
    {
      resultList.push(result);
    }

    return resultList;
	},

	// Returns all the windows
	getAllWindows: function()
	{
		var allWindows     = [];
		var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		
		allWindows = allWindows.concat(UserAgentSwitcherArray.convertEnumerationToArray(windowMediator.getEnumerator("navigator:browser")));
		allWindows = allWindows.concat(UserAgentSwitcherArray.convertEnumerationToArray(windowMediator.getEnumerator("Songbird:Main")));

		return allWindows;	
	},

	// Returns the namespace URI for a node 
	getNamespaceURI: function(node)
	{
	    // If the node has an owner document
	    if(node.ownerDocument)
	    {
	        return node.ownerDocument.documentElement.namespaceURI;
	    }
	
	    return node.documentElement.namespaceURI;
	},
	
	// Returns the content document from a page load event
	getPageLoadEventContentDocument: function(event)
	{
		// Try to get the event targets
		try
		{
			var eventTarget    = event.target;
			var originalTarget = event.originalTarget;
		
			// If the event targets are set and the original target is the document or the event target is the browser
			if(eventTarget && originalTarget && (originalTarget.nodeName == "#document" || eventTarget == window.getBrowser()))
			{
				var contentDocument = eventTarget.contentDocument;
	
				// If the content document is not set and the original target default view parent is set
				if(!contentDocument && originalTarget.defaultView && originalTarget.defaultView.parent)
				{
					contentDocument = originalTarget.defaultView.parent.document;
				}
	
				// If the content document is set and has the same URI as the original target
				if(contentDocument && contentDocument.documentURI == originalTarget.documentURI)
				{
					return contentDocument;
				}
			}
		}
		catch(exception)
		{
			// Do nothing
		}
		
		return null;
	},

	// Inserts the given child after the element
	insertAfter: function(child, after)
	{
		// If the child and after are set
		if(child && after)
		{
			var nextSibling = after.nextSibling;
			var parent      = after.parentNode;
	
			// If the element has a next sibling
			if(nextSibling)
			{
				parent.insertBefore(child, nextSibling);
			}
			else
			{
				parent.appendChild(child);
			}
		}
	},

	// Removes all child elements from an element
	removeAllChildElements: function(element)
	{
		// If the element is set
		if(element)
		{
			var childElements = element.childNodes;
	
			// Loop through the child elements
			for(var i = 0; i < childElements.length; i++)
			{
				element.removeChild(childElements[i]);
			}
	
			childElements = element.childNodes;
	
			// Loop through the child elements
			while(childElements.length > 0)
			{
				element.removeChild(childElements[0]);
			}
		}
	},

	// Removes an element
	removeElement: function(element)
	{
		// If the element and it's parent node are set
		if(element && element.parentNode)
		{
			element.parentNode.removeChild(element);
		}
	}
};

// Constructs a namespace resolver object
function UserAgentSwitcherNamespaceResolver(namespaceURI)
{
  this.namespaceURI = namespaceURI;
}

// Looks up the namespace URI
UserAgentSwitcherNamespaceResolver.prototype.lookupNamespaceURI = function(prefix)
{
  return this.namespaceURI;
}
