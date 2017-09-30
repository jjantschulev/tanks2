function useBoost () {
  if (tank.weaponManager.blastAmount > 0) {
    tank.speedMultiplyer = 2;
    tank.weaponManager.blastAmount--;
  }
}
