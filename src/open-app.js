import runExec from './run-exec'

export default async function (outputDirectory, packageName) {
  return runExec(outputDirectory, `dist/mac/${packageName}.app/Contents/MacOS/${packageName}`);
}
