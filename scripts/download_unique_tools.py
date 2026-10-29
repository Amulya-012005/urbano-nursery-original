import urllib.request
import json
import subprocess
import os

os.makedirs('public/assets/tools', exist_ok=True)

wiki_articles = {
    'weeding_hook.jpg': 'Weeder',
    'hedge_shears.jpg': 'Hedge_trimmer',
    'loppers.jpg': 'Loppers',
    'garden_shovel.jpg': 'Spade',
    'garden_fork.jpg': 'Garden_fork',
    'draw_hoe.jpg': 'Hoe_(tool)',
    'lawn_mower.jpg': 'Lawn_mower',
    'grass_cutter_scissors.jpg': 'Grass_shears',
    'root_weed_extractor.jpg': 'Dandelion',
    'potting_soil_mix.jpg': 'Potting_soil',
    'perlite.jpg': 'Perlite',
    'vermiculite.jpg': 'Vermiculite',
    'epsom_salt.jpg': 'Magnesium_sulfate',
    'npk_fertilizer.jpg': 'Fertilizer',
    'rooting_hormone.jpg': 'Auxin',
    'seedling_trays.jpg': 'Seedling',
    'coir_pots.jpg': 'Coir',
    'terracotta_planter.jpg': 'Flowerpot',
    'ceramic_pots.jpg': 'Ceramic_glaze',
    'self_watering_planter.jpg': 'Sub-irrigated_planter',
    'hanging_basket.jpg': 'Hanging_basket',
    'fabric_grow_bags.jpg': 'Grow_bag',
    'metal_plant_stand.jpg': 'Container_garden',
    'moss_stick_pole.jpg': 'Epiphyte',
    'plant_drainage_mat.jpg': 'Saucer',
    'garden_hose_pipe.jpg': 'Garden_hose',
    'drip_irrigation_kit.jpg': 'Drip_irrigation',
    'garden_anti_bird_net.jpg': 'Bird_netting',
    'trellis_netting.jpg': 'Trellis_(architecture)',
    'plant_labels_tags.jpg': 'Label',
    'twist_ties_wire.jpg': 'Twist_tie',
    'decorative_pebbles.jpg': 'Pebble'
}

for filename, title in wiki_articles.items():
    dest = os.path.join('public/assets/tools', filename)
    url = f'https://en.wikipedia.org/api/rest_v1/page/summary/{title}'
    req = urllib.request.Request(url, headers={'User-Agent': 'BotanicalNurseryApp/1.0 (info@urbano.in)'})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            thumb = data.get('thumbnail', {}).get('source')
            if not thumb:
                print(f"No thumb for {title}")
                continue
            # Request larger resolution
            import re
            high_res = re.sub(r'/\d+px-', '/800px-', thumb)
            img_req = urllib.request.Request(high_res, headers={'User-Agent': 'BotanicalNurseryApp/1.0 (info@urbano.in)'})
            try:
                with urllib.request.urlopen(img_req, timeout=12) as img_resp:
                    content = img_resp.read()
            except Exception:
                with urllib.request.urlopen(urllib.request.Request(thumb, headers={'User-Agent': 'Mozilla/5.0'}), timeout=12) as img_resp:
                    content = img_resp.read()
            
            tmp_path = f'/tmp/{filename}'
            with open(tmp_path, 'wb') as f:
                f.write(content)
            
            # Convert to crisp 600x600 JPG
            cmd = f"ffmpeg -y -i '{tmp_path}' -vf 'scale=600:600:force_original_aspect_ratio=increase,crop=600:600' -q:v 2 '{dest}'"
            subprocess.run(cmd, shell=True, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"Generated {filename} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Error {filename} ({title}): {e}")
