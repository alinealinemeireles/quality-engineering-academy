/* =========================================================================
   Academy — i18n (interface PT/EN)
   Fase 1: traduz so a "moldura" da aplicacao (menus, botoes, rotulos,
   paineis). O conteudo dos capitulos (manual.ipynb + extra/*.md)
   continua so em portugues nesta fase.
   ========================================================================= */
(function () {
  'use strict';

  var STRINGS = {
    pt: {
      'nav.home': 'Painel',
      'nav.competencies': 'Mapa de competências',
      'nav.certification': 'Banco de certificação',
      'nav.opening': 'Abertura do manual',
      'nav.tracks': 'Percursos',
      'nav.data': 'Dados',
      'nav.progress': 'Progresso e backup',
      'search.placeholder': 'Buscar no manual… (/)',
      'skip': 'Saltar para o conteúdo',
      'nav.open': 'Abrir menu',
      'theme.toggle': 'Alternar tema claro/escuro',
      'search.aria': 'Buscar no manual',

      'chapter.unavailable.title': 'Capítulo indisponível',
      'chapter.unavailable.body': '<b>Não foi possível carregar este capítulo.</b> Verifique se a pasta <code>content/ch/</code> acompanha o ficheiro <code>index.html</code>.',
      'fig.zoom': 'Ampliar figura',
      'fig.zoomed': 'Figura ampliada',
      'fig.close': 'Fechar',
      'copy.done': 'Copiado ✓',

      'home.title.continue': 'Continue o seu percurso',
      'home.title.start': 'Formação em Engenharia da Qualidade, Lean Six Sigma e Quality Analytics',
      'home.subtitle': '{done} de {total} aulas concluídas, em {n} percursos.',
      'home.subtitle.cta': ' Escolha um percurso abaixo para começar.',
      'home.continue': 'Continuar',
      'home.start': 'Começar',
      'home.mytracks': 'Meus percursos',
      'home.library': 'biblioteca',
      'home.modules': 'módulos',
      'home.lessons': 'aulas',
      'home.new': 'novo',
      'home.source': '<b>Fonte.</b> Todo o conteúdo vem do {src}',
      'home.storage.warn': ' <br><b>Atenção:</b> este navegador não está a guardar o progresso (modo privado ou restrição de armazenamento). Use a exportação em JSON na página {link}.',

      'track.eyebrow': 'Percurso {code}',
      'track.progress': '{done} de {total} aulas concluídas · {pct}%',

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

      'bank.eyebrow': 'Preparação para certificação',
      'bank.title': 'Banco de questões',
      'bank.lede': 'Questões autorais escritas para esta edição, com justificação da resposta correta e análise dos distratores. Não reproduzem itens publicados pela ASQ.',
      'bank.howto': '<b>Como estudar com este banco.</b> Responda sem consultar e, antes de conferir, justifique por que cada uma das outras três alternativas está errada. Se não conseguir, o conceito ainda não está consolidado.',
      'bank.cqe.desc': 'Certified Quality Engineer — distribuição proporcional ao peso do Body of Knowledge.',
      'bank.cssbb.desc': 'Certified Six Sigma Black Belt — DMAIC, estatística, DOE e liderança de projeto.',
      'bank.questions': '{n} questões',
      'bank.startbtn': 'iniciar',
      'bank.note': '<b>Nota.</b> Esta plataforma é <b>preparatória</b>. Não emite certificação ASQ nem Lean Six Sigma reconhecida — os certificados oficiais são emitidos exclusivamente pelos organismos certificadores.',

      'comp.eyebrow': 'Progresso',
      'comp.title': 'Mapa de competências',
      'comp.lede': 'Cada competência fica marcada quando todas as aulas do módulo que a desenvolve estão concluídas. É o inverso de um certificado de presença: mostra o que ainda falta.',
      'comp.legend.done': 'Competência adquirida',
      'comp.legend.pending': 'Em desenvolvimento',

      'search.eyebrow': 'Busca',
      'search.title.results': 'Resultados para “{q}”',
      'search.title.empty': 'Buscar no manual',
      'search.hint': 'Escreva um termo na caixa de busca.',
      'search.nohits': 'Nada encontrado. Tente um termo mais curto (por exemplo <code>cpk</code>, <code>kanban</code>, <code>anova</code>).',
      'search.count': '{n} capítulos.',

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
      'progress.bankname': 'Banco {bank}'
    },

    en: {
      'nav.home': 'Dashboard',
      'nav.competencies': 'Competency map',
      'nav.certification': 'Certification bank',
      'nav.opening': 'Manual introduction',
      'nav.tracks': 'Tracks',
      'nav.data': 'Data',
      'nav.progress': 'Progress & backup',
      'search.placeholder': 'Search the manual… (/)',
      'skip': 'Skip to content',
      'nav.open': 'Open menu',
      'theme.toggle': 'Toggle light/dark theme',
      'search.aria': 'Search the manual',

      'chapter.unavailable.title': 'Chapter unavailable',
      'chapter.unavailable.body': '<b>This chapter could not be loaded.</b> Check that the <code>content/ch/</code> folder is next to <code>index.html</code>.',
      'fig.zoom': 'Zoom figure',
      'fig.zoomed': 'Zoomed figure',
      'fig.close': 'Close',
      'copy.done': 'Copied ✓',

      'home.title.continue': 'Continue your journey',
      'home.title.start': 'Quality Engineering, Lean Six Sigma and Quality Analytics Training',
      'home.subtitle': '{done} of {total} lessons completed, across {n} tracks.',
      'home.subtitle.cta': ' Choose a track below to get started.',
      'home.continue': 'Continue',
      'home.start': 'Start',
      'home.mytracks': 'My tracks',
      'home.library': 'library',
      'home.modules': 'modules',
      'home.lessons': 'lessons',
      'home.new': 'new',
      'home.source': '<b>Source.</b> All content comes from {src}',
      'home.storage.warn': ' <br><b>Note:</b> this browser is not saving your progress (private mode or restricted storage). Use the JSON export on the {link} page.',

      'track.eyebrow': 'Track {code}',
      'track.progress': '{done} of {total} lessons completed · {pct}%',

      'module.eyebrow': 'Module · level {level}',
      'module.lessons.h2': 'Lessons',
      'module.chapterof': 'Chapter {n} of the manual',
      'module.completed': 'completed',
      'module.unread': 'not read yet',
      'module.assessment.h2': 'Module assessment',
      'module.assessment.note': '{n} questions related to this module\'s competencies. {attempt} Recommended minimum: <b>70%</b>.',
      'module.assessment.last': '<b>Last attempt: {score}%</b> on {date}.',
      'module.assessment.none': 'Not yet assessed.',
      'module.assessment.retry': 'Retake assessment',
      'module.assessment.start': 'Start assessment',
      'module.level': 'level {n}',

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

      'bank.eyebrow': 'Certification preparation',
      'bank.title': 'Question bank',
      'bank.lede': 'Original questions written for this edition, with justification of the correct answer and distractor analysis. They do not reproduce items published by ASQ.',
      'bank.howto': '<b>How to study with this bank.</b> Answer without looking anything up and, before checking, justify why each of the other three options is wrong. If you can\'t, the concept is not yet consolidated.',
      'bank.cqe.desc': 'Certified Quality Engineer — distribution proportional to the Body of Knowledge weighting.',
      'bank.cssbb.desc': 'Certified Six Sigma Black Belt — DMAIC, statistics, DOE and project leadership.',
      'bank.questions': '{n} questions',
      'bank.startbtn': 'start',
      'bank.note': '<b>Note.</b> This platform is <b>preparatory only</b>. It does not issue ASQ or recognized Lean Six Sigma certification — official certificates are issued exclusively by the certifying bodies.',

      'comp.eyebrow': 'Progress',
      'comp.title': 'Competency map',
      'comp.lede': 'Each competency is marked once every lesson in the module that develops it is completed. It is the inverse of an attendance certificate: it shows what is still missing.',
      'comp.legend.done': 'Competency acquired',
      'comp.legend.pending': 'In development',

      'search.eyebrow': 'Search',
      'search.title.results': 'Results for "{q}"',
      'search.title.empty': 'Search the manual',
      'search.hint': 'Type a term in the search box.',
      'search.nohits': 'Nothing found. Try a shorter term (e.g. <code>cpk</code>, <code>kanban</code>, <code>anova</code>).',
      'search.count': '{n} chapters.',

      'progress.title': 'Progress & backup',
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
      'progress.bankname': '{bank} Bank'
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
