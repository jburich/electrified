let mockData = {};

export const writeFileMock = jest.fn((d, c, e, cb) => cb());

export default {
  clearMockData: () => {
    mockData = {};
  },
  setMockFile: (filename, contents) =>
    (mockData[filename] =
      typeof contents === 'string' ? contents : JSON.stringify(contents)),
  writeFile: writeFileMock,
  readFileSync: file =>
    mockData[file] ||
    (file.matches(/.*\.json/) ? { contents_of: file } : `contents of ${file}`)
};
