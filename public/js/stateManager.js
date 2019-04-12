var stateManager;


function StateManager() {
  this.states = ['free', 'waiting', 'ingame']
  this.state = 'free';
  this.savedTankCoins = 0;
  this.wins = {
    'gold' : 0,
    'gold' : 0,
    'gold' : 0,
    'gold' : 0,
  }
}

StateManager.prototype.update = function () {
  if(this.state == 'free'){
    this.savedTankCoins = tank.coins;
  }
}

StateManager.prototype.initiateRound = function () {
  this.state = 'waiting';
  tank.coins = 3000;
  clearAllBridges();
  resetAllFlags();
  removeAllGunners();
  removeAllHealthBeacons();

};

StateManager.prototype.startRound = function () {
  this.state = 'ingame';
};
