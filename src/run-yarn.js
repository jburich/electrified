import runExec from './run-exec'

export default async function (outputDirectory, command) {
  return runExec(outputDirectory, `yarn ${command || ''}`);
}


