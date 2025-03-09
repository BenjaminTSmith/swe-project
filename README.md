# Tutors4U(F)
by Oliver Jen, Yining Liu, Benjamin Smith, James Chen

## Installing
- download Node.js from the official website
- npm i
- npm install firebase
- npm install firebase-admin
- go to frontend directory
- npm start

## Development
Currently I have React and Flask communicating. React simply sends a JS Date object to Flask,
and it gets printed out to the screen whenever you press login. "Time received" also gets sent back
to the frontend and console logged. To run the app run
```bash
npm start
```
from the frontend directory, and
```bash
flask run
```
from the backend directory after having initialized the virtual environment. Let me know if you need help
with the virtual environment.