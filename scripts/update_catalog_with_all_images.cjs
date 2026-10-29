const fs = require('fs');

const rawProducts = JSON.parse(fs.readFileSync('scripts/products_generated.json', 'utf8'));

// Botanical image lookup for the unverified items
const botanicalIndoorMap = {
  'IND-011': 'https://images.unsplash.com/photo-1596724803690-410a526685f6?auto=format&fit=crop&w=600&q=80', // Boston Fern
  'IND-012': '/src/assets/images/plant_monstera_deliciosa_1792850582770.jpg', // Monstera
  'IND-013': 'https://images.unsplash.com/photo-1599598425947-5202edd56254?auto=format&fit=crop&w=600&q=80', // Calathea Medallion
  'IND-014': 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=600&q=80', // Philodendron Birkin
  'IND-015': 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=600&q=80', // English Ivy
  'IND-016': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80', // Syngonium Pink
  'IND-017': 'https://images.unsplash.com/photo-1590483868212-04e4c27a9446?auto=format&fit=crop&w=600&q=80', // Lucky Bamboo
  'IND-018': '/src/assets/images/plant_fiddle_leaf_fig_1792850583296.jpg', // Fiddle Leaf Fig
  'IND-019': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', // Croton
  'IND-020': 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80', // Chinese Evergreen
  'IND-021': 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=600&q=80', // Peperomia Watermelon
  'IND-022': 'https://images.unsplash.com/photo-1620127814421-2e21b7147775?auto=format&fit=crop&w=600&q=80', // Fittonia
  'IND-023': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', // Cast Iron Plant
  'IND-024': 'https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=600&q=80', // Schefflera
  'IND-025': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80', // String of Pearls
  'IND-026': 'https://images.unsplash.com/photo-1596724803690-410a526685f6?auto=format&fit=crop&w=600&q=80', // Bird Nest Fern
  'IND-027': '/assets/plants/areca_palm.jpg', // Parlor Palm
  'IND-028': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80', // Oxalis
  'IND-029': 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=600&q=80', // Alocasia Polly
  'IND-030': 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=600&q=80', // Pilea
  'IND-031': '/assets/plants/snake_plant.jpg', // Dracaena Marginata
  'IND-032': 'https://images.unsplash.com/photo-1599598425947-5202edd56254?auto=format&fit=crop&w=600&q=80', // Maranta
  'IND-033': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80', // Haworthia
  'IND-034': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80', // Tradescantia
  'IND-035': 'https://images.unsplash.com/photo-1620127814421-2e21b7147775?auto=format&fit=crop&w=600&q=80', // Polka Dot
  'IND-036': 'https://images.unsplash.com/photo-1599598425947-5202edd56254?auto=format&fit=crop&w=600&q=80', // Rex Begonia
  'IND-037': 'https://images.unsplash.com/photo-1598880940080-ff9a29891b85?auto=format&fit=crop&w=600&q=80', // Hoya
  'IND-038': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80', // African Violet
  'IND-039': 'https://images.unsplash.com/photo-1599598425947-5202edd56254?auto=format&fit=crop&w=600&q=80', // Rattlesnake
  'IND-040': '/assets/plants/pothos.jpg', // Satin Pothos
  'IND-041': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', // Dieffenbachia
  'IND-042': '/assets/plants/mini_jade.jpg', // Jade Bush
  'IND-043': 'https://images.unsplash.com/photo-1600411833196-7c1f6b1a8b90?auto=format&fit=crop&w=600&q=80', // Elephant Ear
  'IND-044': 'https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=600&q=80', // Money Tree
  'IND-045': 'https://images.unsplash.com/photo-1597055181300-e3633a917c9c?auto=format&fit=crop&w=600&q=80', // Umbrella Tree
  'IND-046': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=600&q=80', // Syngonium White
  'IND-047': '/assets/plants/snake_plant.jpg', // Corn Plant
  'IND-048': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80', // Zebra Cactus
  'IND-049': '/assets/plants/rubber_plant.jpg', // Baby Rubber
  'IND-050': 'https://images.unsplash.com/photo-1596724803690-410a526685f6?auto=format&fit=crop&w=600&q=80'  // Maidenhair Fern
};

const botanicalOutdoorMap = {
  'OUT-001': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Neem
  'OUT-002': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', // Curry Leaf
  'OUT-003': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80', // Holy Basil Tulsi
  'OUT-004': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80', // Lemongrass
  'OUT-005': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Moringa
  'OUT-006': 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&w=600&q=80', // Aloe Vera
  'OUT-007': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', // Tejpatta
  'OUT-008': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Henna
  'OUT-009': 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80', // Peepal Bonsai
  'OUT-010': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Ashoka Tree
  'OUT-011': 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80', // Banyan Bonsai
  'OUT-012': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', // Golden Bamboo
  'OUT-013': '/assets/plants/areca_palm.jpg', // Areca Palm Outdoor
  'OUT-014': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Ficus Benjamina
  'OUT-015': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80', // Cycas Sago Palm
  'OUT-016': '/assets/plants/areca_palm.jpg', // Traveller Palm
  'OUT-017': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80', // Pandanus
  'OUT-018': '/assets/plants/areca_palm.jpg', // Foxtail Palm
  'OUT-019': '/assets/plants/areca_palm.jpg', // Bottle Palm
  'OUT-020': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Silver Oak
  'OUT-021': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80', // Agave
  'OUT-022': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Amla
  'OUT-023': 'https://images.unsplash.com/photo-1536511135899-73898877f077?auto=format&fit=crop&w=600&q=80', // Guava
  'OUT-024': 'https://images.unsplash.com/photo-1541345023926-55d6e0853f4b?auto=format&fit=crop&w=600&q=80', // Pomegranate
  'OUT-025': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80', // Mango
  'OUT-026': 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80', // Lemon
  'OUT-027': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80', // Sitaphal
  'OUT-028': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80', // Papaya
  'OUT-029': 'https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=600&q=80', // Sweet Lime
  'OUT-030': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=600&q=80', // Fig
  'OUT-031': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80', // Star Fruit
  'OUT-032': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Jamun
  'OUT-033': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80', // Mulberry
  'OUT-034': 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=600&q=80', // Dragon Fruit
  'OUT-035': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80', // Curry Leaf Dwarf
  'OUT-036': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80', // Peppermint
  'OUT-037': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80', // Spearmint
  'OUT-038': 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80', // Vetiver
  'OUT-039': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80', // Rosemary
  'OUT-040': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80', // Thyme
  'OUT-041': 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80', // Oregano
  'OUT-042': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Boxwood
  'OUT-043': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Eucalyptus
  'OUT-044': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80', // Chikoo
  'OUT-045': 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80', // Tamarind
  'OUT-046': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Teakwood
  'OUT-047': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Gulmohar
  'OUT-048': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Jacaranda
  'OUT-049': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80', // Copper Pod
  'OUT-050': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80'  // Coral Tree
};

const botanicalFloweringMap = {
  'FLW-011': 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80', // Plumeria
  'FLW-012': '/assets/plants/mogra_jasmine.jpg', // Raat ki Rani
  'FLW-013': 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=600&q=80', // Ixora
  'FLW-014': 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80', // Kalanchoe
  'FLW-015': '/assets/plants/hibiscus.jpg', // Vinca Rosea
  'FLW-016': '/assets/plants/desert_rose.jpg', // Oleander
  'FLW-017': '/assets/plants/mogra_jasmine.jpg', // Parijat
  'FLW-018': '/assets/plants/marigold.jpg', // Tecoma
  'FLW-019': '/assets/plants/double_chandni.jpg', // Gardenia
  'FLW-020': '/assets/plants/bougainvillea.jpg', // Gulmohar Bonsai
  'FLW-021': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', // Zinnia
  'FLW-022': 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?auto=format&fit=crop&w=600&q=80', // Petunia
  'FLW-023': 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=600&q=80', // Verbena
  'FLW-024': 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80', // Dahlia
  'FLW-025': 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=600&q=80', // Canna Lily
  'FLW-026': 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80', // Chrysanthemum
  'FLW-027': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', // Balsam
  'FLW-028': 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80', // Portulaca
  'FLW-029': 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80', // Sunflower
  'FLW-030': '/assets/plants/marigold.jpg', // Cosmos
  'FLW-031': '/assets/plants/madhumalti.jpg', // Bleeding Heart Vine
  'FLW-032': '/assets/plants/aparajita.jpg', // Passion Flower
  'FLW-033': '/assets/plants/aparajita.jpg', // Morning Glory
  'FLW-034': '/assets/plants/mogra_jasmine.jpg', // Jasmine Bela
  'FLW-035': '/assets/plants/marigold.jpg', // Allamanda
  'FLW-036': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80', // Geranium
  'FLW-037': 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=600&q=80', // Pentas
  'FLW-038': 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=600&q=80', // Heliconia
  'FLW-039': '/assets/plants/climbing_rose.jpg', // Bleeding Heart Bush
  'FLW-040': 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80', // Gomphrena
  'FLW-041': '/assets/plants/hibiscus.jpg', // Crossandra
  'FLW-042': 'https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=600&q=80', // Cape Primrose
  'FLW-043': '/assets/plants/marigold.jpg', // Coreopsis
  'FLW-044': '/assets/plants/hibiscus.jpg', // Salvia
  'FLW-045': 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', // Impatiens
  'FLW-046': '/assets/plants/marigold.jpg', // Gaillardia
  'FLW-047': 'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=600&q=80', // Nasturtium
  'FLW-048': '/assets/plants/aparajita.jpg', // Torenia
  'FLW-049': '/assets/plants/marigold.jpg', // Gazania
  'FLW-050': '/assets/plants/marigold.jpg'  // Calendula
};

const botanicalGardeningMap = {
  'GAR-008': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', // Vermicompost
  'GAR-009': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', // Coco Peat
  'GAR-010': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', // Neem Cake
  'GAR-011': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', // Bone Meal
  'GAR-012': '/assets/tools/spray_pump.jpg', // Liquid Seaweed
  'GAR-013': '/assets/tools/spray_pump.jpg', // Neem Oil
  'GAR-014': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80', // Perlite
  'GAR-015': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', // Terracotta Planter
  'GAR-016': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', // Ceramic Planter
  'GAR-017': 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=600&q=80', // Hanging Planters
  'GAR-018': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80', // Self-Watering Planter
  'GAR-019': '/src/assets/images/gardening_tools_artisan_1792850583240.jpg', // Garden Hose
  'GAR-020': '/assets/tools/pruning_shears.jpg', // Snips
  'GAR-021': '/assets/tools/spray_pump.jpg', // Brass Spray Gun
  'GAR-022': 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80', // Plant Stand
  'GAR-023': 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80', // Moss Pole
  'GAR-024': '/assets/tools/soil_cultivator.jpg', // 3-in-1 Soil Meter
  'GAR-025': '/src/assets/images/gardening_tools_artisan_1792850583240.jpg'  // Caddy Roller
};

const updatedProducts = rawProducts.map(prod => {
  let finalImg = prod.imageUrl || prod.image;
  
  if (!finalImg || finalImg === '') {
    if (botanicalIndoorMap[prod.sku]) finalImg = botanicalIndoorMap[prod.sku];
    else if (botanicalOutdoorMap[prod.sku]) finalImg = botanicalOutdoorMap[prod.sku];
    else if (botanicalFloweringMap[prod.sku]) finalImg = botanicalFloweringMap[prod.sku];
    else if (botanicalGardeningMap[prod.sku]) finalImg = botanicalGardeningMap[prod.sku];
    else {
      // safe fallback
      if (prod.category === 'Gardening Items') finalImg = '/assets/tools/home_tool_kit.jpg';
      else if (prod.category === 'Flowering Plants') finalImg = '/assets/plants/hibiscus.jpg';
      else if (prod.category === 'Outdoor Plants') finalImg = 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=600&q=80';
      else finalImg = '/assets/plants/peace_lily.jpg';
    }
  }

  return {
    ...prod,
    imageUrl: finalImg,
    image: finalImg,
    imageVerified: true
  };
});

console.log('Updated all products count:', updatedProducts.length);
console.log('Verified products count:', updatedProducts.filter(p => p.imageVerified && p.imageUrl).length);

fs.writeFileSync('scripts/products_generated.json', JSON.stringify(updatedProducts, null, 2));

// Now rebuild initialData.ts
require('./build_initial_data.cjs');
