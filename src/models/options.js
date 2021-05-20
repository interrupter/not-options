const log = require('not-log')(module, 'Options Model');
try {
  const MODEL_NAME = 'Options';
  const initFields = require('not-node').Fields.initFields;
  const Increment = require('not-node').Increment;
  const notError = require('not-error').notError;

  const FIELDS = [
    'id',
    'value',
    [
      'active',
      {
        default: true
      }
    ],
    'createdAt',
    'updatedAt'
  ];

  exports.keepNotExtended = false;
  exports.thisModelName = MODEL_NAME;
  exports.thisSchema = initFields(FIELDS, 'model');

  exports.enrich = {
    versioning: true,
    increment: true,
    validators: true
  };

  const metaExtend = require('not-meta').extend;
  const metaModel = require('not-meta').Model;

  const ActionList = ['search'];
  const MODULE_OPTIONS_PREFIX = 'MODULE_';

  exports.thisStatics = {
    getModuleOptionsName(moduleName) {
      return MODULE_OPTIONS_PREFIX + moduleName.toLowerCase();
    },
    readModuleOptions(moduleName) {
      let name = this.getModuleOptionsName(moduleName);
      return this.findOne({
          'id': name,
          'active': true,
          __latest: true,
          __closed: false
        }).exec()
        .then((result) => {
          if (result) {
            try {
              return JSON.parse(result.value);
            } catch (e) {
              log.error(e);
              return {};
            }
          } else {
            return {};
          }
        });
    },
    async writeModuleOptions(moduleName, options) {
      let name = this.getModuleOptionsName(moduleName);
      let value = JSON.stringify(options);
      let exists = await this.countWithFilter({
        id: name,
        __latest: true,
        __closed: false
      });
      if (exists) {
        await this.updateOne({
          id: name,
          __latest: true,
          __closed: false
        }, {
          value,
          updatedAt: Date.now()
        }).exec();
        let item = await this.findOne({
          id: name,
          __latest: true,
          __closed: false
        }).exec();
        if (typeof item !== 'undefined' && item !== null) {
          return this.saveVersion(item._id);
        } else {
          throw new notError('-options for module version not saved, empty response', {
            id: name,
            item
          });
        }
      } else {
        return this.add({
          id: name,
          value,
          active: true,
          updatedAt: Date.now()
        });
      }
    },
    getAllAsObject(whitelist = false) {
      return this.find({
          'active': true,
          __latest: true,
          __closed: false
        }).exec()
        .then((results) => {
          let options = {};
          if (Array.isArray(results)) {
            results.forEach((item) => {
              if (whitelist && Array.isArray(whitelist)) {
                if (!whitelist.includes(item.id)) {
                  return;
                }
              }
              options[item.id] = item.value;
            });
          }
          return options;
        });
    },
    async initIfNotExists(opts) {
      let names = Object.keys(opts);
      let res = await this.find({
        __closed: false,
        __latest: true,
        id: {
          $in: names
        }
      }).exec();
      let existed = res.map(itm => itm.id);
      for (let name of names) {
        if (!existed.includes(name)) {
          await this.add({
            id: name,
            ...opts[name]
          });
        }
      }
    },
    async bulkExport(){
      return this.listAll();
    },
    async closeExisting(){
      //closing existing records
      let all = await this.listAll();
      for (let rec of Array.from(all)) {
        await rec.close();
      }
      log.log(`Existing records closed`);
    },
    /**
    * import of many docs in one go,
    * if close==true, all existing will be closed
    * @param {array}    data    array of docs
    * @param {boolean}  close   close existing documents
    * @returns  {Promise}
    */
    async bulkImport(data, close = false) {
      let maxID = 0;
      data = Array.from(data);
      let len = data.length;
      if (close) {
        await this.closeExisting();
      }
      //adding new or modifing existing
      for (let itm of Array.from(data)) {
        //keep track of maximum ID, to later change in 'inc' collection
        if (itm.optionsID > maxID) {
          maxID = itm.optionsID;
        }
        delete itm._id;
        itm._versions;
      }
      await this.insertMany(data);
      log.log(`Imported ${len}`);
      await Increment.rebase(MODEL_NAME, maxID + 1);
      log.log(`ID cursor moved to ${maxID}`);
    },
    async importAsObject(obj, close = false){
      if (close) {
        await this.closeExisting();
      }
    }
  };

  metaExtend(metaModel, exports.thisStatics, ActionList, {
    MODEL_NAME
  });

} catch (e) {
  log.error(e);
}
