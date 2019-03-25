import readline from 'readline';
import checkout from './checkout';
import createpackage from './create-package';
import modifyJs from './modify-js';
import dependencies from './dependencies';
import setIcon from './icon';
import build from './build';
import open from './open-dmg';
import openApp from './open-app';

//A readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Asynchronously get input from the user
let argsRead = 2;

async function ask(question) {
  if (argsRead < process.argv.length) {
    argsRead++;
    return Promise.resolve(process.argv[argsRead - 1]);
  } else {
    return new Promise(resolve => {
      rl.question(`${question}? `, answer => {
        resolve(answer);
      });
    });
  }
}

//This is the main runner wrapper that will allow everything to be async
index()
  .then(() => {
    rl.close();
    console.log('Success!');
  })
  .catch(e => {
    process.exitCode = 1;
    rl.close();
    console.log(`PROBLEMS!`, e);
  });

//This is the main function to run
async function index() {
  const programName = await ask('Program Name');
  const outputDirectory = `./build/${programName.toLowerCase()}`;
  const url = await ask('URL?');
  const iconPath = await ask('Icon?');

  console.log(`Building ${programName}`);

  await checkout(outputDirectory);
  await createpackage(programName, outputDirectory);
  await dependencies(outputDirectory);
  await modifyJs(outputDirectory, url);
  await setIcon(outputDirectory, iconPath);
  await build(outputDirectory);
  await open(outputDirectory, programName);
  // await openApp(outputDirectory, programName);
}
