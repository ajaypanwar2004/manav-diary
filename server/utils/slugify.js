function slugify(str) {
  if (!str || typeof str !== 'string') return '';
  const s = str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'category';
}

module.exports = { slugify };
