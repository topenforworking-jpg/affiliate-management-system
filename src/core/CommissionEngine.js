@@
   _mergeConfig(userConfig) {
     const defaultConfig = {
       multiTier: false,
       calculation: "percentage",
       rate: 10,
       minimum: 0,
       maximum: 100,
       tiers: [
         { level: 1, rate: 10, name: "Bronze" },
         { level: 2, rate: 15, name: "Silver" },
         { level: 3, rate: 20, name: "Gold" },
       ],
       volumeBonuses: [
         { threshold: 1000, bonus: 2 },
         { threshold: 5000, bonus: 5 },
         { threshold: 10000, bonus: 10 },
       ],
+      // product-specific commission rates (productId => rate)
+      productRates: {},
     };
 
     return _.merge(defaultConfig, userConfig);
   }
@@
   _getCommissionRate(affiliate, amount) {
-    if (this.config.multiTier) {
-      const tier = this.tierStructure.get(affiliate.tier);
-      return tier ? tier.rate : this.config.rate;
-    }
-    return this.config.rate;
+    // NOTE: this method will be replaced with a version that accepts options
+    // to allow product-specific overrides. A more flexible method is provided
+    // below as _getCommissionRateWithOptions.
+    return this._getCommissionRateWithOptions(affiliate, amount, {});
   }
+
+  _getCommissionRateWithOptions(affiliate, amount, options = {}) {
+    // 1) explicit override passed in options
+    if (options && typeof options.overrideRate === 'number') {
+      return options.overrideRate;
+    }
+
+    // 2) product-specific rate from config
+    if (
+      options &&
+      options.productId &&
+      this.config.productRates &&
+      this.config.productRates[options.productId] !== undefined
+    ) {
+      return this.config.productRates[options.productId];
+    }
+
+    // 3) tier-based rate when multi-tier enabled
+    if (this.config.multiTier) {
+      const tier = this.tierStructure.get(affiliate.tier);
+      return tier ? tier.rate : this.config.rate;
+    }
+
+    // 4) fallback global rate
+    return this.config.rate;
+  }
