# AEM CQ Spell Checker Utility

The project aem spell checker has been created  using maven archetype 7 project.

## Modules

Spell checker utility consists of two modules. Spell checking in both the modules in done using Jazzy spell checker utility. It is a very common spell checking utility used in J2ee projects. It is easy to integrate it with existing projects as well. All the code is servlet based which are registered under /bin/aemfeatures/* so this path should be enabled in case you want to run this code via dispatcher. The servlets have properties to provided phonet and dictionary files. Currently, both of these files have to live under crx-quickstart/conf directory. Samples files have been checked into the core/resource directory. Adding a word is a simple as adding in the en.0 file. Below should be modified in SpellCheckerServlet if you want to put directory in a custom field.

@SlingServlet(paths="/bin/aemfeatures/spellChecker", metatype=true)
@Properties(value = {
		@Property(label="dictionary.location",name = "dictionary.location", value = "crx-quickstart/conf/en.0"),
		@Property(label="phonet.location",name = "phonet.location", value = "crx-quickstart/conf/phonet.en")})    

1) Global Spell Checker -: The global spell checker allows you to spell check the whole website in one go. You should have access to latest content package for running this module. The project only works on the publisher instance as for each page a server request is made and dom in parsed and misspelled words are found. The logic to do all the iteration is quite fast. Whole Geometrixx was parsed and spell checked in 20-30 seconds. Once the results are returned all the words with their pages references are downloaded to users computer automatically as csv. 

The spell checker was also extended to provide a raw .txt file with comma separated words which will not be returned in the csv list.  

2) Page Spell Checker -: It is a single page spell checking mechanism. Whatever misspelled words are found on the page they get highlighted in yellow much like what happens with RTE spell checking utility. All the misspelled words are found first and then Jquery highlighter plugin highlights them in yellow colour on the page.

## How to build

To build all the modules run in the project root directory the following command with Maven 3:

    mvn clean install

If you have a running AEM instance you can build and package the whole project and deploy into AEM with  

    mvn clean install -PautoInstallPackage
    
Or to deploy it to a publish instance, run

    mvn clean install -PautoInstallPackagePublish
    
Or to deploy only the bundle to the author, run

    mvn clean install -PautoInstallBundle

## Testing

Testing of the framework can be done by 


## Maven settings

The project comes with the auto-public repository configured. To setup the repository in your Maven settings, refer to:

    http://helpx.adobe.com/experience-manager/kb/SetUpTheAdobeMavenRepository.html
# cq-aem-spellchecker 

#Presentation URL

http://s000.tinyupload.com/index.php?file_id=07741188365781537109
