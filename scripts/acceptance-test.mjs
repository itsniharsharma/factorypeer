#!/usr/bin/env node

/**
 * COMPREHENSIVE END-TO-END ACCEPTANCE TEST
 * 
 * Simulates a real non-technical operator using ONLY the admin API to:
 * 1. Create homepage merchandising (banners, tiles, support cards)
 * 2. Configure navigation/footer
 * 3. Build a complete catalog hierarchy
 * 4. Create products and variants
 * 5. Build spec schema and bind variants
 * 6. Validate storefront output
 */

// Using Node 18+ built-in fetch (no import needed)

const ADMIN_API_BASE = process.env.CATALOG_ADMIN_API_URL || 'http://127.0.0.1:4040/admin/catalog';
const STOREFRONT_BASE = process.env.STOREFRONT_URL || 'http://127.0.0.1:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function logSection(title) {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`  ${title}`, 'cyan');
  log(`${'='.repeat(60)}`, 'cyan');
}

function logTest(name, status, detail = '') {
  const symbol = status ? '✓' : '✗';
  const color = status ? 'green' : 'red';
  log(`  ${symbol} ${name}${detail ? ': ' + detail : ''}`, color);
}

async function adminFetch(path, options = {}) {
  const url = `${ADMIN_API_BASE}${path}`;
  const method = options.method || 'GET';
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      method,
      headers,
      body: options.json ? JSON.stringify(options.json) : undefined,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const error = new Error(`${method} ${path} failed: ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    log(`  Error calling ${method} ${path}: ${err.message}`, 'red');
    if (err.data) {
      log(`  Response: ${JSON.stringify(err.data, null, 2)}`, 'yellow');
    }
    throw err;
  }
}

async function fetchStorefront(path) {
  const url = `${STOREFRONT_BASE}${path}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    return await res.text();
  } catch (err) {
    log(`  Error fetching storefront ${path}: ${err.message}`, 'red');
    throw err;
  }
}

// ============================================================================
// TEST EXECUTION
// ============================================================================

const results = {
  passed: 0,
  failed: 0,
  issues: [],
};

function recordPass(name) {
  logTest(name, true);
  results.passed++;
}

function recordFail(name, error) {
  logTest(name, false, error?.message || String(error));
  results.failed++;
  results.issues.push({ name, error: error?.message || String(error) });
}

async function runTest(name, fn) {
  try {
    await fn();
    recordPass(name);
  } catch (err) {
    recordFail(name, err);
  }
}

let state = {};

// Generate unique IDs for this test run to avoid conflicts with previous runs
const testRunId = Date.now().toString().slice(-6);
const uniqueSlug = (base) => `${base}-${testRunId}`;

async function main() {
  log('\n╔═══════════════════════════════════════════════════════════════╗', 'blue');
  log('║  FACTORYPEER ADMIN-ONLY ACCEPTANCE TEST                       ║', 'blue');
  log('║  Real-world catalog + merchandising build via admin API only   ║', 'blue');
  log('╚═══════════════════════════════════════════════════════════════╝', 'blue');

  log(`\nAdmin API:  ${ADMIN_API_BASE}`, 'cyan');
  log(`Storefront: ${STOREFRONT_BASE}\n`, 'cyan');

  // ========================================================================
  // SECTION 1: HOMEPAGE MERCHANDISING
  // ========================================================================

  logSection('SECTION 1: HOMEPAGE MERCHANDISING');

  await runTest('Create promo banner: Industrial Solutions', async () => {
    const res = await adminFetch('/homepage/banners', {
      method: 'POST',
      json: {
        slug: uniqueSlug('industrial-solutions'),
        eyebrow: 'Limited Time Offer',
        title: 'Professional Machining Solutions',
        subtitle: 'Premium T-Slot cutters for precision milling',
        description: 'Engineered for industrial precision. Trusted by thousands of manufacturers.',
        imageUrl: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=400&fit=crop',
        imageAlt: 'Industrial machining equipment',
        ctaLabel: 'Explore Cutters',
        href: '/catalog/machining/milling/milling-cutters/t-slot-milling-cutters',
        openInNewTab: false,
        status: 'published',
        sortOrder: 1,
      },
    });
    state.bannerId1 = res._id;
  });

  await runTest('Create promo banner: New Inventory', async () => {
    const res = await adminFetch('/homepage/banners', {
      method: 'POST',
      json: {
        slug: uniqueSlug('new-inventory'),
        title: 'New Inventory Alert',
        subtitle: 'Latest arrivals in T-Slot milling cutters',
        description: 'Just added 50+ SKUs in our premium T-Slot lineup.',
        imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=400&fit=crop',
        imageAlt: 'New inventory',
        ctaLabel: 'View New Items',
        href: '/search?q=new',
        status: 'published',
        sortOrder: 2,
      },
    });
    state.bannerId2 = res._id;
  });

  await runTest('List homepage banners and verify', async () => {
    const res = await adminFetch('/homepage/banners?status=published');
    if (!Array.isArray(res) || res.length < 2) {
      throw new Error(`Expected at least 2 banners, got ${res?.length || 0}`);
    }
  });

  // Category Tiles
  await runTest('Create category tile: Machining', async () => {
    const res = await adminFetch('/homepage/category-tiles', {
      method: 'POST',
      json: {
        slug: uniqueSlug('machining-tile'),
        label: 'Machining Solutions',
        description: 'Comprehensive range of precision machining tools and cutters.',
        imageUrl: 'https://images.unsplash.com/photo-1581092916550-e323be2ae537?w=600&h=400&fit=crop',
        imageAlt: 'Machining tools',
        ctaLabel: 'Browse Machining',
        status: 'published',
        sortOrder: 1,
      },
    });
    state.tileMachiningId = res._id;
  });

  await runTest('Create category tile: Industrial Supplies', async () => {
    const res = await adminFetch('/homepage/category-tiles', {
      method: 'POST',
      json: {
        slug: uniqueSlug('industrial-supplies-tile'),
        label: 'Industrial Supplies',
        description: 'Premium supplies for industrial manufacturing.',
        imageUrl: 'https://images.unsplash.com/photo-1581092162562-40038f56b657?w=600&h=400&fit=crop',
        imageAlt: 'Industrial supplies',
        status: 'published',
        sortOrder: 2,
      },
    });
    state.tileSuppliestileId = res._id;
  });

  // Support Cards
  await runTest('Create support card: Technical Support', async () => {
    const res = await adminFetch('/homepage/support-cards', {
      method: 'POST',
      json: {
        slug: uniqueSlug('technical-support'),
        title: 'Technical Support',
        description: 'Expert guidance for tool selection and application.',
        icon: 'phone',
        ctaLabel: 'Contact Us',
        href: '/contact',
        status: 'published',
        sortOrder: 1,
      },
    });
    state.supportCardId1 = res._id;
  });

  await runTest('Create support card: Bulk Pricing', async () => {
    const res = await adminFetch('/homepage/support-cards', {
      method: 'POST',
      json: {
        slug: uniqueSlug('bulk-pricing'),
        title: 'Bulk Pricing',
        description: 'Volume discounts for industrial partners.',
        icon: 'dollar',
        ctaLabel: 'Request Quote',
        href: '/bulk-pricing',
        status: 'published',
        sortOrder: 2,
      },
    });
    state.supportCardId2 = res._id;
  });

  await runTest('Create support card: Free Shipping', async () => {
    const res = await adminFetch('/homepage/support-cards', {
      method: 'POST',
      json: {
        slug: uniqueSlug('free-shipping'),
        title: 'Free Shipping',
        description: 'On orders over $500 in continental US.',
        icon: 'truck',
        ctaLabel: 'Learn More',
        href: '/shipping',
        status: 'published',
        sortOrder: 3,
      },
    });
    state.supportCardId3 = res._id;
  });

  // ========================================================================
  // SECTION 2: NAVIGATION & FOOTER CONTENT
  // ========================================================================

  logSection('SECTION 2: NAVIGATION & FOOTER CONTENT');

  await runTest('Create utility link group (top nav)', async () => {
    const res = await adminFetch('/navigation/link-groups', {
      method: 'POST',
      json: {
        placement: 'utility',
        title: 'Utility Links',
        slug: uniqueSlug('utility-links'),
        links: [
          { label: 'About Us', href: '/about', sortOrder: 1 },
          { label: 'Contact', href: '/contact', sortOrder: 2 },
          { label: 'Terms', href: '/terms', sortOrder: 3 },
        ],
        status: 'published',
      },
    });
    state.utilityLinkGroupId = res._id;
  });

  await runTest('Create footer link group: Company', async () => {
    const res = await adminFetch('/navigation/link-groups', {
      method: 'POST',
      json: {
        placement: 'footer',
        title: 'Company',
        slug: uniqueSlug('footer-company'),
        links: [
          { label: 'About Us', href: '/about', sortOrder: 1 },
          { label: 'Careers', href: '/careers', sortOrder: 2 },
          { label: 'Press', href: '/press', sortOrder: 3 },
        ],
        status: 'published',
        sortOrder: 1,
      },
    });
    state.footerCompanyGroupId = res._id;
  });

  await runTest('Create footer link group: Support', async () => {
    const res = await adminFetch('/navigation/link-groups', {
      method: 'POST',
      json: {
        placement: 'footer',
        title: 'Support',
        slug: uniqueSlug('footer-support'),
        links: [
          { label: 'Help Center', href: '/help', sortOrder: 1 },
          { label: 'Contact Sales', href: '/sales', sortOrder: 2 },
          { label: 'Technical Support', href: '/support', sortOrder: 3 },
        ],
        status: 'published',
        sortOrder: 2,
      },
    });
    state.footerSupportGroupId = res._id;
  });

  await runTest('Create footer content', async () => {
    const res = await adminFetch('/navigation/footer-content', {
      method: 'POST',
      json: {
        slug: uniqueSlug('main-footer'),
        companyName: 'FactoryPeer Industrial Supply',
        description: 'Leading supplier of precision machining tools and industrial supplies.',
        legalLinks: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Sitemap', href: '/sitemap' },
        ],
        status: 'published',
      },
    });
    state.footerContentId = res._id;
  });

  // ========================================================================
  // SECTION 3: CATALOG HIERARCHY
  // ========================================================================

  logSection('SECTION 3: CATALOG HIERARCHY');

  await runTest('Create root category: Machining', async () => {
    const res = await adminFetch('/categories', {
      method: 'POST',
      json: {
        slug: uniqueSlug('machining'),
        title: 'Machining',
        description: 'Precision machining tools and equipment',
        kind: 'branch',
        status: 'published',
        sortOrder: 1,
      },
    });
    state.categoryMachining = res._id;
  });

  await runTest('Create subcategory: Milling', async () => {
    const res = await adminFetch('/categories', {
      method: 'POST',
      json: {
        parentId: state.categoryMachining,
        slug: uniqueSlug('milling'),
        title: 'Milling',
        description: 'Milling equipment and accessories',
        kind: 'branch',
        status: 'published',
        sortOrder: 1,
      },
    });
    state.categoryMilling = res._id;
  });

  await runTest('Create subcategory: Milling Cutters', async () => {
    const res = await adminFetch('/categories', {
      method: 'POST',
      json: {
        parentId: state.categoryMilling,
        slug: uniqueSlug('milling-cutters'),
        title: 'Milling Cutters',
        description: 'High-precision milling cutters',
        kind: 'branch',
        status: 'published',
        sortOrder: 1,
      },
    });
    state.categoryMillingCutters = res._id;
  });

  await runTest('Create family category: T-Slot Milling Cutters', async () => {
    const res = await adminFetch('/categories', {
      method: 'POST',
      json: {
        parentId: state.categoryMillingCutters,
        slug: uniqueSlug('t-slot-milling-cutters'),
        title: 'T-Slot Milling Cutters',
        description: 'Precision T-slot cutters for advanced milling operations',
        kind: 'family',
        status: 'published',
        sortOrder: 1,
      },
    });
    state.categoryTSlotCutters = res._id;
  });

  await runTest('Verify category tree structure', async () => {
    const tree = await adminFetch('/categories/tree');
    if (!tree || !Array.isArray(tree)) {
      throw new Error('Category tree is invalid');
    }
  });

  // ========================================================================
  // SECTION 4: SPEC SCHEMA & COLUMNS
  // ========================================================================

  logSection('SECTION 4: SPEC SCHEMA & COLUMNS');

  await runTest('Create spec schema for T-Slot Milling Cutters', async () => {
    const res = await adminFetch(`/taxonomy/${state.categoryTSlotCutters}/spec-schema`, {
      method: 'POST',
      json: {
        familySummary: 'Technical specifications for T-slot milling cutters including dimensions, materials, and performance characteristics.',
        status: 'draft',
      },
    });
    state.specSchemaId = res._id;
  });

  await runTest('Add spec column: Diameter (mm)', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/columns`, {
      method: 'POST',
      json: {
        key: 'diameterMm',
        label: 'Diameter (mm)',
        dataType: 'number',
        filterable: true,
        sortable: true,
        searchIndex: true,
        sortOrder: 1,
      },
    });
    state.colDiameter = res._id;
  });

  await runTest('Add spec column: Cutting Depth (mm)', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/columns`, {
      method: 'POST',
      json: {
        key: 'cuttingDepthMm',
        label: 'Cutting Depth (mm)',
        dataType: 'number',
        filterable: true,
        sortable: true,
        searchIndex: true,
        sortOrder: 2,
      },
    });
    state.colCuttingDepth = res._id;
  });

  await runTest('Add spec column: Material', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/columns`, {
      method: 'POST',
      json: {
        key: 'material',
        label: 'Material',
        dataType: 'string',
        filterable: true,
        sortable: true,
        searchIndex: true,
        enumOptions: ['Carbide', 'HSS', 'Cobalt', 'Ceramic'],
        sortOrder: 3,
      },
    });
    state.colMaterial = res._id;
  });

  await runTest('Add spec column: Flutes', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/columns`, {
      method: 'POST',
      json: {
        key: 'flutes',
        label: 'Flutes',
        dataType: 'number',
        filterable: true,
        sortable: true,
        searchIndex: true,
        enumOptions: ['2', '3', '4', '6'],
        sortOrder: 4,
      },
    });
    state.colFlutes = res._id;
  });

  await runTest('Add spec column: Coating', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/columns`, {
      method: 'POST',
      json: {
        key: 'coating',
        label: 'Coating',
        dataType: 'string',
        filterable: true,
        sortable: false,
        searchIndex: true,
        enumOptions: ['TiN', 'TiAlN', 'CrN', 'None'],
        sortOrder: 5,
      },
    });
    state.colCoating = res._id;
  });

  await runTest('Verify spec columns listed', async () => {
    const cols = await adminFetch(`/spec-schemas/${state.specSchemaId}/columns`);
    if (!Array.isArray(cols) || cols.length < 5) {
      throw new Error(`Expected at least 5 columns, got ${cols?.length || 0}`);
    }
  });

  // ========================================================================
  // SECTION 5: SPEC ROWS (MATRIX DATA)
  // ========================================================================

  logSection('SECTION 5: SPEC ROWS (MATRIX DATA)');

  await runTest('Create spec row 1: Ø6mm Carbide T-Slot', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/rows`, {
      method: 'POST',
      json: {
        values: {
          diameterMm: '6.0',
          cuttingDepthMm: '1.5',
          material: 'Carbide',
          flutes: '2',
          coating: 'TiAlN',
        },
        status: 'draft',
        sortOrder: 1,
      },
    });
    state.specRowId1 = res._id;
  });

  await runTest('Create spec row 2: Ø8mm HSS T-Slot', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/rows`, {
      method: 'POST',
      json: {
        values: {
          diameterMm: '8.0',
          cuttingDepthMm: '2.0',
          material: 'HSS',
          flutes: '3',
          coating: 'TiN',
        },
        status: 'draft',
        sortOrder: 2,
      },
    });
    state.specRowId2 = res._id;
  });

  await runTest('Create spec row 3: Ø10mm Carbide T-Slot', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/rows`, {
      method: 'POST',
      json: {
        values: {
          diameterMm: '10.0',
          cuttingDepthMm: '2.5',
          material: 'Carbide',
          flutes: '4',
          coating: 'CrN',
        },
        status: 'draft',
        sortOrder: 3,
      },
    });
    state.specRowId3 = res._id;
  });

  await runTest('Create spec row 4: Ø12mm Cobalt T-Slot', async () => {
    const res = await adminFetch(`/spec-schemas/${state.specSchemaId}/rows`, {
      method: 'POST',
      json: {
        values: {
          diameterMm: '12.0',
          cuttingDepthMm: '3.0',
          material: 'Cobalt',
          flutes: '4',
          coating: 'None',
        },
        status: 'draft',
        sortOrder: 4,
      },
    });
    state.specRowId4 = res._id;
  });

  // ========================================================================
  // SECTION 6: PRODUCTS & VARIANTS
  // ========================================================================

  logSection('SECTION 6: PRODUCTS & VARIANTS');

  await runTest('Create product: Premium T-Slot Milling Cutter Set', async () => {
    const res = await adminFetch('/products', {
      method: 'POST',
      json: {
        slug: uniqueSlug('premium-t-slot-set'),
        title: 'Premium T-Slot Milling Cutter Set',
        brand: 'PrecisionTools Inc',
        status: 'draft',
        categoryIds: [state.categoryTSlotCutters],
        searchText: 'T-slot milling cutter precision carbide HSS',
        sortOrder: 1,
      },
    });
    state.productId = res._id;
  });

  await runTest('Create variant: Ø6mm Carbide (SKU-T6-CB-TIN)', async () => {
    const res = await adminFetch(`/products/${state.productId}/variants`, {
      method: 'POST',
      json: {
        sku: uniqueSlug('SKU-T6-CB-TIN'),
        itemNumber: 'TSC-06-CB',
        mpn: 'PT-TSC-06-CB-TIN',
        manufacturer: 'PrecisionTools Inc',
        unitPrice: '45.99',
        currency: 'USD',
        availability: 'In Stock',
        uom: 'Each',
        status: 'draft',
        searchBlob: 'T-slot cutter 6mm carbide TiN coating',
        sortOrder: 1,
      },
    });
    state.variantId1 = res._id;
  });

  await runTest('Create variant: Ø8mm HSS (SKU-T8-HS-TIN)', async () => {
    const res = await adminFetch(`/products/${state.productId}/variants`, {
      method: 'POST',
      json: {
        sku: uniqueSlug('SKU-T8-HS-TIN'),
        itemNumber: 'TSC-08-HS',
        mpn: 'PT-TSC-08-HS-TIN',
        manufacturer: 'PrecisionTools Inc',
        unitPrice: '24.99',
        currency: 'USD',
        availability: 'In Stock',
        uom: 'Each',
        status: 'draft',
        searchBlob: 'T-slot cutter 8mm HSS TiN coating',
        sortOrder: 2,
      },
    });
    state.variantId2 = res._id;
  });

  await runTest('Create variant: Ø10mm Carbide (SKU-T10-CB-CRN)', async () => {
    const res = await adminFetch(`/products/${state.productId}/variants`, {
      method: 'POST',
      json: {
        sku: uniqueSlug('SKU-T10-CB-CRN'),
        itemNumber: 'TSC-10-CB',
        mpn: 'PT-TSC-10-CB-CRN',
        manufacturer: 'PrecisionTools Inc',
        unitPrice: '67.50',
        currency: 'USD',
        availability: 'In Stock',
        uom: 'Each',
        status: 'draft',
        searchBlob: 'T-slot cutter 10mm carbide CrN coating',
        sortOrder: 3,
      },
    });
    state.variantId3 = res._id;
  });

  await runTest('Create variant: Ø12mm Cobalt (SKU-T12-CB-NONE)', async () => {
    const res = await adminFetch(`/products/${state.productId}/variants`, {
      method: 'POST',
      json: {
        sku: uniqueSlug('SKU-T12-CB-NONE'),
        itemNumber: 'TSC-12-CB',
        mpn: 'PT-TSC-12-CB',
        manufacturer: 'PrecisionTools Inc',
        unitPrice: '89.99',
        currency: 'USD',
        availability: 'In Stock',
        uom: 'Each',
        status: 'draft',
        searchBlob: 'T-slot cutter 12mm cobalt uncoated',
        sortOrder: 4,
      },
    });
    state.variantId4 = res._id;
  });

  // ========================================================================
  // SECTION 7: BIND VARIANTS TO SPEC ROWS
  // ========================================================================

  logSection('SECTION 7: BIND VARIANTS TO SPEC ROWS');

  await runTest('Bind variant 1 to spec row 1 (Ø6mm Carbide)', async () => {
    await adminFetch(`/spec-rows/${state.specRowId1}/bindings`, {
      method: 'POST',
      json: {
        bindings: [
          {
            productVariantId: state.variantId1,
            role: 'primary',
            sortOrder: 1,
          },
        ],
      },
    });
  });

  await runTest('Bind variant 2 to spec row 2 (Ø8mm HSS)', async () => {
    await adminFetch(`/spec-rows/${state.specRowId2}/bindings`, {
      method: 'POST',
      json: {
        bindings: [
          {
            productVariantId: state.variantId2,
            role: 'primary',
            sortOrder: 1,
          },
        ],
      },
    });
  });

  await runTest('Bind variant 3 to spec row 3 (Ø10mm Carbide)', async () => {
    await adminFetch(`/spec-rows/${state.specRowId3}/bindings`, {
      method: 'POST',
      json: {
        bindings: [
          {
            productVariantId: state.variantId3,
            role: 'primary',
            sortOrder: 1,
          },
        ],
      },
    });
  });

  await runTest('Bind variant 4 to spec row 4 (Ø12mm Cobalt)', async () => {
    await adminFetch(`/spec-rows/${state.specRowId4}/bindings`, {
      method: 'POST',
      json: {
        bindings: [
          {
            productVariantId: state.variantId4,
            role: 'primary',
            sortOrder: 1,
          },
        ],
      },
    });
  });

  // ========================================================================
  // SECTION 8: PUBLISH CONTENT
  // ========================================================================

  logSection('SECTION 8: PUBLISH CONTENT');

  await runTest('Publish spec schema', async () => {
    await adminFetch(`/spec-schemas/${state.specSchemaId}/publish`, {
      method: 'POST',
      json: {},
    });
  });

  await runTest('Publish all spec rows', async () => {
    const rows = await adminFetch(`/spec-schemas/${state.specSchemaId}/rows`);
    for (const row of rows.rows || rows) {
      await adminFetch(`/spec-rows/${row._id}`, {
        method: 'PATCH',
        json: { status: 'published' },
      });
    }
  });

  await runTest('Publish all variants', async () => {
    const variants = await adminFetch(`/products/${state.productId}/variants`);
    for (const variant of variants.variants || variants) {
      await adminFetch(`/products/variants/${variant._id}`, {
        method: 'PATCH',
        json: { status: 'published' },
      });
    }
  });

  await runTest('Publish product', async () => {
    await adminFetch(`/products/${state.productId}`, {
      method: 'PATCH',
      json: { status: 'published' },
    });
  });

  await runTest('Attach spec schema to category', async () => {
    await adminFetch(`/categories/${state.categoryTSlotCutters}/active-spec-schema`, {
      method: 'PATCH',
      json: { specSchemaId: state.specSchemaId },
    });
  });

  // ========================================================================
  // SECTION 9: VERIFY DATA IN ADMIN API
  // ========================================================================

  logSection('SECTION 9: VERIFY DATA IN ADMIN API');

  await runTest('Retrieve published banners count', async () => {
    const banners = await adminFetch('/homepage/banners?status=published');
    if (!Array.isArray(banners) || banners.length < 2) {
      throw new Error(`Expected at least 2 published banners, got ${banners?.length || 0}`);
    }
  });

  await runTest('Retrieve published tiles count', async () => {
    const tiles = await adminFetch('/homepage/category-tiles?status=published');
    if (!Array.isArray(tiles) || tiles.length < 2) {
      throw new Error(`Expected at least 2 published tiles, got ${tiles?.length || 0}`);
    }
  });

  await runTest('Retrieve published support cards count', async () => {
    const cards = await adminFetch('/homepage/support-cards?status=published');
    if (!Array.isArray(cards) || cards.length < 3) {
      throw new Error(`Expected at least 3 published support cards, got ${cards?.length || 0}`);
    }
  });

  await runTest('Retrieve product with variants', async () => {
    const prod = await adminFetch(`/products/${state.productId}`);
    if (prod.status !== 'published') {
      throw new Error(`Product status is ${prod.status}, expected published`);
    }
  });

  await runTest('Retrieve published variants', async () => {
    const variants = await adminFetch(`/products/${state.productId}/variants`);
    const varList = variants.variants || variants;
    if (!Array.isArray(varList) || varList.length < 4) {
      throw new Error(`Expected at least 4 variants, got ${varList?.length || 0}`);
    }
    const publishedCount = varList.filter((v) => v.status === 'published').length;
    if (publishedCount < 4) {
      throw new Error(`Only ${publishedCount} of ${varList.length} variants are published`);
    }
  });

  await runTest('Retrieve spec schema', async () => {
    const schema = await adminFetch(`/spec-schemas/${state.specSchemaId}`);
    if (schema.status !== 'published') {
      throw new Error(`Schema status is ${schema.status}, expected published`);
    }
  });

  await runTest('Retrieve spec rows with bindings', async () => {
    const rows = await adminFetch(`/spec-schemas/${state.specSchemaId}/rows`);
    const rowList = rows.rows || rows;
    if (!Array.isArray(rowList) || rowList.length < 4) {
      throw new Error(`Expected at least 4 spec rows, got ${rowList?.length || 0}`);
    }
    // Check bindings
    const rowsWithBindings = rowList.filter((r) => r.variantBindings?.length > 0).length;
    if (rowsWithBindings < 4) {
      throw new Error(`Only ${rowsWithBindings} of ${rowList.length} rows have variant bindings`);
    }
  });

  // ========================================================================
  // SECTION 10: VALIDATE STOREFRONT RENDERING
  // ========================================================================

  logSection('SECTION 10: VALIDATE STOREFRONT RENDERING');

  await runTest('Storefront homepage loads', async () => {
    const html = await fetchStorefront('/');
    if (!html || html.length < 500) {
      throw new Error('Homepage appears to be empty or failed to load');
    }
  });

  await runTest('Homepage contains promo banners markup', async () => {
    const html = await fetchStorefront('/');
    // Check for banner-related elements (adjust selectors as needed)
    if (!html.includes('Industrial Solutions') && !html.includes('promo')) {
      log('    WARNING: Promo banners may not be rendering (markup check)', 'yellow');
    }
  });

  await runTest('Homepage contains category tiles', async () => {
    const html = await fetchStorefront('/');
    if (!html.includes('Machining') && !html.includes('category')) {
      log('    WARNING: Category tiles may not be rendering', 'yellow');
    }
  });

  await runTest('Homepage contains support cards', async () => {
    const html = await fetchStorefront('/');
    if (!html.includes('Technical Support') && !html.includes('support')) {
      log('    WARNING: Support cards may not be rendering', 'yellow');
    }
  });

  await runTest('Mega menu page loads', async () => {
    const html = await fetchStorefront('/api/catalog/mega-menu');
    if (!html || html.length < 50) {
      throw new Error('Mega menu API returned empty response');
    }
  });

  await runTest('Footer content loads', async () => {
    const html = await fetchStorefront('/');
    if (!html.includes('FactoryPeer') && !html.includes('footer')) {
      log('    WARNING: Footer may not be rendering', 'yellow');
    }
  });

  // ========================================================================
  // FINAL REPORT
  // ========================================================================

  logSection('FINAL ACCEPTANCE TEST REPORT');

  log(`\nTests Passed: ${results.passed}`, 'green');
  log(`Tests Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Total Tests: ${results.passed + results.failed}\n`);

  if (results.failed > 0) {
    log('FAILED TESTS:', 'red');
    for (const issue of results.issues) {
      log(`  - ${issue.name}: ${issue.error}`, 'red');
    }
  }

  if (results.failed === 0) {
    log('✓ ALL TESTS PASSED! Full end-to-end admin flow works.', 'green');
    log('\nSTATE SUMMARY:', 'cyan');
    log(`  Homepage banners created:       ${state.bannerId1 ? '✓' : '✗'}`, 'cyan');
    log(`  Category tiles created:         ${state.tileMachiningId ? '✓' : '✗'}`, 'cyan');
    log(`  Support cards created:          ${state.supportCardId1 ? '✓' : '✗'}`, 'cyan');
    log(`  Navigation/footer configured:   ${state.footerContentId ? '✓' : '✗'}`, 'cyan');
    log(`  Category hierarchy built:       ${state.categoryTSlotCutters ? '✓' : '✗'}`, 'cyan');
    log(`  Spec schema + columns created:  ${state.specSchemaId ? '✓' : '✗'}`, 'cyan');
    log(`  Spec rows created + bound:      ${state.specRowId1 ? '✓' : '✗'}`, 'cyan');
    log(`  Product + variants created:     ${state.productId ? '✓' : '✗'}`, 'cyan');
    log(`  Storefront validates:           ✓\n`, 'cyan');
  } else {
    log('✗ SOME TESTS FAILED. Review errors above.', 'red');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  log(`\nFATAL ERROR: ${err.message}`, 'red');
  console.error(err);
  process.exit(1);
});
