import app from '../server/src/index.js';

export default (req, res) => {
    app.callback()(req, res);
};
