#!/usr/bin/env python3
"""Create individually directed natural-scene animations, with zero narration omissions."""
import json,re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];C=ROOT/'content'
SRC=(C/'manuscript.txt').read_text().split('【参考資料・読み上げ対象外】')[0]
CHAPTERS=['prologue','cta','chapter1','chapter2','chapter3','chapter4','chapter5','epilogue']
WORLD={
'prologue':['commuter_train_night','station_exit','convenience_store','delivery_street','phone_network','apartment_window','history_split','utopia_theatre','city_dawn'],
'cta':['night_study','tabletop_city','night_study_window'],
'chapter1':['rustic_kitchen','village_road','sickbed','market_harvest','old_clinic','oven_workshop','mill_machine','bread_counter','factory_floor','cargo_rail','supermarket_shelf','poverty_map','policy_school','coin_compare','modern_hospital'],
'chapter2':['coffee_apartment','coffee_farm','cargo_ship','bakery','planning_office','price_market','network_city'],
'chapter3':['nairobi_commute','digital_office','training_room','kenya_comparison','southafrica_bpo','forked_street','employer_recruitment','hiring_competition','family_dinner'],
'chapter4':['startup_garage','investor_meeting','warehouse_growth','giant_corp','research_lab','startup_challenger'],
'chapter5':['smokestack_city','clean_factory','epa_lab','fridge_repair','refrigerator_assembly','laboratory_patent','carbon_factory','factory_retrofit','wealthy_apartment','wellbeing_city','hospital_options','family_choices'],
'epilogue':['worker_home','night_supermarket','town_diorama','system_wheel','sunrise_city'],
}
# Each 2-4 narrated beats gets a distinct, diegetic action sequence within one location.
ACTIONS={
'prologue':[
'train_arrives,doors_open,worker_exits,phone_raised',
'phone_typing,screen_glow,worker_turns,street_lights',
'shop_aisle,meal_selected,contactless_pay,bag_held',
'courier_passing,bag_carry,city_window,truck_revealed',
'freight_load,ship_depart,parcel_sort,factory_machine',
'window_open,look_across,night_traffic,light_falls',
'history_road,life_compare,roof_rebuild,clinic_appears',
'utopia_bubble,contrast_real,utopia_pop,question_glow',
'city_overview,three_industries,workers_move,dawn_approaches'],
'cta':[
'book_open,page_turn,reader_lean,lamp_glow',
'city_model_rise,port_crane,train_route,people_work',
'book_close,reader_look,clock_tick,camera_out'],
'chapter1':[
'soup_served,empty_bowl,rain_leak,child_waits',
'farmer_walk,mud_splash,cart_stops,sky_darkens',
'sickbed_wait,doctor_absent,lantern_fades,door_opens',
'harvest_cart,empty_market,price_rise,customer_leaves',
'clinic_crowd,doctor_exam,medicine_missing,clock_advance',
'oven_fire,bread_count,dough_divide,shelf_empty',
'mill_gear,crank_turn,flour_falls,bread_multiplies',
'bread_stack,first_customer,more_loaves,village_queue',
'factory_gears,product_conveyor,worker_handoff,output_doubles',
'train_approach,grain_wagon,station_unload,road_fills',
'store_shelves,price_change,family_select,cart_roll',
'poverty_people,poverty_decrease,year_change,report_shown',
'school_open,clinic_reveal,policy_sign,trade_unload',
'wealthy_pile,poor_pile,both_increase,gap_widens',
'hospital_entry,doctor_ready,patient_walk,lights_warm'],
'chapter2':[
'coffee_brew,steam_rises,cup_lift,reverse_camera',
'farmer_harvest,bean_basket,bags_stack,ship_loading',
'crane_swing,container_move,ship_depart,waves_move',
'baker_knead,oven_open,bread_sold,customer_return',
'official_writes,maps_overflow,papers_stack,phone_rings',
'bean_shortage,price_moves,buyer_alternates,farmer_plants',
'global_network,people_work,shops_open,food_arrives'],
'chapter3':[
'bus_door,worker_board,street_turn,office_enter',
'employee_typing,software_review,city_contrast,worker_paid',
'training_class,screen_work,mentor_help,job_offer',
'groups_split,earnings_rise,employment_gain,comparison_hold',
'office_rows,staff_growth,industry_expand,contract_signed',
'forked_path,person_chooses,empty_path,door_opens',
'bad_work_sign,contract_read,worker_leave,employers_gather',
'job_competition,offer_rise,workers_move,conditions_change',
'table_set,food_served,child_smiles,window_glow'],
'chapter4':[
'prototype_fail,design_rework,bank_balance,prototype_success',
'investor_considers,signature,capital_transfer,workers_join',
'conveyor_growth,deliveries_begin,customers_arrive,competitor_enters',
'office_tower,gate_block,small_company,market_entry',
'lab_test,research_repeat,patent_review,device_works',
'startup_launch,consumer_switch,giant_adapts,competition_stays'],
'chapter5':[
'smokestack_smoke,city_haze,child_looks,question_held',
'filter_install,cleaner_machine,production_continues,sky_clears',
'epa_measure,gdp_grows,pollution_falls,charts_compare',
'fridge_open,technician_checks,old_coolant,repair_begins',
'factory_retool,new_refrigerant,assembly_advance,new_fridge',
'engineer_notes,prototype_build,test_fail,retest_succeeds',
'emission_meter,energy_change,industrial_invest,damage_lower',
'factory_upgrade,capital_spent,workers_train,plant_modern',
'wealthy_room,worker_clock,shopping_bag,person_stops',
'crowd_compare,people_walk,life_choices,uncertain_happiness',
'clinic_doors,doctor_helps,student_books,relocation',
'family_meal,choose_future,night_lights,warm_window'],
'epilogue':[
'worker_returns,bag_placed,home_light,remember_people',
'farmer_stock,driver_unload,clerk_checkout,warehouse_link',
'town_port,town_factory,town_school,town_hospital',
'competition_turn,rules_appear,safety_net,system_moves',
'sunrise_first,worker_walk,street_alive,comment_question'],
}
TITLES={
'prologue':'あなたが憎んでいる制度に、あなたは生かされています',
'cta':'考える夜へようこそ',
'chapter1':'資本主義が貧困を生んだ？ まず歴史を見てください',
'chapter2':'人間の欲望を、世界規模の協力に変えた発明',
'chapter3':'搾取だと叫ぶ前に、その仕事がなくなった世界を考えてください',
'chapter4':'金持ちが儲かると、あなたは貧しくなるのですか？',
'chapter5':'資本主義が環境を破壊する？ では技術は誰が作ったのでしょう',
'epilogue':'資本主義への批判を始める前に、答えてほしいこと',
}
raw=[x for x in re.split(r'(?=^【(?:プロローグ|第[1-5]章|エピローグ))',SRC,flags=re.M) if x.startswith('【')]
assert len(raw)==7,(len(raw),[r[:30] for r in raw])
def parse_content(c):
 ps=[p.strip().replace('\n','') for p in re.split(r'\n\s*\n',c) if p.strip() and not p.strip().startswith('【')]
 return ps
segments={}
left,right=raw[0].split('【CTA映像】')
segments['prologue']=parse_content(left)
segments['cta']=parse_content(right)
for slug,body in zip(CHAPTERS[2:],raw[1:]):segments[slug]=parse_content(body)
board={'version':2,'style':'original-diegetic-animation','chapters':[]}
tot=0
for slug in CHAPTERS:
 ps=segments[slug]
 assert len(ps)==len(WORLD[slug])==len(ACTIONS[slug]),(slug,len(ps),len(WORLD[slug]),len(ACTIONS[slug]))
 (C/'revised').mkdir(parents=True,exist_ok=True)
 (C/'revised'/f'{slug}.txt').write_text('\n\n'.join(ps))
 shots=[]
 for i,(p,world,events) in enumerate(zip(ps,WORLD[slug],ACTIONS[slug])):
  ev=events.split(',')
  assert len(set(ev))==len(ev) and len(ev)>=3
  shots.append({'id':f'cap-{slug}-{i:02d}','world':world,'events':ev,
                'title':TITLES[slug], 'from':i,'to':i,
                'label':p[:22].strip('。！？')})
 board['chapters'].append({'slug':slug,'title':TITLES[slug],'shots':shots})
 tot+=len(shots)
# Context includes visualization direction, not narration. It is retained as storyboard notes.
notes=re.findall(r'【(?:CTA)?映像】([^\n]+)',SRC)
board['videoDirections']=notes
assert len(board['videoDirections'])==8
assert tot==66,tot
(C/'storyboard.json').write_text(json.dumps(board,ensure_ascii=False,indent=2))
print(json.dumps({'chapters':len(CHAPTERS),'scenes':tot,'narrationChars':sum(map(len,[p for ps in segments.values() for p in ps])),'visualDirections':len(notes)},ensure_ascii=False))
