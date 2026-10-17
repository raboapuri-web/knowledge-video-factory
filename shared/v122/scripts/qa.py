#!/usr/bin/env python3
"""V130 static QA: transcript completeness, visual diversity, timing and subtitle geometry."""
import collections,json,pathlib,sys,re
R=pathlib.Path(__file__).resolve().parents[1]
scenes=json.loads((R/'content/scenes.json').read_text(encoding='utf-8'))
plans=json.loads((R/'content/visual_plan.json').read_text(encoding='utf-8'))
editorial=json.loads((R/'content/v130-shot-plan.json').read_text(encoding='utf-8'))['chapters']
chapters=['prologue']+[f'chapter{i}' for i in range(1,7)]+['epilogue']
errors=[];warning=[];ids=set();groups=collections.defaultdict(list)
for s in scenes:
    if s['id'] in ids:errors.append('duplicate scene ID '+s['id'])
    ids.add(s['id']);groups[s['chapter']].append(s)
    p=plans.get(s['motif'])
    if not p or p['kind'] not in {'forum','label','matrix','mirror','tribes','choice','question','experiment','balance','filter','family','scale','book','elephant','network','columns','logic','podium','research','bridge','spectrum','timeline','magnifier','nested','person','compass','loop','target'}:errors.append('missing style '+s['id'])
    if not (s['cues'] and s['duration']>=5):errors.append('missing cues '+s['id'])
    for c in s['cues']:
        lines=c['display'].split('\n')
        if len(lines)>2 or any(len(x)>19 for x in lines):errors.append('subtitle overflow '+s['id'])
        if '\\n' in c['display']:errors.append('escaped newline '+s['id'])
    if s['durationSource']!='VOICEVOX_MEASURED':warning.append(s['id'])
    if not (R/'src/scenes'/f"{s['id']}.tsx").exists():errors.append('scene TSX missing '+s['id'])
if len(scenes)!=79:errors.append('expected 79 scenes, got '+str(len(scenes)))
if set(groups)!=set(chapters):errors.append('wrong chapter set')
if len(plans)!=79:errors.append('visual plan incomplete')
if len({p['motion'] for p in plans.values()})!=79:errors.append('repeated motion signature')
if len({p['kind'] for p in plans.values()})<25:errors.append('insufficient visual types')
if len({p['labels'][0] for p in plans.values()})<70:errors.append('scene titles too repetitive')
for c in chapters:
    paragraphs=[re.sub(r'\s+','',p) for p in re.split(r'\n\s*\n',(R/'content'/f'v130-{c}.txt').read_text(encoding='utf-8').strip()) if p.strip()]
    if ''.join(p['narration'] for p in groups[c])!=''.join(paragraphs):errors.append('missing or modified narration '+c)
    if len(groups[c])!=len(editorial[c]):errors.append('missing chapter scenes '+c)
src=(R/'src/lib/meaningScene.tsx').read_text()
if 'const contentLayer' not in src or 'const subtitleTextLayer' not in src:errors.append('missing subtitle layers')
if src.find('contentLayer')>src.find('subtitleTextLayer'):errors.append('z order failed')
if len(re.findall(r'view.add\(',src))!=4:errors.append('unexpected layers')
if src.count("case '")<28:errors.append('not enough unique layout compositions')
if 'MICRO_BEATS_PER_SCENE=24' not in src:errors.append('missing 24-beat choreography')
report={'status':'BLOCKED' if errors else ('VOICEVOX_PENDING' if warning else 'READY'),
 'video':'V130','scenes':len(scenes),'chapters':len(groups),
 'uniqueLayoutTypes':len({p['kind'] for p in plans.values()}),'meaningVisualBeats':len(scenes)*24,
 'cues':sum(len(s['cues']) for s in scenes),'estimatedSeconds':round(sum(s['duration'] for s in scenes),1),
 'errors':errors,'voicePending':len(warning)}
(R/'qa').mkdir(exist_ok=True)
(R/'qa/static_qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2))
sys.exit(2 if errors else 0)
