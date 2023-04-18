const {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFahrenheit,
} = require("../src/math");
test("calculate Tip", () => {
  const total = calculateTip(10, 0.3);

  expect(total).toBe(13);
});
test("Fahrennheit to Celsius", () => {
  const conversion = fahrenheitToCelsius(32);
  expect(conversion).toBe(0);
});
test("Celsius to Fahreinheit", () => {
  const conversion = celsiusToFahrenheit(0);
  expect(conversion).toBe(32);
});
