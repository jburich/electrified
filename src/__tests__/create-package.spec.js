jest.mock('fs');
import createPackage from '../create-package';
import fs from 'fs';

describe('build', () => {
  beforeEach(() => {
    fs.clearMockData();
  });

  it('should create the package.json file', async () => {
    fs.setMockFile('./templates/package.partial.json', {
      version: '1.0.0',
      build: {
        artifactName: '${productName}.${ext}',
        mac: {
          category: 'local'
        }
      },
      dependencies: {
        'electron-context-menu': '^0.11.0',
        devtron: '^1.4.0',
        'electron-debug': '^2.1.0'
      }
    });
    fs.setMockFile('testdir/package.json', {
      name: 'electron-webpack-quick-start',
      version: '0.0.0',
      license: 'MIT',
      scripts: {
        dev: 'electron-webpack dev',
        compile: 'electron-webpack',
        dist: 'yarn compile && electron-builder',
        'dist:dir': 'yarn dist --dir -c.compression=store -c.mac.identity=null'
      },
      dependencies: {
        'source-map-support': '^0.5.10'
      },
      devDependencies: {
        electron: '4.0.1',
        'electron-builder': '20.38.4',
        'electron-webpack': '^2.6.2',
        webpack: '4.28.4'
      }
    });

    await createPackage('testPackageName', 'testdir');

    expect(fs.writeFile).toHaveBeenCalledWith(
      'testdir/package.json',
      JSON.stringify(
        {
          name: 'testPackageName',
          version: '1.0.0',
          license: 'MIT',
          scripts: {
            dev: 'electron-webpack dev',
            compile: 'electron-webpack',
            dist: 'yarn compile && electron-builder',
            'dist:dir':
              'yarn dist --dir -c.compression=store -c.mac.identity=null'
          },
          dependencies: {
            'source-map-support': '^0.5.10',
            'electron-context-menu': '^0.11.0',
            devtron: '^1.4.0',
            'electron-debug': '^2.1.0'
          },
          devDependencies: {
            electron: '4.0.1',
            'electron-builder': '20.38.4',
            'electron-webpack': '^2.6.2',
            webpack: '4.28.4'
          },
          build: {
            artifactName: '${productName}.${ext}',
            mac: {
              category: 'local.testPackageName'
            },
            appId: 'local.testPackageName',
            productName: 'testPackageName'
          }
        },
        null,
        2
      ) + '\n',
      'utf8',
      expect.any(Function)
    );
  });
});
