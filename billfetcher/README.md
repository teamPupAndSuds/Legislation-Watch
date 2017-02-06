## BILLFETCHER

The files in this folder are responsible for initializing and updating the application's database of recent Congressional bills.

The reason for maintaining a database is to fulfill the application's mission of providing the most up-to-date information and notifications to users regarding active legislation. Specifically, while the Sunlight Foundation API provides the basis for our application, it has some shortcomings with regard to timeliness: 
1. When new bills are made available on the API, they often do not have any keywords associated with them. It takes the Library of Congress some time to add topic keywords to bills, and hence for the keywords to be made available in the API. This means it is hard to identify what bills will be of interest to a particular user.
2. When new bills are added to the database, the full text of the bill is not always available immediately. 

In order to provide the most timely notifications to users about new bills that might interest them, our application periodically polls the API for new bills and adds them to our database. It then uses a natural language processing API (the [Twinword Topic Tagging API](https://www.twinword.com/api/topic-tagging.php)) to generate keywords based on the new bills' [full text](https://www.gpo.gov/fdsys/pkg/BILLS-115hres72ih/html/BILLS-115hres72ih.htm) (if available) or title (always available). These keywords are stored in the database entry for each bill. The keywords are used to power the application's notification capabilities as well as its dashboard view, where the application shows recent bills related to a user's monitored topics of interest. 

The file structure of this folder is as follows:

```
├── README.md
├── billfetcher.js
├── billsAPIHelpers.js
├── config.js
├── keywordfetcher.js
└── logHelpers.js
```

billfetcher.js: This is the primary file in this directory. When run, it will do the following:
1. If the database is empty, initialize the database by pulling in all the bills from the current Congress via the Sunlight Foundation API.
2. If the database is not empty, update the database with any bills introduced since the last time billfetcher was run.
3. Enrich any newly introduced bills with keyword metadata derived from a natural language processing API.

Before running the billfetcher, ensure that an instance of MongoDB is running. The billfetcher can be run on an ad hoc basis by running 'node billfetcher/billfetcher.js' from the root directory of this application. However, it is intended to be run periodically via cron job. It is recommended that the billfetcher be run at least daily to capture new bills in a timely fashion.

billsAPIHelpers.js: This file is required by billfetcher.js. It contains functions for calling the Sunlight Foundation API and initializing or updating the database with the API results.

keywordfetcher.js: This file is required by billfetcher.js. It contains functions for calling the Twinword topic tagging API and adding keyword metadata to bills in our database. __Note:__ Part of the process of generating keywords is running the full text of the bill through the Twinword API. To get the full text, we are scraping the [Government Publishing Office's website](https://www.gpo.gov/). It appears that if a sufficient number of GET requests are made to this site, it will start refusing connections. This can lead to ECONNRESET errors when running a large batch of bills (check logfile.txt after running billfetcher.js to see the log of any errors). If this occurs, some potential solutions might be to: 
1. run billfetcher.js once and wait a while before running it again (it will only try to generate keywords for bills that have not already had keywords assigned)
2. run billfetcher.js from a different IP address
3. refactor keywordfetcher.js to only have a maximum number of GET requests out at any one time   

logHelpers.js: Helper functions related to logging. Because the billfetcher is intended to be run via cron job, the only way to know if errors are occurring is to log activity to a text file (logfile.txt).

config.js: Configuration entries such as API URLs.