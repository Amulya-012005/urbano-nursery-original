with open('src/data/productsData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

import re

tool_map = {
    'prod_tool_1': '/assets/tools/hand_trowel.jpg',
    'prod_tool_2': '/assets/tools/soil_cultivator.jpg',
    'prod_tool_3': '/assets/tools/pruning_shears.jpg',
    'prod_tool_4': '/assets/tools/spray_pump.jpg',
    'prod_tool_5': '/assets/tools/watering_can.jpg',
    'prod_tool_6': '/assets/tools/gardening_gloves.jpg',
    'prod_tool_7': '/assets/tools/weeding_hook.jpg',
    'prod_tool_8': '/assets/tools/hedge_shears.jpg',
    'prod_tool_9': '/assets/tools/loppers.jpg',
    'prod_tool_10': '/assets/tools/garden_shovel.jpg',
    'prod_tool_11': '/assets/tools/garden_fork.jpg',
    'prod_tool_12': '/assets/tools/draw_hoe.jpg',
    'prod_tool_13': '/assets/tools/lawn_mower.jpg',
    'prod_tool_14': '/assets/tools/grass_cutter_scissors.jpg',
    'prod_tool_15': '/assets/tools/root_weed_extractor.jpg',
    'prod_tool_16': '/assets/care/vermicompost.jpg',
    'prod_tool_17': '/assets/tools/potting_soil_mix.jpg',
    'prod_tool_18': '/assets/tools/perlite.jpg',
    'prod_tool_19': '/assets/tools/vermiculite.jpg',
    'prod_tool_20': '/assets/care/coco_peat.jpg',
    'prod_tool_21': '/assets/care/neem_cake.jpg',
    'prod_tool_22': '/assets/care/bone_meal.jpg',
    'prod_tool_23': '/assets/tools/epsom_salt.jpg',
    'prod_tool_24': '/assets/tools/npk_fertilizer.jpg',
    'prod_tool_25': '/assets/care/seaweed_extract.jpg',
    'prod_tool_26': '/assets/tools/rooting_hormone.jpg',
    'prod_tool_27': '/assets/care/trichoderma.jpg',
    'prod_tool_28': '/assets/care/neem_oil.jpg',
    'prod_tool_29': '/assets/tools/seedling_trays.jpg',
    'prod_tool_30': '/assets/tools/coir_pots.jpg',
    'prod_tool_31': '/assets/tools/terracotta_planter.jpg',
    'prod_tool_32': '/assets/tools/ceramic_pots.jpg',
    'prod_tool_33': '/assets/tools/self_watering_planter.jpg',
    'prod_tool_34': '/assets/tools/hanging_basket.jpg',
    'prod_tool_35': '/assets/tools/fabric_grow_bags.jpg',
    'prod_tool_36': '/assets/tools/metal_plant_stand.jpg',
    'prod_tool_37': '/assets/tools/moss_stick_pole.jpg',
    'prod_tool_38': '/assets/tools/plant_drainage_mat.jpg',
    'prod_tool_39': '/assets/tools/garden_hose_pipe.jpg',
    'prod_tool_40': '/assets/tools/drip_irrigation_kit.jpg',
    'prod_tool_41': '/assets/tools/garden_anti_bird_net.jpg',
    'prod_tool_42': '/assets/tools/trellis_netting.jpg',
    'prod_tool_43': '/assets/tools/plant_labels_tags.jpg',
    'prod_tool_44': '/assets/tools/twist_ties_wire.jpg',
    'prod_tool_45': '/assets/tools/decorative_pebbles.jpg'
}

for tool_id, img_path in tool_map.items():
    # Replace imageUrl and image inside the object for this tool_id
    pattern = rf"(id:\s*'{tool_id}',.*?imageUrl:\s*)'[^']+'(.*?image:\s*)'[^']+'"
    replacement = rf"\g<1>'{img_path}'\g<2>'{img_path}'"
    new_content, count = re.subn(pattern, replacement, content, flags=re.DOTALL)
    if count > 0:
        content = new_content
    else:
        print(f"Could not replace for {tool_id}")

with open('src/data/productsData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Applied 45 unique tool images to productsData.ts!")
