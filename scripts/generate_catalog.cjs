const fs = require('fs');

const indoorPlants = [
  { name: 'Peace Lily (Spathiphyllum)', bot: 'Spathiphyllum wallisii', price: 299, orig: 399, desc: 'A lush, glossy air-purifier known for elegant white spade blooms.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: false, file: '/assets/plants/peace_lily.jpg' },
  { name: 'Anthurium (Red / Pink Beauty)', bot: 'Anthurium andraeanum', price: 599, orig: 699, desc: 'Long-lasting exotic wax flowers that bloom up to 250 days a year.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Intermediate', pet: false, file: '/assets/plants/anthurium.jpg' },
  { name: 'Areca Palm', bot: 'Dypsis lutescens', price: 349, orig: 449, desc: 'Feathery, dense green fronds that act as a living room centerpiece and natural humidifier.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Beginner', pet: true, file: '/assets/plants/areca_palm.jpg' },
  { name: 'Golden Money Plant (Pothos)', bot: 'Epipremnum aureum', price: 229, orig: 299, desc: 'A highly resilient trailing climber or hanging basket staple with air purifying foliage.', sun: 'Low', water: 'Weekly', diff: 'Beginner', pet: false, file: '/assets/plants/pothos.jpg' },
  { name: 'ZZ Plant (Zamioculcas zamiifolia)', bot: 'Zamioculcas zamiifolia', price: 449, orig: 499, desc: 'Sculptural, near-indestructible indoor plant needing water only every 3 weeks.', sun: 'Low', water: 'Bi-weekly', diff: 'Beginner', pet: false, file: '/assets/plants/zz_plant.jpg' },
  { name: 'Snake Plant (Dracaena trifasciata)', bot: 'Dracaena trifasciata', price: 299, orig: 399, desc: 'Compact vertical structural leaves that purify indoor air at night releasing oxygen.', sun: 'Low', water: 'Bi-weekly', diff: 'Beginner', pet: false, file: '/assets/plants/snake_plant.jpg' },
  { name: 'Mini Jade Plant', bot: 'Crassula ovata', price: 249, orig: 299, desc: 'Succulent-style round leaves believed to bring positive financial harmony.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Beginner', pet: false, file: '/assets/plants/mini_jade.jpg' },
  { name: 'Spider Plant (Chlorophytum comosum)', bot: 'Chlorophytum comosum', price: 249, orig: 299, desc: 'Produces cascading baby plantlets, making it excellent for shelves and air purification.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: true, file: '/assets/plants/spider_plant.jpg' },
  { name: 'Rubber Plant (Ficus elastica)', bot: 'Ficus elastica', price: 449, orig: 499, desc: 'Bold, leathery burgundy-dark leaves that create a dramatic focal point in any room.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Intermediate', pet: false, file: '/assets/plants/rubber_plant.jpg' },
  { name: 'Snow White Aglaonema', bot: 'Aglaonema commutatum', price: 649, orig: 699, desc: 'Premium, variegated white-and-green foliage for elegant tabletops and work desks.', sun: 'Medium', water: 'When soil dries', diff: 'Beginner', pet: false, file: '/assets/plants/snow_white_aglaonema.jpg' },
  // 40 unverified indoor plants (Image coming soon)
  { name: 'Boston Fern (Nephrolepis exaltata)', bot: 'Nephrolepis exaltata', price: 299, orig: 399, desc: 'Feathery cascading fronds ideal for hanging baskets and bathroom humidity.', sun: 'Medium', water: 'Weekly', diff: 'Intermediate', pet: true },
  { name: 'Monstera Deliciosa (Swiss Cheese Plant)', bot: 'Monstera deliciosa', price: 499, orig: 649, desc: 'Iconic split fenestrated leaves that bring deep jungle atmosphere indoors.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Calathea Medallion', bot: 'Goeppertia veitchiana', price: 450, orig: 599, desc: 'Ornamental round leaves with purple underside that fold up gracefully at night.', sun: 'Medium', water: 'Weekly', diff: 'Intermediate', pet: true },
  { name: 'Philodendron Birkin', bot: 'Philodendron Birkin', price: 399, orig: 499, desc: 'Stunning creamy white pinstripes against dark forest green foliage.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'English Ivy (Hedera helix)', bot: 'Hedera helix', price: 199, orig: 279, desc: 'Evergreen trailing climber with classical star-shaped leaves.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Syngonium Pink Neon', bot: 'Syngonium podophyllum', price: 249, orig: 349, desc: 'Arrowhead shaped leaves bathed in pastel candy pink tones.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Lucky Bamboo (Dracaena sanderiana)', bot: 'Dracaena sanderiana', price: 199, orig: 299, desc: 'Traditional feng-shui arrangement potted in water pebbles.', sun: 'Low', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Fiddle Leaf Fig (Ficus lyrata)', bot: 'Ficus lyrata', price: 699, orig: 899, desc: 'Violin-shaped glossy architectural foliage for high-ceiling rooms.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Intermediate', pet: false },
  { name: 'Croton Petra', bot: 'Codiaeum variegatum', price: 249, orig: 349, desc: 'Explosive sunset palette of scarlet, yellow, and emerald thick leaves.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Intermediate', pet: false },
  { name: 'Chinese Evergreen (Aglaonema Silver Queen)', bot: 'Aglaonema crispum', price: 349, orig: 449, desc: 'Tolerates low light and dry apartment air with minimal watering.', sun: 'Low', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Peperomia Watermelon', bot: 'Peperomia argyreia', price: 320, orig: 420, desc: 'Distinctive silver and green striped leaves resembling miniature watermelon rinds.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Fittonia Nerve Plant (Red Vein)', bot: 'Fittonia albivenis', price: 180, orig: 249, desc: 'Compact terrarium plant featuring bright crimson mosaic vein patterns.', sun: 'Medium', water: 'Weekly', diff: 'Intermediate', pet: true },
  { name: 'Cast Iron Plant (Aspidistra elatior)', bot: 'Aspidistra elatior', price: 420, orig: 550, desc: 'Tough, resilient dark green foliage that survives in dim interior corners.', sun: 'Low', water: 'Bi-weekly', diff: 'Beginner', pet: true },
  { name: 'Schefflera Dwarf Umbrella', bot: 'Schefflera arboricola', price: 299, orig: 399, desc: 'Palmate leaves arranged like tiny green umbrella spokes.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'String of Pearls (Senecio rowleyanus)', bot: 'Curio rowleyanus', price: 349, orig: 449, desc: 'Succulent trailing vine with bead-like round emerald pearls.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Intermediate', pet: false },
  { name: 'Bird\'s Nest Fern (Asplenium nidus)', bot: 'Asplenium nidus', price: 379, orig: 499, desc: 'Ruffled crinkled apple-green fronds radiating from a central rosette.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: true },
  { name: 'Parlor Palm (Chamaedorea elegans)', bot: 'Chamaedorea elegans', price: 279, orig: 369, desc: 'Compact Victorian favorite that thrives in low light indoor spaces.', sun: 'Low', water: 'Weekly', diff: 'Beginner', pet: true },
  { name: 'Oxalis Triangularis (Purple Shamrock)', bot: 'Oxalis triangularis', price: 299, orig: 399, desc: 'Deep violet triangular wings that fold shut like butterflies at night.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Alocasia Amazonica (Polly)', bot: 'Alocasia amazonica', price: 499, orig: 649, desc: 'Shield-shaped arrow leaves with dramatic embossed white rib veins.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Intermediate', pet: false },
  { name: 'Pilea Peperomioides (Chinese Money Plant)', bot: 'Pilea peperomioides', price: 289, orig: 399, desc: 'Pancake shaped round leaves perched on delicate stems.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Dracaena Marginata (Dragon Tree)', bot: 'Dracaena marginata', price: 349, orig: 449, desc: 'Ribbon-like slender leaves outlined in vivid crimson red margins.', sun: 'Medium', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Maranta Leuconeura (Prayer Plant)', bot: 'Maranta leuconeura', price: 320, orig: 420, desc: 'Herringbone red veins with leaves that stand upright in prayer at dusk.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: true },
  { name: 'Haworthia Zebra Succulent', bot: 'Haworthiopsis fasciata', price: 180, orig: 240, desc: 'Architectural spiked rosettes banded in raised white zebra stripes.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Beginner', pet: true },
  { name: 'Tradescantia Zebrina (Wandering Dude)', bot: 'Tradescantia zebrina', price: 199, orig: 269, desc: 'Fast trailing foliage gleaming with iridescent silver and purple stripes.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Polka Dot Plant (Hypoestes)', bot: 'Hypoestes phyllostachya', price: 169, orig: 229, desc: 'Playful confetti pink and green splash leaves for desks.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Beginner', pet: true },
  { name: 'Rex Begonia Escargot', bot: 'Begonia rex', price: 349, orig: 450, desc: 'Swirling spiral leaves with silvery shimmer and burgundy borders.', sun: 'Medium', water: 'Weekly', diff: 'Intermediate', pet: false },
  { name: 'Hoya Carnosa (Wax Plant)', bot: 'Hoya carnosa', price: 399, orig: 499, desc: 'Leathery waxy foliage producing porcelain star-shaped fragrant flowers.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Beginner', pet: true },
  { name: 'African Violet (Saintpaulia)', bot: 'Saintpaulia ionantha', price: 249, orig: 329, desc: 'Velvety dark leaves surrounded by ongoing violet-blue mini blossoms.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Beginner', pet: true },
  { name: 'Calathea Lancifolia (Rattlesnake Plant)', bot: 'Goeppertia insignis', price: 420, orig: 549, desc: 'Wavy brush-stroke green markings with deep aubergine undersides.', sun: 'Medium', water: 'Weekly', diff: 'Intermediate', pet: true },
  { name: 'Scindapsus Pictus (Silver Satin Pothos)', bot: 'Scindapsus pictus', price: 319, orig: 429, desc: 'Heart-shaped matte velvet leaves dusted in reflective metallic silver.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Dieffenbachia Camilla (Dumb Cane)', bot: 'Dieffenbachia seguine', price: 299, orig: 399, desc: 'Broad creamy ivory centered leaves with broad emerald rims.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Jade Succulent Bush (Crassula)', bot: 'Crassula ovata bush', price: 349, orig: 450, desc: 'Sturdy bonsai-trunk succulent symbolizing endurance and prosperity.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Elephant Ear Indoor (Alocasia Wentii)', bot: 'Alocasia wentii', price: 499, orig: 649, desc: 'Grand shield leaves with copper-metallic backings.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Intermediate', pet: false },
  { name: 'Pachira Aquatica (Money Tree)', bot: 'Pachira aquatica', price: 599, orig: 799, desc: 'Braided central trunk crowned by 5-leaf emerald palmate clusters.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Beginner', pet: true },
  { name: 'Dwarf Umbrella Tree Variegated', bot: 'Schefflera arboricola variegata', price: 349, orig: 449, desc: 'Golden cream and olive variegated compact canopy shrub.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Syngonium White Butterfly', bot: 'Syngonium podophyllum', price: 189, orig: 269, desc: 'Soft pastel chartreuse arrowhead leaves that climb or trail.', sun: 'Medium', water: 'Weekly', diff: 'Beginner', pet: false },
  { name: 'Dracaena Fragrans (Corn Plant)', bot: 'Dracaena fragrans', price: 399, orig: 520, desc: 'Broad ribbon corn-like leaves with bright lime center stripes.', sun: 'Low', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Zebra Cactus (Haworthia attenuata)', bot: 'Haworthia attenuata', price: 199, orig: 279, desc: 'Low maintenance compact desk succulent with pearly white ridges.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Beginner', pet: true },
  { name: 'Peperomia Obtusifolia (Baby Rubber)', bot: 'Peperomia obtusifolia', price: 249, orig: 329, desc: 'Succulent thick oval leaves holding moisture for busy homeowners.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Beginner', pet: true },
  { name: 'Maidenhair Fern (Adiantum)', bot: 'Adiantum raddianum', price: 349, orig: 450, desc: 'Delicate fan-shaped fronds on shiny ebony hair-thin stalks.', sun: 'Medium', water: 'Daily', diff: 'Expert', pet: true }
];

const outdoorPlants = [
  { name: 'Neem Plant (Azadirachta indica)', bot: 'Azadirachta indica', price: 149, orig: 220, desc: 'Revered medicinal tree that purifies air, deters pests, and thrives in sun.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Curry Leaf Plant (Kadi Patta)', bot: 'Murraya koenigii', price: 129, orig: 199, desc: 'Intensely fragrant fresh culinary leaves essential for Indian kitchens.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Holy Basil (Rama / Krishna Tulsi)', bot: 'Ocimum sanctum', price: 99, orig: 149, desc: 'Sacred medicinal balcony shrub revered for immunity tea and pooja gardens.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Lemon Grass (Cymbopogon)', bot: 'Cymbopogon citratus', price: 149, orig: 219, desc: 'Aromatic clumping grass widely brewed for herbal immunity teas.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Moringa Drumstick Tree Sapling', bot: 'Moringa oleifera', price: 169, orig: 249, desc: 'Fast-growing superfood miracle tree rich in vitamins and calcium.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Aloe Vera Barbadensis', bot: 'Aloe barbadensis', price: 149, orig: 199, desc: 'Succulent outdoor medicinal plant packed with skin soothing gel.', sun: 'Full Sun', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Indian Bay Leaf (Tejpatta)', bot: 'Cinnamomum tamala', price: 229, orig: 299, desc: 'Fragrant perennial spice tree leaves dried for curries and biryani.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Henna Plant (Mehendi)', bot: 'Lawsonia inermis', price: 179, orig: 249, desc: 'Traditional dye-yielding flowering shrub that loves Indian summer heat.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Peepal Tree Bonsai (Ficus religiosa)', bot: 'Ficus religiosa', price: 499, orig: 699, desc: 'Sacred heart-shaped leaves trained as an architectural container bonsai.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Ashoka Tree Sapling (Polyalthia)', bot: 'Polyalthia longifolia', price: 199, orig: 289, desc: 'Tall columnar mast tree popular for avenue privacy and noise reduction.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Banyan Tree Bonsai (Ficus benghalensis)', bot: 'Ficus benghalensis', price: 549, orig: 750, desc: 'India\'s national tree trained with iconic aerial roots in shallow pot.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Golden Bamboo Clumping', bot: 'Phyllostachys aurea', price: 349, orig: 450, desc: 'Vibrant golden canes ideal for creating living balcony privacy screens.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Areca Palm Outdoor Landscape', bot: 'Dypsis lutescens', price: 399, orig: 499, desc: 'Dense tropical palm clusters that thrive on bright terraces and patios.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Ficus Benjamina (Weeping Fig)', bot: 'Ficus benjamina', price: 299, orig: 399, desc: 'Graceful arching branches with glossy tear-drop outdoor foliage.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Cycas Revoluta (Sago Palm)', bot: 'Cycas revoluta', price: 499, orig: 699, desc: 'Prehistoric slow-growing architectural cycad with stiff feather fronds.', sun: 'Full Sun', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Traveller\'s Palm (Ravenala)', bot: 'Ravenala madagascariensis', price: 499, orig: 699, desc: 'Spectacular giant fan-shaped canopy reminiscent of a peacock tail.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Pandanus (Screw Pine)', bot: 'Pandanus utilis', price: 320, orig: 420, desc: 'Architectural spiraling leaves supported by fascinating prop stilt roots.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Foxtail Palm (Wodyetia bifurcata)', bot: 'Wodyetia bifurcata', price: 449, orig: 599, desc: 'Lush bottle-brush fronds giving an instant five-star resort aesthetic.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Bottle Palm (Hyophorbe lagenicaulis)', bot: 'Hyophorbe lagenicaulis', price: 499, orig: 699, desc: 'Unique swollen trunk resembling a champagne bottle with arching fronds.', sun: 'Full Sun', water: 'Bi-weekly', diff: 'Intermediate', pet: true },
  { name: 'Silver Oak Sapling (Grevillea)', bot: 'Grevillea robusta', price: 189, orig: 260, desc: 'Fast-growing majestic tree with delicate fern-like silver-backed foliage.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Agave Americana (Century Plant)', bot: 'Agave americana', price: 299, orig: 399, desc: 'Extremely drought-tolerant blue-gray rosette with sharp spine margins.', sun: 'Full Sun', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Amla (Indian Gooseberry Sapling)', bot: 'Phyllanthus emblica', price: 199, orig: 299, desc: 'Rich source of natural Vitamin C and Ayurvedic herbal remedies.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Guava Hybrid Dwarf (Amrood)', bot: 'Psidium guajava', price: 249, orig: 349, desc: 'Prolific container fruit tree yielding crisp sweet pink guavas.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Pomegranate Seedless (Anar)', bot: 'Punica granatum', price: 299, orig: 399, desc: 'Hardy terrace shrub with scarlet trumpet blossoms followed by ruby fruit.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Mango Dussehri Grafted Sapling', bot: 'Mangifera indica', price: 349, orig: 499, desc: 'Famous aromatic sweet North Indian grafted mango suitable for large drums.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Lemon Seedless Baramasi (Nimbu)', bot: 'Citrus limon', price: 249, orig: 349, desc: 'All-season heavy bearer of juicy thin-skinned yellow lemons.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Custard Apple (Sitaphal)', bot: 'Annona squamosa', price: 249, orig: 349, desc: 'Hearty fruit plant producing rich creamy sweet dessert fruit.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Papaya Red Lady Dwarf', bot: 'Carica papaya', price: 179, orig: 249, desc: 'High-yielding dwarf variety producing sweet orange-red flesh in 9 months.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Sweet Lime (Mosambi)', bot: 'Citrus limetta', price: 279, orig: 379, desc: 'Juicy, low-acid citrus staple that blooms fragrantly in early spring.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Fig (Anjeer) Pune Hybrid', bot: 'Ficus carica', price: 299, orig: 399, desc: 'Produces sweet nutritious purple figs right on a sunny balcony.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Star Fruit (Carambola)', bot: 'Averrhoa carambola', price: 299, orig: 399, desc: 'Exotic star-shaped crisp juicy fruit tree with pink bell flowers.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Jamun Grafted (Black Plum)', bot: 'Syzygium cumini', price: 249, orig: 349, desc: 'Nutrient-rich dark purple fruit celebrated for blood sugar wellness.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Mulberry (Shahtoot) Sweet Black', bot: 'Morus nigra', price: 229, orig: 320, desc: 'Rapidly fruiting shrub that children and birds adore.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Dragon Fruit Cutting (Pitaya Red)', bot: 'Selenicereus undatus', price: 199, orig: 289, desc: 'Climbing nocturnal flowering cactus yielding vibrant magenta dragon fruit.', sun: 'Full Sun', water: 'Bi-weekly', diff: 'Beginner', pet: true },
  { name: 'Curry Leaf Miniature Dwarf', bot: 'Murraya koenigii dwarf', price: 179, orig: 249, desc: 'Compact bushy form perfect for small window-sill planters.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Peppermint Outdoor Herb', bot: 'Mentha piperita', price: 99, orig: 149, desc: 'Cooling menthol ground cover ideal for refreshing mojitos and teas.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: false },
  { name: 'Spearmint (Pudina)', bot: 'Mentha spicata', price: 89, orig: 129, desc: 'Fast spreading household herb essential for chutneys and raitas.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: false },
  { name: 'Vetiver (Khus Grass Clump)', bot: 'Chrysopogon zizanioides', price: 149, orig: 199, desc: 'Fragrant natural root grass used for cool aromatic summer blinds.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Rosemary Tuscan Blue', bot: 'Salvia rosmarinus', price: 249, orig: 349, desc: 'Woody aromatic herb packed with savory essential oils for cooking.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Thyme English Herb', bot: 'Thymus vulgaris', price: 199, orig: 279, desc: 'Tiny fragrant leaves excellent for balcony kitchen herb gardens.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Oregano Greek Herb', bot: 'Origanum vulgare', price: 199, orig: 279, desc: 'Pungent zesty Mediterranean herb that flowers with pale pink florets.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Boxwood Topiary Bush', bot: 'Buxus sempervirens', price: 349, orig: 449, desc: 'Dense formal hedge shrub easily sheared into spherical or square shapes.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: false },
  { name: 'Eucalyptus Citriodora (Lemon Eucalyptus)', bot: 'Corymbia citriodora', price: 199, orig: 299, desc: 'Natural mosquito repelling foliage that releases lemon zest fragrance.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Chikoo Sapling (Sapodilla Cricket Ball)', bot: 'Manilkara zapota', price: 299, orig: 399, desc: 'Sweet brown sugar malty fruit that produces consistently in hot climates.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Tamarind Bonsai (Imli)', bot: 'Tamarindus indica', price: 449, orig: 599, desc: 'Feathery pinnate foliage that folds at night, grown as a bonsai.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Teakwood Sapling (Sagwan)', bot: 'Tectona grandis', price: 199, orig: 299, desc: 'Prized hardwood sapling with grand broad textured green leaves.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Gulmohar Outdoor Shade Tree', bot: 'Delonix regia', price: 229, orig: 320, desc: 'Broad umbrella canopy providing cooling shade with fern-like foliage.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Jacaranda Fern Tree (Neeli Gulmohar)', bot: 'Jacaranda mimosifolia', price: 249, orig: 349, desc: 'Lacy green foliage that turns into clouds of purple-blue bell blooms.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Copper Pod Tree (Peltophorum)', bot: 'Peltophorum pterocarpum', price: 199, orig: 289, desc: 'Hardy urban shade tree crowned with fragrant yellow blossoms.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Indian Coral Tree (Erythrina)', bot: 'Erythrina variegata', price: 249, orig: 349, desc: 'Striking variegated leaves that attract sunbirds and butterflies.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true }
];

const floweringPlants = [
  { name: 'Hibiscus (Gudhal)', bot: 'Hibiscus rosa-sinensis', price: 199, orig: 294, desc: 'Classic massive multi-colored tropical blooms that flower heavily under full sun.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true, file: '/assets/plants/hibiscus.jpg' },
  { name: 'Bougainvillea Cascading', bot: 'Bougainvillea spectabilis', price: 279, orig: 319, desc: 'Drought-tolerant, colorful cascading paper-flowers used over gates or railings.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false, file: '/assets/plants/bougainvillea.jpg' },
  { name: 'Mogra (Arabian Jasmine)', bot: 'Jasminum sambac', price: 229, orig: 254, desc: 'Highly popular, intensely fragrant white traditional blossoms for garlands and tea.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true, file: '/assets/plants/mogra_jasmine.jpg' },
  { name: 'Marigold (Genda)', bot: 'Tagetes erecta', price: 89, orig: 120, desc: 'Pest-repelling golden blooms used heavily for festivals and daily pooja gardens.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true, file: '/assets/plants/marigold.jpg' },
  { name: 'Desert Rose (Adenium Obesum)', bot: 'Adenium obesum', price: 329, orig: 344, desc: 'Succulent-bonsai hybrid with swollen caudex and vibrant pink trumpet blooms.', sun: 'Full Sun', water: 'Bi-weekly', diff: 'Intermediate', pet: false, file: '/assets/plants/desert_rose.jpg' },
  { name: 'Madhumalti (Rangoon Creeper)', bot: 'Combretum indicum', price: 269, orig: 299, desc: 'Fast-growing vine with clusters of white-to-deep-red changing fragrant flowers.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true, file: '/assets/plants/madhumalti.jpg' },
  { name: 'Lantana Camara Hardy', bot: 'Lantana camara', price: 149, orig: 180, desc: 'Vibrant multi-coloured hardy shrub clusters that draw butterflies and bees.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false, file: '/assets/plants/lantana.jpg' },
  { name: 'Double Chandni (Crape Jasmine)', bot: 'Tabernaemontana divaricata', price: 219, orig: 254, desc: 'Pinwheel-shaped white flowers contrasted against dark waxy green leaves.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false, file: '/assets/plants/double_chandni.jpg' },
  { name: 'Climbing Rose Shrub', bot: 'Rosa indica climbing', price: 349, orig: 399, desc: 'Continuous scented multi-petal red and pink blooms for arches and trellises.', sun: 'Full Sun', water: 'Daily', diff: 'Intermediate', pet: true, file: '/assets/plants/climbing_rose.jpg' },
  { name: 'Aparajita (Butterfly Pea Vine)', bot: 'Clitoria ternatea', price: 199, orig: 299, desc: 'Sacred, vibrant blue medicinal vining flower that climbs rapidly on strings.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true, file: '/assets/plants/aparajita.jpg' },
  // 40 unverified flowering plants (Image coming soon)
  { name: 'Plumeria Champa (Frangipani)', bot: 'Plumeria rubra', price: 349, orig: 450, desc: 'Velvety spiral white-and-yellow petals with intoxicating sweet fragrance.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Raat ki Rani (Night Blooming Jasmine)', bot: 'Cestrum nocturnum', price: 199, orig: 280, desc: 'Tiny tubular flowers that release an unbelievable perfume as darkness settles.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Ixora Coccinea (Rukmini Bush)', bot: 'Ixora coccinea', price: 249, orig: 320, desc: 'Dense globe clusters of brilliant scarlet florets that bloom non-stop.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Kalanchoe Calandiva Blossom', bot: 'Kalanchoe blossfeldiana', price: 299, orig: 399, desc: 'Long-lasting rosebud succulent blooms in vivid orange, pink, and yellow.', sun: 'Bright Indirect', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Sadabahar (Vinca Rosea)', bot: 'Catharanthus roseus', price: 79, orig: 110, desc: 'Near-immortal outdoor bloomer flowering 365 days in Indian sun.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Kaner (Pink Oleander)', bot: 'Nerium oleander', price: 179, orig: 250, desc: 'Tough highway median bloomer with delicate whorled pink petals.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Parijat (Night Jasmine / Har-Shringar)', bot: 'Nyctanthes arbor-tristis', price: 249, orig: 320, desc: 'Sacred celestial flowers with snowy white petals and radiant orange stems.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Tecoma Stans (Yellow Bells)', bot: 'Tecoma stans', price: 219, orig: 299, desc: 'Cascading clusters of cheerful bright golden-yellow trumpet blossoms.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Gardenia Gandharaj (Cape Jasmine)', bot: 'Gardenia jasminoides', price: 299, orig: 399, desc: 'Creamy double-layered white rose blossoms with aristocratic fragrance.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Intermediate', pet: false },
  { name: 'Gulmohar Bonsai (Royal Poinciana)', bot: 'Delonix regia bonsai', price: 599, orig: 799, desc: 'Flamboyant fiery scarlet-orange petals styled in handcrafted bonsai pot.', sun: 'Full Sun', water: 'When soil dries', diff: 'Intermediate', pet: true },
  { name: 'Zinnia Elegans Double Mix', bot: 'Zinnia elegans', price: 129, orig: 180, desc: 'Vibrant pompom blooms in electric pink, orange, and sunshine yellow.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Petunia Cascade Purple', bot: 'Petunia hybrida', price: 149, orig: 199, desc: 'Prolific trumpet flowers overflowing from hanging terrace planters.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Verbena Hybrid Groundcover', bot: 'Verbena hybrida', price: 139, orig: 189, desc: 'Dense carpet of purple and scarlet flower umbrellas.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Dahlia Grand Imperial', bot: 'Dahlia hortensis', price: 249, orig: 349, desc: 'Massive multi-layered dinner-plate blooms in striking jewel tones.', sun: 'Full Sun', water: 'Daily', diff: 'Intermediate', pet: false },
  { name: 'Canna Lily Tropicanna', bot: 'Canna indica', price: 229, orig: 320, desc: 'Exotic striped tropical foliage crowned by bright orange-red iris blooms.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Chrysanthemum (Shevanti Yellow)', bot: 'Chrysanthemum morifolium', price: 179, orig: 240, desc: 'Beloved winter celebration plant covered in dense golden button flowers.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: false },
  { name: 'Balsam (Gul Mehndi / Touch-Me-Not)', bot: 'Impatiens balsamina', price: 99, orig: 149, desc: 'Delicate orchid-like double blooms growing along thick fleshy stems.', sun: 'Medium', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Portulaca (Moss Rose 9 O\'Clock)', bot: 'Portulaca grandiflora', price: 89, orig: 120, desc: 'Sun-activated brilliant carpet blooms that pop open at 9 AM daily.', sun: 'Full Sun', water: 'Bi-weekly', diff: 'Beginner', pet: false },
  { name: 'Sunflower Dwarf Teddy Bear', bot: 'Helianthus annuus dwarf', price: 149, orig: 199, desc: 'Fluffy golden yellow pom-pom sunflowers perfect for balcony pots.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Cosmos Sulphureus Golden', bot: 'Cosmos sulphureus', price: 119, orig: 169, desc: 'Feathery foliage supporting daisy-like bright fiery orange blossoms.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Bleeding Heart Vine (Clerodendrum)', bot: 'Clerodendrum thomsoniae', price: 289, orig: 379, desc: 'Pure white balloon calyces from which crimson blood-drop petals emerge.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Intermediate', pet: false },
  { name: 'Passion Flower (Krishna Kamal)', bot: 'Passiflora incarnata', price: 299, orig: 399, desc: 'Intricate cosmic purple and white corona filaments resembling a mythical crown.', sun: 'Full Sun', water: 'Daily', diff: 'Intermediate', pet: false },
  { name: 'Morning Glory Heavenly Blue', bot: 'Ipomoea tricolor', price: 149, orig: 219, desc: 'Fast climbing vine with sky-blue funnel flowers that greet early dawn.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: false },
  { name: 'Jasmine Sambac Multiflora (Bela)', bot: 'Jasminum sambac multiflora', price: 199, orig: 269, desc: 'Layered white blossoms noted for rich floral perfume oils.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Allamanda Cathartica (Golden Trumpet)', bot: 'Allamanda cathartica', price: 249, orig: 329, desc: 'Vigorous sprawling creeper with huge sunny-yellow trumpet flowers.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: false },
  { name: 'Geranium Horizon Scarlet', bot: 'Pelargonium zonale', price: 249, orig: 349, desc: 'Classic European balcony clusters with aromatic scalloped foliage.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: false },
  { name: 'Pentas Lanceolata (Egyptian Star)', bot: 'Pentas lanceolata', price: 169, orig: 229, desc: 'Star-shaped ruby and lavender flower heads irresistible to butterflies.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Heliconia Parakeet Flower', bot: 'Heliconia psittacorum', price: 349, orig: 449, desc: 'Exotic tropical flower bracts mimicking a colorful parakeet beak.', sun: 'Full Sun', water: 'Daily', diff: 'Intermediate', pet: true },
  { name: 'Bleeding Heart Bush', bot: 'Dicentra spectabilis', price: 349, orig: 450, desc: 'Pendant heart-shaped rosy blossoms dripping with white teardrops.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Intermediate', pet: false },
  { name: 'Gomphrena Globosa (Globe Amaranth)', bot: 'Gomphrena globosa', price: 119, orig: 169, desc: 'Enduring clover-like magenta globes that dry without losing color.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Crossandra (Kanakambaram)', bot: 'Crossandra infundibuliformis', price: 169, orig: 229, desc: 'Traditional South Indian hair garland blossoms in luminous fire-coral.', sun: 'Bright Indirect', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Cape Primrose (Streptocarpus)', bot: 'Streptocarpus hybrid', price: 320, orig: 420, desc: 'Gentle trumpet flowers with violet streaked throats.', sun: 'Bright Indirect', water: 'Weekly', diff: 'Intermediate', pet: true },
  { name: 'Coreopsis Golden Wave', bot: 'Coreopsis tinctoria', price: 129, orig: 179, desc: 'Bright yellow petals splashed with mahogany centers for cheerful beds.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Salvia Splendens Scarlet', bot: 'Salvia splendens', price: 149, orig: 199, desc: 'Upright spires of electric scarlet red florets and calyces.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Impatiens Walleriana (Busy Lizzie)', bot: 'Impatiens walleriana', price: 169, orig: 229, desc: 'Vibrant shade-loving blooms that brighten sheltered patio corners.', sun: 'Medium', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Gaillardia Blanket Flower', bot: 'Gaillardia aristata', price: 129, orig: 179, desc: 'Heat-loving daisy blooms with bicolored banded sunset petals.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Nasturtium Tropaeolum Edible Mix', bot: 'Tropaeolum majus', price: 139, orig: 189, desc: 'Round waterlily leaves with peppery edible orange and ruby blossoms.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Torenia Wishbone Flower', bot: 'Torenia fournieri', price: 149, orig: 199, desc: 'Velvety purple and yellow throat snapdragon-like blossoms.', sun: 'Medium', water: 'Daily', diff: 'Beginner', pet: true },
  { name: 'Gazania Rigens (Treasure Flower)', bot: 'Gazania rigens', price: 159, orig: 219, desc: 'Dazzling striped daisy flowers that open wide in brilliant sunshine.', sun: 'Full Sun', water: 'When soil dries', diff: 'Beginner', pet: true },
  { name: 'Calendula Officinalis (Pot Marigold)', bot: 'Calendula officinalis', price: 129, orig: 179, desc: 'Antiseptic edible sunshine blooms used in restorative skin salves.', sun: 'Full Sun', water: 'Daily', diff: 'Beginner', pet: true }
];

const gardeningTools = [
  { name: 'Heavy Duty Hand Trowel / Khurpa', price: 149, orig: 219, desc: 'Cast carbon steel digging blade with ergonomic anti-slip grip for scooping soil and transplanting.', file: '/assets/tools/hand_trowel.jpg' },
  { name: 'Ergonomic Soil Cultivator / Hand Rake', price: 149, orig: 219, desc: 'Three curved steel tines designed to loosen hardened terrace garden crust for oxygen flow.', file: '/assets/tools/soil_cultivator.jpg' },
  { name: 'Bypass Pruning Shears / Cutter', price: 349, orig: 499, desc: 'Razor-sharp SK5 Japanese carbon steel blade with safety latch for roses, bougainvillea and bonsai.', file: '/assets/tools/pruning_shears.jpg' },
  { name: '5-Piece Deluxe Garden Tool Kit', price: 599, orig: 899, desc: 'Complete heavy-duty starter kit with trowel, transplanter, cultivator, weeder, and fork.', file: '/assets/tools/home_tool_kit.jpg' },
  { name: 'High-Pressure Plant Mist Sprayer (1.5L)', price: 249, orig: 399, desc: 'Manual pneumatic pump brass nozzle bottle for foliar organic sprays, neem oil, and misting.', file: '/assets/tools/spray_pump.jpg' },
  { name: 'Long Spout Ergonomic Watering Can (2L)', price: 299, orig: 449, desc: 'Narrow reach spout enables precise root irrigation without soaking crown foliage.', file: '/assets/tools/watering_can.jpg' },
  { name: 'Breathable Grip Gardening Gloves', price: 149, orig: 249, desc: 'Heavy-duty thorn-resistant gloves with integrated puncture-resistant ABS digging fingertips.', file: '/assets/tools/gardening_gloves.jpg' },
  // 18 unverified gardening items (Image coming soon)
  { name: 'Organic Vermicompost (5kg Pure Black Gold)', price: 199, orig: 299, desc: '100% pure earthworm castings enriched with organic carbon and beneficial soil microbes.' },
  { name: 'Compressed Coco Peat Block (5kg Expands to 75L)', price: 229, orig: 320, desc: 'Washed, low-EC premium substrate for superb water retention in container gardens.' },
  { name: 'Premium Neem Cake Organic Fertilizer (1kg)', price: 149, orig: 220, desc: 'Natural organic soil conditioner that guards against nematodes and fungal pests.' },
  { name: 'Slow-Release Steamed Bone Meal (1kg)', price: 179, orig: 250, desc: 'High phosphorus organic root booster specifically for roses, jasmines, and fruit trees.' },
  { name: 'Organic Liquid Seaweed Kelp Extract (500ml)', price: 299, orig: 449, desc: 'Bio-stimulant rich in 60+ micro-nutrients that promotes rapid flowering and stress resilience.' },
  { name: 'Cold Pressed Pure Neem Oil (250ml)', price: 189, orig: 279, desc: 'Natural broad-spectrum organic bio-pesticide and fungicide for mealybugs, aphids, and mites.' },
  { name: 'Perlite Horticultural Grade Substrate (2kg)', price: 249, orig: 349, desc: 'Ultra-lightweight volcanic minerals that prevent potting mix compaction and rot.' },
  { name: 'Traditional Handcrafted Terracotta Planter (8-inch)', price: 179, orig: 249, desc: 'Natural porous Indian clay pot that allows plant roots to breathe and cool naturally.' },
  { name: 'Glossy White Ceramic Planter Pot (6-inch)', price: 349, orig: 499, desc: 'Modern indoor tabletop planter with glazed glossy ceramic finish and drainage hole.' },
  { name: 'Balcony Railing Hanging Planters (Set of 2)', price: 399, orig: 599, desc: 'Weatherproof powder-coated metal hooks with heavy duty UV-treated colorful planters.' },
  { name: 'Self-Watering Planter Pot (7-inch Reservoir)', price: 289, orig: 399, desc: 'Sub-irrigation wicking system that keeps indoor plants hydrated for up to 14 days.' },
  { name: 'Heavy Duty Braided Garden Hose Pipe (10m)', price: 449, orig: 649, desc: 'Kink-free 3-ply reinforced flexible water hose suitable for all standard balcony taps.' },
  { name: 'Stainless Steel Precision Bud Snips', price: 219, orig: 319, desc: 'Micro-tip spring-loaded snips for harvesting herbs, deadheading, and floral arrangement.' },
  { name: 'Brass Nozzle 8-Pattern Hose Spray Gun', price: 349, orig: 499, desc: 'Solid metal high-pressure nozzle with thumb shutoff valve and 8 spray patterns.' },
  { name: 'Tiered Natural Pine Wood Plant Stand', price: 799, orig: 999, desc: 'Solid wood 3-tier display shelf for organizing 9-12 potted plants on balcony patios.' },
  { name: 'Coir Moss Pole Totem (3 Feet, Set of 2)', price: 299, orig: 420, desc: 'Natural coconut fiber climbing poles for Monsteras, Pothos, and Philodendrons.' },
  { name: '3-in-1 Soil pH, Moisture & Light Meter', price: 499, orig: 799, desc: 'Battery-free twin-probe sensor instantly shows root moisture and substrate pH balance.' },
  { name: 'Heavy Duty Caddy Roller with Castors', price: 399, orig: 599, desc: 'Sturdy lockable wheeled platform for effortlessly gliding heavy 50kg ceramic planters.' }
];

console.log('Indoor count:', indoorPlants.length);
console.log('Outdoor count:', outdoorPlants.length);
console.log('Flowering count:', floweringPlants.length);
console.log('Gardening count:', gardeningTools.length);
console.log('Total count:', indoorPlants.length + outdoorPlants.length + floweringPlants.length + gardeningTools.length);

const allProducts = [];

indoorPlants.forEach((p, idx) => {
  const num = String(idx + 1).padStart(3, '0');
  const hasFile = Boolean(p.file);
  allProducts.push({
    id: `prod_ind_${idx + 1}`,
    sku: `IND-${num}`,
    name: p.name,
    botanicalName: p.bot,
    category: 'Indoor Plants',
    price: p.price,
    currency: 'INR',
    originalPrice: p.orig,
    imageUrl: hasFile ? p.file : '',
    image: hasFile ? p.file : '',
    imageVerified: hasFile,
    stock: 25 + (idx % 15),
    nurseryId: idx % 2 === 0 ? 'nursery_1' : 'nursery_2',
    nurseryName: idx % 2 === 0 ? 'GreenRoots Botanical Haven' : 'Vedic Flora & Herbs',
    rating: Number((4.6 + ((idx * 3) % 4) * 0.1).toFixed(1)),
    reviewCount: 30 + (idx * 7) % 150,
    description: p.desc,
    care: {
      sunlight: p.sun,
      water: p.water,
      difficulty: p.diff,
      petFriendly: p.pet
    },
    isFeatured: idx < 6,
    tags: ['Indoor Plants', 'Home Foliage', 'Air Purifier']
  });
});

outdoorPlants.forEach((p, idx) => {
  const num = String(idx + 1).padStart(3, '0');
  allProducts.push({
    id: `prod_out_${idx + 1}`,
    sku: `OUT-${num}`,
    name: p.name,
    botanicalName: p.bot,
    category: 'Outdoor Plants',
    price: p.price,
    currency: 'INR',
    originalPrice: p.orig,
    imageUrl: '',
    image: '',
    imageVerified: false,
    stock: 20 + (idx % 20),
    nurseryId: idx % 2 === 0 ? 'nursery_2' : 'nursery_3',
    nurseryName: idx % 2 === 0 ? 'Vedic Flora & Herbs' : 'TerraCotta Living Gardens',
    rating: Number((4.5 + ((idx * 2) % 5) * 0.1).toFixed(1)),
    reviewCount: 20 + (idx * 5) % 120,
    description: p.desc,
    care: {
      sunlight: p.sun,
      water: p.water,
      difficulty: p.diff,
      petFriendly: p.pet
    },
    isFeatured: idx < 4,
    tags: ['Outdoor Plants', 'Balcony & Terrace', 'Sun Lover']
  });
});

floweringPlants.forEach((p, idx) => {
  const num = String(idx + 1).padStart(3, '0');
  const hasFile = Boolean(p.file);
  allProducts.push({
    id: `prod_flw_${idx + 1}`,
    sku: `FLW-${num}`,
    name: p.name,
    botanicalName: p.bot,
    category: 'Flowering Plants',
    price: p.price,
    currency: 'INR',
    originalPrice: p.orig,
    imageUrl: hasFile ? p.file : '',
    image: hasFile ? p.file : '',
    imageVerified: hasFile,
    stock: 30 + (idx % 12),
    nurseryId: idx % 2 === 0 ? 'nursery_2' : 'nursery_1',
    nurseryName: idx % 2 === 0 ? 'Vedic Flora & Herbs' : 'GreenRoots Botanical Haven',
    rating: Number((4.7 + ((idx * 4) % 3) * 0.1).toFixed(1)),
    reviewCount: 45 + (idx * 9) % 200,
    description: p.desc,
    care: {
      sunlight: p.sun,
      water: p.water,
      difficulty: p.diff,
      petFriendly: p.pet
    },
    isFeatured: idx < 6,
    tags: ['Flowering Plants', 'Fragrant Blossoms', 'Terrace Bloom']
  });
});

gardeningTools.forEach((p, idx) => {
  const num = String(idx + 1).padStart(3, '0');
  const hasFile = Boolean(p.file);
  allProducts.push({
    id: `prod_gar_${idx + 1}`,
    sku: `GAR-${num}`,
    name: p.name,
    category: 'Gardening Items',
    price: p.price,
    currency: 'INR',
    originalPrice: p.orig,
    imageUrl: hasFile ? p.file : '',
    image: hasFile ? p.file : '',
    imageVerified: hasFile,
    stock: 40 + (idx % 25),
    nurseryId: 'nursery_3',
    nurseryName: 'TerraCotta Living Gardens',
    rating: Number((4.7 + ((idx * 3) % 3) * 0.1).toFixed(1)),
    reviewCount: 25 + (idx * 8) % 180,
    description: p.desc,
    isFeatured: idx < 4,
    tags: ['Gardening Items', 'Essential Tools', 'Potting & Care']
  });
});

console.log('Generated all products:', allProducts.length);
fs.writeFileSync('scripts/products_generated.json', JSON.stringify(allProducts, null, 2));
