import assert from 'assert';
import { CourierOrchestrator } from '../server/orchestrator.js';
import { authenticateAdmin, registerUser, authenticateUser } from '../server/auth.js';

console.log('🧪 Starting XBZ Intelligence Automated Test Suite...\n');

const orchestrator = new CourierOrchestrator();

// 1. Phone normalization & validation tests
console.log('1. Testing Bangladesh Phone Normalization & Privacy Masking...');
{
  // Valid local format
  const t1 = orchestrator.normalizeBangladeshPhone('01712345678');
  assert.strictEqual(t1.valid, true, '01712345678 should be valid');
  assert.strictEqual(t1.normalized, '01712345678');
  assert.strictEqual(t1.masked, '01712-***678');

  // Valid +880 format
  const t2 = orchestrator.normalizeBangladeshPhone('+8801812345678');
  assert.strictEqual(t2.valid, true, '+880 prefix should be valid');
  assert.strictEqual(t2.normalized, '01812345678');

  // Valid 880 format with dashes & spaces
  const t3 = orchestrator.normalizeBangladeshPhone('880 1912-345678');
  assert.strictEqual(t3.valid, true, '880 prefix with spaces should be valid');
  assert.strictEqual(t3.normalized, '01912345678');

  // Invalid length
  const t4 = orchestrator.normalizeBangladeshPhone('017123456');
  assert.strictEqual(t4.valid, false, 'Short number should be invalid');

  // Invalid operator prefix (e.g. 011 or 012 which do not exist in Bangladesh)
  const t5 = orchestrator.normalizeBangladeshPhone('01112345678');
  assert.strictEqual(t5.valid, false, 'Invalid prefix 011 should be rejected');

  console.log('   ✅ Phone normalization tests passed.');
}

// 2. Courier capability & adapter declaration tests
console.log('\n2. Testing Honest Courier Capability Declarations...');
{
  const caps = orchestrator.getCapabilities();
  assert.strictEqual(caps.length, 5, 'Should have 5 registered courier adapters');

  const steadfast = caps.find((c) => c.id === 'steadfast');
  assert.strictEqual(steadfast?.supportsPhoneLookup, true, 'Steadfast should support phone lookup');

  const pathao = caps.find((c) => c.id === 'pathao');
  assert.strictEqual(pathao?.supportsPhoneLookup, false, 'Pathao should honestly declare phone lookup as unsupported');

  const redx = caps.find((c) => c.id === 'redx');
  assert.strictEqual(redx?.supportsPhoneLookup, false, 'REDX should declare phone lookup unsupported');

  const paperfly = caps.find((c) => c.id === 'paperfly');
  assert.strictEqual(paperfly?.supportsPhoneLookup, false, 'Paperfly should declare phone lookup unsupported');

  const ecourier = caps.find((c) => c.id === 'ecourier');
  assert.strictEqual(ecourier?.supportsPhoneLookup, false, 'eCourier should declare phone lookup unsupported');

  console.log('   ✅ Capability declarations verified honestly.');
}

// 3. Rate limiting tests
console.log('\n3. Testing Sliding Window Rate Limiting...');
{
  const testIp = '192.168.1.99';
  const first = orchestrator.checkRateLimit(testIp);
  assert.strictEqual(first.allowed, true, 'Initial request allowed');
  assert.strictEqual(first.remaining, 24, 'Remaining counter should decrement');
  console.log('   ✅ Rate limiting logic confirmed.');
}

// 4. Execution & Risk Scoring Tests
console.log('\n4. Testing Courier Lookup & Risk Scoring Logic...');
(async () => {
  // Test clean customer scenario
  const cleanReport = await orchestrator.executeLookup('01711000001', '127.0.0.1', { sandboxScenario: 'clean' });
  assert.strictEqual(cleanReport.overallStatus, 'complete');
  assert.strictEqual(cleanReport.riskSummary.level, 'low', 'Clean profile should yield low risk');
  assert.ok(cleanReport.riskSummary.reasonsEn.length > 0, 'Should include data-backed reasons');

  // Test high cancellation scenario
  const cancelReport = await orchestrator.executeLookup('01711000002', '127.0.0.1', { sandboxScenario: 'high_cancellation' });
  assert.strictEqual(cancelReport.riskSummary.level, 'high', 'High cancellation profile should yield high review');

  // Test scoring disabled scenario (preserves null score, does NOT hallucinate score)
  const disabledReport = await orchestrator.executeLookup('01711000003', '127.0.0.1', { sandboxScenario: 'scoring_disabled' });
  const steadfastRes = disabledReport.providerResults.find((p) => p.provider === 'steadfast');
  assert.strictEqual(steadfastRes?.scoringDisabled, true, 'Scoring disabled flag preserved');
  assert.strictEqual(steadfastRes?.providerReportedScore, null, 'Must NOT invent a score when scoring_disabled is true');

  // Test new customer / no records scenario
  const noRecReport = await orchestrator.executeLookup('01711000004', '127.0.0.1', { sandboxScenario: 'no_record' });
  assert.strictEqual(noRecReport.riskSummary.level, 'insufficient_data', 'No records should yield insufficient data');

  console.log('   ✅ Risk scoring and scoring_disabled invariants verified.');

  // 5. Authentication & Security
  console.log('\n5. Testing Authentication & Admin Authorization...');
  {
    const expectedPasskey = process.env.ADMIN_PASSKEY || 'admin123';
    assert.strictEqual(authenticateAdmin(expectedPasskey), true, 'Valid passkey authenticates admin');
    assert.strictEqual(authenticateAdmin('wrong_passkey_999'), false, 'Invalid passkey rejected');

    const testUser = registerUser('test@shop.bd', 'securepass', 'Test User', 'BD Express');
    assert.strictEqual(testUser.email, 'test@shop.bd');
    const authSuccess = authenticateUser('test@shop.bd', 'securepass');
    assert.strictEqual(authSuccess.name, 'Test User');

    console.log('   ✅ Authentication and passkey verification passed.');
  }

  // 6. Risk Analytics Aggregate Telemetry Tests
  console.log('\n6. Testing Risk Analytics Telemetry Aggregates...');
  {
    const analytics = orchestrator.getRiskAnalytics({ timeframe: '30d' });
    assert.ok(analytics.summary.totalLookupsEvaluated > 0, 'Total lookups should be > 0');
    assert.strictEqual(analytics.courierPerformance.length, 5, 'Should have 5 couriers in telemetry');
    assert.ok(analytics.commonRiskFactors.length >= 5, 'Should have common risk factors');
    assert.strictEqual(analytics.riskTierDistribution.length, 4, 'Should have 4 risk tiers');
    assert.strictEqual(analytics.regionalPerformance.length, 8, 'Should cover 8 Bangladesh divisions');
    console.log('   ✅ Risk analytics aggregated data verified.');
  }

  // 7. Parcel & Consignment Tracking Tests
  console.log('\n7. Testing Parcel & Consignment Tracking with Courier Filtering...');
  {
    // Test Steadfast tracking
    const sfParcel = await orchestrator.executeParcelTracking('CID-774920', 'steadfast', 'consignment');
    assert.strictEqual(sfParcel.courier, 'steadfast');
    assert.strictEqual(sfParcel.currentStatus, 'delivered');
    assert.ok(sfParcel.timeline.length >= 4, 'Should have multiple chronological timeline events');
    assert.ok(sfParcel.recipient.maskedPhone.includes('***'), 'Recipient phone must be masked for privacy');
    assert.strictEqual(sfParcel.packageDetails.codAmount, 1850);
    assert.ok(sfParcel.customerRiskTelemetry !== undefined, 'Should link recipient delivery risk profile');
    assert.strictEqual(sfParcel.customerRiskTelemetry?.overallRisk, 'low');

    // Test Pathao auto-detection by prefix
    const pathaoParcel = await orchestrator.executeParcelTracking('PTH-892140', 'all', 'consignment');
    assert.strictEqual(pathaoParcel.courier, 'pathao', 'Should auto-detect Pathao by PTH prefix');
    assert.strictEqual(pathaoParcel.currentStatus, 'out_for_delivery');

    // Test REDX return parcel
    const redxParcel = await orchestrator.executeParcelTracking('RDX-551029', 'redx', 'parcel');
    assert.strictEqual(redxParcel.courier, 'redx');
    assert.strictEqual(redxParcel.currentStatus, 'returned');
    assert.strictEqual(redxParcel.customerRiskTelemetry?.overallRisk, 'high');

    // Test explicit courier filter
    const paperflyParcel = await orchestrator.executeParcelTracking('CUSTOM-TRACK-991', 'paperfly', 'consignment');
    assert.strictEqual(paperflyParcel.courier, 'paperfly', 'Should respect explicit courier selection');
    assert.ok(paperflyParcel.timeline.length > 0);

    console.log('   ✅ Parcel and consignment tracking with courier selection verified.');
  }

  console.log('\n🎉 ALL XBZ INTELLIGENCE TESTS PASSED SUCCESSFULLY!\n');
})();
