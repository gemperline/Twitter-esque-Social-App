# Twitter-esque-Social-App

## Demo video (YouTube)
https://www.youtube.com/watch?v=ZZuG-MaDQCI

## Overview
This web application is a personal project that is currently being developed and serves as a social media web application reminiscent of Twitter or other social blogging sites. I’m using a model like Twitter’s because many of the fundamental components and functionalities are similar, however, the primary use cases of this application will be rather different than what Twitter is used for. The app’s true intentions will have to remain under wraps for now, but I’m excited to share what I’ve made public so far!

## Tools
React JS, Redux, JavaScript, jQuery, JSON, HTML5, CSS3, Bootstrap, Postman, GCF, Firebase

## The Rundown
The back-end functions and API requests are currently being built using JavaScript and jQuery. API requests are tested using Postman. The app is using Firebase for the database, storage, and authentication; hence, user authorization and other security features are mostly done with Google Cloud Functions.

The front-end is being developed with React JS, Redux, HTML, CSS, and Bootstrap. The UI is sleek and includes working user login and registration pages with form error checking. The home page includes community posts and comments that are retrieved from the database. If a user is logged in, the home page will also display their profile card which contains their picture and basic information on the right side of the page. ‘Like’ buttons have been implemented to posts and are functional. The commenting feature’s functions have been written and are being implemented in the UI soon. Likes and comments on a user’s post each send the user a notification, which is working on the back end, but needs to be implemented in the UI. If a user’s makes any changes to their profile information via the edit modal, the database is updated in real-time and the profile card refreshes with the new information visible. 

Thanks for reading!


