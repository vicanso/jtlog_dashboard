module.exports = function(req, res, cbf){
  var body = req.body;
  if(body){
    console.error(JSON.stringify(body));
  }
  cbf(null, {
    msg : 'success'
  });
};

