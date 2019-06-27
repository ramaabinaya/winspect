// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
/**
 * Const variable which is used to define the environemt variable for development
 */
export const environment = {
  production: true,
  //apiUrldb: 'http://localhost:4000/',
  apiUrldb: 'http://dev.winspect.centizenapps.com/api/',
  imageUrlDb: 'http://dev.winspect.centizenapps.com',
  serverPort: 80,
  matomoUrl: '//matomo.centizenapps.com/'
};

