/**
 * V46 prologue approval gate.
 * Does not render, synthesize, write or modify any approved source/video.
 * Invoke before producing any later chapter and on every change to V46 files.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(import.meta.dirname,'..');
const repo=path.resolve(root,'..');
const approved=JSON.parse(fs.readFileSync(path.join(root,'approvals/prologue.json'),'utf8'));
if(approved.videoId!=='V46'||approved.chapterId!=='prologue'||approved.approval?.status!=='approved'||approved.approval?.locked!==true)throw Error('V46 prologue must remain approved and locked.');
if(approved.approval?.doNotRerenderInSubsequentChapterProduction!==true)throw Error('Approved prologue rerender lock must stay enabled.');
const rel='v46hansyoku/approved-video/V46_PROLOGUE_APPROVED_20260925.mp4';
if(approved.approvedVideo?.durableStorage?.path!==rel)throw Error('Approved MP4 path has changed.');
const mp4=path.join(repo,rel);
if(!fs.statSync(mp4).size)throw Error('Approved MP4 missing or empty.');
const hex=crypto.createHash('sha256').update(fs.readFileSync(mp4)).digest('hex');
if(hex!==approved.approvedVideo.sha256||hex!=='7c3c8f76fd8819bf02174ea600ca211889bbf45f8be152719ad7a420664d5384')throw Error('Approved MP4 has been modified: SHA256 mismatch.');
const planPath=path.join(repo,approved.approvedDesign.path);
const bytes=fs.readFileSync(planPath);
const gitBlobHash=crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
if(gitBlobHash!==approved.approvedDesign.blobSha)throw Error('Approved prologue scene plan changed. Create an explicitly user-authorized revision instead.');
const plan=JSON.parse(bytes.toString('utf8'));
if(plan.scenes.length!==32||approved.approvedDesign.sceneCount!==32)throw Error('Approved scene count changed.');
console.log('V46 LOCKED: approved prologue MP4 '+hex+', source scene-plan '+gitBlobHash+'. Subsequent chapters may reuse but must not render or change this chapter.');
