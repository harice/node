
module.exports = function(error) {
  console.log('===== > CATCH < =====');
  console.log(error);
  console.log('===== ^ CATCH ^ =====');
  return error;
}
