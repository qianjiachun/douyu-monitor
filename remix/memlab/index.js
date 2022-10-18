const {takeSnapshots, StringAnalysis, analyze, findLeaks} = require('@memlab/api');

(async function () {
  const scenario = {
    url: () => "http://localhost:3000/1126960",
  };
  const result = await takeSnapshots({scenario});
  const analysis = new StringAnalysis();
  const leaks = findLeaks(result);
  console.log(leaks);
  // await analyze(result, analysis);
})();