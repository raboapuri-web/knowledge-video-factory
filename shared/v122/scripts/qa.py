#!/usr/bin/env python3
import json,re,pathlib,sys,collections
R=pathlib.Path(__file__).resolve().parents[1];ss=json.loads((R/'content/scenes.json').read_text());vp=json.loads((R/'content/visual_plan.json').read_text())
errors=[];warn=[];ids=set();chapters=collections.defaultdict(list)
for s in ss:
    if s['id'] in ids:errors.append('duplicate '+s['id'])
    ids.add(s['id']);chapters[s['chapter']].append(s)
    if s['motif'] not in vp:errors.append('missing visual '+s['id'])
    if not s['cues'] or s['duration']<=3.0:errors.append('short scene '+s['id'])
    if any(c['end']<=c['start'] for c in s['cues']):errors.append('bad cue '+s['id'])
    if s['cues'][-1]['end']>s['duration']+.001:errors.append('timing overflow '+s['id'])
    for c in s['cues']:
        lines=c['display'].split('\n')
        if len(lines)>2 or any(len(x)>19 for x in lines):errors.append('subtitle overflow '+s['id'])
        if '\\n' in c['display']:errors.append('escaped newline '+s['id'])
    if s['durationSource']!='VOICEVOX_MEASURED_FRAME_LOCKED':warn.append(s['id']+' estimated')
expected={'prologue','chapter1','chapter2','chapter3','chapter4','chapter5','chapter6','epilogue'}
if len(ss)!=112:errors.append('expected 112 scenes got '+str(len(ss)))
if set(chapters)!=expected:errors.append('chapter set '+str(sorted(chapters)))
if any(len(chapters[c])!=14 for c in expected):errors.append('each render unit must contain 14 scenes')
if len(vp)!=112:errors.append('visual plans must equal 112')
plans=[vp[s['motif']] for s in ss]
actions=[p['action'] for p in plans];motions=[p['motionSignature'] for p in plans];bgs=[p['backgroundSignature'] for p in plans];programs=[p['actionProgram'] for p in plans]
if len(set(actions))!=112:errors.append('every narration requires a unique semantic action')
if len(set(motions))!=112:errors.append('every narration requires a unique motion signature')
if len(set(bgs))!=112:errors.append('every narration requires a unique background signature')
if set(programs)!=set(range(112)):errors.append('actionProgram must be unique 0..111')
spaces=[p['space'] for p in plans];diagrams=[p['diagram'] for p in plans];cams=[p['camera'] for p in plans]
if len(set(spaces))<45:errors.append('need at least 45 concrete spaces')
if len(set(diagrams))<40:errors.append('need at least 40 diagram grammars')
for i in range(1,len(plans)):
    if spaces[i]==spaces[i-1]:errors.append('adjacent background-space reuse '+ss[i]['id'])
    if diagrams[i]==diagrams[i-1]:errors.append('adjacent diagram reuse '+ss[i]['id'])
    if cams[i]==cams[i-1]:errors.append('adjacent camera reuse '+ss[i]['id'])
    if actions[i]==actions[i-1]:errors.append('adjacent action reuse '+ss[i]['id'])
src=(R/'src/lib/meaningScene.tsx').read_text()
for key in ['V134_SCENE_COUNT=112','V134_STAGE_COUNT=12','directorFlow','orderFor','buildSpace','buildDiagram','cameraFlow','backgroundSignature']:
    if key not in src:errors.append('missing renderer feature '+key)
if 'rotation(' in src or 'rotation:' in src:errors.append('rotation prohibited: keep diagrams frontal')
if src.count('view.add(')!=4:errors.append('root layers must stay separated into 4')
if 'slice(4)' not in src:errors.append('space and information layers must be staged independently')
implemented=set(re.findall(r"case'([^']+)'",src))
missing_spaces=sorted(set(spaces)-implemented);missing_diagrams=sorted(set(diagrams)-implemented)
if missing_spaces:errors.append('unimplemented spaces: '+','.join(missing_spaces))
if missing_diagrams:errors.append('unimplemented diagrams: '+','.join(missing_diagrams))
voice=(R/'scripts/synth_chapter.py').read_text()
if 'PRONUNCIATION_MAP' not in voice or 'spoken_text' not in voice:errors.append('VOICE pronunciation map missing')
report={'status':'BLOCKED' if errors else ('MEASURED_PENDING' if warn else 'READY_FOR_SMOKE_QA'),'video':'V134','scenes':len(ss),'render_units':len(chapters),'spaces':len(set(spaces)),'diagram_grammars':len(set(diagrams)),'unique_actions':len(set(actions)),'unique_motion_signatures':len(set(motions)),'unique_backgrounds':len(set(bgs)),'semantic_stage_minimum':len(ss)*12,'subtitle_cues':sum(len(s['cues']) for s in ss),'seconds':round(sum(s['duration'] for s in ss),2),'errors':errors,'timing_blockers':warn[:5]+(['...'] if len(warn)>5 else [])}
(R/'qa').mkdir(parents=True,exist_ok=True);(R/'qa/static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(2 if errors else 0)
