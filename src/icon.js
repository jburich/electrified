import download from 'image-downloader';
import runExec from './run-exec';

export default async function modifyJs(outputDirectory, urlToLoad) {
  console.log('Setting Icon');
  await runExec(outputDirectory, `mkdir build`);
  if (urlToLoad.indexOf('http') === 0) {
    return download.image({
      url: urlToLoad,
      dest: `${outputDirectory}/build/icon.png`
    });
  } else {
    return Promise.resolve(
      runExec(`${outputDirectory}/build`, `cp ${urlToLoad} icon.png`)
    );
  }
}
