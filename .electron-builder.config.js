/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  artifactName: "template_app_${version}.${ext}",
  asar: false,
  directories: {
    output: "dist",
    buildResources: "buildResources",
  },
  files: ["packages/**/dist/**"],
  win: {
    icon: "buildResources/icon.ico",
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowElevation: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: "buildResources/icon.ico",
    deleteAppDataOnUninstall: true,
  },
  linux: {
    target: "deb",
  },
};

module.exports = config;
