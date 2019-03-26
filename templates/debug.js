import debug from 'electron-debug';
import devtron from 'devtron';

app.on('ready', () => devtron.install() && debug());
