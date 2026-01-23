import { Additive, AdditiveRisk } from '@/types';

// Additive database with risk classifications
// Based on scientific studies and regulatory assessments
export const ADDITIVES: Record<string, Additive> = {
  // Safe additives (GREEN)
  E100: { code: 'E100', name: 'Curcumin', risk: 'safe', description: 'Natural yellow coloring from turmeric' },
  E101: { code: 'E101', name: 'Riboflavin', risk: 'safe', description: 'Vitamin B2' },
  E140: { code: 'E140', name: 'Chlorophylls', risk: 'safe', description: 'Natural green coloring from plants' },
  E160A: { code: 'E160A', name: 'Beta-Carotene', risk: 'safe', description: 'Vitamin A precursor, natural orange color' },
  E160C: { code: 'E160C', name: 'Paprika Extract', risk: 'safe', description: 'Natural red-orange coloring' },
  E162: { code: 'E162', name: 'Beetroot Red', risk: 'safe', description: 'Natural red coloring from beets' },
  E163: { code: 'E163', name: 'Anthocyanins', risk: 'safe', description: 'Natural purple/red coloring from berries' },
  E170: { code: 'E170', name: 'Calcium Carbonate', risk: 'safe', description: 'Chalk, used as anti-caking agent' },
  E260: { code: 'E260', name: 'Acetic Acid', risk: 'safe', description: 'Vinegar' },
  E270: { code: 'E270', name: 'Lactic Acid', risk: 'safe', description: 'Natural preservative found in dairy' },
  E290: { code: 'E290', name: 'Carbon Dioxide', risk: 'safe', description: 'Carbonation gas' },
  E296: { code: 'E296', name: 'Malic Acid', risk: 'safe', description: 'Natural acid found in apples' },
  E300: { code: 'E300', name: 'Ascorbic Acid', risk: 'safe', description: 'Vitamin C' },
  E301: { code: 'E301', name: 'Sodium Ascorbate', risk: 'safe', description: 'Vitamin C salt' },
  E302: { code: 'E302', name: 'Calcium Ascorbate', risk: 'safe', description: 'Vitamin C salt' },
  E304: { code: 'E304', name: 'Ascorbyl Palmitate', risk: 'safe', description: 'Vitamin C derivative' },
  E306: { code: 'E306', name: 'Tocopherols', risk: 'safe', description: 'Vitamin E' },
  E307: { code: 'E307', name: 'Alpha-Tocopherol', risk: 'safe', description: 'Vitamin E' },
  E308: { code: 'E308', name: 'Gamma-Tocopherol', risk: 'safe', description: 'Vitamin E' },
  E309: { code: 'E309', name: 'Delta-Tocopherol', risk: 'safe', description: 'Vitamin E' },
  E322: { code: 'E322', name: 'Lecithins', risk: 'safe', description: 'Natural emulsifier from soy/eggs' },
  E325: { code: 'E325', name: 'Sodium Lactate', risk: 'safe', description: 'Salt of lactic acid' },
  E326: { code: 'E326', name: 'Potassium Lactate', risk: 'safe', description: 'Salt of lactic acid' },
  E327: { code: 'E327', name: 'Calcium Lactate', risk: 'safe', description: 'Calcium supplement' },
  E330: { code: 'E330', name: 'Citric Acid', risk: 'safe', description: 'Natural acid found in citrus fruits' },
  E331: { code: 'E331', name: 'Sodium Citrates', risk: 'safe', description: 'Salt of citric acid' },
  E332: { code: 'E332', name: 'Potassium Citrates', risk: 'safe', description: 'Salt of citric acid' },
  E333: { code: 'E333', name: 'Calcium Citrates', risk: 'safe', description: 'Calcium supplement' },
  E334: { code: 'E334', name: 'Tartaric Acid', risk: 'safe', description: 'Natural acid from grapes' },
  E335: { code: 'E335', name: 'Sodium Tartrates', risk: 'safe', description: 'Salt of tartaric acid' },
  E336: { code: 'E336', name: 'Potassium Tartrate', risk: 'safe', description: 'Cream of tartar' },
  E338: { code: 'E338', name: 'Phosphoric Acid', risk: 'moderate', description: 'Acidifier used in soft drinks', concerns: ['May affect bone mineral density', 'Marker of ultra-processed beverages'] },
  E375: { code: 'E375', name: 'Nicotinic Acid', risk: 'safe', description: 'Vitamin B3 (Niacin)' },
  E392: { code: 'E392', name: 'Rosemary Extract', risk: 'safe', description: 'Natural antioxidant' },
  E400: { code: 'E400', name: 'Alginic Acid', risk: 'safe', description: 'Natural thickener from seaweed' },
  E401: { code: 'E401', name: 'Sodium Alginate', risk: 'safe', description: 'Natural thickener from seaweed' },
  E406: { code: 'E406', name: 'Agar', risk: 'safe', description: 'Natural gelling agent from seaweed' },
  E410: { code: 'E410', name: 'Locust Bean Gum', risk: 'safe', description: 'Natural thickener from carob seeds' },
  E414: { code: 'E414', name: 'Gum Arabic', risk: 'safe', description: 'Natural gum from acacia trees' },
  E440: { code: 'E440', name: 'Pectin', risk: 'safe', description: 'Natural gelling agent from fruit' },
  E500: { code: 'E500', name: 'Sodium Carbonates', risk: 'safe', description: 'Baking soda' },
  E501: { code: 'E501', name: 'Potassium Carbonates', risk: 'safe', description: 'Raising agent' },
  E503: { code: 'E503', name: 'Ammonium Carbonates', risk: 'safe', description: 'Raising agent' },
  E504: { code: 'E504', name: 'Magnesium Carbonates', risk: 'safe', description: 'Anti-caking agent' },
  E508: { code: 'E508', name: 'Potassium Chloride', risk: 'safe', description: 'Salt substitute' },
  E509: { code: 'E509', name: 'Calcium Chloride', risk: 'safe', description: 'Firming agent' },
  E516: { code: 'E516', name: 'Calcium Sulfate', risk: 'safe', description: 'Firming agent, tofu coagulant' },
  E524: { code: 'E524', name: 'Sodium Hydroxide', risk: 'safe', description: 'Acidity regulator' },
  E551: { code: 'E551', name: 'Silicon Dioxide', risk: 'safe', description: 'Anti-caking agent' },
  E901: { code: 'E901', name: 'Beeswax', risk: 'safe', description: 'Natural glazing agent' },
  E903: { code: 'E903', name: 'Carnauba Wax', risk: 'safe', description: 'Natural glazing agent' },
  E920: { code: 'E920', name: 'L-Cysteine', risk: 'safe', description: 'Amino acid, dough conditioner' },

  // Moderate risk additives (YELLOW)
  E102: { code: 'E102', name: 'Tartrazine', risk: 'moderate', description: 'Yellow coloring', concerns: ['May cause hyperactivity in children'] },
  E104: { code: 'E104', name: 'Quinoline Yellow', risk: 'moderate', description: 'Yellow coloring', concerns: ['May cause hyperactivity in children'] },
  E110: { code: 'E110', name: 'Sunset Yellow', risk: 'moderate', description: 'Orange coloring', concerns: ['May cause hyperactivity in children'] },
  E120: { code: 'E120', name: 'Cochineal', risk: 'moderate', description: 'Red coloring from insects', concerns: ['Allergic reactions possible'] },
  E122: { code: 'E122', name: 'Carmoisine', risk: 'moderate', description: 'Red coloring', concerns: ['May cause hyperactivity in children'] },
  E124: { code: 'E124', name: 'Ponceau 4R', risk: 'moderate', description: 'Red coloring', concerns: ['May cause hyperactivity in children'] },
  E129: { code: 'E129', name: 'Allura Red', risk: 'moderate', description: 'Red coloring', concerns: ['May cause hyperactivity in children'] },
  E131: { code: 'E131', name: 'Patent Blue V', risk: 'moderate', description: 'Blue coloring', concerns: ['Allergic reactions possible'] },
  E132: { code: 'E132', name: 'Indigo Carmine', risk: 'moderate', description: 'Blue coloring', concerns: ['May cause nausea'] },
  E133: { code: 'E133', name: 'Brilliant Blue', risk: 'moderate', description: 'Blue coloring', concerns: ['May cause hyperactivity'] },
  E150A: { code: 'E150A', name: 'Plain Caramel', risk: 'moderate', description: 'Brown coloring', concerns: ['Processed sugar derivative'] },
  E150B: { code: 'E150B', name: 'Caustic Sulfite Caramel', risk: 'moderate', description: 'Brown coloring', concerns: ['Contains sulfites'] },
  E150C: { code: 'E150C', name: 'Ammonia Caramel', risk: 'moderate', description: 'Brown coloring', concerns: ['Contains 4-MEI'] },
  E150D: { code: 'E150D', name: 'Sulfite Ammonia Caramel', risk: 'moderate', description: 'Brown coloring', concerns: ['Contains 4-MEI', 'Contains sulfites'] },
  E200: { code: 'E200', name: 'Sorbic Acid', risk: 'moderate', description: 'Preservative', concerns: ['May cause skin irritation'] },
  E202: { code: 'E202', name: 'Potassium Sorbate', risk: 'moderate', description: 'Preservative', concerns: ['Generally considered safe'] },
  E210: { code: 'E210', name: 'Benzoic Acid', risk: 'moderate', description: 'Preservative', concerns: ['May cause hyperactivity when combined with colorings'] },
  E211: { code: 'E211', name: 'Sodium Benzoate', risk: 'moderate', description: 'Preservative', concerns: ['May form benzene with vitamin C'] },
  E212: { code: 'E212', name: 'Potassium Benzoate', risk: 'moderate', description: 'Preservative', concerns: ['May form benzene with vitamin C'] },
  E220: { code: 'E220', name: 'Sulfur Dioxide', risk: 'moderate', description: 'Preservative', concerns: ['May trigger asthma'] },
  E221: { code: 'E221', name: 'Sodium Sulfite', risk: 'moderate', description: 'Preservative', concerns: ['May trigger asthma'] },
  E223: { code: 'E223', name: 'Sodium Metabisulfite', risk: 'moderate', description: 'Preservative', concerns: ['May trigger asthma'] },
  E224: { code: 'E224', name: 'Potassium Metabisulfite', risk: 'moderate', description: 'Preservative', concerns: ['May trigger asthma'] },
  E234: { code: 'E234', name: 'Nisin', risk: 'moderate', description: 'Preservative', concerns: ['Antibiotic'] },
  E280: { code: 'E280', name: 'Propionic Acid', risk: 'moderate', description: 'Preservative', concerns: ['May cause migraines'] },
  E281: { code: 'E281', name: 'Sodium Propionate', risk: 'moderate', description: 'Preservative', concerns: ['May cause migraines'] },
  E282: { code: 'E282', name: 'Calcium Propionate', risk: 'moderate', description: 'Preservative', concerns: ['May cause migraines', 'Behavioral effects'] },
  E320: { code: 'E320', name: 'BHA', risk: 'moderate', description: 'Antioxidant', concerns: ['Possible carcinogen'] },
  E321: { code: 'E321', name: 'BHT', risk: 'moderate', description: 'Antioxidant', concerns: ['Possible hormone disruptor'] },
  E407: { code: 'E407', name: 'Carrageenan', risk: 'moderate', description: 'Thickener from seaweed', concerns: ['May cause digestive issues'] },
  E412: { code: 'E412', name: 'Guar Gum', risk: 'moderate', description: 'Thickener', concerns: ['May cause digestive issues in large amounts'] },
  E415: { code: 'E415', name: 'Xanthan Gum', risk: 'moderate', description: 'Thickener', concerns: ['May cause bloating'] },
  E433: { code: 'E433', name: 'Polysorbate 80', risk: 'moderate', description: 'Emulsifier', concerns: ['May affect gut bacteria'] },
  E450: { code: 'E450', name: 'Diphosphates', risk: 'moderate', description: 'Raising agent', concerns: ['High phosphate intake concerns'] },
  E451: { code: 'E451', name: 'Triphosphates', risk: 'moderate', description: 'Stabilizer', concerns: ['High phosphate intake concerns'] },
  E452: { code: 'E452', name: 'Polyphosphates', risk: 'moderate', description: 'Stabilizer', concerns: ['High phosphate intake concerns'] },
  E460: { code: 'E460', name: 'Cellulose', risk: 'moderate', description: 'Bulking agent', concerns: ['May cause digestive issues'] },
  E461: { code: 'E461', name: 'Methyl Cellulose', risk: 'moderate', description: 'Thickener', concerns: ['May cause digestive issues'] },
  E466: { code: 'E466', name: 'Carboxymethyl Cellulose', risk: 'moderate', description: 'Thickener', concerns: ['May affect gut bacteria'] },
  E471: { code: 'E471', name: 'Mono- and Diglycerides', risk: 'moderate', description: 'Emulsifier', concerns: ['May contain trans fats'] },
  E472E: { code: 'E472E', name: 'DATEM', risk: 'moderate', description: 'Emulsifier', concerns: ['Highly processed'] },
  E481: { code: 'E481', name: 'Sodium Stearoyl Lactylate', risk: 'moderate', description: 'Emulsifier', concerns: ['Highly processed'] },
  E491: { code: 'E491', name: 'Sorbitan Monostearate', risk: 'moderate', description: 'Emulsifier', concerns: ['May affect gut bacteria'] },
  E621: { code: 'E621', name: 'Monosodium Glutamate', risk: 'moderate', description: 'Flavor enhancer', concerns: ['May cause headaches in sensitive individuals'] },
  E627: { code: 'E627', name: 'Disodium Guanylate', risk: 'moderate', description: 'Flavor enhancer', concerns: ['Should be avoided by gout sufferers'] },
  E631: { code: 'E631', name: 'Disodium Inosinate', risk: 'moderate', description: 'Flavor enhancer', concerns: ['Should be avoided by gout sufferers'] },
  E635: { code: 'E635', name: 'Disodium Ribonucleotides', risk: 'moderate', description: 'Flavor enhancer', concerns: ['Should be avoided by gout sufferers'] },

  // High risk additives (RED - AVOID)
  E102_HIGH: { code: 'E102', name: 'Tartrazine', risk: 'avoid', description: 'Yellow coloring', concerns: ['Hyperactivity', 'Allergies', 'Banned in some countries'] },
  E123: { code: 'E123', name: 'Amaranth', risk: 'avoid', description: 'Red coloring', concerns: ['Banned in USA', 'Possible carcinogen'] },
  E127: { code: 'E127', name: 'Erythrosine', risk: 'avoid', description: 'Red coloring', concerns: ['May affect thyroid', 'Possible carcinogen'] },
  E128: { code: 'E128', name: 'Red 2G', risk: 'avoid', description: 'Red coloring', concerns: ['Banned in many countries'] },
  E142: { code: 'E142', name: 'Green S', risk: 'avoid', description: 'Green coloring', concerns: ['Allergic reactions', 'Banned in some countries'] },
  E151: { code: 'E151', name: 'Brilliant Black BN', risk: 'avoid', description: 'Black coloring', concerns: ['May cause hyperactivity'] },
  E154: { code: 'E154', name: 'Brown FK', risk: 'avoid', description: 'Brown coloring', concerns: ['Banned in many countries'] },
  E155: { code: 'E155', name: 'Brown HT', risk: 'avoid', description: 'Brown coloring', concerns: ['May cause hyperactivity'] },
  E173: { code: 'E173', name: 'Aluminium', risk: 'avoid', description: 'Silver coloring', concerns: ['Neurotoxicity concerns'] },
  E180: { code: 'E180', name: 'Litholrubine BK', risk: 'avoid', description: 'Red coloring', concerns: ['Possible carcinogen'] },
  E239: { code: 'E239', name: 'Hexamethylenetetramine', risk: 'avoid', description: 'Preservative', concerns: ['Possible carcinogen'] },
  E249: { code: 'E249', name: 'Potassium Nitrite', risk: 'avoid', description: 'Preservative', concerns: ['Forms nitrosamines', 'Possible carcinogen'] },
  E250: { code: 'E250', name: 'Sodium Nitrite', risk: 'avoid', description: 'Preservative', concerns: ['Forms nitrosamines', 'Possible carcinogen'] },
  E251: { code: 'E251', name: 'Sodium Nitrate', risk: 'avoid', description: 'Preservative', concerns: ['Converts to nitrite', 'Possible carcinogen'] },
  E252: { code: 'E252', name: 'Potassium Nitrate', risk: 'avoid', description: 'Preservative', concerns: ['Converts to nitrite', 'Possible carcinogen'] },
  E284: { code: 'E284', name: 'Boric Acid', risk: 'avoid', description: 'Preservative', concerns: ['Toxic in large amounts'] },
  E285: { code: 'E285', name: 'Sodium Tetraborate', risk: 'avoid', description: 'Preservative', concerns: ['Toxic'] },
  E385: { code: 'E385', name: 'EDTA', risk: 'avoid', description: 'Sequestrant', concerns: ['May affect mineral absorption'] },
  E512: { code: 'E512', name: 'Stannous Chloride', risk: 'avoid', description: 'Antioxidant', concerns: ['May cause nausea'] },
  E620: { code: 'E620', name: 'Glutamic Acid', risk: 'avoid', description: 'Flavor enhancer', concerns: ['MSG family', 'Headaches'] },
  E622: { code: 'E622', name: 'Monopotassium Glutamate', risk: 'avoid', description: 'Flavor enhancer', concerns: ['MSG family'] },
  E623: { code: 'E623', name: 'Calcium Glutamate', risk: 'avoid', description: 'Flavor enhancer', concerns: ['MSG family'] },
  E624: { code: 'E624', name: 'Monoammonium Glutamate', risk: 'avoid', description: 'Flavor enhancer', concerns: ['MSG family'] },
  E625: { code: 'E625', name: 'Magnesium Glutamate', risk: 'avoid', description: 'Flavor enhancer', concerns: ['MSG family'] },
  E900: { code: 'E900', name: 'Dimethyl Polysiloxane', risk: 'avoid', description: 'Anti-foaming agent', concerns: ['Industrial additive'] },
  E905: { code: 'E905', name: 'Microcrystalline Wax', risk: 'avoid', description: 'Glazing agent', concerns: ['Petroleum derivative'] },
  E907: { code: 'E907', name: 'Hydrogenated Poly-1-Decene', risk: 'avoid', description: 'Glazing agent', concerns: ['Petroleum derivative'] },
  E950: { code: 'E950', name: 'Acesulfame K', risk: 'avoid', description: 'Artificial sweetener', concerns: ['Possible carcinogen', 'Metabolic effects'] },
  E951: { code: 'E951', name: 'Aspartame', risk: 'avoid', description: 'Artificial sweetener', concerns: ['Headaches', 'Neurological concerns'] },
  E952: { code: 'E952', name: 'Cyclamate', risk: 'avoid', description: 'Artificial sweetener', concerns: ['Banned in USA', 'Possible carcinogen'] },
  E954: { code: 'E954', name: 'Saccharin', risk: 'avoid', description: 'Artificial sweetener', concerns: ['Possible carcinogen'] },
  E955: { code: 'E955', name: 'Sucralose', risk: 'avoid', description: 'Artificial sweetener', concerns: ['May affect gut bacteria'] },
  E962: { code: 'E962', name: 'Aspartame-Acesulfame Salt', risk: 'avoid', description: 'Artificial sweetener', concerns: ['Combined artificial sweeteners'] },
  E999: { code: 'E999', name: 'Quillaia Extract', risk: 'avoid', description: 'Foaming agent', concerns: ['May cause nausea'] },
};

export function getAdditive(code: string): Additive | null {
  // Normalize the code (E300, e300, E-300 -> E300)
  const normalizedCode = code.toUpperCase().replace('-', '').replace(/\s/g, '');
  return ADDITIVES[normalizedCode] || null;
}

export function classifyAdditive(code: string): AdditiveRisk {
  const additive = getAdditive(code);
  return additive?.risk || 'moderate'; // Default to moderate if unknown
}

export function getAdditivesByRisk(risk: AdditiveRisk): Additive[] {
  return Object.values(ADDITIVES).filter((a) => a.risk === risk);
}

export function analyzeAdditives(additives: string[]): {
  safe: Additive[];
  moderate: Additive[];
  avoid: Additive[];
  unknown: string[];
} {
  const result = {
    safe: [] as Additive[],
    moderate: [] as Additive[],
    avoid: [] as Additive[],
    unknown: [] as string[],
  };

  for (const code of additives) {
    const additive = getAdditive(code);
    if (additive) {
      result[additive.risk].push(additive);
    } else {
      result.unknown.push(code);
    }
  }

  return result;
}
