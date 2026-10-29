import urllib.request
import json
import subprocess
import os

os.makedirs('public/assets/tools', exist_ok=True)

queries = {
    'weeding_hook.jpg': 'weeding tool dandelion digger garden',
    'hedge_shears.jpg': 'hedge shears garden tool',
    'loppers.jpg': 'loppers tree branch cutter',
    'garden_shovel.jpg': 'spade shovel garden tool',
    'garden_fork.jpg': 'garden fork digging spading tool',
    'draw_hoe.jpg': 'garden hoe tool soil',
    'lawn_mower.jpg': 'reel lawn mower grass',
    'grass_cutter_scissors.jpg': 'grass shears lawn edging tool',
    'root_weed_extractor.jpg': 'weed puller tool garden',
    'potting_soil_mix.jpg': 'potting soil mix peat compost',
    'perlite.jpg': 'perlite horticulture soil additive',
    'vermiculite.jpg': 'vermiculite mineral horticulture',
    'epsom_salt.jpg': 'epsom salt magnesium sulfate crystals',
    'npk_fertilizer.jpg': 'fertilizer granules NPK agriculture',
    'rooting_hormone.jpg': 'plant rooting hormone powder propagation',
    'seedling_trays.jpg': 'seedling tray plastic nursery plugs',
    'coir_pots.jpg': 'coir pots biodegradable coconut fiber',
    'terracotta_planter.jpg': 'terracotta flower pot clay planter',
    'ceramic_pots.jpg': 'glazed ceramic flower pot planter',
    'self_watering_planter.jpg': 'self watering planter pot sub-irrigation',
    'hanging_basket.jpg': 'hanging basket flower pot coir',
    'fabric_grow_bags.jpg': 'fabric grow bag plant container',
    'metal_plant_stand.jpg': 'iron plant stand flower pot holder',
    'moss_stick_pole.jpg': 'coco coir pole moss stick climber plant',
    'plant_drainage_mat.jpg': 'plant saucer drip tray drainage saucer',
    'garden_hose_pipe.jpg': 'garden hose reel nozzle watering',
    'drip_irrigation_kit.jpg': 'drip irrigation system emitters tubing',
    'garden_anti_bird_net.jpg': 'bird netting garden fruit protection',
    'trellis_netting.jpg': 'trellis netting plant support garden',
    'plant_labels_tags.jpg': 'plant labels garden tags plastic',
    'twist_ties_wire.jpg': 'garden wire plant twist tie cutter',
    'decorative_pebbles.jpg': 'polished river pebbles landscaping decorative stones'
}

def search_wikimedia(query):
    url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|mime&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'BotanicalNurseryApp/2.0 (gardener@urbano.in)'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, pdata in pages.items():
                for info in pdata.get('imageinfo', []):
                    u = info.get('url', '')
                    if u.lower().endswith(('.jpg', '.jpeg', '.png')):
                        return u
    except Exception as e:
        print(f"Error fetching for query '{query}': {e}")
    return None

for filename, query in queries.items():
    dest = os.path.join('public/assets/tools', filename)
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"Already exists: {filename}")
        continue
    img_url = search_wikimedia(query)
    if img_url:
        tmp_file = f"/tmp/{filename}"
        req = urllib.request.Request(img_url, headers={'User-Agent': 'BotanicalNurseryApp/2.0 (gardener@urbano.in)'})
        try:
            with urllib.request.urlopen(req, timeout=10) as resp, open(tmp_file, 'wb') as f:
                f.write(resp.read())
            # Convert and scale with ffmpeg
            cmd = f"ffmpeg -y -i '{tmp_file}' -vf 'scale=600:600:force_original_aspect_ratio=increase,crop=600:600' -q:v 3 '{dest}'"
            subprocess.run(cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"Success: {filename} from {img_url[:60]}")
        except Exception as e:
            print(f"Download/process failed for {filename}: {e}")
    else:
        print(f"No image found for: {query}")
