export const environment = {
  production: true,
  appUrl: (process.env['APP_URL'] as string).replace(/\/$/, ''),
};
