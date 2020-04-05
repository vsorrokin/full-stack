module.exports = function(source) {

  return source.replace(
    /input-model=\"([^"]*)\"/g,

    `v-model="formData.$1"
     :validation-state="$v.formData.$1"
     :validation-messages="validationMessages.$1"`
  );

};
