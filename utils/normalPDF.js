export default function normalPDF(x, mu, sigma) {
  var sigma2 = Math.pow(sigma, 2);
  var numerator = Math.exp(-Math.pow(x - mu, 2) / (2 * sigma2));
  var denominator = Math.sqrt(2 * Math.PI * sigma2);
  return numerator / denominator;
}