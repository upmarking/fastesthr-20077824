import { performance } from 'perf_hooks';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function mockSupabaseCall() {
  await delay(50); // simulate 50ms network latency
  return { data: { mock: true } };
}

async function runSequential() {
  const start = performance.now();

  const { data: candData } = await mockSupabaseCall();
  const { data: job } = await mockSupabaseCall();
  const { data: offerData } = await mockSupabaseCall();

  // mock template fetch
  const templateId = true;
  if (templateId) {
    await mockSupabaseCall();
  }

  return performance.now() - start;
}

async function runParallel() {
  const start = performance.now();

  const [
    { data: candData },
    { data: job },
    { data: offerData }
  ] = await Promise.all([
    mockSupabaseCall(),
    mockSupabaseCall(),
    mockSupabaseCall()
  ]);

  // mock template fetch
  const templateId = true;
  if (templateId) {
    await mockSupabaseCall();
  }

  return performance.now() - start;
}

async function main() {
  console.log("Warming up...");
  await runSequential();
  await runParallel();

  console.log("Running Sequential...");
  let seqTotal = 0;
  for (let i = 0; i < 5; i++) {
    seqTotal += await runSequential();
  }
  const seqAvg = seqTotal / 5;

  console.log("Running Parallel...");
  let parTotal = 0;
  for (let i = 0; i < 5; i++) {
    parTotal += await runParallel();
  }
  const parAvg = parTotal / 5;

  console.log(`\n--- Results (handleResendOffer) ---`);
  console.log(`Sequential Average: ${seqAvg.toFixed(2)}ms`);
  console.log(`Parallel Average: ${parAvg.toFixed(2)}ms`);
  console.log(`Improvement: ${((seqAvg - parAvg) / seqAvg * 100).toFixed(2)}% faster`);
}

main();