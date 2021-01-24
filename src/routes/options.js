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
    populate: {},
    RESPONSE:{
      full: ['get','getRaw','create']
    },
  };

const log = require('not-log')(module, `${MODEL_NAME} router`);

exports.getIP = (req) => {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
};

const notNode = require('not-node');
const notError = require('not-error').notError;
const notLocale = require('not-locale');
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
  if(req.body && Object.prototype.hasOwnProperty.call(req.body, 'active')){
    if((req.body.active !== true) && (req.body.active !== false)){
      req.body.active = false;
    }
  }
};

exports.after = () => {};

exports._get = async (req, res) => {
  log.debug('root options/get');
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
        log.error(e);
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
    log.error(e);
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

async function updateDocument(doc){
  const notApp = notNode.Application;
  let thisModel = notApp.getModel(MODEL_NAME);

  let item = await thisModel.findOne({
    _id:       doc._id,
    __latest: true,
    __closed: false
  }).exec();

  if (!item) {
    throw new notError(notLocale.say('document_not_found'), {doc});
  }

  let updated = await thisModel.findOneAndUpdate({
    _id:       doc._id
  }, {
    value: doc.value,
    active: !!doc.active
  }, {
    new: true
  }).exec();
  return updated;
}

exports._update = async (req, res) => {
  let targetId = req.params._id,
    _id = req.body._id,
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
    data = {
      value: req.body.value,
      active: !!req.body.active,
    };

    let updated = await thisModel.findOneAndUpdate({
      _id
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

exports._getForModule = async (req, res)=>{
  let moduleName = req.params.moduleName,
    userId = req.user._id;
  try{
      if((!moduleName) || (moduleName.length < 1)){
        throw new Error('moduleName is now valid');
      }
      const notApp = notNode.Application;
      let results = await notApp.getModel(MODEL_NAME).readModuleOptions(moduleName);
      res.status(200).json({
        status: 'ok',
        result: results
      });
  }catch(e){
    notNode.Application.report(new notError('options._getForModule', {
      ip: exports.getIP(req),
      userId,
      moduleName
    }, e));
    res.status(500).json({
      status: 'error',
      error: e.toString()
    });
  }
}

exports._updateForModule = async (req, res)=>{
  let moduleName = req.params.moduleName,
    options = req.body.options,
    userId = req.user._id;
  try{
      if((!moduleName) || (moduleName.length < 1)){
        throw new Error('moduleName is now valid');
      }
      const notApp = notNode.Application;
      await notApp.getModel(MODEL_NAME).writeModuleOptions(moduleName, options);
      notNode.Application.emit(`module:${moduleName}:options:updated`);
      res.status(200).json({
        status: 'ok'
      });
  }catch(e){
    notNode.Application.report(new notError('options._updateForModule', {
      ip: exports.getIP(req),
      userId,
      moduleName
    }, e));
    res.status(500).json({
      status: 'error',
      error: e.toString()
    });
  }
}


function getAppName(){
  return notNode.Application.getEnv('name');
}

function getOptionsFilename(){
  let appname = getAppName();
  let date = Date.now().toISOString().split('.')[0];
  return `${appname}.options.${date}.json`;
}



exports._import = async(req, res)=>{
  try{
    let data = JSON.parse(req.body.options);
    await notNode.Application.getModel(MODEL_NAME).bulkImport(data);
    res.status(200);
    res.json({
      status: 'ok'
    });
    res.end();
  }catch(e){
    notNode.Application.report(new notError('options._import', {
      ip: exports.getIP(req)
    }, e));
    res.status(500).json({
      status: 'error',
      error: e.toString()
    });
  }
}

exports._export = async(req, res)=>{
  try{
    //taking only last versions of documents
    let data = await notNode.Application.getModel(MODEL_NAME).getAllAsObject();
    let fname = getOptionsFilename();
    res.status(200);
    res.append('Content-Disposition',`inline; filename="${fname}"`);
    res.json(data);
    res.end();
  }catch(e){
    notNode.Application.report(new notError('options._export', {
      ip: exports.getIP(req)
    }, e));
    res.status(500).json({
      status: 'error',
      error: e.toString()
    });
  }
}

//we have only Admin level routes so, all goes with '_' prefix standart for him
metaExtend(metaRoute, module.exports, AdminActions, MODEL_OPTIONS, '_');
metaExtend(metaRoute, module.exports, UserActions, MODEL_OPTIONS, '');
