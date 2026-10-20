#!/usr/bin/env python3
import json,re,pathlib,sys,collections
R=pathlib.Path(__file__).resolve().parents[1];ss=json.loads((R/'content/scenes.json').read_text());vp=json.loads((R/'content/visual_plan.json').read_text())
errors=[];warn=[];ids=set();chapters=collections.defaultdict(list)
for s in ss:
    if s['id'] in ids:errors.append('duplicate '+s['id'])
    ids.add(s['id']);chapters[s['chapter']].append(s)
    if s['motif'] not in vp:errors.append('missing visual '+s['id'])
    if not s['cues'] or s['duration']<=3.2:errors.append('short scene '+s['id'])
    if any(c['end']<=c['start'] for c in s['cues']):errors.append('bad cue '+s['id'])
    if abs(s['cues'][-1]['end']-s['duration'])>.06:errors.append('timing mismatch '+s['id'])
    for c in s['cues']:
        lines=c['display'].split('\n')
        if len(lines)>2 or any(len(x)>19 for x in lines):errors.append('subtitle overflow '+s['id'])
        if '\\n' in c['display']:errors.append('escaped newline '+s['id'])
    if s['durationSource']!='VOICEVOX_MEASURED':warn.append(s['id']+' estimated')
if len(ss)!=90:errors.append('expected 90 scenes got '+str(len(ss)))
expected={'prologue','chapter1','chapter2','chapter3','chapter4','epilogue'}
if set(chapters)!=expected:errors.append('chapter set '+str(sorted(chapters)))
if any(len(chapters[c])!=15 for c in expected):errors.append('each render unit must contain 15 scenes')
if len(vp)!=90:errors.append('visual plans must equal 90')
plans=[vp[s['motif']] for s in ss]
actions=[p['action'] for p in plans];motions=[p['motionSignature'] for p in plans];programs=[p['actionProgram'] for p in plans]
if len(set(actions))!=90:errors.append('every narration requires a unique semantic action')
if len(set(motions))!=90:errors.append('every narration requires a unique motion signature')
if set(programs)!=set(range(90)):errors.append('actionProgram must be unique 0..89')
spaces=[p['space'] for p in plans];diagrams=[p['diagram'] for p in plans];cams=[p['camera'] for p in plans]
if len(set(spaces))<25:errors.append('need at least 25 concrete spaces')
if len(set(diagrams))<35:errors.append('need at least 35 diagram grammars')
for i in range(1,len(plans)):
    if spaces[i]==spaces[i-1]:errors.append('adjacent background-space reuse '+ss[i]['id'])
    if diagrams[i]==diagrams[i-1]:errors.append('adjacent diagram reuse '+ss[i]['id'])
    if cams[i]==cams[i-1]:errors.append('adjacent camera reuse '+ss[i]['id'])
    if actions[i]==actions[i-1]:errors.append('adjacent action reuse '+ss[i]['id'])
src=(R/'src/lib/meaningScene.tsx').read_text()
for key in ['V132_SCENE_COUNT=90','V132_STAGE_COUNT=12','directorFlow','orderFor','buildSpace','buildDiagram','cameraFlow']:
    if key not in src:errors.append('missing renderer feature '+key)
if 'rotation(' in src or 'rotation:' in src:errors.append('rotation prohibited: keep diagrams frontal')
if 'directedSceneFlow' in src or 'microStageFlow' in src:errors.append('legacy shared animation remains')
if src.count('view.add(')!=4:errors.append('root layers must stay separated into 4')
if 'slice(4)' not in src:errors.append('space and information layers must be staged independently')
voice=(R/'scripts/synth_chapter.py').read_text()
if 'PRONUNCIATION_MAP' not in voice or 'spoken_text' not in voice:errors.append('VOICE pronunciation map missing')
report={'status':'BLOCKED' if errors else ('MEASURED_PENDING' if warn else 'READY_FOR_SMOKE_QA'),'video':'V132','scenes':len(ss),'render_units':len(chapters),'spaces':len(set(spaces)),'diagram_grammars':len(set(diagrams)),'unique_actions':len(set(actions)),'unique_motion_signatures':len(set(motions)),'semantic_stage_minimum':len(ss)*12,'subtitle_cues':sum(len(s['cues']) for s in ss),'seconds':round(sum(s['duration'] for s in ss),2),'errors':errors,'timing_blockers':warn[:5]+(['...'] if len(warn)>5 else [])}
(R/'qa').mkdir(parents=True,exist_ok=True);(R/'qa/static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(2 if errors else 0)
