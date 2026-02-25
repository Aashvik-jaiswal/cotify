const songs = [
  "aaja_mahi.mp3",
  "aankho_se_batana.mp3",
  "aaoge_tum_kabhi.mp3",
  "aaya_na_tu.mp3",
  "aise_kyun_X_kho_gaye.mp3",
  "ami_tomake.mp3",
  "anatariksh.mp3",
  "apa_fer_milangey.mp3",
  "baarishein.mp3",
  "BYE.mp3",
  "chehre.mp3",
  "choo_lo.mp3",
  "choti_choti_gal.mp3",
  "dhadak_title_track.mp3",
  "dil_besabar.mp3",
  "dil_tu_jaan_tu.mp3",
  "din_te_raat.mp3",
  "dooriyan.mp3",
  "ek_raat.mp3",
  "faasle.mp3",
  "fakira.mp3",
  "finding_her.mp3",
  "goodbye.mp3",
  "hasi_ban_gaye.mp3",
  "hasi_female_version.mp3",
  "heer_ranjha.mp3",
  "husn.mp3",
  "i_love_you.mp3",
  "ishq_ibadaat.mp3",
  "ishq.mp3",
  "jaan'_nisaar.mp3",
  "jeena_jeena.mp3",
  "jo_tu_na_mila.mp3",
  "jo_tum_mere_ho.mp3",
  "judaai.mp3",
  "kabhi_tumhe.mp3",
  "kabhi_usey_noor_noor_kehta_hu.mp3",
  "kahani_suno_2.0.mp3",

  "thodi_der.mp3",
  "toota_jo_kabhi_tara_slow.mp3",
  "toota_jo_kabhi_tara.mp3",
  "tu_hai_kahan.mp3",
  "tu_hai_lofi.mp3",
  "tu_hain_toh_main_hoon.mp3",
  "tu_jaana_na_piya.mp3",
  "tujhe_kitna_chahne_lage_hum.mp3",
  "tum_hi_ho_bandhu.mp3",
  "tum_mere_2.mp3",
  "tum_todo_na.mp3",
  "tune_jo_na_kha.mp3",
  "vida_karo.mp3",
  "ye_raatein_ye_mausam.mp3",
  "yeh_fitoor_mera.mp3",
  "zakhm.mp3",
  "zinda.mp3",
  "zindagi_bata_de.mp3",
  "zindagi_khuch_to_bata.mp3",
  "zindagi_tu_aana.mp3",

  "kaise_batayein_tumhe.mp3",
  "kaise_hua.mp3",
  "kasoor.mp3",
  "kaun_tujhe.mp3",
  "khamoshiyan.mp3",
  "khwab.mp3",
  "kya_tu_theek_hai.mp3",
  "kya_us_gali_me.mp3",
  "lofi_love.mp3",
  "love_again.mp3",
  "love_is_the_remedy.mp3",
  "main_akela_hoon.mp3",
  "mai_rang_sharbaton_ka.mp3",
  "mangoge_na.mp3",
  "mitwa.mp3",
  "naadaniyan.mp3",
  "naseeb.mp3",
  "paro.mp3",
  "pehla_nasha_2.0.mp3",
  "pehle_bhi_main.mp3",
  "pehli_dafa.mp3",
  "pyarr.mp3",
  "raabta.mp3",
  "raahiya_ve.mp3",
  "rafa_dafa.mp3",
  "ranjhaa.mp3",
  "rihaayi.mp3",
  "rok_na_paya.mp3",
  "sab_tera.mp3",
  "sajke.mp3",
  "sang_rahiyo.mp3",
  "savera.mp3",
  "shikayat.mp3",
  "soulmate.mp3",
  "suniyan_suniyan.mp3",
  "teenu_na_bol_paawan.mp3",
  "tera_ban_jaunga.mp3",
  "tere_ho_ke.mp3",
  "teri_deewani.mp3"
].map(file => ({
  title: file.replace(".mp3", "")
              .replaceAll("_", " ")
              .replace(/\b\w/g, l => l.toUpperCase()),
  file: "songs/" + file,
  cover: "covers/" + file.replace(".mp3", ".jpg")
}));

/* ================= ELEMENTS ================= */

const library = document.getElementById("library");
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const miniCover = document.getElementById("mini-cover");
const miniTitle = document.getElementById("mini-title");
const miniArtist = document.getElementById("mini-artist");
const miniPlay = document.getElementById("mini-play");
const miniProgress = document.getElementById("mini-progress");
const volumeSlider = document.getElementById("volume");

let currentSong = 0;
let isPlaying = false;





// Set initial volume
audio.volume = 1;
volumeSlider.value = 1;
updateVolumeUI(1);

volumeSlider.addEventListener("input", () => {
  const value = volumeSlider.value;
  audio.volume = value;
  updateVolumeUI(value);
});

function updateVolumeUI(value) {
  const percent = value * 100 + "%";
  volumeSlider.style.setProperty("--volume-percent", percent);
}


/* ================= FADE TRANSITION ================= */

function fadeToSong(index) {
  const fadeOut = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      clearInterval(fadeOut);
      audio.pause();
      audio.volume = 0;

      loadSong(index);

      const fadeIn = setInterval(() => {
        if (audio.volume < 0.95) {
          audio.volume += 0.05;
        } else {
          clearInterval(fadeIn);
          audio.volume = 1;
        }
      }, 40);
    }
  }, 40);
}

/* ================= LIBRARY ================= */

songs.forEach((song, index) => {
const div = document.createElement("div");
div.classList.add("song");

div.innerHTML = `
  ${song.title}
  <div class="song-progress-click"></div>
`;

  

  library.appendChild(div);
});


library.addEventListener("click", (e) => {

  const songElement = e.target.closest(".song");
  if (!songElement) return;

  const index = [...document.querySelectorAll(".song")].indexOf(songElement);

  /* ================= SEEK CLICK ================= */
  if (e.target.classList.contains("song-progress-click")) {

    // Only allow seeking on active song
    if (!songElement.classList.contains("active")) return;

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    const percent = clickX / width;

    audio.currentTime = percent * audio.duration;
    return;
  }

  /* ================= NORMAL SONG CLICK ================= */

  if (index !== currentSong) {
    fadeToSong(index);
  }

});

/* ================= PLAYER ================= */

function loadSong(index) {
  currentSong = index;
  audio.src = songs[index].file;

  cover.src = songs[index].cover;
  title.innerText = songs[index].title;

  miniCover.src = songs[index].cover;
  miniTitle.innerText = songs[index].title;
  miniArtist.innerText = "COTIFY";

  setActiveSong(index);
  playSong();
}

function playSong() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  audio.play();
  isPlaying = true;

  playBtn.innerText = "⏸";
  miniPlay.innerText = "⏸";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;

  playBtn.innerText = "▶";
  miniPlay.innerText = "▶";
}

miniPlay.onclick = () => isPlaying ? pauseSong() : playSong();
playBtn.onclick = () => isPlaying ? pauseSong() : playSong();

prevBtn.onclick = () => fadeToSong((currentSong - 1 + songs.length) % songs.length);
nextBtn.onclick = () => fadeToSong((currentSong + 1) % songs.length);

/* Auto Next */

audio.addEventListener("ended", () => {
  miniProgress.style.width = "0%";
  fadeToSong((currentSong + 1) % songs.length);
});

/* ================= ACTIVE SONG ================= */

function setActiveSong(index) {
  const allSongs = document.querySelectorAll(".song");

  allSongs.forEach(song => {
    song.classList.remove("active");
    song.style.setProperty("--progress", "0%");
  });

  const active = allSongs[index];
  active.classList.add("active");

  active.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

/* ================= PROGRESS ================= */

audio.addEventListener("timeupdate", () => {
  const activeSong = document.querySelector(".song.active");
  if (!activeSong || !audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;

  activeSong.style.setProperty("--progress", percent + "%");
  miniProgress.style.width = percent + "%";
});

/* ================= KEYBOARD ================= */

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    isPlaying ? pauseSong() : playSong();
  }

  if (e.code === "ArrowRight") nextBtn.click();
  if (e.code === "ArrowLeft") prevBtn.click();
});

/* ================= BAR SPECTRUM (DESKTOP ONLY) ================= */

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 128;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

function drawBars() {

  requestAnimationFrame(drawBars);

  if (window.innerWidth <= 900) return; // disable on mobile

  analyser.getByteFrequencyData(dataArray);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const barWidth = canvas.width / bufferLength * 1.2;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {

    const barHeight = dataArray[i] * 0.5;

    ctx.fillStyle = "rgba(143,132,255,0.85)";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgba(108,99,255,0.6)";

    ctx.fillRect(
      x,
      canvas.height - barHeight,
      barWidth,
      barHeight
    );

    x += barWidth + 2;
  }
}

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

drawBars();



miniProgress.parentElement.addEventListener("click", (e) => {

  const rect = miniProgress.parentElement.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const width = rect.width;

  const percent = clickX / width;

  audio.currentTime = percent * audio.duration;

});

volumeSlider.addEventListener("input", () => {
  audio.volume = volumeSlider.value;
});

/* ================= FLOATING PARTICLES ================= */

const particleCanvas = document.getElementById("particles");
const pCtx = particleCanvas.getContext("2d");

particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

const particles = [];

for (let i = 0; i < 40; i++) {
  particles.push({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    radius: Math.random() * 2 + 1,
    speed: Math.random() * 0.5 + 0.2
  });
}

function animateParticles() {
  requestAnimationFrame(animateParticles);

  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

  pCtx.fillStyle = "rgba(143,132,255,0.15)";

  particles.forEach(p => {
    p.y -= p.speed;

    if (p.y < 0) {
      p.y = particleCanvas.height;
      p.x = Math.random() * particleCanvas.width;
    }

    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    pCtx.fill();
  });
}

animateParticles();

/* ================= SWIPE (MOBILE) ================= */

let touchStartX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {

  const touchEndX = e.changedTouches[0].screenX;
  const diff = touchEndX - touchStartX;

  if (Math.abs(diff) < 50) return; // ignore small swipes

  if (window.innerWidth <= 900) {
    if (diff < 0) {
      nextBtn.click(); // swipe left → next
    } else {
      prevBtn.click(); // swipe right → previous
    }
  }

});