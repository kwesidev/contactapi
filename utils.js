 // @Author William Kwasidev
 //Utilities
//remove id _keys

exports.removeMongoKeys  =  function (data){
  for ( var i = 0 ; i < data.length ; i++) {
      delete data[i]._id;
  }

}
