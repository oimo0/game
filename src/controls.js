const key=(label,key,hold=false)=>({label,key,hold});
const tap=(hint)=>({layout:'board',hint,buttons:[]});
const profiles={
 kart:{layout:'race',hint:'左右でハンドル、アクセル・ブレーキを長押し。ドリフトとニトロも同時に使えるよ。PC: WASD / 矢印、Shift、Space、R。',buttons:[key('←','arrowleft',true),key('→','arrowright',true),key('ブレーキ','arrowdown',true),key('アクセル','arrowup',true),key('ドリフト','shift',true),key('ニトロ',' ',true),key('復帰','r')]},
 platformer:{layout:'platform',hint:'左右を長押しで移動、ジャンプをタップ。PC: A/D・左右、Space。',buttons:[key('←','arrowleft',true),key('→','arrowright',true),key('ジャンプ',' ')]},
 runner:{layout:'runner',hint:'左右スワイプでレーン変更、タップか上スワイプでジャンプ。PC: 左右、Space。',buttons:[key('← レーン','arrowleft'),key('レーン →','arrowright'),{label:'ジャンプ',command:'jump'}]},
 shooter:{layout:'stick',hint:'左スティックで移動、ショット長押しで連射。画面をドラッグして移動・連射もできるよ。PC: WASD、Space。',buttons:[key('ショット',' ',true)]},
 survival:{layout:'stick',hint:'左スティックで全方向に移動。移動中にダッシュ。PC: WASD、Space。',buttons:[{label:'ダッシュ',command:'dash'}]},
 tetris:{layout:'blocks',hint:'左右スワイプで移動、タップで回転、下スワイプで落下。PC: 左右・↑回転・↓低速・Space即落下。',buttons:[key('←','arrowleft',true),key('→','arrowright',true),key('回転 ↻','arrowup'),key('↓','arrowdown',true),key('落下',' ')]},
 mines:{layout:'tools',hint:'マスをタップして開く。旗モードをONにするとタップで旗。PCは右クリックでも旗を置けるよ。',buttons:[{label:'旗モード OFF',command:'flag-mode',toggle:true}]},
 sudoku:{layout:'tools',hint:'マスを選んで1〜4を入力。消すボタンで修正。PC: 数字キー・Backspace。',buttons:[...['1','2','3','4'].map(v=>key(v,v)),key('消す','backspace')]},
 wordle:tap('画面のキーボード、またはPCの文字キーで入力。ENTERで決定、⌫で削除。'),
 rhythm:{layout:'rhythm',hint:'対応する4つのパッドを、ノートがラインに重なる瞬間にタップ。PC: A S D F。',buttons:['A','S','D','F'].map(k=>key(k,k.toLowerCase()))},
 drums:{layout:'rhythm',hint:'パターンを見て、4つのパッドで順番に演奏。PC: A S D F。',buttons:['A','S','D','F'].map(k=>key(k,k.toLowerCase()))},
 echobeat:{layout:'rhythm',hint:'ビートを覚えて同じ順に4つのパッドを叩こう。PC: A S D F。',buttons:['A','S','D','F'].map(k=>key(k,k.toLowerCase()))},
 beatdrop:{layout:'rhythm',hint:'ノートをラインで捉えて4つのパッドをタップ。PC: A S D F。',buttons:['A','S','D','F'].map(k=>key(k,k.toLowerCase()))},
 tempo:{layout:'single',hint:'ビートに合わせて画面かTAPをタップ。PC: Space。',buttons:[key('TAP',' ')]},
 colorswitch:{layout:'colors',hint:'オーブと同じ色のボタンをタップ。PC: 1 2 3 4。',buttons:[key('1 ●','1'),key('2 ◆','2'),key('3 ✦','3'),key('4 ■','4')]},
 match3:tap('宝石を選び、隣の宝石をタップして交換。ドラッグで隣に滑らせても交換できるよ。'),
 sliding:tap('空きマスの隣のタイルをタップして動かそう。'),
 connect4:tap('置きたい列をタップ。CPUの番が終わったら次の手を選ぼう。'),
 hanoi:tap('移動元の棒をタップし、次に移動先の棒をタップ。選択中の棒は光るよ。'),
 tictactoe:tap('空いているマスをタップして×を置こう。'),
 pairs:tap('カードを2枚ずつタップ。違うペアが閉じるのを待って次を選ぼう。'),
 basketball:tap('リングの狙いたい位置をタップしてシュート。'),
 penalty:tap('ゴールの中の狙いたい位置をタップ。キーパーの動きを見よう。'),
 golf:tap('カップ付近の狙いたい場所をタップして打とう。'),
 bowling:tap('レーンの狙いたい横位置をタップして投球。'),
 baseball:tap('球が黄色いラインを通る瞬間、その球をタップしてスイング。'),
 whack:tap('顔を出したボットを直接タップしよう。'),
 slice:tap('果物を指でなぞってスライス。タップでもOK。爆弾は避けよう。'),
 quickdraw:tap('緑の合図が出たら画面をタップ。PCはSpaceでも反応できるよ。'),
 stack:tap('ブロックが重なる位置でタップして落とそう。PC: Space。')
};
export function controlsFor(game){const p=profiles[game.type];if(!p)throw Error(`No input profile: ${game.type}`);return game.type==='platformer'&&game.theme==='gravity'?{...p,hint:p.hint+' 重力ボタン / Gで上下を反転。',buttons:[...p.buttons,key('重力 ↕','g')]}:p}
export class TouchControls{
 constructor(host,getRuntime){this.host=host;this.runtime=getRuntime;this.held=new Map();this.releaseOnBlur=()=>this.release();window.addEventListener('blur',this.releaseOnBlur);this.visibility=()=>{if(document.hidden)this.release()};document.addEventListener('visibilitychange',this.visibility)}
 configure(game){this.release();this.clearStick=null;const p=controlsFor(game);this.host.className=`game-input input-${p.layout}`;this.host.replaceChildren();this.host.setAttribute('aria-label','ゲームの操作');if(p.layout==='stick')this.addStick();const group=document.createElement('div');group.className='input-buttons';p.buttons.forEach((spec,i)=>{const b=document.createElement('button');b.type='button';b.textContent=spec.label;b.className='input-button';b.dataset.index=i;b.setAttribute('aria-label',spec.label);if(spec.toggle)b.setAttribute('aria-pressed','false');const fire=()=>{if(!this.runtime()?.running)return;if(spec.command){const value=this.runtime().command(spec.command);if(spec.toggle){b.setAttribute('aria-pressed',String(value));b.textContent=value?'旗モード ON':'旗モード OFF'}}else if(spec.hold){this.runtime().pressKey(spec.key)}else{this.runtime().pressKey(spec.key);this.runtime().releaseKey(spec.key)}};
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(!this.runtime()?.running)return;b.setPointerCapture(e.pointerId);b.classList.add('pressed');if(spec.hold){this.held.set(e.pointerId,spec.key);fire()}else fire()});const up=e=>{const k=this.held.get(e.pointerId);if(k)this.runtime()?.releaseKey(k);this.held.delete(e.pointerId);b.classList.remove('pressed')};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);b.addEventListener('keydown',e=>{if(![' ','Enter'].includes(e.key))return;e.preventDefault();e.stopPropagation();if(e.repeat||!this.runtime()?.running)return;if(spec.hold){this.held.set('kbd-'+i,spec.key);fire()}else fire();b.classList.add('pressed')});const keyboardUp=e=>{if(e?.key&&![' ','Enter'].includes(e.key))return;const k=this.held.get('kbd-'+i);if(k)this.runtime()?.releaseKey(k);this.held.delete('kbd-'+i);b.classList.remove('pressed')};b.addEventListener('keyup',keyboardUp);b.addEventListener('blur',()=>keyboardUp());b.addEventListener('click',e=>{if(e.detail===0){fire();if(spec.hold)this.runtime()?.releaseKey(spec.key)}});group.append(b)});this.host.append(group);return p}
 addStick(){const stick=document.createElement('div');stick.className='move-stick';stick.setAttribute('aria-label','移動スティック');stick.innerHTML='<span></span>';const knob=stick.firstChild;let pointer=null;const directions=new Set();const clear=()=>{for(const k of directions)this.runtime()?.releaseKey(k);directions.clear();knob.style.transform='';pointer=null};const move=e=>{if(pointer!==e.pointerId||!this.runtime()?.running)return;const r=stick.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-r.left-r.width/2)/(r.width*.4))),y=Math.max(-1,Math.min(1,(e.clientY-r.top-r.height/2)/(r.height*.4)));knob.style.transform=`translate(${x*28}px,${y*28}px)`;const next=new Set();if(x<-.25)next.add('arrowleft');if(x>.25)next.add('arrowright');if(y<-.25)next.add('arrowup');if(y>.25)next.add('arrowdown');for(const k of directions)if(!next.has(k))this.runtime()?.releaseKey(k);for(const k of next)if(!directions.has(k))this.runtime()?.pressKey(k);directions.clear();next.forEach(k=>directions.add(k))};stick.addEventListener('pointerdown',e=>{e.preventDefault();if(pointer!==null||!this.runtime()?.running)return;pointer=e.pointerId;stick.setPointerCapture(pointer);move(e)});stick.addEventListener('pointermove',move);for(const ev of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(ev,clear);this.clearStick=clear;this.host.append(stick)}
 release(){for(const k of this.held.values())this.runtime()?.releaseKey(k);this.held.clear();this.clearStick?.();this.host.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed'))}
}
