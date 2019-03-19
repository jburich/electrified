import {execSync} from 'child_process';

export default async function (outputDirectory, command) {
  return new Promise((resolve, reject) => {
    try {
      execSync(`${command}`, {
        cwd: outputDirectory,
        stdio: 'inherit'
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}


