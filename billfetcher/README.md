BILLFETCHER

The files in this folder are responsible for initializing and updating the application's database of recent Congressional bills.

The reason for maintaining a database is to fulfill the application's mission of providing the most up-to-date information and notifications to users regarding active legislation. Specifically, while the Sunlight Foundation API provides the basis for our application, it has some shortcomings with regard to timeliness: 
    1) When new bills are made available on the API, they often do not have any keywords associated with them. It takes the Library of Congress some time to add topic keywords to bills, and hence for the keywords to be made available in the API. This means it is hard to identify what bills will be of interest to a particular user.
    2) When new bills are added to the database, the full text of the bill is not always available immediately. 

In order to provide the most timely notifications to users about new bills that might interest them, our application periodically polls the API for new bills and adds them to our database. It then uses a natural language processing API (the Twinword Topic Tagging API) to generate keywords based on the new bills' full text (if available) or title (always available). These keywords are stored in the database entry for each bill. The keywords are used to power the application's notification capabilities as well as its topic view, where the application shows recent bills related to a user's monitored topics of interest. 

The file structure of this folder is as follows:

billfetcher.js: This is the primary file in this directory. When run, it will do the following:
1) If the database is empty, initialize the database by pulling in all the bills from the current Congress.
2) If the database is not empty, update the database with any bills introduced since the last time billfetcher was run.
3) Enrich any newly introduced bills with keyword metadata derived from a natural language processing API.

Before running the billfetcher, ensure that an instance of MongoDB is running. The billfetcher can be run on an ad hoc basis by running 'node billfetcher/billfetcher.js' from the root directory of this application. However, it is intended to be run periodically via cron job. It is recommended that the billfetcher be run at least daily to capture new bills in a timely fashion.

billsAPIHelpers.js: This file is required by billfetcher.js. It contains functions for calling the Sunlight Foundation API and initializing or updating the database with the API results.

keywordfetcher.js: This file is required by billfetcher.js. It contains functions for calling the Twinword topic tagging API and adding keyword metadata to bills in our database.

logHelpers.js: Helper functions related to logging. Because the billfetcher is intended to be run via cron job, the only way to know if errors are occurring is to log activity to a text file.

config.js: Configuration entries such as API URLs.