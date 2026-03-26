const Category = require('../models/Category');

async function categorySlugExists(slug) {
  if (!slug || typeof slug !== 'string') return false;
  const normalized = slug.trim().toLowerCase();
  const cat = await Category.findOne({ slug: normalized });
  return !!cat;
}

module.exports = { categorySlugExists };
