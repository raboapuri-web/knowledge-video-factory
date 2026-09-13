import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const file=path.join(root,'src/script-data.json');
const data=JSON.parse(fs.readFileSync(file,'utf8'));

data.videoId='V37.1-kyoto-paradox';
data.title='なぜ京都人は、笑顔のまま人を排除できるのか？【語用論×ポライトネス理論】';

const byId=Object.fromEntries(data.beats.map((b)=>[b.id,b]));
const set=(id,visual,narration)=>{if(!byId[id]) throw new Error(`Missing ${id}`);byId[id].visual=visual;byId[id].narration=narration;};

set('S02','wristwatch_glance',"すると、家の主人が、あなたの手首にちらりと目をやる。そして、にこやかに言う。『ええ腕時計どすなあ』。あなたも、つられて自分の腕時計を見る。午後10時。『あ……もうこんな時間ですね』。");
set('S03','wristwatch_semantic_chain',"主人は笑う。あなたも笑う。『そろそろ失礼します』。そう言って、あなたは帰る準備を始める。奇妙である。主人は一度も『帰ってください』とは言っていない。文字通り受け取れば、腕時計を褒めただけである。");
set('S04','legend_disclaimer',"もちろん、京都に住む人が全員こうした会話をするわけではない。『ええ腕時計どすな』が京都で固定的に『帰れ』を意味するわけでもない。ぶぶ漬けの話と同じで、京都の遠回しさを象徴する文化的な小話として考えた方がいい。");
set('S06','implication_layers_wristwatch',"先ほどの『ええ腕時計どすな』という言葉。紙に書けば、ただ腕時計を褒めている。しかし、夜10時。長居している客。主人の視線が客の手首に落ちる。その直後にこの言葉が来る。すると、表面の意味の下に、別の意味が立ち上がる。腕時計を見てほしい。時間に気づいてほしい。そろそろ帰る頃だと判断してほしい。");
set('S08','compressed_conversation_wristwatch',"『ええ腕時計どすな』は、辞書的には褒め言葉なのに、状況によっては退室を促す信号に変わる。意味の大部分を、受信側で復元させている。京都の会話は、圧縮ファイルなのかもしれない。問題は、解凍ソフトを持っていない客もいることである。");
set('S13','indirect_wristwatch',"そこで、客の腕時計を褒める。『ええ腕時計どすな』。客が自分の腕時計を見る。午後10時。そして客自身が、『あ、もうこんな時間ですね。そろそろ失礼します』と言う。主人は帰れと言っていない。客も帰れと言われていない。しかし、客はいなくなった。目的だけは、完璧に達成されている。");
set('S15','responsibility_dissolve_wristwatch',"しかも、この方法にはもう一つ利点がある。責任が消える。『帰ってください』なら、客が帰った原因は主人である。しかし『ええ腕時計どすな』なら、客は自分で腕時計を見て、自分の判断で帰ったという形になる。命令が消えている。しかし、効果は残っている。");
set('S17','midnight_inference_wristwatch',"真夜中、友人の家で話している。相手が自分の腕時計をちらりと見る。『明日、早いんだよね』と言う。普通の人は、『明日の起床時刻について情報提供された』とは考えない。帰ろうかな、と考える。文脈を共有しているからである。");
set('S19','membership_language_wristwatch',"つまり、遠回しな言語は、情報を伝えるだけではない。その意味を読み取れるかどうかによって、内側の人間と外側の人間を分けることもできる。会話そのものが、会員証になる。『ええ腕時計どすな』『ありがとうございます』。主人としては、何も終わっていない。");
set('S30','civilized_refusal_wristwatch',"『帰ってください』。無表情で言えば険悪になる。客の腕時計へ視線を落として、『ええ腕時計どすな』。笑顔で言えば、社会は続く。目的は同じ。社会的コストが違う。");
set('S47','finale_wristwatch_return',"最初の夜へ戻ろう。主人の視線が、あなたの腕時計へ落ちる。そして笑顔で言う。『ええ腕時計どすなあ』。あなたも自分の腕時計を見る。午後10時。『あ、もうこんな時間ですね。そろそろ失礼します』。主人はさらに笑顔になる。『いやいや。そんなつもりやないんですけど』。完璧である。");

// Guard against the old wall-clock motif returning to the revised production.
for(const b of data.beats){
  if(/壁に掛かった時計|壁の時計/.test(b.narration)) throw new Error(`Wall clock remains in ${b.id}`);
}
if(data.beats.length!==48) throw new Error(`Expected 48 beats, got ${data.beats.length}`);
fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n');
console.log('V37.1 revisions applied: wristwatch motif + 48 beats');
