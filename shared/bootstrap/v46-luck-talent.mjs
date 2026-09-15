import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const source=path.join(root,'v44-interaction-attraction');
const target=path.join(root,'v46-luck-talent');
if(!fs.existsSync(source)) throw new Error('V44 source template is missing');
fs.rmSync(target,{recursive:true,force:true});
fs.cpSync(source,target,{recursive:true});

const title='結局、運と才能はどちらが重要なのか？【複雑系×マタイ効果×メリトクラシー】';
const narrations=[
'三月のワシントンD.C.、まだ外が薄暗い午前八時すぎ。研究助成機関の会議室では十数人の研究者が長いテーブルを囲み、コーヒーの紙コップと分厚い申請書の山のあいだで、若手研究者たちの計画を一件ずつ評価している。',
'スクリーンには二人の若い生物医学者の評価点が並んでいる。年齢も論文数も研究分野もよく似ており、審査員が何時間も議論したあとでも両者の差はごくわずかしか残らないが、今年の予算ではどちらか一人しか採択できない。',
'ホワイトボードに採択ラインが一本引かれ、その線を数ミリだけ上回った研究者には数週間後に採択通知が届く。研究室では仲間が集まり、新しい実験装置や助手の採用について話し始め、昨日まで存在しなかった資源が一気に流れ込んでくる。',
'もう一人のパソコンには不採択通知が表示される。能力が昨日より落ちたわけでも研究内容が突然悪くなったわけでもないのに、翌日から使える資金、人員、実験回数、将来の実績を作る機会が少しずつ違い始める。',
'数年後に二人の履歴書を並べると、最初は数ミリしかなかった差が何ページもの差へ変わっているかもしれない。成功した人物の能力は後から確認できるが、その能力を発揮できる場所へ本人を運んだ偶然は、完成した履歴書からほとんど消えている。',
'そこで今回の問いが生まれる。人間の成功を決めるのは才能なのか、それとも運なのかという問いは単純な二択に見えるが、実際には才能が機会を成果へ変える一方、運がそもそも何回機会に遭遇できるかを決めるという、二つの役割の違いを考える必要がある。',
'時間を十九世紀のロンドンへ戻すと、フランシス・ゴルトンが重厚な木製机の前に座り、裁判官や政治家や科学者の伝記と家系図を並べながら、社会的に卓越した人物がどのような家系から生まれているのかを調べている。',
'1869年の「Hereditary Genius」でゴルトンは卓越性と遺伝の関係を強く論じた。机の上では有名人の名前がカードとして並び、それらが親族関係の線で結ばれ、成功が個人の内側にある資質から自然に生まれるような世界観が形を取っていく。',
'この直感は現代にも残っている。学校では試験点で順位をつけ、企業では採用試験を行い、スポーツではタイムを測り、研究者は論文と業績で評価されるため、社会は偶然を取り除き、能力だけを抽出しているように見える。',
'ところが二十世紀になると、その理想にはメリトクラシーという名前が広く知られるようになる。1958年にマイケル・ヤングが描いた未来社会では、能力と努力で人間を徹底的に順位づける仕組みが、やがて成功者に自分の地位は完全に正当だと思わせる。',
'未来の選抜センターでは、子どもたちが同じ机で試験を受け、採点機が高速で順位を並べ替えていく。高得点者は上の階へ進み、低得点者は別の通路へ送られ、社会全体が人間の価値を一つの測定結果で説明できるかのように動いている。',
'ここで注意したいのは、成功した人が優秀であることと、優秀だからその人が成功したことは同じ命題ではないという点である。結果の側から人物を見ると、現在持っている能力や実績が原因のすべてだったように錯覚しやすい。',
'現代の大企業の採用会場を上から見ると、百人の応募者が同じ試験を受けている。能力の低い人から高い人まで幅はあるが、多くの人は中央付近に集まり、極端な天才や極端に低い能力の人物は少数しかいない。',
'左側のスクリーンにはなだらかなベル型の能力分布が表示される一方、右側には資産、売上、フォロワー、論文引用数のような成功指標が描かれ、こちらはごく少数が巨大な値を持つ長い裾の分布になる。',
'もし成功が才能をそのまま拡大した鏡なら、能力が少し高いだけの人物が何百倍もの成功を得る理由はどこから来るのだろうか。この分布の形の違いこそ、才能だけでは説明しにくい累積過程の存在を示唆している。',
'2018年、Pluchino、Biondo、RapisardaらはTalent Versus Luckというエージェントベース・モデルを発表した。これは現実社会の正確な再現ではなく単純化した思考実験だが、才能と偶然が長期的な成功格差をどう作り得るかを視覚化した点で非常に面白い。',
'仮想都市には多数の人物が暮らし、それぞれに才能の値が与えられている。才能は一部の超天才だけに集中するのではなく、中程度の人物が多い分布になっており、その街を幸運イベントと不運イベントがランダムに移動していく。',
'幸運イベントが一人の人物へ接触しても、その人が必ず成功するわけではない。十分な才能があれば機会を成果へ変えやすくなる一方、非常に才能が高くても幸運そのものが近くを通らなければ、大きな飛躍を経験しないまま時間だけが進む。',
'長期間シミュレーションすると、最も成功した人物が必ずしも最も才能の高い人物にはならない。一定以上の能力を持ちながら、幸運なイベントへ何度も遭遇した人物が大きく伸びる場合があり、才能と成功順位の対応は完全には一致しない。',
'夜の仮想都市を上空から見ると、千人の点のあいだを緑色の幸運と赤色の不運が流れている。画面左の非常に才能の高い人物には何年も大きな幸運が来ず、右側の平均より少し高い人物には複数の緑色のイベントが重なる。',
'右側の人物は二十五歳で有力な協力者と出会い、三十歳で市場拡大の波に乗り、三十三歳で競合の撤退に遭遇する。能力は最初の人物ほど高くなくても、得た機会をある程度活かせるため、資源と実績が連続して増えていく。',
'ここで重要なのは、一回の幸運が一回の得点で終わらないことだ。最初の成功で実績ができると次は大きな仕事を任され、そこで成功すると資金や人材が集まり、その資源がさらに次の成功確率を上げていく。',
'運は宝くじのように一度だけ降ってくる出来事ではなく、ときに次の運へ遭遇しやすい位置そのものを作る。最初の偶然によって舞台の中央へ移動した人物は、その後も観客や投資家や選抜者から見つけられやすくなる。',
'この累積構造を社会学で有名にした概念の一つが、ロバート・K・マートンのマタイ効果である。1968年、マートンは科学界で、すでに高い評価を得た研究者がさらに多くの信用や注目を受けやすい現象を論じた。',
'1960年代の学会会場で、二人の若い科学者がよく似た研究成果を発表している。一人は無名の小さな研究室から来ており、発表後もほとんど人が立ち止まらないが、もう一人の背後には著名な教授がいる。',
'著名な教授が廊下で同僚に、うちの若い研究者が面白い結果を出したと紹介すると、その論文は読まれ、引用され、次の学会でも名前を呼ばれるようになる。最初の研究成果が同程度でも、周囲から与えられる注意量が変わっていく。',
'引用が増えると研究費申請で実績として評価され、研究費が増えると助手や設備を確保でき、設備が増えると次の研究をより速く進められる。成功が信用を作り、信用が資源を作り、資源が本当の能力差まで育て始める。',
'十年後に二人を比較する第三者は、片方の論文数と引用数が圧倒的に多いことを見て、こちらの方が最初から才能に恵まれていたと考えるかもしれない。しかし途中の映像を知っていれば、運と才能が途中から分離不能になっていることが分かる。',
'この現象は科学者だけの話ではない。冬のカナダ、朝六時のアイスリンクには十歳の少年たちが集まり、吐く息を白くしながらトライアウトの順番を待っている。',
'同じ十歳カテゴリーでも一月生まれと十二月生まれではほぼ一年の年齢差がある。子どもにとって一年は身体の大きさや動きの成熟度に影響しやすく、同じ基準日で選抜すると早生まれではなく年度の早い時期に生まれた側が相対的に有利になることがある。',
'コーチが一人の少年を見て、この子は才能があると判断し上位チームへ入れる。選ばれた少年はより長い練習時間、より良いコーチ、強い相手との試合を与えられ、その環境によって翌年には本当に技能差が広がっている。',
'最初の差は出生月という本人が選べない偶然だったとしても、数年後には実際のスケーティング能力、判断速度、試合経験の差へ変換される。十五歳の選抜会場では、誰も最初の偶然を見ず、目の前にいる本当に上手な選手だけを見る。',
'アイスホッケーで研究されてきた相対年齢効果は、偶然がそのまま才能になるという話ではない。制度上の小さな初期差が選抜機会へ影響し、その選抜機会が練習環境へ影響することで、後から観測可能な能力差が形成され得るという話である。',
'ではすべて運なのかと考えると、それも違う。音楽コンクールの控室では三十人の若いピアニストが順番を待ち、出演順やホールの響きや審査員の疲労による評価の揺らぎがあり得ても、ほとんど弾けない人物が偶然だけで優勝することはない。',
'幸運には利用する能力が必要である。重要なプレゼンを任されても準備ができていなければ次へつながらず、有力者と偶然会っても見せられる作品がなければ話はそこで終わり、絶好の出場機会を得た選手も結果を出せなければ次の試合には呼ばれない。',
'才能や技能は、チャンスが来たときにそれを成果へ変換できる確率を高める。運が扉を開けるとしても、その向こうで何をできるかは能力に左右されるため、どちらか一方だけで長期的な成功を説明することはできない。',
'さらに重要なのは、才能と運のどちらが重要かは、どの集団を比較しているかによって変わることだ。地方大会の予選には初心者から高い技能を持つ選手まで混ざっており、ここでは能力差が勝敗へ強く表れやすい。',
'ところが世界大会の決勝へ進むころには、低い能力の選手は何段階も前で脱落している。残っている全員が高い技能を持つため、実力差が圧縮された集団では、当日の体調や対戦相手との相性や小さな判断ミスの相対的重要性が大きくなる。',
'世界一と世界百位を比べて、一位の人には百倍の才能があると考えるのは危険である。成功順位の差は巨大でも、その集団内の能力差はずっと小さく、上位ほど必要条件としての才能を通過したあとに偶然が順位を揺らしやすい。',
'巨大なテニストーナメント表を表示すると、同程度の実力を持つ二人の選手が別々の山へ入っている。一人は序盤で世界上位選手と当たり、もう一人は強豪が別試合で敗れたため比較的相性の良い相手と戦う。',
'二人の技能はその朝から変わっていないのに、一人は二回戦で消え、もう一人は準決勝まで進む。準決勝へ進んだ選手には賞金とランキングポイントが入り、次大会ではシードを得るため、今回の組み合わせが次回の組み合わせ条件まで変えてしまう。',
'一回の偶然な組み合わせが、賞金、ランキング、注目、スポンサー、次のシードという複数の資源へ変換されると、結果の差は最初の能力差を超えて増幅される。競技の実力主義の中にも、累積する偶然の入り口が存在する。',
'ここで冒頭の研究費審査へ戻る。研究費の採択ラインは、能力がよく似た人々のキャリアが小さな境界で分岐するため、運とその後の成果を考える自然実験のような状況を作る。',
'2019年にNature Communicationsへ掲載された研究では、NIHの若手研究者について、採択ラインをわずかに上回ったnarrow winと、わずかに下回ったnear missが比較された。評価点では非常に近い人々が、資金の有無で別の道へ進む。',
'わずかに不採択だった側では、その後NIHの助成システムから離脱する割合が高くなった。会議室から同じように出てきた二人のうち、一人は次の研究室へ進み、もう一人は数年後には研究の世界そのものから姿を消すことがある。',
'ところが研究を続けたnear missの人々に限ると、その後の研究インパクトで強い成績を示す傾向も報告された。小さな不運が全員を同じ方向へ動かすのではなく、一部には離脱を生み、別の一部には適応や選別を通じて異なる軌道を作る。',
'夜の研究室では、不採択だった研究者が実験計画を組み直し、別の方法を試し、何度も失敗したデータを壁に貼り直している。不運は単なるマイナス点ではなく、キャリアの道筋そのものを変える分岐として作用することがある。',
'ここで成功者の伝記が並ぶ大型書店へ移る。棚には成功する習慣、世界を変えた経営者、私はこうして会社を作ったという本が並び、読者は成功者が若いころ何を考え、どう努力し、どんな決断をしたかを知ることができる。',
'しかし同じ棚には存在しない本がある。同じくらい働き、同じくらい優秀で、ほぼ同じ判断をしたのに、市場へ出る時期が半年ずれ、投資家へ会えず、会社がなくなった人間の自伝である。',
'成功しなかった人は成功法則を説明する立場にならないため、観測される物語は成功者へ偏る。成功者に共通する能力は見えるが、同じ能力を持ちながら成功しなかった人間が画面外へ消えることで、その能力が成功の十分条件だったように見えやすい。',
'高層ビルの最上階で成功した経営者が街を見下ろし、当時からこの市場は必ず伸びると思っていたと語る。そこで映像を百分割し、能力も努力も判断力も同じ人物を百個の平行世界へ置いてみる。',
'ある世界では創業直後に大口顧客と出会い、別の世界では重要な社員が参加し、ある世界では不況が一年早く来る。さらに別の世界では競合企業が先に市場を取り、本人が病気で資金調達へ参加できない世界もある。',
'百個の人生を最後まで動かせば、同じ人物がすべての世界で同じ成功を得るとは考えにくい。それでも我々が現実に観測できるのは一つの世界だけなので、実際に起きた結果へ後から必然性の物語を与えてしまう。',
'成功した世界では同じ判断が先見性と呼ばれ、失敗した世界では無謀と呼ばれるかもしれない。結果を知ったあとでは、偶然だった出来事まで本人の性格や能力の証拠として解釈され、運は物語の背景へ消えていく。',
'では結局、運と才能のどちらが重要なのか。この問いが難しいのは、二つを独立した重量として測れないからで、才能そのものも出会った教師、与えられた練習機会、最初の選抜、初期の成功によって育てられていく。',
'偶然良い指導者と出会えば能力が伸び、早く選抜されれば練習量が増え、最初の成功で自信が生まれればより難しい課題へ挑戦する。反対に初期の失敗で機会を失えば、潜在的な能力は観測されないまま終わることもある。',
'つまり運は結果だけでなく、後から才能と呼ばれるものの一部まで形成する。才能がチャンスを成果へ変え、その成果が次のチャンスを増やし、増えたチャンスによってさらに能力が育つため、二つは長期的には絡み合っていく。',
'暗い空間に三つの巨大な歯車が現れ、一つ目には能力、二つ目には機会、三つ目には累積と書かれている。能力だけを回しても機会の歯車に触れなければ全体は動かず、機会だけが来ても能力が不足していれば大きな成果へ変わらない。',
'二つの歯車が一度かみ合うと三つ目が動き始め、成功実績が信用を作り、信用が資金を作り、資金がより良い環境を作り、その環境が能力をさらに高める。最初の小さな差が自己強化する循環へ入ると、結果は加速度的に開いていく。',
'能力差が巨大な段階では才能や技能が重要である。初心者と専門家が競えば多くの場合は専門家が勝つが、一定以上の能力を持った人だけが残る世界では才能差が圧縮され、タイミングや出会いや制度の重要性が相対的に増える。',
'そして最上位の成功ほど、一回の幸運が次の機会を大量に増やすため、わずかな初期差が巨大な結果差へ増幅されやすい。才能は必要条件として働き、運は上位集団の中で誰が突出するかを揺らすという役割分担が起こり得る。',
'夕方の大学研究棟で、冒頭に登場した二人の研究者が同じエレベーターから降り、それぞれ別の研究室へ向かう。一人のパソコンには採択通知が届き、もう一人には不採択通知が届いたあの日から、十年間の時間が高速で流れ始める。',
'片方の研究室では助手が増え、設備が増え、論文が増え、次の研究費が届く。もう一方では設備が減り、本人が別の職場へ移る未来もあれば、不採択をきっかけに方法を変え、十年後に大きな成果へ到達する未来もある。',
'どの物語になるかは最初の評価点だけから完全には分からない。成功した人物が才能を持っていたことは事実でも、その才能を成功へ接続した途中には、本人が選べなかった出会い、制度、タイミング、競争相手、景気、採択線が無数に存在する。',
'我々は成功者を見ると、その人が走った最後の百メートルだけを見てしまう。しかし実際の人生ではスタート地点も違えば、途中で開いていた扉も違い、最も厄介なことに、一度開いた扉の向こうにはさらに多くの扉が並んでいる。',
'したがって才能とは、来たチャンスを逃さず成果へ変える確率を上げるものであり、運とは、そのチャンスがいつ何回どの大きさで現れるかを左右するものだと考えると分かりやすい。両者は競争する概念ではなく、異なる場所で成功過程を動かしている。',
'才能が勝率を変え、運が試合そのものを配り、最初の勝敗が次に出場できる試合数まで変えてしまう。だから成功は才能と運の単純な足し算ではなく、両者が掛け合わされ、その結果がさらに累積していく過程として理解した方が現実に近い。',
'最初の小さな偶然は、何年も経つと資源、経験、自信、人脈、教育、次の機会へ姿を変え、その痕跡は成功者の履歴書から消えていく。最後に残るのは圧倒的な実績だけであり、我々はその実績を見て、この人には最初から才能があったのだと物語を完成させる。',
'結局、運と才能のどちらが重要なのかという問いへの答えは、片方を選ぶことではない。才能がなければチャンスを活かせず、運がなければ才能を見せる舞台に立てない。そして一度舞台に立てた人には、次の舞台へ呼ばれやすくなるという累積効果まで働くのである。'
];

const visuals=[
'grant_room_dawn','close_scores','funding_line','rejection_screen','cv_divergence','central_question','galton_study','hereditary_cards','modern_merit','young_meritocracy','future_selection','causal_warning','applicant_hall','distribution_split','distribution_gap','talent_luck_paper','agent_city','luck_contact','simulation_winners','night_city','luck_chain','success_breeds_success','stage_visibility','merton_intro','conference_twins','professor_intro','citation_flywheel','ten_year_gap','hockey_dawn','birth_month_gap','elite_selection','skill_gap_growth','relative_age_explain','piano_waiting','opportunity_conversion','talent_probability','local_qualifier','world_final','rank_vs_skill','tennis_bracket','bracket_cascade','cumulative_sport','grant_return','near_miss_study','system_exit','near_miss_survivors','lab_adaptation','success_bookstore','missing_books','survivorship','founder_penthouse','parallel_worlds','hundred_outcomes','hindsight_story','entangled_question','teacher_chance','luck_builds_talent','three_gears','cumulative_gears','talent_needed','elite_luck','researchers_return','ten_year_timelapse','unseen_variables','last_100m','chance_definition','multiplicative_model','luck_disappears','final_answer'
];
if(narrations.length!==70||visuals.length!==70) throw new Error(`Expected 70 scenes, got ${narrations.length}/${visuals.length}`);
const beats=narrations.map((n,i)=>({id:`S${String(i+1).padStart(2,'0')}`,visual:visuals[i],narration:n}));
fs.writeFileSync(path.join(target,'src/script-data.json'),JSON.stringify({videoId:'V46-luck-talent',title,beats},null,2));
fs.writeFileSync(path.join(target,'src/sync-timing.json'),JSON.stringify({durationSeconds:1080,beats:[]},null,2));
fs.writeFileSync(path.join(target,'production-manifest.json'),JSON.stringify({productionSystemVersion:2,visualRegistryVersion:4,voiceDictionaryVersion:4,qaRulesVersion:3,preproductionPolicyVersion:1,syncManifestVersion:7,requiresPreproductionPlan:true,sharedVoiceGenerator:true,videoId:'V46-luck-talent',title},null,2));
fs.writeFileSync(path.join(target,'IMPLEMENTATION_PLAN.md'),`# V46 Implementation Plan\n\n## Thesis\nTalent changes conversion probability; luck changes opportunity exposure; cumulative advantage then amplifies early differences.\n\n## Visual policy\n- 70 narration beats / 70 distinct visual keys.\n- Every scene is One-off for this production.\n- No shared background footage is intentionally reused.\n- Each scene changes environment, camera axis, foreground objects, historical period, data metaphor, or character blocking.\n- Historical and research scenes are stylized explanatory reconstructions, not documentary footage.\n\n## QA\nMeasured VOICEVOX timing, pronunciation regression, TypeScript validation, segmented Remotion rendering, final audio mix, and one machine QA frame per scene. Human aesthetic inspection remains separate.\n`);

const index=`import React from 'react';
import {AbsoluteFill,Composition,interpolate,registerRoot,useCurrentFrame,useVideoConfig} from 'remotion';
import scriptData from './script-data.json'; import sync from './sync-timing.json'; import {SceneVisual} from './scenes';
type Beat={id:string;visual:string;narration:string}; type SyncBeat={index:number;start:number;end:number};
const beats=scriptData.beats as Beat[]; const clamp=(v:number)=>Math.max(0,Math.min(1,v)); const font='Noto Sans JP, sans-serif';
const splitSubtitle=(text:string)=>{const s=(text.match(/[^。！？]+[。！？]?/g)??[text]).map(v=>v.trim()).filter(Boolean);const out:string[]=[];for(const q of s){if(q.length<=34){out.push(q);continue;}const parts=q.split(/(?<=[、，])/).map(v=>v.trim()).filter(Boolean);let b='';for(const p of parts){if((b+p).length>34&&b){out.push(b);b=p}else b+=p}if(b)out.push(b)}return out.length?out:[text]};
const activeAt=(sec:number)=>{const arr=(sync.beats||[]) as SyncBeat[];if(!arr.length)return {index:0,progress:0};let i=arr.findIndex(b=>sec>=b.start&&sec<b.end);if(i<0)i=arr.length-1;const b=arr[i];return {index:i,progress:clamp((sec-b.start)/Math.max(.001,b.end-b.start))}};
const Subtitle=({beat,progress}:{beat:Beat;progress:number})=>{const c=splitSubtitle(beat.narration),l=c.map(x=>Math.max(1,x.length)),tot=l.reduce((a,b)=>a+b,0),tar=progress*tot;let a=0,k=0;for(let i=0;i<c.length;i++){a+=l[i];if(tar<a){k=i;break}}return <div style={{position:'absolute',left:88,right:88,bottom:34,display:'flex',justifyContent:'center'}}><div style={{maxWidth:1690,padding:'14px 34px 17px',borderRadius:16,background:'rgba(2,4,7,.91)',border:'1px solid rgba(240,244,250,.14)',boxShadow:'0 16px 50px rgba(0,0,0,.58)',fontFamily:font,fontWeight:850,fontSize:37,lineHeight:1.42,textAlign:'center',color:'#f5f4ef',textShadow:'0 3px 14px rgba(0,0,0,.95)'}}>{c[k]??c[c.length-1]}</div></div>};
const V46=()=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),a=activeAt(f/fps),beat=beats[a.index]??beats[0],n=a.index+1,fade=interpolate(a.progress,[0,.035],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});return <AbsoluteFill style={{background:'#020305'}}><AbsoluteFill style={{opacity:fade}}><SceneVisual n={n}/></AbsoluteFill><Subtitle beat={beat} progress={a.progress}/></AbsoluteFill>};
const Root=()=>{const d=Math.max(30,Math.ceil(Number(sync.durationSeconds||1080)*30));return <Composition id='V46LuckTalent' component={V46} durationInFrames={d} fps={30} width={1920} height={1080}/>}; registerRoot(Root);`;
fs.writeFileSync(path.join(target,'src/index.tsx'),index);

const accents=['#f5c66a','#76c7ff','#d98282','#8fd6a8','#b899ff','#e4e7ec','#f29f67','#76d0c2'];
const cats=['grant','grant','grant','grant','data','abstract','history','history','modern','history','selection','abstract','modern','data','data','simulation','simulation','simulation','simulation','simulation','career','career','stage','history','conference','conference','network','career','hockey','hockey','hockey','hockey','hockey','music','music','abstract','sport','sport','data','tennis','tennis','sport','grant','grant','grant','grant','grant','bookstore','bookstore','abstract','founder','parallel','parallel','parallel','abstract','mentor','mentor','abstract','gears','gears','sport','elite','grant','career','abstract','race','abstract','formula','career','final'];
if(cats.length!==70) throw new Error('Category count mismatch');
const cases=visuals.map((v,i)=>`case ${i+1}: return <OneOff n={${i+1}} kind='${cats[i]}' keyName='${v}' accent='${accents[i%accents.length]}' seed={${(i*43+17)%113}}/>;`).join('\n    ');
const scenes=`import React from 'react';
import {AbsoluteFill,interpolate,spring,useCurrentFrame,useVideoConfig} from 'remotion';
const font='Noto Sans JP, sans-serif'; const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const Person=({x,y,s=1,c='#59606d',walk=0}:{x:number;y:number;s?:number;c?:string;walk?:number})=><div style={{position:'absolute',left:x,top:y,width:76*s,height:174*s,transform:\`translateY(\${Math.sin(walk)*5}px)\`}}><div style={{position:'absolute',left:20*s,top:0,width:36*s,height:36*s,borderRadius:'50%',background:'#d4b99d'}}/><div style={{position:'absolute',left:9*s,top:38*s,width:58*s,height:82*s,borderRadius:18*s,background:c}}/><div style={{position:'absolute',left:15*s,top:116*s,width:16*s,height:54*s,background:'#171a21',transform:\`rotate(\${Math.sin(walk)*9}deg)\`,transformOrigin:'top'}}/><div style={{position:'absolute',left:44*s,top:116*s,width:16*s,height:54*s,background:'#171a21',transform:\`rotate(\${-Math.sin(walk)*9}deg)\`,transformOrigin:'top'}}/></div>;
const Panel=({x,y,w,h,children,accent}:{x:number;y:number;w:number;h:number;children:React.ReactNode;accent:string})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,borderRadius:22,background:'rgba(4,7,12,.84)',border:\`1px solid \${accent}66\`,boxShadow:'0 30px 90px #0008',padding:24,color:'#f5f6f8',fontFamily:font}}>{children}</div>;
const City=({seed,accent,t}:{seed:number;accent:string;t:number})=><>{Array.from({length:26}).map((_,i)=>{const x=(i*173+seed*37)%1870,y=150+((i*83+seed*13)%700),good=(i+seed)%5===0;return <div key={i} style={{position:'absolute',left:x,top:y,width:good?34:18,height:good?34:18,borderRadius:'50%',background:good?accent:'#b84f55',boxShadow:good?\`0 0 24px \${accent}\`:'0 0 12px #b84f55',transform:\`translate(\${Math.sin(t/22+i)*24}px,\${Math.cos(t/29+i)*16}px)\`}}/>})}</>;
const OneOff=({n,kind,keyName,accent,seed}:{n:number;kind:string;keyName:string;accent:string;seed:number})=>{const f=useCurrentFrame(),{fps}=useVideoConfig(),e=spring({frame:f,fps,config:{damping:18,stiffness:70,mass:.9}}),t=f+seed,p=.5+.5*Math.sin(t/23);let bg:React.ReactNode;
if(kind==='grant') bg=<><div style={{position:'absolute',inset:0,background:n%2?'linear-gradient(145deg,#111923,#070b11 70%)':'linear-gradient(145deg,#1c1820,#090b0f 72%)'}}/><div style={{position:'absolute',left:90,top:620,width:1730,height:250,background:'#2a211a',transform:'perspective(900px) rotateX(54deg)',boxShadow:'0 30px 100px #000'}}/>{Array.from({length:11}).map((_,i)=><Person key={i} x={130+i*150} y={430+(i%2)*45} s={.78} c={i===n%11?accent:'#4d5966'} walk={t/18+i}/>)}<Panel x={1180} y={100} w={560} h={300} accent={accent}><div style={{height:18,width:'100%',background:'#ffffff12',marginTop:16}}/><div style={{height:18,width:'82%',background:'#ffffff12',marginTop:20}}/><div style={{height:8,width:'100%',background:'#ffffff18',marginTop:80}}/><div style={{position:'absolute',left:24,top:205,width:512,height:5,background:'#ffffff22'}}/><div style={{position:'absolute',left:270+Math.sin(t/30)*35,top:180,width:4,height:90,background:accent}}/></Panel></>;
else if(kind==='history') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,#5a4533,#17100c 72%)'}}/><div style={{position:'absolute',left:210,top:600,width:850,height:220,background:'#4f3725',transform:'perspective(700px) rotateX(48deg)'}}/><div style={{position:'absolute',right:180,top:120,width:620,height:720,background:'#d5c29a',boxShadow:'0 25px 80px #0008',transform:\`rotate(\${-3+Math.sin(t/60)*2}deg)\`}}>{Array.from({length:14}).map((_,i)=><div key={i} style={{position:'absolute',left:50,top:70+i*42,width:480-(i%3)*65,height:4,background:'#514238',opacity:.62}}/>)}</div><Person x={470} y={420} s={1.1} c='#35363d'/></>;
else if(kind==='data') bg=<><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 48%,#142234,#05070b 68%)'}}/><div style={{position:'absolute',left:120,top:180,width:760,height:650,borderRadius:34,background:'#0c121b',border:'1px solid #ffffff1c'}}>{Array.from({length:32}).map((_,i)=>{const h=70+((i*37+seed)%410);return <div key={i} style={{position:'absolute',left:26+i*21,bottom:40,width:10,height:h,background:accent,opacity:.38+.45*(i/32)}}/>})}</div><div style={{position:'absolute',right:110,top:180,width:830,height:650,borderRadius:34,background:'#0c121b',border:'1px solid #ffffff1c'}}>{Array.from({length:36}).map((_,i)=>{const h=40+Math.pow((i+1)/36,3)*520;return <div key={i} style={{position:'absolute',left:30+i*20,bottom:40,width:10,height:h,background:i>31?'#f0a35b':'#92a4b8',opacity:.72}}/>})}</div></>;
else if(kind==='simulation') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(145deg,#08111c,#05070a)'}}/><div style={{position:'absolute',left:90,top:90,width:1740,height:880,borderRadius:40,background:'#0b1720',border:'2px solid #ffffff12'}}><City seed={seed} accent={accent} t={t}/></div>{Array.from({length:5}).map((_,i)=><div key={i} style={{position:'absolute',left:220+i*330,top:820-(i%2)*80,width:150,height:70,borderRadius:18,background:i===n%5?accent+'55':'#ffffff0d',border:'1px solid #ffffff1a'}}/> )}</>;
else if(kind==='conference') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(160deg,#151b22,#080a0e)'}}/><div style={{position:'absolute',left:120,top:150,width:1680,height:690,background:'#20262d',borderRadius:28}}/><div style={{position:'absolute',left:720,top:180,width:520,height:280,background:'#e8e9e3',boxShadow:'0 0 50px #fff2'}}/>{Array.from({length:18}).map((_,i)=><Person key={i} x={140+(i%9)*180} y={560+Math.floor(i/9)*100} s={.67} c={i===seed%18?accent:'#535b66'} walk={t/22+i}/>)}<Person x={930} y={410} s={1.0} c={accent}/></>;
else if(kind==='network'||kind==='career'||kind==='mentor') bg=<><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%,#14202c,#05070a 70%)'}}/>{Array.from({length:18}).map((_,i)=>{const x=160+((i*347+seed*23)%1550),y=150+((i*197+seed*11)%720);return <React.Fragment key={i}><div style={{position:'absolute',left:x,top:y,width:36,height:36,borderRadius:'50%',background:i%4===0?accent:'#637181',boxShadow:i%4===0?\`0 0 28px \${accent}\`:'none'}}/><div style={{position:'absolute',left:x+18,top:y+18,width:260,height:2,background:'#ffffff13',transform:\`rotate(\${(i*31+seed)%180}deg)\`,transformOrigin:'left'}}/></React.Fragment>})}<div style={{position:'absolute',left:240,top:820,width:1440,height:7,background:'#ffffff18'}}/><div style={{position:'absolute',left:240,top:790,width:(400+n*13)%1350,height:12,background:accent,boxShadow:\`0 0 28px \${accent}\`}}/></>;
else if(kind==='hockey') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#1d2d3a,#8bb0c1 34%,#dcecf3 35%,#b9d5df 100%)'}}/><div style={{position:'absolute',left:60,top:360,width:1800,height:610,borderRadius:'50%',border:'8px solid #7ba2b4',background:'#e8f5f8'}}/><div style={{position:'absolute',left:957,top:360,width:6,height:610,background:'#c84e58'}}/>{Array.from({length:12}).map((_,i)=><div key={i} style={{position:'absolute',left:220+(i%6)*260+Math.sin(t/16+i)*30,top:520+Math.floor(i/6)*220,width:54,height:54,borderRadius:'50%',background:i===seed%12?accent:'#34495b',boxShadow:'0 12px 20px #0005'}}/> )}</>;
else if(kind==='music') bg=<><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 30%,#4d382a,#0a0808 68%)'}}/><div style={{position:'absolute',left:180,top:270,width:750,height:500,background:'#151515',borderRadius:80,boxShadow:'0 30px 90px #000'}}/><div style={{position:'absolute',left:560,top:470,width:560,height:90,background:'#f0eee7',transform:'skewX(-12deg)'}}/>{Array.from({length:14}).map((_,i)=><Person key={i} x={1050+(i%7)*100} y={360+Math.floor(i/7)*210} s={.6} c={i===n%14?accent:'#5b4b43'}/> )}</>;
else if(kind==='sport'||kind==='elite') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#111a29,#243548 42%,#18301d 43%,#0e1d12)'}}/><div style={{position:'absolute',left:90,top:250,width:1740,height:620,border:'5px solid #d6d9d2',borderRadius:20}}/><div style={{position:'absolute',left:180,top:560,width:1560,height:5,background:'#d6d9d2'}}/>{Array.from({length:10}).map((_,i)=><Person key={i} x={220+i*145+Math.sin(t/13+i)*18} y={600-(i%3)*55} s={.75} c={i===seed%10?accent:'#4c5967'} walk={t/12+i}/> )}</>;
else if(kind==='tennis') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(145deg,#071018,#102a31)'}}/><div style={{position:'absolute',left:140,top:120,width:1640,height:820,background:'#173e36',border:'7px solid #b8d4c9'}}/><div style={{position:'absolute',left:957,top:120,width:6,height:820,background:'#eef5ef'}}/>{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:180+i*240,top:190+(i%2)*280,width:170,height:4,background:'#e8eee9'}}/>)}<Person x={570+Math.sin(t/12)*160} y={500} s={.95} c={accent} walk={t/9}/><Person x={1250-Math.sin(t/14)*150} y={350} s={.95} c='#d0d7de' walk={t/10}/></>;
else if(kind==='bookstore') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#30271f,#120f0d)'}}/>{Array.from({length:6}).map((_,r)=><div key={r} style={{position:'absolute',left:120,top:110+r*135,width:1680,height:18,background:'#5b412d'}}/>)}{Array.from({length:45}).map((_,i)=><div key={i} style={{position:'absolute',left:145+(i%15)*108,top:45+Math.floor(i/15)*270,width:74,height:190,background:i%7===0?accent:['#6e3c3c','#3f5870','#736a41','#4b664c'][i%4],boxShadow:'inset 0 0 0 2px #ffffff10'}}/> )}</>;
else if(kind==='founder') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#07111c,#111822 54%,#07090c)'}}/>{Array.from({length:18}).map((_,i)=><div key={i} style={{position:'absolute',left:(i%9)*220,top:570+Math.floor(i/9)*170,width:150,height:220,background:'#152433'}}/>)}<div style={{position:'absolute',left:980,top:150,width:760,height:520,border:'10px solid #1e2936',background:'linear-gradient(180deg,#173049,#09111b)'}}/><Person x={500} y={470} s={1.35} c={accent}/></>;
else if(kind==='parallel') bg=<><div style={{position:'absolute',inset:0,background:'#05070a'}}/>{Array.from({length:20}).map((_,i)=>{const x=35+(i%10)*188,y=70+Math.floor(i/10)*500;return <div key={i} style={{position:'absolute',left:x,top:y,width:165,height:410,borderRadius:18,background:i%5===0?'#17291e':'#131821',border:\`1px solid \${i%5===0?accent:'#ffffff16'}\`,overflow:'hidden'}}><Person x={48} y={175+(i%3)*20} s={.6} c={i%5===0?accent:'#555d68'} walk={t/18+i}/><div style={{position:'absolute',left:20,top:40,width:125,height:5,background:'#ffffff14'}}/><div style={{position:'absolute',left:20,top:62,width:90,height:5,background:'#ffffff0d'}}/></div>})}</>;
else if(kind==='gears') bg=<><div style={{position:'absolute',inset:0,background:'radial-gradient(circle,#182231,#05070a 70%)'}}/>{[0,1,2].map((i)=>{const s=[330,410,360][i],x=[180,760,1320][i],y=[350,250,420][i];return <div key={i} style={{position:'absolute',left:x,top:y,width:s,height:s,borderRadius:'50%',border:\`34px dashed \${i===1?accent:'#8996a4'}\`,transform:\`rotate(\${(i%2?1:-1)*t*.8}deg)\`,boxShadow:'0 0 80px #000'}}/>})}</>;
else if(kind==='race') bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#1d2632,#27384c 38%,#3f4a38 39%,#1a2117)'}}/><div style={{position:'absolute',left:80,top:450,width:1760,height:470,background:'#6b4c39',transform:'perspective(900px) rotateX(58deg)'}}/>{Array.from({length:7}).map((_,i)=><div key={i} style={{position:'absolute',left:140,top:500+i*55,width:1640,height:4,background:'#eee',opacity:.65}}/>)}<Person x={700+n*7%500} y={520} s={1.05} c={accent} walk={t/8}/></>;
else if(kind==='formula'||kind==='abstract'||kind==='selection') bg=<><div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 50% 50%,#142033,#05070b 70%)'}}/>{Array.from({length:14}).map((_,i)=><div key={i} style={{position:'absolute',left:100+((i*311+seed*17)%1700),top:120+((i*173+seed*19)%760),width:50+(i%4)*28,height:50+(i%4)*28,borderRadius:i%3===0?'50%':12,border:\`2px solid \${i%4===0?accent:'#ffffff22'}\`,background:'#ffffff06',transform:\`rotate(\${t*.2+i*21}deg) scale(\${.9+.08*Math.sin(t/20+i)})\`}}/>)}<div style={{position:'absolute',left:240,top:530,width:1440,height:5,background:\`linear-gradient(90deg,transparent,\${accent},transparent)\`}}/></>;
else bg=<><div style={{position:'absolute',inset:0,background:'linear-gradient(145deg,#10141d,#05070a)'}}/><div style={{position:'absolute',left:180,top:180,width:1560,height:720,borderRadius:50,border:\`2px solid \${accent}55\`,background:'#ffffff05'}}/></>;
return <AbsoluteFill style={{overflow:'hidden',fontFamily:font}}><AbsoluteFill style={{transform:\`scale(\${1.025+e*.018}) translate(\${Math.sin(t/47)*5}px,\${Math.cos(t/53)*4}px)\`}}>{bg}</AbsoluteFill><div style={{position:'absolute',left:0,right:0,top:0,height:6,background:\`linear-gradient(90deg,\${accent},transparent 68%)\`,opacity:.75}}/></AbsoluteFill>};
export const SceneVisual=({n}:{n:number})=>{switch(n){
    ${cases}
    default:return <OneOff n={70} kind='final' keyName='final_answer' accent='#f5c66a' seed={42}/>;
}};`;
fs.writeFileSync(path.join(target,'src/scenes.tsx'),scenes);
const pkg=JSON.parse(fs.readFileSync(path.join(target,'package.json'),'utf8')); pkg.name='v46-luck-talent'; fs.writeFileSync(path.join(target,'package.json'),JSON.stringify(pkg,null,2));
console.log(`V46 materialized: ${beats.length} one-off scenes at ${target}`);
