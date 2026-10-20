#!/usr/bin/env python3
import json,re,pathlib,sys,collections
R=pathlib.Path(__file__).resolve().parents[1]
ss=json.loads((R/'content/scenes.json').read_text());vp=json.loads((R/'content/visual_plan.json').read_text())
errors=[];warn=[];ids=set();chapters=collections.defaultdict(list)
for s in ss:
    if s['id'] in ids:errors.append('duplicated scene '+s['id'])
    ids.add(s['id']);chapters[s['chapter']].append(s)
    if s['motif'] not in vp:errors.append('missing visual plan '+s['id'])
    if not s['cues'] or s['duration']<=5:errors.append('short or missing scene '+s['id'])
    if any(c['end']<=c['start'] for c in s['cues']):errors.append('bad cue '+s['id'])
    if abs(s['cues'][-1]['end']-s['duration'])>.06:errors.append('audio mismatch '+s['id'])
    for c in s['cues']:
        lines=c['display'].split('\n')
        if len(lines)>2 or any(len(z)>19 for z in lines):errors.append('subtitle overflow '+s['id'])
        if '\\n' in c['display']:errors.append('literal escaped newline '+s['id'])
    if s['durationSource']!='VOICEVOX_MEASURED':warn.append(s['id']+' estimated')
if len(ss)!=90:errors.append('expected 90 scenes got '+str(len(ss)))
expected={'prologue'}|{f'chapter{i}' for i in range(1,8)}|{'epilogue'}
if set(chapters)!=expected:errors.append('chapter set '+str(sorted(chapters)))
if any(len(chapters[c])!=10 for c in expected):errors.append('every render unit must contain 10 scenes')
if len(vp)!=90:errors.append('expected 90 visual plans got '+str(len(vp)))
motions=[vp[s['motif']]['motion'] for s in ss];programs=[vp[s['motif']]['program'] for s in ss];cameras=[vp[s['motif']]['camera'] for s in ss];kinds=[vp[s['motif']]['kind'] for s in ss]
if len(set(motions))!=90:errors.append('every narration requires unique motion signature')
if set(programs)!=set(range(18)):errors.append('18 motion programs required')
if set(cameras)!=set(range(10)):errors.append('10 camera programs required')
for i in range(1,len(ss)):
    if kinds[i]==kinds[i-1]:errors.append('adjacent layout reuse '+ss[i]['id'])
    if programs[i]==programs[i-1]:errors.append('adjacent motion program reuse '+ss[i]['id'])
    if cameras[i]==cameras[i-1]:errors.append('adjacent camera reuse '+ss[i]['id'])
src=(R/'src/lib/meaningScene.tsx').read_text()
for kind in set(kinds):
    if ("case'"+kind+"'") not in src:errors.append('missing dedicated layout '+kind)
if 'MOTION_PROGRAMS=18' not in src or 'V131_SCENE_COUNT=90' not in src:errors.append('V131 constants missing')
if 'programFlow' not in src or 'cameraFlow' not in src:errors.append('motion engine missing')
if 'rotation(' in src or 'rotation:' in src:errors.append('rotation prohibited: diagrams must stay frontal')
if 'directedSceneFlow' in src or 'microStageFlow' in src:errors.append('legacy common motion engine remains')
if src.count('view.add(')!=4:errors.append('root layer count must stay 4')
voice=(R/'scripts/synth_chapter.py').read_text()
if 'spoken_text' not in voice or 'PRONUNCIATION_MAP' not in voice:errors.append('VOICEVOX pronunciation normalization missing')
report={'status':'BLOCKED' if errors else ('MEASURED_PENDING' if warn else 'READY_FOR_SMOKE_QA'),'video':'V131','scene_count':len(ss),'render_units':len(chapters),'layout_kinds':len(set(kinds)),'motion_programs':len(set(programs)),'camera_programs':len(set(cameras)),'unique_motion_signatures':len(set(motions)),'minimum_semantic_actions':len(ss)*6,'subtitle_cues':sum(len(s['cues']) for s in ss),'seconds':round(sum(s['duration'] for s in ss),2),'errors':errors,'timing_blockers':warn[:5]+(['...'] if len(warn)>5 else [])}
(R/'qa').mkdir(parents=True,exist_ok=True);(R/'qa/static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(2 if errors else 0)
