#!/usr/bin/env python3
"""Author-curated meaning-space storyboard. Each tuple is one persistent physical set.
Ranges refer to source paragraphs, not punctuation or subtitle fragments.
"""
import json
from pathlib import Path
R=Path(__file__).resolve().parents[1]
# (end paragraph index, distinctive practical set, framing, meaning-changing behaviors)
shots={
 'prologue':[
 (3,'classroom','wide',['teacher_enters','chalk_jobs','students_reply','blackboard_fills'],'将来の夢を職業で答える教室'),
 (6,'classroom_close','countershot',['dream_child_stands','class_reacts','teacher_reframes','dream_chalk_erases'],'お金持ちになって暮らす夢'),
 (10,'chalkboard','overhead',['separate_jobs_life','compare_answers','teacher_looks_back','question_marks'],'職業と望む生活は違う'),
 (15,'town_day','tracking',['family_stroll','traveler_passes','reader_sits','worker_commutes'],'職業以外にもある夢'),
 (20,'classroom_empty','silhouette',['blackboard_clears','job_labels_fade','life_wishes_remain','camera_withdraws'],'誰が夢の定義を作ったのか')],
 'cta':[(1,'night_study','close',['lamp_lights','book_opens','camera_enters'],'チャンネル案内')],
 'chapter1':[
 (3,'office_morning','tracking',['alarm_off','train_arrives','worker_enters','desk_starts'],'三十五歳の会社員と出世の目標'),
 (8,'promotion_room','wide',['boss_promotes','colleagues_applaud','salary_rises','phone_rings','family_trip_crosses'],'昇進と家族旅行の逆転'),
 (12,'office_night','pan',['clock_turns_late','manager_answers','calendar_fills','promotion_stairs'],'幸福の手段が目的に変わる'),
 (16,'apartment_books','overhead',['book_replaced','training_begins','sleep_tracked','life_desk_converts'],'私生活まで最適化される'),
 (23,'research_job','split',['research_cover','job_worker_receives_pay','career_climbs','calling_helps','same_job_split'],'三つの仕事観'),
 (29,'zoo_enclosure','wide',['keeper_feeds','keeper_stays_late','pay_slips','family_waits','zoo_study_page'],'使命感と自己犠牲の研究'),
 (33,'corridor_rain','close',['overworked_keeper','schedule_shifts','work_love_reflects','factory_transition'],'情熱は誰のために使われるか')],
 'chapter2':[
 (4,'factory_1911','wide',['gears_engage','craftsman_shapes','stopwatch_starts','work_standardizes'],'テイラーと科学的管理法'),
 (8,'factory_floor','overhead',['supervisor_measures','worker_repeats','manager_assigns','craftsman_resists'],'規律と熟練の緊張'),
 (13,'airplane_cabin','aisle',['passenger_calls','attendant_approaches','complaint_bursts','attendant_smiles'],'感情を売るサービス業'),
 (17,'service_backstage','mirror',['mirror_reflects','smile_forced','emotions_diverge','research_holds'],'ホックシールドの感情労働'),
 (23,'meeting_room','wide',['boss_shows_miss','worker_listens','demand_owner','boss_seats','slide_changes'],'経営者意識という要求'),
 (28,'boardroom_split','split',['owner_takes_share','worker_reaches','rights_stay','responsibility_grows'],'所有権と責任の非対称'),
 (34,'self_management','overhead',['boss_exits','worker_sets_target','worker_checks_clock','weekend_phone','self_review'],'外部の監督が自己監督に変わる'),
 (38,'office_window','dolly',['worker_stares_city','city_education','city_media','questions_reflect'],'主体性はどこから来たのか')],
 'chapter3':[
 (4,'school_schedule','wide',['bell_rings','children_open_books','teacher_grades','workplace_echo'],'学校と規律'),
 (9,'study_althusser','overhead',['book_highlights','institutions_surround','student_walks','school_dream_returns'],'アルチュセールのイデオロギー'),
 (15,'family_school','tracking',['parent_encourages','teacher_writes_job','child_imagines','values_inherit'],'善意で受け継がれる価値観'),
 (20,'hospital_drama','wide',['doctor_runs','patient_recovers','staff_rejoices','hospital_lights_dim'],'献身する医師の職業ドラマ'),
 (27,'drama_triptych','split',['office_team_finishes','chef_sharpens','family_dinner_ignored','viewer_applauds'],'働く英雄を称賛する物語'),
 (33,'cinema_audience','reverse',['viewer_chooses_drama','screen_expands','norms_reflect','gramscian_text'],'文化的ヘゲモニー'),
 (39,'media_archive','overhead',['criticizes_company','hero_returns','work_stage_persists','culture_repeat'],'企業批判の物語にも残る前提'),
 (44,'sacred_office','symmetry',['office_becomes_chapel','work_badge_halo','meaning_work','thompson_reference'],'ワーキズムと仕事の宗教化'),
 (49,'namecard_social','close',['strangers_meet','cards_exchange','roles_rank','identity_breaks'],'職業と自己認識の接続'),
 (54,'church_work','wide',['chapel_dissolves','office_remains','workers_gather','role_vanishes'],'仕事を失うと自分を失う'),
 (59,'everyday_orbits','overhead',['family_orbit','friends_orbit','art_orbit','work_gravity','education_enters'],'あらゆる幸福が仕事を周回する'),
 (64,'society_city','aerial',['school_lights','offices_glow','screen_drama','citizens_walk','man_dreams'],'社会が望ましい働き手を再生産する')],
 'chapter4':[
 (4,'industrial_timeline','wide',['worker_lifts','robot_grabs','warehouse_movers','computer_types'],'機械化からAIまで'),
 (9,'ai_lab','overhead',['ai_writes','ai_codes','human_reviews','ilo_page'],'AIは仕事内容を変える'),
 (15,'office_ai_report','close',['report_piles','ai_finishes','clock_noon','boss_adds_tasks','desk_overflows'],'効率化しても増える仕事'),
 (20,'future_boardroom','split',['human_sets_purpose','ai_executes','more_goals','alternative_rest'],'AI時代の主体性と二つの未来'),
 (26,'afternoon_exit','tracking',['clock_three','worker_stands','station_sunlight','children_play','cafe_reader'],'午後三時に退社する自由'),
 (31,'living_room_day','wide',['movie_remote','business_book_replaced','walker_headphones','unease_grows'],'自由時間も生産性で測る'),
 (36,'keynes_study','overhead',['keynes_paper','workweek_contracts','leisure_unfolds','mental_void'],'ケインズが見た余暇の問題'),
 (41,'free_time_void','silhouette',['work_bench_vanishes','person_searches','freedom_opens','identity_shrinks'],'自由な時間が恐ろしい'),
 (45,'factory_to_park','split',['machines_work','human_waits','park_opens','human_chooses'],'労働からの解放は何を意味するか')],
 'epilogue':[
 (5,'personal_study','close',['creator_writes','work_finished','pleasure_grows','outside_world'],'私も仕事で幸福を得る'),
 (11,'four_lives','split',['doctor_helps','family_meals','gardener_plants','reader_reclines'],'幸福の形に優劣はない'),
 (17,'city_life_choices','wide',['capitalist_city_glows','school_fades','stories_fade','choice_remains'],'社会の影響と本人の選択'),
 (23,'choice_bridge','overhead',['work_path','nonwork_path','paths_equal','person_free'],'働く幸福と働かない幸福'),
 (29,'classroom_return','wide',['teacher_erases_job','new_questions','children_reconsider','chalkboard_hopes'],'再び教室へ'),
 (34,'quiet_street','silhouette',['worker_exits','family_walks','book_opens','sunset_freezes'],'仕事を取り除いた人生')]
}
notes={
 'classroom':'教師が夢を尋ね職業を黒板に書く。生徒の挙手、教師の板書、視線、黒板の状態を連続させる',
 'promotion_room':'拍手と給与上昇の後で旅行の予定に仕事の緊急連絡が重なる。旅行が実際に取り消される因果',
 'zoo_enclosure':'飼育員が動物に餌を与える一日の延長が給与明細と家庭での不在を生む。研究は解釈を限定',
 'meeting_room':'経営者意識の文字だけではなく、上司が自分の椅子を保ちながら社員へ責任を委ねる矛盾',
 'drama_triptych':'医師、社員、料理人の群像劇がスクリーンを形成し、観客は家庭の夕食シーンを見落とす',
 'afternoon_exit':'時計が15時になると退社、昼の商店街の風景を歩き抜け喫茶店の読者を見つめる',
 'classroom_return':'プロローグの教室と同じ美術を使い、教師が質問を変えた瞬間だけ黒板の意味が変わる'
}
assert sum(len(x) for x in shots.values())==48
out={'id':'V124','title':'なぜ私たちは「仕事」を人生の目的だと思い込むのか？','chapters':[]}
for slug,items in shots.items():
 ps=[x.strip() for x in (R/'content/revised'/f'{slug}.txt').read_text().split('\n\n') if x.strip()]
 prev=-1;outshots=[]
 for i,(end,world,lens,events,title) in enumerate(items):
  assert end>prev and end<len(ps),(slug,end,prev,len(ps))
  sceneid=f"{dict(prologue='P',cta='T',chapter1='A',chapter2='B',chapter3='C',chapter4='D',epilogue='E')[slug]}{i+1:02d}"
  outshots.append({'id':sceneid,'from':prev+1,'to':end,'world':world,'lens':lens,'title':title,'events':events,'direction':notes.get(world,title),'layer':'CONTENT_ONLY'})
  prev=end
 assert prev==len(ps)-1,(slug,prev,len(ps))
 out['chapters'].append({'slug':slug,'shots':outshots,'paragraphCount':len(ps)})
(R/'content/storyboard.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
print('SCENES',sum(len(c['shots']) for c in out['chapters']))
