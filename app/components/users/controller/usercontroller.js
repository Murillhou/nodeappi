// LOAD REQUIRED PACKAGES
const _ = require('lodash'),
  path = require('path'),
  rootPath = require('app-root-path').toString(),
  authFunctions = require(path.join(rootPath, 'app', 'components', 'authentication')).functions;
// LOAD REQUIRED MODULES OR CLASSES
const usermcf = require('./modelcontroller.functions')('../model', 'user');
const emitUpdateEvent = (model, upd, ...rest) =>
  require(path.join(rootPath, 'app', 'components', 'event-manager'))
  .emit('userupdate', model, upd, rest);

// const mapAssign = entry => objarray => objarray.map(obj => _.assign(obj, entry));

// AUX USER MANAGEMENT FUNCTIONS
const authenticateUser = (req, res) =>
  usermcf.findOne({ username: req.body.username })
  .then(user => {
    if(!user) {
      res.status(400).send({ success: false, message: 'User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function(error, isMatch) {
        if(isMatch && !error) {
          // if user is found and password is right create a token
          const token = authFunctions.buildToken(user);
          // return the information including token as JSON
          res.status(200).send({ success: true, token: 'JWT ' + token });
        } else {
          res.status(400).send({ success: false, message: 'Authentication failed. Wrong password.' });
        }
      });
    }
  }, error => {
    res.status(500).send({ success: false, error });
  });
// CORE MODEL CONTROLLER FUNCTIONS
const getUser = query =>
  new Promise((resolve, reject) =>
    usermcf.findOne(query)
    .then(user => resolve(user ? user : null))
    .catch(error => reject(error))
  );
const getUsers = query =>
  new Promise((resolve, reject) =>
    usermcf.find(query)
    .then(founduu => resolve(founduu ? founduu : null))
    .catch(error => reject(error))
  );
const saveNew = userobject =>
  new Promise((resolve, reject) =>
    usermcf.save(usermcf.extended({})(_.omit(userobject, ['_id'])))
    .then(result => {
      let resObj = _.omit(result._doc, ['_id', 'password']);
      emitUpdateEvent(null, resObj);
      return resolve(resObj);
    })
    .catch(error => {
      return reject(error);
    }));

const updateExisting = (query, userobj) =>
  new Promise((resolve, reject) =>
    usermcf.findOne(query)
    .then(user => {
      if(!user) {
        return reject('Cannot find the speciffied user!');
      }
      usermcf.findOneAndUpdate(_.pick(user._doc, '_id'))(_.omit(userobj.doc, ['_id', 'usertype']))
        .then(result => {
          let resObj = _.omit(result._doc, ['_id', 'password']);
          emitUpdateEvent(user, resObj);
          return resolve(resObj);
        })
        .catch(error => {
          return reject(error);
        });
    })
    .catch(error => reject(error))
  );

const deleteExisting = (query) =>
  new Promise((resolve, reject) => {
    usermcf.findOne(query)
      .then(user => {
        if(!user) {
          return reject('Cannot find the specified user!');
        }
        usermcf.findOneAndDelete({ _id: user._id })
          .then(result => {
            emitUpdateEvent(user, null);
            return resolve(result);
          })
          .catch(error => {
            return reject(error);
          });
      });
  });
/**
 * model controller function for posting a single user to the database (search and then update if found, save if not)
 * @param {Object} userobject
 */
const postUser = userobject =>
  new Promise((resolve, reject) =>
    usermcf.findOne(_.pick(userobject, ['username']))
    .then(user => {
      if(user) {
        return updateExisting(_.pick(user._doc, '_id'), user);
      } else {
        return saveNew(userobject);
      }
    })
    .then(result => resolve(result))
    .catch(error => reject(error))
  );
/**
 * model controller function for posting multiple users to the database (search and then update if found, save if not)
 * @param {[Object]} userobjects
 */
const postUsers = usersobjects =>
  Promise.all(
    usersobjects.map(postUser)
  );
/**
 * filter middleware for POST /api/clients/_client/users access point route.
 * @param {Request} req 
 * @param {Response} res
 * @param {function} next
 */
const postUsersFilter = (req, res, next) => {
  if(!(req.body).length) {
    res.status(500).send({
      success: false,
      message: 'Nothing inserted, 0 users in POST body',
      error: new Error('Nothing inserted, 0 users in POST body')
    });
  } else {
    // if(!req.params._client) {
    //   res.status(500).send({
    //     success: false,
    //     message: 'Nothing inserted, no client specified.',
    //     error: new Error('Nothing inserted, no client specified.')
    //   });
    // } else {
    //   req.body = mapAssign({ _client: req.params._client })(req.body);
    // }
    next();
  }
};
/**
 * Express endpoint for POST on /api/users access point route.
 * @param {Request} req 
 * @param {Response} res
 */
const postUsersREST = (req, res) => {
  postUsers(req.body)
    .then(result => res.status(200).send({
      success: true,
      message: 'Userss succesfully posted',
      data: result
    }))
    .catch(error => res.status(500).send({
      success: false,
      message: error.message,
      error
    }));
};
/**
 * Express endpoint for GET on /api/users/:_user acces point route.
 * @param {Request} req 
 * @param {Response} res
 */
const getUserREST = (req, res) =>
  getUser({ _id: req.params._user })
  .then(result => res.status(result ? 200 : 400).send(
    result ? { success: true, data: _.omit(result._doc, 'password') } : { success: false, message: 'Can´t find the specified user.' }
  ))
  .catch(error => res.status(500).send({ success: false, message: error, error }));

/**
 * Express endpoint for GET on /api/users access point route.
 * @param {Request} req 
 * @param {Response} res
 */
const getUsersREST = (req, res) => {
  getUsers(req.query)
    .then(results =>
      res.status(200).send(
        results ? { success: true, data: results.map(r => _.omit(r._doc, 'password')) } : { success: true, message: 'Can´t find any users.' }))
    .catch(error =>
      res.status(500).send({ success: false, message: 'Failed while trying to get the users.', error }));
};
/**
 * Express endpoints for DELETE on /clients/:_client/users/:_user and /users/:_user access points routes.
 * @param {Request} req 
 * @param {Response} res
 */
const deleteUserREST = (req, res) => {
  deleteExisting({ _id: req.params._user })
    .then(result =>
      res.status(result ? 200 : 400).send(result ? { success: true, message: 'User deleted.' } : { success: false, message: 'User not found.' }))
    .catch(error =>
      res.status(500).send({ success: false, message: 'Failed while trying to delete the user.', error }));
};

module.exports = {
  authenticateUser,
  deleteUser: deleteExisting,
  deleteUserREST,
  getUsers,
  getUsersREST,
  getUser,
  getUserREST,
  postUser,
  postUsers,
  postUsersFilter,
  postUsersREST
  // putUser: putUser,
  // putUserREST: putUserREST,
  // paramsUserFilter: paramsUserFilter,
};