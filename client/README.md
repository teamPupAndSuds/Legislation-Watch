## Client Side Code ##

Technology Used: React, React-Router, Bootstrap

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