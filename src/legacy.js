// Simple JavaScript entry to demonstrate JS initialization
function greet(name) {
  return 'Bonjour, ' + name + '! (from JavaScript)';
}

if (typeof require !== 'undefined' && require.main === module) {
  console.log(greet('Monde'));
}
