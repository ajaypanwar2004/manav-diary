const mongoose = require('mongoose');

const DEFAULT_LINES = [
  'Udas nazro me khawab milenge',
  'Kabhi kante to kabhi gulab milenge',
  'Meri dil ki kitab ko meri nazro se padhke to dekho',
  'Kahi aapki yaden to kahi sirf aap milenge',
];

const homeHeroSchema = new mongoose.Schema({
  lines: {
    type: [String],
    default: () => [...DEFAULT_LINES],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

homeHeroSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

homeHeroSchema.statics.getDocument = async function getDocument() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({ lines: [...DEFAULT_LINES] });
  }
  return doc;
};

homeHeroSchema.statics.defaultLines = DEFAULT_LINES;

module.exports = mongoose.model('HomeHero', homeHeroSchema);
