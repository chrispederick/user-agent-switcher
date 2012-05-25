// User Agent Switcher array
var UserAgentSwitcherArray =
{
	// Converts a collection to an array
	convertCollectionToArray: function(collection)
	{
		var array            = [];
		var collectionLength = collection.length;
	
		// Loop through the collection
		for(var i = 0; i < collectionLength; i++)
		{
			array.push(collection.item(i));
		}
		
		return array;
	},

	// Converts an enumeration to an array
	convertEnumerationToArray: function(enumeration)
	{
		var array = [];

		// Loop through the enumeration
		while(enumeration.hasMoreElements())
		{
			array.push(enumeration.getNext());
		}
		
		return array;
	}
};
