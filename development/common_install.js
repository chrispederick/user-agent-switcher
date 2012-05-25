var author              = "Chris Pederick";
var contentFlag         = CONTENT | PROFILE_CHROME;
var displayName         = "@name@";
var error               = null;
var folder              = getFolder("Current User", "chrome");
var localeFlag          = LOCALE | PROFILE_CHROME;
var name                = "useragentswitcher";
var jarName             = name + ".jar";
var existsInApplication = File.exists(getFolder(getFolder("chrome"), jarName));
var existsInProfile     = File.exists(getFolder(folder, jarName));
var skinFlag            = SKIN | PROFILE_CHROME;
var version             = "@version@";

// If the extension exists in the application folder or it doesn't exist in the profile folder and the user doesn't want it installed to the profile folder
if(existsInApplication || (!existsInProfile && !confirm("Do you want to install the " + displayName + " extension into your profile folder?\n(Cancel will install into the application folder)")))
{
  contentFlag = CONTENT | DELAYED_CHROME;
  folder      = getFolder("chrome");
  localeFlag  = LOCALE | DELAYED_CHROME;
  skinFlag    = SKIN | DELAYED_CHROME;
}

initInstall(displayName, name, version);
setPackageFolder(folder);
error = addFile(name, version, "chrome/" + jarName, folder, null);

// If adding the JAR file succeeded
if(error == SUCCESS)
{
  folder = getFolder(folder, jarName);

  registerChrome(contentFlag, folder, "content/" + name + "/");
  registerChrome(localeFlag, folder, "locale/en-US/" + name + "/");
  registerChrome(skinFlag, folder, "skin/classic/" + name + "/");

  error = performInstall();

  // If the install failed
  if(error != SUCCESS && error != 999 && error != -239)
  {
    displayError(error);
  	cancelInstall(error);
  }
  else
  {
      alert("The installation of the " + displayName + " extension succeeded.");
  }
}
else
{
  displayError(error);
	cancelInstall(error);
}

// Displays the error message to the user
function displayError(error)
{
  // If the error code was -215
  if(error == -215)
  {
    alert("The installation of the " + displayName + " extension failed.\nOne of the files being overwritten is read-only.");
  }
  else if(error == -235)
  {
    alert("The installation of the " + displayName + " extension failed.\nThere is insufficient disk space.");
  }
  else
  {
    alert("The installation of the " + displayName + " extension failed.\nThe error code is: " + error);
  }
}