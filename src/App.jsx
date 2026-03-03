import { useMemo, useState } from "react";
import toast from "react-hot-toast";

const FEELINGS = [
    { id: "stuck", emoji: "😵‍💫", label: "สมองตัน อ่านไม่เข้า" },
    { id: "anxious", emoji: "😰", label: "กังวล กลัวทำไม่ได้" },
    { id: "tired", emoji: "😴", label: "หมดแรง แต่ยังต้องไปต่อ" },
    { id: "boots", emoji: "🤪", label: "มั่นใจสุดๆ แต่อยากมีอะไรฮีลใจ" },
];

const VIBES = [
    { id: "calm", emoji: "🎧", label: "ฟังแล้วใจนิ่ง" },
    { id: "warm", emoji: "🌱", label: "ฟังแล้วอบอุ่น" },
    { id: "boost", emoji: "🔥", label: "ฟังแล้วมีไฟ" },
    { id: "notalone", emoji: "🌙", label: "ฟังแล้วรู้สึกไม่โดดเดี่ยว" },
];

// ใส่เพลงของร้านเองได้ตรงนี้ (Spotify/YouTube/Apple Music ได้หมด)
const SONGS = {
    calm: [
        { title: "Nothing", artist: "Jeremy Passion", url: "https://open.spotify.com/track/0ShK7xijAYk3YCgbJJ3HsK?si=fc9acdab828c4ce2" },
        { title: "Shoudn't Be", artist: "Luke Chiang", url: "https://open.spotify.com/track/7F6PtLP6fJPVtA1FWVkl8K?si=b6f1d75c07974bb0" },
        { title: "in time", artist: "Takayoshi", url: "https://open.spotify.com/track/6X3PuQegNdXH3eywXqwVdU?si=cb8b19b055cb4c5a" },
    ],
    warm: [
        { title: "Hold On Tight", artist: "Jesse Barrera & Albert Posis", url: "https://open.spotify.com/track/5hPewfonZMGexEhuuTDaDH?si=97491ef35b364dfe" },
        { title: "She Was Mine", artist: "Aj Rafael ft. Jesse Barrera", url: "https://open.spotify.com/track/6NV8bM1StHDcWMoTVWix1J?si=42a1e6d62dd845a7" },
        { title: "Green Tea & Honey", artist: "Dane Amar ", url: "https://open.spotify.com/track/25kxJg4ykcvM1wphY0yIwt?si=1609eee2c7cf4962" },
    ],
    boost: [
        { title: "Happy", artist: "Pharrell Williams", url: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH?si=8a0604ba44474049" },
        { title: "Uptown Funk", artist: "Pocket Piece Mix", url: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS?si=c141dc868b844957" },
        { title: "Feels", artist: "Calvin Harris feat. Pharrell, Katy Perry & Big Sean", url: "https://example.com" },
    ],
    notalone: [
        { title: "Killer", artist: "HYBS", url: "https://open.spotify.com/track/0H4oRjAoMl6EVhBZraB0fn?si=937258c825984283" },
        { title: "Lover Boy", artist: "Phum Viphurit", url: "https://open.spotify.com/track/2rd4FH1cSaWGc0ZiUaMbX9?si=37540db322bd4fd8" },
        { title: "All for you", artist: "Micah edwards feat. Theo Juarez", url: "https://open.spotify.com/track/6ZOlNeH08r47s7TWZUN4IH?si=0c6f19889cce4538" },
    ],
};

const MESSAGES = {
    stuck: [
        "อ่านไม่เข้าไม่ใช่ขี้เกียจนะ แปลว่าเธอเหนื่อยมากแล้ว",
        "วันนี้เอาแค่ 1 หน้าให้จบก็ถือว่าชนะแล้ว",
        "ถ้าสมองตัน ลองพัก 3 นาที แล้วค่อยกลับมาใหม่แบบใจเบา ๆ",
    ],
    anxious: [
        "ใจเต้นแรงเพราะเธอใส่ใจกับมัน แค่นั้นก็เก่งแล้วนะ",
        "ทำได้แค่ไหนก็ได้คะแนนเท่านั้น—ขอแค่เริ่มก่อน",
        "กลัวได้ แต่ขออย่าทิ้งตัวเอง เราอยู่ตรงนี้",
    ],
    tired: [
        "เหนื่อยได้ พักได้ แล้วค่อยไปต่อแบบไม่ต้องโทษตัวเอง",
        "วันนี้ไม่ต้องสุดยอด แค่ยังไปต่อก็พอ",
        "เธอแบกมามากแล้ว เก่งมากจริง ๆ",
    ],
    boots: [
        "ยังอยู่ในเกม ยังไม่แพ้ เกมนี้ยังไม่จบ",
        "อย่าอ่อมตอนนี้ ไฟกำลังมา",
        "เก่งมากแล้ว ขอให้ผ่านช่วงสอบได้ด้วยดี ",
    ],
};

function pickOne(arr, seed) {
    if (!arr?.length) return null;
    const idx = Math.abs(seed) % arr.length;
    return arr[idx];
}

function hashSeed(a, b) {
    const s = `${a || ""}|${b || ""}`;
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return h;
}

export default function App() {
    const [step, setStep] = useState(1);
    const [feeling, setFeeling] = useState(null);
    const [vibe, setVibe] = useState(null);

    const seed = useMemo(() => hashSeed(feeling, vibe), [feeling, vibe]);

    const result = useMemo(() => {
        if (!feeling || !vibe) return null;
        const song = pickOne(SONGS[vibe], seed);
        const msg = pickOne(MESSAGES[feeling], seed + 7);
        return { song, msg };
    }, [feeling, vibe, seed]);

    const canNext = step === 1 ? !!feeling : !!vibe;

    const resetAll = () => {
        setStep(1);
        setFeeling(null);
        setVibe(null);
    };

    const copyText = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast('คัดลอกแล้ว', {
                icon: '✅',
            });
        } catch {
            alert("คัดลอกไม่สำเร็จ ลองคัดลอกเองได้เลยนะ");
        }
    };

    const shareText = (r) => {
        const songLine = r?.song ? `🎧 เพลง: ${r.song.title} — ${r.song.artist}` : "";
        const linkLine = r?.song?.url ? `🔗 ${r.song.url}` : "";
        return [
            "Pocket Piece — เพลงนี้เหมาะกับใจเธอตอนสอบ",
            songLine,
            r?.msg ? `💛 ${r.msg}` : "",
            "",
            "“เพลงนี้เราใส่ลงการ์ดให้แล้วนะ 🎵”",
            "ถ้าอยากพกมันไปด้วยจริง ๆ…",
            "👉 ดูเซ็ตให้กำลังใจ",
            linkLine,
        ]
            .filter(Boolean)
            .join("\n");
    };

    return (
        <div style={styles.page}>
            <div style={styles.wrap}>
                <header style={styles.header}>
                    <div style={styles.badge}>Pocket Piece</div>
                    <h1 style={styles.h1}>🎧 เพลงนี้เหมาะกับเธอตอนช่วงสอบ</h1>
                    <p style={styles.sub}>
                        <b>ช่วงนี้คงเครียด</b> <br />
                        เราขอมอบ <b>สิ่งเพิ่มพลังใจให้</b>
                    </p>
                </header>

                <main style={styles.card}>
                    {step !== 3 && (
                        <div style={styles.stepRow}>
                            <span style={styles.stepDot(step >= 1)} />
                            <span style={styles.stepDot(step >= 2)} />
                            <span style={styles.stepDot(step >= 3)} />
                        </div>
                    )}

                    {step === 1 && (
                        <>
                            <h2 style={styles.h2}>STEP 1 — ตอนนี้รู้สึกยังไงกับการสอบ</h2>
                            <div style={styles.grid}>
                                {FEELINGS.map((x) => (
                                    <button
                                        key={x.id}
                                        onClick={() => setFeeling(x.id)}
                                        style={{
                                            ...styles.choice,
                                            ...(feeling === x.id ? styles.choiceActive : {}),
                                        }}
                                    >
                                        <span style={styles.choiceEmoji}>{x.emoji}</span>
                                        <span style={styles.choiceLabel}>{x.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div style={styles.actions}>
                                <button
                                    style={{ ...styles.btn, ...(canNext ? styles.btnPrimary : styles.btnDisabled) }}
                                    onClick={() => canNext && setStep(2)}
                                >
                                    ไปต่อ
                                </button>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 style={styles.h2}>STEP 2 — อยากได้เพลงแบบไหน</h2>
                            <div style={styles.grid}>
                                {VIBES.map((x) => (
                                    <button
                                        key={x.id}
                                        onClick={() => setVibe(x.id)}
                                        style={{
                                            ...styles.choice,
                                            ...(vibe === x.id ? styles.choiceActive : {}),
                                        }}
                                    >
                                        <span style={styles.choiceEmoji}>{x.emoji}</span>
                                        <span style={styles.choiceLabel}>{x.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div style={styles.actions}>
                                <button style={styles.btn} onClick={() => setStep(1)}>
                                    ย้อนกลับ
                                </button>
                                <button
                                    style={{ ...styles.btn, ...(canNext ? styles.btnPrimary : styles.btnDisabled) }}
                                    onClick={() => canNext && setStep(3)}
                                >
                                    เลือกเพลงให้หน่อย
                                </button>
                            </div>
                        </>
                    )}

                    {step === 3 && result && (
                        <>
                            <h2 style={styles.h2}>🎵 เพลงที่เหมาะกับใจเธอตอนนี้</h2>

                            <div style={styles.resultCard}>
                                <div style={styles.songTitle}>{result.song?.title}</div>
                                <div style={styles.songArtist}>{result.song?.artist}</div>

                                <a href={result.song?.url} target="_blank" rel="noreferrer" style={styles.link}>
                                    เปิดเพลง
                                </a>

                                <div style={styles.msgBox}>“{result.msg}”</div>

                                <div style={styles.softBox}>
                                    <div style={styles.softTitle}>“เพลงนี้เราใส่ลงการ์ดให้แล้วนะ 🎵”</div>
                                    <div style={styles.softText}>
                                        ถ้าอยากพกมันไปด้วยจริง ๆ… <br />
                                    </div>
                                </div>

                                <div style={styles.ctaRow}>
                                    <a
                                        href="https://www.instagram.com/pocket.piece/"
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{ ...styles.btn, ...styles.btnPrimary, textDecoration: "none", display: "inline-flex" }}
                                    >
                                        ดูเซ็ตให้กำลังใจ
                                    </a>

                                    <button style={styles.btn} onClick={() => copyText(shareText(result))}>
                                        คัดลอกข้อความ
                                    </button>
                                </div>

                                <div style={styles.smallNote}>
                                    รับความหวังดีนี้ไว้นะ
                                </div>
                            </div>

                            <div style={styles.actions}>
                                <button style={styles.btn} onClick={resetAll}>
                                    ทำใหม่อีกรอบ
                                </button>
                            </div>

                            <div style={styles.footerText}>
                                ถ้าเธอผ่านมาเจอหน้านี้ แปลว่าเธอกำลังพยายามอยู่ <br />
                                และแค่นั้นก็เก่งแล้วนะ 🤍
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 20% 0%, #fff7ea 0%, #fbf4ee 45%, #f6efe8 100%)",
        color: "#1f1f1f",
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily:
            'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans Thai", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
    },
    wrap: { width: "100%", maxWidth: 860 },
    header: { textAlign: "center", marginBottom: 18 },
    badge: {
        display: "inline-flex",
        padding: "6px 12px",
        borderRadius: 999,
        background: "#ffffffcc",
        border: "1px solid #00000010",
        fontSize: 12,
        letterSpacing: 0.4,
    },
    h1: { margin: "12px 0 6px", fontSize: 30, lineHeight: 1.2 },
    sub: { margin: 0, opacity: 0.85, fontSize: 16, lineHeight: 1.5 },

    card: {
        background: "#ffffffd9",
        border: "1px solid #00000010",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        backdropFilter: "blur(6px)",
    },
    stepRow: { display: "flex", gap: 8, justifyContent: "center", marginBottom: 10 },
    stepDot: (on) => ({
        width: 10,
        height: 10,
        borderRadius: 999,
        background: on ? "#3a2f2a" : "#00000018",
    }),

    h2: { margin: "6px 0 14px", fontSize: 18 },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: 10,
    },
    choice: {
        borderRadius: 16,
        border: "1px solid #00000012",
        background: "#fff",
        padding: "12px 12px",
        textAlign: "left",
        cursor: "pointer",
        display: "flex",
        gap: 10,
        alignItems: "center",
        transition: "transform .08s ease, box-shadow .08s ease, border-color .08s ease",
    },
    choiceActive: {
        borderColor: "#3a2f2a55",
        boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
        transform: "translateY(-1px)",
    },
    choiceEmoji: { fontSize: 20, width: 28, textAlign: "center" },
    choiceLabel: { fontSize: 14, lineHeight: 1.35 },

    actions: { display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 14, flexWrap: "wrap" },
    btn: {
        borderRadius: 14,
        border: "1px solid #00000014",
        background: "#fff",
        padding: "10px 14px",
        cursor: "pointer",
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
    },
    btnPrimary: { background: "#3a2f2a", borderColor: "#3a2f2a", color: "#fff" },
    btnDisabled: { opacity: 0.45, cursor: "not-allowed" },

    resultCard: {
        borderRadius: 18,
        border: "1px dashed #00000018",
        background: "linear-gradient(180deg, #fffdf8, #fff)",
        padding: 16,
    },
    songTitle: { fontSize: 18, fontWeight: 700, marginBottom: 2 },
    songArtist: { fontSize: 13, opacity: 0.75, marginBottom: 10 },
    link: { display: "inline-flex", marginBottom: 12, color: "#3a2f2a", fontWeight: 600 },
    msgBox: {
        marginTop: 6,
        borderRadius: 14,
        padding: "12px 12px",
        background: "#fff7ea",
        border: "1px solid #00000010",
        lineHeight: 1.55,
    },
    softBox: {
        marginTop: 12,
        borderRadius: 14,
        padding: "12px 12px",
        background: "#f6efe8",
        border: "1px solid #00000010",
        lineHeight: 1.55,
    },
    softTitle: { fontWeight: 700, marginBottom: 4 },
    softText: { opacity: 0.9 },

    ctaRow: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 14 },
    smallNote: { marginTop: 10, fontSize: 12, opacity: 0.7 },
    footerText: { marginTop: 14, textAlign: "center", fontSize: 13, opacity: 0.8, lineHeight: 1.6 },
};