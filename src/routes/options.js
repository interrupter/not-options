const
  UserActions = [],
  AdminActions = [
    'create',
    'getRaw',
    'list',
    'listAndCount',
    'listAll'
  ],
  MODEL_NAME = 'Options',
  MODEL_OPTIONS = {
    MODEL_NAME,
    MODEL_TITLE: 'Опции',
    populate: {}
  };

exports.getIP = (req) => {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

const notNode = require('not-node');
const notError = require('not-error').notError;
const query = require('not-filter');
const metaExtend = require('not-meta').extend;
const metaRoute = require('not-meta').Route;

exports.before = (req) => {
  let optionsSchema = this.getModelSchema(MODEL_NAME);
  query.filter.process(req, optionsSchema);
  query.sorter.process(req, optionsSchema);
  req.sorter = {
    id: -1
  };
  query.search.process(req, optionsSchema);
  query.pager.process(req);
};

exports.after = () => {};

exports._get = async (req, res) => {
  console.log('root options/get');
  let targetId = req.params._id,
    userId = req.user._id;
  try {
    const notApp = notNode.Application;
    let
      thisModel = notApp.getModel(MODEL_NAME);
    thisModel.getOne(targetId).then((data) => {
        res.status(200).json({
          status: 'ok',
          result: data
        });
      })
      .catch((e) => {
        notNode.Application.report(new notError('options._get(db)', {
          ip: exports.getIP(req),
          userId,
          targetId
        }, e));
        res.status(500).json({
          status: 'error',
          error: e.toString()
        });
      });
  } catch (e) {
    notNode.Application.report(new notError('options._get', {
      ip: exports.getIP(req),
      userId,
      targetId
    }, e));
    res.status(500).json({
      status: 'error',
      error: e.toString()
    });
  }
};


exports._delete = async (req, res) => {
  let targetId = req.params._id,
    userId = req.user._id;
  try {
    const notApp = notNode.Application;
    let thisModel = notApp.getModel(MODEL_NAME);

    let item = await thisModel.findOne({
      _id: targetId,
      __latest: true,
      __closed: false
    }).exec();

    if (!item) {
      return res.status(200).json({
        status: 'ok'
      });
    }
    notApp.logger.log({
      module: 'options',
      model: MODEL_NAME,
      action: 'delete',
      by: userId,
      target: targetId
    });
    await item.updateOne({
      __closed: true
    }).exec();
    return res.status(200).json({
      status: 'ok'
    });
  } catch (e) {
    notNode.Application.report(new notError('options._delete', {
      ip: exports.getIP(req),
      userId,
      targetId
    }, e));
    res.status(500).json({
      status: 'error',
      error: e.toString()
    });
  }
};


exports._update = async (req, res) => {
  let targetId = req.params._id,
    userId = req.user._id;
  try {
    const notApp = notNode.Application;
    let thisModel = notApp.getModel(MODEL_NAME);

    let item = await thisModel.findOne({
      _id: targetId,
      __latest: true,
      __closed: false
    }).exec();

    if (!item) {
      return res.status(200).json({
        status: 'error',
        error: notLocale.say('document_not_found')
      });
    }
    let _id = req.body._id;
    data = {
      id: req.body.id,
      value: req.body.value,
      active: !!req.body.active,
    };
    let updated = await thisModel.findOneAndUpdate({
      _id: _id
    }, data, {
      new: true
    }).exec();

    return res.status(200).json({
      status: 'ok',
      result: updated
    });

  } catch (e) {
    notNode.Application.report(new notError('options._update', {
      ip: exports.getIP(req),
      userId,
      targetId
    }, e));
    res.status(500).json({
      status: 'error',
      error: e.toString()
    });
  }
};

//we have only Admin level routes so, all goes with '_' prefix standart for him
metaExtend(metaRoute, module.exports, AdminActions, MODEL_OPTIONS, '_');
metaExtend(metaRoute, module.exports, UserActions, MODEL_OPTIONS, '');
