# tanks2
Welcome to Tanks v2.0. This is a remake of the original tanks game with a much cleaner code base and a complete rewrite of most elements.
You can play the online version [here](http://jantschulev.ddns.net:3333)

### To Install:
Requirements: node.js and npm.
1. Clone the repo to your local machine using `git clone https://github.com/kraken22/tanks2.git`
2. Run `npm install` inside the directory.
3. Make a new directory called `data` and `cd` into it.
4. do `echo "[]" > ammo.json` and `echo "[]" > scores.json` and `echo "[]" > map.json` and `echo "[]" > weapons.json` to initialise json files
5. Change to root of folder and run `node index.js` to play. 
6. Open a new browser tab and go to http://localhost:3333 to play. 
7. To play with friends over lan, get your local ip and on their computers enter http://your-ip:3333
8. To view the score board go to http://localhost:3333/scores/ 

