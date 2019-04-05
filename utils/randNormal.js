export default function randNormal(mu, sigma) {
  var sum = 0;
  for (var i = 0; i < 6; i += 1) {
    sum += rand(-1, 1);
  }
  return mu + (sigma * sum) / 6;
}