import { AdditiveExplanation } from '@/types';

/**
 * Safe Additives Explanations (Feature 1)
 *
 * Comprehensive explanations for additives classified as safe.
 * These are generally natural compounds, vitamins, or well-studied substances
 * with no documented health concerns at typical food-use levels.
 */
export const SAFE_ADDITIVE_EXPLANATIONS: Record<string, AdditiveExplanation> = {
  E100: {
    code: 'E100',
    name: 'Curcumin',
    commonName: 'Turmeric Extract',
    risk: 'safe',
    function:
      'A natural yellow-orange coloring extracted from turmeric root. Also has antioxidant properties.',
    whyThisRating:
      'Curcumin is the active compound in turmeric, a spice used for thousands of years in cooking and traditional medicine. It has documented anti-inflammatory and antioxidant benefits. EFSA and FDA consider it safe with no adverse effects at food-use levels.',
    foundIn: ['Mustard', 'Curry products', 'Cheese', 'Butter', 'Ice cream'],
    sources: [
      { name: 'EFSA Panel on Food Additives' },
      { name: 'FDA GRAS Status' },
      { name: 'WHO Food Additives Series' },
    ],
  },

  E101: {
    code: 'E101',
    name: 'Riboflavin',
    commonName: 'Vitamin B2',
    risk: 'safe',
    function:
      'A yellow coloring that also provides nutritional value as an essential B vitamin.',
    whyThisRating:
      'Riboflavin is vitamin B2, an essential nutrient your body needs for energy metabolism. It occurs naturally in milk, eggs, and green vegetables. Adding it to food provides both color and nutritional benefits with no safety concerns.',
    foundIn: ['Cereals', 'Baby food', 'Energy drinks', 'Nutritional supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA NDA Panel' }],
  },

  E140: {
    code: 'E140',
    name: 'Chlorophylls',
    risk: 'safe',
    function:
      'Natural green coloring extracted from plants. The same compound that makes leaves green.',
    whyThisRating:
      'Chlorophyll is the natural pigment found in all green plants. You consume it every time you eat leafy greens, broccoli, or herbs. It has no toxicity and may even have mild health benefits.',
    foundIn: ['Green pasta', 'Confectionery', 'Ice cream', 'Cheese', 'Beverages'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA Color Additive Status' }],
  },

  E160A: {
    code: 'E160A',
    name: 'Beta-Carotene',
    risk: 'safe',
    function:
      'A natural orange-yellow coloring and antioxidant. Also a precursor to vitamin A.',
    whyThisRating:
      'Beta-carotene is the pigment that makes carrots orange. Your body converts it to vitamin A, which is essential for vision and immune function. It provides nutritional benefits beyond coloring.',
    foundIn: ['Margarine', 'Cheese', 'Butter', 'Ice cream', 'Baked goods'],
    sources: [{ name: 'EFSA Safety Assessment' }, { name: 'FDA Color Additive Status' }],
  },

  E160C: {
    code: 'E160C',
    name: 'Paprika Extract',
    commonName: 'Capsanthin',
    risk: 'safe',
    function: 'A natural red-orange coloring extracted from paprika peppers.',
    whyThisRating:
      'Paprika extract is made from dried red peppers, a common cooking ingredient. It provides natural color and mild flavor with no documented health concerns.',
    foundIn: ['Cheese', 'Sauces', 'Snacks', 'Processed meats', 'Soups'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E162: {
    code: 'E162',
    name: 'Beetroot Red',
    commonName: 'Betanin',
    risk: 'safe',
    function: 'A natural red coloring extracted from beets.',
    whyThisRating:
      'Beetroot red is extracted from beets, a common vegetable. It has been used as a natural coloring for centuries. Some studies suggest beetroot compounds may support blood pressure and exercise performance.',
    foundIn: ['Ice cream', 'Yogurt', 'Candy', 'Beverages', 'Soups'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E163: {
    code: 'E163',
    name: 'Anthocyanins',
    risk: 'safe',
    function: 'Natural purple, red, and blue colorings found in berries and grapes.',
    whyThisRating:
      'Anthocyanins are the pigments that make blueberries blue, grapes purple, and strawberries red. They are powerful antioxidants with documented health benefits for cardiovascular health.',
    foundIn: ['Fruit yogurt', 'Beverages', 'Candy', 'Ice cream', 'Baked goods'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E170: {
    code: 'E170',
    name: 'Calcium Carbonate',
    commonName: 'Chalk',
    risk: 'safe',
    function:
      'A white coloring and anti-caking agent. Also provides calcium as a nutritional supplement.',
    whyThisRating:
      'Calcium carbonate is essentially chalk or limestone - the same compound in antacid tablets. It provides calcium, an essential mineral for bone health. No safety concerns at food-use levels.',
    foundIn: ['Bread', 'Biscuits', 'Calcium-fortified foods', 'Wine', 'Supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E260: {
    code: 'E260',
    name: 'Acetic Acid',
    commonName: 'Vinegar',
    risk: 'safe',
    function: 'A natural preservative and flavoring. The main component of vinegar.',
    whyThisRating:
      'Acetic acid is simply vinegar. It has been used in food preservation and cooking for thousands of years. Your body produces acetic acid during normal metabolism.',
    foundIn: ['Pickles', 'Mayonnaise', 'Sauces', 'Condiments', 'Bread'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'WHO Food Additives Series' }],
  },

  E270: {
    code: 'E270',
    name: 'Lactic Acid',
    risk: 'safe',
    function: 'A natural preservative and acidifier produced by fermentation.',
    whyThisRating:
      'Lactic acid is produced naturally during fermentation (yogurt, sauerkraut, sourdough) and in your muscles during exercise. It has been used safely in food for centuries.',
    foundIn: ['Yogurt', 'Cheese', 'Pickled vegetables', 'Beer', 'Bread'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E290: {
    code: 'E290',
    name: 'Carbon Dioxide',
    commonName: 'CO2',
    risk: 'safe',
    function: 'The gas used to carbonate beverages. Also used as a preservative.',
    whyThisRating:
      'Carbon dioxide is the same gas you exhale. In food, it creates fizz in drinks and helps preserve packaged foods. No safety concerns - you naturally produce it in your body.',
    foundIn: ['Soft drinks', 'Sparkling water', 'Beer', 'Champagne', 'Packaged salads'],
    sources: [{ name: 'FDA GRAS Status' }],
  },

  E296: {
    code: 'E296',
    name: 'Malic Acid',
    risk: 'safe',
    function: 'A natural acid found in apples. Provides tartness and enhances flavors.',
    whyThisRating:
      'Malic acid is naturally found in apples (the name comes from Latin "malum" meaning apple) and many other fruits. Your body produces it during energy metabolism. No safety concerns.',
    foundIn: ['Fruit drinks', 'Candy', 'Cider', 'Wine', 'Jams'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E300: {
    code: 'E300',
    name: 'Ascorbic Acid',
    commonName: 'Vitamin C',
    risk: 'safe',
    function:
      'An antioxidant that prevents food from browning and extends shelf life. Also adds nutritional value.',
    whyThisRating:
      'Ascorbic acid is vitamin C, an essential nutrient found naturally in citrus fruits, berries, and vegetables. Your body needs it for immune function and tissue repair. No health concerns at food-use levels.',
    foundIn: ['Fruit juices', 'Cured meats', 'Bread', 'Cereals', 'Frozen fruits'],
    sources: [
      {
        name: 'FDA GRAS Status',
        url: 'https://www.fda.gov/food/food-additives-petitions/food-additive-status-list',
      },
      { name: 'EFSA Safety Assessment' },
    ],
  },

  E301: {
    code: 'E301',
    name: 'Sodium Ascorbate',
    commonName: 'Vitamin C Salt',
    risk: 'safe',
    function: 'The sodium salt of vitamin C. An antioxidant preservative.',
    whyThisRating:
      'Sodium ascorbate is simply vitamin C in a more stable form. It provides the same benefits as regular vitamin C. The sodium content is minimal.',
    foundIn: ['Cured meats', 'Frozen vegetables', 'Baked goods', 'Beverages'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E302: {
    code: 'E302',
    name: 'Calcium Ascorbate',
    commonName: 'Calcium Vitamin C',
    risk: 'safe',
    function: 'The calcium salt of vitamin C. Provides both antioxidant and calcium benefits.',
    whyThisRating:
      'Calcium ascorbate combines vitamin C with calcium, both essential nutrients. It is gentler on the stomach than regular ascorbic acid. No safety concerns.',
    foundIn: ['Supplements', 'Fortified foods', 'Beverages', 'Baked goods'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA NDA Panel' }],
  },

  E304: {
    code: 'E304',
    name: 'Ascorbyl Palmitate',
    risk: 'safe',
    function: 'A fat-soluble form of vitamin C. Prevents fats from going rancid.',
    whyThisRating:
      'Ascorbyl palmitate is vitamin C combined with a fatty acid, making it work in fatty foods where regular vitamin C cannot. It breaks down into vitamin C and a natural fat in your body.',
    foundIn: ['Oils', 'Margarine', 'Snack foods', 'Infant formula', 'Supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E306: {
    code: 'E306',
    name: 'Tocopherols',
    commonName: 'Vitamin E',
    risk: 'safe',
    function: 'A natural antioxidant that prevents fats from going rancid. Also provides nutritional value.',
    whyThisRating:
      'Tocopherols are forms of vitamin E, an essential nutrient found naturally in nuts, seeds, and vegetable oils. They protect both the food and your cells from oxidative damage.',
    foundIn: ['Vegetable oils', 'Cereals', 'Margarine', 'Snacks', 'Baby food'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Nutrition Guidelines' }],
  },

  E307: {
    code: 'E307',
    name: 'Alpha-Tocopherol',
    commonName: 'Vitamin E',
    risk: 'safe',
    function: 'The most active form of vitamin E. A powerful antioxidant.',
    whyThisRating:
      'Alpha-tocopherol is the most biologically active form of vitamin E. It provides nutritional benefits while protecting food from oxidation. No safety concerns.',
    foundIn: ['Vegetable oils', 'Supplements', 'Fortified foods', 'Baby formula'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA NDA Panel' }],
  },

  E308: {
    code: 'E308',
    name: 'Gamma-Tocopherol',
    commonName: 'Vitamin E',
    risk: 'safe',
    function: 'A form of vitamin E with antioxidant properties.',
    whyThisRating:
      'Gamma-tocopherol is a naturally occurring form of vitamin E, abundant in soybean and corn oils. It provides antioxidant protection in food.',
    foundIn: ['Vegetable oils', 'Margarine', 'Salad dressings', 'Snack foods'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E309: {
    code: 'E309',
    name: 'Delta-Tocopherol',
    commonName: 'Vitamin E',
    risk: 'safe',
    function: 'A form of vitamin E used as an antioxidant.',
    whyThisRating:
      'Delta-tocopherol is one of the natural forms of vitamin E. Like other tocopherols, it safely prevents oxidation in foods.',
    foundIn: ['Vegetable oils', 'Processed foods', 'Snacks'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E322: {
    code: 'E322',
    name: 'Lecithins',
    commonName: 'Lecithin',
    risk: 'safe',
    function:
      'An emulsifier that helps oil and water mix together smoothly. Improves texture in chocolate and baked goods.',
    whyThisRating:
      'Lecithin is a natural fat found in egg yolks and soybeans. Your body produces it naturally, and it is essential for cell membranes. Used safely in food for over a century.',
    foundIn: ['Chocolate', 'Margarine', 'Salad dressings', 'Bread', 'Ice cream'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
    notes: 'Those with soy allergies should check if derived from soy.',
  },

  E325: {
    code: 'E325',
    name: 'Sodium Lactate',
    risk: 'safe',
    function: 'The sodium salt of lactic acid. A preservative and humectant.',
    whyThisRating:
      'Sodium lactate is derived from lactic acid, which is naturally produced during fermentation. It helps keep food moist and inhibits bacterial growth.',
    foundIn: ['Processed meats', 'Baked goods', 'Cheese', 'Confectionery'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E326: {
    code: 'E326',
    name: 'Potassium Lactate',
    risk: 'safe',
    function: 'The potassium salt of lactic acid. An acidity regulator and preservative.',
    whyThisRating:
      'Potassium lactate provides the preservation benefits of lactic acid with added potassium. It is metabolized normally by the body.',
    foundIn: ['Processed meats', 'Poultry products', 'Seafood'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E327: {
    code: 'E327',
    name: 'Calcium Lactate',
    risk: 'safe',
    function: 'The calcium salt of lactic acid. A firming agent and calcium source.',
    whyThisRating:
      'Calcium lactate provides calcium, an essential mineral, while also serving as a firming agent. It is well-absorbed by the body and commonly used in calcium supplements.',
    foundIn: ['Canned fruits', 'Canned vegetables', 'Baked goods', 'Supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA NDA Panel' }],
  },

  E330: {
    code: 'E330',
    name: 'Citric Acid',
    risk: 'safe',
    function:
      'Provides tartness and acts as a preservative. Regulates acidity in food and beverages.',
    whyThisRating:
      'Citric acid occurs naturally in citrus fruits. Your body produces it as part of normal metabolism (the citric acid cycle). No health concerns at food-use levels.',
    foundIn: ['Soft drinks', 'Candy', 'Canned foods', 'Jam', 'Wine'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'WHO Food Additives Series' }],
  },

  E331: {
    code: 'E331',
    name: 'Sodium Citrates',
    risk: 'safe',
    function: 'The sodium salts of citric acid. Buffer, emulsifier, and sequestrant.',
    whyThisRating:
      'Sodium citrates are derived from citric acid. They help control acidity and improve texture. The citrate is metabolized normally by the body.',
    foundIn: ['Soft drinks', 'Ice cream', 'Cheese', 'Infant formula', 'Jam'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E332: {
    code: 'E332',
    name: 'Potassium Citrates',
    risk: 'safe',
    function: 'The potassium salts of citric acid. An acidity regulator and stabilizer.',
    whyThisRating:
      'Potassium citrates provide the buffering action of citrate with potassium, an essential mineral. Often used in reduced-sodium products.',
    foundIn: ['Low-sodium foods', 'Beverages', 'Confectionery', 'Jams'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E333: {
    code: 'E333',
    name: 'Calcium Citrates',
    risk: 'safe',
    function: 'The calcium salts of citric acid. A firming agent and calcium source.',
    whyThisRating:
      'Calcium citrate is one of the best-absorbed forms of calcium supplement. It serves as both a functional additive and a source of essential calcium.',
    foundIn: ['Calcium-fortified drinks', 'Canned vegetables', 'Baked goods', 'Supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA NDA Panel' }],
  },

  E334: {
    code: 'E334',
    name: 'Tartaric Acid',
    risk: 'safe',
    function: 'A natural acid from grapes. Provides tartness and acts as an antioxidant.',
    whyThisRating:
      'Tartaric acid is naturally found in grapes, bananas, and tamarinds. It has been used in winemaking for centuries. No safety concerns at food-use levels.',
    foundIn: ['Wine', 'Grape juice', 'Candy', 'Baking powder', 'Soft drinks'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E335: {
    code: 'E335',
    name: 'Sodium Tartrates',
    risk: 'safe',
    function: 'The sodium salts of tartaric acid. Stabilizer and emulsifier.',
    whyThisRating:
      'Sodium tartrates are derived from tartaric acid, a natural grape compound. They help stabilize foods and act as an emulsifier.',
    foundIn: ['Cheese', 'Jam', 'Confectionery', 'Baked goods'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E336: {
    code: 'E336',
    name: 'Potassium Tartrate',
    commonName: 'Cream of Tartar',
    risk: 'safe',
    function:
      'A natural byproduct of winemaking. Used as a stabilizer and in baking powder.',
    whyThisRating:
      'Cream of tartar is a traditional baking ingredient that has been used for centuries. It occurs naturally in wine barrels. No safety concerns.',
    foundIn: ['Baking powder', 'Meringues', 'Candy', 'Frostings'],
    sources: [{ name: 'FDA GRAS Status' }],
  },

  E375: {
    code: 'E375',
    name: 'Nicotinic Acid',
    commonName: 'Vitamin B3/Niacin',
    risk: 'safe',
    function: 'An essential B vitamin added to fortify foods.',
    whyThisRating:
      'Nicotinic acid is vitamin B3, essential for energy metabolism and cellular function. It is commonly added to flour and cereals to prevent deficiency diseases.',
    foundIn: ['Fortified cereals', 'Bread', 'Energy drinks', 'Supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA NDA Panel' }],
  },

  E392: {
    code: 'E392',
    name: 'Rosemary Extract',
    risk: 'safe',
    function: 'A natural antioxidant extracted from rosemary herb.',
    whyThisRating:
      'Rosemary extract contains rosmarinic acid and carnosic acid, powerful natural antioxidants. Rosemary has been used in cooking and preservation for centuries.',
    foundIn: ['Oils', 'Snack foods', 'Meat products', 'Baked goods'],
    sources: [{ name: 'EFSA Panel on Food Additives' }, { name: 'FDA GRAS Status' }],
  },

  E400: {
    code: 'E400',
    name: 'Alginic Acid',
    risk: 'safe',
    function: 'A natural thickener and stabilizer from brown seaweed.',
    whyThisRating:
      'Alginic acid is extracted from brown seaweed and has been used safely for decades. It may actually help with acid reflux by forming a protective layer.',
    foundIn: ['Ice cream', 'Jelly', 'Desserts', 'Sauces', 'Beer'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E401: {
    code: 'E401',
    name: 'Sodium Alginate',
    risk: 'safe',
    function: 'The sodium salt of alginic acid. A thickener and gelling agent.',
    whyThisRating:
      'Sodium alginate is derived from seaweed and used to create unique textures (like the "spherification" in molecular gastronomy). It is a soluble fiber with potential prebiotic benefits.',
    foundIn: ['Ice cream', 'Salad dressings', 'Sauces', 'Desserts', 'Pet food'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E406: {
    code: 'E406',
    name: 'Agar',
    commonName: 'Agar-Agar',
    risk: 'safe',
    function: 'A natural gelling agent from red seaweed. A vegetarian alternative to gelatin.',
    whyThisRating:
      'Agar has been used in Asian cuisine for centuries. It is derived from seaweed and provides fiber. It is particularly valued as a vegetarian/vegan gelatin substitute.',
    foundIn: ['Desserts', 'Jam', 'Ice cream', 'Vegetarian jellies', 'Canned meats'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E410: {
    code: 'E410',
    name: 'Locust Bean Gum',
    commonName: 'Carob Gum',
    risk: 'safe',
    function: 'A natural thickener from carob tree seeds.',
    whyThisRating:
      'Locust bean gum is made from carob seeds, a traditional Mediterranean food. It is a natural fiber that helps create smooth textures. No safety concerns.',
    foundIn: ['Ice cream', 'Cream cheese', 'Salad dressing', 'Bakery products'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E414: {
    code: 'E414',
    name: 'Gum Arabic',
    commonName: 'Acacia Gum',
    risk: 'safe',
    function:
      'A natural thickener and stabilizer from acacia tree sap.',
    whyThisRating:
      'Gum arabic has been used for thousands of years, dating back to ancient Egypt. It acts as a prebiotic fiber, potentially supporting gut health. Extensively studied with no adverse effects.',
    foundIn: ['Soft drinks', 'Candy', 'Gum', 'Wine', 'Bakery products'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Scientific Opinion' }],
  },

  E440: {
    code: 'E440',
    name: 'Pectin',
    risk: 'safe',
    function:
      'A natural gelling agent from fruit cell walls. Creates the texture in jams and jellies.',
    whyThisRating:
      'Pectin is a natural fiber found in apples and citrus peels. It has been used to make jam for centuries. As a soluble fiber, it may benefit digestion and cholesterol.',
    foundIn: ['Jam', 'Jelly', 'Fruit snacks', 'Yogurt', 'Desserts'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E500: {
    code: 'E500',
    name: 'Sodium Carbonates',
    commonName: 'Baking Soda',
    risk: 'safe',
    function: 'A raising agent that helps baked goods rise. Also used to regulate acidity.',
    whyThisRating:
      'Baking soda has been used in cooking for thousands of years. It is a simple mineral compound that reacts with acids to produce carbon dioxide bubbles.',
    foundIn: ['Bread', 'Cakes', 'Cookies', 'Crackers', 'Pancakes'],
    sources: [{ name: 'FDA GRAS Status' }],
  },

  E501: {
    code: 'E501',
    name: 'Potassium Carbonates',
    risk: 'safe',
    function: 'A raising agent and acidity regulator, similar to baking soda.',
    whyThisRating:
      'Potassium carbonate is a traditional leavening agent, especially in European baking. It provides a mild alkali without adding sodium.',
    foundIn: ['Cookies', 'Crackers', 'Cocoa products', 'Gingerbread'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E503: {
    code: 'E503',
    name: 'Ammonium Carbonates',
    commonName: "Baker's Ammonia",
    risk: 'safe',
    function: 'A traditional raising agent that leaves no residue.',
    whyThisRating:
      'Ammonium carbonate has been used in baking for centuries. It completely decomposes during baking into gases (ammonia, CO2, and water), leaving no residue in the final product.',
    foundIn: ['Cookies', 'Crackers', 'Traditional Scandinavian baked goods'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E504: {
    code: 'E504',
    name: 'Magnesium Carbonates',
    risk: 'safe',
    function: 'An anti-caking agent and acidity regulator. Also a magnesium source.',
    whyThisRating:
      'Magnesium carbonate is a mineral compound that prevents clumping in powders. It can provide magnesium, an essential mineral many people lack.',
    foundIn: ['Table salt', 'Powdered foods', 'Supplements', 'Sports chalk'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E508: {
    code: 'E508',
    name: 'Potassium Chloride',
    risk: 'safe',
    function: 'A salt substitute that provides potassium instead of sodium.',
    whyThisRating:
      'Potassium chloride is used as a low-sodium salt alternative. It provides potassium, an essential mineral that most people do not get enough of.',
    foundIn: ['Low-sodium foods', 'Salt substitutes', 'Sports drinks', 'Processed meats'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
    notes: 'People with kidney disease should monitor potassium intake.',
  },

  E509: {
    code: 'E509',
    name: 'Calcium Chloride',
    risk: 'safe',
    function: 'A firming agent that maintains texture in canned and processed vegetables.',
    whyThisRating:
      'Calcium chloride is a mineral salt used to keep vegetables firm. It provides calcium and is used in cheesemaking and tofu production.',
    foundIn: ['Canned vegetables', 'Cheese', 'Tofu', 'Pickles', 'Beer'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E516: {
    code: 'E516',
    name: 'Calcium Sulfate',
    commonName: 'Gypsum',
    risk: 'safe',
    function: 'A firming agent and calcium source. Traditional tofu coagulant.',
    whyThisRating:
      'Calcium sulfate has been used to make tofu in China for over 2,000 years. It provides calcium and is used in baking as a dough conditioner.',
    foundIn: ['Tofu', 'Bread', 'Canned vegetables', 'Beer', 'Supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E524: {
    code: 'E524',
    name: 'Sodium Hydroxide',
    commonName: 'Lye',
    risk: 'safe',
    function: 'An acidity regulator and processing aid. Used in pretzel making.',
    whyThisRating:
      'While sodium hydroxide sounds scary (it is "lye"), it is neutralized during food processing. Traditional pretzels and German-style breads rely on it for their distinctive crust.',
    foundIn: ['Pretzels', 'Olives', 'Cocoa', 'Soft drinks'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
    notes: 'Used in processing, not present in significant amounts in final product.',
  },

  E551: {
    code: 'E551',
    name: 'Silicon Dioxide',
    commonName: 'Silica',
    risk: 'safe',
    function: 'An anti-caking agent that keeps powders free-flowing.',
    whyThisRating:
      'Silicon dioxide is essentially sand (purified). It prevents powders from clumping and passes through the body without being absorbed. No safety concerns.',
    foundIn: ['Powdered foods', 'Spices', 'Coffee creamer', 'Supplements'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E901: {
    code: 'E901',
    name: 'Beeswax',
    risk: 'safe',
    function: 'A natural glazing agent produced by bees.',
    whyThisRating:
      'Beeswax is a natural substance made by honey bees. It has been used by humans for thousands of years in food and cosmetics with no safety concerns.',
    foundIn: ['Candy coating', 'Cheese rind', 'Chocolate', 'Fruit coating'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
    notes: 'Not suitable for vegans.',
  },

  E903: {
    code: 'E903',
    name: 'Carnauba Wax',
    risk: 'safe',
    function: 'A plant-based glazing agent from palm leaves.',
    whyThisRating:
      'Carnauba wax is derived from the leaves of a Brazilian palm tree. It is one of the hardest natural waxes and is used to give foods a shiny coating.',
    foundIn: ['Candy', 'Chocolate', 'Fruit coating', 'Chewing gum'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
  },

  E920: {
    code: 'E920',
    name: 'L-Cysteine',
    risk: 'safe',
    function: 'An amino acid used as a dough conditioner.',
    whyThisRating:
      'L-Cysteine is a naturally occurring amino acid found in many foods including eggs, garlic, and onions. It improves dough handling and bread texture.',
    foundIn: ['Bread', 'Baked goods', 'Pizza dough'],
    sources: [{ name: 'FDA GRAS Status' }, { name: 'EFSA Panel on Food Additives' }],
    notes: 'May be derived from human hair, feathers, or synthetic sources.',
  },
};
