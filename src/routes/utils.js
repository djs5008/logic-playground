module.exports = {
  response: function(type, body) {
    return { type, body };
  },

  throwErr: function(err) {
    // asynchronous throw error (to escape promise blackhole)
    process.nextTick(() => { throw err; });
  }
};