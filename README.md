# <a href="godzone.herokuapp.com">Godly Zone For Gods</a>

<h3>The penultimate project at SPICED is a social network SPA primarily using React, Redux, and socket.io technologies.</h3>

<div align ="center">
<img src="https://s3.amazonaws.com/fluxlymoppings/pics/GodlyZone.PNG" width=700>
</div>

 My completed project features registration and login using bcrypt for password encryption, allows users to update profile picture and biography, see who else is logged in, make and accept or reject friend requests, and make use of a real-time chatroom which keeps live track of who is actively chatting.

As this product was meant to develop our familiarity with both React and Redux, I did my best to make as effective usage of these tools advantages as I could. I have componentized every part of the app for React (reusing where I could), and did my best to construct a Redux reducer that is as readable as possible. React Router manages most of the routing on the page, ensuring a stable user experience.

<div align ="center">
<img src="https://s3.amazonaws.com/fluxlymoppings/pics/GodlyZone3.PNG" width=700>
</div>

A small bug seems to plague the chat room page (available <a href="https://godzone.herokuapp.com/chat">here</a> once the user is logged in) that sometimes requires a reload when first arriving at the page to resolve. Redux keeps track of the list of both online users and in-chat users on the client-side (receiving updates from the server via socket.io whenever the list of users changes), and the relevant components use this state information to determine what to display. 

<div align ="center">
<img src="https://s3.amazonaws.com/fluxlymoppings/pics/GodlyZone2.PNG" width=700>
</div>

That the “Godly Zone For Gods” is hideously ugly and features nigh-nonsensical language (including some mixing of different tongues) is deliberate, and meant to be humorous. I have no idea why anyone would want to get into the social network business as a solo developer, but this project is at least unique in its exaggeratedly cynical attitude. It was a minor hit in school, as several of my classmates found joy chatting on something a little less hip and zeitgeisty than Slack. Please enjoy it on <a href="https://godzone.herokuapp.com/">Heroku</a>. PM me on LinkedIn or whatever if you want a live demonstration of its <a href="https://godzone.herokuapp.com/chat">chat room</a>.

# Technologies

<ul>
  <li> React </li>
  <li> Redux </li>
  <li> Redux DevTools </li>
  <li> socket.io </li>
  <li> SASS (minor implementation, obviously) </li>
  <li> Node.js </li>
  <li> Express.js </li>
  <li> PostGreSQL </li>
  <li> Heroku </li>
</ul>
