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
      res.status(400).send({ success: false, msg: 'User not found.' });
    } else {
      // check if password matches
      user.comparePassword(req.body.password, function(err, isMatch) {
        if(isMatch && !err) {
          // if user is found and password is right create a token
          const token = authFunctions.buildToken(user);
          // return the information including token as JSON
          res.status(200).send({ success: true, token: 'JWT ' + token });
        } else {
          res.status(400).send({ success: false, msg: 'Authentication failed. Wrong password.' });
        }
      });
    }
  }, error => {
    res.status(500).send({ success: false, err: error });
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
    .then(founduu => {
      resolve(founduu ? founduu : null);
    })
    .catch(error => {
      reject(error);
    })
  );
const saveNew = userobject =>
  new Promise((resolve, reject) =>
    usermcf.save(usermcf.extended({})(_.omit(userobject, ['_id'])))
    .then(result => {
      emitUpdateEvent(null, _.omit(result, '_doc.password'));
      resolve(_.omit(result, '_doc.password'));
    })
    .catch(error => {
      reject(error);
    }));

const updateExisting = (query, userobj) =>
  new Promise((resolve, reject) =>
    usermcf.findOne(query)
    .then(user => {
      if(!user) {
        return reject('Cannot find the speciffied user!');
      }
      usermcf.findOneAndUpdate(_.pick(user._doc, '_id'))(_.omit(userobj, ['_id', 'type']))
        .then(result => {
          emitUpdateEvent(user, result);
          return resolve(result);
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
      msg: 'Nothing inserted, 0 users in POST body',
      err: 'Nothing inserted, 0 users in POST body'
    });
  } else {
    // if(!req.params._client) {
    //   res.status(500).send({
    //     success: false,
    //     msg: 'Nothing inserted, no client specified.',
    //     err: 'Nothing inserted, no client specified.'
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
      msg: 'Userss succesfully posted',
      data: result
    }))
    .catch(error => res.status(500).send({
      success: false,
      msg: error.message,
      err: error
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
    result ? { success: true, data: _.omit(result._doc, 'password') } : { success: false, msg: 'Can´t find the specified user.' }
  ))
  .catch(error => res.status(500).send({ success: false, msg: error, err: error }));

/**
 * Express endpoint for GET on /api/users access point route.
 * @param {Request} req 
 * @param {Response} res
 */
const getUsersREST = (req, res) => {
  getUsers(req.query)
    .then(results =>
      res.status(200).send(
        results ? { success: true, data: results.map(r => _.omit(r._doc, 'password')) } : { success: true, msg: 'Can´t find any users.' }))
    .catch(error =>
      res.status(500).send({ success: false, msg: 'Failed while trying to get the users.', err: error }));
};
/**
 * Express endpoints for DELETE on /clients/:_client/users/:_user and /users/:_user access points routes.
 * @param {Request} req 
 * @param {Response} res
 */
const deleteUserREST = (req, res) => {
  deleteExisting({ _id: req.params._user })
    .then(result =>
      res.status(result ? 200 : 400).send(result ? { success: true, msg: 'User deleted.' } : { success: false, msg: 'User not found.' }))
    .catch(error =>
      res.status(500).send({ success: false, msg: 'Failed while trying to delete the user.', err: error }));
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