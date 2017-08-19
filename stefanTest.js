var foo = 7;
var bar = 5;

var foobar = aFunction(foo, bar);

console.log("this is foobar: " + foobar);

if(foobar > 50){
  console.log('foobar is a large number');
}else if (foobar > 20) {
  console.log('foobar is a medium number');
}else{
  console.log('foobar is a small number');
}

for (var i = 0; i < foobar; i++) {
  console.log("Javascript is fun #" + i);
}

function aFunction(var1, var2) {
  var result = (var1 - var2);
  return result * result;
}
