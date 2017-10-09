const pm2 = require('pm2');
const ENV ='development';

const apps = [
  {
    script: 'index.js',
    name: 'resigndesign',
    watch: true,
    ignore_watch: [
      'app/assets',
      '.git',
      'node_modules',
      'app/public',
      'app/views',
      'log',
      'temp*',
    ],
    env: {
      DEBUG_COLORS: true,
      NODE_ENV: ENV,
    },
    post_update: ['npm install'],
  },
];

pm2.connect(() => {
  pm2.killInteract(() => {});
  pm2.start(apps, () => {
    pm2.launchBus((err, bus) => {
      console.log('[PM2] Log streaming started');

      bus.on('log:out', (packet) => {
        console.log('[App:%s] %s', packet.process.name, packet.data);
      });

      bus.on('log:err', (packet) => {
        console.error('[App:%s][Err] %s', packet.process.name, packet.data);
      });
    });
  });
});
