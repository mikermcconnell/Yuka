import { AdditiveExplanation } from '@/types';

/**
 * Moderate Risk Additives Explanations (Feature 1)
 *
 * Comprehensive explanations for additives with potential concerns.
 * These may cause issues for sensitive individuals or have some scientific debate.
 */
export const MODERATE_ADDITIVE_EXPLANATIONS: Record<string, AdditiveExplanation> = {
  E102: {
    code: 'E102',
    name: 'Tartrazine',
    commonName: 'Yellow 5',
    risk: 'moderate',
    function: 'A synthetic yellow food coloring that provides bright lemon-yellow color.',
    whyThisRating:
      'Tartrazine is one of the "Southampton Six" colorings linked to hyperactivity in children in a 2007 study. The EU requires warning labels. It can trigger allergic reactions in people sensitive to aspirin. Natural alternatives exist.',
    foundIn: ['Candy', 'Soft drinks', 'Cereals', 'Chips', 'Pickles'],
    sources: [
      { name: 'Southampton Study (McCann et al., 2007)' },
      { name: 'EU Regulation on Food Colorings' },
      { name: 'EFSA Re-evaluation of Tartrazine' },
    ],
    notes: 'EU products must state: "May have an adverse effect on activity and attention in children."',
  },

  E104: {
    code: 'E104',
    name: 'Quinoline Yellow',
    risk: 'moderate',
    function: 'A synthetic yellow coloring used in foods and cosmetics.',
    whyThisRating:
      'Quinoline Yellow is one of the Southampton Six linked to hyperactivity in children. Requires a warning label in the EU. Banned in USA, Japan, Australia, and Norway.',
    foundIn: ['Candy', 'Ice cream', 'Smoked fish', 'Soft drinks'],
    sources: [
      { name: 'Southampton Study (McCann et al., 2007)' },
      { name: 'EFSA Scientific Opinion on Quinoline Yellow' },
    ],
    notes: 'Not permitted in USA, Japan, Australia, or Norway.',
  },

  E110: {
    code: 'E110',
    name: 'Sunset Yellow',
    commonName: 'Orange Yellow S, FD&C Yellow 6',
    risk: 'moderate',
    function: 'A synthetic orange coloring commonly used in beverages and desserts.',
    whyThisRating:
      'Sunset Yellow is another Southampton Six coloring linked to hyperactivity. It may cause allergic reactions including hives and asthma symptoms. Requires EU warning label.',
    foundIn: ['Orange drinks', 'Ice cream', 'Candy', 'Cake decorations', 'Hot chocolate'],
    sources: [
      { name: 'Southampton Study (McCann et al., 2007)' },
      { name: 'EFSA Re-evaluation of Sunset Yellow' },
    ],
    notes: 'Must carry hyperactivity warning in EU.',
  },

  E120: {
    code: 'E120',
    name: 'Cochineal',
    commonName: 'Carmine, Natural Red 4',
    risk: 'moderate',
    function: 'A natural red coloring derived from crushed cochineal insects.',
    whyThisRating:
      'While natural, cochineal can cause allergic reactions ranging from hives to anaphylaxis in sensitive individuals. FDA requires it to be listed on labels. Not suitable for vegetarians/vegans.',
    foundIn: ['Yogurt', 'Candy', 'Fruit drinks', 'Cosmetics', 'Jams'],
    sources: [
      { name: 'FDA Guidance on Cochineal Labeling' },
      { name: 'EFSA Panel on Food Additives' },
    ],
    notes: 'Not suitable for vegetarians or vegans. Made from insects.',
  },

  E122: {
    code: 'E122',
    name: 'Carmoisine',
    commonName: 'Azorubine',
    risk: 'moderate',
    function: 'A synthetic red coloring used in foods with a red or purple color.',
    whyThisRating:
      'Carmoisine is one of the Southampton Six colorings linked to hyperactivity in children. It is banned in the USA, Japan, and Norway. Requires EU warning label.',
    foundIn: ['Candy', 'Jelly', 'Marzipan', 'Yogurt', 'Red drinks'],
    sources: [
      { name: 'Southampton Study (McCann et al., 2007)' },
      { name: 'EFSA Scientific Opinion on Azorubine' },
    ],
    notes: 'Banned in USA, Japan, and Norway.',
  },

  E124: {
    code: 'E124',
    name: 'Ponceau 4R',
    commonName: 'Cochineal Red A',
    risk: 'moderate',
    function: 'A synthetic red coloring often used in desserts and candy.',
    whyThisRating:
      'Ponceau 4R is one of the Southampton Six linked to hyperactivity. Banned in USA. May cause allergic reactions in aspirin-sensitive individuals. Requires EU warning.',
    foundIn: ['Candy', 'Cake decorations', 'Desserts', 'Seafood', 'Salami'],
    sources: [
      { name: 'Southampton Study (McCann et al., 2007)' },
      { name: 'EFSA Scientific Opinion on Ponceau 4R' },
    ],
    notes: 'Banned in USA and Norway.',
  },

  E129: {
    code: 'E129',
    name: 'Allura Red',
    commonName: 'Red 40',
    risk: 'moderate',
    function: 'A synthetic red coloring used widely in beverages and confectionery.',
    whyThisRating:
      'Allura Red is linked to hyperactivity in children (Southampton Study). Recent research suggests it may worsen inflammatory bowel conditions. EU requires warning labels, but it remains widely used in the USA.',
    foundIn: ['Candy', 'Cereals', 'Beverages', 'Baked goods', 'Dairy products'],
    sources: [
      { name: 'Southampton Study on Hyperactivity' },
      { name: 'Nature Communications: Red 40 and Colitis Study (2022)' },
    ],
  },

  E131: {
    code: 'E131',
    name: 'Patent Blue V',
    risk: 'moderate',
    function: 'A synthetic blue coloring used in confectionery and beverages.',
    whyThisRating:
      'Patent Blue V can cause allergic reactions including anaphylaxis in rare cases. It is banned in USA, Norway, and Australia. Some studies raise questions about its safety.',
    foundIn: ['Candy', 'Ice cream', 'Canned peas', 'Scotch eggs'],
    sources: [
      { name: 'EFSA Scientific Opinion on Patent Blue V' },
      { name: 'Allergology Reports on Patent Blue Reactions' },
    ],
    notes: 'Banned in USA, Australia, and Norway.',
  },

  E132: {
    code: 'E132',
    name: 'Indigo Carmine',
    commonName: 'Indigotine, FD&C Blue 2',
    risk: 'moderate',
    function: 'A synthetic blue coloring used in candy and baked goods.',
    whyThisRating:
      'Indigo Carmine may cause nausea, skin reactions, and high blood pressure in sensitive individuals. Some concerns exist about potential carcinogenicity at high doses.',
    foundIn: ['Candy', 'Ice cream', 'Baked goods', 'Cereals', 'Biscuits'],
    sources: [{ name: 'EFSA Scientific Opinion on Indigo Carmine' }, { name: 'FDA Color Additive Status' }],
  },

  E133: {
    code: 'E133',
    name: 'Brilliant Blue',
    commonName: 'FD&C Blue 1',
    risk: 'moderate',
    function: 'A synthetic blue coloring used in beverages, candy, and ice cream.',
    whyThisRating:
      'Brilliant Blue may cause hyperactivity and allergic reactions in some individuals. In rare cases, it has been linked to chromosomal damage in lab studies. Generally considered safer than other artificial colors.',
    foundIn: ['Sports drinks', 'Ice cream', 'Candy', 'Canned peas', 'Dairy products'],
    sources: [{ name: 'EFSA Re-evaluation of Brilliant Blue' }, { name: 'FDA CFSAN Review' }],
  },

  E150A: {
    code: 'E150A',
    name: 'Plain Caramel',
    commonName: 'Caramel Color Class I',
    risk: 'moderate',
    function: 'A brown coloring made by heating sugar without ammonia or sulfites.',
    whyThisRating:
      'Plain caramel is the safest type of caramel color, made simply by heating sugar. However, it is still a processed sugar derivative and a marker of processed foods.',
    foundIn: ['Bakery products', 'Sauces', 'Beer', 'Whiskey', 'Pet food'],
    sources: [{ name: 'EFSA Scientific Opinion on Caramel Colors' }],
    notes: 'This is the safest caramel color variant.',
  },

  E150B: {
    code: 'E150B',
    name: 'Caustic Sulfite Caramel',
    commonName: 'Caramel Color Class II',
    risk: 'moderate',
    function: 'A brown coloring made by heating sugar with sulfites.',
    whyThisRating:
      'Contains sulfites, which can trigger asthma symptoms and allergic reactions in sensitive individuals (5-10% of asthmatics). Otherwise similar to plain caramel.',
    foundIn: ['Bakery products', 'Cognac', 'Sherry'],
    sources: [{ name: 'EFSA Scientific Opinion on Caramel Colors' }, { name: 'FDA Sulfite Requirements' }],
    notes: 'People with sulfite sensitivity should be cautious.',
  },

  E150C: {
    code: 'E150C',
    name: 'Ammonia Caramel',
    commonName: 'Caramel Color Class III',
    risk: 'moderate',
    function: 'A brown coloring made by heating sugar with ammonia.',
    whyThisRating:
      'Contains 4-methylimidazole (4-MEI), a byproduct that caused cancer in rodents at high doses. Not as concerning as E150D but still a reason for some caution.',
    foundIn: ['Beer', 'Soy sauce', 'Bakery products', 'Pet food'],
    sources: [
      { name: 'EFSA Scientific Opinion on Caramel Colors' },
      { name: 'NTP Toxicology Studies on 4-MEI' },
    ],
  },

  E150D: {
    code: 'E150D',
    name: 'Sulfite Ammonia Caramel',
    commonName: 'Caramel Color Class IV',
    risk: 'moderate',
    function:
      'A brown coloring made by heating sugar with both ammonia and sulfites. The most common type in colas.',
    whyThisRating:
      'Contains the highest levels of 4-MEI, which caused cancer in rodents. California requires a cancer warning for products with significant 4-MEI. Also contains sulfites which affect asthmatics.',
    foundIn: ['Cola drinks', 'Soy sauce', 'Beer', 'Bread', 'Gravy'],
    sources: [
      { name: 'California Proposition 65' },
      { name: 'EFSA Scientific Opinion on Caramel Colors' },
    ],
    notes: 'California requires Prop 65 warning for high 4-MEI products.',
  },

  E200: {
    code: 'E200',
    name: 'Sorbic Acid',
    risk: 'moderate',
    function: 'A preservative that prevents mold and yeast growth.',
    whyThisRating:
      'Sorbic acid is generally well-tolerated but may cause skin irritation (contact dermatitis) in some people. Some individuals report sensitivity symptoms. Lower concern than other preservatives.',
    foundIn: ['Cheese', 'Wine', 'Baked goods', 'Dried fruits', 'Fruit juices'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E202: {
    code: 'E202',
    name: 'Potassium Sorbate',
    risk: 'moderate',
    function: 'The potassium salt of sorbic acid. A common preservative.',
    whyThisRating:
      'Potassium sorbate is one of the safest preservatives and is generally well-tolerated. However, some people may experience mild skin reactions. Rated moderate due to it being a preservative.',
    foundIn: ['Wine', 'Cheese', 'Yogurt', 'Dried meats', 'Baked goods'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
    notes: 'Generally considered one of the safer preservatives.',
  },

  E210: {
    code: 'E210',
    name: 'Benzoic Acid',
    risk: 'moderate',
    function: 'A preservative that inhibits mold, yeast, and some bacteria.',
    whyThisRating:
      'Benzoic acid can form benzene (a carcinogen) when combined with vitamin C. The Southampton Study linked it to hyperactivity when combined with certain colorings. Some people may be sensitive.',
    foundIn: ['Soft drinks', 'Jams', 'Pickles', 'Salad dressings', 'Fruit juices'],
    sources: [
      { name: 'FDA Benzene in Beverages' },
      { name: 'Southampton Study (McCann et al., 2007)' },
    ],
    notes: 'Avoid combining with vitamin C-containing products.',
  },

  E211: {
    code: 'E211',
    name: 'Sodium Benzoate',
    risk: 'moderate',
    function: 'A preservative that prevents mold, yeast, and bacteria growth in acidic foods.',
    whyThisRating:
      'Sodium benzoate can form small amounts of benzene (a carcinogen) when combined with vitamin C. The Southampton Study linked it to hyperactivity in children when combined with food colorings.',
    foundIn: ['Soft drinks', 'Fruit juice', 'Pickles', 'Salad dressing', 'Condiments'],
    sources: [
      { name: 'FDA Benzene in Soft Drinks' },
      { name: 'Southampton Study on Food Additives and Hyperactivity' },
    ],
    notes: 'Check labels if consuming with vitamin C-fortified drinks.',
  },

  E212: {
    code: 'E212',
    name: 'Potassium Benzoate',
    risk: 'moderate',
    function: 'A preservative similar to sodium benzoate.',
    whyThisRating:
      'Like sodium benzoate, it can form benzene with vitamin C. May be preferred in low-sodium products but has the same potential concerns.',
    foundIn: ['Low-sodium foods', 'Soft drinks', 'Margarine', 'Fruit juices'],
    sources: [{ name: 'FDA Benzene Studies' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E220: {
    code: 'E220',
    name: 'Sulfur Dioxide',
    commonName: 'Sulfites',
    risk: 'moderate',
    function: 'A preservative that prevents browning and bacterial growth.',
    whyThisRating:
      'Sulfites can trigger severe reactions in asthmatics (5-10% of asthma sufferers). Can cause headaches, flushing, and allergic reactions. Required to be labeled above 10 ppm.',
    foundIn: ['Wine', 'Dried fruits', 'Grape juice', 'Pickled foods', 'Shrimp'],
    sources: [
      { name: 'FDA Sulfite Labeling Requirements' },
      { name: 'American Academy of Allergy, Asthma & Immunology' },
    ],
    notes: 'Products must declare "contains sulfites" if over 10 ppm.',
  },

  E221: {
    code: 'E221',
    name: 'Sodium Sulfite',
    risk: 'moderate',
    function: 'A preservative and antioxidant that prevents browning.',
    whyThisRating:
      'May trigger asthma symptoms and allergic reactions in sensitive individuals. Part of the sulfite family of preservatives.',
    foundIn: ['Wine', 'Dried fruits', 'Pickled onions', 'Grape juice'],
    sources: [{ name: 'FDA Sulfite Labeling' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E223: {
    code: 'E223',
    name: 'Sodium Metabisulfite',
    risk: 'moderate',
    function: 'A preservative and antioxidant commonly used in wine and dried fruits.',
    whyThisRating:
      'Like other sulfites, can cause reactions in asthmatics and sensitive individuals. Releases sulfur dioxide when dissolved.',
    foundIn: ['Wine', 'Beer', 'Dried fruits', 'Fruit juices', 'Pickled vegetables'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'WHO JECFA Evaluations' }],
  },

  E224: {
    code: 'E224',
    name: 'Potassium Metabisulfite',
    risk: 'moderate',
    function: 'A preservative and antioxidant, commonly used in winemaking.',
    whyThisRating:
      'Can trigger sulfite sensitivity reactions in asthmatics. Similar concerns to other sulfites.',
    foundIn: ['Wine', 'Beer', 'Fruit juices', 'Dried coconut'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
  },

  E234: {
    code: 'E234',
    name: 'Nisin',
    risk: 'moderate',
    function: 'A natural antibiotic preservative produced by bacteria.',
    whyThisRating:
      'Nisin is a naturally-occurring antibiotic. While generally safe, some concern exists about contributing to antibiotic resistance, though evidence is limited.',
    foundIn: ['Cheese', 'Canned vegetables', 'Processed cheese', 'Desserts'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
    notes: 'One of the few antibiotics permitted in food.',
  },

  E280: {
    code: 'E280',
    name: 'Propionic Acid',
    risk: 'moderate',
    function: 'A preservative that prevents mold growth in bread and baked goods.',
    whyThisRating:
      'Propionic acid may cause migraines in sensitive individuals. Some animal studies suggest behavioral effects. However, it occurs naturally in Swiss cheese.',
    foundIn: ['Bread', 'Baked goods', 'Cheese', 'Animal feed'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
    notes: 'Occurs naturally in Swiss cheese fermentation.',
  },

  E281: {
    code: 'E281',
    name: 'Sodium Propionate',
    risk: 'moderate',
    function: 'The sodium salt of propionic acid. Prevents mold in bread.',
    whyThisRating:
      'May trigger migraines in sensitive people. Some studies suggest it may affect behavior in children, though evidence is limited.',
    foundIn: ['Bread', 'Baked goods', 'Processed cheese', 'Tortillas'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E282: {
    code: 'E282',
    name: 'Calcium Propionate',
    risk: 'moderate',
    function: 'A preservative that inhibits mold and bacteria in baked goods.',
    whyThisRating:
      'The most commonly used propionate. May cause migraines and irritability in some people. One Australian study linked it to restlessness and inattention in children.',
    foundIn: ['Bread', 'Rolls', 'Tortillas', 'Cheese products'],
    sources: [
      { name: 'EFSA Panel on Food Additives' },
      { name: 'Food Intolerance Network Research' },
    ],
    notes: 'Provides calcium while preserving.',
  },

  E320: {
    code: 'E320',
    name: 'Butylated Hydroxyanisole',
    commonName: 'BHA',
    risk: 'moderate',
    function: 'An antioxidant that prevents fats and oils from going rancid.',
    whyThisRating:
      'BHA is "reasonably anticipated to be a human carcinogen" according to the US National Toxicology Program based on animal studies. Some countries have restricted it, though FDA permits use at low levels.',
    foundIn: ['Cereals', 'Chewing gum', 'Butter', 'Snack foods', 'Instant potatoes'],
    sources: [
      { name: 'National Toxicology Program 14th Report on Carcinogens' },
      { name: 'EFSA Opinion on BHA' },
    ],
  },

  E321: {
    code: 'E321',
    name: 'Butylated Hydroxytoluene',
    commonName: 'BHT',
    risk: 'moderate',
    function: 'An antioxidant similar to BHA, preventing fat rancidity.',
    whyThisRating:
      'BHT may act as a hormone disruptor according to some studies. It has been banned in some countries including UK and Australia for certain uses. Animal studies show mixed results.',
    foundIn: ['Cereals', 'Chewing gum', 'Snack foods', 'Packaging materials'],
    sources: [{ name: 'EFSA Scientific Opinion on BHT' }, { name: 'WHO JECFA Evaluations' }],
    notes: 'Often used in food packaging rather than food itself.',
  },

  E338: {
    code: 'E338',
    name: 'Phosphoric Acid',
    risk: 'moderate',
    function: 'An acidifier that provides tartness to cola drinks.',
    whyThisRating:
      'High phosphoric acid intake may affect calcium absorption and bone mineral density. It is a marker of highly processed soft drinks. Some studies link cola consumption to bone health issues.',
    foundIn: ['Cola drinks', 'Flavored waters', 'Processed cheese', 'Jam'],
    sources: [
      { name: 'American Journal of Clinical Nutrition: Phosphoric Acid and Bone Health' },
      { name: 'EFSA Panel on Food Additives' },
    ],
  },

  E407: {
    code: 'E407',
    name: 'Carrageenan',
    risk: 'moderate',
    function: 'A thickener and stabilizer extracted from red seaweed.',
    whyThisRating:
      'Carrageenan has been debated by scientists. Some animal studies suggest it may cause gut inflammation. The "degraded" form is harmful and not approved, but concerns exist about food-grade carrageenan potentially degrading.',
    foundIn: ['Dairy alternatives', 'Ice cream', 'Chocolate milk', 'Deli meats', 'Infant formula'],
    sources: [
      { name: 'EFSA Re-evaluation of Carrageenan' },
      { name: 'Cornucopia Institute Report' },
    ],
    notes: 'Some brands now market "carrageenan-free" products.',
  },

  E412: {
    code: 'E412',
    name: 'Guar Gum',
    risk: 'moderate',
    function: 'A thickener and stabilizer from guar beans.',
    whyThisRating:
      'Guar gum is generally safe but in large amounts can cause digestive discomfort including bloating, gas, and diarrhea. People with IBS may be more sensitive.',
    foundIn: ['Ice cream', 'Yogurt', 'Sauces', 'Gluten-free baked goods', 'Soups'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E415: {
    code: 'E415',
    name: 'Xanthan Gum',
    risk: 'moderate',
    function: 'A thickener and stabilizer produced by bacterial fermentation.',
    whyThisRating:
      'Xanthan gum is widely used and generally well-tolerated. However, it can cause bloating and gas in some people. It is a soluble fiber with potential laxative effects at high intakes.',
    foundIn: ['Salad dressings', 'Sauces', 'Gluten-free bread', 'Ice cream', 'Toothpaste'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Scientific Opinion' }],
  },

  E433: {
    code: 'E433',
    name: 'Polysorbate 80',
    commonName: 'Tween 80',
    risk: 'moderate',
    function: 'An emulsifier that helps mix oil and water in foods.',
    whyThisRating:
      'Some studies suggest polysorbate 80 may negatively affect gut bacteria and promote inflammation. It is also used in vaccines and medications, with rare allergic reactions reported.',
    foundIn: ['Ice cream', 'Whipped toppings', 'Shortening', 'Sauces', 'Pickles'],
    sources: [
      { name: 'Nature: Emulsifiers and Gut Inflammation Study' },
      { name: 'EFSA Panel on Food Additives' },
    ],
  },

  E450: {
    code: 'E450',
    name: 'Diphosphates',
    commonName: 'Pyrophosphates',
    risk: 'moderate',
    function: 'Raising agents used in baking powder and processed meats.',
    whyThisRating:
      'High phosphate intake is associated with cardiovascular risk in some studies, particularly for people with kidney problems. Most people get adequate phosphorus from diet without needing more.',
    foundIn: ['Baking powder', 'Processed cheese', 'Processed meats', 'Canned seafood'],
    sources: [
      { name: 'EFSA Re-evaluation of Phosphates' },
      { name: 'American Journal of Kidney Diseases: Phosphate and CVD' },
    ],
  },

  E451: {
    code: 'E451',
    name: 'Triphosphates',
    risk: 'moderate',
    function: 'Stabilizers and emulsifiers used in processed meats and seafood.',
    whyThisRating:
      'Like other phosphates, high intake may affect cardiovascular health and is concerning for those with kidney disease. Contributes to overall phosphate load in processed foods.',
    foundIn: ['Processed meats', 'Seafood', 'Cheese products', 'Canned foods'],
    sources: [{ name: 'EFSA Re-evaluation of Phosphates' }],
  },

  E452: {
    code: 'E452',
    name: 'Polyphosphates',
    risk: 'moderate',
    function: 'Stabilizers that help retain moisture in processed meats.',
    whyThisRating:
      'Part of the phosphate family with concerns about cardiovascular health when consumed in excess. Often used to add water weight to meats, which some consider deceptive.',
    foundIn: ['Processed meats', 'Ham', 'Bacon', 'Seafood', 'Cheese'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Used to increase water retention (and weight) in meats.',
  },

  E460: {
    code: 'E460',
    name: 'Cellulose',
    commonName: 'Powdered Cellulose',
    risk: 'moderate',
    function: 'A bulking agent derived from plant fiber. Adds fiber without calories.',
    whyThisRating:
      'Cellulose is essentially sawdust or plant fiber. While not harmful, it may cause digestive discomfort in some people. It is often used as a cheap filler to bulk up foods.',
    foundIn: ['Shredded cheese', 'Ice cream', 'Bread', 'Diet foods', 'Fiber supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
    notes: 'Sometimes called "wood pulp" in media coverage.',
  },

  E461: {
    code: 'E461',
    name: 'Methyl Cellulose',
    risk: 'moderate',
    function: 'A thickener and emulsifier derived from cellulose.',
    whyThisRating:
      'Generally safe but may cause digestive issues including bloating and diarrhea in sensitive individuals. Used as a laxative in high doses.',
    foundIn: ['Gluten-free products', 'Baked goods', 'Sauces', 'Diet foods'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E466: {
    code: 'E466',
    name: 'Carboxymethyl Cellulose',
    commonName: 'CMC, Cellulose Gum',
    risk: 'moderate',
    function: 'A thickener and stabilizer widely used in processed foods.',
    whyThisRating:
      'Some studies suggest CMC may negatively affect gut bacteria and promote inflammation, similar to other emulsifiers. However, it has been used for decades with a general safety record.',
    foundIn: ['Ice cream', 'Salad dressings', 'Cake mixes', 'Beverages', 'Toothpaste'],
    sources: [
      { name: 'Nature: Emulsifiers and Gut Microbiome Study' },
      { name: 'EFSA Panel on Food Additives' },
    ],
  },

  E471: {
    code: 'E471',
    name: 'Mono- and Diglycerides',
    risk: 'moderate',
    function: 'Emulsifiers that improve texture and extend shelf life.',
    whyThisRating:
      'These are fats that may contain small amounts of trans fats. They can be from animal or plant sources. While generally safe, their processed nature and potential trans fat content warrant some caution.',
    foundIn: ['Bread', 'Margarine', 'Ice cream', 'Peanut butter', 'Whipped toppings'],
    sources: [
      { name: 'EFSA Panel on Food Additives' },
      { name: 'FDA Trans Fat Labeling Requirements' },
    ],
    notes: 'May not be suitable for vegans depending on source.',
  },

  E472E: {
    code: 'E472E',
    name: 'DATEM',
    commonName: 'Diacetyl Tartaric Acid Esters',
    risk: 'moderate',
    function: 'A dough conditioner that strengthens bread structure.',
    whyThisRating:
      'DATEM is highly processed and a marker of industrial bread production. While no specific health concerns are documented, it represents the highly processed nature of modern bread.',
    foundIn: ['Commercial bread', 'Baked goods', 'Tortillas', 'Pizza dough'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Common in industrial bread - rarely in artisan bakeries.',
  },

  E481: {
    code: 'E481',
    name: 'Sodium Stearoyl Lactylate',
    commonName: 'SSL',
    risk: 'moderate',
    function: 'An emulsifier and dough strengthener.',
    whyThisRating:
      'SSL is highly processed but has no documented health concerns. It is a marker of processed foods but is considered safe by regulatory agencies.',
    foundIn: ['Bread', 'Baked goods', 'Pancake mix', 'Crackers', 'Coffee creamers'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E491: {
    code: 'E491',
    name: 'Sorbitan Monostearate',
    commonName: 'Span 60',
    risk: 'moderate',
    function: 'An emulsifier used in confectionery and baked goods.',
    whyThisRating:
      'Some concern exists about emulsifiers affecting gut bacteria. Generally considered safe but is a highly processed additive.',
    foundIn: ['Chocolate', 'Cake mixes', 'Whipped toppings', 'Yeast products'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
  },

  E621: {
    code: 'E621',
    name: 'Monosodium Glutamate',
    commonName: 'MSG',
    risk: 'moderate',
    function: 'A flavor enhancer that intensifies savory (umami) taste.',
    whyThisRating:
      'MSG is controversial but most scientific reviews find it safe for most people. However, some individuals experience sensitivity symptoms like headaches or flushing. These reactions are typically mild and temporary.',
    foundIn: ['Chips', 'Instant noodles', 'Soups', 'Seasonings', 'Fast food'],
    sources: [
      {
        name: 'FDA: Questions and Answers on MSG',
        url: 'https://www.fda.gov/food/food-additives-petitions/questions-and-answers-monosodium-glutamate-msg',
      },
      { name: 'EFSA Re-evaluation of MSG' },
    ],
    notes: 'Glutamate occurs naturally in tomatoes, parmesan, and soy sauce.',
  },

  E627: {
    code: 'E627',
    name: 'Disodium Guanylate',
    risk: 'moderate',
    function: 'A flavor enhancer that works synergistically with MSG.',
    whyThisRating:
      'Generally safe but should be avoided by people with gout or uric acid issues, as it is metabolized to purines. Almost always used with MSG.',
    foundIn: ['Chips', 'Instant noodles', 'Seasonings', 'Snack foods'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Not suitable for people with gout.',
  },

  E631: {
    code: 'E631',
    name: 'Disodium Inosinate',
    risk: 'moderate',
    function: 'A flavor enhancer similar to E627.',
    whyThisRating:
      'Like E627, should be avoided by those with gout or high uric acid. Often combined with MSG and E627 for enhanced umami taste.',
    foundIn: ['Chips', 'Snack foods', 'Instant noodles', 'Seasonings'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Can be derived from meat, fish, or tapioca.',
  },

  E635: {
    code: 'E635',
    name: 'Disodium Ribonucleotides',
    risk: 'moderate',
    function: 'A combination of E627 and E631 used as a flavor enhancer.',
    whyThisRating:
      'Combines two nucleotide flavor enhancers. Should be avoided by those with gout. Generally considered safe for most people.',
    foundIn: ['Snack foods', 'Instant noodles', 'Processed foods', 'Seasonings'],
    sources: [{ name: 'EFSA Panel on Food Additives' }],
    notes: 'Not suitable for people with gout or high uric acid.',
  },
};
