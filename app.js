// app.js — Music Player App (frontend only)
// Sample tracks (public sample mp3s). Replace with your own URLs or local files if needed.
const tracks = [
  { id:1, title:'SoundHelix Song 1', artist:'Audio Lab', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', art:'https://picsum.photos/seed/1/300/300' },
  { id:2, title:'SoundHelix Song 2', artist:'Audio Lab', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', art:'https://picsum.photos/seed/2/300/300' },
  { id:3, title:'SoundHelix Song 3', artist:'Audio Lab', src:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', art:'https://picsum.photos/seed/3/300/300' }
];

const $ = s => document.querySelector(s);
const trackListEl = $('#trackList');
const audio = $('#audio');
const playBtn = $('#playBtn');
const prevBtn = $('#prevBtn');
const nextBtn = $('#nextBtn');
const shuffleBtn = $('#shuffleBtn');
const repeatBtn = $('#repeatBtn');
const seekBar = $('#seekBar');
const curTime = $('#curTime');
const durTime = $('#durTime');
const vol = $('#vol');
const trackTitle = $('#trackTitle');
const trackArtist = $('#trackArtist');
const artwork = $('#artwork');
const addToPlaylist = $('#addToPlaylist');
const toggleLike = $('#toggleLike');
const search = $('#search');
const playlistsView = $('#playlistView');
const playlistsEl = $('#playlists');
const createPl = $('#createPl');
const plName = $('#plName');

let idx = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0 none, 1 repeat all, 2 repeat one
let watchlist = JSON.parse(localStorage.getItem('gp_likes')||'[]');
let playlists = JSON.parse(localStorage.getItem('gp_playlists')||'{}');

function formatTime(sec){ if(!sec) return '0:00'; const m = Math.floor(sec/60); const s = Math.floor(sec%60).toString().padStart(2,'0'); return `${m}:${s}`; }

function loadTrack(i){ idx = i; const t = tracks[i]; audio.src = t.src; trackTitle.textContent = t.title; trackArtist.textContent = t.artist; artwork.style.backgroundImage = `url(${t.art})`; updateNow(); }

function updateNow(){ $('#nowTitle').textContent = tracks[idx].title; toggleLike.textContent = watchlist.includes(tracks[idx].id)?'♥ Liked':'♡ Like'; }

function renderList(filter=''){ trackListEl.innerHTML = tracks.filter(t=> (t.title+t.artist).toLowerCase().includes(filter.toLowerCase())).map((t,i)=>`
  <div class="track-item" data-index="${i}">
    <img src="${t.art}" alt="${t.title}"/>
    <div class="track-meta"><div class="track-title">${t.title}</div><div class="track-sub">${t.artist}</div></div>
  </div>`).join(''); 
  document.querySelectorAll('.track-item').forEach(el=> el.addEventListener('click', ()=>{ loadTrack(Number(el.dataset.index)); play(); }));
}

function play(){ audio.play(); isPlaying=true; playBtn.textContent='⏸'; }
function pause(){ audio.pause(); isPlaying=false; playBtn.textContent='▶️'; }
playBtn.addEventListener('click', ()=> isPlaying? pause(): play());
prevBtn.addEventListener('click', ()=>{ if(audio.currentTime>5) audio.currentTime=0; else { idx = (idx-1+tracks.length)%tracks.length; loadTrack(idx); play(); } });
nextBtn.addEventListener('click', ()=> nextTrack());

function nextTrack(){ if(isShuffle) idx = Math.floor(Math.random()*tracks.length); else idx = (idx+1)%tracks.length; loadTrack(idx); play(); }

shuffleBtn.addEventListener('click', ()=>{ isShuffle = !isShuffle; shuffleBtn.style.color = isShuffle? 'var(--accent)': ''; });
repeatBtn.addEventListener('click', ()=>{ repeatMode = (repeatMode+1)%3; repeatBtn.style.color = repeatMode? 'var(--accent)':''; });

audio.addEventListener('timeupdate', ()=>{ seekBar.max = audio.duration || 0; seekBar.value = audio.currentTime; curTime.textContent = formatTime(audio.currentTime); durTime.textContent = formatTime(audio.duration); });
seekBar.addEventListener('input', ()=> audio.currentTime = seekBar.value);
vol.addEventListener('input', ()=> audio.volume = vol.value);

audio.addEventListener('ended', ()=>{
  if(repeatMode===2){ audio.currentTime=0; play(); }
  else if(repeatMode===1){ nextTrack(); }
  else if(isShuffle){ nextTrack(); }
  else if(idx < tracks.length-1){ nextTrack(); }
  else { pause(); }
});

addToPlaylist.addEventListener('click', ()=>{
  const name = prompt('Add to playlist (type playlist name):');
  if(!name) return;
  playlists[name] = playlists[name]||[];
  if(!playlists[name].includes(tracks[idx].id)) playlists[name].push(tracks[idx].id);
  localStorage.setItem('gp_playlists', JSON.stringify(playlists));
  alert('Added to ' + name);
});

toggleLike.addEventListener('click', ()=>{
  const id = tracks[idx].id;
  if(watchlist.includes(id)){ watchlist = watchlist.filter(x=>x!==id); } else { watchlist.push(id); }
  localStorage.setItem('gp_likes', JSON.stringify(watchlist));
  updateNow();
});

search.addEventListener('input', ()=> renderList(search.value));

createPl.addEventListener('click', ()=>{
  const name = plName.value.trim(); if(!name) return alert('Enter name'); playlists[name]=[]; localStorage.setItem('gp_playlists', JSON.stringify(playlists)); plName.value=''; renderPlaylists();
});

function renderPlaylists(){ playlistsEl.innerHTML = Object.keys(playlists).map(name=>`
  <div class="card" style="margin-bottom:8px">
    <strong>${name}</strong> (${playlists[name].length}) <button class="page-btn view" data-name="${name}">View</button> <button class="page-btn del" data-name="${name}">Delete</button>
  </div>`).join('');
  playlistsEl.querySelectorAll('.view').forEach(b=> b.addEventListener('click', ()=> viewPlaylist(b.dataset.name)));
  playlistsEl.querySelectorAll('.del').forEach(b=> b.addEventListener('click', ()=>{ delete playlists[b.dataset.name]; localStorage.setItem('gp_playlists', JSON.stringify(playlists)); renderPlaylists(); }));
}

function viewPlaylist(name){ const ids = playlists[name]; if(!ids||ids.length===0){ alert('Empty'); return; } const list = ids.map(id=> tracks.find(t=>t.id==id)); gridFromList(list); }

function gridFromList(list){ trackListEl.innerHTML = list.map((t,i)=>`
  <div class="track-item" data-index="${tracks.indexOf(t)}">
    <img src="${t.art}" alt="${t.title}"/>
    <div class="track-meta"><div class="track-title">${t.title}</div><div class="track-sub">${t.artist}</div></div>
  </div>`).join(''); document.querySelectorAll('.track-item').forEach(el=> el.addEventListener('click', ()=>{ loadTrack(Number(el.dataset.index)); play(); })); }

// init
renderList('');
loadTrack(0);
audio.volume = vol.value;
renderPlaylists();
