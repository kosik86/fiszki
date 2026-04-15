import React, { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "vocab_spa_collections_v2";
const QUIZ_LENGTH = 10;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    color: "#0f172a",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
    padding: 16,
    boxSizing: "border-box",
  },
  container: {
    maxWidth: 1000,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    background: "#ffffff",
    borderRadius: 20,
    padding: 24,
    border: "1px solid #e2e8f0",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    margin: 0,
    color: "#0f172a",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#334155",
    fontSize: 15,
    lineHeight: 1.5,
  },
  row: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  },
  button: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#0f172a",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  buttonPrimary: {
    border: "1px solid #0f172a",
    background: "#0f172a",
    color: "#ffffff",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  buttonDanger: {
    border: "1px solid #dc2626",
    background: "#ffffff",
    color: "#b91c1c",
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  card: {
    background: "#ffffff",
    borderRadius: 16,
    padding: 20,
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    margin: 0,
    fontSize: 21,
    fontWeight: 800,
    color: "#0f172a",
  },
  muted: {
    color: "#475569",
  },
  small: {
    fontSize: 13,
    color: "#64748b",
  },
  gridTwo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: 20,
  },
  label: {
    display: "block",
    fontWeight: 700,
    marginBottom: 8,
    color: "#0f172a",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 15,
    color: "#111827",
    background: "#ffffff",
    boxSizing: "border-box",
    marginBottom: 14,
  },
  select: {
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    fontSize: 15,
    color: "#111827",
    background: "#ffffff",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 12,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 14,
    background: "#ffffff",
  },
  progressWrap: {
    width: "100%",
    height: 6,
    background: "#e2e8f0",
    borderRadius: 999,
    overflow: "hidden",
    margin: "10px 0 18px",
  },
  progressBar: {
    height: "100%",
    background: "#0f172a",
    borderRadius: 999,
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 10,
    marginTop: 24,
  },
  optionButton: {
    minHeight: 56,
    textAlign: "left",
    whiteSpace: "normal",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#0f172a",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 500,
  },
  centerCard: {
    maxWidth: 720,
    margin: "0 auto",
  },
  score: {
    fontSize: 48,
    fontWeight: 800,
    margin: "8px 0",
    color: "#0f172a",
  },
  error: {
    color: "#b91c1c",
    fontWeight: 600,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    background: "#e2e8f0",
    margin: "16px 0",
  },
  minimalPage: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#0f172a",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, sans-serif",
    padding: 24,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  minimalWrap: {
    width: "100%",
    maxWidth: 720,
  },
  minimalTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    fontSize: 14,
    color: "#64748b",
    marginBottom: 20,
  },
  minimalWord: {
    fontSize: 52,
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
    margin: "8px 0 28px",
  },
  minimalSummary: {
    maxWidth: 560,
  },
};

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "quiz";
}

function readRoute() {
  const rawHash = window.location.hash.replace(/^#/, "");
  const normalized = rawHash.startsWith("/") ? rawHash : `/${rawHash}`;
  const clean = normalized.replace(/^\/+|\/+$/g, "");
  const parts = clean ? clean.split("/") : [];

  const quizId = parts[0] || "default";
  const mode = parts[1] === "learn" ? "learn" : "add";

  return { quizId, mode };
}

function setHashRoute(quizId, mode = "add") {
  const safeQuizId = quizId || "default";
  const safeMode = mode === "learn" ? "learn" : "add";
  const nextHash = safeMode === "learn" ? `#/${safeQuizId}/learn` : `#/${safeQuizId}`;
  window.location.hash = nextHash;
}

function loadCollections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function sanitizeWords(words) {
  if (!Array.isArray(words)) return [];
  return words.filter(
    (item) =>
      item &&
      typeof item.id === "string" &&
      typeof item.word === "string" &&
      typeof item.translation === "string"
  );
}

function loadQuizData(quizId) {
  const collections = loadCollections();
  const current = collections[quizId];
  if (!current) {
    return {
      meta: { id: quizId, name: quizId === "default" ? "Domyślny quiz" : quizId },
      words: [],
    };
  }

  return {
    meta: {
      id: quizId,
      name: typeof current.name === "string" && current.name.trim() ? current.name : quizId,
    },
    words: sanitizeWords(current.words),
  };
}

function saveQuizData(quizId, name, words) {
  const collections = loadCollections();
  collections[quizId] = {
    name,
    words,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
}

function deleteQuizData(quizId) {
  const collections = loadCollections();
  delete collections[quizId];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
}

function listQuizzes() {
  const collections = loadCollections();
  const entries = Object.entries(collections).map(([id, value]) => ({
    id,
    name: value?.name || id,
    count: Array.isArray(value?.words) ? value.words.length : 0,
  }));

  if (!entries.find((item) => item.id === "default")) {
    entries.unshift({ id: "default", name: "Domyślny quiz", count: 0 });
  }

  return entries.sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

function buildQuizRound(words, length = QUIZ_LENGTH) {
  if (words.length < 4) return [];

  const shuffledWords = shuffle(words);
  const rounds = [];

  for (let i = 0; i < length; i++) {
    const correct = shuffledWords[i % shuffledWords.length];
    const wrongPool = shuffle(words.filter((w) => w.id !== correct.id))
      .slice(0, 3)
      .map((w) => w.translation);

    rounds.push({
      id: `${correct.id}-${i}`,
      word: correct.word,
      correctTranslation: correct.translation,
      options: shuffle([correct.translation, ...wrongPool]),
    });
  }

  return rounds;
}

function StatCard({ label, value }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.muted, fontWeight: 700 }}>{label}</div>
      <div style={{ marginTop: 8, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>{value}</div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div style={styles.progressWrap}>
      <div style={{ ...styles.progressBar, width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function AddMode({
  quizId,
  quizName,
  quizzes,
  words,
  onAddWord,
  onDeleteWord,
  onClearAll,
  onCreateQuiz,
  onSwitchQuiz,
  onDeleteQuiz,
  onExport,
  onImport,
}) {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [error, setError] = useState("");
  const [newQuizName, setNewQuizName] = useState("");
  const importRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedWord = word.trim();
    const trimmedTranslation = translation.trim();

    if (!trimmedWord || !trimmedTranslation) {
      setError("Uzupełnij słowo i tłumaczenie.");
      return;
    }

    onAddWord(trimmedWord, trimmedTranslation);
    setWord("");
    setTranslation("");
    setError("");
  };

  const handleCreateQuiz = () => {
    const name = newQuizName.trim();
    if (!name) return;
    onCreateQuiz(name);
    setNewQuizName("");
  };

  return (
    <div style={styles.gridTwo}>
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Ustawienia quizu</h2>
        <div style={{ marginTop: 18 }}>
          <label style={styles.label}>Aktywny quiz</label>
          <div style={styles.row}>
            <select
              value={quizId}
              onChange={(e) => onSwitchQuiz(e.target.value)}
              style={styles.select}
            >
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.name} ({quiz.count})
                </option>
              ))}
            </select>
            <button type="button" style={styles.button} onClick={onExport}>
              Eksport JSON
            </button>
            <button type="button" style={styles.button} onClick={() => importRef.current?.click()}>
              Import JSON
            </button>
            <input
              ref={importRef}
              type="file"
              accept="application/json"
              style={{ display: "none" }}
              onChange={onImport}
            />
          </div>
          <p style={{ ...styles.small, marginTop: 10 }}>
            URL tego quizu: <strong>#/{quizId}</strong> oraz <strong>#/{quizId}/learn</strong>
          </p>
        </div>

        <div style={styles.divider} />

        <label style={styles.label}>Nowy quiz</label>
        <input
          value={newQuizName}
          onChange={(e) => setNewQuizName(e.target.value)}
          placeholder="np. Angielski podstawy"
          style={styles.input}
        />
        <div style={styles.row}>
          <button type="button" style={styles.buttonPrimary} onClick={handleCreateQuiz}>
            Utwórz nowy quiz
          </button>
          <button
            type="button"
            style={styles.buttonDanger}
            onClick={onDeleteQuiz}
            disabled={quizId === "default"}
          >
            Usuń ten quiz
          </button>
        </div>

        <div style={styles.divider} />

        <h2 style={styles.cardTitle}>Dodawanie słówek</h2>
        <p style={{ ...styles.small, margin: "8px 0 16px" }}>{quizName}</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="word" style={styles.label}>Słowo</label>
          <input
            id="word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="np. apple"
            style={styles.input}
          />

          <label htmlFor="translation" style={styles.label}>Tłumaczenie</label>
          <input
            id="translation"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder="np. jabłko"
            style={styles.input}
          />

          {error ? <div style={styles.error}>{error}</div> : null}

          <div style={styles.row}>
            <button type="submit" style={styles.buttonPrimary}>Dodaj do bazy</button>
            <button
              type="button"
              style={styles.buttonDanger}
              onClick={onClearAll}
              disabled={words.length === 0}
            >
              Wyczyść bazę
            </button>
          </div>
        </form>
      </div>

      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Baza słówek</h2>
        <p style={{ ...styles.small, margin: "8px 0 16px" }}>{quizName}</p>
        {words.length === 0 ? (
          <p style={{ ...styles.muted, marginTop: 16 }}>
            Brak zapisanych słówek. Dodaj co najmniej 4, aby uruchomić tryb nauki.
          </p>
        ) : (
          <div style={styles.list}>
            {words.map((item) => (
              <div key={item.id} style={styles.listItem}>
                <div>
                  <div style={{ fontWeight: 700 }}>{item.word}</div>
                  <div style={styles.muted}>{item.translation}</div>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteWord(item.id)}
                  style={styles.button}
                  aria-label={`Usuń ${item.word}`}
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LearnMode({ words, quizName, quizId }) {
  const [rounds, setRounds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  const currentRound = rounds[currentIndex];

  const resetQuiz = () => {
    const nextRounds = buildQuizRound(words, QUIZ_LENGTH);
    setRounds(nextRounds);
    setCurrentIndex(0);
    setSelected(null);
    setScore(0);
    setShowSummary(false);
  };

  useEffect(() => {
    resetQuiz();
  }, [words, quizId]);

  const handleAnswer = (option) => {
    if (!currentRound || selected) return;

    setSelected(option);
    const isCorrect = option === currentRound.correctTranslation;
    const nextScore = score + (isCorrect ? 1 : 0);

    window.setTimeout(() => {
      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      const isLast = currentIndex >= rounds.length - 1;
      if (isLast) {
        setScore(nextScore);
        setShowSummary(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setSelected(null);
      }
    }, 450);
  };

  if (words.length < 4) {
    return (
      <div style={styles.minimalPage}>
        <div style={{ ...styles.minimalWrap, ...styles.minimalSummary }}>
          <div style={styles.minimalTop}>
            <span>{quizName}</span>
            <span>#/{quizId}</span>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Za mało słówek</div>
          <div style={{ fontSize: 16, color: "#475569", lineHeight: 1.5 }}>
            Aby rozpocząć naukę, dodaj przynajmniej 4 słówka w trybie edycji tego quizu.
          </div>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const percentage = Math.round((score / rounds.length) * 100);

    return (
      <div style={styles.minimalPage}>
        <div style={{ ...styles.minimalWrap, ...styles.minimalSummary }}>
          <div style={styles.minimalTop}>
            <span>{quizName}</span>
            <span>{score} / {rounds.length}</span>
          </div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1 }}>{percentage}%</div>
          <div style={{ fontSize: 18, color: "#475569", marginTop: 12, marginBottom: 24 }}>
            Wynik końcowy: {score} poprawnych odpowiedzi na {rounds.length} pytań.
          </div>
          <ProgressBar value={percentage} />
          <div style={{ marginTop: 22 }}>
            <button type="button" style={styles.buttonPrimary} onClick={resetQuiz}>
              Zagraj ponownie
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentRound) return null;

  return (
    <div style={styles.minimalPage}>
      <div style={styles.minimalWrap}>
        <div style={styles.minimalTop}>
          <span>{currentIndex + 1} / {rounds.length}</span>
          <span>{quizName}</span>
        </div>
        <ProgressBar value={((currentIndex + 1) / rounds.length) * 100} />
        <div style={styles.minimalWord}>{currentRound.word}</div>
        <div style={styles.optionsGrid}>
          {currentRound.options.map((option) => {
            const isCorrect = option === currentRound.correctTranslation;
            const isSelected = selected === option;

            let optionStyle = { ...styles.optionButton };
            if (selected) {
              if (isCorrect) {
                optionStyle = {
                  ...optionStyle,
                  border: "1px solid #16a34a",
                  background: "#f0fdf4",
                };
              } else if (isSelected) {
                optionStyle = {
                  ...optionStyle,
                  border: "1px solid #dc2626",
                  background: "#fef2f2",
                };
              }
            }

            return (
              <button
                key={option}
                type="button"
                style={optionStyle}
                onClick={() => handleAnswer(option)}
                disabled={Boolean(selected)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [{ quizId, mode }, setRoute] = useState(readRoute());
  const [quizName, setQuizName] = useState("");
  const [words, setWords] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const syncRoute = () => setRoute(readRoute());
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      window.removeEventListener("hashchange", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  useEffect(() => {
    const data = loadQuizData(quizId);
    setQuizName(data.meta.name);
    setWords(data.words);
    setQuizzes(listQuizzes());
  }, [quizId]);

  const stats = useMemo(
    () => ({
      count: words.length,
      learnReady: words.length >= 4,
    }),
    [words]
  );

  const refreshQuizList = () => setQuizzes(listQuizzes());

  const updateWords = (nextWords, nextName = quizName) => {
    setWords(nextWords);
    saveQuizData(quizId, nextName, nextWords);
    refreshQuizList();
  };

  const addWord = (word, translation) => {
    const nextWords = [
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        word,
        translation,
      },
      ...words,
    ];
    updateWords(nextWords);
  };

  const deleteWord = (id) => {
    updateWords(words.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    updateWords([]);
  };

  const goToMode = (nextMode) => {
    setHashRoute(quizId, nextMode);
  };

  const createQuiz = (name) => {
    const slugBase = slugify(name);
    const existing = new Set(listQuizzes().map((item) => item.id));
    let finalSlug = slugBase;
    let counter = 2;
    while (existing.has(finalSlug)) {
      finalSlug = `${slugBase}-${counter}`;
      counter += 1;
    }
    saveQuizData(finalSlug, name, []);
    refreshQuizList();
    setHashRoute(finalSlug, mode);
  };

  const switchQuiz = (nextQuizId) => {
    setHashRoute(nextQuizId, mode);
  };

  const deleteQuiz = () => {
    if (quizId === "default") return;
    deleteQuizData(quizId);
    refreshQuizList();
    setHashRoute("default", "add");
  };

  const exportQuiz = () => {
    const payload = {
      quiz: {
        id: quizId,
        name: quizName,
      },
      words,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${quizId}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importQuiz = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const importedWords = sanitizeWords(parsed?.words);
      const importedName = typeof parsed?.quiz?.name === "string" && parsed.quiz.name.trim()
        ? parsed.quiz.name.trim()
        : quizName;

      setQuizName(importedName);
      saveQuizData(quizId, importedName, importedWords);
      setWords(importedWords);
      refreshQuizList();
    } catch {
      window.alert("Nie udało się zaimportować pliku JSON.");
    } finally {
      event.target.value = "";
    }
  };

  if (mode === "learn") {
    return <LearnMode words={words} quizName={quizName} quizId={quizId} />;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Fiszki SPA</h1>
            <p style={styles.subtitle}>
              Każdy quiz ma własny adres w hashu, więc aplikacja działa także na prostym hostingu statycznym bez konfiguracji serwera.
            </p>
          </div>

          <div style={styles.row}>
            <button
              type="button"
              onClick={() => goToMode("add")}
              style={mode === "add" ? styles.buttonPrimary : styles.button}
            >
              Edycja
            </button>
            <button
              type="button"
              onClick={() => goToMode("learn")}
              style={styles.button}
              disabled={!stats.learnReady}
            >
              Otwórz naukę
            </button>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <StatCard label="Quiz" value={quizName} />
          <StatCard label="Liczba słówek" value={stats.count} />
          <StatCard label="Tryb nauki" value={stats.learnReady ? `#/${quizId}/learn` : "Wymaga min. 4 słówek"} />
        </div>

        <AddMode
          quizId={quizId}
          quizName={quizName}
          quizzes={quizzes}
          words={words}
          onAddWord={addWord}
          onDeleteWord={deleteWord}
          onClearAll={clearAll}
          onCreateQuiz={createQuiz}
          onSwitchQuiz={switchQuiz}
          onDeleteQuiz={deleteQuiz}
          onExport={exportQuiz}
          onImport={importQuiz}
        />
      </div>
    </div>
  );
}
