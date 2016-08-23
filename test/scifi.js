contract('SciFi', (accounts) => {

  var metaMask = '0x568bCD2DAe734B44e5E1cF3975418ad78A2b142A';
  web3.eth.sendTransaction({from:accounts[9], to:metaMask, value: web3.toWei(1, "ether")});
  
  var t2 = web3.toHex('Terminator 2');
  var predator = web3.toHex('Predator');
  var totalWei = 0;

  it("should start with no movies", () => {
    var scifi = SciFi.deployed();

    return scifi.movie_count().then((num) => {
      assert.equal(num.valueOf(), 0, "There should be 0 movies at first!");
    });
  });

  it("should have first account as owner", () => {
    var scifi = SciFi.deployed();

    return scifi.owner().then((res) => {
      assert.equal(res, accounts[0], "omg!");
    });
  });

  it("should vote five times for Terminator 2", () => {
    var scifi = SciFi.deployed();
    var wei = 0;
    var startingWei = 100000;
    var promises = [];

    for (var i = 0; i < 5; i++) {
      wei = startingWei * (i + 1);
      totalWei += wei;
      promises.push(scifi.vote(t2, {from: accounts[i], value: wei}));
    }

    return Promise.all(promises).then((val) => {
      assert.equal(val.length, 5, "There should be 5 transactions!");
    });
  });

  it("should check for owner of Terminator 2", () => {
    var scifi = SciFi.deployed();

    return scifi.movies(t2).then((m) => {
      //assert.equal(m[0], t2, "Movie should be named 'Terminator 2'");
      assert.equal(m[1].valueOf(), 5, "Movie should have 5 votes");
      assert.equal(m[2].valueOf(), totalWei, "Amount voted is incorrect");
      assert.equal(m[3], accounts[0], "Movie owner should be first account");
    });
  });

  it("should vote twice for Predator", () => {
    var scifi = SciFi.deployed();

    return scifi.vote(predator, {from: accounts[1], value: 100000}).then(() => {
      return scifi.vote(predator, {from: accounts[2], value: 100000});
    }).then(() => {
      return scifi.movies(predator);
    }).then((m) => {
      assert.equal(m[1].valueOf(), 2, "Movie should have 2 votes");
      assert.equal(m[3], accounts[1], "hello");
      return scifi.movies(t2);
    }).then((m) => {
      assert.equal(m[1].toNumber(), 5, "Hola");
    });
  });

});