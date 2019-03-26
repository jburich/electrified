import fs from 'fs';

export default async function createPackage(packageName, outputDirectory) {
  console.log('Creating package.json');
  const packagePartial = fs.readFileSync('./templates/package.partial.json');

  const jsonContent = JSON.parse(packagePartial);

  jsonContent.name = packageName;
  jsonContent.build.appId = `local.${packageName}`;
  jsonContent.build.productName = packageName;
  jsonContent.build.mac.category = `local.${packageName}`;
  // console.log("Partial Content : \n" + JSON.stringify(jsonContent, null, 2));

  const webpackPackageJsonFile = fs.readFileSync(
    `${outputDirectory}/package.json`
  );
  const webpackPackageJson = JSON.parse(webpackPackageJsonFile);

  // console.log("Webpack Content : \n" + JSON.stringify(webpackPackageJson, null, 2));

  const output = {
    ...webpackPackageJson,
    ...jsonContent,
    dependencies: {
      ...webpackPackageJson.dependencies,
      ...jsonContent.dependencies
    }
  };
  // constole.log(
  //   'Final Output  : \n' + JSON.stringify(output.dependencies, null, 2)
  // );

  return new Promise((resolve, reject) =>
    fs.writeFile(
      `${outputDirectory}/package.json`,
      JSON.stringify(output, null, 2) + '\n',
      'utf8',
      err => {
        err ? reject(err) : resolve();
      }
    )
  );
}
