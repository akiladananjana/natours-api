const data = 'This is a sample text.';

const newData = data.replace(/(\b\w+\b)/g, match => {
  console.log(match);
  return 'Tehee';
});

console.log(newData);
