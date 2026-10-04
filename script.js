(() => {
  const qs = s => [...document.querySelectorAll(s)];
  const $ = id => document.getElementById(id);

  function activateTab(key, scroll=false){
    qs('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === key));
    qs('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `panel-${key}`));
    if(scroll) $('lesson')?.scrollIntoView({behavior:'smooth', block:'start'});
  }

  qs('.tab').forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab)));
  qs('.topic-node').forEach(btn => btn.addEventListener('click', () => activateTab(btn.dataset.tab, true)));

  qs('[data-scroll]').forEach(btn => btn.addEventListener('click', () => {
    $(btn.dataset.scroll)?.scrollIntoView({behavior:'smooth', block:'start'});
  }));

  document.addEventListener('click', e => {
    const b=e.target.closest('.reveal');
    if(!b) return;
    const answer=b.parentElement.querySelector('.answer');
    if(!answer) return;
    const show=answer.hidden;
    answer.hidden=!show;
    b.textContent=show?'إخفاء الإجابة':'إظهار الإجابة';
  });

  const display=$('termDisplay');
  qs('.term').forEach(btn => btn.addEventListener('click', () => {
    qs('.term').forEach(x=>x.classList.remove('active'));
    btn.classList.add('active');
    const [title,desc]=(btn.dataset.term||'|').split('|');
    display.innerHTML=`<strong>${title}:</strong> ${desc}`;
  }));

  const answers={q1:'b',q2:'c',q3:'a',q4:'b',q5:'a',q6:'c',q7:'b',q8:'a',q9:'c',q10:'b'};
  $('quiz').addEventListener('submit', e => {
    e.preventDefault();
    let score=0, unanswered=0;
    Object.entries(answers).forEach(([q,a])=>{
      const chosen=document.querySelector(`input[name="${q}"]:checked`);
      const item=document.querySelector(`input[name="${q}"]`)?.closest('.quiz-item');
      const labels=item ? [...item.querySelectorAll('label')] : [];

      // Reset previous correction states so the quiz can be retaken cleanly.
      item?.classList.remove('quiz-correct','quiz-wrong','quiz-unanswered');
      labels.forEach(label=>label.classList.remove('answer-correct','answer-wrong'));

      // Always mark the correct choice after correction.
      const correctInput=item?.querySelector(`input[value="${a}"]`);
      correctInput?.closest('label')?.classList.add('answer-correct');

      if(!chosen){
        unanswered++;
        item?.classList.add('quiz-unanswered');
      } else if(chosen.value===a){
        score++;
        item?.classList.add('quiz-correct');
      } else {
        item?.classList.add('quiz-wrong');
        chosen.closest('label')?.classList.add('answer-wrong');
      }
    });
    $('testScore').textContent=`${score} / 10`;
    const result=$('quizResult');
    result.hidden=false;
    let msg = score===10 ? 'ممتاز! أتقنت محاور الدرس.' :
              score>=8 ? 'ممتاز جدًا. راجع الأسئلة التي أخطأت فيها فقط.' :
              score>=6 ? 'جيد. ارجع إلى بطاقات المحاور والمصطلحات ثم أعد الاختبار.' :
              'ارجع إلى خريطة الدرس، ثم راجع المحاور الأربعة وحاول مرة أخرى.';
    if(unanswered) msg += ` لم تُجب عن ${unanswered} سؤال${unanswered>1?'ات':''}.`;
    result.innerHTML=`<strong>نتيجتك: ${score}/10</strong><p>${msg}</p>`;
    result.scrollIntoView({behavior:'smooth',block:'nearest'});
  });

  // Small keyboard-friendly shortcut: 1–5 switch through the lesson tabs.

  $('resetQuiz').addEventListener('click',()=>{
    $('quiz').reset();
    qs('.quiz-item').forEach(item=>{
      item.classList.remove('quiz-correct','quiz-wrong','quiz-unanswered');
      item.querySelectorAll('label').forEach(label=>label.classList.remove('answer-correct','answer-wrong'));
    });
    $('testScore').textContent='— / 10';
    $('quizResult').hidden=true;
  });

  document.addEventListener('keydown', e=>{
    if(['INPUT','TEXTAREA','BUTTON'].includes(document.activeElement.tagName)) return;
    const keys=['politics','economy','society','urban','review'];
    if(e.key>='1' && e.key<='5') activateTab(keys[Number(e.key)-1]);
  });
})();