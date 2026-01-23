import { AdditiveExplanation } from '@/types';

/**
 * Avoid (High Risk) Additives Explanations (Feature 1)
 *
 * Comprehensive explanations for additives that should be avoided.
 * These have documented safety concerns, are banned in some countries,
 * or have significant scientific evidence of potential harm.
 */
export const AVOID_ADDITIVE_EXPLANATIONS: Record<string, AdditiveExplanation> = {
  E123: {
    code: 'E123',
    name: 'Amaranth',
    commonName: 'Red No. 2',
    risk: 'avoid',
    function: 'A dark red synthetic dye formerly used widely in foods.',
    whyThisRating:
      'Amaranth has been banned in the United States since 1976 due to concerns about carcinogenicity. Studies showed it caused tumors in rats. Given safer alternatives exist, there is no reason to consume products containing this dye.',
    foundIn: ['Some imported candies', 'Caviar', 'Certain alcoholic beverages'],
    sources: [
      { name: 'FDA Ban on Amaranth (1976)' },
      { name: 'IARC Monographs on Amaranth' },
    ],
    notes: 'Banned in USA, Austria, and Norway. Still allowed in UK and some EU countries.',
  },

  E127: {
    code: 'E127',
    name: 'Erythrosine',
    commonName: 'Red No. 3',
    risk: 'avoid',
    function: 'A cherry-pink synthetic dye used in candy and baked goods.',
    whyThisRating:
      'Erythrosine caused thyroid tumors in rats, leading to a partial ban in the USA for cosmetics. It may affect thyroid function. California has moved to ban it effective 2027.',
    foundIn: ['Candied cherries', 'Canned fruit', 'Cake decorations', 'Popsicles'],
    sources: [
      { name: 'FDA Provisional Listing of Color Additives' },
      { name: 'California AB 418 (2023)' },
      { name: 'EFSA Scientific Opinion on Erythrosine' },
    ],
    notes: 'California ban takes effect January 2027.',
  },

  E128: {
    code: 'E128',
    name: 'Red 2G',
    risk: 'avoid',
    function: 'A synthetic red dye formerly used in sausages and burgers.',
    whyThisRating:
      'Red 2G was banned in the EU in 2007 after studies showed it converts to a known carcinogen (aniline) in the body. It was already banned in many countries including USA, Canada, and Japan.',
    foundIn: ['Now banned from most foods globally'],
    sources: [
      { name: 'EU Commission Regulation 884/2007' },
      { name: 'EFSA Scientific Opinion on Red 2G' },
    ],
    notes: 'Banned in EU, USA, Canada, Japan, Australia, and many other countries.',
  },

  E142: {
    code: 'E142',
    name: 'Green S',
    commonName: 'Lissamine Green',
    risk: 'avoid',
    function: 'A synthetic green dye used in mint sauces and confectionery.',
    whyThisRating:
      'Green S can cause allergic reactions and is banned in the USA, Canada, Japan, and Norway. Some studies raise concerns about potential carcinogenicity. Natural green alternatives exist.',
    foundIn: ['Mint sauce', 'Candy', 'Ice cream', 'Canned peas'],
    sources: [{ name: 'EFSA Scientific Opinion on Green S' }],
    notes: 'Banned in USA, Canada, Japan, and Norway.',
  },

  E151: {
    code: 'E151',
    name: 'Brilliant Black BN',
    commonName: 'Black PN',
    risk: 'avoid',
    function: 'A synthetic black dye used in confectionery and sauces.',
    whyThisRating:
      'Brilliant Black has been linked to hyperactivity and allergic reactions. It is banned in USA, Canada, and several other countries. No essential function in food - purely cosmetic.',
    foundIn: ['Licorice', 'Candy', 'Sauces', 'Fish roe substitute'],
    sources: [{ name: 'EFSA Scientific Opinion on Brilliant Black' }],
    notes: 'Banned in USA, Canada, Finland, and several other countries.',
  },

  E154: {
    code: 'E154',
    name: 'Brown FK',
    risk: 'avoid',
    function: 'A synthetic brown dye used on kippers and smoked fish.',
    whyThisRating:
      'Brown FK is banned in most countries including the USA and EU due to safety concerns. It may cause allergic reactions and has limited safety data. Only still permitted in UK for kippers.',
    foundIn: ['Smoked fish (kippers) in UK only'],
    sources: [{ name: 'UK FSA Information on Brown FK' }],
    notes: 'Only permitted in UK for kippers. Banned elsewhere.',
  },

  E155: {
    code: 'E155',
    name: 'Brown HT',
    commonName: 'Chocolate Brown HT',
    risk: 'avoid',
    function: 'A synthetic brown dye used in chocolate-flavored products.',
    whyThisRating:
      'Brown HT may cause hyperactivity and allergic reactions. It is banned in USA, Austria, Belgium, and several other countries. Linked to aspirin sensitivity.',
    foundIn: ['Chocolate products', 'Bakery products', 'Ice cream'],
    sources: [{ name: 'EFSA Scientific Opinion on Brown HT' }],
    notes: 'Banned in USA, Austria, Belgium, Denmark, France, Germany, and others.',
  },

  E173: {
    code: 'E173',
    name: 'Aluminium',
    risk: 'avoid',
    function: 'A metallic silver coloring used on cake decorations.',
    whyThisRating:
      'Aluminium accumulates in the body and has been linked to neurological effects, including potential connections to Alzheimer\'s disease. WHO recommends limiting intake. It provides no nutritional value.',
    foundIn: ['Cake decorations', 'Dragees', 'Sugar-coated confections'],
    sources: [
      { name: 'WHO Guidelines on Aluminium in Food' },
      { name: 'EFSA Opinion on Aluminium' },
    ],
  },

  E180: {
    code: 'E180',
    name: 'Litholrubine BK',
    commonName: 'Rubine BK',
    risk: 'avoid',
    function: 'A synthetic red dye used on cheese rinds.',
    whyThisRating:
      'Litholrubine BK is only permitted on inedible cheese rinds but safety concerns have led many countries to ban it. It may be carcinogenic and can transfer to the cheese.',
    foundIn: ['Cheese rinds (decorative only)'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Limited to inedible cheese rinds where permitted.',
  },

  E239: {
    code: 'E239',
    name: 'Hexamethylenetetramine',
    commonName: 'Hexamine',
    risk: 'avoid',
    function: 'A preservative used in some European cheeses.',
    whyThisRating:
      'Hexamethylenetetramine releases formaldehyde, a known carcinogen. It is banned in most countries including the USA and Australia. Limited to specific cheeses (Provolone) in the EU.',
    foundIn: ['Provolone cheese (Italy)'],
    sources: [
      { name: 'IARC Monographs on Formaldehyde' },
      { name: 'EFSA Scientific Opinion on Hexamethylenetetramine' },
    ],
    notes: 'Releases formaldehyde. Banned in USA, Australia, and many others.',
  },

  E249: {
    code: 'E249',
    name: 'Potassium Nitrite',
    risk: 'avoid',
    function: 'A preservative and color fixative in cured meats.',
    whyThisRating:
      'Nitrites form nitrosamines, which are known carcinogens. WHO classifies processed meats containing nitrites as carcinogenic. Increases risk of colorectal cancer with regular consumption.',
    foundIn: ['Cured meats', 'Ham', 'Bacon', 'Hot dogs', 'Salami'],
    sources: [
      {
        name: 'WHO/IARC Monograph on Processed Meat',
        url: 'https://www.iarc.who.int/news-events/iarc-monographs-evaluate-consumption-of-red-meat-and-processed-meat/',
      },
      { name: 'American Cancer Society Guidelines' },
    ],
    notes: 'Serves important safety function against botulism, but consumption should be limited.',
  },

  E250: {
    code: 'E250',
    name: 'Sodium Nitrite',
    risk: 'avoid',
    function:
      'A preservative that prevents bacterial growth and gives cured meats their pink color.',
    whyThisRating:
      'Sodium nitrite can form nitrosamines when heated or combined with stomach acid. Nitrosamines are known carcinogens. WHO classifies processed meats as carcinogenic to humans.',
    foundIn: ['Bacon', 'Hot dogs', 'Ham', 'Deli meats', 'Sausages'],
    sources: [
      {
        name: 'WHO/IARC Monograph on Processed Meat',
        url: 'https://www.iarc.who.int/news-events/iarc-monographs-evaluate-consumption-of-red-meat-and-processed-meat/',
      },
      { name: 'American Cancer Society Guidelines' },
    ],
    notes: 'Look for "uncured" alternatives, though these may use celery powder (a natural nitrate source).',
  },

  E251: {
    code: 'E251',
    name: 'Sodium Nitrate',
    risk: 'avoid',
    function: 'A preservative that converts to nitrite in the body.',
    whyThisRating:
      'Sodium nitrate converts to nitrite, which then forms carcinogenic nitrosamines. Contributes to the same cancer risk as nitrite-cured meats.',
    foundIn: ['Cured meats', 'Ham', 'Salami', 'Some cheeses'],
    sources: [
      { name: 'WHO/IARC Monograph on Processed Meat' },
      { name: 'EFSA Panel on Food Additives' },
    ],
  },

  E252: {
    code: 'E252',
    name: 'Potassium Nitrate',
    commonName: 'Saltpeter',
    risk: 'avoid',
    function: 'A traditional curing agent that converts to nitrite.',
    whyThisRating:
      'Like sodium nitrate, potassium nitrate converts to nitrite and eventually forms carcinogenic nitrosamines. Historically used in meat curing for centuries.',
    foundIn: ['Corned beef', 'Some cured meats', 'Traditional sausages'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'WHO Cancer Reports' }],
  },

  E284: {
    code: 'E284',
    name: 'Boric Acid',
    risk: 'avoid',
    function: 'A preservative with antimicrobial properties.',
    whyThisRating:
      'Boric acid is toxic in large amounts and can accumulate in the body. It is banned in most countries for food use. May cause reproductive toxicity and affect the nervous system.',
    foundIn: ['Some caviar (where still permitted)'],
    sources: [
      { name: 'EFSA Scientific Opinion on Boric Acid' },
      { name: 'WHO Guidelines on Boron in Food' },
    ],
    notes: 'Banned in most countries including USA, EU (except caviar), and Canada.',
  },

  E285: {
    code: 'E285',
    name: 'Sodium Tetraborate',
    commonName: 'Borax',
    risk: 'avoid',
    function: 'A preservative occasionally used in some Asian foods.',
    whyThisRating:
      'Borax is toxic and banned for food use in most Western countries. It can cause gastrointestinal irritation and reproductive effects. Sometimes illegally used in Asian cuisines.',
    foundIn: ['Some Asian rice products', 'Certain noodles (illegally)'],
    sources: [
      { name: 'FDA Import Alert on Borax' },
      { name: 'EFSA Scientific Opinion on Boric Acid and Borates' },
    ],
    notes: 'Banned in USA, EU, and most Western countries. Illegal in most foods.',
  },

  E385: {
    code: 'E385',
    name: 'EDTA',
    commonName: 'Calcium Disodium EDTA',
    risk: 'avoid',
    function: 'A sequestrant that binds metal ions to prevent oxidation.',
    whyThisRating:
      'EDTA may interfere with the absorption of essential minerals including iron, zinc, and calcium. It is a synthetic chemical used in industrial applications. Some concerns about long-term exposure.',
    foundIn: ['Canned beans', 'Mayonnaise', 'Salad dressings', 'Soft drinks'],
    sources: [{ name: 'EFSA Scientific Opinion on EDTA' }, { name: 'FDA CFR 172.120' }],
    notes: 'Can chelate essential minerals from your body.',
  },

  E512: {
    code: 'E512',
    name: 'Stannous Chloride',
    commonName: 'Tin Chloride',
    risk: 'avoid',
    function: 'An antioxidant used in canned foods.',
    whyThisRating:
      'Stannous chloride can cause nausea and vomiting in some people. Tin compounds can accumulate in the body. While approved, it has more concerns than alternative antioxidants.',
    foundIn: ['Canned asparagus', 'Canned foods', 'Some soft drinks'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'WHO JECFA Evaluations' }],
  },

  E620: {
    code: 'E620',
    name: 'Glutamic Acid',
    risk: 'avoid',
    function: 'The base form of MSG, used as a flavor enhancer.',
    whyThisRating:
      'Glutamic acid is the precursor to MSG and has similar effects. May cause reactions in MSG-sensitive individuals. Often indicates highly processed foods with artificial flavor enhancement.',
    foundIn: ['Savory snacks', 'Processed foods', 'Seasonings'],
    sources: [{ name: 'EFSA Re-evaluation of Glutamic Acid' }],
    notes: 'Essentially the same as MSG for sensitivity purposes.',
  },

  E622: {
    code: 'E622',
    name: 'Monopotassium Glutamate',
    risk: 'avoid',
    function: 'The potassium salt of glutamic acid, used as a flavor enhancer.',
    whyThisRating:
      'Part of the MSG family of flavor enhancers. May cause reactions in people sensitive to glutamates. Indicates highly processed foods.',
    foundIn: ['Low-sodium processed foods', 'Seasonings', 'Snacks'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Part of the glutamate/MSG family.',
  },

  E623: {
    code: 'E623',
    name: 'Calcium Glutamate',
    risk: 'avoid',
    function: 'The calcium salt of glutamic acid, used as a flavor enhancer.',
    whyThisRating:
      'Another member of the MSG family. Same potential for reactions in sensitive individuals. Provides calcium but better sources exist.',
    foundIn: ['Processed foods', 'Seasonings', 'Canned soups'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Part of the glutamate/MSG family.',
  },

  E624: {
    code: 'E624',
    name: 'Monoammonium Glutamate',
    risk: 'avoid',
    function: 'The ammonium salt of glutamic acid.',
    whyThisRating:
      'Part of the MSG family with the same potential concerns. Less commonly used than monosodium glutamate but has similar effects.',
    foundIn: ['Processed foods', 'Some seasonings'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Part of the glutamate/MSG family.',
  },

  E625: {
    code: 'E625',
    name: 'Magnesium Glutamate',
    risk: 'avoid',
    function: 'The magnesium salt of glutamic acid.',
    whyThisRating:
      'Another MSG family member. May trigger reactions in MSG-sensitive people. Provides magnesium but in trivial amounts compared to better sources.',
    foundIn: ['Processed foods', 'Seasonings'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Part of the glutamate/MSG family.',
  },

  E900: {
    code: 'E900',
    name: 'Dimethyl Polysiloxane',
    risk: 'avoid',
    function: 'An anti-foaming agent that prevents oil from splattering.',
    whyThisRating:
      'This is an industrial silicone-based additive also used in cosmetics, lubricants, and building materials. Its presence indicates highly processed, industrial food production methods.',
    foundIn: ['French fries (fast food)', 'Fried chicken', 'Cooking oils', 'Fountain drinks'],
    sources: [{ name: 'FDA Food Additive Status' }, { name: 'EFSA Scientific Opinion' }],
    notes: 'Common in fast-food fryers. Home-cooked foods do not require this.',
  },

  E905: {
    code: 'E905',
    name: 'Microcrystalline Wax',
    risk: 'avoid',
    function: 'A glazing agent derived from petroleum.',
    whyThisRating:
      'Microcrystalline wax is a petroleum byproduct. While approved for limited food use, many prefer to avoid petroleum derivatives in food. It has no nutritional value.',
    foundIn: ['Chewing gum', 'Candy coating', 'Fruit coating'],
    sources: [{ name: 'EFSA Scientific Opinion on Microcrystalline Wax' }],
    notes: 'Petroleum derivative.',
  },

  E907: {
    code: 'E907',
    name: 'Hydrogenated Poly-1-Decene',
    risk: 'avoid',
    function: 'A glazing agent derived from petroleum.',
    whyThisRating:
      'Another petroleum-derived wax with no nutritional value. Used purely for appearance. Many consumers prefer to avoid petroleum products in food.',
    foundIn: ['Candy', 'Dried fruits', 'Citrus fruit coating'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Petroleum derivative.',
  },

  E950: {
    code: 'E950',
    name: 'Acesulfame Potassium',
    commonName: 'Acesulfame K, Ace-K',
    risk: 'avoid',
    function: 'An artificial sweetener often combined with other sweeteners.',
    whyThisRating:
      'Animal studies have raised concerns about potential carcinogenic effects. Some research suggests effects on prenatal development and gut bacteria. The original approval process has been criticized as inadequate.',
    foundIn: ['Diet sodas', 'Protein shakes', 'Chewing gum', 'Frozen desserts', 'Tabletop sweeteners'],
    sources: [
      { name: 'Center for Science in the Public Interest Review' },
      { name: 'EFSA Opinion on Acesulfame K' },
    ],
  },

  E951: {
    code: 'E951',
    name: 'Aspartame',
    commonName: 'NutraSweet, Equal',
    risk: 'avoid',
    function: 'An artificial sweetener about 200 times sweeter than sugar.',
    whyThisRating:
      'In 2023, WHO\'s cancer research agency (IARC) classified aspartame as "possibly carcinogenic to humans." People with PKU must avoid it. Some studies link it to headaches and metabolic effects.',
    foundIn: ['Diet sodas', 'Sugar-free gum', 'Light yogurt', 'Sugar-free desserts', 'Tabletop sweeteners'],
    sources: [
      {
        name: 'IARC/WHO Aspartame Assessment 2023',
        url: 'https://www.who.int/news/item/14-07-2023-aspartame-hazard-and-risk-assessment-results-released',
      },
      { name: 'EFSA Scientific Opinion on Aspartame' },
    ],
    notes: 'People with PKU must avoid due to phenylalanine content.',
  },

  E952: {
    code: 'E952',
    name: 'Cyclamate',
    commonName: 'Sodium Cyclamate',
    risk: 'avoid',
    function: 'An artificial sweetener banned in the USA since 1970.',
    whyThisRating:
      'Cyclamate was banned in the USA in 1970 due to studies linking it to cancer in rats. While still permitted in some countries, the ban remains in effect in the USA after 50+ years.',
    foundIn: ['Some imported foods', 'Table sweeteners (outside USA)'],
    sources: [
      { name: 'FDA Cyclamate Ban (1970)' },
      { name: 'EFSA Scientific Opinion on Cyclamate' },
    ],
    notes: 'Banned in USA since 1970. Still permitted in EU, Canada, and others.',
  },

  E954: {
    code: 'E954',
    name: 'Saccharin',
    risk: 'avoid',
    function: 'The oldest artificial sweetener, discovered in 1879.',
    whyThisRating:
      'Saccharin caused bladder cancer in rats, leading to warning labels in the USA from 1977-2000. While the warning was removed, some people still prefer to avoid it. Has a metallic aftertaste.',
    foundIn: ['Diet drinks', 'Tabletop sweeteners', 'Toothpaste', 'Diet foods'],
    sources: [
      { name: 'National Cancer Institute Factsheet on Artificial Sweeteners' },
      { name: 'EFSA Scientific Opinion on Saccharin' },
    ],
    notes: 'Warning labels were required in USA from 1977-2000.',
  },

  E955: {
    code: 'E955',
    name: 'Sucralose',
    commonName: 'Splenda',
    risk: 'avoid',
    function: 'An artificial sweetener about 600 times sweeter than sugar.',
    whyThisRating:
      'Recent studies suggest sucralose may negatively affect gut bacteria and glucose metabolism. Research indicates it may damage DNA when heated. Emerging evidence raises concerns about long-term consumption.',
    foundIn: ['Diet drinks', 'Protein bars', 'Sugar-free syrups', 'Baked goods', 'Tabletop sweeteners'],
    sources: [
      { name: 'Journal of Toxicology: Sucralose and DNA Damage Study' },
      { name: 'Nature: Artificial Sweeteners and Gut Microbiome' },
    ],
  },

  E962: {
    code: 'E962',
    name: 'Aspartame-Acesulfame Salt',
    commonName: 'Twinsweet',
    risk: 'avoid',
    function: 'A combination sweetener of aspartame and acesulfame K.',
    whyThisRating:
      'Combines two artificial sweeteners with individual concerns. Has the same issues as both aspartame (IARC classification, PKU concerns) and acesulfame K (approval process concerns).',
    foundIn: ['Diet beverages', 'Chewing gum', 'Desserts', 'Tabletop sweeteners'],
    sources: [{ name: 'EFSA Scientific Opinion on Aspartame-Acesulfame Salt' }],
    notes: 'Must be avoided by people with PKU.',
  },

  E999: {
    code: 'E999',
    name: 'Quillaia Extract',
    risk: 'avoid',
    function: 'A foaming agent derived from the bark of the soap bark tree.',
    whyThisRating:
      'Quillaia extract may cause nausea and digestive upset. It has limited safety data and is restricted in many countries. Contains saponins which can be irritating.',
    foundIn: ['Some beverages', 'Cocktail mixes', 'Some ciders'],
    sources: [{ name: 'EFSA Scientific Opinion on Quillaia Extract' }],
    notes: 'Restricted to beverages only where permitted.',
  },
};
