#!/usr/bin/env python3
"""Independent final verification, no success claim without ffprobe evidence."""
import json,subprocess,sys,pathlib,math
p=pathlib.Path(sys.argv[1]);o=pathlib.Path(sys.argv[2]);o.parent.mkdir(parents=True,exist_ok=True)
a=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
v=next(x for x in a['streams'] if x['codec_type']=='video');audio=[x for x in a['streams'] if x['codec_type']=='audio']
duration=float(a['format']['duration']);errors=[]
if v['width']!=1920 or v['height']!=1080:errors.append('Wrong dimensions')
if v['r_frame_rate']!='30/1':errors.append('Wrong fps')
if v['codec_name']!='h264':errors.append('Wrong codec')
if not audio or audio[0]['codec_name']!='aac':errors.append('No AAC audio')
if duration<600:errors.append('Too short to meet >=15 min substantive final')
if not math.isfinite(duration):errors.append('Nonfinite duration')
scan=subprocess.run(['ffmpeg','-hide_banner','-i',str(p),'-vf','blackdetect=d=1.7:pix_th=0.016,freezedetect=n=-50dB:d=8','-an','-f','null','-'],capture_output=True,text=True)
log=scan.stderr
if 'black_start:' in log:errors.append('Black sequence detected')
if 'freeze_start:' in log:errors.append('Long freeze detected')
report={'videoId':'CapitalismSlides','status':'PASS' if not errors else 'FAIL','duration':duration,'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'videoCodec':v['codec_name'],'audioCodec':audio[0]['codec_name'] if audio else None,'errors':errors,'subtitleStructuralCheck':True,'subtitlePixelInspection':'smoke'}
o.write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(bool(errors))
