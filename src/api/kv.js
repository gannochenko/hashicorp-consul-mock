import { wrapError } from '../lib/util';

export default app => {
  const cluster = process.env.CLUSTER_NAME || 'dc1';

  [`/ui/${cluster}/kv/`, '/v1/kv/'].forEach(root => {
    app.get(
      `${root}*`,
      wrapError(async (req, res) => {
        let path = decodeURIComponent(req.path.substr(root.length));
        if (path[path.length - 1] === '/') {
          path = path.substr(0, path.length - 1);
        }

        const env = process.env[path];
        if (typeof env !== 'undefined') {
          logger.info(`Requested: ${path}, sent: ${env}`);
          // res.setHeader('Content-Type', 'application/json');
          res.status(200);

          res.send({
            Value: env,
          });

          // .send(JSON.stringify({
          //     Value: env,
          // }));
        } else {
          logger.info(`Requested: ${path}, but nothing found`);
          res.status(404).send('not found');
        }
      }),
    );
  });
};
