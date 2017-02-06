# Client Side Code ##

Technology Used: React, React-Router, Bootstrap

### Design Philosophy

The user interface is divided into two categories of views. The first category is the main "dashboard" view, which implement the main functionality of the application. The second category of views are the ancillary views, which supports the logistics of guiding the user to the "dashboard" view. 

##### Note:
Most components are separated into their 'presentational' and 'container' components to facilitate potential future refactoring to use the Redux framework for state management. 
#### Dashboard View
The 'dashboard' view is the main view that presents the user with legislation information that matches their monitored keywords. This view is implemented with the ```App``` parent component inside ```index.jsx```. 

The ```App``` component is a parent to the ```NavigationBar, UserLegislatorInfo UserDashBoard, LegislationSearch``` subcomponents.

In order to reduce re-render (and subsequent AJAX calls to Sunlight Foundation API) of the ```UserDashBoard``` component , the ```LegislationSearch``` and ```UserDashBoard``` components are rendered concurrently, but is hidden depending on the "active" view (supplied via the React routes definition).

#### Ancillary Views
The ancillary views are views that guides the user to the main "dashboard" view. They consists of top level routes that renders ```About, UserLogin, UserLogout, UserSignup``` top level components. 

The ```About``` component is the "landing page" of the site.

The ```Logout``` component will automatically attemp to sign the user out on mount, and reidirect the user to ```About``` thereafter. 

### Description of File Structure under '/client/:
```
.
├── README.md           <-- current README file
├── css         
│   └── about.css   <-- CSS style file applied ONLY to About.jsx component
├── dist
│   └── bundle.js   <-- Webpack transpile and bundled JS & JSX code
├── images
│   ├── banner.jpg      <-- 'About.jsx' landing page front 'scene' background
│   ├── pic01.jpg       <-- 'About.jsx' landing page information 'scene' image
├── index.html
├── index.jsx           <-- App entry point
├── src
│   ├── components    <-- React Components Folder
│   │   ├── About.jsx       <-- Top Level 'landing page'
│   │   ├── BillResultSummary.jsx <-- Component to display summary for one Bill
│   │   ├── LegislationSearch.jsx   <-- Second Level 'Search' function for Dashboard
│   │   ├── LegislatorInfo.jsx    <-- Component to display one legislator's info
│   │   ├── NavigationBar.jsx   <-- Top of page Navigation Bar
│   │   ├── SearchBar.jsx     <-- Searchbar for "LegislationSearch"
│   │   ├── SearchResults.jsx   <-- Result Display for "LegislationSearch"
│   │   ├── UserDashBoard.jsx     <-- Second Level 'Dashboard' display
│   │   ├── UserDashBoardKeywordsEntryBar.jsx  <-- Keywordbar for "UserDashBoard"
│   │   ├── UserDashBoardMonitoredWordResult.jsx <-- Keyword Results for "UserDashBoard"
│   │   ├── UserLegislatorsInfo.jsx   <-- User Representative Sidebar
│   │   ├── UserLogin.jsx       <-- Top Level 'Login page'
│   │   ├── UserLogout.jsx        <-- Top Level 'Logout page'
│   │   └── UserSignup.jsx        <-- Top Level 'Singup page'
│   └── data
│       └── LegislatorData.js   <-- Bioguide_ID + Name & Party Info JSON file
└── style.css           <-- CSS style for all pages other than About.jsx
```