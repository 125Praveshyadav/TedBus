const generatePNR = () => {
  return (
    "TED" +
    Math.floor(
      10000000 +
      Math.random() * 90000000
    )
  );
};

module.exports = generatePNR;