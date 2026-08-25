/* =========================================================================
   Academy — i18n (interface PT/EN)
   ========================================================================= */
(function () {
  'use strict';

  var STRINGS = {
    pt: {
      // Navegação
      'nav.home': 'Painel',
      'nav.competencies': 'Mapa de competências',
      'nav.certification': 'Practice Lab',
      'nav.opening': 'Abertura do manual',
      'nav.tracks': 'Percursos',
      'nav.data': 'Dados',
      'nav.progress': 'Progresso e backup',
      'search.placeholder': 'Pesquisar no manual… (/)',
      'skip': 'Saltar para o conteúdo',
      'nav.open': 'Abrir menu',
      'theme.toggle': 'Alternar tema claro/escuro',
      'search.aria': 'Pesquisar no manual',

      // Capítulos
      'chapter.unavailable.title': 'Capítulo indisponível',
      'chapter.unavailable.body': '<b>Não foi possível carregar este capítulo.</b> Verifique se a pasta <code>content/ch/</code> acompanha o ficheiro <code>index.html</code>.',
      'fig.zoom': 'Ampliar figura',
      'fig.zoomed': 'Figura ampliada',
      'fig.close': 'Fechar',
      'copy.btn': 'Copiar',
      'copy.done': 'Copiado ✓',

      // Home
      'home.title.continue': 'Continue o seu percurso',
      'home.title.start': 'Dados para entender problemas. Métodos para resolvê-los.',
      'home.tagline': 'Engenharia da Qualidade · Lean Six Sigma · Melhoria Contínua · Data Analytics',
      'home.subtitle': '{done} de {total} aulas concluídas, em {n} percursos.',
      'home.subtitle.cta': ' Escolha um percurso abaixo para começar.',
      'home.disclaimer': 'Recurso educativo independente — não é material oficial, aprovado ou endossado pela ASQ, ISO, IATF ou AIAG, e não constitui garantia de aprovação em qualquer exame de certificação.',
      'home.continue': 'Continuar',
      'home.start': 'Começar a aprender',
      'home.mytracks': 'Meus percursos',
      'home.library': 'biblioteca',
      'home.modules': 'módulos',
      'home.lessons': 'aulas',
      'home.new': 'novo',
      'home.source': '<b>Fonte.</b> Todo o conteúdo vem do {src}',
      'home.storage.warn': ' <br><b>Atenção:</b> este navegador não está a guardar o progresso (modo privado ou restrição de armazenamento). Use a exportação em JSON na página {link}.',

      'home.goals.title': 'Escolha pelo seu objetivo',
      'home.goals.sub': 'Cada objetivo aponta para o percurso certo para começar.',
      'home.goal.cqe.t': 'Preparar para o CQE',
      'home.goal.cqe.s': 'Trilha alinhada ao Body of Knowledge do ASQ',
      'home.goal.belt.t': 'Six Sigma Green/Black Belt',
      'home.goal.belt.s': 'Lean, DMAIC e liderança de projetos de melhoria',
      'home.goal.analytics.t': 'Quality Analytics & Quality 4.0',
      'home.goal.analytics.s': 'Power BI, SQL, Python e governança de dados',
      'home.goal.risk.t': 'Risk Engineering avançado',
      'home.goal.risk.s': 'Inferência moderna, causalidade e risco quantitativo',
      'home.goal.dmaic.t': 'Melhorar um processo real',
      'home.goal.dmaic.s': 'Aplique o ciclo DMAIC passo a passo',

      // Track
      'track.eyebrow': 'Percurso {code}',
      'track.progress': '{done} de {total} aulas concluídas · {pct}%',

      // Module
      'module.eyebrow': 'Módulo · nível {level}',
      'module.lessons.h2': 'Aulas',
      'module.chapterof': 'Capítulo {n} do manual',
      'module.completed': 'concluída',
      'module.unread': 'por ler',
      'module.assessment.h2': 'Avaliação do módulo',
      'module.assessment.note': '{n} questões relacionadas com as competências deste módulo. {attempt} Aproveitamento mínimo recomendado: <b>70%</b>.',
      'module.assessment.last': '<b>Última tentativa: {score}%</b> em {date}.',
      'module.assessment.none': 'Ainda não avaliado.',
      'module.assessment.retry': 'Refazer avaliação',
      'module.assessment.start': 'Iniciar avaliação',
      'module.level': 'nível {n}',

      // Lesson
      'lesson.loading': 'A carregar o capítulo…',
      'lesson.opening': 'Abertura',
      'lesson.chapter': 'Capítulo {label}',
      'lesson.newedition': ' · escrito para a edição web',
      'lesson.done': '✓ Concluída',
      'lesson.markdone': 'Marcar como concluída',
      'lesson.words': '{n} palavras',
      'lesson.codeblocks': '{n} blocos Python',
      'lesson.figures': '{n} figuras',
      'lesson.prev': '← Anterior',
      'lesson.next': 'Seguinte →',
      'lesson.toc': 'Nesta aula',
      'lesson.language.warning': '⚠️ Este capítulo está disponível apenas em português. A interface e navegação estão em inglês.',

      // Quiz
      'quiz.title': 'Avaliação · {title}',
      'quiz.empty': 'Sem questões associadas a este módulo.',
      'quiz.gotobank': 'Ir para o banco completo',
      'quiz.lede': '{n} questões. A resposta e a análise dos distratores aparecem imediatamente após cada escolha.',
      'quiz.scoredefault': '—',
      'quiz.scorehint': 'Responda para ver o aproveitamento.<br>Mínimo recomendado: 70%.',
      'quiz.scoreline': '{correct} certas em {answered} respondidas (de {total}).<br>{verdict}',
      'quiz.above': 'Acima do mínimo recomendado.',
      'quiz.below': 'Abaixo dos 70% recomendados.',
      'quiz.bank.title': 'Banco {bank}',

      // Bank
      'bank.eyebrow': 'Laboratório de prática',
      'bank.title': 'Practice Lab',
      'bank.lede': 'Teste os seus conhecimentos com questões autorais, com justificação da resposta correta e análise dos distratores. Não reproduzem itens publicados pela ASQ.',
      'bank.howto': '<b>Como estudar com este banco.</b> Responda sem consultar e, antes de conferir, justifique por que cada uma das outras três alternativas está errada. Se não conseguir, o conceito ainda não está consolidado.',
      'bank.cqe.desc': 'Certified Quality Engineer — organizado pelos 7 domínios do Body of Knowledge; distribuição autoral, não proporcional ao peso oficial do exame.',
      'bank.cssbb.desc': 'Certified Six Sigma Black Belt — DMAIC, estatística, DOE e liderança de projeto.',
      'bank.questions': '{n} questões',
      'bank.startbtn': 'iniciar',
      'bank.note': '<b>Nota.</b> Esta plataforma é <b>preparatória</b>. Não emite certificação ASQ nem Lean Six Sigma reconhecida — os certificados oficiais são emitidos exclusivamente pelos organismos certificadores.',
      'bank.lang.notice': 'O enunciado, as alternativas e as explicações deste banco de questões estão disponíveis apenas em português.',
      'bank.perf.title': 'Seu desempenho',
      'bank.perf.lede': 'Média de aproveitamento nas avaliações já feitas, por trilha.',
      'bank.perf.empty': 'sem dados',

      // Competencies
      'comp.eyebrow': 'Progresso',
      'comp.title': 'Mapa de competências',
      'comp.lede': 'Cada competência fica marcada quando todas as aulas do módulo que a desenvolve estão concluídas. É o inverso de um certificado de presença: mostra o que ainda falta.',
      'comp.legend.done': 'Competência adquirida',
      'comp.legend.pending': 'Em desenvolvimento',

      // Search
      'search.eyebrow': 'Pesquisa',
      'search.title.results': 'Resultados para “{q}”',
      'search.title.empty': 'Pesquisar no manual',
      'search.hint': 'Escreva um termo na caixa de pesquisa.',
      'search.nohits': 'Nada encontrado. Tente um termo mais curto (por exemplo <code>cpk</code>, <code>kanban</code>, <code>anova</code>).',
      'search.count': '{n} capítulos.',

      // Progress
      'progress.title': 'Progresso e backup',
      'progress.lede': 'O progresso fica guardado apenas neste navegador. Exporte um ficheiro JSON para o transportar para outro computador ou para não o perder ao limpar os dados do navegador.',
      'progress.done.k': 'Aulas concluídas',
      'progress.done.s': '{pct}% do total',
      'progress.quiz.k': 'Avaliações feitas',
      'progress.quiz.s': 'módulos e bancos',
      'progress.storage.k': 'Armazenamento',
      'progress.storage.active': 'Ativo',
      'progress.storage.unavailable': 'Indisponível',
      'progress.storage.active.s': 'localStorage do navegador',
      'progress.storage.unavailable.s': 'só em memória — exporte!',
      'progress.export': 'Exportar progresso (JSON)',
      'progress.import': 'Importar ficheiro',
      'progress.clear': 'Apagar todo o progresso',
      'progress.assessments.h2': 'Avaliações',
      'progress.invalidfile': 'Ficheiro inválido.',
      'progress.confirmclear': 'Apagar todo o progresso guardado neste navegador?',
      'progress.bankname': 'Banco {bank}',

      // Idioma
      'lang.switch': 'Mudar para {lang}',
      'lang.english': 'inglês',
      'lang.portuguese': 'português',
      'lang.warning': '⚠️ Este conteúdo está disponível apenas em português. A interface está em inglês.',
      'lang.content.available': 'O conteúdo está disponível em português.',
      'lang.switch.to.en': 'Mudar para inglês →',
      'lang.switch.to.pt': 'Mudar para português →'
    },

    en: {
      // Navigation
      'nav.home': 'Dashboard',
      'nav.competencies': 'Competency Map',
      'nav.certification': 'Practice Lab',
      'nav.opening': 'Manual Introduction',
      'nav.tracks': 'Tracks',
      'nav.data': 'Data',
      'nav.progress': 'Progress & Backup',
      'search.placeholder': 'Search the manual… (/)',
      'skip': 'Skip to content',
      'nav.open': 'Open menu',
      'theme.toggle': 'Toggle light/dark theme',
      'search.aria': 'Search the manual',

      // Chapters
      'chapter.unavailable.title': 'Chapter Unavailable',
      'chapter.unavailable.body': '<b>This chapter could not be loaded.</b> Check that the <code>content/ch/</code> folder is next to <code>index.html</code>.',
      'fig.zoom': 'Zoom figure',
      'fig.zoomed': 'Zoomed figure',
      'fig.close': 'Close',
      'copy.btn': 'Copy',
      'copy.done': 'Copied ✓',

      // Home
      'home.title.continue': 'Continue Your Journey',
      'home.title.start': 'Data to understand problems. Methods to solve them.',
      'home.tagline': 'Quality Engineering · Lean Six Sigma · Continuous Improvement · Data Analytics',
      'home.subtitle': '{done} of {total} lessons completed, across {n} tracks.',
      'home.subtitle.cta': ' Choose a track below to get started.',
      'home.disclaimer': 'Independent educational resource — not official material, approved by, or endorsed by ASQ, ISO, IATF, or AIAG, and it does not guarantee passing any certification exam.',
      'home.continue': 'Continue',
      'home.start': 'Start learning',
      'home.mytracks': 'My Tracks',
      'home.library': 'library',
      'home.modules': 'modules',
      'home.lessons': 'lessons',
      'home.new': 'new',
      'home.source': '<b>Source.</b> All content comes from {src}',
      'home.storage.warn': ' <br><b>Note:</b> this browser is not saving your progress (private mode or restricted storage). Use the JSON export on the {link} page.',

      'home.goals.title': 'Choose by your goal',
      'home.goals.sub': 'Each goal points to the right track to start with.',
      'home.goal.cqe.t': 'Prepare for the CQE exam',
      'home.goal.cqe.s': 'Track aligned to the ASQ Body of Knowledge',
      'home.goal.belt.t': 'Six Sigma Green/Black Belt',
      'home.goal.belt.s': 'Lean, DMAIC and improvement project leadership',
      'home.goal.analytics.t': 'Quality Analytics & Quality 4.0',
      'home.goal.analytics.s': 'Power BI, SQL, Python and data governance',
      'home.goal.risk.t': 'Advanced Risk Engineering',
      'home.goal.risk.s': 'Modern inference, causality and quantitative risk',
      'home.goal.dmaic.t': 'Improve a real process',
      'home.goal.dmaic.s': 'Apply the DMAIC cycle step by step',

      // Track
      'track.eyebrow': 'Track {code}',
      'track.progress': '{done} of {total} lessons completed · {pct}%',

      // Module
      'module.eyebrow': 'Module · Level {level}',
      'module.lessons.h2': 'Lessons',
      'module.chapterof': 'Chapter {n} of the manual',
      'module.completed': 'completed',
      'module.unread': 'not read yet',
      'module.assessment.h2': 'Module Assessment',
      'module.assessment.note': '{n} questions related to this module\'s competencies. {attempt} Recommended minimum: <b>70%</b>.',
      'module.assessment.last': '<b>Last attempt: {score}%</b> on {date}.',
      'module.assessment.none': 'Not yet assessed.',
      'module.assessment.retry': 'Retake Assessment',
      'module.assessment.start': 'Start Assessment',
      'module.level': 'Level {n}',

      // Lesson
      'lesson.loading': 'Loading chapter…',
      'lesson.opening': 'Introduction',
      'lesson.chapter': 'Chapter {label}',
      'lesson.newedition': ' · written for the web edition',
      'lesson.done': '✓ Completed',
      'lesson.markdone': 'Mark as completed',
      'lesson.words': '{n} words',
      'lesson.codeblocks': '{n} Python blocks',
      'lesson.figures': '{n} figures',
      'lesson.prev': '← Previous',
      'lesson.next': 'Next →',
      'lesson.toc': 'In this lesson',
      'lesson.language.warning': '⚠️ This chapter is only available in Portuguese. The interface and navigation are in English.',

      // Quiz
      'quiz.title': 'Assessment · {title}',
      'quiz.empty': 'No questions associated with this module.',
      'quiz.gotobank': 'Go to the full bank',
      'quiz.lede': '{n} questions. The answer and distractor analysis appear immediately after each choice.',
      'quiz.scoredefault': '—',
      'quiz.scorehint': 'Answer to see your score.<br>Recommended minimum: 70%.',
      'quiz.scoreline': '{correct} correct out of {answered} answered (of {total}).<br>{verdict}',
      'quiz.above': 'Above the recommended minimum.',
      'quiz.below': 'Below the recommended 70%.',
      'quiz.bank.title': '{bank} Bank',

      // Bank
      'bank.eyebrow': 'Practice Lab',
      'bank.title': 'Practice Lab',
      'bank.lede': 'Test your knowledge with original questions, with justification of the correct answer and distractor analysis. They do not reproduce items published by ASQ.',
      'bank.howto': '<b>How to study with this bank.</b> Answer without looking anything up and, before checking, justify why each of the other three options is wrong. If you can\'t, the concept is not yet consolidated.',
      'bank.cqe.desc': 'Certified Quality Engineer — organized by the 7 Body of Knowledge domains; original distribution, not proportional to the official exam weighting.',
      'bank.cssbb.desc': 'Certified Six Sigma Black Belt — DMAIC, statistics, DOE and project leadership.',
      'bank.questions': '{n} questions',
      'bank.startbtn': 'start',
      'bank.note': '<b>Note.</b> This platform is <b>preparatory only</b>. It does not issue ASQ or recognized Lean Six Sigma certification — official certificates are issued exclusively by the certifying bodies.',
      'bank.lang.notice': 'The question text, answer options, and explanations in this question bank are currently available in Portuguese only.',
      'bank.perf.title': 'Your performance',
      'bank.perf.lede': 'Average score across assessments taken so far, by track.',
      'bank.perf.empty': 'no data yet',

      // Competencies
      'comp.eyebrow': 'Progress',
      'comp.title': 'Competency Map',
      'comp.lede': 'Each competency is marked once every lesson in the module that develops it is completed. It is the inverse of an attendance certificate: it shows what is still missing.',
      'comp.legend.done': 'Competency acquired',
      'comp.legend.pending': 'In development',

      // Search
      'search.eyebrow': 'Search',
      'search.title.results': 'Results for "{q}"',
      'search.title.empty': 'Search the manual',
      'search.hint': 'Type a term in the search box.',
      'search.nohits': 'Nothing found. Try a shorter term (e.g. <code>cpk</code>, <code>kanban</code>, <code>anova</code>).',
      'search.count': '{n} chapters.',

      // Progress
      'progress.title': 'Progress & Backup',
      'progress.lede': 'Progress is saved only in this browser. Export a JSON file to move it to another computer or to avoid losing it when clearing browser data.',
      'progress.done.k': 'Lessons completed',
      'progress.done.s': '{pct}% of total',
      'progress.quiz.k': 'Assessments taken',
      'progress.quiz.s': 'modules and banks',
      'progress.storage.k': 'Storage',
      'progress.storage.active': 'Active',
      'progress.storage.unavailable': 'Unavailable',
      'progress.storage.active.s': 'browser localStorage',
      'progress.storage.unavailable.s': 'memory only — export!',
      'progress.export': 'Export progress (JSON)',
      'progress.import': 'Import file',
      'progress.clear': 'Clear all progress',
      'progress.assessments.h2': 'Assessments',
      'progress.invalidfile': 'Invalid file.',
      'progress.confirmclear': 'Clear all progress saved in this browser?',
      'progress.bankname': '{bank} Bank',

      // Language
      'lang.switch': 'Switch to {lang}',
      'lang.english': 'English',
      'lang.portuguese': 'Portuguese',
      'lang.warning': '⚠️ This content is only available in Portuguese. The interface is in English.',
      'lang.content.available': 'The content is currently available in Portuguese.',
      'lang.switch.to.en': 'Switch to English →',
      'lang.switch.to.pt': 'Switch to Portuguese →'
    }
  };

  var KEY = 'academy.lang';
  function getLang() {
    try { return localStorage.getItem(KEY) || 'pt'; } catch (e) { return 'pt'; }
  }
  function setLang(l) {
    try { localStorage.setItem(KEY, l); } catch (e) {}
  }
  var LANG = getLang();

  function t(key, vars) {
    var dict = STRINGS[LANG] || STRINGS.pt;
    var s = dict[key];
    if (s == null) s = STRINGS.pt[key];
    if (s == null) return key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]);
      });
    }
    return s;
  }

  window.ACADEMY_I18N = {
    t: t,
    lang: function () { return LANG; },
    setLang: function (l) {
      if (l !== 'pt' && l !== 'en') return;
      LANG = l;
      setLang(l);
      document.documentElement.setAttribute('lang', l === 'en' ? 'en' : 'pt-PT');
    }
  };
  document.documentElement.setAttribute('lang', LANG === 'en' ? 'en' : 'pt-PT');
})();
