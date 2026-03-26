const mongoose = require('mongoose');
const { slugify } = require('../utils/slugify');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

categorySchema.pre('validate', async function (next) {
  if (this.isModified('name') && (!this.slug || this.isNew)) {
    let base = slugify(this.name);
    let candidate = base;
    let n = 0;
    const Category = this.constructor;
    while (await Category.findOne({ slug: candidate, _id: { $ne: this._id } })) {
      n += 1;
      candidate = `${base}-${n}`;
    }
    this.slug = candidate;
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
