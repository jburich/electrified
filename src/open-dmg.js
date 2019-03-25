import runExec from './run-exec';

export default async function(outputDirectory, packageName) {
  return runExec(outputDirectory, `open dist/${packageName}.dmg`);
}
