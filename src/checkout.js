import {Clone} from 'nodegit'
import rm from 'rimraf'

export default async function (directoryName) {
  console.log(`Cloning into ${directoryName}`)
  rm.sync(`${directoryName}`);
  return Clone("https://github.com/electron-userland/electron-webpack-quick-start.git", directoryName).then(()=>{
    rm.sync(`${directoryName}/.git`);
    rm.sync(`${directoryName}/.gitignore`);
  });
}


