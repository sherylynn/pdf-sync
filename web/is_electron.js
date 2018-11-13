window.isElectron = () => {
  return typeof process === 'object' && process + '' === '[object process]' && process.versions.electron;
};
if (window.isElectron()) {
  let {
    remote,
  } = require('electron');
  window.remote=remote
  let {
    Menu,
    MenuItem,
  } = remote;
  window.Menu = Menu
  window.MenuItem = MenuItem
}
