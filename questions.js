const QUESTIONS_DATA = [
  // === RONDE 1 (1 - 12) ===
  {
    id: "r1-1",
    globalNumber: 1,
    number: 1,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "KOHESI",
    text: "Gaya tarik-menarik antarmolekul sejenis."
  },
  {
    id: "r1-2",
    globalNumber: 2,
    number: 2,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "SILINDER",
    text: "Tabung tempat piston bergerak."
  },
  {
    id: "r1-3",
    globalNumber: 3,
    number: 3,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "VOLUME",
    text: "Besarnya ruang yang ditempati suatu benda."
  },
  {
    id: "r1-4",
    globalNumber: 4,
    number: 4,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "MANOMETER",
    text: "Alat untuk mengukur tekanan gas atau fluida."
  },
  {
    id: "r1-5",
    globalNumber: 5,
    number: 5,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "PISTON",
    text: "Komponen yang bergerak di dalam silinder."
  },
  {
    id: "r1-6",
    globalNumber: 6,
    number: 6,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "PERMUKAAN",
    text: "Batas bagian atas fluida."
  },
  {
    id: "r1-7",
    globalNumber: 7,
    number: 7,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "STREAMLINE",
    text: "Istilah bahasa Inggris untuk garis arus."
  },
  {
    id: "r1-8",
    globalNumber: 8,
    number: 8,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "DENSITAS",
    text: "Istilah lain untuk massa jenis."
  },
  {
    id: "r1-9",
    globalNumber: 9,
    number: 9,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "DEBIT",
    text: "Volume fluida yang mengalir tiap satuan waktu."
  },
  {
    id: "r1-10",
    globalNumber: 10,
    number: 10,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "APUNG",
    text: "Keadaan benda ketika gaya apung menopang beratnya."
  },
  {
    id: "r1-11",
    globalNumber: 11,
    number: 11,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "HIDROLIK",
    text: "Sistem yang menggunakan tekanan fluida untuk memindahkan gaya."
  },
  {
    id: "r1-12",
    globalNumber: 12,
    number: 12,
    round: 1,
    roundName: "Ronde 1 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "MENISKUS",
    text: "Bentuk permukaan cairan dalam wadah atau tabung."
  },

  // === RONDE 2 (1 - 12) ===
  {
    id: "r2-1",
    globalNumber: 13,
    number: 1,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "ARCHIMEDES",
    text: "Ilmuwan yang merumuskan prinsip gaya apung."
  },
  {
    id: "r2-2",
    globalNumber: 14,
    number: 2,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "TEGANGAN PERMUKAAN",
    text: "Kecenderungan permukaan cairan seperti memiliki selaput."
  },
  {
    id: "r2-3",
    globalNumber: 15,
    number: 3,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "BERNOULLI",
    text: "Nama ilmuwan yang merumuskan persamaan Bernoulli."
  },
  {
    id: "r2-4",
    globalNumber: 16,
    number: 4,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "PASCAL",
    text: "Satuan SI untuk tekanan."
  },
  {
    id: "r2-5",
    globalNumber: 17,
    number: 5,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "TEKANAN ATMOSFER",
    text: "Tekanan yang diberikan oleh udara atmosfer."
  },
  {
    id: "r2-6",
    globalNumber: 18,
    number: 6,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "HUKUM ARCHIMEDES",
    text: "Prinsip tentang gaya ke atas pada benda dalam fluida."
  },
  {
    id: "r2-7",
    globalNumber: 19,
    number: 7,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "BERAT JENIS",
    text: "Berat suatu zat tiap satuan volume."
  },
  {
    id: "r2-8",
    globalNumber: 20,
    number: 8,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "REM HIDROLIK",
    text: "Rem kendaraan yang memanfaatkan tekanan fluida."
  },
  {
    id: "r2-9",
    globalNumber: 21,
    number: 9,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "HUKUM PASCAL",
    text: "Prinsip bahwa tekanan pada fluida tertutup diteruskan sama besar."
  },
  {
    id: "r2-10",
    globalNumber: 22,
    number: 10,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "PIPA KAPILER",
    text: "Pipa berdiameter sangat kecil yang menunjukkan kapilaritas."
  },
  {
    id: "r2-11",
    globalNumber: 23,
    number: 11,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "KONTINUITAS",
    text: "Prinsip kekekalan laju aliran massa fluida."
  },
  {
    id: "r2-12",
    globalNumber: 24,
    number: 12,
    round: 2,
    roundName: "Ronde 2 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "ADHESI",
    text: "Gaya tarik-menarik antara molekul berbeda jenis."
  },

  // === RONDE 3 (1 - 12) ===
  {
    id: "r3-1",
    globalNumber: 25,
    number: 1,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "VOLUME TERCELUP",
    text: "Bagian volume benda yang berada di dalam fluida."
  },
  {
    id: "r3-2",
    globalNumber: 26,
    number: 2,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "LUAS",
    text: "Ukuran bidang tempat gaya bekerja."
  },
  {
    id: "r3-3",
    globalNumber: 27,
    number: 3,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "KEDALAMAN",
    text: "Jarak vertikal dari permukaan fluida ke suatu titik."
  },
  {
    id: "r3-4",
    globalNumber: 28,
    number: 4,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "KECEPATAN ALIRAN",
    text: "Jarak yang ditempuh fluida tiap satuan waktu."
  },
  {
    id: "r3-5",
    globalNumber: 29,
    number: 5,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "TEKANAN HIDROSTATIS",
    text: "Tekanan akibat berat fluida yang diam."
  },
  {
    id: "r3-6",
    globalNumber: 30,
    number: 6,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "BAROMETER",
    text: "Alat untuk mengukur tekanan atmosfer."
  },
  {
    id: "r3-7",
    globalNumber: 31,
    number: 7,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "HIDROMETER",
    text: "Alat untuk mengukur massa jenis cairan."
  },
  {
    id: "r3-8",
    globalNumber: 32,
    number: 8,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "PERSAMAAN KONTINUITAS",
    text: "Persamaan yang menghubungkan luas penampang dan kecepatan aliran."
  },
  {
    id: "r3-9",
    globalNumber: 33,
    number: 9,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "WAKTU",
    text: "Lama berlangsungnya aliran."
  },
  {
    id: "r3-10",
    globalNumber: 34,
    number: 10,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "menurun",
    direction: "Menurun",
    answer: "HIDROSTATIKA",
    text: "Cabang ilmu yang mempelajari fluida dalam keadaan diam."
  },
  {
    id: "r3-11",
    globalNumber: 35,
    number: 11,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "PERSAMAAN BERNOULLI",
    text: "Hubungan tekanan, kecepatan, dan ketinggian fluida."
  },
  {
    id: "r3-12",
    globalNumber: 36,
    number: 12,
    round: 3,
    roundName: "Ronde 3 (1 - 12)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "HIDROSTATIS",
    text: "Berkaitan dengan fluida dalam keadaan diam."
  },

  // === SOAL CADANGAN (1 - 14) ===
  {
    id: "r4-1",
    globalNumber: 37,
    number: 1,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "menurun",
    direction: "Menurun",
    answer: "ZAT CAIR",
    text: "Fluida yang memiliki volume tetap tetapi bentuk mengikuti wadah."
  },
  {
    id: "r4-2",
    globalNumber: 38,
    number: 2,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "menurun",
    direction: "Menurun",
    answer: "GAYA APUNG",
    text: "Gaya ke atas yang diberikan fluida pada benda."
  },
  {
    id: "r4-3",
    globalNumber: 39,
    number: 3,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "menurun",
    direction: "Menurun",
    answer: "FLUIDA DINAMIS",
    text: "Fluida yang sedang bergerak atau mengalir."
  },
  {
    id: "r4-4",
    globalNumber: 40,
    number: 4,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "BERAT",
    text: "Gaya gravitasi yang bekerja pada benda."
  },
  {
    id: "r4-5",
    globalNumber: 41,
    number: 5,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "menurun",
    direction: "Menurun",
    answer: "MASSA JENIS",
    text: "Massa tiap satuan volume suatu zat."
  },
  {
    id: "r4-6",
    globalNumber: 42,
    number: 6,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "ALIRAN",
    text: "Gerakan fluida dari satu tempat ke tempat lain."
  },
  {
    id: "r4-7",
    globalNumber: 43,
    number: 7,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "menurun",
    direction: "Menurun",
    answer: "KAPILARITAS",
    text: "Peristiwa naik atau turunnya cairan dalam pipa sempit."
  },
  {
    id: "r4-8",
    globalNumber: 44,
    number: 8,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "menurun",
    direction: "Menurun",
    answer: "TEKANAN",
    text: "Gaya yang bekerja pada setiap satuan luas."
  },
  {
    id: "r4-9",
    globalNumber: 45,
    number: 9,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "DONGKRAK",
    text: "Alat yang memanfaatkan prinsip hidrolik untuk mengangkat beban."
  },
  {
    id: "r4-10",
    globalNumber: 46,
    number: 10,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "TENGGELAM",
    text: "Beratnya lebih besar daripada gaya apung."
  },
  {
    id: "r4-11",
    globalNumber: 47,
    number: 11,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "MELAYANG",
    text: "Gaya apung sama dengan berat benda."
  },
  {
    id: "r4-12",
    globalNumber: 48,
    number: 12,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "FLUIDA",
    text: "Zat yang dapat mengalir."
  },
  {
    id: "r4-13",
    globalNumber: 49,
    number: 13,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "menurun",
    direction: "Menurun",
    answer: "GAYA",
    text: "Tarikan atau dorongan yang bekerja pada benda."
  },
  {
    id: "r4-14",
    globalNumber: 50,
    number: 14,
    round: 4,
    roundName: "Soal Cadangan (1 - 14)",
    type: "mendatar",
    direction: "Mendatar",
    answer: "ZAT GAS",
    text: "Fluida yang bentuk dan volumenya mengikuti ruang yang ditempatinya."
  }
];

// === KONFIGURASI RONDE ===
const ROUNDS_CONFIG = [
  { id: "all", label: "Semua Soal", range: "1 - 50", total: 50 },
  { id: "1", label: "Ronde 1", range: "1 - 12", total: 12 },
  { id: "2", label: "Ronde 2", range: "1 - 12", total: 12 },
  { id: "3", label: "Ronde 3", range: "1 - 12", total: 12 },
  { id: "4", label: "Soal Cadangan", range: "1 - 14", total: 14 }
];
