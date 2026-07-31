const { AffiliateEngine } = require('../src/index');

async function run() {
  const affiliateSystem = new AffiliateEngine({
    commission: {
      enabled: true,
      multiTier: true,
      rate: 10,
      tiers: [
        { level: 1, rate: 40, name: 'ProductSales' },
        { level: 2, rate: 5, name: 'Manager' }
      ],
      productRates: {
        'PROD-40-EXAMPLE': 40
      }
    }
  });

  if (!affiliateSystem.isInitialized) {
    await new Promise(resolve => affiliateSystem.once('initialized', resolve));
  }

  // Create manager affiliate (tier 2)
  const manager = await affiliateSystem.createAffiliate({ name: 'Manager', email: 'mgr@example.com', tier: 2 });

  console.log('Affiliate created:', manager.id, manager.tier);

  const commissionNormal = await affiliateSystem.calculateCommission(manager.id, 1000, { productId: 'OTHER' });
  console.log('Normal product commission (should be 5%):', commissionNormal.totalCommission, 'rate:', commissionNormal.commissionRate);

  const commissionProduct = await affiliateSystem.calculateCommission(manager.id, 1000, { productId: 'PROD-40-EXAMPLE' });
  console.log('Product-specific commission (should be 40%):', commissionProduct.totalCommission, 'rate:', commissionProduct.commissionRate);
}

run().catch(err => { console.error(err); process.exit(1); });
