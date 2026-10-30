const key=(label,key,hold=false)=>({label,key,hold});
const tap=(hint)=>({layout:'board',hint,buttons:[]});
const profiles={
 space:{layout:'space',stick:true,hint:'ドラッグで視点、ピンチでズーム。左スティックは周回・前後移動。自由飛行に切替もできるよ。PC: WASD、Q/Eで惑星、Space観測、F飛行。',buttons:[{label:'スキャン',command:'scan'},{label:'衛星追跡',command:'satellites'},{label:'時間 ×1',command:'time'},{label:'拡大 ＋',command:'zoom-in'},{label:'縮小 −',command:'zoom-out'},{label:'自由飛行',command:'flight',toggle:true,onLabel:'周回に戻る',offLabel:'自由飛行'},{label:'ツアー',command:'tour',toggle:true,onLabel:'ツアー停止',offLabel:'自動ツアー'}]},
 lander:{layout:'lander',stick:true,hint:'左スティックで機体を傾け、噴射を長押し。ゆっくり、まっすぐ着地しよう。PC: A/Dで傾き、Spaceで噴射。',buttons:[key('噴射',' ',true),{label:'やり直す',command:'retry'}]},
 orbit:{layout:'orbit',hint:'加速・減速を長押しして、緑の目標軌道を8秒間維持。燃料を使いすぎないで。PC: ↑加速、↓減速。',buttons:[key('加速','arrowup',true),key('減速','arrowdown',true),{label:'やり直す',command:'retry'}]},
 slingshot:{layout:'tools',hint:'画面をドラッグして引っぱり、離して彗星を発射。矢印の方向へ飛ぶよ。やり直す / Rで再挑戦。',buttons:[{label:'やり直す',command:'retry'}]},
 constellation:tap('星を1から順番にタップ、または指でなぞってつなごう。間違えたら1から。'),
 kart:{layout:'race',stick:true,hint:'左スティックでハンドル。スマホは自動アクセルONで、曲がるだけ。ブレーキ・ニトロは右手で。PC: WASD / 矢印、Shift、Space。',buttons:[key('ブレーキ','arrowdown',true),key('ニトロ',' ',true),key('ドリフト','shift',true),{label:'自動加速',command:'auto-drive',toggle:true,onLabel:'自動加速 ON',offLabel:'自動加速 OFF',mobileDefault:true},key('復帰','r')]},
 platformer:{layout:'platform',stick:true,hint:'左スティックを左右に倒して移動。右手でジャンプ。倒す量で速さを調節できるよ。PC: A/D・左右、Space。',buttons:[key('ジャンプ',' ')]},
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
 configure(game){this.release();this.clearStick=null;const p=controlsFor(game);this.host.className=`game-input input-${p.layout}`;this.host.replaceChildren();this.host.setAttribute('aria-label','ゲームの操作');if(p.layout==='stick'||p.stick)this.addStick();if(game.type==='space')this.addPlanetSelect();const group=document.createElement('div');group.className='input-buttons';p.buttons.forEach((spec,i)=>{const b=document.createElement('button');b.type='button';b.textContent=spec.label;b.className='input-button';b.dataset.index=i;b.setAttribute('aria-label',spec.label);if(spec.toggle){const initial=!!(spec.mobileDefault&&(window.matchMedia?.('(pointer:coarse)').matches||globalThis.innerWidth<780));b.setAttribute('aria-pressed',String(initial));b.textContent=initial?(spec.onLabel||spec.label):(spec.offLabel||spec.label);}const fire=()=>{if(!this.runtime()?.running)return;if(spec.command){const value=this.runtime().command(spec.command);if(spec.command==='time')b.textContent=`時間 ×${value}`;if(spec.command==='satellites'){const select=this.host.querySelector?.('select');if(select)select.value='3'}if(spec.toggle){b.setAttribute('aria-pressed',String(value));b.textContent=value?(spec.onLabel||'旗モード ON'):(spec.offLabel||'旗モード OFF')}}else if(spec.hold){this.runtime().pressKey(spec.key)}else{this.runtime().pressKey(spec.key);this.runtime().releaseKey(spec.key)}};
 b.addEventListener('pointerdown',e=>{e.preventDefault();if(!this.runtime()?.running)return;b.setPointerCapture(e.pointerId);b.classList.add('pressed');if(spec.hold){this.held.set(e.pointerId,spec.key);fire()}else fire()});const up=e=>{const k=this.held.get(e.pointerId);if(k)this.runtime()?.releaseKey(k);this.held.delete(e.pointerId);b.classList.remove('pressed')};b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up);b.addEventListener('keydown',e=>{if(![' ','Enter'].includes(e.key))return;e.preventDefault();e.stopPropagation();if(e.repeat||!this.runtime()?.running)return;if(spec.hold){this.held.set('kbd-'+i,spec.key);fire()}else fire();b.classList.add('pressed')});const keyboardUp=e=>{if(e?.key&&![' ','Enter'].includes(e.key))return;const k=this.held.get('kbd-'+i);if(k)this.runtime()?.releaseKey(k);this.held.delete('kbd-'+i);b.classList.remove('pressed')};b.addEventListener('keyup',keyboardUp);b.addEventListener('blur',()=>keyboardUp());b.addEventListener('click',e=>{if(e.detail===0){fire();if(spec.hold)this.runtime()?.releaseKey(spec.key)}});group.append(b)});this.host.append(group);return p}
 addPlanetSelect(){const select=document.createElement('select');select.className='planet-select';select.setAttribute('aria-label','ワープ先の惑星');['太陽','水星','金星','地球','火星','木星','土星','天王星','海王星','月'].forEach((name,i)=>{const option=document.createElement('option');option.value=String(i);option.textContent='ワープ → '+name;select.append(option)});select.value='3';select.addEventListener('change',()=>{this.runtime()?.command('planet',Number(select.value));const flight=this.host.querySelector?.('[data-index="5"]');if(flight){flight.setAttribute('aria-pressed','false');flight.textContent='自由飛行'}});this.host.append(select)}
 addStick(){const stick=document.createElement('div');stick.className='move-stick';stick.setAttribute('aria-label','移動スティック');stick.innerHTML='<span></span>';const knob=stick.firstChild;let pointer=null;const clear=()=>{this.runtime()?.command('move',{x:0,y:0});knob.style.transform='';stick.classList.remove('active');pointer=null};const move=e=>{if(pointer!==e.pointerId||!this.runtime()?.running)return;const r=stick.getBoundingClientRect(),rawX=(e.clientX-r.left-r.width/2)/(r.width*.4),rawY=(e.clientY-r.top-r.height/2)/(r.height*.4),len=Math.hypot(rawX,rawY),factor=len>.12?Math.min(1,(len-.12)/.88)/len:0,x=rawX*factor,y=rawY*factor;knob.style.transform=`translate(${x*32}px,${y*32}px)`;this.runtime()?.command('move',{x,y})};stick.addEventListener('pointerdown',e=>{e.preventDefault();if(pointer!==null||!this.runtime()?.running)return;pointer=e.pointerId;stick.setPointerCapture(pointer);stick.classList.add('active');move(e)});stick.addEventListener('pointermove',move);for(const ev of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(ev,e=>{if(e.pointerId===pointer)clear()});this.clearStick=clear;this.host.append(stick)}
 release(){for(const k of this.held.values())this.runtime()?.releaseKey(k);this.held.clear();this.clearStick?.();this.host.querySelectorAll('.pressed').forEach(b=>b.classList.remove('pressed'))}
}
