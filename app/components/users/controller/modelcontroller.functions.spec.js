/*jshint expr: true*/
//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chai = require('chai'),
  chaiAsPromised = require("chai-as-promised"),
  should = chai.should(),
  expect = chai.expect,
  util = require('util'),
  mongoose = require('mongoose'),
  User = require('../model/user'),
  usermcf = require('./modelcontroller.functions')('../model', 'user');

mongoose.Promise = require('bluebird');
chai.use(chaiAsPromised);
chai.should;

describe('--> extended', () => {
  it('should extend a given mongoose model object with the new entries and values on the argument object', done => {
    ((usermcf.extended(new User())({ username: 'A' })).username).should.be.eql('A');
    done();
  });
  it('should return a new extended mongoose model object if first argument is not present.', done => {
    ((usermcf.extended()({ username: 'A' }))._doc.username).should.be.eql('A');
    done();
  });
  it('should return null if second argument is not present.', done => {
    expect(usermcf.extended(new User())()).to.be.null;
    done();
  });
  it('should return null if both arguments are not present.', done => {
    expect(usermcf.extended()()).to.be.null;
    done();
  });
  it('should return a new mongoose model extended with the second argument when the first one is an empty object.', done => {
    ((usermcf.extended({})({ username: 'A' })).username).should.be.eql('A');
    done();
  });
  it('should return the first argument when the second one is an empty object.', done => {
    (usermcf.extended({ username: 'A' })({})).should.be.eql({ username: 'A' });
    done();
  });
});

describe('--> find', () => {
  before(done => {
    mongoose.connect(process.env.MONGOLAB_NAVY_URI, { useMongoClient: true }, (err, res) => {
      if(err) {
        done(err);
      }
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.password = '12345';
      c.save(err => {
        if(err) {
          done(err);
        }
        let c2 = new User();
        c2.username = 'B';
        c2.usertype = 'usertype 1';
        c2.password = '12345';
        c2.save(err => {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
  });
  afterEach(done => {
    User.remove({}, err => {
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.password = '12345';
      c.save(err => {
        if(err) {
          done(err);
        }
        let c2 = new User();
        c2.username = 'B';
        c2.usertype = 'usertype 1';
        c2.password = '12345';
        c2.save(err => {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      });

    });
  });
  after(done => {
    User.remove({}, err => {
      mongoose.disconnect();
      done();
    });
  });
  it('should find existing documents.', done => {
    usermcf.find({ usertype: 'usertype 1' })
      .then(result => {
        result.length.should.be.eql(2);
        return usermcf.find({ username: 'A' });
      })
      .then(result => {
        result.length.should.be.eql(1);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
  it('should resolve to null when there is not documents found.', done => {
    usermcf.find({ usertype: 'usertype 2' }).should.eventually.be.null.and.notify(done);
  });
  it('should return all the documents for an empty object on the argument.', done => {
    usermcf.find({})
      .then(result => {
        result.length.should.be.eql(2);
        done();
      }, error => {
        done(error);
      });
  });
  it('should reject if the argument is not present.', done => {
    (usermcf.find()).should.be.rejected.and.notify(done);
  });
});

describe('--> findOne', () => {
  before(done => {
    mongoose.connect(process.env.MONGOLAB_NAVY_URI, { useMongoClient: true }, (err, res) => {
      if(err) {
        done(err);
      }
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.password = '12345';
      c.save(err => {
        if(err) {
          done(err);
        } else {
          done();
        }
      });
    });
  });
  afterEach(done => {
    User.remove({}, err => {
      if(err) {
        done(err);
      }
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.password = '12345';
      c.save(err => {
        done();
      });
    });
  });
  after(done => {
    User.remove({}, err => {
      mongoose.disconnect();
      done();
    });
  });
  it('should find an existing document.', done => {
    usermcf.findOne({ username: 'A' })
      .then(result => {
        result.usertype.should.be.eql(['usertype 1']);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
  it('should resolve to null when the document is not found.', done => {
    (usermcf.findOne({ username: 'C' })).should.eventually.be.null;
    done();
  });
  it('should reject for an empty object on the argument.', done => {
    (usermcf.findOne({})).should.be.rejectedWith('Empty query!').and.notify(done);
  });
  it('should reject if the argument is not present.', done => {
    (usermcf.findOne()).should.be.rejected.and.notify(done);
  });
});

describe('--> findOneAndUpdate', () => {
  before(done => {
    mongoose.connect(process.env.MONGOLAB_NAVY_URI, { useMongoClient: true }, (err, res) => {
      if(err) {
        done(err);
      }
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.password = '12345';
      c.save(err => {
        if(err) {
          done(err);
        } else {
          done();
        }
      });
    });
  });
  afterEach(done => {
    User.remove({}, err => {
      if(err) {
        done(err);
      }
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.save(err => {
        done();
      });
    });
  });
  after(done => {
    User.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });
  it('should find and update an existing document.', done => {
    usermcf.findOneAndUpdate({ username: 'A' })({ usertype: 'usertype 2' })
      .then(result => {
        result.usertype.should.be.eql(['usertype 2']);
        return usermcf.findOne({ username: 'A' });
      })
      .then(result => {
        result.usertype.should.be.eql(['usertype 2']);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
});

// describe('--> findOneAndDelete', () => {
// });

describe('--> replace.', () => {
  before((done) => {
    mongoose.connect(process.env.MONGOLAB_NAVY_URI, { useMongoClient: true }, (err, res) => {
      if(err) {
        done(err);
      } else {
        done();
      }
    });
  });
  afterEach(done => {
    done();
  });
  after(done => {
    User.remove({}, err => {
      mongoose.disconnect();
      done();
    });
  });
  it('should be able to replace an existing document.', done => {
    done();
  });
  it('should reject if the first argument is an empty object ({}).', done => {
    usermcf.replace({})({ username: 'A' }).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if the second argument is an empty object ({}).', done => {
    (usermcf.replace({ username: 'A' })({})).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if the first argument is not present (empty, null, or undefined).', done => {
    (usermcf.replace()({ username: 'A' })).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if the second argument is not present (empty, null, or undefined).', done => {
    (usermcf.replace({ username: 'A' })()).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if both arguments are not present (empty, null, or undefined).', done => {
    (usermcf.replace()()).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
});

describe('--> save', () => {
  before((done) => {
    mongoose.connect(process.env.MONGOLAB_NAVY_URI, { useMongoClient: true }, (err, res) => {
      if(err) {
        done(err);
      } else {
        done();
      }
    });
  });
  afterEach(done => {
    done();
  });
  after(done => {
    User.remove({}, err => {
      mongoose.disconnect();
      done();
    });
  });
  it('should be able to create a new document.', (done) => {
    let d = new User();
    d.username = 'B';
    d.usertype = 'usertype 2';
    d.password = '12345';
    usermcf.save(d)
      .then((result) => {
        result.username.should.be.eql('B');
        result.usertype.should.be.eql(['usertype 2']);
        return usermcf.findOne({ username: 'B' });
      })
      .then(result => {
        result.username.should.be.eql('B');
        result.usertype.should.be.eql(['usertype 2']);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
  it('should reject if the argument is an empty object ({}).', done => {
    (usermcf.save({})).should.be.rejectedWith('Bad argument!').and.notify(done);
  });
  it('should reject if the argument is not present (empty, null, or undefined).', done => {
    (usermcf.save()).should.be.rejectedWith('Bad argument!').and.notify(done);
  });
});

describe('--> update', () => {
  before((done) => {
    mongoose.connect(process.env.MONGOLAB_NAVY_URI, { useMongoClient: true }, (err, res) => {
      if(err) {
        done(err);
      }
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.password = '12345';
      c.save(err => {
        if(err) {
          done(err);
        }
        let c2 = new User();
        c2.username = 'B';
        c2.usertype = 'usertype 1';
        c2.password = '12345';
        c2.save(err => {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      });
    });
  });
  afterEach(done => {
    User.remove({}, err => {
      let c = new User();
      c.username = 'A';
      c.usertype = 'usertype 1';
      c.password = '12345';
      c.save(err => {
        if(err) {
          done(err);
        }
        let c2 = new User();
        c2.username = 'B';
        c2.usertype = 'usertype 1';
        c2.password = '12345';
        c2.save(err => {
          if(err) {
            done(err);
          } else {
            done();
          }
        });
      });

    });
  });
  after(done => {
    User.remove({}, (err) => {
      mongoose.disconnect();
      done();
    });
  });
  it('should be able to update existing documents and answer with an object that contains the number of documents that has been modified.', done => {
    usermcf.update({ usertype: 'usertype 1' })({ usertype: 'usertype 2' })
      .then(result => {
        result.nModified.should.be.eql(2);
        return usermcf.find({ usertype: 'usertype 2' });
      })
      .then(result => {
        result[0].usertype.should.be.eql(['usertype 2']);
        result[1].usertype.should.be.eql(['usertype 2']);
        done();
      })
      .catch(error => {
        done(error);
      });
  });
  it('should not write object properties that are present on the source but not on the target.', done => {
    usermcf.findOne({ username: 'A' })
      .then(result => {
        return usermcf.update(result)({ usernamee: 'A', usertypee: 'usertype 2' });
      })
      .then(result => {
        result.nModified.should.be.eql(0);
        return usermcf.findOne({ username: 'A' });
      })
      .then(result => {
        result.usertype.should.be.eql(['usertype 1']);
        expect(result.namee).to.be.undefined;
        expect(result.typee).to.be.undefined;
        done();
      })
      .catch(error => {
        done(error);
      });
  });
  it('should reject if the first argument is an empty object ({}).', done => {
    (usermcf.update({})({ username: 'A' })).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if the second argument is an empty object ({}).', done => {
    (usermcf.update({ username: 'A' })({})).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if the first argument is not present (empty, null, or undefined).', done => {
    (usermcf.update()({ username: 'A' })).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if the second argument is not present (empty, null, or undefined).', done => {
    (usermcf.update({ username: 'A' })()).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
  it('should reject if both arguments are not present (empty, null, or undefined).', done => {
    (usermcf.update()()).should.be.rejectedWith('Bad arguments!').and.notify(done);
  });
});