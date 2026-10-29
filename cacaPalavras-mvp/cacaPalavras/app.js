(() => {
  const $ = (s) => document.querySelector(s);
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  const translations = {
    pt: {
      stats:'Estatísticas', language:'Idioma', daily:'DESAFIO DE HOJE', headline:'Duas maneiras de brincar com palavras.',
      subtitle:'Um minutinho de diversão, uma dose de descoberta. Escolha seu jogo!', guessTitle:'Adivinhar', guessDesc:'Descubra a palavra em seis tentativas.',
      searchTitle:'Caça-palavras', searchDesc:'Encontre todas as palavras escondidas.', dailyChallenge:'DESAFIO DIÁRIO', today:'HOJE',
      guessInstructions:'Digite uma palavra de 5 letras. As pistas mostram o quanto você chegou perto.', yourGuess:'Sua tentativa',
      check:'Conferir', guessHelp:'Use letras; acentos são aceitos.', findThese:'ENCONTRE ESTAS PALAVRAS',
      searchHelp:'Toque na primeira e na última letra da palavra, em linha reta.', share:'Compartilhar resultado', yourJourney:'SUA JORNADA',
      close:'Fechar', played:'Jogos', won:'Vitórias', winRate:'Taxa de vitória', streak:'Sequência atual',
      footer:'Feito para pausas felizes.', offlineReady:'Jogue offline depois da primeira visita',
      dateLocale:'pt-BR', invalid:'Digite exatamente 5 letras.', win:'Você acertou! Mandou muito bem! 🎉',
      lose:'Fim das tentativas! A palavra era', tryAgain:'Boa tentativa! Tente outra palavra.', found:'Boa! Palavra encontrada: ',
      allFound:'Você encontrou todas as palavras! ✨', selectStart:'Agora selecione a última letra da palavra.',
      selectEnd:'Selecione a primeira letra de uma palavra.', notWord:'Essa sequência não é uma palavra da lista. Tente de novo.',
      already:'Essa palavra já foi encontrada.', shareText:'Meu resultado no cacaPalavras', copied:'Resultado copiado para compartilhar!',
      shareFail:'Não foi possível compartilhar agora.', noGuesses:'Você já concluiu este desafio.', guessLabel:'Tentativa',
      lettersCorrect:'✓ correta', lettersPresent:'• em outra posição', lettersAbsent:'× não aparece',
      hint:'Dica: símbolos também indicam o resultado — ✓ correta, • presente, × ausente.',
      statMessage:'Seus resultados ficam salvos apenas neste dispositivo.'
    },
    en: {
      stats:'Statistics', language:'Language', daily:'TODAY’S CHALLENGE', headline:'Two ways to play with words.',
      subtitle:'A tiny break, a little discovery. Pick your game!', guessTitle:'Guess it', guessDesc:'Find the word in six tries.',
      searchTitle:'Word search', searchDesc:'Find every hidden word.', dailyChallenge:'DAILY CHALLENGE', today:'TODAY',
      guessInstructions:'Enter a 5-letter word. The clues show how close you are.', yourGuess:'Your guess',
      check:'Check', guessHelp:'Letters only; accents are accepted.', findThese:'FIND THESE WORDS',
      searchHelp:'Tap the first and last letter of a word in a straight line.', share:'Share result', yourJourney:'YOUR JOURNEY',
      close:'Close', played:'Games', won:'Wins', winRate:'Win rate', streak:'Current streak',
      footer:'Made for happy little breaks.', offlineReady:'Play offline after your first visit',
      dateLocale:'en-US', invalid:'Enter exactly 5 letters.', win:'You got it! Nicely done! 🎉',
      lose:'Out of tries! The word was', tryAgain:'Good try! Guess another word.', found:'Nice! Found: ',
      allFound:'You found every word! ✨', selectStart:'Now select the last letter of the word.',
      selectEnd:'Select the first letter of a word.', notWord:'That sequence is not on the word list. Try again.',
      already:'You already found that word.', shareText:'My cacaPalavras result', copied:'Result copied to share!',
      shareFail:'Could not share right now.', noGuesses:'You have completed today’s challenge.', guessLabel:'Guess',
      lettersCorrect:'✓ correct', lettersPresent:'• present elsewhere', lettersAbsent:'× not in word',
      hint:'Symbols also show results — ✓ correct, • present, × absent.',
      statMessage:'Your results are saved only on this device.'
    }
  };
  const dictionaries = {
    pt: { answers:['LIVRO','NUVEM','FESTA','PRAIA','SONHO','FOLHA','MUNDO','TIGRE','DOCE','FLORA','PONTO','TEMPO'], search:['SOL','MAR','FLOR','LUA','GATO'] },
    en: { answers:['PLANT','SMILE','BRAIN','LIGHT','CLOUD','DREAM','MUSIC','WATER','FRUIT','NIGHT','HEART','WORLD'], search:['SUN','SEA','CAT','MOON','STAR'] }
  };
  let language = safeGet('cp_language') || 'pt';
  let mode = 'guess';
  let guesses = [];
  let guessDone = false;
  let startCell = null;
  let found = [];
  let grid = [];
  let wordPaths = {};
  let foundPaths = {};
  const normalized = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  function safeGet(k){try{return localStorage.getItem(k)}catch{return null}}
  function safeSet(k,v){try{localStorage.setItem(k,v)}catch{}}
  function tr(key){return translations[language][key] || key}
  function seededNumber(){let n=0;for(const c of dateKey)n=(n*31+c.charCodeAt(0))>>>0;return n}
  function puzzleAnswer(){const a=dictionaries[language].answers;return a[seededNumber()%a.length]}
  function dailyKey(m){return `cp_daily_${dateKey}_${language}_${m}`}
  function setMessage(msg){$('#game-message').textContent=msg}
  function setLanguage(next){language=next;safeSet('cp_language',language);resetGame();applyTranslations();renderGame();renderStats()}
  function applyTranslations(){
    document.documentElement.lang=language==='pt'?'pt-BR':'en';
    document.querySelectorAll('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(translations[language][key])el.textContent=tr(key)});
    $('#language-select').value=language;
    $('#today-label').textContent=new Intl.DateTimeFormat(tr('dateLocale'),{day:'numeric',month:'long',year:'numeric'}).format(today);
    $('#game-title').textContent=mode==='guess'?tr('guessTitle'):tr('searchTitle');
    $('#game-instructions').textContent=tr(mode==='guess'?'guessInstructions':'searchHelp');
    $('#guess-input').placeholder=language==='pt'?'PALAVRA':'WORD';
  }
  function resetGame(){
    guesses=[];guessDone=false;startCell=null;found=[];grid=[];wordPaths={};foundPaths={};
    const saved=safeGet(dailyKey(mode));
    if(saved){try{const data=JSON.parse(saved);if(mode==='guess'&&data.done){guesses=data.guesses||[];guessDone=true;}if(mode==='search'&&Array.isArray(data.found))found=data.found;}catch{}}
  }
  function renderBoard(){
    const board=$('#guess-board');board.innerHTML='';
    for(let r=0;r<6;r++)for(let c=0;c<5;c++){
      const guess=guesses[r]||'', letter=guess[c]||'';
      const tile=document.createElement('div');tile.className='guess-tile';
      if(letter)tile.classList.add('filled');
      if(guesses[r]&&letter){const status=evaluate(guess,puzzleAnswer())[c];tile.classList.add(status);tile.setAttribute('aria-label',`${letter}, ${tr(status==='correct'?'lettersCorrect':status==='present'?'lettersPresent':'lettersAbsent')}`);tile.innerHTML=`<span>${letter}</span><span class="tile-symbol">${status==='correct'?'✓':status==='present'?'•':'×'}</span>`}
      else tile.textContent=letter;
      board.appendChild(tile);
    }
    $('#guess-input').disabled=guessDone;
    $('#guess-form').querySelector('button').disabled=guessDone;
  }
  function evaluate(guess, answer){
    const g=normalized(guess).split(''), a=normalized(answer).split(''), out=Array(5).fill('absent');
    for(let i=0;i<5;i++)if(g[i]===a[i]){out[i]='correct';a[i]=null;g[i]=null}
    for(let i=0;i<5;i++)if(g[i]){const idx=a.indexOf(g[i]);if(idx>=0){out[i]='present';a[idx]=null}}
    return out;
  }
  function submitGuess(ev){
    ev.preventDefault();if(guessDone)return;
    const guess=$('#guess-input').value.trim().toLocaleUpperCase(language==='pt'?'pt-BR':'en-US');
    if(!/^[A-Za-zÀ-ÿ]{5}$/.test(guess)){setMessage(tr('invalid'));return}
    guesses.push(guess);$('#guess-input').value='';
    if(normalized(guess)===normalized(puzzleAnswer())){guessDone=true;finishGuess(true)}
    else if(guesses.length>=6){guessDone=true;finishGuess(false)}
    else setMessage(tr('tryAgain'));
    renderBoard();
  }
  function finishGuess(won){
    setMessage(won?tr('win'):`${tr('lose')} ${puzzleAnswer()}.`);
    safeSet(dailyKey('guess'),JSON.stringify({done:true,guesses}));
    recordResult('guess',won);
  }
  function renderGame(){
    $('#guess-view').hidden=mode!=='guess';$('#search-view').hidden=mode!=='search';
    document.querySelectorAll('.mode-card').forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
    $('#game-title').textContent=mode==='guess'?tr('guessTitle'):tr('searchTitle');
    $('#game-instructions').textContent=tr(mode==='guess'?'guessInstructions':'searchHelp');
    if(mode==='guess'){
      renderBoard();
      if(guessDone)setMessage(guesses.some(g=>normalized(g)===normalized(puzzleAnswer()))?tr('win'):`${tr('lose')} ${puzzleAnswer()}.`);
      else setMessage(tr('hint'));
    }else{buildGrid();renderGrid();renderWordList();setMessage(found.length===dictionaries[language].search.length?tr('allFound'):tr('selectEnd'))}
  }
  const directions=[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  function buildGrid(){
    if(grid.length)return;
    const size=10, matrix=Array.from({length:size},()=>Array(size).fill(''));
    const words=dictionaries[language].search;
    let seed=seededNumber()+ (language==='en'?31:7);
    const rand=max=>{seed=(seed*1664525+1013904223)>>>0;return seed%max};
    for(const word of words){
      let placed=false;
      for(let attempt=0;attempt<500&&!placed;attempt++){
        const [dr,dc]=directions[rand(directions.length)],r=rand(size),c=rand(size),er=r+dr*(word.length-1),ec=c+dc*(word.length-1);
        if(er<0||er>=size||ec<0||ec>=size)continue;
        let ok=true;for(let i=0;i<word.length;i++)if(matrix[r+dr*i][c+dc*i]&&matrix[r+dr*i][c+dc*i]!==word[i])ok=false;
        if(!ok)continue;
        const path=[];for(let i=0;i<word.length;i++){matrix[r+dr*i][c+dc*i]=word[i];path.push((r+dr*i)*size+c+dc*i)}
        wordPaths[word]=path;placed=true;
      }
    }
    const alphabet=language==='pt'?'ABCDEFGHIJKLMNOPQRSTUVXZ':'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(!matrix[r][c])matrix[r][c]=alphabet[rand(alphabet.length)];
    grid=matrix.flat();
  }
  function renderGrid(){
    const wrap=$('#word-grid');wrap.innerHTML='';
    grid.forEach((letter,i)=>{
      const b=document.createElement('button');b.type='button';b.className='grid-cell';b.textContent=letter;b.dataset.index=i;
      b.setAttribute('aria-label',`${letter}, row ${Math.floor(i/10)+1}, column ${i%10+1}`);
      if(startCell===i)b.classList.add('selected');
      if(Object.values(foundPaths).some(path=>path.includes(i)))b.classList.add('found');
      b.addEventListener('click',()=>selectCell(i));wrap.appendChild(b);
    });
  }
  function renderWordList(){
    const ul=$('#target-list');ul.innerHTML='';
    dictionaries[language].search.forEach(w=>{const li=document.createElement('li');li.textContent=w;if(found.includes(w))li.classList.add('found');ul.appendChild(li)});
  }
  function selectCell(i){
    if(found.length===dictionaries[language].search.length)return;
    if(startCell===null){startCell=i;renderGrid();setMessage(tr('selectStart'));return}
    const r1=Math.floor(startCell/10),c1=startCell%10,r2=Math.floor(i/10),c2=i%10,dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
    if(startCell===i){startCell=null;renderGrid();setMessage(tr('selectEnd'));return}
    if(r1!==r2&&c1!==c2&&Math.abs(r2-r1)!==Math.abs(c2-c1)){startCell=i;renderGrid();setMessage(tr('notWord'));return}
    const length=Math.max(Math.abs(r2-r1),Math.abs(c2-c1))+1;
    let word='';const path=[];
    for(let j=0;j<length;j++){const idx=(r1+dr*j)*10+c1+dc*j;word+=grid[idx];path.push(idx)}
    const candidate=dictionaries[language].search.find(w=>normalized(w)===normalized(word)||normalized(w)===normalized(word.split('').reverse().join('')));
    if(candidate&&!found.includes(candidate)){found.push(candidate);foundPaths[candidate]=path;setMessage(tr('found')+candidate);if(found.length===dictionaries[language].search.length){setMessage(tr('allFound'));safeSet(dailyKey('search'),JSON.stringify({found}));recordResult('search',true)}}
    else setMessage(found.includes(candidate)?tr('already'):tr('notWord'));
    startCell=null;renderGrid();renderWordList();
  }
  function getStats(){try{return JSON.parse(safeGet('cp_stats')||'{}')}catch{return {}}}
  function recordResult(which,won){
    const stats=getStats(),id=`${dateKey}_${language}_${which}`;
    if(stats[id])return;
    stats.played=(stats.played||0)+1;stats.won=(stats.won||0)+(won?1:0);
    stats.currentStreak=won?(stats.lastWonDate===yesterdayKey()? (stats.currentStreak||0)+1:stats.lastWonDate===dateKey?(stats.currentStreak||0):1):0;
    stats.maxStreak=Math.max(stats.maxStreak||0,stats.currentStreak||0);stats.lastWonDate=won?dateKey:stats.lastWonDate;
    stats[id]=true;safeSet('cp_stats',JSON.stringify(stats));renderStats();
  }
  function yesterdayKey(){const d=new Date(today);d.setDate(d.getDate()-1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function renderStats(){
    const s=getStats();$('#stat-played').textContent=s.played||0;$('#stat-won').textContent=s.won||0;
    $('#stat-rate').textContent=(s.played?Math.round((s.won||0)/s.played*100):0)+'%';$('#stat-streak').textContent=s.currentStreak||0;
  }
  async function shareResult(){
    const text=`${tr('shareText')} · ${dateKey}\n${mode==='guess'?tr('guessTitle'):tr('searchTitle')}: ${mode==='guess'?(guesses.some(g=>normalized(g)===normalized(puzzleAnswer()))?'✓':guessDone?'×':`${guesses.length}/6`):`${found.length}/${dictionaries[language].search.length}`}\n🟨 🟩 🟪\n#cacaPalavras`;
    try{if(navigator.share)await navigator.share({title:'cacaPalavras',text});else if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(text);setMessage(tr('copied'))}else{fallbackCopy(text);setMessage(tr('copied'))}}catch(e){if(e.name!=='AbortError')setMessage(tr('shareFail'))}
  }
  function fallbackCopy(text){const t=document.createElement('textarea');t.value=text;document.body.appendChild(t);t.select();document.execCommand('copy');t.remove()}
  document.querySelectorAll('.mode-card').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;resetGame();applyTranslations();renderGame()}));
  $('#language-select').addEventListener('change',e=>setLanguage(e.target.value));
  $('#guess-form').addEventListener('submit',submitGuess);
  $('#guess-input').addEventListener('input',e=>{e.target.value=e.target.value.toLocaleUpperCase(language==='pt'?'pt-BR':'en-US').replace(/[^A-Za-zÀ-ÿ]/g,'').slice(0,5)});
  $('#share-button').addEventListener('click',shareResult);
  $('#stats-toggle').addEventListener('click',()=>{const panel=$('#stats-panel'),open=panel.hidden;panel.hidden=!open;$('#stats-toggle').setAttribute('aria-expanded',String(open));if(open)panel.scrollIntoView({behavior:'smooth',block:'nearest'})});
  $('#stats-close').addEventListener('click',()=>{$('#stats-panel').hidden=true;$('#stats-toggle').setAttribute('aria-expanded','false')});
  applyTranslations();renderStats();renderGame();
  if('serviceWorker' in navigator && location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
})();